import { z } from "zod";
import * as doctorService from "../services/medService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_forte";

// schema validation
const createMdSchema = z.object({
  nome: z.string().min(3, "o nome é obrigatório"),
  especialidade: z.enum(["CARDIOLOGISTA", "PEDIATRIA", "ORTOPEDISTA"]),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "mínimo 6 caracteres"),
});

export const createDoctor = async (req, res) => {
  try {
    const validate = createMdSchema.parse(req.body);

    // hash da senha
    const senhaHash = await bcrypt.hash(validate.senha, 10);

    // salva no banco via service
    const doctor = await doctorService.createDoctor({
      ...validate,
      senha: senhaHash,
    });

    // gera token
    const token = jwt.sign(
      { id: doctor.id, email: doctor.email, role: "medico" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Médico cadastrado com sucesso",
      doctor: { id: doctor.id, nome: doctor.nome, email: doctor.email, especialidade: doctor.especialidade },
      token,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
};

// login do médico
export const loginDoctor = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const doctor = await doctorService.getDoctorByEmail(email);
    if (!doctor) return res.status(401).json({ error: "Credenciais inválidas" });

    const senhaCorreta = await bcrypt.compare(senha, doctor.senha);
    if (!senhaCorreta) return res.status(401).json({ error: "Credenciais inválidas" });

    const token = jwt.sign(
      { id: doctor.id, email: doctor.email, role: "medico" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login realizado com sucesso",
      doctor: { id: doctor.id, nome: doctor.nome, email: doctor.email, especialidade: doctor.especialidade },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// listar médicos (rota aberta ou pode proteger depois)
export const getDoctors = async (req, res) => {
  try {
    const doctors = await doctorService.getDoctors();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
