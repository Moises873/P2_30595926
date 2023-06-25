var express = require('express');
var router = express.Router();
require('dotenv').config();
const { Database } = require('sqlite3');
const nodemailer = require ('nodemailer');
const IP = require ('ip');
const request = require ('request');
const { default: axios } = require("axios");
//const db = require('../database');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./data.db',(err) => {
  if (err) {
      return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');

});
router.get('/Moi', (req, res) => {
  res.render('Moi');
 });


db.run("CREATE TABLE IF NOT EXISTS contactos (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL, date TEXT NOT NULL, ip TEXT NOT NULL, country TEXT NOT NULL)", (err)=>{
  if(err) return err;
  console.log('TABLA CREADA')
});

let logged = false;
let mensaje = "";

/* GET home page. */
router.get('/', function(req, res, next) {
  logged = false;
  res.render('index', {title: 'Programacion 2',nombre:"Angel Navarro", ANALITYCS_KEY:process.env.ANALITYCS_KEY,});
});

router.post('/', function(req, res, next) {

    const captcha = req.body['g-recaptcha-response'];
    const SECRET_KEY = process.env.SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${captcha}`;
    let name = req.body.name;
    let phone = req.body.phone;
    let email = req.body.email;
    let message = req.body.message;
    let Datetime = new Date().toLocaleDateString('en-us', {weekday:"long", year:"numeric", month:"short", day:"numeric"})
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    let myIP = ip.split(",")[0];
    let country = "";
    //Localizar pais de origen de la IP
    request(`http://ip-api.com/json/${myIP}`, function (error, response, body) {
      if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      country = data.country;
      //Mostrar datos ingresados pos consola
      console.log({name, phone, email, message, Datetime, myIP, country});
      //Enviar email con los datos ingresados       
      }});

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
        to: [ 'programacion2ais@dispostable.com','angelmnavarro95@gmail.com'],
        subject: 'Task 4: Third Party Connection ',
        text: 'Un nuevo ususuario se ha registrado en el formulario:\n' + 'Nombre: ' + name + '\nTelefono:' + phone + '\nCorreo: ' + email + '\nMensaje: ' + message + '\nFecha y hora: ' + Datetime + '\nIP: ' + myIP + '\nUbicacion: ' + country
      };
      transporter.sendMail(mailOptions, function(error, info){ 
        if (error) {
            console.log(error);
        } else {
            console.log('Correo electrónico enviado: ' + info.response);
        }});
    
        //Validacion de reCAPTCHA 
       /*  request(url, (err, response, body) => {
          if (body.success && body.score) {
            console.log('exitoso')
          } else {
            console.log('Error')
        }
        }); */
        db.run("INSERT INTO contactos (name, phone, email, message, date, ip, country) VALUES (?, ?, ?, ?, ?, ?, ?)", [name, phone, email, message, Datetime, myIP, country], function (err) {
          if (err) {
              return console.log(err.message);
          } 
          // get the last insert id
          console.log(`A row has been inserted with rowid ${name}`);
      });
        res.redirect('/');
    });
    
    router.get('/contactos', (req, res) =>{
      if(logged){
        db.all("SELECT * FROM contactos", (err, rows) => {
          if (err) return err;
          console.log(rows);
          res.render('contactos', {contactos:rows});
        });
      }else{
        res.redirect('/login')
      }
      
    });

    router.get('/Moi', (req, res) => {
      res.render('Moi');
    });

router.get('/login', (req, res)=>{
  res.render('login', {mej: mensaje});
})

router.post('/login', (req, res)=>{
  const name = req.body.name;
  const correo = req.body.email;
  const Contraseña = req.body.password;

  if(correo == "Moises456@gmail.com" && Contraseña == "Moi123" && Nombre == "Moi"){
    logged = true;
    res.redirect('/views/contactos')
  }else{
    logged = false;
    mensaje = "Datos invalidos";
    res.redirect('/login')
  }
})

router.get("/auth", (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`);
})

router.get("/callback", (req, res) => {
  axios.post("https://github.com/login/oauth/access_token", {
      client_id:process.env.CLIENT_ID ,
      client_secret: process.env.SECRET_ID,
      code: req.query.code
  }, {
      headers: {
          Accept: "application/json"
      }
  }).then((result) => {
      console.log(result.data.access_token)
      logged = true;
      res.redirect('/contactos');
  }).catch((err) => {
      console.log(err);
  })
})

    module.exports = router;
    
