var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var plantSchema = new Schema({
    nombre: { type: String, required: [true, 'the name is obligatory'] },
    description: { type: String, required: [true, 'The description is obligatory'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: [true, 'The	id account is obligatory'] }
});

module.exports = mongoose.model('Plant', plantSchema);