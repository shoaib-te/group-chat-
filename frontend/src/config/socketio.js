import { io } from 'socket.io-client';

let socketInstance = null;

const initializeSocket = (projectId) => {
    if (socketInstance) {
        return socketInstance;
    }

    // Retrieve the token before initializing the connection
    const token = localStorage.getItem('token');

    socketInstance = io(import.meta.env.VITE_API_URL, {
        withCredentials: true,
        auth: {
            token: token // Passes the token to the server
        },
        query: {
            projectId: projectId
        }
    });
  
    return socketInstance;
};

const reseveMessage = (eventname,cb) =>{
    socketInstance.on(eventname,cb)
}

const sendMessage = (eventname,data) =>{
      
    socketInstance.emit(eventname,data)
  
    

}



export { initializeSocket,sendMessage,reseveMessage  };
