const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { User } = require('../models/user.model');
const secret = "EstoEsUnSecreto";

module.exports.register = (req, res) => {
    const user = new User(req.body);
    user
    .save()
    .then(() => {
        res.json({ msg: "success!", user: user });
        })
        .catch(err => res.status(400).json(err));
};

module.exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (user === null) {
            res.json({ msg: "invalid login attempt (1) "});
        } else {
            bcrypt
            .compare(req.body.password, user.password)
            .then(passwordIsValid => {
                if (passwordIsValid) {
                    const newJWT = jwt.sign({
                        _id: user._id
                    },secret)
                    res
                        .cookie("usertoken", newJWT,{
                            httpOnly: true,
                            maxAge: 86400000*4 //cuatro días
                        })
                        .status(200).json({
                            msg: "success!",
                            userid:user._id,
                            nombre:user.nombre,
                            apellido:user.apellido,
                            rol:user.rol,
                            tkn:newJWT,
                        });
                } else {
                    res.json({ msg: "invalid login attempt (2)" });
                }
            })
            .catch(err => {
                res.json({ msg: "invalid login attempt (3)"});
                console.log(err);
            });
        }
    })
    .catch(err => res.status(400).json(err));
};

module.exports.getUser = (request, response) => {
    let info=jwt.verify(request.cookies.usertoken, secret);
    User.findOne({_id:info._id})
        .then(user => response.json({nombre:user.nombre,apellido:user.apellido,_id:user._id,rol:user.rol}))
        .catch(err => response.json(err))
};

module.exports.logout = (req, res) => {
    res.clearCookie('usertoken');
    res.sendStatus(200);
} 

module.exports.getCarrito = (request, response) => {
    User.findOne({_id:request.params.id})
        .then(usr => response.json(usr.carritos.length==0?false:usr.carritos[usr.carritos.length-1]))
        .catch(err => response.json(err))
}

module.exports.updateCarrito = (request, response) => {
    User.findOneAndUpdate(
        {_id: request.params.id},
        [{
            $set: {
                carritos: {
                    $concatArrays: [
                        {
                            $slice: [
                                "$carritos",
                                {$subtract:[{$size:"$carritos"},1] }
                            ]
                        },
                        [request.body]
                    ]
                }
            }
        }],
        {new:true}
    )
        .then(updatedUser => response.json(updatedUser))
        .catch(err => response.json(err))
}


module.exports.getAllVentas = (request, response) => {
    User.find({})
    .then(usuarios => response.json(usuarios))
    .catch(err => response.json(err))
}

module.exports.newCarrito = (request, response) => {
    User.findOneAndUpdate(
        {_id: request.params.id},
        {$push:{carritos:request.body}},
        {new:true}
    )
        .then(updatedUser => response.json(updatedUser))
        .catch(err => response.json(err))
}

