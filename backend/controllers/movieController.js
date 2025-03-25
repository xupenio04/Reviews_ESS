//movieController possui as funções de criação de conteúdo

const Movie = require("../models/movie");
const mongoose = require("mongoose");
// Criar um novo filme
const createMovie = async (req, res) => {
    const {name, genre, rating, cover, synopsis} = req.body;

    if(!name || !genre || !rating || !cover.imageURL || !cover.title) {
        return res.status(400).json({message: "Todos os campos devem ser preenchidos"});
    }

    try{
        const MovieExists = await Movie.findOne({name});
        if(MovieExists){ //Se o filme já existir
            return res.status(400).json({message: "Esse filme já existe!"})
        }
        
        //Cria o novo filme
        const newMovie = new Movie({name, genre, rating, cover, synopsis});
        await newMovie.save();

        res.status(201).json({message: "Filme foi cadastrado com sucesso"})
    } catch(error){
        return res.status(500).json({message: "Erro na criação do filme ",error})
    }
}

const deleteMoviebyName = async (req,res) => {
    const {name} = req.body

    if(!name){
        return res.status(204).json({message: "Você deve informar o nome do filme a ser deletado"})
    }
    try{
        const deletedMovie = await Movie.findOneAndDelete({name: name})
        if(deletedMovie){
            res.status(200).json({message: "Filme " + name + " foi deletado"})
        }
        else{
            res.status(400).json({message: "Filme não foi encontrado"})
        }
    } catch(error){
        return res.status(500).json({message: "Erro no apagamento do filme ",error})
    }
}

const updateMoviebyName = async(req,res) => {
    const {name} = req.body
    
    if(!name){
        return res.status(400).json({message: "você deve informar o nome do filme a ser atualizado"})
    }

    try{
        const updatedMovie = await Movie.findOneAndUpdate(
            {name: name},
            req.body,
            {new: true}
        )

        if (updatedMovie){
            res.status(201).json({message: "Filme " + name + " foi atualizado", movie: updatedMovie})
        }
        else{
            res.status(400).json({message: "Filme não foi encontrado"})
        }
    } catch(error){
        return res.status(500).json({message:"Erro na adição do filme ", error})
    }
}


const getAllMovies = async (req,res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch(error){
        res.status(500).json({ message: "Erro ao encontrar filmes"})
    }
}

const findMovie = async (req,res) => {
    const {name} = req.body;
    if(!name){
        return res.status(400).json({message: "Você deve informar o nome do filme a ser procurado"})
    }
    try{
        const findMovie = await Movie.findOne({name})
        if(findMovie){
            res.status(201).json({movie: findMovie, message: "Filme foi encontrado"})
        }
        else{
            res.status(400).json({movie: null, message: "Filme não foi encontrado"})
        }
    } catch(error){
        return res.status(500).json({message: "Erro na procura do filme ",error})
    }
}
const findMovieById = async (req,res) => {
    const { id } = req.params
    console.log("achou find movie by id")
    console.log(id)
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: id });
    }
    try{
        const findMovie = await Movie.findById(new mongoose.Types.ObjectId(id));
       
        console.log(findMovie)
        if(findMovie){
            res.status(201).json({movie: findMovie, message: "Filme foi encontrado"})
        }
        else{
            res.status(400).json({movie: null, message: "Filme não foi encontrado"})
        }
    } catch(error){
        return res.status(500).json({message: "Erro na busca do filme ",error})
    }
}

const findMovieID = async (req, res) => {
    try {
      const movieId = req.params.id;
  
      // Verificar se o ID é válido
      if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(400).json({ message: 'ID inválido' });
      }
  
      // Converter o userId para ObjectId
      const objectId = new mongoose.Types.ObjectId(movieId);
  
      // Busca o usuário no banco de dados
      const movie = await Movie.findById(objectId);
  
      if (!movie) {
        return res.status(404).json({ message: 'Filme não encontrado' });
      }
  
      res.json(movie);
    } catch (error) {
      // Aqui vamos exibir o erro completo no log do servidor
      console.error("Erro ao buscar filme:", error);
  
      // Retorna uma resposta genérica com um status 500
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
};

module.exports = { createMovie, getAllMovies, deleteMoviebyName, updateMoviebyName, findMovie, findMovieById, findMovieID};