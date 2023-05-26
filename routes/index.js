var express = require('express');
var router = express.Router();
const sqlite = require('sqlite3'). verbose();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'Express', nombre:"Moi" });
});

let crear_tabla = "CREATE TABLE contacto (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(50) NOT NULL, Telefono NOT NULL, Email NOT NULL, mensaje TEXT, fecha TEXT, hora TEXT, ip TEXT);"
let ingresar_datos = "INSERT INTO contacto (nombre, telefono, email, mensaje, fecha, hora, ip) VALUES(?, ?, ?, ?, ?, ?, ?);"

const db = new sqlite.Database(':memory:', (err)=>{
  if(err) return console.error(err.message);

  db.run(crear_tabla);
  console.log("Query SQL sucess!");
})

router.post('/', (req, res)=>{

  let ip = req.headers['x-forwrded-for'] || req.socket.remoteAddress;
  let date = new Date();
  let time = ""

  if (date.getHours() >= 12) {
    time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "PM"
  } else {
    time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "AM"
  }

  let _dt = date.toLocaleString();
  let dt = "";

  for(let d = 0; d <= 9; d++){
    if (_dt[d] == '/') {
      dt += '-';
      continue;
    } else if(_dt[d] == '-'){
      continue;
    }
    dt += _dt[d];
  }

  if (ip) {
    let ip_ls = ip.split(',');
    ip = ip_ls [ip_ls.length - 1];
  } else {
    console.log("Direccion IP no encontrada");
  }

  let datos = [req.body.nombre, req.body.Telefono, req.body.email, req.body.mensaje, date, time, ip];

  console.log (datos);

  db.run(ingresar_datos, datos, (err)=>{
    if(err) return console.error(err.message);
    console.log('Datos guardados');
  })

  res.redirect('/');


});

module.exports = router;









