var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
var jwt = require('jsonwebtoken');

var app = express();
var User = require('../models/user');


var bcrypt = require('bcryptjs');


//obtener todos los user
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    User.find({}, 'nombre address city state zip country phone img ')
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('account')
        .exec(
            (err, users) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'cargando user!',
                        errors: err
                    });
                }
                User.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        users: users,
                        total: conteo
                    });
                })
            });
});





app.get('/:id', (req, res) => {
    var id = req.params.id;
    User.findById(id)
        .populate('usuario', 'nombre img email')
        .populate('account')
        .exec((err, user) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar user',
                    errors: err
                });
            }
            if (!user) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El user con el id ' + id + 'no existe',
                    errors: { message: 'No existe un user con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                user: user
            });
        })
})




//actualizar user
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, user) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar user',
                errors: err
            });
        }
        if (!user) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El user con el id ' + id + ' no existe',
                errors: { message: 'No existe un user con ese ID' }
            });
        }
        user.nombre = body.nombre;
        user.address = body.address;
        user.city = body.city;
        user.state = body.state;
        user.zip = body.zip;
        user.country = body.country;
        user.phone = body.phone;
        user.usuario = req.usuario._id;
        user.account = body.account;

        user.save((err, userGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar user',
                    errors: err
                });
            }
            userGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                user: userGuardado
            });
        });
    });
});



//crear un nuevo user
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var user = new User({
        nombre: body.nombre,
        address: body.address,
        city: body.city,
        state: body.state,
        zip: body.zip,
        country: body.country,
        phone: body.phone,
        img: body.img,
        usuario: req.usuario._id,
        account: body.account
    });
    user.save((err, userGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear user',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            user: userGuardado
        });

    });

});



//borrar user por el id
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    User.findByIdAndRemove(id, (err, userBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar user',
                errors: err
            });
        }

        if (!userBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un user con ese id',
                errors: { message: 'No existe un user con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            user: userBorrado
        });

    });

});


module.exports = app;