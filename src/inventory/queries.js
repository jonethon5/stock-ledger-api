import pg from "../db/connection.js";

// Camada que fala com o banco (query builder do Knex). Não tem regra de
// negócio aqui — quem decide SE pode debitar estoque é o service.js, que
// ainda vai chamar essas funções.

export async function criarProduto(dados) {
  // .returning("*") pede de volta a linha inteira já com o "id" gerado pelo
  // banco — sem isso, o insert não devolveria o registro criado.
  const resultado = await pg("produtos").insert(dados).returning("*");
  return resultado;
}

export async function buscarProdutoPorId(id) {
  // .first() pega só a primeira linha do resultado (ou undefined), em vez
  // de devolver um array — combina com "id", que é único.
  const resultado = await pg("produtos").where("id", id).first();
  return resultado;
}

export async function atualizarQuantidadeEstoque(id, novaQuantidade) {
  // Atenção: este UPDATE lê o "novaQuantidade" já calculado por fora e só
  // grava. Ele não é atômico com uma leitura anterior — se duas chamadas
  // caírem aqui ao mesmo tempo, a segunda pode sobrescrever a primeira
  // (race condition). É exatamente o problema que o teste de concorrência
  // do plano precisa expor antes da correção com transação + FOR UPDATE.
  const resultado = await pg("produtos")
    .where("id", id)
    .update("quantidade_estoque", novaQuantidade)
    .returning("*");
  return resultado;
}

export async function criarMovimentacao(dados) {
  // Só insert: esta tabela é append-only, então não existe (e não deveria
  // existir) um "atualizarMovimentacao" aqui.
  const movimentacoes = await pg("movimentacoes_estoque")
    .insert(dados)
    .returning("*");
  return movimentacoes;
}
