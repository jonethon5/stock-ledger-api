import {
  buscarProdutoPorId,
  criarProduto,
  atualizarQuantidadeEstoque,
} from "../src/inventory/queries.js";

test("Teste de busca de produos", async () => {
  const produtos = await criarProduto({
    nome: "Camisa Polo",
    preco: 95.99,
    quantidade_estoque: 500,
  });
  const resultado = await buscarProdutoPorId(produtos[0].id);
  expect(resultado.nome).toBe(produtos[0].nome);
  expect(resultado.preco).toBe(produtos[0].preco);
  expect(resultado.quantidade_estoque).toBe(produtos[0].quantidade_estoque);
});


test("Teste de atualizar quantidade de estoque", async () => {
  const produtos = await criarProduto({
    nome: "Camisa Polo",
    preco: 95.99,
    quantidade_estoque: 500,
  });
  const atualizados = await atualizarQuantidadeEstoque(produtos[0].id, 498);
  expect(atualizados[0].quantidade_estoque).toBe(498);
});
