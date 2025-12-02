// Importa o módulo de serviço de autenticação, onde a lógica de negócio real reside.
// O controlador apenas recebe a requisição e delega o trabalho para o serviço.
const authServico = require('../servicos/authServico');

// Exporta um objeto contendo todas as funções de controle de autenticação.
module.exports = {

    // Função assíncrona responsável por lidar com a requisição de registro de novo usuário.
    registrar: async (req, res) => {
        try {
            // 1. Extração de Dados:
            // Desestrutura o 'req.body' para obter 'nome', 'email' e 'senha' enviados pelo cliente.
            const { nome, email, senha } = req.body;

            // 2. Delegação da Lógica:
            // Chama o método 'registrar' do serviço, que irá validar e salvar o usuário no DB.
            // O 'await' aguarda a conclusão da operação assíncrona.
            const usuario = await authServico.registrar(nome, email, senha);

            // 3. Resposta de Sucesso:
            // Envia uma resposta HTTP com status 201 (Created - Criado),
            // indicando que o recurso (o usuário) foi criado com sucesso.
            res.status(201).json(usuario);

        } catch (erro) {
            // 4. Tratamento de Erro:
            // Em caso de falha (ex: erro no DB ou validação interna do serviço),
            // retorna o status 500 (Internal Server Error) e a mensagem de erro.
            res.status(500).json({ erro: erro.message });
        }
    },

    // Função assíncrona responsável por lidar com a requisição de login de usuário.
    login: async (req, res) => {
        try {
            // 1. Extração de Dados:
            // Desestrutura o 'req.body' para obter 'email' e 'senha' para autenticação.
            const { email, senha } = req.body;

            // 2. Delegação da Lógica:
            // Chama o método 'login' do serviço. O serviço irá verificar as credenciais
            // e, se corretas, gerar um token de autenticação (JWT).
            const resposta = await authServico.login(email, senha);

            // 3. Resposta de Sucesso:
            // Envia a resposta de volta ao cliente. O status padrão é 200 (OK).
            // A 'resposta' deve conter o token JWT para futuras requisições autenticadas.
            res.json(resposta);

        } catch (erro) {
            // 4. Tratamento de Erro:
            // Em caso de falha (ex: email/senha inválidos),
            // retorna o status 400 (Bad Request - Requisição Inválida)
            // e a mensagem de erro fornecida pelo serviço.
            // (Um status 401 Unauthorized também seria comum aqui.)
            res.status(400).json({ erro: erro.message });
        }
    }
};