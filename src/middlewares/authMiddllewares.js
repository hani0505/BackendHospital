import jwt from "jsonwebtoken";

export const authMedico = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token inválido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ error: "Token inválido" });
    }

    req.medico = decoded; // salva dados do médico no request
    next();
  } catch (err) {
    console.error("Erro no authMedico:", err);
    return res.status(401).json({ error: "Erro de autenticação" }); // sempre JSON
  }
};
