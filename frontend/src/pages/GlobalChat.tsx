import type { MessageI } from "@/components/Message";
import { Button } from "@/components/ui/button";
import { axios } from "@/utils/axios";
import { socket } from "@/utils/socket";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const GlobalChat = () => {
  const [messages, setMessages] = useState<MessageI[]>([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [totalMessages, setTotalMessages] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [eventMessage, setEventMessage] = useState("");

  useEffect(() => {
    const fetchGlobalMessages = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("/messages/global", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      setMessages(data.data.messages);
    };
    fetchGlobalMessages();
  }, []);
  useEffect(() => {
    socket.connect();

    const data = {
      userId: localStorage.getItem("userId"),
      username: localStorage.getItem("username"),
    };

    socket.emit("successful_login", { ...data });
    socket.on("global_sent", (data) => {
      const { message, senderId, username } = data;
      setEventMessage(`${username} sent a new message`);
      setMessages((prev) => {
        return [
          ...prev,
          {
            sender: {
              _id: senderId,
              username,
            },
            message,
          },
        ];
      });
    });
    socket.on("total_cnt", (data) => {
      setTotalMessages(data);
    });
    socket.on("online_users", (data) => {
      setOnlineUsers(data);
    });
    socket.on("new_active", (data) => {
      console.log(toast.getHistory());
      setEventMessage(`${data} is online`);
    });
  }, []);

  useEffect(() => {
    if (eventMessage) {
      toast.message(eventMessage);
    }
  }, [eventMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const senderId = localStorage.getItem("userId");
    socket.emit("global_message", {
      senderId,
      username: localStorage.getItem("username"),
      message: input,
    });

    const res = await axios.post("/messages/global", {
      message: input.trim(),
    });

    const data = res.data;

    if (data.status == "success") {
      messages.push({
        sender: {
          _id: localStorage.getItem("userId")!,
          username: localStorage.getItem("username") || "",
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
            src={`https://robohash.org/$random?set=set5&size=50x50`}
            alt="User Avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="text-xl font-semibold text-white">Global Chat</span>
          <span className="text-xl font-semibold text-white">
            Total Messages: {totalMessages}
          </span>
        </div>
        <h1 className="ml-2 text-white text-lg">
          {" "}
          {"Active Users: " + onlineUsers.length}
        </h1>
        <Button
          className="ml-2 text-white text-lg"
          onClick={() => setShowOnlineUsers(!showOnlineUsers)}
        >
          show active users
        </Button>
        <Button
          onClick={() => {
            navigate("/dashboard");
          }}
          className="lg:hidden"
        >
          Go back
        </Button>
      </div>

      {showOnlineUsers && (
        <div className="mb-4 border border-gray-500 pb-10 rounded-lg  overflow-scroll max-h-1/3">
          <span className="text-white text-2xl text-center font-semibold mb-2 block">
            Online Users
          </span>
          <div className="flex flex-col w-full gap-4 px-4">
            {onlineUsers.map((username, i) => (
              <div
                key={i}
                className="flex items-center text-center border-b border-white py-2"
              >
                <img
                  src={`https://robohash.org/${username}?set=set5&size=50x50`}
                  alt={username}
                  className="min-w-10 min-h-10 rounded-full mb-1"
                />
                <span className="text-white text-2xl">{username}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-2 h-screen overflow-y-scroll mb-2">
        {messages.map((msg, i) => (
          <div key={i} className="mb-1">
            {msg.sender._id !== userId ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 mr-4">
                  <img
                    src={`https://robohash.org/${msg.sender._id}?set=set5&size=200x200`}
                    alt="User Avatar"
                    className="w-full h-full rounded-lg object-cover"
                  />
                </div>
                <div className="flex flex-col justify-start">
                  <span className="font-semibold text-lg text-white">
                    {msg.sender.username}
                  </span>
                  <div className="bg-gray-200 p-3 rounded-lg max-w-md text-sm text-gray-800 mt-2">
                    {msg.message}
                  </div>
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
        <div ref={messagesEndRef} />
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

export default GlobalChat;
