
// Migration = schema versionado no código, não criado à mão no banco.
// "up" cria a tabela; "down" desfaz (roda no knex migrate:rollback).
export function up(knex) {
  return knex.schema.createTable("produtos", function(table){
    table.increments("id"); // chave primária, auto-incremento
    table.string("nome");
    // decimal(10, 2): 10 dígitos no total, 2 depois da vírgula.
    // Para dinheiro isso é melhor que float, que pode perder precisão.
    table.decimal("preco",10, 2);
    table.integer("quantidade_estoque")
  })
};

export function down(knex) {
  return knex.schema.dropTable("produtos")
};