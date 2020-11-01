require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }))



app.get('/usuario', function(req, res) {
    res.json({ 'mensaje': 'Hola mundo' });
});

app.post('/usuario', function(req, res) {
    let body = req.body;
    if (body.nombre == undefined) {
        res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    } else {
        res.json({ body: body });
    }

});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({ 'id': id });
});

app.delete('/usuario', function(req, res) {
    res.json({ 'DEL-mensaje': 'Hola mundo' });
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando peticiones en puerto : ', process.env.PORT);
});