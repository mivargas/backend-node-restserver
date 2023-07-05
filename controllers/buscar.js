const { response } = require("express");
const { isValidObjectId } = require("mongoose");
const Categoria = require("../models/categoria");
const Producto = require("../models/producto");
const Usuario = require("../models/usuario");

const coleccionesPermitidas = [
    'usarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoID = isValidObjectId(termino);

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results:( usuario ) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i'); //insensibilidad a mayusculas y minusculas

    const usuarios = await Usuario.find({
        $or:[{nombre: regex}, {correo: regex}],
        $and:[{estado: true}]
    });

    res.json({
        total: usuarios.length,
        results: usuarios
    });

}

const buscarCategorias = async (termino = '', res = response) => {
    
    const esMongoID = isValidObjectId(termino);

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results:( categoria ) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i'); 
    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        total: categorias.length,
        results: categorias
    });

}


const buscarProductos = async (termino = '', res = response) => {
    
    const esMongoID = isValidObjectId(termino);

    if (esMongoID) {
        const producto = await Producto.findById(termino)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre');
        return res.json({
            results:( producto ) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i'); 
    const productos = await Producto.find({ nombre: regex, estado: true })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json({
        total: productos.length,
        results: productos
    });

}

const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usarios':
            buscarUsuarios(termino, res);

            break;

        case 'categorias':
            buscarCategorias(termino, res);
            break;

        case 'productos':
            buscarProductos(termino, res);
            break;

        case 'roles':

            break;

        default:
            res.status(500).json({
                msg: 'contacte al administrador de sistema'
            });
            break;
    }

}


module.exports = {
    buscar
}