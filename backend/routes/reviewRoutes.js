const express = require("express");
const { createReview, getReviews, deleteReview, editReview, likeReview, getReviewById, unlikeReview, filterReviews} = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, createReview);
router.get("/getReview/:id", getReviewById);
router.get("/get", getReviews);
router.delete("/delete", authMiddleware, deleteReview);
router.put("/edit", authMiddleware, editReview);
router.put("/like", authMiddleware, likeReview);
router.delete("/unlike", authMiddleware, unlikeReview);
router.post("/filter", filterReviews);

module.exports = router; 