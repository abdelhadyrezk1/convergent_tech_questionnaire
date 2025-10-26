import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { createQuestionnaire, addAsset, addSalesOpportunity, getQuestionnaireWithDetails, getUserQuestionnaires, getAllQuestionnaires, getDb } from "./db";
import { questionnaires, dcimAssessments, assets, salesOpportunities } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  questionnaire: router({
    create: protectedProcedure
      .input(
        z.object({
          engineerName: z.string().min(1),
          clientName: z.string().min(1),
          dataCenterName: z.string().min(1),
          location: z.enum(["الرياض", "جدة", "الخبر", "أخرى في KSA"]),
          address: z.string().optional(),
          contactName: z.string().optional(),
          contactJobTitle: z.string().optional(),
          contactPhone: z.string().optional(),
          contactEmail: z.string().email().optional(),
          dataCenterStartDate: z.number().optional(),
          visitDate: z.date(),
          dcimHas: z.enum(["نعم", "لا"]),
          dcimSystemName: z.string().optional(),
          dcimFeatures: z.array(z.string()).optional(),
          dcimNeeds: z.enum(["نعم", "لا", "غير متأكد"]),
          currentChallenges: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const newQuestionnaireId = await createQuestionnaire(
          ctx.user.id,
          {
            userId: ctx.user.id,
            engineerName: input.engineerName,
            clientName: input.clientName,
            dataCenterName: input.dataCenterName,
            location: input.location,
            address: input.address,
            contactName: input.contactName,
            contactJobTitle: input.contactJobTitle,
            contactPhone: input.contactPhone,
            contactEmail: input.contactEmail,
            dataCenterStartDate: input.dataCenterStartDate,
            visitDate: input.visitDate,
          },
          {
            questionnaireId: 0,
            hasDCIM: input.dcimHas,
            dcimSystemName: input.dcimSystemName,
            dcimFeatures: input.dcimFeatures ? JSON.stringify(input.dcimFeatures) : null,
            currentChallenges: input.currentChallenges,
            needsDCIM: input.dcimNeeds,
          }
        );
        return { id: newQuestionnaireId };
      }),

    getDetails: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getQuestionnaireWithDetails(input.id);
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserQuestionnaires(ctx.user.id);
    }),

    listAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return getAllQuestionnaires();
    }),
  }),

  asset: router({
    add: protectedProcedure
      .input(
        z.object({
          questionnaireId: z.number(),
          productType: z.enum([
            "UPS",
            "Precision Cooling",
            "Racks",
            "PDUs",
            "Busway",
            "Aisle Containments",
            "Surveillance",
            "Access Control",
            "Fire Alarm",
            "Fire Fighting",
            "Electrical (LV Panels)",
            "Diesel Generators",
          ]),
          contractor: z.string().optional(),
          manufacturer: z.string().optional(),
          model: z.string().optional(),
          technology: z.string().optional(),
          topology: z.enum(["Standalone", "N+1", "N+2", "2N", "Redundant (N+x)"]).optional(),
          manufacturingDate: z.string().optional(),
          startupDate: z.string().optional(),
          capacity: z.string().optional(),
          unitCount: z.number().optional(),
          status: z.enum(["Active", "Standby", "Shutdown", "Malfunction", "Needs Maintenance", "EOL"]),
          maintenanceNotes: z.string().optional(),
          specificData: z.record(z.string(), z.any()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const assetId = await addAsset({
          questionnaireId: input.questionnaireId,
          productType: input.productType,
          contractor: input.contractor,
          manufacturer: input.manufacturer,
          model: input.model,
          technology: input.technology,
          topology: input.topology,
          manufacturingDate: input.manufacturingDate,
          startupDate: input.startupDate,
          capacity: input.capacity,
          unitCount: input.unitCount,
          status: input.status,
          specificData: input.specificData ? JSON.stringify(input.specificData) : null,
          maintenanceNotes: input.maintenanceNotes,
        });
        return { id: assetId };
      }),
  }),

  opportunity: router({
    add: protectedProcedure
      .input(
        z.object({
          questionnaireId: z.number(),
          assetId: z.number().optional(),
          opportunityType: z.enum([
            "Spare Parts Offer",
            "Maintenance Contract",
            "UPS Upgrade",
            "Cooling Modernization",
            "EcoStruxure IT (DCIM)",
            "Racks/Containment Expansion",
            "Electrical System Upgrade",
            "Fire/Security System Upgrade",
            "Other",
          ]),
          description: z.string().optional(),
          priority: z.enum(["High", "Medium", "Low"]).optional(),
          estimatedValue: z.number().optional(),
          followUpDate: z.date().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const opportunityId = await addSalesOpportunity({
          questionnaireId: input.questionnaireId,
          assetId: input.assetId,
          opportunityType: input.opportunityType,
          description: input.description,
          priority: input.priority || "Medium",
          estimatedValue: input.estimatedValue,
          followUpDate: input.followUpDate,
          status: "Open",
        });
        return { id: opportunityId };
      }),
    }),

    report: router({
      generate: publicProcedure
        .input(z.object({ questionnaireId: z.number() }))
        .query(async ({ input }) => {
          const db = await getDb();
          if (!db) throw new Error("Database not available");

          const questionnaire = await db.select().from(questionnaires).where(eq(questionnaires.id, input.questionnaireId)).limit(1);
          const dcim = await db.select().from(dcimAssessments).where(eq(dcimAssessments.questionnaireId, input.questionnaireId));
          const assetsList = await db.select().from(assets).where(eq(assets.questionnaireId, input.questionnaireId));
          const opportunities = await db.select().from(salesOpportunities).where(eq(salesOpportunities.questionnaireId, input.questionnaireId));

          return {
            questionnaire: questionnaire[0] || null,
            dcim: dcim[0] || null,
            assets: assetsList,
            opportunities: opportunities,
          };
        }),
    }),
  });

export type AppRouter = typeof appRouter;
