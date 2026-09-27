import { buscarProdutoPorId, criarProduto } from "../src/inventory/queries.js";

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
