// Importa o módulo de configuração do banco de dados (conexão).
// Este módulo é usado para executar queries SQL.
const db = require('../configuracoes/db');

// 1. Função 'criarMinion': Lógica para inserir um novo minion no DB (CREATE).
async function criarMinion(minion) {
    
    // Define a query SQL para inserção.
    // Lista todas as colunas da tabela 'minions' e usa placeholders (?) para os valores.
    const sql = `
        INSERT INTO minions (tipo, vida, dano, defesa, velocidade, range_minion, lado, id_wave)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Cria um array com os valores a serem inseridos, na ordem correta da query SQL.
    const valores = [
        minion.tipo,
        minion.vida,
        minion.dano,
        minion.defesa,
        minion.velocidade,
        // Usa o operador '|| null' para garantir que, se o campo for undefined/falsy,
        // ele seja armazenado como NULL no banco de dados.
        minion.range_minion || null, 
        minion.lado,
        minion.id_wave || null
    ];

    // Executa a query no banco de dados.
    // O resultado contém metadados, incluindo o ID gerado para a nova linha.
    const [resultado] = await db.query(sql, valores);
    
    // Retorna o minion recém-criado, chamando a função 'buscarPorId' com o ID de inserção.
    // Isso é uma prática comum para garantir que o objeto retornado contenha todos os dados atuais do DB.
    return buscarPorId(resultado.insertId);
}

// 2. Função 'listarMinions': Lógica para buscar todos os minions (READ All).
async function listarMinions() {
    // Executa uma query SQL para selecionar todas as colunas de todos os minions.
    const [linhas] = await db.query('SELECT * FROM minions');
    // Retorna o array de linhas (minions) encontradas.
    return linhas;
}

// 3. Função 'buscarPorId': Lógica para buscar um minion específico (READ One).
async function buscarPorId(id) {
    // Executa a query para selecionar o minion onde o ID corresponde ao parâmetro.
    const [linhas] = await db.query('SELECT * FROM minions WHERE id = ?', [id]);
    
    // Retorna o primeiro (e único) minion encontrado ou 'null' se o array estiver vazio.
    return linhas[0] || null;
}

// 4. Função 'atualizarMinion': Lógica para modificar um minion existente (UPDATE).
async function atualizarMinion(id, dados) {
    // Define a query SQL para atualização.
    // Lista as colunas a serem alteradas e usa 'WHERE id = ?' para focar no registro correto.
    const sql = `
        UPDATE minions SET
            tipo = ?, vida = ?, dano = ?, defesa = ?, velocidade = ?, 
            range_minion = ?, lado = ?, id_wave = ?
        WHERE id = ?
    `;

    // Cria um array com os valores de atualização, na ordem das colunas na query.
    const valores = [
        dados.tipo,
        dados.vida,
        dados.dano,
        dados.defesa,
        dados.velocidade,
        dados.range_minion || null,
        dados.lado,
        dados.id_wave || null,
        id // O ID deve ser o último valor para corresponder ao 'WHERE id = ?'
    ];

    // Executa a query de atualização.
    await db.query(sql, valores);
    
    // Retorna o minion atualizado, chamando 'buscarPorId' novamente para obter os dados mais recentes.
    return buscarPorId(id);
}

// 5. Função 'removerMinion': Lógica para deletar um minion (DELETE).
async function removerMinion(id) {
    // Executa a query SQL de DELETE, usando 'WHERE id = ?' para deletar apenas o registro específico.
    await db.query('DELETE FROM minions WHERE id = ?', [id]);
    
    // Retorna uma mensagem de sucesso (pode ser ajustado, mas é suficiente para indicar sucesso).
    return { mensagem: "Minion removido com sucesso" };
}

// Exporta todas as funções para que possam ser chamadas pelo minionsControlador.js.
module.exports = {
    criarMinion,
    listarMinions,
    buscarPorId,
    atualizarMinion,
    removerMinion
};

