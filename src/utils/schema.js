import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

// ✅ Table 1: MockInterview
export const MockInterview = pgTable("mockInterview", {
  id: serial("id").primaryKey(),
  mockId: varchar("mockId", { length: 255 }).notNull().unique(), // ✅ unique for reference
  jsonMockResp: text("jsonMockResp").notNull(), // ✅ stores JSON string
  jobPosition: varchar("jobPosition", { length: 255 }).notNull(),
  jobDesc: text("jobDesc").notNull(),
  jobExperience: varchar("jobExperience", { length: 50 }).notNull(),
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ✅ Table 2: UserAnswer
export const UserAnswer = pgTable("userAnswer", {
  id: serial("id").primaryKey(),
  mockIdRef: varchar("mockIdRef", { length: 255 }).notNull(), // ✅ foreign key reference to mockInterview.mockId
  question: text("question").notNull(),
  correctAns: text("correctAns"),
  userAns: text("userAns"),
  feedback: text("feedback"),
  rating: varchar("rating", { length: 10 }),
  userEmail: varchar("userEmail", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
