import React, { useState } from "react";

const GetUsernamePrompt = ({ handleSetUsername }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input) {
      console.log("Submitting username:", input); // Debug statement
      handleSetUsername(input);
    }
  };

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
