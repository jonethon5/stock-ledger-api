export function up(knex) {
  return knex.raw(
    `
  CREATE FUNCTION bloqueia_edicao_movimentacao()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'movimentacoes_estoque é append-only: não é permitido alterar ou apagar uma movimentação já criada';
END;
$$ LANGUAGE plpgsql;


    CREATE TRIGGER impede_edicao_movimentacao
    BEFORE UPDATE OR DELETE ON movimentacoes_estoque
    FOR EACH ROW
    EXECUTE FUNCTION bloqueia_edicao_movimentacao();

    
  `,
  );
}

export function down(knex) {
  return knex.raw(
    `
    DROP TRIGGER impede_edicao_movimentacao ON movimentacoes_estoque;
    DROP FUNCTION bloqueia_edicao_movimentacao();
    `,
  );
}

