const { request, response } = require('express');
const Categoria = require('../models/categoria');

const obtenerCategorias = async (req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;

    const [total, categoerias] = await Promise.all([
        Categoria.countDocuments({ estado: true }),
        Categoria.find({ estado: true })
            .skip(from)
            .limit(limit)
            .populate('usuario', 'nombre')
    ]);

    res.json({
        total,
        categoerias
    })
}

const obtenerCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findOne({_id:id, estado:true })
        .populate('usuario');

    if( !categoria ){
        return res.status(400).json({
            msg:'Categoria no disponible - estado:false'
        });
    }

    res.json(categoria);

}

const crearCategoria = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoeriaDB = await Categoria.findOne({ nombre });

    if (categoeriaDB) {
        return res.status(400).json({
            msg: `La categotia ${categoeriaDB.nombre} ya existe`
        });
    }


    //generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    await categoria.save();

    res.status(201).json(categoria)

}

const actualizarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    //req.body.nombre = req.body.nombre.toUpperCase();
    const { estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    try {

        const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
        res.json(categoria);

    } catch (error) {
        res.status(400).json({
            msg: 'No se puede actualizar - categoria ya existente'
        });
    }

}

const borrarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const categoria =  await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(categoria);
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}