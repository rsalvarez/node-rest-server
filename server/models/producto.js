var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dateFormat = require('dateformat');


var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    fechaAlta: { type: Date, required: true, default: new Date() },
    img: { type: String, required: false },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});
productoSchema.methods.toJSON = function() {
    let producto = this;
    let productoObject = producto.toObject();


    return productoObject;
}

module.exports = mongoose.model('Producto', productoSchema);