"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

export default function ChatPage() {
  const [name, setName] = useState<string>("");
  const [messages, setMessages] = useState<{ nickname: string, content: string }[]>([]);
  const [message, setMessage] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [stompClient, setStompClient] = useState<any>(null);
  
  console.log('messages:', messages)
  const handlePost = () => {
    if (stompClient && stompClient.connected) {
      const chatMessage = {
        nickname,
        content: message,
      };
      stompClient.send("/topic/messages", {}, JSON.stringify(chatMessage));
      // setMessage(""); // Clear message input after sending
    }
  };

  useEffect(() => {
    const socket = new SockJS(`http://localhost:8080/ws/`);
    const client = over(socket);

    client.connect({}, () => {
      client.subscribe("/topic/messages", (message: any) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
    });

    setStompClient(client);

    return () => {
      if (client.connected) {
        client.disconnect(() => {
          console.log("Disconnected");
        });
      }
    };
  }, []);

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="flex flex-col justify-center items-center min-w-full gap-5 h-[100vh]">
      <input
        type="text"
        placeholder="Enter your nickname"
        value={nickname}
        onChange={handleNicknameChange}
        className="border border-gray-200 p-2"
      />
      <input
        type="text"
        placeholder="Enter your message"
        value={message}
        onChange={handleMessageChange}
        className="border border-gray-200 p-2"
      />
      <button
        onClick={handlePost}
        className="bg-amber-400 rounded-md shadow-md p-2"
      >
        Send message
      </button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.nickname}:</strong> {msg.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
