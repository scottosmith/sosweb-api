const authorize = (request) => {
    if (!request.isAuth) {
        throw new Error("Unauthorized!");
    }
}

export default authorize;