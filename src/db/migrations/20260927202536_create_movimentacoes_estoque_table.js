// Tabela append-only: é o histórico de estoque. Depois de criada, uma linha
// aqui nunca é alterada nem apagada — só entram novas movimentações.
export function up(knex) {
  return knex.schema.createTable("movimentacoes_estoque", function (table) {
    table.increments("id");
    // FK para produtos: impede movimentação apontando para um produto
    // que não existe.
    table.integer("produto_id").references("id").inTable("produtos");
    // enum trava os valores possíveis já no banco, e não só no código da app
    table.enum("tipo", ["entrada", "saida"]);
    table.enum("motivo", ["compra", "venda", "devolucao", "ajuste"]);
    table.integer("quantidade");
    // preenchido pelo próprio Postgres, não pelo relógio da aplicação
    table.timestamp("criado_em").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable("movimentacoes_estoque");
}