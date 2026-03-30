import { pgTable, text } from "drizzle-orm/pg-core";
import { ulidPk } from "../core/schema-columns";

export const testSchema = pgTable("test", {
  id: ulidPk(),
  name: text("name").notNull(),
});
