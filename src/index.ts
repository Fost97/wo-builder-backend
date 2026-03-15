import app from "./web/app.js";

const PORT = process.env.PORT ?? 8000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
