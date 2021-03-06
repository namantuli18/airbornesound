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
const { Users, History ,report } = require('./databaseModels/db');
const PORT = 8000;
const uniqueFilename = require('unique-filename')
var fs = require('fs').promises;
var stringify = require('csv-stringify');
var parse = require('csv-parse/lib/sync');
const { Parser } = require('json2csv');
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static(__dirname + '/assets'));
app.use('/audio', express.static('uploads'));
app.use('/reports', express.static('reports'));
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
let data = {};
let devices = ['fan', 'slider rails', 'valve','pump'];
let factories=['Factory A','Factory B','Factory C'];
app.route("/")
    .get(sessionChecker, (req, res, next) => {

        //Here are the option object in which arguments can be passed for the python_test.js.
        (async function () {
            for (var d = 0; d < devices.length; d++) {
                data[devices[d]] = {};
                const fileContent = await fs.readFile(__dirname + '/csv/' + devices[d] + '/U_vggish.csv');
                data[devices[d]]['vgg'] = await parse(fileContent, { columns: false });

                const fileContent2 = await fs.readFile(__dirname + '/csv/' + devices[d] + '/Y.csv');
                data[devices[d]]['vgg_y'] = await parse(fileContent2, { columns: false });
                const fileContent3 = await fs.readFile(__dirname + '/csv/' + devices[d] + '/U_mfcc.csv');
                data[devices[d]]['U_mfcc'] = await parse(fileContent3, { columns: false });
                const fileContent4 = await fs.readFile(__dirname + '/csv/' + devices[d] + '/l_dist.csv');
                data[devices[d]]['l_dist'] = await parse(fileContent4, { columns: false });
            }
            // console.log(data)
            res.render('index.html', { page: "dashboard", data, devices ,factories});
        })();

    });

app.route('/user')
    .get(sessionChecker, (req, res) => {
        res.render('user.html', { page: "user" });
    });

app.route('/history')
    .get(sessionChecker, (req, res) => {


        History.findAll({ where: { loginId: req.session.user['id'] }, order: [['createdAt', 'DESC']] },).then(function (hist) {
            if (!hist) {
                res.render('history.html', { page: "history" });
            } else {
                let i;
                if (req.query.i) {
                    i = req.query.i;
                }
                else {
                    i = 0;
                }
                req.session.hist = JSON.parse(JSON.stringify(hist));
                // console.log(req.session.hist);
                res.render('history.html', { page: "history", i });
            }
        }).catch(err => {
            console.log(err);
        });


    });

app.route('/report')
    .get(sessionChecker, (req, res) => {
        res.render('report.html', { page: "report" ,devices,factories});
    })
    .post(sessionChecker, (req, res) => {
        var factory = req.body.factory,
            device = req.body.device;
            var from = req.body.from+" 00:00:00",
            to = req.body.to+" 00:00:00";
            var query= report.findAll({ where: { [sequelize.Op.and]:{facName:factory, deviceType:device, createdAt:{[sequelize.Op.between]: [from,to] }  }} }).then(function (result) {
                if (!result) {
                    // res.redirect('/login');
    
                    // } else if (!user.validPassword(password)) {
                    //     res.redirect('/login');
                } else {
                    
                    var temp = JSON.parse(  JSON.stringify(result));
                    // console.log(temp);
                    // res.redirect('/');
                    const json2csv = new Parser({ });
                    temp = json2csv.parse(temp);
                    res.setHeader('Content-disposition', 'attachment; filename=data.csv');
                    res.set('Content-Type', 'text/csv');
                    res.status(200).send(temp);
                    // res.render('report.html', { page: "report" ,devices,factories});
                }
            }).catch(err => {
                console.log(err);
            });
        
        
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
                // console.log(user.dataValues);
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
    if(files.length < 2){
        files = fileName.split('\\');
    }
    // console.log(files + "sajbf  " + ext);
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
            // console.log('result: ', result.toString());
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
    let value=[(Math.random()), (Math.random()), (Math.random()), (Math.random())];
    
    let x=Math.floor(Math.random()*3);
    let k="";
    for( let i=0;i<devices.length;i++){
        if(Math.round(value[i]-0.3))
            k="ABNORMAL";
        else{
            k="NORMAL";
            }
    const query = report.create({
        facName: factories[x] ,
        id: uuid(),
        deviceType: devices[i],
        dtProb: parseFloat(Math.random()*0.5 +0.5),
        anaStatus: k,
        anaProb: value[i]

    })
        .catch(error => {
            console.log('uh oh something wasnt right!');
            console.log(error);
            // Ooops, do some error-handling
        });

    } 
        pusher.trigger(factories[x].replace(" ",""), "updates", {
            value: value
        });
    
}, 5000);

app.listen(PORT, function () {
    console.log('Express server listening on port ', PORT);
});