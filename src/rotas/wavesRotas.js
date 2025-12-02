const express = require('express');
const router = express.Router();
const waveControlador = require('../controladores/wavesControlador');

// Criar wave
router.post('/', waveControlador.criarWave);

// Listar todas as waves
router.get('/', waveControlador.listarTodas);

// Consultar wave por ID
router.get('/:id', waveControlador.consultarWave);

// Atualizar wave por ID
router.put('/:id', waveControlador.atualizarWave);

// Remover wave por ID
router.delete('/:id', waveControlador.removerWave);

// Simular wave
router.post('/:id/simular', waveControlador.simularWave);

module.exports = router;
