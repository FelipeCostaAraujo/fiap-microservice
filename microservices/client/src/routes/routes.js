const express = require("express");
const bcrypt = require("bcrypt");
const gerarToken = require("middlewares/auth/gerartoken")
const verificarToken = require("middlewares/auth/verificartoken");
const verificarAPIKey = require("middlewares/auth/verificar-apikey");
const Cliente = require("middlewares/models/cliente");
const config = require("middlewares/config/settings");

const router = express.Router();


router.get("/", verificarAPIKey, (req, res) => {
    Cliente.find().select("-senha").then((result) => {
        res.status(200).send({ output: "ok", payload: result });
    }).catch((erro) => {
        res.status(500).send({ output: `Erro ao processar dados -> ${erro}` });
    });
});

router.get("/:id", verificarAPIKey, (req, res) => {
    Cliente.findById(req.params.id).select("-senha").then((result) => {
        res.status(200).send({ output: "ok", payload: result });
    }).catch((erro) => {
        res.status(500).send({ output: `Erro ao processar dados -> ${erro}` });
    });
});

router.post("/insert", async (req, res) => {

    const client = await Cliente.findOne({ email: req.body.email });

    if (client) {
        return res.status(400).send({ output: `Usuário já cadastrado` });
    }

    bcrypt.hash(req.body.senha, config.bcrypt_salt, (err, result) => {
        if (err) {
            return res.status(500).send({ output: `Erro ao gerar a senha ->${err}` });
        }

        req.body.senha = result;

        const dados = new Cliente(req.body);
        dados.save().then((result) => {
            res.status(201).send({ output: `Cadastro realizado`, payload: result });
        }).catch((erro) => {
            res.status(500).send({ output: `Erro ao cadastrar -> ${erro}` })
        });
    });
});

router.put("/update/:id", verificarToken, verificarAPIKey, (req, res) => {
    Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((result) => {
        if (!result) {
            return res.status(400).send({ output: `Não foi possível atualizar` });
        }
        res.status(202).send({ output: `Atualizado`, payload: result });
    }).catch((erro) => {
        res.status(500).send({ output: `Erro ao processar a solicitação -> ${erro}` });
    });
});


router.put("/recovery", verificarAPIKey, verificarToken, async (req, res) => {
    const { email, senhaAntiga, senhaNova } = req.body;

    try {
        const client = await Cliente.findOne({ email: email });
        if (!client) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }
        const passwordMatch = bcrypt.compare(senhaAntiga, client.senha);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Senha antiga inválida' });
        }

        bcrypt.hash(senhaNova, config.bcrypt_salt, (err, result) => {
            if (err) {
                return res.status(500).send({ output: `Erro na alteracao de senha ->${err}` });
            }
            // Atualizar a senha do usuário
            client.senha = result;
            client.save().then(() => res.status(200).json({ message: 'Senha alterada com sucesso' }))
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: `Erro ao alterar a senha -> ${err.message}` });
    }
});



router.delete("/delete/:id", verificarToken, verificarAPIKey, (req, res) => {
    Cliente.findByIdAndDelete(req.params.id).then((result) => {
        res.status(204).send({ payload: result });
    }).catch((erro) => console.log(`Erro ao tentar apagar -> ${erro}`));
});


router.post("/login", (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    Cliente.findOne({ email: email }).then((result) => {
        if (!result) {
            return res.status(401).send({ output: `Credenciais Inválidas` });
        }
        bcrypt.compare(senha, result.senha).then((rs) => {
            if (!rs) {
                return res.status(401).send({ output: `Credenciais Inválidas` });
            }
            const token = gerarToken(result._id, result.nomeusuario, result.email);
            res.status(200).send({ output: `Autenticado`, token: token, user: result });
        }).catch((err) => res.status(500).send({ output: `Erro ao processar dados ${err}` }));
    }).catch((error) => res.status(500).send({ output: `Erro ao tentar efetuar o login ${error}` }));
});


router.use((req, res) => {
    res.type("application/json");
    res.status(404).send("404 - Not Found");
});

module.exports = router;