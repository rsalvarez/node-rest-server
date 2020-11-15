const express = require('express');
const app = express();

let { verificaTk, verificaRolAdmin } = require('../midellware/autenticacion');
const categoria = require('../models/categoria');
let Categoria = require('../models/categoria');

// actualizar una categoria
app.put('/categoria/:id', verificaTk, (req, res) => {

    console.log('actualizando ' + req.body.descripcion);
    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, { descripcion: body.descripcion }, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err || !categoriaDB) {
            let status = null;
            if (err) status = 500;
            else status = 400;
            res.status(status).json({
                ok: false,
                err
            });
        } // fin error

        return res.json({
            ok: true,
            categoria: categoriaDB
        });

    });



})



app.get('/categoria/:id', verificaTk, (req, res) => {

    let id = req.params.id;
    console.log('Consultado ' + id);
    Categoria.findById(id, (err, categoriaDB) => {
        if (err || !categoriaDB) {
            let status = null;
            if (err) status = 500;
            else status = 400;
            res.status(status).json({
                ok: false,
                err
            });
        } // fin error

        return res.json({
            ok: true,
            categoria: categoriaDB
        })

    });


})

app.post('/categoria', verificaTk, function(req, res) {

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, cateDb) => {

        if (err) {
            return res.status(500).json({

                ok: false,
                serverError: err

            });
        } else {
            if (!cateDb) {
                return res.status(400).json({

                    ok: false,
                    err

                });
            }
        }

        return res.json({
            ok: true,
            categoria: cateDb
        });

    });

});

// mostrar categorias
app.get('/categoria', verificaTk, (req, res) => {

    Categoria.find()
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                        // err es redundante, puede ir solo el objeto
                });
            }
            Categoria.countDocuments((err, contar) => {
                    return res.json({
                        ok: true,
                        count: contar,
                        categorias
                        // quitamos usuario:
                    })
                } // contar
            );

        });

});

app.delete('/categoria/:id', [verificaTk, verificaRolAdmin], (req, res) => {

    let id = req.params.id;
    console.log(id);
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
                    // err es redundante, puede ir solo el objeto
            });
        }
        console.log('Categoria borrada');
        return res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});

module.exports = app;