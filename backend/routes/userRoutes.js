const express = require("express");

const {
    getAllUsers,
    updateUser,
    deleteUser
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ==========================================
// ALL ROUTES ARE ADMIN ONLY
// ==========================================

router.use(authMiddleware);
router.use(adminMiddleware);


// ==========================================
// GET ALL USERS
// GET /api/users
// ==========================================

router.get("/", getAllUsers);


// ==========================================
// UPDATE USER
// PUT /api/users/:id
// ==========================================

router.put("/:id", updateUser);


// ==========================================
// DELETE USER
// DELETE /api/users/:id
// ==========================================

router.delete("/:id", deleteUser);


module.exports = router;