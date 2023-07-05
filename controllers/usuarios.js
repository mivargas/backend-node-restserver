const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const usuariosGet = async (req = request, res = response) => {

    //const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;
    const { limit = 5, from = 0 } = req.query; //por defecto esta en 5

    /* const usuarios = await Usuario.find({ estado:true })
        .skip(from)
        .limit(limit);

    const total = await Usuario.countDocuments({ estado:true }); */ //se cambio a una promesa para optimizar tiempo de respuesta ya que se ejecutan a la vez
    
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({ estado:true }),
        Usuario.find({ estado:true })
    ]);
    
    res.json({
        total,
        usuarios
    });
}


const usuarioGet = async (req = request, res = response) => {
    const { id } = req.params;
    
    const usuario = await Usuario.findById( id );

    res.json(usuario);
}

const usuariosPost = async (req, res = response) => {

    //validaciones (se  movio codigo a archivo middleware)

    //const body = req.body;
    const { nombre, correo, password, rol } = req.body;

    const usuario = new Usuario({ nombre, correo, password, rol });

    //verificar si correo existe
    /* const existeEmail = await Usuario.findOne({ correo }); // {correo:corre} esto es redundante
    if(existeEmail){
        return res.status(400).json({
            msg: 'El correo ya esta registrado'
        });
    } */
    //encriptar contrasena
    const salt = bcryptjs.genSaltSync(); //numero de saltos para el encriptado por defecto es 10 pero puede ser 100 (esto hara que sea mas lento)
    usuario.password = bcryptjs.hashSync(password, salt)

    await usuario.save();

    res.json(usuario);
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //todo validar contra BD
    if (password) {
        const salt = bcryptjs.genSaltSync(); 
        resto.password = bcryptjs.hashSync(password, salt)

    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true}); // el parametro new es para que se devuelva el usuario actualizado de lo contrario traera el viejo antes de la actualizacion (respuesta json)

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;

    //fisicamente (borrar)
    //const usuario = await Usuario.findByIdAndDelete( id );
    
    //logicamente (borrar)
    const usuario = await Usuario.findByIdAndUpdate( id, {estado:false}, {new:true} );


    res.json({
        usuario
    });
}




module.exports = {
    usuariosGet,
    usuarioGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}