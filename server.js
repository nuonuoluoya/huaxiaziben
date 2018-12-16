const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');
const config = require('./config');

const server = express();
server.listen(config.port);

const db = mysql.createPool({host: config.mysql_host, user: config.mysql_user, password: config.mysql_pass, port: config.mysql_port, database: config.mysql_db});

server.use((req, res, next)=>{
  req.db = db;
  req.cwd = __dirname;
  next();
});

server.use(bodyParser.urlencoded({extended: false}));

let multerObj = multer({dest: './upload/'});
server.use(multerObj.any());

server.use(cookieParser(require('./secret/cookie_key')));

server.use(cookieSession({
  keys: require('./secret/sess_key')
}));

server.set('html', consolidate.ejs);
server.set('view engine', 'ejs');
server.set('views', './template/');

server.use('/admin/', require('./routers/admin'));

server.use('/', require('./routers/www'));

server.use(express.static('./www/'));
server.use(express.static('./upload/'));
