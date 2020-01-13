var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');


var app = express();

var Usuario = require('../models/usuario');
var Account = require('../models/account');
var User = require('../models/user');
var Plant = require('../models/plant');
var Area = require('../models/area');
var System = require('../models/system');
var Mawoi = require('../models/mawoi');

// default options
app.use(fileUpload());




app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colección
    var tiposValidos = ['accounts', 'users', 'plants', 'usuarios', 'areas', 'systems', 'mawois'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        });
    }
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }
    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    // 12312312312-123.png
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;


    // Mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido',
        //     extensionArchivo: extensionArchivo
        // });
    })
});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }


            var pathViejo = './upload/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            })


        });

    }

    if (tipo === 'plants') {

        Plant.findById(id, (err, plant) => {

            if (!plant) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Plant no existe',
                    errors: { message: 'Plant no existe' }
                });
            }
            var pathViejo = './upload/plants/' + plant.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            plant.img = nombreArchivo;

            plant.save((err, plantActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de account actualizada',
                    plant: plantActualizado
                });
            })
        });
    }

    if (tipo === 'users') {

        User.findById(id, (err, user) => {

            if (!user) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'User no existe',
                    errors: { message: 'User no existe' }
                });
            }
            var pathViejo = './upload/users/' + user.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            user.img = nombreArchivo;

            user.save((err, userActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de user actualizada',
                    user: userActualizado
                });
            })
        });
    }

    if (tipo === 'accounts') {

        Account.findById(id, (err, account) => {

            if (!account) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Account no existe',
                    errors: { message: 'Account no existe' }
                });
            }

            var pathViejo = './upload/accounts/' + account.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            account.img = nombreArchivo;

            account.save((err, accountActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de account actualizada',
                    account: accountActualizado
                });
            })

        });
    }

    if (tipo === 'areas') {

        Area.findById(id, (err, area) => {

            if (!area) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Area no existe',
                    errors: { message: 'Area no existe' }
                });
            }

            var pathViejo = './upload/areas/' + area.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            area.img = nombreArchivo;

            area.save((err, areaActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de area actualizada',
                    area: areaActualizado
                });
            })

        });
    }

    if (tipo === 'systems') {

        System.findById(id, (err, system) => {

            if (!system) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'System no existe',
                    errors: { message: 'System no existe' }
                });
            }

            var pathViejo = './upload/systems/' + system.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            system.img = nombreArchivo;

            system.save((err, systemActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de system actualizada',
                    system: systemActualizado
                });
            })

        });
    }
    if (tipo === 'mawois') {

        Mawoi.findById(id, (err, mawoi) => {

            if (!mawoi) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Mawoi no existe',
                    errors: { message: 'Mawoi no existe' }
                });
            }

            var pathViejo = './upload/mawois/' + mawoi.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            mawoi.img = nombreArchivo;

            mawoi.save((err, mawoiActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de mawoi actualizada',
                    mawoi: mawoiActualizado
                });
            })

        });
    }

}

module.exports = app;