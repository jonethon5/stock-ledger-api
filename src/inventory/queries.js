import pg from "../db/connection.js";

// Camada que só fala com o banco (query builder do Knex). Não decide nada
// de regra de negócio — quem chama essas funções (service.js) é quem decide
// SE pode debitar estoque, por exemplo.
//
// buscarProdutoPorId, atualizarQuantidadeEstoque e criarMovimentacao recebem
// "trx" como parâmetro, em vez de usar sempre o "pg" global. Isso deixa quem
// chama escolher: passar uma transação (e as três ficam presas a ela, uma
// não commita sem a outra) ou passar o próprio "pg" quando não precisa de
// transação, como nos testes que só verificam a query isolada.

export async function criarProduto(dados) {
  // Não recebe trx porque criar produto não faz parte do fluxo de débito —
  // não precisa participar da mesma transação.
  // .returning("*") pede a linha inteira de volta, já com o "id" que o
  // banco gerou. Sem isso o insert não devolveria o registro criado.
  const resultado = await pg("produtos").insert(dados).returning("*");
  return resultado;
}

export async function buscarProdutoPorId(id, trx) {
  // .forUpdate() é o SELECT ... FOR UPDATE: trava essa linha da tabela até
  // a transação terminar (commit ou rollback). Se outra chamada tentar
  // buscar o mesmo produto nesse meio tempo, ela fica esperando — é isso
  // que impede duas vendas lerem o mesmo saldo antigo ao mesmo tempo.
  // Só funciona de verdade quando "trx" é uma transação; fora de uma
  // transação o lock não tem o que segurar.
  // .first() devolve só a primeira linha (ou undefined), em vez de um
  // array — faz sentido aqui porque "id" é único.
  const resultado = await trx("produtos").where("id", id).forUpdate().first();
  return resultado;
}

export async function atualizarQuantidadeEstoque(id, novaQuantidade,trx) {
  // Antes essa função rodava sozinha, sem transação, e duas chamadas
  // simultâneas podiam se sobrescrever (race condition). Agora ela sempre
  // roda dentro da mesma transação que fez o SELECT ... FOR UPDATE lá em
  // buscarProdutoPorId — então, enquanto essa transação não termina,
  // nenhuma outra consegue nem ler a linha para calcular um novo valor.
  const resultado = await trx("produtos")
    .where("id", id)
    .update("quantidade_estoque", novaQuantidade)
    .returning("*");
  return resultado;
}

export async function criarMovimentacao(dados,trx) {
  // Só insert: esta tabela é append-only, não existe (e não deveria
  // existir) uma função para alterar uma movimentação já criada.
  // Recebe trx pelo mesmo motivo das outras: se o débito falhar depois
  // daqui, essa movimentação precisa ser desfeita junto (rollback), não
  // ficar gravada sozinha.
  const movimentacoes = await trx("movimentacoes_estoque")
    .insert(dados)
    .returning("*");
  return movimentacoes;
}
