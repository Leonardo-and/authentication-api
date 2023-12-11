const jwt = require("jsonwebtoken");
const prisma = require("../configs/prisma");
require("dotenv").config();
const { SECRET } = process.env;

async function userMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET);
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          role: true,
        },
      });
      if (user.role === "ADMIN") return next();

      return res.status(401).json({ message: "You do not have permission" });
    } catch (error) {
      return res.status(401).json({ message: "Invalid authorization token" });
    }
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }
}

module.exports = userMiddleware;
