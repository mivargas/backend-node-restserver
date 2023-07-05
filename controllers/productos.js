const { request, response } = require('express');
const Producto = require('../models/producto');

const obtenerProductos = async (req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;

    const [total, productos] = await Promise.all([
        Producto.countDocuments({ estado: true }),
        Producto.find({ estado: true })
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(from)
            .limit(limit)
    ]);

    res.json({
        total,
        productos
    })
}

const obtenerProducto = async (req = request, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findOne({_id:id, estado:true })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');


    if( !producto ){
        return res.status(400).json({
            msg:'Producto no disponible - estado:false'
        });
    }

    res.json(producto);

}

const crearProducto = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const productoDB = await Producto.findOne({ nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        });
    }


    //generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
        categoria: req.body.categoria
    }

    const producto = new Producto(data);
    await producto.save();

    res.status(201).json(producto)

}

const actualizarProducto = async (req = request, res = response) => {

    const { id } = req.params;

    //req.body.nombre = req.body.nombre.toUpperCase();
    const { estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    try {

        const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
        res.json(producto);

    } catch (error) {
        res.status(400).json({
            msg: 'No se puede actualizar - producto ya existente'
        });
    }

}

const borrarProducto = async (req = request, res = response) => {

    const { id } = req.params;

    const producto =  await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(producto);
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}