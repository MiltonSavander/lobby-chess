import React from "react";

const PlayerDisplay = ({ username }) => {
  return (
    <div className=" bg-slate-400">
      <div className="player-white p-2">{username || "blank"} playing as white</div>
      <div className="player-black p-2">player 2 playing as black</div>
    </div>
  );
};

export default PlayerDisplay;
