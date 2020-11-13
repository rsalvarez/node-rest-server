const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);



const _ = require('underscore');
const usuario = require('../models/usuario');

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



async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    console.log(ticket);

    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return {
        img: payload.picture,
        nombre: payload.name,
        email: payload.email,
        google: true
    }

}


app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(400).json({
                ok: false,
                err: e
            })

        });
    console.log(googleUser);
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res - status(400).json({
                ok: false,
                err: e
            })
        };
        if (usuarioDB) {
            if (!usuarioDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar la autenticacion normal, sin GOOGLE'
                    }
                })
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCA });
            }

            return res.json({
                ok: true,
                usuario: usuarioDB,
                token
            })
        } else {
            // no existe el usuario en la DB
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = '!=0';
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err: err
                    })
                } else {
                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCA });
                }

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            });


        } // fin if existe usuario

    })


});


module.exports = app;