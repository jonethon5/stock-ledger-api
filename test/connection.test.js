import pg from "../src/db/connection.js";

test("conexão com o banco de dados", () => {
  return pg.raw("SELECT 1+1 AS result").then((result) => {
    expect(result.rows[0].result).toBe(2);
  });
});
