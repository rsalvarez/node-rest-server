// verificamos el token
const jwt = require('jsonwebtoken');

let verificaRolAdmin = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Usuario sin permisos para la operacion'
            }
        });

    }
    next();

};




let verificaTk = (req, res, next) => {

    let token = req.get('Authorization');
    console.log(pñrocess.env.SEED);
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no validos'
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