
const validarArchivo  = require('./validar-archivo');
const validarCampos = require('./validar-campos');
const validarJWT = require('./validar-jwt');
const tieneRol = require('./validar-roles');


module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...tieneRol,
    ...validarArchivo
}