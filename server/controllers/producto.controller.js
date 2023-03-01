const { Producto } = require('../models/producto.model');

module.exports.createProducto = (request, response) => {
  const {titulo,descripcion,precio,stock,imageurl,categoria} = request.body;
    Producto.create({
      titulo,
      descripcion,
      precio,
      stock,
      imageurl,
      categoria
    })
      .then(producto => response.json(producto))
      .catch(err => response.status(400).json(err));
}

module.exports.getAllProductos = (request, response) => {
  Producto.find({})
    .then(productos => response.json(productos))
    .catch(err => response.json(err))
}

module.exports.getSomeProductos = (request, response) => {
  let ids=request.params.ids.split('-');
  Producto.find({'_id':{$in:ids}})
    .then(productos => response.json(productos))
    .catch(err => response.json(err))
}

module.exports.getProducto = (request, response) => {
  Producto.findOne({_id:request.params.id})
    .then(producto => response.json(producto))
    .catch(err => response.json(err))
}

module.exports.updateProducto = (request, response) => {
  Producto.findOneAndUpdate({_id: request.params.id}, request.body, {new:true})
    .then(updatedProducto => response.json(updatedProducto))
    .catch(err => response.json(err))
}

module.exports.updateProductoStock = (request, response) => {
  Producto.findOneAndUpdate(
    {_id: request.params.id},
    [{$set:{stock:{
      $switch:{
        branches:[
          {case: {$lt: ['$stock',request.body.cantidad]},then:0},
          {case: {$gt: ['$stock',request.body.cantidad]},then:{$subtract:['$stock',request.body.cantidad]}}
        ],
        default: 0
      }
    }}}],
    {new:true}
    )
    .then(updatedProducto => response.json(updatedProducto))
    .catch(err => response.json(err))
}

module.exports.deleteProducto = (request, response) => {
  Producto.deleteOne({ _id: request.params.id })
    .then(deleteConfirmation => response.json(deleteConfirmation))
    .catch(err => response.json(err))
}

