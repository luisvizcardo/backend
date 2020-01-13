var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var areaSchema = new Schema({
    nombre: { type: String, required: [true, 'the name is obligatory'] },
    description: { type: String, required: [true, 'The description is obligatory'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    plant: { type: Schema.Types.ObjectId, ref: 'Plant', required: [true, 'The id plant is obligatory'] }
});

module.exports = mongoose.model('Area', areaSchema);