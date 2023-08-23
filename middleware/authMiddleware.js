const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authorization = req.get('authorization')
    let token = ''
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        // saco los 7 primeros caracteres para guardar solamente el token
        token = authorization.substring(7)
    }
    let decodedToken = {}

    try {
        // asi estoy decodificandolo con la key
        decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        // aqui consigo los datos que le pase en user.js al token
        console.log('token decodificado con la info dada al generarse login', decodedToken)
    } catch (err) {
        console.log(err)
    }

    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    // aqui le digo que quiero solo el iduser denominado id
    const { id: iduser } = decodedToken

    req.userId = iduser

    next()
}
