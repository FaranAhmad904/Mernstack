// ==========================================
// IMPORT JWT
// ==========================================

const jwt = require("jsonwebtoken");


// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

const authMiddleware = (req, res, next) =>
{
    try
    {
        // ==========================================
        // GET AUTHORIZATION HEADER
        // ==========================================

        const authHeader = req.headers.authorization;


        // ==========================================
        // CHECK AUTHORIZATION HEADER
        // ==========================================

        if (!authHeader)
        {
            return res.status(401).json({
                message: "No token provided"
            });
        }


        // ==========================================
        // GET TOKEN
        // ==========================================

        const token = authHeader.split(" ")[1];


        if (!token)
        {
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


        // ==========================================
        // SAVE USER INFORMATION
        // ==========================================

        req.user = {
            ...decoded,
            id: decoded.userId || decoded.id || decoded._id
        };


        // ==========================================
        // CONTINUE
        // ==========================================

        next();
    }
    catch (error)
    {
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


// ==========================================
// EXPORT MIDDLEWARE
// ==========================================

module.exports = authMiddleware;