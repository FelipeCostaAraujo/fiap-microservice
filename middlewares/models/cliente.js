const mongoose = require("../database/conexao");

const schema = new mongoose.Schema({
    nomeusuario: String,
    email: String,
    senha: String,
    nomecompleto: String,
    telefone: String,
    datacadastro: { type: Date, default: Date.now },
});

const Cliente = mongoose.model("Cliente", schema);

module.exports = Cliente;
