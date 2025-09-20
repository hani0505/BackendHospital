// relatorioController.js
import * as atendimentoService from '../services/relatorio.js';

export async function estatisticas(req, res) {
  try {
    const estatisticas = await atendimentoService.gerarEstatisticas();
    res.status(200).json({
      success: true,
      message: 'Relatório de estatísticas gerado com sucesso',
      data: estatisticas,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erro no estatisticas:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function downloadRelatorio(req, res) {
  try {
    const estatisticas = await atendimentoService.gerarEstatisticas();

    let csv = "tipo\tchave\tvalor\n";

    // Pacientes por status
    estatisticas.pacientesPorStatus.forEach(p => {
      csv += `Pacientes por Status\t${p.status}\t${p.quantidade}\n`;
    });

    // Duas linhas em branco antes dos médicos
    csv += "\n\n";

    // Pacientes por médico
    estatisticas.pacientesPorMedico.forEach(m => {
      csv += `Pacientes por Médico\t${m.nome} (${m.especialidade})\t${m.totalAtendidos}\n`;
    });

    // Duas linhas em branco antes dos tempos médios
    csv += "\n\n";

    // Tempos médios
    csv += `Tempo médio de espera:\t${estatisticas.temposMedios.espera}\n`;
    csv += `Tempo médio de atendimento:\t${estatisticas.temposMedios.atendimento}\n`;

    res.header("Content-Type", "text/csv");
    res.attachment(`relatorio_${Date.now()}.csv`);
    res.send(csv);

  } catch (error) {
    console.error("Erro no downloadRelatorio:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao gerar o CSV",
      details: error.message
    });
  }
}
