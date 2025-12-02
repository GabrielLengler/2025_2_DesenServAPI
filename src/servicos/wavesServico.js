// Importa o módulo de configuração do banco de dados para todas as interações SQL.
const db = require('../configuracoes/db');

// --- OPERAÇÕES CRUD (CREATE) ---
// Função para inserir uma nova wave no banco de dados.
async function criarWave(wave) {
    // Define a query SQL de inserção. Note a grande quantidade de campos para capturar
    // todos os dados da simulação (times Azul e Vermelho, estado, etc.).
    const sql = `
        INSERT INTO waves (
            lane_azul, tipo_wave_azul, campeao_azul, estrategia_azul, minions_total_azul,
            lane_vermelho, tipo_wave_vermelho, campeao_vermelho, estrategia_vermelho, minions_total_vermelho,
            estado, vencedor, id_usuario
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Array de valores, na ordem exata da query SQL.
    const valores = [
        // Dados do Time Azul
        wave.lane_azul,
        wave.tipo_wave_azul,
        wave.campeao_azul,
        wave.estrategia_azul,
        wave.minions_total_azul,

        // Dados do Time Vermelho
        wave.lane_vermelho,
        wave.tipo_wave_vermelho,
        wave.campeao_vermelho,
        wave.estrategia_vermelho,
        wave.minions_total_vermelho,

        // Dados de Estado (default: 'em_andamento')
        wave.estado || 'em_andamento', 
        wave.vencedor || null,          // Inicialmente, vencedor é nulo.
        wave.id_usuario || null         // ID do usuário que criou a wave (se houver).
    ];

    // Executa a query de inserção.
    const [resultado] = await db.query(sql, valores);
    
    // Retorna o objeto da wave recém-criada, consultando-o pelo ID gerado.
    return consultarWave(resultado.insertId);
}

// --- OPERAÇÕES CRUD (READ ONE) ---
// Função para buscar uma wave específica pelo ID.
async function consultarWave(id) {
    const [linhas] = await db.query('SELECT * FROM waves WHERE id = ?', [id]);
    // Retorna o primeiro resultado ou 'null' se não for encontrado.
    return linhas[0] || null;
}

// --- OPERAÇÕES CRUD (UPDATE) ---
// Função para atualizar os dados de uma wave.
async function atualizarWave(id, dados) {
    // Query SQL de atualização (longa, pois cobre muitos campos).
    const sql = `
        UPDATE waves SET
            lane_azul = ?, tipo_wave_azul = ?, campeao_azul = ?, estrategia_azul = ?, minions_total_azul = ?,
            lane_vermelho = ?, tipo_wave_vermelho = ?, campeao_vermelho = ?, estrategia_vermelho = ?, minions_total_vermelho = ?,
            estado = ?, vencedor = ?
        WHERE id = ?
    `;

    // Array de valores de atualização.
    const valores = [
        dados.lane_azul,
        dados.tipo_wave_azul,
        dados.campeao_azul,
        dados.estrategia_azul,
        dados.minions_total_azul,

        dados.lane_vermelho,
        dados.tipo_wave_vermelho,
        dados.campeao_vermelho,
        dados.estrategia_vermelho,
        dados.minions_total_vermelho,

        dados.estado,
        dados.vencedor,

        id // ID para a cláusula WHERE.
    ];

    // Executa a query de atualização.
    await db.query(sql, valores);
    // Retorna o objeto atualizado.
    return consultarWave(id);
}

// --- OPERAÇÕES CRUD (DELETE) ---
// Função para remover uma wave pelo ID.
async function removerWave(id) {
    // Executa a query SQL de DELETE.
    await db.query('DELETE FROM waves WHERE id = ?', [id]);
    return { mensagem: "Wave deletada com sucesso" };
}

// --- OPERAÇÕES CRUD (READ ALL) ---
// Função para listar todas as waves.
async function listarWaves() {
    const [linhas] = await db.query('SELECT * FROM waves');
    return linhas;
}

// -------------------------------------------
// 🧠 SIMULAÇÃO DE WAVE (LÓGICA DE NEGÓCIO)
// -------------------------------------------
async function simularWave(idWave) {

    // 1 — Carregar a wave principal
    const [waves] = await db.query("SELECT * FROM waves WHERE id = ?", [idWave]);
    const wave = waves[0];

    // Validação: Garante que a wave exista.
    if (!wave) {
        throw new Error("Wave não encontrada");
    }

    // 2 — Carregar minions dessa wave
    // Busca todos os minions que estão associados a este ID de wave.
    const [minions] = await db.query("SELECT * FROM minions WHERE id_wave = ?", [idWave]);

    // Separa minions por lado (Azul e Vermelho).
    const azul = minions.filter(m => m.lado === "azul");
    const vermelho = minions.filter(m => m.lado === "vermelho");

    // 3 — Calcular PUSH POWER básico (Potência de Empurrão)
    // Função auxiliar para calcular o peso total do push da wave.
    const pushBase = (lista) => {
        return lista.reduce((total, m) => {
            let peso = 1; // Peso padrão para minions.

            // Aplica pesos maiores dependendo do tipo do minion (como no LoL).
            if (m.tipo === "guerreiro") peso = 1.2;
            if (m.tipo === "mago") peso = 1.5;
            if (m.tipo === "catapulta") peso = 3.0; // Catapultas têm o maior peso.

            return total + peso;
        }, 0); // Começa o total em 0.
    };

    let pushAzul = pushBase(azul);
    let pushVermelho = pushBase(vermelho);

    // 4 — Aplicar estratégia (Modificadores de Push)
    // Função auxiliar para ajustar o valor do push com base na estratégia do jogador.
    const aplicarEstrategia = (estrategia, valor) => {
        switch (estrategia) {
            case "freeze": return valor * 0.8;   // Freeze diminui o poder de push (empurrar a lane).
            case "slow_push": return valor * 1.2; // Slow push aumenta um pouco o poder de push.
            case "fast_push": return valor * 1.5; // Fast push aumenta muito o poder de push.
            default: return valor;
        }
    };

    // Aplica a estratégia de cada lado.
    pushAzul = aplicarEstrategia(wave.estrategia_azul, pushAzul);
    pushVermelho = aplicarEstrategia(wave.estrategia_vermelho, pushVermelho);

    // 5 — Campeões influenciam o push
    // Se houver um campeão presente, adiciona um bônus simples (10%).
    if (wave.campeao_azul) pushAzul *= 1.1;
    if (wave.campeao_vermelho) pushVermelho *= 1.1;

    // 6 — Determinar vencedor
    let vencedor = "empatado";
    if (pushAzul > pushVermelho) vencedor = "azul";
    else if (pushVermelho > pushAzul) vencedor = "vermelho";

    // 7 — Atualizar wave (Persistência do Resultado)
    // Salva o resultado da simulação (vencedor e estado 'finalizada') no banco de dados.
    await db.query(
        "UPDATE waves SET vencedor = ?, estado = 'finalizada' WHERE id = ?",
        [vencedor, idWave]
    );

    // 8 — Retornar Resultado
    return {
        id_wave: idWave,
        push_azul: pushAzul,
        push_vermelho: pushVermelho,
        vencedor
    };
}


// -------------------------------------------
// EXPORTAR
// -------------------------------------------
// Exporta todas as funções para serem usadas pelo wavesControlador.js.
module.exports = {
    criarWave,
    consultarWave,
    atualizarWave,
    removerWave,
    listarWaves,
    simularWave
};
