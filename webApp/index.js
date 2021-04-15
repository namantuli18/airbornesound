const express = require('express');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const app = express();
const path = require("path");
const nunjucks = require('nunjucks')
const { PythonShell } = require('python-shell');
const Pusher = require("pusher");
const sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const { v4: uuid } = require('uuid');
const { Users, History } = require('./databaseModels/db');
const PORT = 8000;
const uniqueFilename = require('unique-filename')
var fs = require('fs').promises;
var parse = require('csv-parse/lib/sync');

app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static(__dirname + '/assets'))
app.use('/audio', express.static('uploads'))
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
app.set('view engine', 'nunjucks')
nunjucks.configure('views', {
    autoescape: true,
    express: app
});


const pusher = new Pusher({
    appId: "1182983",        // Replace with 'app_id' from dashboard
    key: "95943c2c1888f27777ef",         // Replace with 'key' from dashboard
    secret: "77766f97c7d3b5345264",   // Replace with 'secret' from dashboard
    cluster: "ap2", // Replace with 'cluster' from dashboard
    useTLS: true
});

var sessionChecker = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        next();
    }
};
var sessionChecker2 = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        next();
    }
};

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});
let data ={};
app.route("/")
    .get(sessionChecker, (req, res, next) => {

            //Here are the option object in which arguments can be passed for the python_test.js.
            (async function () {
                const fileContent = await fs.readFile(__dirname + '/csv/U_vggish.csv');
                data['vgg'] = parse(fileContent, { columns: false });
                
            
            (async function () {
            const fileContent2 = await fs.readFile(__dirname + '/csv/U_vggish_Y.csv');
                data['vgg_y'] = parse(fileContent2, { columns: false });
                console.log(data)
        res.render('index.html', { page: "dashboard",data});
            })();
            
    })();
        
    });

app.route('/user')
    .get(sessionChecker, (req, res) => {
        res.render('user.html', { page: "user" });
    });

app.route('/history')
    .get(sessionChecker, (req, res) => {
        

        History.findAll({ where: { loginId: req.session.user['id'] } ,order:[['createdAt','DESC']]},).then(function (hist) {
            if (!hist) {
                res.render('history.html', { page: "user" });
            } else {
                let i;
                if(req.query.i){
                 i=req.query.i;
                }
                else {
                 i=0;
                }
                req.session.hist=JSON.parse( JSON.stringify(hist));
                console.log(req.session.hist);
                res.render('history.html', { page: "history" ,i });
            }
        }).catch(err => {
            console.log(err);
        });

        
    });

app.route('/report')
    .get(sessionChecker, (reqe, res) => {
        res.render('report.html', { page: "report" });
    });

app.route("/logout")
    .get((req, res) => {
        req.session.destroy();
        res.redirect("/login");
    });



// app.use('/form', express.static(__dirname + '/index.html'));

app.route('/login')
    .get(sessionChecker2, (req, res) => {
        res.render('login.html');
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        Users.findOne({ where: { userName: username, password: password } }).then(function (user) {
            if (!user) {
                res.redirect('/login');

                // } else if (!user.validPassword(password)) {
                //     res.redirect('/login');
            } else {
                req.session.user = user.dataValues;
                console.log(user.dataValues);
                res.redirect('/');
            }
        }).catch(err => {
            console.log(err);
        });
    });


app.post('/upload', function (req, res) {
    let sampleFile;  // input file name
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).render('noFile.html');
        return;
    }

    // console.log('req.files >>>', req.files); // eslint-disable-line

    sampleFile = req.files.sampleFile;
    let fileName = uniqueFilename('/uploads', req.session.user['userName']);
    let ext = sampleFile.name.split('.');
    let files = fileName.split('/');
    files = fileName.split('\\');
    console.log(files + "sajbf  " + ext);
    fileName = files[2].toString() + "." + ext[1].toString();
    uploadPath = __dirname + '/uploads/' + fileName;

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
            args: [fileName] //An argument which can be accessed in the script using sys.argv[1]
        };

        let array = []
        PythonShell.run('inference.py', options, function (err, result) {
            if (err) throw err;
            // result is an array consisting of messages collected 
            //during execution of script.
            console.log('result: ', result.toString());
            array = result.toString().split(',');
            array[0] = array[0].slice(2, -1)
            array[3] = array[3].slice(0, -1)

            const query = History.create({
                name: fileName,
                id: uuid(),
                deviceType: array[0],
                dtProb: parseFloat(array[1]),
                anaStatus: array[2],
                anaProb: parseFloat(array[3]),
                loginId: req.session.user['id']

            })
                .then(anotherTask => {
                    console.log('the data saved!');
                    res.render("reupload.html", { array });
                    // you can now access the currently saved task with the variable anotherTask... nice!
                })
                .catch(error => {
                    console.log('uh oh something wasnt right!');
                    console.log(error);
                    // Ooops, do some error-handling
                })
        });



    });
});
setInterval(() => {
    pusher.trigger("price-btcusd", "new-price", {
        value: [(Math.random()), (Math.random()), (Math.random())]
    });
}, 5000);

app.listen(PORT, function () {
    console.log('Express server listening on port ', PORT);
});