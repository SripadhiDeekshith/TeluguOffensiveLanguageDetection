
import Axios from "axios";

// Configure Axios to include cookies with each request
Axios.defaults.withCredentials = true;

async function login(email, pwd) {
    try {
        const res = await Axios.post("/api/login", { email, pwd });
        const { data } = res;
        if (data.error) {
            return data.error;
        } else {
            // On success, the server sets a session cookie automatically.
            return true;
        }
    } catch (error) {
        return error;
    }
}

async function check() {
    try {
        const res = await Axios.get("/api/getcurrentuser", { withCredentials: true });
        return res.data;
    } catch (error) {
        console.error("Not logged in", error);
        return false;
    }
}

function logout() {
    Axios.post("/api/logout", {}, { withCredentials: true })
        .then(res => {
            window.location = "/login";
        })
        .catch(err => {
            console.error(err);
        });
}

export { login, check, logout };
