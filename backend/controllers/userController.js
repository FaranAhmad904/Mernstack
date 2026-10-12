const User = require("../models/User");


// ==========================================
// GET ALL USERS
// ==========================================

const getAllUsers = async (req, res) => {

    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            users
        });

    } catch (error) {

        console.error("GET ALL USERS ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// UPDATE USER
// ==========================================

const updateUser = async (req, res) => {

    try {

        const { name, email, role } = req.body;

        // Find user
        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }


        // Validate role
        if (role && !["USER", "ADMIN"].includes(role)) {

            return res.status(400).json({
                message: "Invalid role"
            });
        }


        // Check if email already exists
        if (email && email !== user.email) {

            const existingUser = await User.findOne({
                email
            });

            if (existingUser) {

                return res.status(400).json({
                    message: "Email is already being used"
                });
            }
        }


        // Update fields
        if (name) {
            user.name = name;
        }

        if (email) {
            user.email = email.toLowerCase();
        }

        if (role) {
            user.role = role;
        }


        await user.save();


        // Don't return password
        const updatedUser = user.toObject();
        delete updatedUser.password;


        res.json({
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {

        console.error("UPDATE USER ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// DELETE USER
// ==========================================

const deleteUser = async (req, res) => {

    try {

        const userId = req.params.id;


        // Prevent admin from deleting himself
        if (userId === req.user.userId) {

            return res.status(400).json({
                message: "You cannot delete your own account"
            });
        }


        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }


        await User.findByIdAndDelete(userId);


        res.json({
            message: "User deleted successfully"
        });

    } catch (error) {

        console.error("DELETE USER ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    getAllUsers,
    updateUser,
    deleteUser
};