const Comment = require("../models/comment");
const Review = require("../models/review");
const mongoose = require("mongoose");
const { loggedInUser } = require("../routes/userRoutes");

const createComment = async (req, res) => {
    const {body, review} = req.body;
    
    if (!body || !review) {
        console.log("body" + body);
        console.log(review);
        return res.status(400).json({ message: "Preencha todos os campos" });
    } 
    if (!req.user) {
        console.log(user+"user")
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    try{
        const newComment = new Comment({ body, review, owner: req.user.id, likes: []});
        console.log(review)
        const reviewCommented = Review.findById(new mongoose.Types.ObjectId(review));
        console.log(newComment._id)
        await newComment.save();
        const updatedReview = await Review.updateOne(
            { _id: new mongoose.Types.ObjectId(review) },  
            { $push: { comments: newComment._id } }         
        );
        if (updatedReview.nModified === 0) {
            return res.status(404).json({ message: "Review não encontrada ou não foi atualizada" });
        }
        res.status(201).json({
            message: "Comentário criado com sucesso",
            id: newComment._id, 
            comment: newComment 
        });
    } catch (error) {
        res.status(500).json({ message: `Erro ao criar comentário ${error.text}`, error });
    }
};
const deleteComment = async (req, res) => {
    const { id } = req.body; 
    console.log("entrou em delete");
  try {
    const comment = await Comment.findById(new mongoose.Types.ObjectId(id));
    if (!comment) {
        console.log("nao encontrado" + id);
        return res.status(404).json({ message: "Comentário não encontrado" });
    }
    //somente o dono da review ou dono do comentário podem o excluir 
    const review = await Review.findById(new mongoose.Types.ObjectId(comment.review));
    if (comment.owner.toString() !== req.user.id && review.owner.toString() !== req.user.id) {
        console.log("nao é o dono");
        return res.status(403).json({ message: "Ação não permitida" });
    }
    await Comment.findByIdAndDelete(new mongoose.Types.ObjectId(id));
    console.log("deu tudp certo deletando")
    res.status(201).json({ message: "Comentário excluído com sucesso" });
    } catch (error) {
        console.log("erro deletando");
        res.status(500).json({ message: "Erro ao excluir Comentário", error });
    }

};
const likeComment = async (req, res) => {
    const { commentId } = req.body;
    if (!commentId) {
        return res.status(400).json({ message: "O ID do comentário é obrigatório" });
    }
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comentário não encontrado" });
        }
        if (comment.likes.includes(req.user.id)) {
            return res.status(400).json({ message: "Você já curtiu este comentário" });
        }
        comment.likes.push(req.user.id);
        await comment.save();
        return res.status(200).json({ message: "Comentário curtido com sucesso", comment });
    } catch (error) {
        console.error("Erro ao curtir o comentário:", error);
        console.log(error)
        return res.status(500).json({ message: "Erro interno ao curtir o comentário", error });
    }
};
const unlikeComment = async (req, res) => {
    const { commentId } = req.body;
    if (!commentId) {
        return res.status(400).json({ message: "O ID do comentário é obrigatório" });
    }
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comentário não encontrado" });
        }   

        
        const likeIndex = comment.likes.indexOf(req.user.id);
        if (likeIndex === -1) {
            return res.status(400).json({ message: "Você não curtiu este comentário ainda" });
        }

        
        comment.likes.splice(likeIndex, 1);
        await comment.save();

        return res.status(200).json({ message: "Comentário descurtido com sucesso", comment });
    } catch (error) {
        console.error("Erro ao descurtir o comentário:", error);
        return res.status(500).json({ message: "Erro interno ao descurtir o comentário", error });
    }
};
    
module.exports = {createComment, deleteComment, likeComment, unlikeComment};
