const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");

router.post('/register', UserController.createUser);
router.post('/login', UserController.loginUser);
router.put('/update-user/:id', UserController.updateUser);
router.delete('/delete-user/:id', authMiddleware, UserController.deleteUser);
router.get('/getAll', authMiddleware, UserController.getAllUser);
router.get('/get-details/:id', authUserMiddleware, UserController.getDetailUser);
router.post('/refresh-token', UserController.refreshToken);

module.exports = router;