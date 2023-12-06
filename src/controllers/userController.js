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

  const existentUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (!existentUser) {
    const passwordEncrypted = await bcrypt.hash(password, salt);
    await prisma.user.create({
      data: {
        email: email,
        password: passwordEncrypted,
        name: name,
      },
    });
    await transporter
      .sendMail({
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
      })
      .then(() => {
        console.log("E-mail sucessfully sent");
      })
      .catch((err) => {
        console.log(err);
        return;
      });
    return res.json("Registered!").status(201);
  } else {
    return res.status(400).json({
      error: "User already exists!",
    });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  const { data, error, status } = validateInfos(email, password);
  if (error) {
    return res.status(status).json(data);
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) {
    const token = jwt.sign({ id: user.id }, SECRET, {
      expiresIn: 300,
    });
    res.status(200).json({
      user: user,
      token: token,
      message: "User successfully logged in",
    });
  } else {
    res.status(400).json("User doesn't exist. Please sign in.");
  }
}

async function getAllUsers(req, res) {
  const users = await prisma.user.findMany();
  if (users) return res.status(200).json(users);
}

async function deleteUser(req, res) {
  const { id } = req.body;
  if (id) {
    const userId = Number(id);

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return res.status(200).json("User deleted successfully!");
  } else {
    return res.status(400).json("Plase enter the user id.");
  }
}

module.exports = { registerUser, loginUser, getAllUsers, deleteUser };
