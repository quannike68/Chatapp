import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
//@ts-ignore
import { clearSelectedUser } from "../redux/slices/selectedUserSlice";
import { User } from "../types";

const ChatHeader = () => {
    const dispatch = useDispatch();
  const selectedUser = useSelector(
    (state: any) => state.selectedUser.selectedUser
  );

  
  const onlineUsers = useSelector(
    (state: any) => state.socket.onlineUsers || []
  );
  const user = useSelector((state: any) => state.auth.user);
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullname}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullname}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.some((u: User) => u._id === user._id)
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => dispatch(clearSelectedUser())}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
