
const { Router } = require('express');
const { check } = require('express-validator');
/* const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRol } = require('../middlewares/validar-roles'); */ //se creo archivos index del middleware para unificarlos en u solo llamado
const { esRolValido, existeEmail, existeUsuarioPorId } = require('../helpers/db-validators');

const { validarCampos,
    validarJWT,
    tieneRol } = require('../middlewares');

const { usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
    usuarioGet } = require('../controllers/usuarios');


const router = Router();


router.get('/', usuariosGet);

router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuarioGet);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria y debe ser mayor a 6 caracteres').isLength({ min: 6, max: 25 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(existeEmail),
    //check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRolValido), //se obia elargumento ya que el custom toma el primero
    validarCampos
]
    , usuariosPost);

router.delete('/:id', [
    validarJWT,
    //esAdminRole, //fuerza un solo rol
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'), //USAR MULTIPLES ROLES
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);





module.exports = router;