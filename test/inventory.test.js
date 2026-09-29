import {
  buscarProdutoPorId,
  criarProduto,
  atualizarQuantidadeEstoque,
  criarMovimentacao,
} from "../src/inventory/queries.js";

// Estes testes rodam contra o Postgres de verdade (via connection.js), não
// contra um mock — por isso dependem do container do banco estar de pé.
// Cada teste cria o seu próprio produto, então não dependem de ordem nem de
// dados deixados por um teste anterior.

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

test("Teste para inserir uma nova movimentação em movimentacoes_estoque", async () => {
  const produto = await criarProduto({
    nome: "Camisa Polo",
    preco: 95.99,
    quantidade_estoque: 500,
  });

  const movimentacao = await criarMovimentacao({
    produto_id: produto[0].id,
    tipo: "saida",
    motivo: "venda",
    quantidade: 1,
  });

  expect(movimentacao[0].produto_id).toBe(produto[0].id)
  expect(movimentacao[0].tipo).toBe("saida")
  expect(movimentacao[0].motivo).toBe("venda")
  expect(movimentacao[0].quantidade).toBe(1)
  expect(movimentacao[0].criado_em).toBeDefined();

});
