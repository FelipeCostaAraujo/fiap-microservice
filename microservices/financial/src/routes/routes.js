const express = require("express");
const verificarToken = require("../middlewares/verificartoken");
const FinancialInfo = require("../models/financial");
const decodeToken = require("../utils/decode-token");
const Cliente = require("../models/cliente");

const router = express.Router();

router.post('/financial', verificarToken, async (req, res) => {
    try {
        const token = req.body.token || req.query.token || req.headers['authorization'];
        const { nome_banco, tipo_conta, nome_titular, limite_cartao, apikey } = req.body;

        const tokenDecoded = decodeToken(token);

        const cliente = await Cliente.findById(tokenDecoded.idusuario);

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        console.log(cliente);
        console.log(cliente._id);

        const existingInfo = await FinancialInfo.findOne({ userId: cliente._id });

        if (existingInfo) {
            existingInfo.nome_banco = nome_banco;
            existingInfo.tipo_conta = tipo_conta;
            existingInfo.nome_titular = nome_titular;
            existingInfo.limite_cartao = limite_cartao;
            existingInfo.apikey = apikey;

            await existingInfo.save();
            cliente.financial = existingInfo;
            cliente.save();

            res.status(200).json({ message: 'Informações financeiras atualizadas' });
        }
        else {
            const info = new FinancialInfo({
                nome_banco,
                tipo_conta,
                nome_titular,
                limite_cartao,
                apikey,
                userId: cliente._id,
            });

            await info.save();

            res.status(201).json({ message: 'Informações financeiras cadastradas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar/atualizar informações financeiras' });
    }
});

router.get('/financial', verificarToken, async (req, res) => {
    try {
        const token = req.body.token || req.query.token || req.headers['authorization'];

        const tokenDecoded = decodeToken(token);

        const cliente = await Cliente.findById(tokenDecoded.idusuario);

        if (!cliente) {
            return res.status(401).json({ error: 'Cliente não encontrado' });
        }

        const existingInfo = await FinancialInfo.findOne({ userId: cliente._id });

        res.status(201).json({ message: 'Informações financeiras cadastradas', payload: existingInfo });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar/atualizar informações financeiras' });
    }
});

router.use((_, res) => {
    res.type("application/json");
    res.status(404).send("404 - Not Found");
});

module.exports = router;