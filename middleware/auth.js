const jwt = require('jsonwebtoken');
const path = require('path');
module.exports = (req, res, next) => {
  // console.log(req.headers.cookie);
  const {
    headers: { cookie },
  } = req;
  if (!cookie) {
    req.isAuth = false;
    return res.redirect('/login');
  }
  const values = cookie.split(';').reduce((res, item) => {
    const data = item.trim().split('=');
    return { ...res, [data[0]]: data[1] };
  }, {});
  const authorization = values['Authorization'];
  // console.log(authorization);
  if (!authorization) {
    req.isAuth = false;
    return res.redirect('/login');
  }
  const token = authorization.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_JWT);
  } catch {
    req.isAuth = false;
    return res.redirect('/login');
  }
  if (!decodedToken) {
    req.isAuth = false;
    return res.redircet('/login');
  }
  req.userId = decodedToken.userId;
  req.isAuth = true;
  next();
};
