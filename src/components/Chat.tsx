import { useEffect, useState } from "react";

type Message = {
  username: string;
  message: string;
};

type ChatProps = {
  username: string;
  socket: SocketIOClient.Socket;
};

const Chat: React.FC<ChatProps> = ({ username, socket }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("chat history", (history: Message[]) => {
      setMessages(history);
    });

    socket.on("chat message", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, [socket]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage: Message = {
        username: username,
        message: input,
      };
      socket.emit("chat message", newMessage);
      setInput("");
    }
  };

  return (
    <div className="chat__component p-6 flex items-center justify-center bg-gray-600">
      <div className="chat__container flex flex-col items-center justify-center gap-4 rounded-xl border-black border-4 bg-red-500">
        <div className="chat__log h-96 overflow-y-auto w-80 flex flex-col gap-2">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <span className="font-bold">{msg.username}:</span> {msg.message}
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="input__container w-full border-blue-600">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter Message" className="w-full px-2 py-1" />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md">
            SEND
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
