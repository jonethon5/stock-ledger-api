// Tabela append-only: aqui fica o histórico de estoque. Nenhuma linha desta
// tabela deve ser alterada ou apagada depois de criada — só entram novas
// movimentações (entrada/saída), nunca um UPDATE numa movimentação antiga.
export function up(knex) {
  return knex.schema.createTable("movimentacoes_estoque", function (table) {
    table.increments("id");
    // FK para produtos: garante que não existe movimentação apontando para
    // um produto que não existe.
    table.integer("produto_id").references("id").inTable("produtos");
    // enum trava os valores possíveis no próprio banco — não depende do
    // código da aplicação validar certo.
    table.enum("tipo", ["entrada", "saida"]);
    table.enum("motivo", ["compra", "venda", "devolucao", "ajuste"]);
    table.integer("quantidade");
    // preenchido pelo próprio Postgres (knex.fn.now()), não pelo relógio da
    // aplicação — evita divergência se o app e o banco estiverem em fusos
    // ou horários diferentes.
    table.timestamp("criado_em").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable("movimentacoes_estoque");
}