import { useState, useEffect } from "react";
import "./style.css";
import io from "socket.io-client";


const myId = 2;

const socket = io("http://localhost:8080");

socket.on("connect", () =>
  console.log("[IO] Connect  =>A new connection has been established")
);

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleNewMessage = (newMessage) =>
      setMessages([...messages, newMessage]);
    socket.on("chat.message", handleNewMessage);
    return () => socket.off("chat.message", handleNewMessage);
  }, [messages]);

  const handleFormSubmite = (even) => {
    even.preventDefault();
    if (message.trim()) {
      socket.emit("chat.message", {
        id: myId,
        message,
      });
      setMessage("");
    }
  };

  const handleInputChange = (event) => setMessage(event.target.value);

  return (
    <>
      <main className="main">
        <ul className="ul">
          {messages.map((elem, index) => (
            <li
              className={`${elem.id === myId ? "mine" : "other"}`}
              key={index}
            >
              <span className={`${elem.id === myId ? "mine" : ""}`}>
                {elem.message}
              </span>
            </li>
          ))}
        </ul>

        <form className="form" onSubmit={handleFormSubmite}>
          <input type="text" value={message} onChange={handleInputChange} />
        </form>
      </main>
    </>
  );
};
export default Chat;
