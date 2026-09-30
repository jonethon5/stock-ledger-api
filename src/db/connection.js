import { config } from "dotenv"; // Load environment variables from .env file
import knex from "knex";

config();// Load environment variables from .env file

// Instância única do Knex, compartilhada por toda a aplicação (queries.js
// importa esse "pg" e usa como query builder: pg("produtos"), pg.raw(...) etc).
// Por baixo, o Knex mantém um pool de conexões com o Postgres — não é uma
// conexão nova a cada query.
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
