var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
    nombre: { type: String, required: [true, 'the name is obligatory'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    plants: [{ type: Schema.Types.ObjectId, ref: 'Plant' }]
}, { collection: 'accounts' });



module.exports = mongoose.model('Account', accountSchema);