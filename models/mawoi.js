var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mawoiSchema = new Schema({
    nombre: { type: String, required: [true, 'the name is obligatory'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    system: { type: Schema.Types.ObjectId, ref: 'System', required: [true, 'El id system is obligatory'] }
});

module.exports = mongoose.model('Mawoi', mawoiSchema);