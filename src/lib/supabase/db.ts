import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../../migrations/schema";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const connectionString = process.env.DATABASE_URL as string;

if (!connectionString) {
  console.log("❌ no database URL");
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });
// Keep Schema updated with the database by migrating
const migrateDb = async () => {
  try {
    console.log("🟠 Migrating client");
    await migrate(db, { migrationsFolder: "migrations" });
    console.log("🟢 Successfully Migrated");
  } catch (error) {
    console.log("🔴 Error Migrating client");
  }
};
migrateDb();

export default db;
