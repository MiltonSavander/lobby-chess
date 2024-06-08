import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000", { transports: ["websocket"] });

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("chat history", (history: string[]) => {
      setMessages(history);
    });

    socket.on("chat message", (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit("chat message", input);
      setInput("");
    }
  };

  return (
    <div className="chat__component p-6 flex items-center justify-center bg-gray-600">
      <div className="chat__container flex flex-col items-center justify-center gap-4 rounded-xl border-black border-4 bg-red-500">
        <div className="chat__log size-[350px]">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              {msg}
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="input__container w-full border-blue-600">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter Message" />
          <button type="submit">SEND</button>
        </form>
      </div>
    </div>
  );
}
