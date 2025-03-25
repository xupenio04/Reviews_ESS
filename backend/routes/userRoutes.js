const express = require("express");
const { createUser, getUsers, findUser, followUser, deleteUser, updateUser, addWatched,addAbandoned, getWatched, getAbandoned, deleteWatched, deleteAbandoned, findWatchedInfo, findUserID, findUserByEmail } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const { login } = require("../controllers/authController"); 

const router = express.Router();

router.post("/add", createUser);
router.get("/", getUsers);
router.get("/find/:name", findUser);
router.get("/find_email/:email", findUserByEmail)
router.post("/follow", followUser);
router.delete("/:name", deleteUser);
router.put("/:name", updateUser);
router.post("/login", login);
router.post("/watched",addWatched);
router.post("/abandoned",addAbandoned);
router.get("/:name/watched", getWatched);
router.get("/:name/abandoned", getAbandoned);
router.delete("/:name/watched/:title", deleteWatched);
router.delete("/:name/abandoned/:title", deleteAbandoned);
router.get("/:id", findUserID);

module.exports = router;

