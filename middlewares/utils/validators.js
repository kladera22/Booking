const userValidator = (req, res, next) => {
    if(req.body){
        if(
            !req.body.firstName ||
            !req.body.lastName ||
            !req.body.username ||
            !req.body.password ||
            !req.body.age ||
            !req.body.email){
            res
            .status(400)
            .setHeader('Content-Type', 'text/plain')
            .json({
                success: false, msg: 'Missing Required Fields'
            })
        }
        else{
            next()
        }
    }
    else{
        res.end(`Request for path: ${req.protocol} and method: ${req.method} is missing payload`)
        }
}

const adminValidator = (req, res, next) => {
    if(req.user.admin) {
        next()
    }
    else {
        res
        .status(403)
        .setHeader('Content-Type', 'application/json')
        .json({success: false, mgs: 'Unauthorized to access this resource!'})
    }
}

module.exports = {
    userValidator,
    adminValidator
}