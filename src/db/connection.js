import { config } from "dotenv"; // Load environment variables from .env file
import knex from "knex";

config();// Load environment variables from .env file

const pg = knex({
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  },
});
export default pg;
