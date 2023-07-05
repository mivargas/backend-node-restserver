const { request, response } = require("express");
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require("../helpers/subir-archivo");
const Producto = require("../models/producto");
const Usuario = require("../models/usuario");


const cargarArchivo = async (req = request, res = response) => {


    try {
        //const nombre = await subirArchivo(req.files);
        //const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');

        res.json({
            nombre
        });

    } catch (msg) {
        res.status(400).json({
            msg
        });
    }


    /* console.log('req.files >>>', req.files); // eslint-disable-line

    const { archivo } = req.files;
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1]
    //validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extension)) {
        return res.status(400).json({
            msg: `La extension ${extension} no es permitida, ${extensionesValidas}`
        })
    }
    const nombreTemp = `${uuidv4()}.${extension}`
    //const uploadPath = path.join(__dirname, '../uploads/', archivo.name);
    const uploadPath = path.join(__dirname, '../uploads/', nombreTemp);


    archivo.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({ err });
        }

        res.json({ msg: 'File uploaded to ' + uploadPath });
    }); */

}

const actualizarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe usaurio con el id ${id}`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe producto con el id ${id}`
                })
            }

            break;

        default:
            return res.status(500).json({
                msg: 'validacion no contemplada'
            });
    }

    try {
        //limpiar imagenes previas
        if (modelo.img) {
            //borrar imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }

        const nombre = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = nombre

        await modelo.save();

        res.json(modelo);

    } catch (msg) {
        res.status(400).json({
            msg
        });
    }

}

const actualizarImagenCloudinary = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe usaurio con el id ${id}`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe producto con el id ${id}`
                })
            }

            break;

        default:
            return res.status(500).json({
                msg: 'validacion no contemplada'
            });
    }

    try {
        //limpiar imagenes previas
        if (modelo.img) {
            //borrar imagen del servidor
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length -1];
            const [ public_id ] = nombre.split('.');
            cloudinary.uploader.destroy(public_id);
        }

        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

        modelo.img = secure_url;

        await modelo.save();

        res.json(modelo);

    } catch (msg) {
        res.status(400).json({
            msg
        });
    }

}

const mostrarImagen = async (req = request, res = response) => {


    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe usaurio con el id ${id}`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe producto con el id ${id}`
                })
            }

            break;

        default:
            return res.status(500).json({
                msg: 'validacion no contemplada'
            });
    }

    try {
        //limpiar imagenes previas
        if (modelo.img) {
            //borrar imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen)
            }
        }

        /* res.json({
            msg: 'falta place holder'
        }); */

        const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
        return res.sendFile(pathImagen)



    } catch (msg) {
        res.status(400).json({
            msg
        });
    }
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
}