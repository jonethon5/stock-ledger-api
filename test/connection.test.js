import pg from "../src/db/connection.js";

// Teste de fumaça: só confirma que a aplicação consegue abrir conexão com o
// Postgres e rodar um SQL cru (.raw), antes de testar qualquer regra real.
// Se este teste falhar, o problema é de ambiente (.env, docker compose),
// não de lógica.
test("conexão com o banco de dados", () => {
  return pg.raw("SELECT 1+1 AS result").then((result) => {
    expect(result.rows[0].result).toBe(2);
  });
});


