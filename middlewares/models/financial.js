const mongoose = require("../database/conexao");

const schema = new mongoose.Schema({
    nome_banco: String,
    tipo_conta: String,
    nome_titular: String,
    limite_cartao: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
    },
});

const FinancialInfo = mongoose.model("FinancialInfo", schema);

module.exports = FinancialInfo
;
