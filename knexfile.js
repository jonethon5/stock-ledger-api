import { config } from "dotenv";
// Lê o .env e coloca as variáveis em process.env antes de montar a conexão.
// Sem isso, host/user/senha chegariam como undefined.
config();

// Configuração que o Knex CLI usa nos comandos de migration (migrate:latest,
// migrate:rollback etc). Só existe "development" por enquanto.
export default {
  development: {
    client: "pg", // diz ao Knex para falar com Postgres usando o driver "pg"
    connection: {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
    },
    migrations: {
      // pasta onde o Knex cria e procura os arquivos de migration
      directory: "./src/db/migrations",
    },
  },
};
