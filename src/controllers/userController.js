const transporter = require("../configs/nodemailer");
const validateInfos = require("./validateInfos");
const prisma = require("../configs/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { SECRET } = process.env;
const salt = 10;

async function registerUser(req, res) {
  const { name, email, password } = req.body;

  const { data, status, error } = validateInfos(email, password);
  if (error) {
    return res.status(status).json(data);
  }
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists!",
      });
    }

    const passwordEncrypted = await bcrypt.hash(password, salt);
    await prisma.user.create({
      data: {
        email,
        password: passwordEncrypted,
        name,
      },
    });
    await transporter.sendMail({
      from: "BillHadji's Corp <BillHadji_Sender@hotmail.com>",
      to: email,
      subject: "Account created successfully!",
      html: `<div>
                    <h1>Registration completed successfully!</h1>
                    <p>${name}, Thank you for registering in our system!</p>
                    <img 
                    src="https://i.pinimg.com/originals/b1/6a/c5/b16ac5344f809ad6b11ecd8c72accec0.jpg" 
                    alt="emoticon" width="50px"/>
                </div>`,
    });
    return res.json("Registered!").status(201);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  const { data, error, status } = validateInfos(email, password);
  if (error) {
    return res.status(status).json(data);
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const token = jwt.sign({ id: user.id }, SECRET, {
        expiresIn: 300,
      });
      return res.status(200).json({
        user: user,
        token: token,
        message: "User successfully logged in",
      });
    }
    return res.status(400).json("User doesn't exist. Please sign in.");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllUsers(req, res) {
  try {
    const allUsers = await prisma.user.findMany();
    if (allUsers) return res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteUser(req, res) {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json("Plase enter the user id.");
  }

  const userId = Number(id);
  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return res.status(200).json("User deleted successfully!");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error. Failed to delete user" });
  }
}

module.exports = { registerUser, loginUser, getAllUsers, deleteUser };
