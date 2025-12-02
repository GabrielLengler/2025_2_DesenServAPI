// Importa a biblioteca 'jsonwebtoken' (JWT), usada para criar e verificar tokens de autenticação.
const jwt = require('jsonwebtoken');

// Exporta a função middleware principal. Middlewares em Express recebem (req, res, next).
module.exports = function(req, res, next) {
    
    // 1. Extração do Token:
    // Pega o valor do cabeçalho 'Authorization' da requisição.
    // O valor geralmente vem no formato "Bearer <token>".
    // Usamos 'split(" ")[1]' para pegar apenas a parte do token, ignorando "Bearer".
    // O '?.', chamado de Optional Chaining, garante que não haverá erro se o cabeçalho não existir.
    const token = req.headers.authorization?.split(" ")[1];

    // 2. Verificação de Ausência do Token:
    // Se o token não for encontrado (ou for nulo/undefined),
    // retorna status 401 (Unauthorized - Não Autorizado) e encerra a requisição.
    if (!token) return res.status(401).json({ erro: "Token não enviado" });

    // 3. Verificação do Token (Decodificação):
    try {
        // Tenta verificar se o token é válido:
        // - Usa o token extraído.
        // - Usa a chave secreta (JWT_SECRET) definida nas variáveis de ambiente.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Se a verificação for bem-sucedida, o payload (conteúdo) do token é decodificado.
        // Adiciona o ID do usuário (que deve estar contido no payload) ao objeto 'req'.
        // Isso permite que os controladores posteriores saibam qual usuário está logado.
        req.usuarioId = decoded.id;
        
        // Chama 'next()' para permitir que a requisição prossiga para o próximo middleware ou para o controlador final.
        next();

    } catch (erro) {
        // 4. Tratamento de Erro do Token:
        // Se 'jwt.verify' falhar (token expirado, alterado ou inválido),
        // retorna status 401 (Unauthorized - Não Autorizado) e informa que o token é inválido.
        res.status(401).json({ erro: "Token inválido" });
    }
};