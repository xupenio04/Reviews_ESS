// userController possui as funções de criação e alteração dos usuários

const User = require("../models/user");

// Criar um novo usuário
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Avisando se algum campo nao for preenchido
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "A senha deve ter pelo menos 8 caracteres" });
  }

  // Verifica se já existe um usuario com este email
  try {
    const nameExists = await User.findOne({ name });
    if (nameExists) {
      return res.status(400).json({ message: "Username já cadastrado" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }
    const reviews = []
    // Cria o novo usuario no banco
    const newUser = new User({ name, email, password, reviews});
    await newUser.save();

    res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário", error });
    console.log(error)
  }
};

// Obter todos os usuários
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
};

// Obter usuário por ID
const findUser = async (req, res) => {
  try {
    const user = await User.findOne({name : req.params.name});

    if(!user){
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};

const followUser = async (req, res) => {
  try{
    const {originName, destinationName} = req.body;

    if(!originName || !destinationName){
      return res.status(400).json({ message: "Nomes são obrigatórios"});
    }

    if(originName == destinationName){
      return res.status(400).json({ message: "Você não pode seguir a si mesmo"});
    }
    const origin = await User.findOne({name: originName});
    const destination = await User.findOne({name: destinationName});

    if(!origin || !destination) {
      return res.status(404).json({message: "Usuário não encontrado"});
    }

    // Caso o usuário não esteja na lista de "seguindo" do destinatário, o adiciona.
    if(!destination.followers.includes(originName)){ 
      destination.followers.push(originName);
      await destination.save();
    }

    // Adiciona o usuário na lista de seguidos do remetente da solicitação
    if(!origin.following.includes(destinationName)){
      origin.following.push(destinationName);
      await origin.save();
    }

    res.status(200).json({ message: `${origin.name} agora segue ${destination.name}`});

  }
  
    catch (error) {
    res.status(500).json({ message: "Erro ao seguir usuário", error });
    }

};

const deleteUser = async (req, res) => {
  try{
    const user = await User.findOne({name : req.params.name}) ;

    if(!user) {
      return res.status(400).json({ message: "Usuário não encontrado"});
    }

    // Removendo o usuário das listas de seguindo/seguidores
    await User.updateMany(
      { followers: user.name},
      { $pull: { followers: user.name}}
    );

    await User.updateMany(
      { following: user.name},
      { $pull: { following: user.name}}
    );

    // Deletando o usuário do banco
    await User.deleteOne({name : user.name});
    res.status(200).json({ message: "Usuário deletado com sucesso" });

  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ message: "Erro ao deletar usuário", error });
  }
};

const updateUser = async (req, res) => {
  try{
    const user = await User.findOne({name: req.params.name});
    const {newName, newEmail, newPassword} = req.body;
    const updates = {};
    if(!user){
      return res.status(400).json({ message : "Usuário não encontrado"});
    }

    if(newEmail){
      updates.email = newEmail;
    }
    if(newPassword){
      updates.password = newPassword;
    }
    if(newName){
      updates.name = newName;
    }

    await User.updateOne({name: user.name},{$set: updates});
    res.status(200).json({ message: "Usuário atualizado com sucesso" });

  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ message: "Erro ao atualizar usuário", error });
  }
};

const addWatched = async (req, res) => {
  const { name, title, avaliation } = req.body;
  
  // Verifica se todos os campos necessários foram fornecidos
  if (!name || !title || !avaliation) {
    return res.status(400).json({ message: "Todos os campos (name, title, avaliation) são obrigatórios" });
  }

  try {
    // Encontra o usuário
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Cria o objeto para adicionar ao campo 'watched'
    const filmData = { title, avaliation };

    // Adiciona o filme à lista 'watched' do usuário
    user.watched.push(filmData);

    // Salva as alterações no banco de dados
    await user.save();

    // Responde ao cliente com sucesso
    res.status(200).json({ message: "Filme adicionado à lista de assistidos com sucesso!" });

  } catch (error) {
    console.error("Erro ao adicionar filme:", error);
    res.status(500).json({ message: "Erro ao adicionar filme", error });
  }
};

const addAbandoned = async (req, res) => {
  const { name, title, avaliation } = req.body;
  
  // Verifica se todos os campos necessários foram fornecidos
  if (!name || !title || !avaliation) {
    return res.status(400).json({ message: "Todos os campos (name, title, avaliation) são obrigatórios" });
  }

  try {
    // Encontra o usuário
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Cria o objeto para adicionar ao campo 'watched'
    const filmData = { title, avaliation };

    // Adiciona o filme à lista 'watched' do usuário
    user.abandoned.push(filmData);

    // Salva as alterações no banco de dados
    await user.save();

    // Responde ao cliente com sucesso
    res.status(200).json({ message: "Filme adicionado à lista de abandonados com sucesso!" });

  } catch (error) {
    console.error("Erro ao adicionar filme:", error);
    res.status(500).json({ message: "Erro ao adicionar filme", error });
  }
};

const getWatched = async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name });
     console.log(user.watched);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(user.watched);
  } catch (error) {
    console.error("Erro ao buscar lista de assistidos:", error);
    res.status(500).json({ message: "Erro ao buscar lista de assistidos", error });
  }
};

const getAbandoned = async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name });
     console.log(user.abandoned);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(user.abandoned);
  } catch (error) {
    console.error("Erro ao buscar lista de abandonados:", error);
    res.status(500).json({ message: "Erro ao buscar lista de abandonados", error });
  }
};

const deleteWatched = async (req, res) => {
  const { title } = req.params;  // Corrigindo a forma de acessar o título
  const { name } = req.params;   // Extraindo o nome do usuário dos parâmetros
  
  // Encontrar o usuário
  const user = await User.findOne({ name });

  if (!user) {
    return res.status(400).json({ message: "Usuário não foi encontrado" });
  }

  if (!title) {
    return res.status(204).json({ message: "Você deve informar o nome do filme a ser deletado" });
  }

  try {
    // Remove o filme com o título informado do array 'watched' do usuário
    const deletedMovie = await User.updateOne(
      { _id: user._id },  // Encontrando o usuário pelo _id
      { $pull: { watched: { title } } } // Removendo o filme com o título correspondente
    );

    if (deletedMovie) {
      res.status(200).json({ message: `Filme "${title}" foi deletado` });
    } else {
      res.status(400).json({ message: "Filme não foi encontrado na lista de assistidos" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Erro no apagamento do filme", error });
  }
};


const deleteAbandoned = async (req, res) => {
  const { title } = req.params;  // Corrigindo a forma de acessar o título
  const { name } = req.params;   // Extraindo o nome do usuário dos parâmetros
  
  // Encontrar o usuário
  const user = await User.findOne({ name });

  if (!user) {
    return res.status(400).json({ message: "Usuário não foi encontrado" });
  }

  if (!title) {
    return res.status(204).json({ message: "Você deve informar o nome do filme a ser deletado" });
  }

  try {
    // Remove o filme com o título informado do array 'watched' do usuário
    const deletedMovie = await User.updateOne(
      { _id: user._id },  
      { $pull: { abandoned: { title } } } // Removendo o filme com o título correspondente
    );

    if (deletedMovie) {
      res.status(200).json({ message: `Filme "${title}" foi deletado` });
    } else {
      res.status(400).json({ message: "Filme não foi encontrado na lista de abandonados" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Erro no apagamento do filme", error });
  }
};



module.exports = { createUser, getUsers, findUser, followUser, deleteUser, updateUser, addWatched, addAbandoned,getWatched, getAbandoned, deleteWatched, deleteAbandoned};
