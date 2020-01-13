var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var Area = require('../models/area');


//obtener todos los area
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Area.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('plant')
        .exec(
            (err, areas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'cargando area!',
                        errors: err
                    });
                }
                Area.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        areas: areas,
                        total: conteo
                    });
                })
            });
});

app.get('/:id', (req, res) => {
    var id = req.params.id;
    Area.findById(id)
        .populate('usuario', 'nombre img email')
        .populate('plant')
        .exec((err, area) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar area',
                    errors: err
                });
            }
            if (!area) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El area con el id ' + id + 'no existe',
                    errors: { message: 'No existe un area con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                area: area
            });
        })
})

//actualizar area
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Area.findById(id, (err, area) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar area',
                errors: err
            });
        }
        if (!area) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El area con el id ' + id + ' no existe',
                errors: { message: 'No existe un area con ese ID' }
            });
        }
        area.nombre = body.nombre;
        area.descritption = body.description;
        area.usuario = req.usuario._id;
        area.plant = body.plant;

        area.save((err, areaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar area',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                area: areaGuardado
            });
        });
    });
});
//crear un nuevo area
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var area = new Area({
        nombre: body.nombre,
        description: body.description,
        usuario: req.usuario._id,
        plant: body.plant
    });
    area.save((err, areaGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear area',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            area: areaGuardado
        });

    });

});
//borrar plant por el id
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Area.findByIdAndRemove(id, (err, areaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar area',
                errors: err
            });
        }

        if (!areaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un area con ese id',
                errors: { message: 'No existe un area con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            area: areaBorrado
        });

    });

});

module.exports = app;