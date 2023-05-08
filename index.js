const express = require('express')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const multer = require("multer");
const articles = require('./data/articles.json')

const app = express()
app.use(cors())
app.use(express.json())

app.use(express.static('images'))

/**
 * Set up multer to upload files
 * use diskStorage for flexibility in storing file to images directory.
 * Format the filename
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const { fieldname, originalname } = file;
    const originalNameSplit = originalname.split(".");
    const ext = originalNameSplit[originalNameSplit.length - 1];

    cb(null, `${fieldname}-${uniqueSuffix}.${ext}`);
  },
});

//allow only jpg, jpeg, png files. Otherwise throw error.
const fileFilter = (req, file, cb) => {
  const isAllowedFileType =
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/png";

  if (isAllowedFileType) {
    cb(null, true);
    return;
  }else{
    cb(new Error("Only image files are allowed"), false);
  }
  
};

const upload = multer({ storage, fileFilter });

/**
 * GET ROUTE - Get all images in the images directory
 * and assign them an article title and description

 * Ensure that titles and descriptions are exhausted for the images before repeating from start
 */
app.get('/images', (req, res) => {
    const imageDir = path.join(__dirname, "images");
    fs.readdir(imageDir, (err, files) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Cannot retrieve images");
      }
      const data = [];

      files.forEach((image, ind) => {
        const info = articles[ind % articles.length];
        data.push({ image, ...info });
      });

      res.status(200).json(data);
    });
})

/**
 * POST ROUTE - Handles file upload.
 * When upload is completed, get correct image title and description.
 * Return the image filename with correct title and description.
 */
app.post("/upload-image", upload.single("img"), (req, res) => {
    try {
      const { itemSize } = req.body;
      const num = Number(itemSize) + 1;
      const info = articles[num % articles.length];

      res.status(200).json({ image: req.file.filename, ...info });
    } catch (error) {
      throw new Error(error.message)
    }
});

app.use(express.static(path.join(__dirname, "./frontend/dist")));

//bundle the client
app.get("/", (req, res) => {
  const entryPoint = "./frontend/dist/index.html";
  res.sendFile(path.join(__dirname, entryPoint));
});

const PORT = 5001

app.listen(PORT, console.log(`Server running on port ${PORT}`))