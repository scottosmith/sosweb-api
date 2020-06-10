//#region Lil Helpers
// Construct the fullName data
exports.fullName = (fn, ln) => {
    if (ln) {
        return fn + ' ' + ln;
    }
    return fn;
}

// Cleanup the date as stored in mongo
exports.prettyDate = d => new Date(d).toISOString();
//#endregion