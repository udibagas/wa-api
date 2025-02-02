const { verify } = require("jsonwebtoken");
const UnauthenticatedError = require("../errors/UnauthenticatedError");
const { User, Site } = require("../models");

exports.auth = async (req, res, next) => {
  let cookieToken = req.cookies.token;
  let token = cookieToken;

  try {
    if (!token) {
      const [type, bearerToken] = req.headers.authorization?.split(" ") ?? [];
      if (type?.toLowerCase() === "bearer") {
        token = bearerToken;
      }
    }

    if (!token) throw new UnauthenticatedError();
    const { id } = verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(id);
    if (!user) throw new UnauthenticatedError("Unregistered user");
    req.user = user;
  } catch (error) {
    return next(error);
  }

  next();
};
