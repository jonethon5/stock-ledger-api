import {
  buscarProdutoPorId,
  criarProduto,
  atualizarQuantidadeEstoque,
  criarMovimentacao,
} from "./queries.js";

import pg from "../db/connection.js";

// Aqui mora a regra de negócio do débito de estoque: busca o produto,
// confere se tem saldo suficiente, atualiza a quantidade e registra a
// movimentação no histórico.
//
// Versão com transação + lock: pg.transaction abre uma transação e passa
// "trx" para as três queries (buscar, atualizar, criar movimentação) — ou
// as três acontecem juntas, ou nenhuma acontece (se der erro no meio, o
// Knex desfaz tudo sozinho). O SELECT ... FOR UPDATE dentro de
// buscarProdutoPorId trava a linha do produto até essa transação terminar,
// então uma segunda chamada de debitarEstoque para o mesmo produto, ao
// mesmo tempo, fica esperando a primeira terminar antes de conseguir ler o
// saldo. É isso que resolve a race condition que a versão anterior tinha:
// as leituras não acontecem mais "ao mesmo tempo" de verdade, viram uma
// fila.
export async function debitarEstoque(produtoId, quantidade) {
  return pg.transaction(async (trx) => {
    const produto = await buscarProdutoPorId(produtoId, trx);
    if (quantidade > produto.quantidade_estoque) {
      throw new Error("estoque insuficiente");
    }
    const estoqueAtualizado = produto.quantidade_estoque - quantidade;
    await atualizarQuantidadeEstoque(produtoId, estoqueAtualizado, trx);

    const movimentacao = await criarMovimentacao(
      {
        produto_id: produto.id,
        tipo: "saida",
        motivo: "venda",
        quantidade: quantidade,
      },
      trx,
    );

    return { produto, estoqueAtualizado, movimentacao };
  });
}
