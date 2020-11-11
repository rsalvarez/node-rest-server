require('./config/config');
const express = require('express');
const app = express();

const mongoose = require('mongoose');

app.use(require('./routes/index'));


mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;

    console.log("Base de datos online");
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando peticiones en puerto : ', process.env.PORT);
});