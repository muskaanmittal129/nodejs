const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(authHeader.split(' ')[1] == 'null'){
       const error =  new Error('user is not authenticated');
       error.statusCode = 401;
       throw error;
      
    }
    const token  = authHeader.split(' ')[1];
    let decodedtoken;
    try{
        decodedtoken = jwt.verify(token, 'somesupersupersecret');
    } catch(err) {
        err.statuscode = 500;
        throw err;
    }
    if(!decodedtoken){
       const error =  new Error('user is not authenticated');
       error.statuscode = 401;
       throw error;
    }
    req.userId = decodedtoken.userId;
    next();
}