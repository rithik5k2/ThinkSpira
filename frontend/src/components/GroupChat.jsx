import { useAuth } from "../ProtectedRoutes/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const GroupChat = () => {
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!login) {
            navigate("/login");
        }
    }, [login, navigate]);

    return <h1>This is Group Chat</h1>;
};

export default GroupChat;
