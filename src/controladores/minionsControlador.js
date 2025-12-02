// Importa o módulo de serviço de minions.
// Todas as interações com o banco de dados e a lógica de negócio dos minions
// são delegadas a este serviço, mantendo o controlador limpo (thin controller).
const minionsServico = require('../servicos/minionsServico');

// Exporta um objeto contendo todas as funções de controle para a entidade Minions.
module.exports = {

    // Função assíncrona para lidar com a criação de um novo minion (CREATE).
    // Tipicamente associada a uma rota HTTP POST.
    criar: async (req, res) => {
        try {
            // 1. Receber Dados: Pega o corpo da requisição, que deve conter os atributos do minion.
            const dados = req.body;
            
            // 2. Delegação: Chama o serviço para executar a lógica de criação e inserção no DB.
            const minion = await minionsServico.criarMinion(dados);
            
            // 3. Resposta de Sucesso: Retorna o status 201 (Created - Criado) e o objeto minion recém-criado.
            res.status(201).json(minion);
            
        } catch (erro) {
            // 4. Tratamento de Erro:
            // Imprime o erro no console do servidor para fins de debug.
            console.error("Erro ao criar minion:", erro);
            // Envia uma resposta 500 (Internal Server Error) para o cliente,
            // indicando que houve uma falha interna no servidor.
            res.status(500).json({ erro: "Erro ao criar minion" });
        }
    },

    // Função assíncrona para lidar com a listagem de todos os minions (READ All).
    // Tipicamente associada a uma rota HTTP GET.
    listar: async (req, res) => {
        try {
            // 1. Delegação: Chama o serviço para buscar a lista completa de minions no DB.
            const lista = await minionsServico.listarMinions();
            
            // 2. Resposta de Sucesso: Retorna a lista completa com status 200 (OK - padrão para sucesso).
            res.json(lista);
            
        } catch (erro) {
            // 3. Tratamento de Erro:
            console.error("Erro ao listar minions:", erro);
            // Retorna 500 (Internal Server Error) em caso de falha na busca.
            res.status(500).json({ erro: "Erro ao listar minions" });
        }
    },

    // Função assíncrona para lidar com a busca de um minion específico por ID (READ One).
    // Tipicamente associada a uma rota HTTP GET com um parâmetro na URL (ex: /minions/1).
    consultar: async (req, res) => {
        try {
            // 1. Receber Parâmetros: Pega o 'id' que está na URL da requisição (req.params).
            const { id } = req.params;
            
            // 2. Delegação: Chama o serviço para buscar o minion pelo ID.
            const minion = await minionsServico.buscarMinionPorId(id);

            // 3. Verificação de Existência:
            // Checa se o serviço retornou nulo/undefined (Minion não encontrado).
            if (!minion) {
                // Se não encontrou, retorna 404 (Not Found) e encerra a função (return).
                return res.status(404).json({ erro: "Minion não encontrado" });
            }

            // 4. Resposta de Sucesso: Se o minion foi encontrado, retorna-o com status 200 (OK).
            res.json(minion);
            
        } catch (erro) {
            // 5. Tratamento de Erro:
            console.error("Erro ao consultar minion:", erro);
            // Retorna 500 em caso de falha inesperada.
            res.status(500).json({ erro: "Erro ao consultar minion" });
        }
    },

    // Função assíncrona para lidar com a atualização de um minion (UPDATE).
    // Tipicamente associada a uma rota HTTP PUT ou PATCH.
    atualizar: async (req, res) => {
        try {
            // 1. Receber Dados: Pega o ID do parâmetro da URL e os dados de atualização do corpo da requisição.
            const { id } = req.params;
            const dados = req.body;

            // 2. Delegação: Chama o serviço para executar a lógica de atualização no DB.
            const minionAtualizado = await minionsServico.atualizarMinion(id, dados);
            
            // 3. Resposta de Sucesso: Retorna o objeto minion atualizado com status 200 (OK).
            res.json(minionAtualizado);
            
        } catch (erro) {
            // 4. Tratamento de Erro:
            console.error("Erro ao atualizar minion:", erro);
            // Retorna 500 em caso de falha.
            res.status(500).json({ erro: "Erro ao atualizar minion" });
        }
    },

    // Função assíncrona para lidar com a remoção de um minion (DELETE).
    // Tipicamente associada a uma rota HTTP DELETE.
    remover: async (req, res) => {
        try {
            // 1. Receber Parâmetros: Pega o ID do parâmetro da URL.
            const { id } = req.params;
            
            // 2. Delegação: Chama o serviço para deletar o minion no DB.
            await minionsServico.removerMinion(id);
            
            // 3. Resposta de Sucesso: Retorna 200 (OK) com uma mensagem de confirmação.
            res.json({ mensagem: "Minion removido com sucesso!" });
            
        } catch (erro) {
            // 4. Tratamento de Erro:
            console.error("Erro ao remover minion:", erro);
            // Retorna 500 em caso de falha na remoção.
            res.status(500).json({ erro: "Erro ao remover minion" });
        }
    }
};