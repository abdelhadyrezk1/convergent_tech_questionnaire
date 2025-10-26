import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Questionnaire submissions table
 * Stores general information about each data center assessment
 */
export const questionnaires = mysqlTable("questionnaires", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  dataCenterName: varchar("dataCenterName", { length: 255 }).notNull(),
  location: mysqlEnum("location", ["الرياض", "جدة", "الخبر", "أخرى في KSA"]).notNull(),
  address: text("address"),
  contactName: varchar("contactName", { length: 255 }),
  contactPhone: varchar("contactPhone", { length: 20 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  dataCenterStartDate: int("dataCenterStartDate"), // Year (e.g., 2012)
  visitDate: timestamp("visitDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Questionnaire = typeof questionnaires.$inferSelect;
export type InsertQuestionnaire = typeof questionnaires.$inferInsert;

/**
 * DCIM Assessment table
 * Stores information about Data Center Infrastructure Management systems
 */
export const dcimAssessments = mysqlTable("dcimAssessments", {
  id: int("id").autoincrement().primaryKey(),
  questionnaireId: int("questionnaireId").notNull().references(() => questionnaires.id),
  hasDCIM: mysqlEnum("hasDCIM", ["نعم", "لا"]).notNull(),
  dcimSystemName: varchar("dcimSystemName", { length: 255 }),
  dcimFeatures: text("dcimFeatures"), // JSON array of features
  currentChallenges: text("currentChallenges"),
  needsDCIM: mysqlEnum("needsDCIM", ["نعم", "لا", "غير متأكد"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DCIMAssessment = typeof dcimAssessments.$inferSelect;
export type InsertDCIMAssessment = typeof dcimAssessments.$inferInsert;

/**
 * Asset Inventory table
 * Stores information about infrastructure assets (UPS, Cooling, Racks, PDUs, etc.)
 */
export const assets = mysqlTable("assets", {
  id: int("id").autoincrement().primaryKey(),
  questionnaireId: int("questionnaireId").notNull().references(() => questionnaires.id),
  productType: mysqlEnum("productType", [
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
  ]).notNull(),
  contractor: varchar("contractor", { length: 255 }),
  manufacturer: varchar("manufacturer", { length: 255 }),
  model: varchar("model", { length: 255 }),
  technology: varchar("technology", { length: 255 }),
  topology: mysqlEnum("topology", [
    "Standalone",
    "N+1",
    "N+2",
    "2N",
    "Redundant (N+x)",
    "أخرى",
  ]),
  manufacturingDate: varchar("manufacturingDate", { length: 10 }), // YYYY-MM-DD
  startupDate: varchar("startupDate", { length: 10 }), // YYYY-MM-DD
  capacity: varchar("capacity", { length: 100 }),
  unitCount: int("unitCount"),
  status: mysqlEnum("status", [
    "Active",
    "Standby",
    "Shutdown",
    "Malfunction",
    "Needs Maintenance",
    "EOL",
  ]).notNull(),
  specificData: text("specificData"), // JSON for product-specific fields
  maintenanceNotes: text("maintenanceNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = typeof assets.$inferInsert;

/**
 * Sales Opportunities table
 * Stores identified sales opportunities for spare parts, services, and upgrades
 */
export const salesOpportunities = mysqlTable("salesOpportunities", {
  id: int("id").autoincrement().primaryKey(),
  questionnaireId: int("questionnaireId").notNull().references(() => questionnaires.id),
  assetId: int("assetId").references(() => assets.id),
  opportunityType: mysqlEnum("opportunityType", [
    "Spare Parts Offer",
    "Maintenance Contract",
    "UPS Upgrade",
    "Cooling Modernization",
    "EcoStruxure IT (DCIM)",
    "Racks/Containment Expansion",
    "Electrical System Upgrade",
    "Fire/Security System Upgrade",
    "Other",
  ]).notNull(),
  description: text("description"),
  priority: mysqlEnum("priority", ["High", "Medium", "Low"]).default("Medium"),
  estimatedValue: int("estimatedValue"), // In currency units
  followUpDate: timestamp("followUpDate"),
  status: mysqlEnum("status", ["Open", "In Progress", "Won", "Lost"]).default("Open"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SalesOpportunity = typeof salesOpportunities.$inferSelect;
export type InsertSalesOpportunity = typeof salesOpportunities.$inferInsert;

/**
 * Report Summary table
 * Stores generated reports for each questionnaire
 */
export const reportSummaries = mysqlTable("reportSummaries", {
  id: int("id").autoincrement().primaryKey(),
  questionnaireId: int("questionnaireId").notNull().references(() => questionnaires.id),
  reportContent: text("reportContent"), // HTML or Markdown content
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  exportedAt: timestamp("exportedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReportSummary = typeof reportSummaries.$inferSelect;
export type InsertReportSummary = typeof reportSummaries.$inferInsert;