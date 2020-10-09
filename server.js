const port = 3000;
const app = require('./app');

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Subtraction on the Go running at http://localhost:${port}`);
});
