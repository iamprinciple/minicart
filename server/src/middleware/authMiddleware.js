const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    // console.log(req.body);
    const header = req.headers.authorization;
    console.log("AUTH HEADER:" ,header);
    
    if (!header || !header.startsWith("Bearer")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized. No token provided.",
        });
    }
    const token = header.split(" ")[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next()
    } catch (error) {
        return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
    }
}

module.exports = auth;