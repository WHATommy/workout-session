//Allows access to three of the functions without 3 seperate globals
window.CACHE_MODULE = {
    getAuthenticatedUserFromCache,
    saveAuthenticatedUserIntoCache,
    deleteAuthenticatedUserFromCache
};

//Function to confirm id the the user already logged in before
function getAuthenticatedUserFromCache() {
    //Storing cache data into variables
    const jwtToken = localStorage.getItem('jwtToken');
    const userid = localStorage.getItem('userid');
    const username = localStorage.getItem('username');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');

    //If jwtToken exist
    if (jwtToken) {
        //Return the items below
        return {
            jwtToken,
            userid,
            username,
            name,
            email
        };
    } else {
        //If it does NOT exist, the return undefine
        return undefined;
    }
}

//function to save users information into cache
function saveAuthenticatedUserIntoCache(user) {
    localStorage.setItem('jwtToken', user.jwtToken);
    localStorage.setItem('userid', user.id);
    localStorage.setItem('username', user.username);
    localStorage.setItem('name', user.name);
    localStorage.setItem('email', user.email);
}

//function to delete users information from the local storage when they log out
function deleteAuthenticatedUserFromCache() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
}