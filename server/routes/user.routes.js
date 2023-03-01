const Users = require('../controllers/user.controller');
const { authenticate } = require('../config/jwt.config');

module.exports = app => {
    app.post("/api/register", Users.register);
    app.post("/api/login", Users.login);
    app.get("/api/logout", authenticate, Users.logout);
    app.get('/api/usercookie', authenticate, Users.getUser);
    app.get('/api/getcarrito/:id', authenticate, Users.getCarrito);
    app.put('/api/updatecarrito/:id', authenticate, Users.updateCarrito);
    app.get('/api/getVentas',authenticate, Users.getAllVentas);
    app.put('/api/newcarrito/:id', Users.newCarrito);
}
