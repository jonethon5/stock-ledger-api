export function up(knex) {
  return knex.schema.createTable("movimentacoes_estoque", function (table) {
    table.increments("id");
    table.integer("produto_id").references("id").inTable("produtos");
    table.enum("tipo", ["entrada", "saida"]);
    table.enum("motivo", ["compra", "venda", "devolucao", "ajuste"]);
    table.integer("quantidade");
    table.timestamp("criado_em").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable("movimentacoes_estoque");
}