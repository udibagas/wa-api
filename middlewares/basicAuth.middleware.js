const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Restricted Area"');
    return res.status(401).send("Authentication required.");
  }

  const base64Credentials = authHeader.split(" ")[1];
  const [username, password] = Buffer.from(base64Credentials, "base64")
    .toString("ascii")
    .split(":");

  const { API_USER, API_PASS } = process.env;

  if (username === API_USER && password === API_PASS) {
    return next();
  }

  return res.status(403).send("Access denied.");
};

module.exports = basicAuth;
