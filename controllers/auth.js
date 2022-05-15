const path = require('path');
const Users = require('./../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.getLogin = (req, res) => {
  // console.log(req);
  if (req.isAuth) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '..', 'pages', 'login.html'));
};

exports.getSignup = (req, res) => {
  // console.log(req);
  if (req.isAuth) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '..', 'pages', 'signup.html'));
};

exports.postSignup = async (req, res) => {
  // console.log(req);
  if (req.isAuth) {
    return res.redirect('/');
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 14);
    const user = new Users({
      email: req.body.email,
      password: hashedPassword,
      fullName: req.body.fullName,
      userName: req.body.userName,
    });
    const userData = await user.save();
    const token = jwt.sign({ userId: userData._id.toString() }, process.env.SECRET_JWT);
    res.status(202).json({ userId: userData._id.toString(), token: token });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

exports.postLogin = async (req, res) => {
  // console.log(req);
  if (req.isAuth) {
    return res.redirect('/');
  }
  try {
    const user = await Users.findOne({ userName: req.body.userName });
    if (!user) {
      throw new Error('user not found');
    }
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      throw new Error('password not correct');
    }
    const token = jwt.sign({ userId: user._id.toString() }, process.env.SECRET_JWT);
    res.status(202).json({ userId: user._id.toString(), token: token });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: err.message });
  }
};
