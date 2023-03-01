const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema({
	titulo: {type: String,required:[true,"Se requiere el título del producto"]},
	descripcion: {type: String,required:[true,"Se requiere una descripción del producto"]},
	precio: {type: Number,required:[true,"Se requiere un precio para el producto"]},
	stock: {type: Number,required:[true,"Se requiere el stock del producto"]},
	imageurl: {type: String},
	categoria: {type: String}
},{ timestamps: true, versionKey: false });

const Producto = mongoose.model("productos", ProductoSchema);

module.exports = {Producto};