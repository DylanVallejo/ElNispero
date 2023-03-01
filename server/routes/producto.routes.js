const ProductoController = require('../controllers/producto.controller');
const { authenticate } = require('../config/jwt.config');

module.exports = app => {
  app.post('/api/producto/new', authenticate, ProductoController.createProducto);
  app.get('/api/productos', ProductoController.getAllProductos);
  app.get('/api/productoscarrito/:ids', ProductoController.getSomeProductos);
  app.get('/api/producto/:id', ProductoController.getProducto);
  app.put('/api/producto/:id', authenticate, ProductoController.updateProducto);
  app.put('/api/productostock/:id', authenticate, ProductoController.updateProductoStock);
  app.delete('/api/producto/:id', authenticate, ProductoController.deleteProducto);
}
