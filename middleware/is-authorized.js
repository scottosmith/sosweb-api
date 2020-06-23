import { verify } from 'jsonwebtoken';

const isAuthorized = (request, response, next) => {
    const loginFailed = () => {
        request.isAuth = false;
        return next();
    }
    const authHeader = request.get('Authorization');

    if (!authHeader) {
        return loginFailed();
    }

    const token = authHeader.split(' ')[1];
    if (!token || token === '') {
        return loginFailed();
    }

    let decodedToken;
    try {
        decodedToken = verify(token, process.env.AUTH_HASH);
    } 
    catch(error) {
        return loginFailed();
    }
    if (!decodedToken) {
        return loginFailed();
    }
    
    request.isAuthorized = true;
    request.userId = decodedToken.userId;
    next();
}

export default isAuthorized;