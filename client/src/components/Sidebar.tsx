import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//@ts-ignore
import { useGetUsersForSidebarMutation } from "../redux/slices/api/messagesApi";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
//@ts-ignore
import { connectSocket, disconnectSocket } from "../utils/socket";
//@ts-ignore
import { setOnlineUsers } from "../redux/slices/socketSlice";
//@ts-ignore
import { setSelectedUser } from "../redux/slices/selectedUserSlice";
import { User } from "../types/index";
import { Users } from "lucide-react";
const Sidebar = () => {
  const dispatch = useDispatch();

  const selectedUser = useSelector(
    (state: any) => state.selectedUser.selectedUser
  );
  
  const user = useSelector((state: any) => state.auth.user);
  const userId = user._id;

  const [getUsersForSidebar, { isLoading: isUsersLoading }] =
    useGetUsersForSidebarMutation();

  const onlineUsers = useSelector(
    (state: any) => state.socket.onlineUsers || []
  );

  

  const [allUsers, setAllUsers] = useState([]);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    connectSocket(userId, (users) => {
      dispatch(setOnlineUsers(users));
    });
  }, [userId]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsersForSidebar().unwrap();
      setAllUsers(users);
    };
    fetchUsers();
  }, []);

  const filteredUsers = showOnlineOnly
    ? allUsers.filter((user: User) =>
        onlineUsers.find((u: any) => u._id === user._id)
      )
    : allUsers;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-24 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="p-2 overflow-y-auto">
        {filteredUsers.map((user: User) => (
          <button
            key={user._id}
            onClick={() =>  dispatch(setSelectedUser(user))}
            className={`
  w-full p-3 flex items-center gap-3
  hover:bg-base-300 transition-colors
  ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullname}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.some((u: User) => u._id === user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
      rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullname}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.some((u: User) => u._id === user._id)
                  ? "Online"
                  : "Offline"}
              </div>
            </div>
          </button>
        ))}
        {filteredUsers.length === 0 && (
          <p className="text-center text-gray-500">No users</p>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
