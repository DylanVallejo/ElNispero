const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const ProdsCarritoSchema = new mongoose.Schema({
    prodid: {type: mongoose.Schema.Types.ObjectId},
    cantidad: {type: Number}
},{timestamps: true,versionKey: false});

const CarritoSchema = new mongoose.Schema({
    listaprods: {
        type: [ProdsCarritoSchema],
    },
    pagoefectuado: {type: Boolean},
    fechapago: {type: Date},
    montopago: {type: Number}
},{timestamps: true,versionKey: false});

const UserSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'Se requiere el nombre'],
    },
    apellido: {
        type: String,
        required: [true, 'Se requiere el apellido'],
    },
    email: {
        type: String,
        required: [true, 'Se requiere una dirección de correo electrónico'],
        unique: true,
        validate: {
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Por favor ingrese un email válido"
        }
    },
    password: {
        type: String,
        required: [true, 'Se requiere una contraseña'],
        minlength: [8, "La contraseña debe contener al menos 8 caracteres"]
    },
    rol: {
        type: String,
        required: [true, 'Se requiere el rol'],
    },
    carritos: {
        type: [CarritoSchema]
    }
},{timestamps: true, versionKey: false});

UserSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        });
});


UserSchema.plugin(uniqueValidator);
const User = mongoose.model("users", UserSchema);

module.exports = {User};