const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            msg:'No hay token en la peticion'
        });
    }

    try {

        /* const payload = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        console.log(payload) */

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
       
        //req.uid = uid; //se crea la referencia uid dentro del objeto request

        //leer usuario que corresponda al uid
        const usuario = await Usuario.findById( uid ); 

        //verificar si el uid exista en la bd
        if( !usuario ){
            return res.status(404).json({
                msg: 'Token no valido - usuario no existe en la BD'
            });
        }

        //verificar si el uid tiene estado true
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Token no valido - estado de usuario:false'
            });
        }

        req.usuario = usuario;

        next();

    } catch (error) {

        console.log(error)

        res.status(401).json({
            msg: 'Token no valido'
        });
        
    }
    //console.log(token);

    

}


module.exports = {
    validarJWT
}