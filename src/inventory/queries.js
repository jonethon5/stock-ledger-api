import pg from "../db/connection.js";

// Camada que só fala com o banco (query builder do Knex). Não decide nada
// de regra de negócio — quem chama essas funções (service.js) é quem decide
// SE pode debitar estoque, por exemplo.

export async function criarProduto(dados) {
  // .returning("*") pede a linha inteira de volta, já com o "id" que o
  // banco gerou. Sem isso o insert não devolveria o registro criado.
  const resultado = await pg("produtos").insert(dados).returning("*");
  return resultado;
}

export async function buscarProdutoPorId(id) {
  // .first() devolve só a primeira linha (ou undefined), em vez de um
  // array — faz sentido aqui porque "id" é único.
  const resultado = await pg("produtos").where("id", id).first();
  return resultado;
}

export async function atualizarQuantidadeEstoque(id, novaQuantidade) {
  // Atenção: essa função só grava o valor que já chegou calculado por fora.
  // Ela não lê e escreve na mesma operação, então duas chamadas ao mesmo
  // tempo para o mesmo produto podem se sobrescrever (race condition).
  // É esse comportamento que o teste de concorrência do roadmap precisa
  // expor, antes de corrigir com transação + FOR UPDATE.
  const resultado = await pg("produtos")
    .where("id", id)
    .update("quantidade_estoque", novaQuantidade)
    .returning("*");
  return resultado;
}

export async function criarMovimentacao(dados) {
  // Só insert: esta tabela é append-only, não existe (e não deveria
  // existir) uma função para alterar uma movimentação já criada.
  const movimentacoes = await pg("movimentacoes_estoque")
    .insert(dados)
    .returning("*");
  return movimentacoes;
}
