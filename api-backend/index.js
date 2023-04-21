const express = require('express');
const path = require('path');
const app = express();
const port = 9103;
const bodyparser = require('body-parser')
const api = require('./routes/intelliq_api')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

//const baseurl = '/intelliQ/api';

// Middlewares
app.use(bodyparser.json());
app.use('/intelliq_api', api);
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Define the Swagger options
const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'IntelliQ API',
        version: '0.0.1'
      }
    },
    // Path to the API docs
    apis: ['./routes/*.js', 
           './routes/admin/*.js',]
  };

// Initialize the Swagger definition
const swaggerSpec = swaggerJSDoc(options);
app.use('/intelliq_api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define endpoint to serve the Swagger document
app.get('/intelliq_api/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
    });

// Set up nunjucks templating engine
const nunjucks = require('nunjucks');
const { METHODS } = require('http');
nunjucks.configure(path.join(__dirname, '..', 'frontend', 'templates'), {
    autoescape: false,
    express: app
})

app.set('view engine', 'html');

// Initialize port for node application to run

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

// Get request to root
app.get('/', (req, res) => {
    res.render('index', { title: 'IntelliQ' });
})

app.get('/createinit', (req, res) => {
    res.render('qqinit');
})

app.get('/createqs', (req, res) => {
    res.render('qqcreation');
})

app.get('/createflow', (req, res) => {
    res.render('qqflow');
})

app.get('/select2answer', (req, res) => {
    res.render('qqselect');
})

app.get('/answer', (req, res) => {
    res.render('qqanswer');
})

app.get('/statistics', (req, res) => {
    var statisticsUrl = path.join(__dirname, '../frontend/templates/statistics.js');
    res.render('statistics', { title: 'Fetch Question Statistics', statisticsUrl: statisticsUrl });
})

//const Questionnaire = require('./routes/Questionnaire');
//const Question = require('./routes/Question');

//Rest API endpoints
//app.use(baseurl + "/questionnaire", Questionnaire);
//app.use(baseurl + "/question", Question);


/* var mysql = require('mysql');

//connect with database

function getAllData(req,res) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "toulou"

    });
    // querying databse

    con.connect(function(err) {
        if(err) throw err;
        console.log("Connected");
        let myquery ="";
        con.query(myquery,function(err,results,fields){
            if(err) throw err;
            res.send(result);
        });
    });
} */