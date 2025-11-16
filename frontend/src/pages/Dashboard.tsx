import { Sidebar, type User } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axios } from "@/utils/axios";
import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchName, setSearchName] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = {
      userId: localStorage.getItem("userId"),
      username: localStorage.getItem("username"),
    };
    socket.connect();
    socket.emit("successful_login", { ...data });

    socket.on("msg_sent", (data) => {
      const { message, senderId } = data;

      setUsers((prevUsers) => {
        const exists = prevUsers.some((user) => user.id === senderId);

        if (exists) {
          return prevUsers.map((user) => {
            return user.id === senderId
              ? {
                  ...user,
                  lastMessage: message,
                  unRead: true,
                }
              : user;
          });
        } else {
          return [
            {
              id: senderId,
              username: "New message",
              unRead: true,
              lastMessage: message,
            },
            ...prevUsers,
          ];
        }
      });
    });
  }, [users]);

  useEffect(() => {
    const getConversations = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("/messages/conversations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      setUsers(data.data.uniqueUsersList);
      setLoading(false);
    };

    getConversations();
  }, []);

  const handleSearch = async () => {
    const res = await axios.get(`/user/search?u=${searchName}`);
    const data = res.data;

    setSearchedUsers(data.data.users);
  };
  return (
    <div className="w-screen h-screen flex bg-black">
      {loading && <div className="text-white text-center">Loading...</div>}
      <div className="w-1/4  pt-4 border-r border-white justify-between flex flex-col pb-10">
        <div>
          <div className="flex gap-3 mb-10 px-4">
            <Input
              className="placeholder:text-white/80 placeholder:font-bold text-white"
              placeholder="search user"
              onChange={(e) => {
                setSearchName(e.target.value);
              }}
            />
            <Button
              disabled={searchName.trim().length == 0}
              onClick={handleSearch}
              className="px-4"
            >
              Search
            </Button>
          </div>
          {users.length > 0 && (
            <>
              <Sidebar users={users} />
            </>
          )}

          {searchedUsers.length > 0 && (
            <>
              <Sidebar users={searchedUsers} searched={true} />
            </>
          )}
        </div>
        <div className="flex justify-between px-3">
          <Button
            onClick={() => {
              navigate("/dashboard");
            }}
            className="w-2/5"
          >
            Users
          </Button>
          <Button
            onClick={() => {
              navigate("/dashboard/global");
            }}
            className="w-2/5"
          >
            Global
          </Button>
        </div>
      </div>
      <Outlet context={{ socket }} />
    </div>
  );
};
