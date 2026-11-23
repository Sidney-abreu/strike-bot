// --- CONFIGURAÇÃO ---
function getBotUrl() {
  var token = PropertiesService.getScriptProperties().getProperty('TOKEN_BOT');
  return "https://api.telegram.org/bot" + token + "/sendMessage";
}

function enviarTelegram(chatId, mensagem) {
  var payload = { chat_id: String(chatId), text: mensagem, parse_mode: "HTML" };
  var options = { method: "post", payload: payload, muteHttpExceptions: true };
  UrlFetchApp.fetch(getBotUrl(), options);
}

// --- MOTOR DE EXECUÇÃO ---
function processarMonitoramento(tipo) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Página1");
  var dados = sheet.getDataRange().getValues();
  var horaAtual = new Date().getHours();

  var icones = {
    "PETR4": "\uD83D\uDEE2", "VALE3": "\u26CF", "ITUB4": "\uD83D\uDCB3",
    "BBDC4": "\uD83C\uDFE6", "BBAS3": "\uD83C\uDFE6", "ELET3": "\u26A1",
    "MGLU3": "\uD83D\uDED2", "AMER3": "\uD83D\uDCE6", "SUZB3": "\uD83D\uDCC4",
    "JBSS3": "\uD83E\uDD69", "CSNA3": "\uD83C\uDFD7", "GGBR4": "\uD83D\uDD29",
    "WEGE3": "\u2699", "BOVA11": "\uD83D\uDCCA", "AZUL4": "\u2708", "GOLL4": "\u2708"
  };

  for (var i = 1; i < dados.length; i++) {
    var chatId = dados[i][2];
    var status = String(dados[i][10]).trim();
    if (status !== "Monitorando" || !chatId) continue;

    var ticker = String(dados[i][4]);
    var preco = parseFloat(String(dados[i][5]).replace(',', '.'));
    var precoAnterior = parseFloat(String(sheet.getRange(i + 1, 13).getValue())) || preco;
    var alvo = parseFloat(dados[i][6]);
    var min = parseFloat(dados[i][7]);
    var max = parseFloat(dados[i][8]);
    
    var ehAlerta = false;
    var alertaTxt = "";
    var iconeCheck = "✅";

    if (preco >= alvo && preco < max && alvo > 0) { 
      alertaTxt = " 🚨 ATINGIU ALVO!"; iconeCheck = "🚨"; ehAlerta = true;
    } else if (preco <= min && min > 0) { 
      alertaTxt = " 🛑 ABAIXO MÍNIMO!"; iconeCheck = "🛑"; ehAlerta = true;
    } else if (preco >= max && max > 0) { 
      alertaTxt = " ❇️ SUPEROU EXPECTATIVA!"; iconeCheck = "❇️"; ehAlerta = true;
    }

    var statusTexto = ehAlerta ? " FORA DOS LIMITES!" : " dentro dos limites.";
    var tituloMsg = ehAlerta ? "⚠️ ALERTA DE MERCADO (" + horaAtual + "h)" : "⏰ Atualização de Mercado (" + horaAtual + "h)";

    var seta = (preco > precoAnterior) ? " 🟢" : (preco < precoAnterior) ? " 🔴" : " ⚪";
    var iconeAtivo = icones[ticker] || "🔹";

    var msg = "<b>" + tituloMsg + "</b>\n" +
              iconeCheck + " <b>" + ticker + statusTexto + "</b>" + alertaTxt + "\n" +
              iconeAtivo + " Preço atual: <b>R$" + preco.toFixed(2) + "</b>" + seta + "\n" +
              "🎯 <b>Alvo:</b> <b>R$" + alvo.toFixed(2) + "</b>\n" +
              "↔️ <b>Intervalo:</b> <b>R$" + min.toFixed(2) + " - R$" + max.toFixed(2) + "</b>\n" +
              "⚙️ <b>Status:</b> <b>" + status + "</b>";

    enviarTelegram(chatId, msg);
    sheet.getRange(i + 1, 13).setValue(preco);
  }
}

// --- GATILHOS ---
function gatilhoAbertura() { processarMonitoramento("abertura"); }
function gatilhoFechamento() { processarMonitoramento("fechamento"); }
function gatilhoMonitoramento() { processarMonitoramento("monitorando"); }
