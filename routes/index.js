var express = require('express');
var router = express.Router();
require('dotenv').config();
const { Database } = require('sqlite3');
const nodemailer = require ('nodemailer');
const request = require('request')
const db = require('../database');
const IP = require ('ip');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'programacion 2',nombre:"Angel Navarro",   ANALITYCS_KEY:process.env.ANALITYCS_KEY,});
});


router.post('/', function(req, res, next) {

const captcha = req.body['g-recaptcha-response'];
const SECRET_KEY = process.env.SECRET_KEY;
const url = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${captcha}`;
let name = req.body.name;
let email = req.body.email;
let comment = req.body.comment;
let Datetime = new Date().toLocaleDateString('en-us', {weekday:"long", year:"numeric", month:"short", day:"numeric"})
let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
let myIP = ip.split(",")[0];

//Localizar pais de origen de la IP
request(`http://ip-api.com/json/${myIP}`, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  const data = JSON.parse(body);
  let country = data.country;
  //Mostrar datos ingresados pos consola
  console.log({name, email,  comment, Datetime, myIP, country});

db.insert(name, email, comment, Datetime, myIP, country);

  //Enviar email con los datos ingresados 
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com', 
    port: 465,
    secure: true,
    auth: {
        user: 'test009@arodu.dev',
        pass: 'eMail.test009'
    }
  });
  const mailOptions = {
    from: 'test009@arodu.dev',
    //Lista de correos 
    to: [ 'programacion2ais@dispostable.com','angelmnavarro95@hotmail.com'],
    subject: 'Task 3: Third Party Connection ',
    text: 'Un nuevo usuario se ha registrado en el formulario:\n' + 'Nombre: ' + name + '\nTelefono:' + phone + '\nCorreo: ' + email + '\nMensaje: ' + comment + '\nFecha y hora: ' + Datetime + '\nIP: ' + myIP + '\nUbicacion: ' + country
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Correo electrónico enviado: ' + info.response);
    }});}});
    //Validacion de reCAPTCHA 
    request(url, (err, response, body) => {
      if (body.success && body.score) {
        console.log('exitoso')
      } else {
        console.log('fracaso')
    }
    }); 
    res.redirect('/');
});

router.get('/contactos', function(req, res, next) {
  db.select(function (rows) {
    console.log(rows);
  });
  res.send('ok');
});

module.exports = router;









