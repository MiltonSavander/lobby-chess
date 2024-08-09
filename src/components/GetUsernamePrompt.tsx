import React, { useEffect, useState } from "react";

const GetUsernamePrompt = ({ handleSetUsername, socket, setServerBoardState }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input) {
      console.log("Submitting username:", input); // Debug statement
      handleSetUsername(input);
    }
  };

  useEffect(() => {
    // Request and receive the initial board state when the socket connects
    socket.on("connect", () => {
      console.log("Connected to server, requesting board state...");
      socket.emit("request board state");
    });

    socket.on("board state", (initialBoardState) => {
      console.log("Received initial board state from server:", initialBoardState);
      setServerBoardState(initialBoardState);
    });
  }, [socket]);

  return (
    <div className="username-prompt">
      <form onSubmit={handleSubmit}>
        <label>
          Enter your username:
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default GetUsernamePrompt;
