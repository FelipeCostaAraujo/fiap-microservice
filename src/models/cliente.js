const mongoose = require("../database/conexao");


const schema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    cpf: { type: String, unique: true, required: true },
    telefone: { type: String },
    idade: { type: Number, min: 16, max: 120 },
    usuario: { type: String, unique: true },
    senha: { type: String },
    datacadastro: { type: Date, default: Date.now }
});

const Cliente = mongoose.model("Cliente", schema);

module.exports = Cliente;