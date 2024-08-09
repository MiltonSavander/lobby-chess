import React, { useEffect } from "react";

const PlayerDisplay = ({ connectedUsers, socket, players, setPlayers }) => {
  // console.log("hello", connectedUsers);

  const chooseSide = (side) => {
    // console.log("chooseing side, this is socket", socket);
    socket.emit("chooseSide", side);
  };

  // console.log(players);
  // console.log(socket);

  return (
    <div className="bg-slate-400">
      <div className="player-white m-2 h-10 flex justify-between items-center">
        {players.white?.username || "none"} playing as white
        {!players.white && (
          <button className=" bg-green-300 size-10" onClick={() => chooseSide("white")}>
            +
          </button>
        )}
        {players.white?.socketID === socket.id && (
          <button className=" bg-red-600 size-10" onClick={() => chooseSide("leave white")}>
            -
          </button>
        )}
      </div>
      <div className="player-black m-2 h-10 flex justify-between items-center">
        {players.black?.username || "none"} playing as black
        {!players.black && (
          <button className=" bg-green-300 size-10" onClick={() => chooseSide("black")}>
            +
          </button>
        )}
        {players.black?.socketID === socket.id && (
          <button className=" bg-red-600 size-10" onClick={() => chooseSide("leave black")}>
            -
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerDisplay;
