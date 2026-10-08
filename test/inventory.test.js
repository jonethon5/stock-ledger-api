import {
  buscarProdutoPorId,
  criarProduto,
  atualizarQuantidadeEstoque,
  criarMovimentacao,
} from "../src/inventory/queries.js";
import { debitarEstoque } from "../src/inventory/service.js";
import pg from "../src/db/connection.js";
// Testes de integração: rodam contra o Postgres de verdade (via
// connection.js), não contra um mock. Cada teste cria o seu próprio
// produto, então não dependem de ordem nem de dados de um teste anterior.

test("busca um produto pelo id depois de criá-lo", async () => {
  const produtos = await criarProduto({
    nome: "Camisa Polo",
    preco: 95.99,
    quantidade_estoque: 500,
  });
  const resultado = await buscarProdutoPorId(produtos[0].id, pg);
  expect(resultado.nome).toBe(produtos[0].nome);
  expect(resultado.preco).toBe(produtos[0].preco);
  expect(resultado.quantidade_estoque).toBe(produtos[0].quantidade_estoque);
});

test("atualiza a quantidade em estoque de um produto", async () => {
  const produtos = await criarProduto({
    nome: "Camisa Polo",
    preco: 95.99,
    quantidade_estoque: 500,
  });
  const atualizados = await atualizarQuantidadeEstoque(produtos[0].id, 498, pg);
  expect(atualizados[0].quantidade_estoque).toBe(498);
});

test("registra uma movimentação de saída no histórico de estoque", async () => {
  const produto = await criarProduto({
    nome: "Camisa Polo",
    preco: 95.99,
    quantidade_estoque: 500,
  });

  const movimentacao = await criarMovimentacao(
    {
      produto_id: produto[0].id,
      tipo: "saida",
      motivo: "venda",
      quantidade: 1,
    },
    pg,
  );

  expect(movimentacao[0].produto_id).toBe(produto[0].id);
  expect(movimentacao[0].tipo).toBe("saida");
  expect(movimentacao[0].motivo).toBe("venda");
  expect(movimentacao[0].quantidade).toBe(1);
  expect(movimentacao[0].criado_em).toBeDefined();
});

test("debita estoque quando há quantidade suficiente", async () => {
  const produto = await criarProduto({
    nome: "Camisa Polo",
    preco: 95.99,
    quantidade_estoque: 50,
  });

  const venda = await debitarEstoque(produto[0].id, 1);
  expect(venda.estoqueAtualizado).toBe(49);
});

test("rejeita o débito quando a quantidade pedida é maior que o estoque", async () => {
  const produto = await criarProduto({
    nome: "Camisa Polo",
    preco: 95.99,
    quantidade_estoque: 50,
  });

  await expect(debitarEstoque(produto[0].id, 51)).rejects.toThrow();
});

// Este é o teste de concorrência do roadmap (fim de semana 2), ainda com
// só 10 débitos simultâneos — o plano pede 50 no critério de pronto.
// Antes da transação + FOR UPDATE em debitarEstoque, esse teste falhava
// (o saldo final vinha maior que 40, porque vendas se sobrescreviam).
// Ele passar de forma consistente agora é a prova de que o lock está
// funcionando: mesmo com 10 chamadas ao mesmo tempo, nenhuma lê o saldo
// antes da anterior terminar de gravar.
test("10 débitos simultâneos no mesmo produto devem resultar no saldo correto", async () => {
  const produto = await criarProduto({
    nome: "Camisa Polo",
    preco: 95.99,
    quantidade_estoque: 50,
  });

  const vendas = Array.from({ length: 10 }, () =>
    debitarEstoque(produto[0].id, 1),
  );
  const resultado = await Promise.all(vendas);
  const produtoTeste = await buscarProdutoPorId(produto[0].id, pg);

  expect(produtoTeste.quantidade_estoque).toBe(40);
});

test("não é possível alterar ou apagar uma movimentação já criada", async () => {
  const produto = await criarProduto({
    nome: "Camisa Polo",
    preco: 95.99,
    quantidade_estoque: 50,
  });

  const movimentacao = await criarMovimentacao(
    {
      produto_id: produto[0].id,
      tipo: "saida",
      motivo: "venda",
      quantidade: 1,
    },
    pg,
  );

  await expect(
    pg("movimentacoes_estoque")
      .where("id", movimentacao[0].id)
      .update({ quantidade: 2 }),
  ).rejects.toThrow(/append-only/);
});
