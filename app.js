//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//inicializar variables
var app = express();
//cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


//bodyparser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



//importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var plantRoutes = require('./routes/plant');
var userRoutes = require('./routes/user');
var accountRoutes = require('./routes/account');
var areaRoutes = require('./routes/area');
var systemRoutes = require('./routes/system');
var mawoiRoutes = require('./routes/mawoi');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

//conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/corelusa', (err, res) => {


    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});

//Server index config
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));

//rutas
app.use('/usuario', usuarioRoutes);
app.use('/plant', plantRoutes);
app.use('/user', userRoutes);
app.use('/account', accountRoutes);
app.use('/area', areaRoutes);
app.use('/system', systemRoutes);
app.use('/mawoi', mawoiRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

app.use('/', appRoutes);

//escuchar peticiones
app.listen(3000, () => {
    console.log('express server puerto 3000: \x1b[32m%s\x1b[0m', 'online')
});