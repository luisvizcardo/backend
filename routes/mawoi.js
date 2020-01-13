var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var Mawoi = require('../models/mawoi');


//obtener todos los mawoi
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Mawoi.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('system')
        .exec(
            (err, mawois) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'cargando mawoi!',
                        errors: err
                    });
                }
                Mawoi.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        mawois: mawois,
                        total: conteo
                    });
                })
            });
});
app.get('/:id', (req, res) => {
        var id = req.params.id;
        Mawoi.findById(id)
            .populate('usuario', 'nombre img email')
            .populate('system')
            .exec((err, mawoi) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar mawoi',
                        errors: err
                    });
                }
                if (!mawoi) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El mawoi con el id ' + id + 'no existe',
                        errors: { message: 'No existe un mawoi con ese ID' }
                    });
                }
                res.status(200).json({
                    ok: true,
                    mawoi: mawoi
                });
            })
    })
    //actualizar mawoi
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Mawoi.findById(id, (err, mawoi) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar mawoi',
                errors: err
            });
        }
        if (!mawoi) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El mawoi con el id ' + id + ' no existe',
                errors: { message: 'No existe un mawoi con ese ID' }
            });
        }
        mawoi.nombre = body.nombre;
        mawoi.usuario = req.usuario._id;
        mawoi.system = body.system;

        mawoi.save((err, mawoiGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar mawoi',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mawoi: mawoiGuardado
            });
        });
    });
});
//crear un nuevo mawoi
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var mawoi = new Mawoi({
        nombre: body.nombre,
        usuario: req.usuario._id,
        system: body.system
    });
    mawoi.save((err, mawoiGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear mawoi',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mawoi: mawoiGuardado
        });

    });

});
//borrar mawoi por el id
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Mawoi.findByIdAndRemove(id, (err, mawoiBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar mawoi',
                errors: err
            });
        }

        if (!mawoiBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un mawoi con ese id',
                errors: { message: 'No existe un mawoi con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            mawoi: mawoiBorrado
        });

    });

});

module.exports = app;