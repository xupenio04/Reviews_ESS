const Review = require("../models/review");
const User = require("../models/user");
const Movie = require("../models/movie");
const mongoose = require("mongoose");
const { loggedInUser } = require("../routes/userRoutes");

const createReview = async (req, res) => {
    const { title, body, classification, movie} = req.body;
    
  
    if (!title) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    } 
    if (classification < 0) {
      return res.status(400).json({ message: "Preencha todos os campos" });
    }
    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado"});
    }
    const movieId = new mongoose.Types.ObjectId(movie)
    try{
        const newReview = new Review({ title, body, classification, owner: req.user.id, likes: [], movie: movieId});
        await newReview.save();
        const updatedUser= await User.updateOne(
          { _id: new mongoose.Types.ObjectId(req.user.id) },  
          { $push: { review: newReview._id } }         
        );
        const myUser = await User.findById(new mongoose.Types.ObjectId(req.user.id));
        if (updatedUser.nModified === 0) {
          await Review.findByIdAndDelete(new mongoose.Types.ObjectId(newReview._id));
          return res.status(404).json({ message: "Usuário não encontrada ou não foi atualizada" });
        }
        res.status(201).json({
          message: "Review criada com sucesso",
          id: newReview._id.toString()  
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erro ao criar review", error });
    }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("owner").populate("movie");
    res.json(reviews);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: `Erro ${error} ao buscar reviews` });
  }
};

const getReviewById = async (req,res) => {
  const { id } = req.params;
  try {
    console.log("Recebendo ID:", id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(410).json({ message: "ID inválido" });
    }
    const review = await Review.findById(new mongoose.Types.ObjectId(id))
      .populate("owner")
      .populate("movie")
      .populate({
        path: "comments",
        populate: { path: "owner", select: "name" },
      })
    const owner = await User.findById(new mongoose.Types.ObjectId(review.owner));
    const movie = await Movie.findById(new mongoose.Types.ObjectId(review.movie));
    if (!review) {
      return res.status(404).json({ message: "Review não encontrado" });
    }
    res.json({
      review,
      owner,
      movie
    });
  } catch (error) {
    console.log("tipo do erro"+ error.message)
    res.status(500).json({ message: "Erro ao buscar reviews" });
  }
}

const deleteReview = async (req, res) => {
  const { id } = req.body; 

  try {
      const review = await Review.findById(new mongoose.Types.ObjectId(id));

      if (!review) {
          return res.status(404).json({ message: "Review não encontrada" });
      }

      if (review.owner.toString() !== req.user.id) {
          return res.status(403).json({ message: "Ação não permitida" });
      }
      await Review.findByIdAndDelete(new mongoose.Types.ObjectId(id));
      res.json({ message: "Review excluída com sucesso" });
  } catch (error) {
      res.status(500).json({ message: "Erro ao excluir review", error });
  }
};

const editReview = async (req, res) => {
  const {id, updates} = req.body; 
  try {
      const review = await Review.findById(new mongoose.Types.ObjectId(id));
      if (!review) {
          return res.status(404).json({ message: "Review não encontrada" });
      }
      if (review.owner.toString() !== req.user.id) {
          return res.status(403).json({ message: "Ação não permitida" });
      }
      const updatedReview = await Review.findByIdAndUpdate(id, {body: updates}, { new: true });
      res.status(200).json({ message: "Review editada com sucesso", review: updatedReview })
  } catch (error) {
      res.status(500).json({ message: "Erro ao editar a review", error });
  }
};

const likeReview = async (req, res) => {
  const { reviewId } = req.body;
  console.log("CURTINDO A REVIEW")
  if (!reviewId) {
    return res.status(400).json({ message: "O ID da review é obrigatório" });
  }
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }
  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review não encontrada" });
    }
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $addToSet: { likes: req.user.id } },
      { new: true }
    );
    return res.status(200).json({ message: "Review curtida com sucesso", review: updatedReview });
  } catch (error) {
    console.error("Erro ao curtir a review: ", error);
    return res.status(500).json({ message: "Erro interno ao curtir a review", error: error.message });
  }
};



module.exports = { createReview, getReviews, deleteReview, editReview, likeReview, getReviewById};