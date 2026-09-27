import pg from "../db/connection.js";

export async function criarProduto(dados) {
  const resultado = await pg("produtos").insert(dados).returning("*");
  return resultado;
}


export async function buscarProdutoPorId(id) {
  const resultado = await pg("produtos").where("id", id).first();
  return resultado;
}


