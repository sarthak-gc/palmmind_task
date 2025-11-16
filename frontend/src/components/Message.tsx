import { axios } from "@/utils/axios";
import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";
import { Button } from "./ui/button";

export interface MessageI {
  sender: {
    _id: string;
    username?: string;
  };
  message: string;
  createdAt?: Date;
}

export const Messages = () => {
  const { otherUserId } = useParams();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageI[]>([]);
  const location = useLocation();
  const username = location.state?.username;
  const navigate = useNavigate();

  const { socket } = useOutletContext<{
    socket: Socket;
  }>();

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(`/messages/message/${otherUserId}`);
      const data = res.data;
      setMessages(data.data.messages);
    };
    fetchMessages();
  }, [otherUserId]);

  useEffect(() => {
    socket.connect();
    socket.on("msg_sent", (data) => {
      const { message, senderId } = data;

      if (senderId == otherUserId) {
        setMessages((prev) => {
          return [
            ...prev,
            {
              sender: {
                _id: senderId,
              },
              message,
              createdAt: new Date(Date.now()),
            },
          ];
        });
      }
    });
  }, [socket, otherUserId]);
  const sendMessage = async () => {
    const senderId = localStorage.getItem("userId");
    socket.emit("message", {
      senderId,
      message: input,
      receiverId: otherUserId,
    });

    await axios.put(`/messages/${otherUserId}/read`);
    const res = await axios.post(`/messages/message/${otherUserId}`, {
      message: input.trim(),
    });
    const data = res.data;

    if (data.status == "success") {
      messages.push({
        sender: {
          _id: localStorage.getItem("userId")!,
          username: "testing",
        },
        message: input.trim(),
        createdAt: new Date(Date.now()),
      });
      toast.success(data.message);
      setInput("");
    }
  };

  return (
    <div className="p-4 w-full mx-auto flex flex-col justify-between ">
      <div className="flex items-center mb-4 border-b border-white pb-3 justify-between">
        <div className="flex gap-3">
          <img
            src={`https://robohash.org/${otherUserId}?set=set5&size=50x50`}
            alt="User Avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="text-xl font-semibold text-white">{username}</span>
        </div>
        <Button
          onClick={() => {
            navigate("/dashboard");
          }}
          className="lg:hidden"
        >
          Go back
        </Button>
      </div>
      <div className="p-2 h-screen overflow-y-scroll mb-2">
        {messages.map((msg, i) => (
          <div key={i} className="mb-1">
            {msg.sender._id === otherUserId ? (
              <div className="flex items-start">
                <div className="bg-gray-200 p-2 rounded-lg max-w-xs text-sm text-gray-800">
                  {msg.message}
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-end">
                <div className="bg-blue-500 p-2 rounded-lg max-w-xs text-sm text-white">
                  {msg.message}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2  h-20">
        <input
          className="border p-1 flex-1 rounded-lg text-white px-3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <Button
          className="h-full text-white px-10 rounded-lg "
          onClick={sendMessage}
        >
          Send
        </Button>
      </div>
    </div>
  );
};
