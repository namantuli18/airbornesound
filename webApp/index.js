const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const path = require("path");
const nunjucks=require('nunjucks')
const { PythonShell } = require('python-shell');
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1182983",        // Replace with 'app_id' from dashboard
  key: "95943c2c1888f27777ef",         // Replace with 'key' from dashboard
  secret: "77766f97c7d3b5345264",   // Replace with 'secret' from dashboard
  cluster: "ap2", // Replace with 'cluster' from dashboard
  useTLS: true
});
app.set('view engine','nunjucks')
app.use(express.static(__dirname+'/assets'))
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.get("/", (req, res, next) => {
    //Here are the option object in which arguments can be passed for the python_test.js.
    res.render('index.html');
});


const PORT = 8000;

// app.use('/form', express.static(__dirname + '/index.html'));
app.use(express.urlencoded({ extended: true }));

// ejs files 

// default options
app.use(fileUpload());

app.post('/upload', function (req, res) {
    let sampleFile;  // input file name
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).render('noFile.html');
        return;
    }

    // console.log('req.files >>>', req.files); // eslint-disable-line

    sampleFile = req.files.sampleFile;

    uploadPath = __dirname + '/uploads/' + sampleFile.name;

    sampleFile.mv(uploadPath, function (err) {
        if (err) {
            return res.status(500).send(err);
            console.log(err);
        }
        // res.send('File uploaded to ' + uploadPath);
            //Here are the option object in which arguments can be passed for the python_test.js.
        let options = {
            mode: 'text',
            pythonOptions: ['-u'], // get print results in real-time
            // scriptPath: 'path/to/my/scripts', //If you are having python_test.py script in same folder, then it's optional.
            args: [sampleFile.name] //An argument which can be accessed in the script using sys.argv[1]
        };


        PythonShell.run('inference.py', options, function (err, result) {
            if (err) throw err;
            // result is an array consisting of messages collected 
            //during execution of script.
            console.log('result: ', result.toString());
            let array=result.toString().split(',');
            array[0]=array[0].slice(2,-1)
            array[3]=array[3].slice(0,-1)
            res.render('reupload.html', { array });
        });
        
        

    });
});
setInterval(() => {
  pusher.trigger("price-btcusd", "new-price", { 
    value: [1000+(Math.random() * 5000),1000+(Math.random() * 5000),1000+(Math.random() * 5000)]
  });
}, 5000);
app.listen(PORT, function () {
    console.log('Express server listening on port ', PORT);
});