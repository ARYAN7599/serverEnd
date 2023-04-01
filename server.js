// const port = process.env.PORT || 5000;
// const express = require('express');
// const multer = require('multer');
// const sharp = require("sharp");
// const app = express();
// const cors = require('cors');
// var bodyParser = require('body-parser');
// // const fileUpload = require('express-fileupload');
// const fs = require('fs');
// const path = require('path');
// const dirPath = path.join(__dirname, "images");

// app.use(bodyParser.urlencoded({ extended: false }))

// app.use(bodyParser.json())

// app.use(cors());
// // app.use(fileUpload());
// app.use('/images', express.static('./images'));

// var count = 1;

// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, __dirname + '/images');
//     },
//     filename: function (req, file, callback) {
//         callback(null, `${Date.now()+"."+ file.originalname.split(".")[1]}`);
//         console.log("ssa",file.originalname.split(".")[1]);
//     }
// });
// const upload = multer({ storage: storage });





// app.post("/upload", upload.array("file"), (req, res) => {
//     // console.log(req.body);
//     if (!req.files || Object.keys(req.files).length === 0) {
//                 return res.status(400).send('No files were uploaded.');
//             }
//     const array= req.files;
//     // console.log(req.files);
//     var s = [];
//     for( let x = 0 ; x < array.length ; x++ )
//     {
//         let newImage= (array[x].filename.split(".")[0]+x+"."+ array[x].filename.split(".")[1]);
//         console.log("sss",newImage)
//         s.push("http://localhost:5000/images/"+ newImage + "");
//             // console.log( array[x].filename ); 
//             //console.log("http://localhost:5000/images/"+s);
//             console.log("ddddd",s);
//     }
//     res.json({ message: "File(s) uploaded successfully" });

// });

// // app.post('/upload', function (req, res) {
// //     let sampleFile;
// //     let uploadPath;
// //     if (!req.files || Object.keys(req.files).length === 0) {
// //         return res.status(400).send('No files were uploaded.');
// //     }
// //     console.log("req.files", req.files);
// //     sampleFile = req.files.file;
// //     console.log("samplefiles", sampleFile);
// //     uploadPath = __dirname + '/images/' + sampleFile.name;

// //     sampleFile.mv(uploadPath, function (err) {
// //         if (err)
// //             return res.status(500).send(err);
// //         console.log("https://blockchaintimes.live/images/" + sampleFile.name)
// //         res.send('File uploaded!');
// //     });
// // });

// app.get("/", (req, res) => {
//     fs.readdir(dirPath, (err, images) => {
//         return res.send(images);
//     })

// });

// app.delete("/", (req, res) => {
//     let fileName = req.query.fileName;
//     console.log(fileName);
//     const directoryPath = `images/${fileName}`;
//     console.log(directoryPath);
//     try {
//         fs.unlinkSync(directoryPath);

//         res.status(200).send({
//             message: "File is deleted.",
//         });
//     } catch (err) {
//         res.status(500).send({
//             message: "Could not delete the file. " + err,
//         });
//     }
// });

// app.listen(port, () => console.log(`${port}`))




const express = require("express");
const port = process.env.PORT || 5000;
const app = express();
const multer = require("multer");
const MulterSharpResizer = require("multer-sharp-resizer");

app.use('/images', express.static('./images'));
app.use(express.json());

const multerStorage = multer.memoryStorage();

// Filter files with multer
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Not an image! Please upload only images.", false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadProductImages = upload.fields([
  { name: "file" },
  // , maxCount: 4
]);

const resizerImages = async (req, res, next) => {
  const filename = {
    file: `${Date.now()}`,
  };

  const sizes = [
    {
      path: "images",
      width: 800,
      height: 950,
    },
    // {
    //   path: "medium",
    //   width: 300,
    //   height: 450,
    // },
  ];

  const uploadPath = `./`;

  const fileUrl = `${req.protocol}://${req.get(
    "host"
  )}`;

  // const sharpOptions = {
  //   fit: "contain",
  //   background: { r: 255, g: 255, b: 255 },
  // };
  const resizeObj = new MulterSharpResizer(
    req,
    filename,
    sizes,
    uploadPath,
    fileUrl
  );

  await resizeObj.resize();
  const getDataUploaded = resizeObj.getData();

  req.body.file = getDataUploaded.file;

  req.body.file = getDataUploaded;

  next();
};

const createProduct = async (req, res, next) => {
  console.log(req.body.file.file[0].originalname)
  res.status(201).json({
    file: req.body.file.file,
  });
};

app.post("/upload", uploadProductImages, resizerImages, createProduct);

app.get("/", (req, res) => {
  fs.readdir(dirPath, (err, images) => {
      return res.send(images);
  })
});


app.listen(port, () => console.log(`${port}`))