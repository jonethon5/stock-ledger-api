import express from "express";

const app = express();

app.get("/user", function (req, res) {
  res.status(200).json({ name: "john" });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
