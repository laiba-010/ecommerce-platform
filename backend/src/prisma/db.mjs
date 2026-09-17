import postgres from "@prisma/orm-postgres/runtime";
import contractJson from "./contract.json" with { type: "json" };
import dotenv from "dotenv";

dotenv.config();

export const db = postgres({
  contractJson,
  url: process.env.DATABASE_URL,
});