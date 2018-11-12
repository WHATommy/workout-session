//Global Functions, ;etting other files have access to these functions
window.CACHE_MODULE = {
    getAuthenticatedUserFromCache,
    saveAuthenticatedUserIntoCache,
    deleteAuthenticatedUserFromCache
};

//Grabs the jwt, user id, username, name, and email from the localStorage. Because even if the browser is closed, info in the local storage wont disappear
function getAuthenticatedUserFromCache() {
    const jwtToken = localStorage.getItem('jwtToken');
    const userid = localStorage.getItem('userid');
    const username = localStorage.getItem('username');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');

    //If a jwt was found in the local storage, return the following data
    if (jwtToken) {
        return {
            jwtToken,
            userid,
            username,
            name,
            email
        };
    } else {
        //if not, return undefined because we couldnt find it and that shows the user jwt is expired or never had one
        return undefined;
    }
}

//Saves the information into cache, if it exist
function saveAuthenticatedUserIntoCache(user) {
    localStorage.setItem('jwtToken', user.jwtToken);
    localStorage.setItem('userid', user.id);
    localStorage.setItem('username', user.username);
    localStorage.setItem('name', user.name);
    localStorage.setItem('email', user.email);
}

//Deletes the information into cache, if it exist
function deleteAuthenticatedUserFromCache() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
}