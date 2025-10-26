import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, questionnaires, InsertQuestionnaire, dcimAssessments, InsertDCIMAssessment, assets, InsertAsset, salesOpportunities, InsertSalesOpportunity } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get questionnaire with all related data
 */
export async function getQuestionnaireWithDetails(questionnaireId: number) {
  const db = await getDb();
  if (!db) return null;

  const questionnaire = await db
    .select()
    .from(questionnaires)
    .where(eq(questionnaires.id, questionnaireId))
    .limit(1);

  if (!questionnaire.length) return null;

  const dcimData = await db
    .select()
    .from(dcimAssessments)
    .where(eq(dcimAssessments.questionnaireId, questionnaireId));

  const assetData = await db
    .select()
    .from(assets)
    .where(eq(assets.questionnaireId, questionnaireId));

  const opportunitiesData = await db
    .select()
    .from(salesOpportunities)
    .where(eq(salesOpportunities.questionnaireId, questionnaireId));

  return {
    questionnaire: questionnaire[0],
    dcim: dcimData[0] || null,
    assets: assetData,
    opportunities: opportunitiesData,
  };
}

/**
 * Create a new questionnaire with DCIM assessment
 */
export async function createQuestionnaire(
  userId: number,
  data: InsertQuestionnaire,
  dcimData: InsertDCIMAssessment
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Insert questionnaire
  const result = await db.insert(questionnaires).values(data);
  const questionnaireId = result[0].insertId as number;

  // Insert DCIM assessment
  await db.insert(dcimAssessments).values({
    ...dcimData,
    questionnaireId,
  });

  return questionnaireId;
}

/**
 * Add asset to questionnaire
 */
export async function addAsset(data: InsertAsset) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Clean up undefined values to null
  const cleanedData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value === undefined ? null : value,
    ])
  ) as InsertAsset;

  const result = await db.insert(assets).values(cleanedData);
  return result[0].insertId as number;
}

/**
 * Add sales opportunity
 */
export async function addSalesOpportunity(data: InsertSalesOpportunity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(salesOpportunities).values(data);
  return result[0].insertId as number;
}

/**
 * Get all questionnaires for a user
 */
export async function getUserQuestionnaires(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(questionnaires)
    .where(eq(questionnaires.userId, userId))
    .orderBy(questionnaires.createdAt);
}

/**
 * Get all questionnaires (admin)
 */
export async function getAllQuestionnaires() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(questionnaires)
    .orderBy(questionnaires.createdAt);
}
