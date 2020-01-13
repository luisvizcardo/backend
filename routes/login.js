var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear un token!!!
        usuarioDB.password = ':)';

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id,
            menu: obtenerMenu(usuarioDB.role)
        });

    })


});

function obtenerMenu(ROLE) {
    var menu = [{

            titulo: 'Principal',
            icono: 'mdi mdi-google-earth',
            submenu: [
                //{ titulo: 'Dashboard', url: '/dashboard' },

            ]
        },
        {
            titulo: 'Registers',
            icono: 'mdi mdi-human-handsup',
            submenu: [
                // { titulo: 'Usuarios', url: '/usuarios' },
            ]
        },
        {
            titulo: 'Accounts',
            icono: 'mdi mdi-factory',
            submenu: [
                // { titulo: 'Users', url: '/users' },
                // { titulo: 'Accounts', url: '/accounts' },
                // { titulo: 'Plants', url: '/plants' },
                //     { titulo: 'Areas', url: '/areas' },
                //     { titulo: 'Systems', url: '/systems' },
                //     { titulo: 'Mawois', url: '/mawois' }
            ]
        }
    ];

    if (ROLE === 'ADMIN_ROLE') {
        menu[0].submenu.unshift({ titulo: 'Dashboard', url: '/dashboard' });
        menu[1].submenu.unshift({ titulo: 'Registers', url: '/usuarios' });
        menu[2].submenu.unshift({ titulo: 'Accounts', url: '/accounts' }, { titulo: 'Users', url: '/users' }, { titulo: 'Plants', url: '/plants' }, { titulo: 'Areas', url: '/areas' }, { titulo: 'Systems', url: '/systems' }, { titulo: 'Mawois', url: '/mawois' });
    }
    if (ROLE === 'DISNEY_ROLE') {
        menu[1].submenu.unshift({ titulo: 'PilotoDisney', url: '/pilotodisney' });
    }

    if (ROLE === 'VOLCAN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'PilotoVolcan', url: '/pilotovolcan' });
    }

    if (ROLE === 'CEMEX_ROLE') {
        menu[1].submenu.unshift({ titulo: 'PilotoCemex', url: '/pilotocemex' });
    }

    return menu;
}



module.exports = app;