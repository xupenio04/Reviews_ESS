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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const total = await Review.countDocuments();
    const reviews = await Review.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      reviews,
      hasMore: total > (skip + limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMovieReviews = async (req, res) => {
  try {
    const movieId = new mongoose.Types.ObjectId(req.params.id);
    const reviews = await Review.find({ movie: movieId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar reviews" });
  }
};

const getReviewById = async (req,res) => {
  const { id } = req.params;
  try {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(410).json({ message: "ID inválido" });
    }
    const review = await Review.findById(new mongoose.Types.ObjectId(id))
      .populate("owner")
      .populate("movie")
      .populate("likes")
      .populate({
        path: "comments",
        populate: { path: "owner", select: "name" },
      })
    const owner = review.owner;
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
  console.log("deletando a review");
  try {
      const review = await Review.findById(new mongoose.Types.ObjectId(id));
      console.log(id)
      if (!review) {
          console.log("nao achou a review")
          return res.status(404).json({ message: "Review não encontrada" });
      }

      if (review.owner.toString() !== req.user.id) {
          console.log("não é o dono")
          return res.status(403).json({ message: "Ação não permitida" });
      }
      await Review.findByIdAndDelete(new mongoose.Types.ObjectId(id));
      console.log("review sendo deletada");
      res.json({ message: "Review excluída com sucesso" });
  } catch (error) {
      console.log(error)
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

const unlikeReview = async (req, res) => {
  const { reviewId } = req.body;

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
      { $pull: { likes: req.user.id } }, 
      { new: true }
    );

    return res.status(200).json({ message: "Review descurtida com sucesso", review: updatedReview });
  } catch (error) {
    console.error("Erro ao descurtir a review: ", error);
    return res.status(500).json({ message: "Erro interno ao descurtir a review", error: error.message });
  }
};
const filterReviews = async (req, res) => {
  try {
    const { classification, genre, title } = req.body;

    //Classification é atributo da própria review então isso é testado primeiro
    let reviewFilter = {};
    if (classification) reviewFilter.classification = classification;
    
    let reviews = await Review.find(reviewFilter);
    
    
    if (!genre && !title) {
      return res.status(200).json({message: reviews.length > 0 ? "Reviews Encontradas" : "Nenhuma review corresponde aos filtros", review: reviews});
    }
    
    // Extrair por gênero e título que são atributos do objeto movie
    const contentIds = reviews.filter(review=>review.movie!=undefined).map(review => review.movie);
    
    const contentFilter = { _id: { $in: contentIds } };
    if (genre) contentFilter.genre = genre;
    if (title) contentFilter.name = title;
    
    const validContents = await Movie.find(contentFilter);
    const validContentIds = validContents.map(content => content._id.toString());
    const filteredReviews = reviews.filter(review => 
      review.movie && validContentIds.includes(review.movie.toString())
    );
    return res.status(200).json({message: filteredReviews.length > 0 ? "Reviews Encontradas" : "Nenhuma review corresponde aos filtros", review: filteredReviews});
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar reviews"});
  }
};

module.exports = { createReview, getReviews, deleteReview, editReview, likeReview, getReviewById, unlikeReview, filterReviews, getMovieReviews};
