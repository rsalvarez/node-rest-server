const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

const _ = require('underscore');

const { res } = require('express');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));

const {
    verificaTk,
    verificaRolAdmin
} = require('../midellware/autenticacion');

app.get('/usuario', verificaTk, function(req, res) {
    //return res.json({ usuario: req.usuario });

    let inicial = req.query.desde || 0;
    inicial = Number(inicial);
    let limite = Number(req.query.limite) || 5;
    Usuario.find({ estado: true }, 'nombre email role img estado')
        .skip(inicial)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                        // err es redundante, puede ir solo el objeto
                });
            }
            Usuario.countDocuments({ estado: true }, (err, contar) => {
                    return res.json({
                        ok: true,
                        count: contar,
                        usuarios
                        // quitamos usuario:
                    })
                } // contar
            );


        });
});

app.post('/usuario', [verificaTk, verificaRolAdmin], function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) return res.status(400).json({
            ok: false,
            err
        });
        return res.json({
            ok: true,
            usuario: usuarioDB
        });

    });



});

app.put('/usuario/:id', [verificaTk, verificaRolAdmin], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({ 'id': id, usuario: usuarioDB });
    })
});

app.delete('/usuario/:id', [verificaTk, verificaRolAdmin], function(req, res) {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, (err, usuarioActualizado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioActualizado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    })


});

module.exports = app;