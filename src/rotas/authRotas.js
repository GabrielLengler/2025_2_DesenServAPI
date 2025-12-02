// 1. Importa o módulo 'express'.
const express = require('express');

// 2. Cria um objeto Router, que é como um mini-aplicativo Express que
// lida com rotas específicas, permitindo organizá-las em arquivos separados.
const router = express.Router();

// 3. Importa o controlador de autenticação.
// Ele contém a lógica real que será executada quando as rotas forem acessadas.
const authControlador = require('../controladores/authControlador');

// 4. Definição das Rotas:

// Rota HTTP POST para registrar um novo usuário.
// Quando o cliente envia uma requisição POST para '/registrar' (ex: POST /api/auth/registrar),
// o Express chama a função 'registrar' do authControlador.
router.post('/registrar', authControlador.registrar);

// Rota HTTP POST para fazer o login de um usuário.
// Quando o cliente envia uma requisição POST para '/login' (ex: POST /api/auth/login),
// o Express chama a função 'login' do authControlador.
router.post('/login', authControlador.login);

// 5. Exporta o objeto router configurado.
// Este objeto será importado no arquivo principal (geralmente app.js ou servidor.js)
// e anexado ao seu aplicativo Express principal, muitas vezes prefixado com '/auth'.
module.exports = router;