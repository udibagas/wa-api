const { User } = require("../models");
const UnauthenticatedError = require("../errors/UnauthenticatedError");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      attributes: { include: ["password"] },
    });

    if (!user) {
      throw new UnauthenticatedError("Invalid email or password");
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw new UnauthenticatedError("Invalid email or password");
    }

    const token = await user.generateAuthToken();
    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({ message: "Logged out" });
};
