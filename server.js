const PORT = process.env.PORT || 80;
const app = require('./app');

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Subtraction on the Go running at http://localhost:${PORT}`);
});
