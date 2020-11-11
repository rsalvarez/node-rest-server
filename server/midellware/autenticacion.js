// verificamos el token
const jwt = require('jsonwebtoken');

let verificaRolAdmin = (req, res, next) => {

    let usuario = req.usuario;

    console.log(usuario);
    if (usuario.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Usuario sin permisos para la operacion'
            }
        });

    }
    next();

    /*jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });*/
};




let verificaTk = (req, res, next) => {

    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });


};

module.exports = {
    verificaTk,
    verificaRolAdmin
}