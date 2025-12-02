// Importa o módulo de configuração do banco de dados (provavelmente o pool de conexões).
const db = require('../configuracoes/db');
// Importa a biblioteca 'bcryptjs', essencial para fazer o HASH e a comparação de senhas de forma segura.
const bcrypt = require('bcryptjs');
// Importa a biblioteca 'jsonwebtoken', usada para criar os tokens de autenticação (JWT).
const jwt = require('jsonwebtoken');

// 1. Função 'registrar': Lógica para criar e inserir um novo usuário no DB.
async function registrar(nome, email, senha) {
    
    // Hashing da Senha:
    // Transforma a senha em texto simples em uma string segura (hash) usando bcrypt.
    // O número '10' é o 'salt rounds', que define a complexidade do hash.
    const senhaHash = await bcrypt.hash(senha, 10);

    // Interação com o DB (Inserção):
    // Executa uma query SQL para inserir o novo usuário na tabela 'usuarios'.
    // Os '?' são placeholders para evitar SQL Injection.
    const [resultado] = await db.query(
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
        [nome, email, senhaHash] // Passa os valores (incluindo o hash da senha, nunca a senha pura).
    );

    // Retorno de Sucesso:
    // Retorna os dados do novo usuário, incluindo o ID gerado pelo banco de dados.
    return { id: resultado.insertId, nome, email };
}

// 2. Função 'login': Lógica para autenticar um usuário existente e gerar um token.
async function login(email, senha) {
    
    // Busca do Usuário:
    // Executa uma query SQL para buscar o usuário no banco de dados pelo email.
    const [linhas] = await db.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
    );

    // Obtém o primeiro (e único) resultado da busca.
    const usuario = linhas[0];

    // Verificação de Existência:
    // Se não encontrou o usuário, lança um erro, que será capturado pelo controlador.
    if (!usuario) throw new Error("Usuário não encontrado");

    // Comparação da Senha:
    // Compara a senha enviada pelo cliente com o hash da senha armazenado no DB.
    // O bcrypt cuida da comparação segura.
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    // Verificação de Senha:
    // Se a senha não for válida, lança um erro.
    if (!senhaValida) throw new Error("Senha incorreta");

    // Geração do Token JWT:
    
    // Cria um token assinado:
    const token = jwt.sign(
        // Payload (Carga de Dados): Inclui o ID do usuário para identificação futura.
        { id: usuario.id },
        // Chave Secreta: Pega a chave secreta das variáveis de ambiente para assinar o token.
        process.env.JWT_SECRET,
        // Opções: Define o tempo de expiração do token (aqui, 7 dias).
        { expiresIn: "7d" } 
    );

    // Retorno de Sucesso (Login):
    // Retorna o token gerado e os dados básicos do usuário.
    return {
        token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }
    };
}

// Exporta as funções para que possam ser usadas pelos controladores e outras partes da aplicação.
module.exports = { registrar, login };