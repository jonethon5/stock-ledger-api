import express from "express";

const app = express();

// Rota de exemplo, só para confirmar que o Express está respondendo.
// Ainda não é uma rota real do domínio (products/inventory) — dá pra apagar
// quando as rotas de verdade existirem.
app.get("/user", function (req, res) {
  res.status(200).json({ name: "john" });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
