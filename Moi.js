import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send({
      message: "Hola Mundo soy Angel Navarro CI 30595926 Seccion 1!",
    });
});

app.get("/random", (req, res) => {
    res.send({
      number: Math.floor(Math.random() * 100),
    });
});

app.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});