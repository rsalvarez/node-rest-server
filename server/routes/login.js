const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');



const _ = require('underscore');

app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usrDB) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });

        if (!usrDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o "contraseña" incorrecto'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, usrDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrecta'
                }
            });
        }
        let token = jwt.sign({
            usuario: usrDB
        }, process.env.SEED, { expiresIn: process.env.CADUCA });

        res.json({
            ok: true,
            usuario: usrDB,
            token
        });

    });

})


module.exports = app;