var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var Account = require('../models/account');

//obtener todos los account
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Account.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, accounts) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'cargando account!',
                        errors: err
                    });
                }
                Account.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        accounts: accounts,
                        total: conteo
                    });
                })
            });
});

app.get('/:id', (req, res) => {
        var id = req.params.id;
        Account.findById(id)
            .populate('usuario', 'nombre img email')
            .exec((err, account) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar account',
                        errors: err
                    });
                }
                if (!account) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El account con el id ' + id + 'no existe',
                        errors: { message: 'No existe un account con ese ID' }
                    });
                }
                res.status(200).json({
                    ok: true,
                    account: account
                });
            })
    })
    //actualizar account
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Account.findById(id, (err, account) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar account',
                errors: err
            });
        }
        if (!account) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El account con el id ' + id + ' no existe',
                errors: { message: 'No existe un account con ese ID' }
            });
        }
        account.nombre = body.nombre;
        account.usuario = req.usuario._id;

        account.save((err, accountGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar account',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                account: accountGuardado
            });
        });
    });
});
//crear un nuevo account
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var account = new Account({
        nombre: body.nombre,
        usuario: req.usuario._id
    });
    account.save((err, accountGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear account',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            account: accountGuardado
        });

    });

});
//borrar users por el id
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Account.findByIdAndRemove(id, (err, accountBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar account',
                errors: err
            });
        }

        if (!accountBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un account con ese id',
                errors: { message: 'No existe un account con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            account: accountBorrado
        });

    });

});

module.exports = app;