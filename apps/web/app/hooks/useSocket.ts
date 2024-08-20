import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const URL = {
  LOCAL: "http://127.0.0.1:5000",
  SERVER: "https://synctalk.onrender.com",
};
const useSocket = (token: string | undefined) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    //TODO Repalce with server URL
    const socketIo = io(URL.LOCAL, {
      query: { token },
    });

    // @ts-ignore
    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [token]);

  return socket;
};

export default useSocket;
