// 1. Importa o módulo 'express'.
const express = require('express');

// 2. Importa o controlador de minions.
// O controlador contém as funções que serão executadas em resposta a cada rota.
const control = require('../controladores/minionsControlador');

// 3. Cria um objeto Router, usado para agrupar e definir rotas.
const router = express.Router();

// 4. Definição das Rotas (Mapeamento CRUD):

// Rota para CRIAR um novo minion (CREATE).
// Endpoint: POST /minions
router.post('/', control.criar);

// Rota para LISTAR todos os minions (READ All).
// Endpoint: GET /minions
router.get('/', control.listar);

// Rota para CONSULTAR um minion por ID (READ One).
// Endpoint: GET /minions/:id (onde :id é um parâmetro dinâmico na URL)
router.get('/:id', control.consultar);

// Rota para ATUALIZAR um minion existente (UPDATE).
// Endpoint: PUT /minions/:id
router.put('/:id', control.atualizar);

// Rota para REMOVER um minion (DELETE).
// Endpoint: DELETE /minions/:id
router.delete('/:id', control.remover);

// 5. Exporta o objeto router configurado.
// Ele será anexado ao aplicativo Express principal, geralmente sob o prefixo '/minions'.
module.exports = router;
