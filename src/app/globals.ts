
//api
export const API = "http://localhost:8080/api/";

export const confNotifications = {
    timeOut: 4000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true
};

//check log
export function isLogged() {
    var token = getToken();
    if (token == null || token == "")
        return false;

    return true;
};

//logout
export function logout() {
    localStorage.removeItem("id_token");
};

//getToken
export function getToken() {
    return localStorage.getItem('id_token');
}
