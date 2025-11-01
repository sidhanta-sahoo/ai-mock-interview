import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

// ✅ Use the correct Vite env variable name
const connectionString = import.meta.env.VITE_DRIZZLE_DB_URL;

if (!connectionString) {
  throw new Error("❌ Missing VITE_DRIZZLE_DB_URL in .env file");
}

// ✅ Initialize Neon client
const sql = neon(connectionString);

// ✅ Create Drizzle instance with schema
export const db = drizzle(sql, { schema });
