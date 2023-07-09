# Projeto Microservices

Projeto final da disciplina de Microservices do MBA em Mobile Development da FIAP.

Neste projeto, aplicaremos os conhecimentos adquiridos ao longo da disciplina em um contexto reduzido.

## Contexto

O projeto contém duas estruturas de backend , sendo a primeira para cadastrar usuários, onde este deva conter os seguintes campos: nomeusuario, email, senha, nomecompleto, telefone, datacadastro. Nesta estrutura deve haver as seguintes ações: 
 - cadastrar usuario; 
 - criptografar a senha; 
 - autenticar usuário; 
 - gerar o token com jwt; 
 - gerar uma apikey;
 - alterar senha. 

 A Segunda estrutura deve cadastrar e atualizar informações financeiras dos usuários. As informações financeiras só poderão ser cadastras e/ou atualizadas se houver um token válido. Os dados financeiros serão: 
 - nome_banco, tipo_conta, nome_titular, limite_cartao, apikey. 

## Pre-requisito

Banco utilizado: MongoDB

## Executando a aplicação

### Docker

Para a execução local do projeto é necessário ter o docker instalado e configurado na máquina.

### Debugando a API

Caso seja necessário debugar a API, execute o somente o banco de dados via docker-compose (comando: `docker-compose up -d db`) e execute a API com `npm install` e o VSCode. Por exemplo:
1. Na raiz do microservico execute: `docker-compose up db`
2. Na pasta microservices entre no serviço desejado e execute `npm install` e em seguida execute `npm start`.

## Variaveis para o .env
 - Cada servico necessita de um arquivo .env com as seguintes variaveis:
- DB_HOST
- DB_NAME
- DB_USER
- DB_PASS
- HOST
- KEY_JWT
- NODE_ENV
- API_KEY

