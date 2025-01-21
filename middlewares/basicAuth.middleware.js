const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Restricted Area"');
    return res.status(401).send("Authentication required.");
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  const { API_USER, API_PASS } = process.env;

  if (username === API_USER && password === API_PASS) {
    return next();
  } else {
    return res.status(403).send("Access denied.");
  }
};

export default basicAuth;
