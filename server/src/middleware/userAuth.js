const isUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Users only.",
    });
  }
  next();
};

module.exports = isUser;
