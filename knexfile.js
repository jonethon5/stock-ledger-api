import { config } from "dotenv";
config();

export default {
  development: {
    client: "pg",
    connection: {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
    },
    migrations: {
      directory: "./src/db/migrations",
    },
  },
};
