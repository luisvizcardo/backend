var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var userSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: [true, 'El id account es un campo obligatorio'] },

});

module.exports = mongoose.model('User', userSchema);