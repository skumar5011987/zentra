import { useEffect, useState} from 'react';


const OnlineStatus = () => {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const token = localStorage.getItem("access_token")
    const user = localStorage.getItem("user")
    const headers = {'Authorization': 'Bearer ' + token}

    

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws/online_users/`);
        ws.onopen = (e) => {
            ws.send(JSON.stringify({ headers: headers}));
            console.log("Online User WS Connecttion Opened.", e)
        }
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setOnlineUsers((prevUsers) => {
                if (data.is_online) {
                    return [...prevUsers, data.user_id];
                } else {
                    return prevUsers.filter((user_id) => user_id !== data.user_id);
                }
            });
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            ws.close();
        };
    }, []);

    return onlineUsers;
};

export default OnlineStatus;
