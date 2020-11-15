const express = require('express');
const app = express();

let { verificaTk } = require('../midellware/autenticacion');
const producto = require('../models/producto');
let Producto = require('../models/producto');

// actualizar una categoria
app.put('/producto/:id', verificaTk, (req, res) => {

    console.log('actualizando ' + req.body.descripcion);
    let id = req.params.id;
    let body = req.body;
    Producto.findById(id)
        .exec((err, productoDb) => {
            if (err || !productoDb) {
                let status = null;
                if (err) status = 500;
                else status = 400;
                res.status(status).json({
                    ok: false,
                    err
                });
            } // fin error

            productoDb.nombre = body.nombre;
            productoDb.precioUni = body.precioUni;
            productoDb.categoria = body.categoria;
            productoDb.disponible = body.disponible;
            productoDb.descripcion = body.descripcion;
            productoDb.usuario = req.usuario.id;

            productoDb.save((err, prodGrabado) => {
                if (err || !prodGrabado) {
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
                    producto: prodGrabado
                });

            })
        });

})



app.get('/productos/:id', verificaTk, (req, res) => {
    let id = req.params.id;
    console.log('Consultado ' + id);

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDb) => {

            if (err || !productoDb) {
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
                producto: productoDb
            });
        });

})

app.post('/producto', verificaTk, function(req, res) {

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        //fechaAlta: { type: Date, required: true, default: new Date() },
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDb) => {
        if (err || !productoDb) {
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
            productoDb
        });
    });

});

// mostrar productos
app.get('/productos', verificaTk, (req, res) => {
    // popular usuario y categoria.
    // paginado
    console.log('consultando desde la fila : ' + req.query.desde + ' la cantidad de registros ' + req.query.cantidadFilas);
    let inicial = req.query.desde || 0;
    inicial = Number(inicial);
    let limite = Number(req.query.cantidadFilas) || 5;

    Producto.find({ disponible: true })
        .sort('nombre')
        .skip(inicial)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err || !productosDB) {
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
                productos: productosDB
            });
        })

});


// mostrar productos
app.get('/productos/buscar/:termino', verificaTk, (req, res) => {
    // popular usuario y categoria.
    // paginado

    let termino = req.params.termino;
    let regexp = new RegExp(termino, 'i');

    Producto.find({ nombre: regexp })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err || !productosDB) {
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
                productos: productosDB
            });
        })

});

app.delete('/producto/:id', verificaTk, (req, res) => {

    let id = req.params.id;
    console.log('borrando ' + id);

    Producto.findByIdAndUpdate(id, { disponible: false }, (err, productoBorrado) => {
        if (err || !productoBorrado) {
            let status = null;
            if (err) status = 500;
            else status = 400;
            res.status(status).json({
                ok: false,
                err
            });
        } // fin error
        console.log('producto borrada');
        return res.json({
            ok: true,
            producto: productoBorrado
        });
    })

});

module.exports = app;