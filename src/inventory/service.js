import {
  buscarProdutoPorId,
  criarProduto,
  atualizarQuantidadeEstoque,
  criarMovimentacao,
} from "./queries.js";

// Aqui mora a regra de negócio do débito de estoque: busca o produto,
// confere se tem saldo suficiente, atualiza a quantidade e registra a
// movimentação no histórico.
//
// Versão "ingênua" (sem concorrência): busca e grava são duas operações
// separadas, sem transação e sem lock no banco. Se duas vendas chamarem
// debitarEstoque para o mesmo produto ao mesmo tempo, as duas podem ler o
// mesmo produto.quantidade_estoque antes de qualquer uma escrever — e a
// segunda escrita sobrescreve a primeira, ignorando o débito dela. É essa
// falha que o teste de concorrência do roadmap (fim de semana 2) precisa
// provar, antes de entrar transação + SELECT ... FOR UPDATE.
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
