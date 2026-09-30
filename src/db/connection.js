import { config } from "dotenv"; // Load environment variables from .env file
import knex from "knex";

config();// Load environment variables from .env file

// Instância única do Knex, usada por toda a aplicação (queries.js importa
// esse "pg" e chama pg("produtos"), pg.raw(...) etc). Por baixo o Knex
// mantém um pool de conexões — não abre uma conexão nova a cada query.
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
