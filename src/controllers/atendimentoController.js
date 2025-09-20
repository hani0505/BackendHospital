import { z } from "zod";
import * as atendimentoService from "../services/atendimentoService.js";

const iniciarSchema = z.object({
  pacienteId: z.string().uuid(),
  medicoId: z.string().uuid(),
});

export const iniciarAtendimento = async (req, res) => {
  try {
    const { pacienteId, medicoId } = iniciarSchema.parse(req.body);
    const atendimento = await atendimentoService.iniciarAtendimento(pacienteId, medicoId);
    res.status(201).json(atendimento);
  } catch (error) {
    console.error("Controller iniciarAtendimento:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const finalizarAtendimento = async (req, res) => {
  try {
    const { id } = req.params; // Isso pega o parâmetro da URL
    console.log("Recebido request para finalizar atendimento do paciente:", id);
    
    const atendimentoFinalizado = await atendimentoService.finalizarAtendimento(id);
    
    res.status(200).json({
      message: "Atendimento finalizado com sucesso",
      data: atendimentoFinalizado
    });
  } catch (error) {
    console.error("Controller finalizarAtendimento:", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const historico = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const resultado = await atendimentoService.historico(page, pageSize);

    res.status(200).json({
      message: "Histórico carregado com sucesso",
      data: resultado.atendimentos,
      pagination: {
        currentPage: resultado.page,
        pageSize: resultado.pageSize,
        totalItems: resultado.total,
        totalPages: resultado.totalPages,
        hasNext: resultado.page < resultado.totalPages,
        hasPrev: resultado.page > 1,
      },
    });
  } catch (error) {
    console.error("Controller historico:", error.message);
    res.status(500).json({ error: error.message });
  }
};
