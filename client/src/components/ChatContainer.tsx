import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
//@ts-ignore
import { useGetMessagesQuery } from "../redux/slices/api/messagesApi";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/SidebarSkeleton";
import ChatHeader from "./ChatHeader";
import { formatMessageTime } from "../utils/formatTime";
//@ts-ignore
import { useCheckAuthMutation } from "../redux/slices/api/authApi";


const ChatContainer = () => {
  const selectedUser = useSelector(
    (state: any) => state.selectedUser.selectedUser
  );

  const [authUser, setAthuser] = useState<any>(null);
  const [userAuth] = useCheckAuthMutation();

  useEffect(() => {
    const fetchUserAuth = async () => {
      const res = await userAuth().unwrap();
      setAthuser(res);
    };

    fetchUserAuth();
  }, []);
  
  const messageEndRef = useRef(null);

  const {
    data: messages = [],
    isLoading: isMessagesLoading,
    refetch,
  } = useGetMessagesQuery(selectedUser?._id, {
    skip: !selectedUser?._id,
  });

  const [messagess, setMessages] = useState<any[]>([]);
  useEffect(() => {
    
    if (Array.isArray(messages)) {
      setMessages([...messages]);
    } else {
      setMessages([]);
    }
  }, [messages]);

  useEffect(() => {
    if (messageEndRef.current) {
      (messageEndRef.current as HTMLDivElement).scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messagess]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messagess.map((message: any) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput refetch={refetch} />
    </div>
  );
};

export default ChatContainer;
