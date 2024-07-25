import { useEffect, useState } from 'react';

const OnlineStatus = () => {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const ws = new WebSocket(
            'ws://'
            + window.location.host
            +'/ws/'
            +'online_users/'
        );
        ws.onopen =(e)=>{
            console.log("Online User WS Connecttion Opened.")
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

        // return () => {
        //     ws.close();
        // };
    }, []);

    return onlineUsers;
};

export default OnlineStatus;
