// ==========================================
// IMPORT JWT
// ==========================================

const jwt = require("jsonwebtoken");


// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

const authMiddleware = (req, res, next) => {

    try {

        // ==========================================
        // GET AUTHORIZATION HEADER
        // ==========================================

        const authHeader =
            req.headers.authorization;

        console.log(
            "AUTH HEADER:",
            authHeader
        );


        // ==========================================
        // CHECK HEADER
        // ==========================================

        if (!authHeader) {

            return res.status(401).json({
                message: "No token provided"
            });
        }


        // ==========================================
        // GET TOKEN
        // ==========================================

        const token =
            authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({
                message: "Invalid token format"
            });
        }


        // ==========================================
        // VERIFY TOKEN
        // ==========================================

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        console.log(
            "DECODED TOKEN:",
            decoded
        );


        // ==========================================
        // SAVE USER INFORMATION
        // ==========================================

        req.user = decoded;


        // ==========================================
        // CONTINUE
        // ==========================================

        next();

    } catch (error) {

        console.error(
            "JWT ERROR:",
            error.message
        );

        return res.status(401).json({
            message: "Invalid or expired token",
            error: error.message
        });
    }
};


module.exports = authMiddleware;