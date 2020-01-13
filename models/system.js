var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var systemSchema = new Schema({
    nombre: { type: String, required: [true, 'the name is obligatory'] },
    description: { type: String, required: [true, 'The description is obligatory'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    area: { type: Schema.Types.ObjectId, ref: 'Area', required: [true, 'The id area is obligatory'] }
});

module.exports = mongoose.model('System', systemSchema);