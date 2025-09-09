import * as atendimentoService from '../services/relatorio.js';

export const estatisticas = async (req, res) => {
  try {
    console.log('Solicitando relatório de estatísticas...');
    
    const estatisticas = await atendimentoService.gerarEstatisticas();
    
    res.status(200).json({
      success: true,
      message: 'Relatório de estatísticas gerado com sucesso',
      data: estatisticas,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro no controller de estatísticas:', error);
    
    res.status(500).json({
      success: false,
      error: 'Erro interno ao processar o relatório',
      details: error.message
    });
  }
};