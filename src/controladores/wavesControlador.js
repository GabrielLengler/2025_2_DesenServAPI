// Importa o módulo de serviço de waves.
// O controlador delega todas as operações de banco de dados e lógica de negócio
// (como a simulação) para este serviço.
const waveServico = require('../servicos/wavesServico');

// Exporta um objeto contendo todas as funções de controle para a entidade Waves.
module.exports = {

    // Função assíncrona para lidar com a criação de uma nova wave (CREATE).
    // Tipicamente associada a uma rota HTTP POST.
    criarWave: async (req, res) => {
        try {
            // 1. Receber Dados: Pega o corpo da requisição com os dados da nova wave.
            const dados = req.body;
            
            // 2. Delegação: Chama o serviço para criar e persistir a nova wave no DB.
            const novaWave = await waveServico.criarWave(dados);
            
            // 3. Resposta de Sucesso: Retorna status 201 (Created - Criado) e o objeto da nova wave.
            res.status(201).json(novaWave);
            
        } catch (erro) {
            // 4. Tratamento de Erro:
            console.error("Erro ao criar wave:", erro);
            // Retorna status 500 (Internal Server Error) para o cliente em caso de falha.
            res.status(500).json({ erro: "Erro ao criar wave" });
        }
    },

    // Função assíncrona para lidar com a listagem de todas as waves (READ All).
    // Tipicamente associada a uma rota HTTP GET.
    listarTodas: async (req, res) => {
        try {
            // 1. Delegação: Chama o serviço para buscar a lista completa de waves no DB.
            const waves = await waveServico.listarWaves();
            
            // 2. Resposta de Sucesso: Retorna a lista de waves com status 200 (OK).
            res.json(waves);
            
        } catch (erro) {
            // 3. Tratamento de Erro:
            console.error("Erro ao listar waves:", erro);
            // Retorna 500 em caso de falha na busca.
            res.status(500).json({ erro: "Erro ao listar waves" });
        }
    },

    // Função assíncrona para lidar com a busca de uma wave específica por ID (READ One).
    // Tipicamente associada a uma rota HTTP GET com um parâmetro na URL (ex: /waves/1).
    consultarWave: async (req, res) => {
        try {
            // 1. Receber Parâmetros: Pega o 'id' da wave a ser consultada, que está na URL (req.params).
            const { id } = req.params;
            
            // 2. Delegação: Chama o serviço para buscar a wave pelo ID.
            const wave = await waveServico.consultarWave(id);

            // 3. Verificação de Existência:
            // Checa se o serviço não encontrou a wave.
            if (!wave) {
                // Se não encontrou, retorna 404 (Not Found - Não Encontrado) e encerra.
                return res.status(404).json({ erro: "Wave não encontrada" });
            }

            // 4. Resposta de Sucesso: Se encontrada, retorna a wave com status 200 (OK).
            res.json(wave);
            
        } catch (erro) {
            // 5. Tratamento de Erro:
            console.error("Erro ao consultar wave:", erro);
            // Retorna 500 em caso de falha inesperada.
            res.status(500).json({ erro: "Erro ao consultar wave" });
        }
    },

    // Função assíncrona para lidar com a atualização de uma wave (UPDATE).
    // Tipicamente associada a uma rota HTTP PUT ou PATCH.
    atualizarWave: async (req, res) => {
        try {
            // 1. Receber Dados: Pega o ID da URL e os novos dados do corpo da requisição.
            const { id } = req.params;
            const dados = req.body;

            // 2. Delegação: Chama o serviço para executar a lógica de atualização no DB.
            const waveAtualizada = await waveServico.atualizarWave(id, dados);
            
            // 3. Resposta de Sucesso: Retorna a wave atualizada com status 200 (OK).
            res.json(waveAtualizada);
            
        } catch (erro) {
            // 4. Tratamento de Erro:
            console.error("Erro ao atualizar wave:", erro);
            // Retorna 500 em caso de falha.
            res.status(500).json({ erro: "Erro ao atualizar wave" });
        }
    },

    // Função assíncrona para lidar com a remoção de uma wave (DELETE).
    // Tipicamente associada a uma rota HTTP DELETE.
    removerWave: async (req, res) => {
        try {
            // 1. Receber Parâmetros: Pega o ID da wave a ser removida.
            const { id } = req.params;
            
            // 2. Delegação: Chama o serviço para deletar a wave no DB.
            await waveServico.removerWave(id);
            
            // 3. Resposta de Sucesso: Retorna 200 (OK) com uma mensagem de confirmação,
            // pois o conteúdo em si (a wave) não existe mais.
            res.json({ mensagem: "Wave removida com sucesso!" });
            
        } catch (erro) {
            // 4. Tratamento de Erro:
            console.error("Erro ao remover wave:", erro);
            // Retorna 500 em caso de falha.
            res.status(500).json({ erro: "Erro ao remover wave" });
        }
    },

    // *** Função de Negócio Específica: Simular Wave ***
    // Esta função lida com a lógica de simulação do combate da wave,
    // que é a parte central da sua aplicação.
    simularWave: async (req, res) => {
        try {
            // 1. Receber Parâmetros: Pega o ID da wave que será simulada.
            const { id } = req.params;
            
            // 2. Delegação: Chama o serviço para executar a lógica complexa de simulação.
            const resultado = await waveServico.simularWave(id);
            
            // 3. Resposta de Sucesso: Retorna o resultado da simulação.
            res.json(resultado);
            
        } catch (erro) {
            // 4. Tratamento de Erro:
            console.error("Erro ao simular wave:", erro);
            // Retorna 500 em caso de falha na simulação.
            res.status(500).json({ erro: "Erro ao simular wave" });
        }
    }
};