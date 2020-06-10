import { verify } from 'jsonwebtoken';

const loginFailed = () => {
    request.isAuth = false;
    return next();
}

const isAuth = (request, response, next) => {
    const authHeader = request.get('Authorization');
    if (!authHeader) {
        loginFailed();
    }
    const token = authHeader.split(' ')[1];
    if (!token || token.isEmpty()) {
        loginFailed();
    }
    let decodedToken;
    try {
        decodedToken = verify(token, process.env.AUTH_HASH);
    } 
    catch(error) {
        loginFailed();
    }
    if (!decodedToken) {
        loginFailed();
    }
    request.isAuth = true;
    request.userId = decodedToken.userId;
    next();
}

export default isAuth;