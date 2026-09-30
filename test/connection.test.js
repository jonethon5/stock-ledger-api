import pg from "../src/db/connection.js";

// Teste de fumaça: só confirma que dá para abrir conexão com o Postgres e
// rodar um SQL cru (.raw). Se ele falhar, o problema é de ambiente
// (.env, docker compose), não de lógica.
test("conecta no banco e executa uma query SQL simples", () => {
  return pg.raw("SELECT 1+1 AS result").then((result) => {
    expect(result.rows[0].result).toBe(2);
  });
});
