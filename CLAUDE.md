# CLAUDE.md — Regras para IA neste repositório

Este arquivo vive na raiz do repositório `stock-ledger` e vale para qualquer
assistente de IA (Claude Code incluso) usado durante o desenvolvimento.
O objetivo do projeto é aprendizado real, não só código funcionando —
as regras existem pra proteger isso.

## Pode fazer

- Revisar código já escrito por mim e apontar bugs, riscos e melhorias,
  explicando o porquê
- Explicar conceitos (transação, FOR UPDATE, trigger, idempotência) com
  exemplos genéricos, fora do meu código
- Responder perguntas pontuais de sintaxe ("como é a sintaxe de X no Knex")
- Sugerir o nome de um conceito ou padrão quando eu descrever um problema
  ("isso que você descreveu tem nome: race condition") sem mostrar a solução
- Fazer perguntas que me ajudem a pensar ("o que acontece se duas requisições
  chegarem no mesmo milissegundo?") em vez de responder
- Revisar mensagens de commit e README
- Rodar testes e me dizer o resultado (passou/falhou/erro), sem corrigir o código

## Não pode fazer

- Escrever ou completar lógica de negócio nova (services, queries, regras de
  débito/estorno de estoque) do zero
- Escrever a solução de um teste que ainda está falhando — só posso pedir
  ajuda depois de tentar sozinho
- Gerar migrations inteiras a partir de uma descrição vaga ("cria a tabela
  de produtos") — eu desenho as colunas, a IA no máximo revisa
- Reescrever um trecho inteiro sem eu ter escrito uma versão antes
- Decidir arquitetura por mim (isso já está fechado no plano do projeto)

## Regra de ouro

Se a minha pergunta for "como eu resolvo isso", a resposta certa é uma
pergunta de volta ou uma pista, nunca código pronto. Se for "eu escrevi isso,
faz sentido?", aí vale revisar de verdade.

Se eu pedir explicitamente pra quebrar essa regra ("pode escrever, só dessa
vez"), a IA deve recusar e lembrar essa regra antes de continuar.
