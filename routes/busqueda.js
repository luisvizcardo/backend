var express = require('express');

var app = express();

var Account = require('../models/account');
var Plant = require('../models/plant');
var User = require('../models/user');
var Usuario = require('../models/usuario');
var Area = require('../models/area');
var System = require('../models/system');
var Mawoi = require('../models/mawoi');

// ==============================
// Busqueda por colección
// ==============================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'accounts':
            promesa = buscarAccounts(busqueda, regex);
            break;
        case 'users':
            promesa = buscarUsers(busqueda, regex);
            break;
        case 'plants':
            promesa = buscarPlants(busqueda, regex);
            break;
        case 'areas':
            promesa = buscarAreas(busqueda, regex);
            break;
        case 'systems':
            promesa = buscarSystems(busqueda, regex);
            break;
        case 'mawois':
            promesa = buscarMawois(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, accounts,users,areas,mawois,systems y plants',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});


// ==============================
// Busqueda general
// ==============================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
            buscarAccounts(busqueda, regex), buscarPlants(busqueda, regex),
            buscarUsuarios(busqueda, regex),
            buscarUsers(busqueda, regex),
            buscarAreas(busqueda, regex),
            buscarSystems(busqueda, regex),
            buscarMawois(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                accounts: respuestas[0],
                plants: respuestas[1],
                usuarios: respuestas[2],
                users: respuestas[3],
                areas: respuestas[4],
                systems: respuestas[5],
                mawois: respuestas[6]
            });
        })


});


function buscarAccounts(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Account.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, accounts) => {

                if (err) {
                    reject('Error al cargar accounts', err);
                } else {
                    resolve(accounts)
                }
            });
    });
}

function buscarPlants(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Plant.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('account')
            .exec((err, plants) => {

                if (err) {
                    reject('Error al cargar plants', err);
                } else {
                    resolve(plants)
                }
            });
    });
}

function buscarUsers(busqueda, regex) {

    return new Promise((resolve, reject) => {

        User.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('account')
            .exec((err, users) => {

                if (err) {
                    reject('Error al cargar users', err);
                } else {
                    resolve(users)
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}


function buscarAreas(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Area.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('plant')
            .exec((err, areas) => {

                if (err) {
                    reject('Error al cargar areas', err);
                } else {
                    resolve(areas)
                }
            });
    });
}

function buscarSystems(busqueda, regex) {

    return new Promise((resolve, reject) => {

        System.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('area')
            .exec((err, systems) => {

                if (err) {
                    reject('Error al cargar systems', err);
                } else {
                    resolve(systems)
                }
            });
    });
}

function buscarMawois(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Mawoi.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('system')
            .exec((err, mawois) => {

                if (err) {
                    reject('Error al cargar mawois', err);
                } else {
                    resolve(mawois)
                }
            });
    });
}


module.exports = app;