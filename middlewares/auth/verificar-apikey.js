const settings = require("../config/settings");

//Os microserviços podem ter chaves de API diferentes. por isso esta variável é um array
const allowedAPIKeys = [settings.apikey];

function verificarAPIKey(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.body['api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'Chave de API não fornecida.' });
  }

  if (!allowedAPIKeys.includes(apiKey)) {
    return res.status(401).json({ error: 'Acesso não autorizado.' });
  }

  next();
}

module.exports = verificarAPIKey;
