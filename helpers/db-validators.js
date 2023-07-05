const Categoria = require("../models/categoria");
const Producto = require("../models/producto");
const Role = require("../models/role");
const Usuario = require("../models/usuario");

const esRolValido = async (rol = '') => {
    const existRol = await Role.findOne({ rol });

    if (!existRol) {
        throw new Error(`El rol ${rol} no esta registrado en la BD`)
    }
}

const existeEmail = async (correo = '') => {
    const email = await Usuario.findOne({ correo });
    if (email) {
        throw new Error(`El correo: ${correo} ya esta registrado en la BD`)
    }
}


const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El ID: ${id} no existe en la BD`)
    }
}

const existeCategoriaPorId = async (id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`La categoria con ID: ${id} no existe en la BD`)
    }
}

const existeProductoPorId = async (id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El producto con ID: ${id} no existe en la BD`)
    }
}

//validar colecciones permitidas

const coleccionesPermitidas = (coleccion = '',  colecciones = []) => {

    const incluida = colecciones.includes(coleccion);

    if( !incluida ){
        throw new Error(`La coleccion ${coleccion} no es permitida - permitidas: ${colecciones}`)
    }

    return true;
}


module.exports = {
    esRolValido,
    existeEmail,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
};