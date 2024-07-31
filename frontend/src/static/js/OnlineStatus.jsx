import { useEffect, useState, useRef } from 'react';


const OnlineStatus = () => {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const token = localStorage.getItem("access_token")
    const user = localStorage.getItem("user")
    const headers = {'Authorization': 'Bearer ' + token}
    const ws = useRef(null);
    

    useEffect(() => {
        ws.current = new WebSocket(`ws://localhost:8000/ws/online_users/?token=${token}`);

        ws.current.onopen = (e) => {
            console.log("Online User WS Connection Opened.", e);
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received data:", data);

            if (data.user_ids) {
                setOnlineUsers(data.user_ids);
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            ws.current.close();
        };
    }, [token]);


    return onlineUsers;
};

export default OnlineStatus;
