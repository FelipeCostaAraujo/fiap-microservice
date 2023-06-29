const express = require("express");
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const router = express.Router();
// Rota para cadastrar ou atualizar informações financeiras
app.post('/informacoes_financeiras', async (req, res) => {
    try {
        const { nome_banco, tipo_conta, nome_titular, limite_cartao, apikey, token } = req.body;

        // Verificar o token JWT
        // (você pode criar uma função de utilidade para verificar o token em ambos os microserviços)
        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        // Buscar o usuário pelo ID no token
        const user = await User.findById(token.userId);
        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        // Verificar se já existem informações financeiras para o usuário
        const existingInfo = await FinancialInfo.findOne({ userId: user._id });
        if (existingInfo) {
            // Atualizar as informações existentes
            existingInfo.nome_banco = nome_banco;
            existingInfo.tipo_conta = tipo_conta;
            existingInfo.nome_titular = nome_titular;
            existingInfo.limite_cartao = limite_cartao;
            existingInfo.apikey = apikey;

            await existingInfo.save();

            res.status(200).json({ message: 'Informações financeiras atualizadas' });``
        } else {
            // Criar novas informações financeiras
            const info = new FinancialInfo({
                nome_banco,
                tipo_conta,
                nome_titular,
                limite_cartao,
                apikey,
                userId: user._id,
            });

            await info.save();

            res.status(201).json({ message: 'Informações financeiras cadastradas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar/atualizar informações financeiras' });
    }
});

// Iniciar o servidor
app.listen(4000, () => {
    console.log('Microserviço de Informações Financeiras iniciado na porta 4000');
});

router.use((req, res) => {
    res.type("application/json");
    res.status(404).send("404 - Not Found");
});

module.exports = router;