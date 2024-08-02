const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userFolder = req.body.userName || "kevin";
    const tempPath = path.join(__dirname, "uploads", "temp", userFolder);

    // Crear carpeta temporal si no existe
    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath, { recursive: true });
    }

    cb(null, tempPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.array("files"), (req, res) => {
  res.send("Archivos subidos con éxito");
});

app.post("/move/:userName", (req, res) => {
  const userName = req.params.userName;
  const tempPath = path.join(__dirname, "uploads", "temporal", userName);
  const permPath = path.join(__dirname, "uploads", "permanente", userName);

  if (!fs.existsSync(tempPath)) {
    console.error(`La carpeta temporal no existe: ${tempPath}`);
    return res.status(400).send("La carpeta temporal no existe");
  }

  if (!fs.existsSync(permPath)) {
    fs.mkdirSync(permPath, { recursive: true });
  }

  fs.readdir(tempPath, (err, files) => {
    if (err) {

      console.error("Error al leer la carpeta temporal:", err);
      return res.status(500).send("Error al leer la carpeta temporal");
    }

    try {
      files.forEach((file) => {
        const oldPath = path.join(tempPath, file);
        const newPath = path.join(permPath, file);
        fs.renameSync(oldPath, newPath);
      });

      fs.rmdirSync(tempPath);
      res.send("Archivos movidos a permanente");
    } catch (moveError) {
      console.error("Error al mover los archivos:", moveError);
      res.status(500).send("Error al mover los archivos");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
