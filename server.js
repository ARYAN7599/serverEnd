const express = require("express");
const multer = require('multer');
const cors = require('cors');

var app = express();
app.use(cors());


const storage = multer.diskStorage({
    // uploadPath = __dirname + '/images/' + sampleFile.name;
    destination: function (req, file, callback) {
        callback(null, __dirname + '/images');
    },
    // Sets file(s) to be saved in uploads folder in same directory
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
 
  })
  

const upload = multer({ storage: storage })

app.post("/upload", upload.array("file"), (req, res) => {


    console.log(req.body);
    console.log(req.files);
    res.json({ message: "File(s) uploaded successfully" });

});

app.listen(5000, function(){
    console.log("Server running on port 5000");
});