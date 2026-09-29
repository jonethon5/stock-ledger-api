import {
  buscarProdutoPorId,
  criarProduto,
  atualizarQuantidadeEstoque,
  criarMovimentacao,
} from "./queries.js";

export async function debitarEstoque(produtoId, quantidade) {
  const produto = await buscarProdutoPorId(produtoId);
  if (quantidade > produto.quantidade_estoque) {
    throw new Error("estoque insuficiente");
  }
  const estoqueAtualizado = produto.quantidade_estoque - quantidade;
  await atualizarQuantidadeEstoque(produtoId, estoqueAtualizado);

  const movimentacao = await criarMovimentacao({
    produto_id: produto.id,
    tipo: "saida",
    motivo: "venda",
    quantidade: quantidade,
  });

  return { produto, estoqueAtualizado, movimentacao };
}
