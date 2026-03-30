import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../schemas";

export const createDbClient = (connectionString: string) => {
  return drizzle(connectionString, { schema });
};
