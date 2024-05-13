const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('Authorization')    
    if (authorization?.startsWith('Bearer '))
        req.token = authorization.replace('Bearer ', '')

    next()
}

module.exports = {
    tokenExtractor
}