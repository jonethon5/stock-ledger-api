
// Migration = schema versionado no código, não criado à mão no banco.
// "up" cria a tabela; "down" desfaz — é o que roda no `knex migrate:rollback`.
export function up(knex) {
  return knex.schema.createTable("produtos", function(table){
    table.increments("id"); // chave primária auto-incremento (serial)
    table.string("nome");
    // decimal(10, 2): 10 dígitos no total, 2 depois da vírgula.
    // float/double não servem para dinheiro (erro de arredondamento);
    // decimal guarda o valor exato.
    table.decimal("preco",10, 2);
    table.integer("quantidade_estoque")
  })
};

export function down(knex) {
  return knex.schema.dropTable("produtos")
};