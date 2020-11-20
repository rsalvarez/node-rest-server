const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');
const { verificaTk } = require('../midellware/autenticacion');

app.get('/imagen/:tipo/:id', verificaTk, (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    let pathNoImagen = path.resolve(__dirname, `../assests/no-image.jpg`);



    if (tipo === 'producto') {
        Producto.findById(id, (err, productoDb) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDb) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario Inexistente'
                    }
                });
            }
            let pathUrl = path.resolve(__dirname, `../uploads/${tipo}/${productoDb.img}`);
            console.log(pathUrl);
            if (fs.existsSync(pathUrl)) {
                res.sendFile(pathUrl);
            } else {
                res.sendFile(pathNoImagen);
            }
        })
    } else {
        Usuario.findById(id, (err, usuarioDb) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!usuarioDb) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario Inexistente'
                    }
                });
            }
            let pathUrl = path.resolve(__dirname, `../uploads/${tipo}/${usuarioDb.img}`);
            console.log(pathUrl);
            if (fs.existsSync(pathUrl)) {
                res.sendFile(pathUrl);
            } else {
                res.sendFile(pathNoImagen);
            }
        })
    }


});


module.exports = app;