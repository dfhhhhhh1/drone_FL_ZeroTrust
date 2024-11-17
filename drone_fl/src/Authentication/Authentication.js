import axios from "axios";

const checkAuth = async () => {
    try {
        const response = await axios.get("/api/login/validate", {
            withCredentials: true,
        });
        return response.data.valid;
    } catch (error) {
        return false;
    }
}

export default checkAuth;