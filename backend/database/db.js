// Estabelecendo conexão com o banco de dados através do MONGO_URI no arquivo .env, que contem o url do banco.
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Tentando conectar ao MongoDB com URI:", process.env.MONGO_URI); // Verifica se a URI está carregada
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;