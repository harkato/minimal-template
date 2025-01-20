const jsonServer = require('json-server');
const middleware = jsonServer.defaults();

const router = jsonServer.router('db.json');

const app = jsonServer.create();

app.use(middleware);
app.use(jsonServer.bodyParser);
app.use(router);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const port = 3001;
app.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});