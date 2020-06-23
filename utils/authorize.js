const authorize = (request) => {
    if (!request.isAuthorized) {
        throw new Error("Unauthorized!");
    }
}

export default authorize;