require("dotenv").config();
const express = require("express");
const connectDB = require("./database/db");
const userRoutes = require("./routes/userRoutes");
const listRoutes = require('./routes/listRoutes');

const app = express();

// Conectar ao banco de dados
connectDB();

// Middlewares
app.use(express.json());

// Rota para efetuar procedimentos com os usuários do banco
app.use("/users", userRoutes);
app.use("/api",listRoutes)


// Inicia o servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
