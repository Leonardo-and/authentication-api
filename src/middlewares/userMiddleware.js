const jwt = require("jsonwebtoken");
const prisma = require("../configs/prisma");
require("dotenv").config();
const { SECRET } = process.env;

async function userMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid authorization token" });
      }
      const { role } = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          role: true,
        },
      });
      if (role === "ADMIN") {
        next();
      } else {
        return res.status(401).json({ message: "You do not have permission" });
      }
    });
  } else {
    res.status(403).json("Unauthorized");
  }
}

module.exports = userMiddleware;
