# Strike Bot

Bot no Telegram, feito com Google Apps Script, que envia atualização de ações a cada 2 horas.

## O que ele faz

- Busca a cotação das ações configuradas
- Envia a atualização automaticamente no Telegram a cada 2 horas
- Funciona sem precisar deixar o computador ligado, porque roda na nuvem do Google

## Como funciona

1. O Google Apps Script roda em intervalo programado (trigger de 2 horas)
2. O script consulta a fonte de cotação
3. Formata a mensagem com o preço atual e a variação
4. Envia a mensagem para o chat / grupo no Telegram via Bot API

## Tecnologias

- Google Apps Script (JavaScript)
- Telegram Bot API
- Triggers por tempo do Google Apps Script

## Como usar

1. Crie um bot no Telegram com o @BotFather e copie o token
2. No Apps Script, configure as variáveis `TELEGRAM_TOKEN`, `CHAT_ID` e a lista de ações
3. Crie um trigger por tempo para rodar a cada 2 horas
4. Execute uma vez para testar o envio

> Por segurança, o token e o ID do chat não estão neste repositório. Cada pessoa configura com os seus.
