import { config } from "dotenv";
// Lê o .env e injeta as variáveis em process.env antes do Knex montar a conexão.
// Sem isso, host/user/senha viriam undefined.
config();

// Config lida pelo Knex CLI (migrate, seed) e pela conexão da aplicação.
// Só existe o ambiente "development" por enquanto; produção/teste podem ganhar
// blocos próprios depois, se precisar de outro banco.
export default {
  development: {
    client: "pg", // driver: usa o pacote "pg" para falar com o Postgres
    connection: {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
    },
    migrations: {
      // onde o Knex procura e cria os arquivos de migration
      directory: "./src/db/migrations",
    },
  },
};
