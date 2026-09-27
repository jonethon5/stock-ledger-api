
export function up(knex) {
  return knex.schema.createTable("produtos", function(table){
    table.increments("id");
    table.string("nome");
    table.decimal("preco",10, 2);
    table.integer("quantidade_estoque")
  })
};

export function down(knex) {
  return knex.schema.dropTable("produtos")
};