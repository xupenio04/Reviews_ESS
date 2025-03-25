const express = require("express");
const {createComment, deleteComment, likeComment, unlikeComment} = require("../controllers/commentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();


router.post("/add", authMiddleware, createComment);
router.delete("/delete", authMiddleware, deleteComment);
router.put("/like", authMiddleware, likeComment);
router.delete("/unlike", authMiddleware, unlikeComment);
module.exports = router; 