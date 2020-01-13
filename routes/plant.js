var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var Plant = require('../models/plant');


//obtener todos los plant
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Plant.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('account')
        .exec(
            (err, plants) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'cargando plant!',
                        errors: err
                    });
                }
                Plant.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        plants: plants,
                        total: conteo
                    });
                })
            });
});

app.get('/:id', (req, res, next) => {
    var id = req.params.id;

    Plant.find({ 'account': id })
        .populate('usuario', 'nombre email')
        .populate('account')
        .exec(
            (err, accounts) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });
                }

                Plant.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        accounts: accounts,
                        total: conteo
                    });

                })

            });
});


//obtener plant por el id
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Plant.findById(id)
        .populate('usuario', 'nombre img email')
        .populate('account')
        .exec((err, plant) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar plant',
                    errors: err
                });
            }
            if (!plant) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El plant con el id ' + id + 'no existe',
                    errors: { message: 'No existe un plant con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                plant: plant
            });
        })
})

//actualizar plant
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Plant.findById(id, (err, plant) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar plant',
                errors: err
            });
        }
        if (!plant) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El plant con el id ' + id + ' no existe',
                errors: { message: 'No existe un plant con ese ID' }
            });
        }
        plant.nombre = body.nombre;
        plant.description = body.description;
        plant.usuario = req.usuario._id;
        plant.account = body.account;

        plant.save((err, plantGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar plant',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                plant: plantGuardado
            });
        });
    });
});

//crear un nuevo plant
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var plant = new Plant({
        nombre: body.nombre,
        description: body.description,
        usuario: req.usuario._id,
        account: body.account
    });
    plant.save((err, plantGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear plant',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            plant: plantGuardado
        });

    });

});
//borrar plant por el id
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Plant.findByIdAndRemove(id, (err, plantBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar plant',
                errors: err
            });
        }

        if (!plantBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un plant con ese id',
                errors: { message: 'No existe un plant con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            plant: plantBorrado
        });

    });

});

module.exports = app;