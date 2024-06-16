import io from "socket.io-client";
import "./App.css";
import Chat from "./Chat";
import ChessComponent from "./ChessComponent";
import PlayerDisplay from "./PlayerDisplay";
import GetUsernamePrompt from "./GetUsernamePrompt";
import { useEffect, useState } from "react";
import ConnectedUsers from "./ConnectedUsers";

const socket = io("http://localhost:3000", { transports: ["websocket"] });

function App() {
  const [username, setUsername] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [players, setPlayers] = useState({
    white: null,
    black: null,
    spectating: [],
  });

  useEffect(() => {
    socket.on("user list", (userList) => {
      setConnectedUsers(userList);
      console.log(userList);
    });

    socket.on("updatePlayers", (updatedPlayers) => {
      setPlayers(updatedPlayers);
      console.log("players updated:", updatedPlayers);
    });

    return () => {
      socket.off("user list");
      socket.off("updatePlayers");
    };
  }, []);

  const handleSetUsername = (inputUsername) => {
    setUsername(inputUsername);
    socket.emit("set username", inputUsername);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {username ? (
        <>
          <ChessComponent />
          <div className="flex flex-col gap-20">
            <PlayerDisplay connectedUsers={connectedUsers} socket={socket} players={players} setPlayers={setPlayers} />
            <Chat username={username} socket={socket} />
            <ConnectedUsers users={connectedUsers} />
          </div>
        </>
      ) : (
        <GetUsernamePrompt handleSetUsername={handleSetUsername} />
      )}
    </div>
  );
}

export default App;
