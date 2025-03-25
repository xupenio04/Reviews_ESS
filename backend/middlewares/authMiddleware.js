const User = require("../models/user");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; 
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Usuário não autenticado" });
  }
  const token = authHeader.split(" ")[1]; 
  try {
      const decoded = jwt.verify(token, secret); 
      //console.log("decoded" + decoded)
      req.user = decoded; 
      next();
  } catch (error) {
      console.error("Erro ao verificar token:", error);
      return res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = authMiddleware;