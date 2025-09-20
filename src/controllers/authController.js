// src/controllers/authController.js
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "segredo-super-seguro"; // coloque no .env

// Registrar médico
export const registerMedico = async (req, res) => {
  try {
    const { nome, especialidade, email, senha } = req.body;

    // já existe?
    const existe = await prisma.medico.findUnique({ where: { email } });
    if (existe) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // hashear senha
    const hash = await bcrypt.hash(senha, 10);

    const medico = await prisma.medico.create({
      data: { nome, especialidade, email, senha: hash },
    });

    res.status(201).json({ message: "Médico registrado com sucesso", medico });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login do médico
export const loginMedico = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const medico = await prisma.medico.findUnique({ where: { email } });
    if (!medico) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const senhaOk = await bcrypt.compare(senha, medico.senha);
    if (!senhaOk) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // gerar token
    const token = jwt.sign(
      { id: medico.id, email: medico.email, role: "MEDICO" },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login realizado com sucesso",
      token,
      medico: { id: medico.id, nome: medico.nome, email: medico.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
