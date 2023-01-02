const express = require('express')
const app = express();
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const port = process.env.PORT || 5000;

app.use(cors());
var counts = 1;
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {   
        
        cb(null, `${counts++}${path.extname(file.originalname)}`)  
    }
})


const upload = multer({ storage: storage,
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
     }).single("myFile");
    
    function checkFileType(file, cb){
        const filetypes= /jpeg|jpg|png|gif|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if(mimetype &&  extname){
            return cb(null, true);
        }else{
            cb('ERROR: Images Only!');
        }
    }

    app.use('/public/uploads',express.static('./public/uploads'));
    app.get('/',(req, res)=> res.send('this is working'));
app.post('/imageupload', async (req, res) => {	
    try {
        upload(req, res, function(err) {
            

            if(err){
                res.send({msg:err});
            }else{
                if(req.file == undefined){
                    res.send({
                        msg: "select image"
                    });
                }else{
                    res.json({
                        msg:'File Uploaded',
                        file: `${req.file.filename}`
                    })
                    // console.log(req.file.filename);
                    
                }
            }

        }); 

    }catch (err) {console.log(err)}
})

app.listen(port, () => console.log(`${port}`))