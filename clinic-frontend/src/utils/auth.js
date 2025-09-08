export function isAuthenticated() {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try{
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp && payload.exp * 1000 <Date.now()) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return false;
        }
        return true;
    } catch{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return false;
    }
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}