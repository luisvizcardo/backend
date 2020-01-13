var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var System = require('../models/system');


//obtener todos los system
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    System.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('area')
        .exec(
            (err, systems) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'cargando system!',
                        errors: err
                    });
                }
                System.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        systems: systems,
                        total: conteo
                    });
                })
            });
});
app.get('/:id', (req, res) => {
        var id = req.params.id;
        System.findById(id)
            .populate('usuario', 'nombre img email')
            .populate('area')
            .exec((err, system) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar system',
                        errors: err
                    });
                }
                if (!system) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El system con el id ' + id + 'no existe',
                        errors: { message: 'No existe un system con ese ID' }
                    });
                }
                res.status(200).json({
                    ok: true,
                    system: system
                });
            })
    })
    //actualizar system
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    System.findById(id, (err, system) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar system',
                errors: err
            });
        }
        if (!system) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El system con el id ' + id + ' no existe',
                errors: { message: 'No existe un system con ese ID' }
            });
        }
        system.nombre = body.nombre;
        system.description = body.description;
        system.usuario = req.usuario._id;
        system.area = body.area;

        system.save((err, systemGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar system',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                system: systemGuardado
            });
        });
    });
});
//crear un nuevo system
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var system = new System({
        nombre: body.nombre,
        description: body.description,
        usuario: req.usuario._id,
        area: body.area
    });
    system.save((err, systemGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear system',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            system: systemGuardado
        });

    });

});
//borrar area por el id
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    System.findByIdAndRemove(id, (err, systemBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar system',
                errors: err
            });
        }

        if (!systemBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un system con ese id',
                errors: { message: 'No existe un system con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            system: systemBorrado
        });

    });

});

module.exports = app;