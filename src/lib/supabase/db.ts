import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import * as schema from "../../../migrations/schema";
dotenv.config({ path: ".env" });
import { migrate } from "drizzle-orm/postgres-js/migrator";

const connectionString = process.env.DATABASE_URL as string;

if (!connectionString) {
  console.log("❌ no database URL");
}

console.log(connectionString);

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema });
// Keep Schema updated with the database by migrating
const migrateDb = async () => {
  try {
    console.log("🟠 Migrating client");
    // await migrate(db, { migrationsFolder: "migrations" });
    console.log("🟢 Successfully Migrated");
  } catch (error) {
    console.log("🔴 Error Migrating client");
    console.log(error);
  }
};
migrateDb();

export default db;
