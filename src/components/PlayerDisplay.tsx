import React, { useEffect } from "react";

const PlayerDisplay = ({ connectedUsers, socket, players, setPlayers }) => {
  console.log("hello", connectedUsers);

  const chooseSide = (side) => {
    console.log("this is socket", socket);
    socket.emit("chooseSide", side);
  };

  return (
    <div className="bg-slate-400">
      <div className="player-white p-2 flex justify-between items-center">
        {players.white?.username || "none"} playing as white
        {!players.white && (
          <button className=" bg-green-300 size-10" onClick={() => chooseSide("white")}>
            +
          </button>
        )}
      </div>
      <div className="player-black p-2 flex justify-between items-center">
        {players.black?.username || "none"} playing as black
        {!players.black && (
          <button className=" bg-green-300 size-10" onClick={() => chooseSide("black")}>
            +
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerDisplay;
