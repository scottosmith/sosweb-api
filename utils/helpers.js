//#region Lil Helpers
// Construct the fullName data
export const fullName = (fn, ln) => {
    if (ln) {
        return fn + ' ' + ln;
    }
    return fn;
}

// Cleanup the date as stored in mongo
export const prettyDate = d => new Date(d).toISOString();
//#endregion