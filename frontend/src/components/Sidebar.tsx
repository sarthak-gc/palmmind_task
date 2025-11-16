import { axios } from "@/utils/axios";
import { useNavigate } from "react-router-dom";

export interface User {
  id: string;
  username: string;
  unRead?: boolean;
  lastMessage?: string;
}

export const Sidebar = ({
  users,
  searched,
}: {
  users: User[];
  searched?: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-4 px-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center  cursor-pointer transition-all duration-150 h-20  border-b-2 border-white hover:bg-gray-800/80"
          onClick={async () => {
            await axios.put(`/messages/${user.id}/read`);
            user.unRead = false;
            navigate(`/dashboard/${user.id}`, {
              state: {
                username: user.username,
              },
            });
          }}
        >
          <img
            src={`https://robohash.org/${user.id}?set=set5&size=50x50`}
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="ml-3 flex w-full  items-center justify-between overflow-hidden">
            <div>
              <span className="text-white text-sm font-semibold">
                {user.username}
              </span>
              <div className="flex justify-between items-center text-xl text-gray-400">
                <span className="truncate max-w-[100px]">
                  {user.lastMessage}
                </span>
              </div>
            </div>
            {!searched && (
              <div className="flex justify-between items-center text-xs text-gray-400">
                {user.unRead && (
                  <span className="bg-blue-500 text-white h-7 w-7 rounded-full flex items-center justify-center">
                    !
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
