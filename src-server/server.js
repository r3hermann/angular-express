/***********
** Package *
************
*/
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mysql = require('mysql');
var fs = require('fs');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');

//configuration file
var config = require('./Config');

/*
 * instance of express
 */
var app = express();

/*****************
** configuration *
******************
*/

//port
var port = process.env.PORT || 8080;
app.set('superSecret', config.secret);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

/*
 * Database connection
 *
 */
const MyDataBase = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "root",
  database : "my_db"
});
MyDataBase.connect();


/*
******************
** API ROUTES   **
******************
*/

// get an instance of the router for api routes
var apiRoutes = express.Router();


/*
 ******************
 ** PUBLIC API   **
 ******************
 */

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

/*
 * CORS 
 */
apiRoutes.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, Content-Type');
   res.setHeader("Access-Control-Allow-Credentials","true");
  next();
});



// route to show a message
apiRoutes.get('/', function (req, res) {
  res.json({
    message: 'Server API start!'
  });
});

/*
 * auth
 *
 */
apiRoutes.get('/auth', function (req, res, next) {

  console.log('SELECT * FROM user WHERE username = "' + req.query.username + '" AND password = "' + req.query.password + '"');

  MyDataBase.query('SELECT * FROM user WHERE username = "' + req.query.username + '" AND password = "' + req.query.password + '"', function (error, results, fields) {
    if (error) throw error;
    if (results.length == 0) {
      res.json({
        success: false,
        message: 'Autenticazione fallita. Password errata.'
      });
    } else {

      // if user is found and password is right
      // create a token
      var token = jwt.sign(results[0], app.get('superSecret'), {
        expiresIn: 1440
      });

      // return the information including token as JSON
      res.json({
        success: true,
        message: 'Autenticazione effettuata!',
        token: token
      });
    }
  });

});

/*
 *  register: usato solo per fase di test, non disponibile in form
 *
 */
apiRoutes.post("/register", function (req, res) {

  var userData = {
    "username": req.body.username,
    "nome": req.body.nome,
    "cognome": req.body.cognome,
    "password": req.body.password,
  };

  MyDataBase.query("INSERT INTO user (`username`, `nome`, `cognome`, `password`) VALUES ('" + userData.username + "', '" + userData.nome + "', '" + userData.cognome + "', '" + "', '" + userData.password + "')", function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });

});

apiRoutes.get("/aule", function(req, res) {
  MyDataBase.query('SELECT * FROM class', function (error, results, fields) {
    if (error) throw error;

    if (results.length == 0) {
      res.json({
        success: false,
        message: 'class not found'
      });
    } else {
      res.json({
        success: true,
        message: 'class',
        aule: results
      });
    }
  });

});

/*
 * prenotazioni
 *
 */
apiRoutes.get("/prenotazioni", function(req, res) {
  MyDataBase.query('SELECT * FROM prenotazioni ORDER BY idaula', function (error, results, fields) {
    if (error) throw error;

    if (results.length == 0) {
      res.json({
        success: false,
        message: 'Prenotazioni non trovate'
      });
    } else {
      res.json({
        success: true,
        message: 'class and times',
        prenotazioni: results
      });
    }
  });

});

// route middleware to verify a token
apiRoutes.use(function (req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

     } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});



/*
 *******************
 ** API PROTECTED **
 *******************
 */


/*
 * prenota1
 *
 */
 console.log("prima del post");
apiRoutes.post("/prenota", function (req, res) {
console.log("dopo del post");
  var data = req.body.data;
  var orario1 = req.body.orario1;
  var orario2 = req.body.orario2;
  var idaula = req.body.idaula;

	MyDataBase.query('SELECT * FROM prenotazioni WHERE giorno="' + data + '" AND idaula=' + idaula + ' \
  AND    ( \
         (' + orario1 + ' = SUBSTRING(orario1, 1, 2) AND ' + orario2 + ' = SUBSTRING(orario2, 1, 20)) -- stesso orario \
    OR	 (' + orario1 + ' > SUBSTRING(orario1, 1, 2) AND ' + orario1 + ' < SUBSTRING(orario2, 1, 2)) 	-- ' + orario1 + ' compreso tra orario1 e orario2 \
    OR   (' + orario2 + ' > SUBSTRING(orario1, 1, 2) AND ' + orario2 + ' < SUBSTRING(orario2, 1, 2))  -- ' + orario2 + ' compreso tra orario1 e orario2 \
    OR	 (SUBSTRING(orario1, 1, 2) > ' + orario1 + ' AND SUBSTRING(orario1, 1, 2) < ' + orario2 + ') 	-- orario1 compreso tra ' + orario1 + ' e ' + orario2 + ' \
    OR	 (SUBSTRING(orario2, 1, 2) > ' + orario1 + ' AND SUBSTRING(orario2, 1, 2) < ' + orario2 + ')	-- orario2 compreso tra ' + orario1 + ' e ' + orario2 + ' \
  );', function (error, results, fields) {
    if (error) throw error;

    if (results.length == 0) {

    }
    else {

      res.send({
        "status": 200,
        "error": "",
        "response": results
      });
    }

  });

});


/*
 *******************
 ** start  server **
 *******************
 */

app.listen(port);
console.log('Class booking system http://localhost:' + port);
