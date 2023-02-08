const port = process.env.PORT || 5000;
const express = require('express');
const multer = require('multer');
const app = express();
const cors = require('cors');
var bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, "images");

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(cors());
app.use(fileUpload());
app.use('/images', express.static('./images'));

app.post('/upload', function (req, res) {
    let sampleFile;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    console.log("req.files", req.files);
    sampleFile = req.files.file;
    console.log("samplefiles", sampleFile);
    uploadPath = __dirname + '/images/' + sampleFile.name;

    sampleFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);
        console.log("https://blockchaintimes.live/images/" + sampleFile.name)
        res.send('File uploaded!');
    });
});

// app.post("/upload", upload.array("file"), (req, res) => {


//     console.log(req.body);
//     console.log(req.files);
//     res.json({ message: "File(s) uploaded successfully" });

// });

app.listen(5000, function(){
    console.log("Server running on port 5000");
});

app.get("/", (req, res) => {
    fs.readdir(dirPath, (err, images) => {
        return res.send(images);
    })

});

app.delete("/", (req, res) => {
    let fileName = req.query.fileName;
    console.log(fileName);
    const directoryPath = `images/${fileName}`;
    console.log(directoryPath);
    try {
        fs.unlinkSync(directoryPath);
    
        res.status(200).send({
          message: "File is deleted.",
        });
      } catch (err) {
        res.status(500).send({
          message: "Could not delete the file. " + err,
        });
    }
});

app.listen(port, () => console.log(`${port}`))



// const express = require("express");
// const multer = require('multer');
// const cors = require('cors');

// var app = express();
// app.use(cors());


// const storage = multer.diskStorage({
//     // uploadPath = __dirname + '/images/' + sampleFile.name;
//     destination: function (req, file, callback) {
//         callback(null, __dirname + '/images');
//     },
//     // Sets file(s) to be saved in uploads folder in same directory
//     filename: function (req, file, callback) {
//         callback(null, file.originalname);
//     }
 
//   })
  

// const upload = multer({ storage: storage })

// app.post("/upload", upload.array("file"), (req, res) => {


//     console.log(req.body);
//     console.log(req.files);
//     res.json({ message: "File(s) uploaded successfully" });

// });

// app.listen(5000, function(){
//     console.log("Server running on port 5000");
// });