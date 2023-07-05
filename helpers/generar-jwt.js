
const jwt = require('jsonwebtoken');

const generarJWT = (uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log('no se pudo generar el token');
                reject(err);
            } else {

                resolve(token);
            }
        });

    });

}

module.exports = {
    generarJWT
}