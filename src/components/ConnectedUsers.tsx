import React from "react";

const ConnectedUsers = ({ users }) => {
  console.log("this is user", users);
  return (
    <div className="connected-users">
      <h3>Connected Users</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectedUsers;
