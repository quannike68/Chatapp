import { apiSlice } from "../apiSlice";
import { sendSocketMessage } from "../../../utils/socket";
import { getSocket } from "../../../utils/socket";
const MESSAGES_URL = "/messages";

export const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsersForSidebar: builder.mutation({
      query: () => ({
        url: `${MESSAGES_URL}/users`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getMessages: builder.query({
      query: (userIdToChat) => ({
        url: `${MESSAGES_URL}/${userIdToChat}`,
        method: "GET",
        credentials: "include",
      }),
      async onCacheEntryAdded(
        userIdToChat,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState }
      ) {
        await cacheDataLoaded;
        const socket = getSocket();
        const authUser = getState().auth?.user;
        if (!socket || !authUser) return;

        const listener = (message) => {
          const match =
            (message.senderId === userIdToChat && message.receiverId === authUser._id) ||
            (message.receiverId === userIdToChat && message.senderId === authUser._id);
          if (match) {
            updateCachedData((draft) => {
              draft.push(message);
            });
          }
        };

        socket.on("newMessage", listener);
        await cacheEntryRemoved;
        socket.off("newMessage", listener);
      },
    }),

    sendMessage: builder.mutation({
      query: ({ id, data }) => ({
        url: `${MESSAGES_URL}/send/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          messagesApiSlice.util.updateQueryData("getMessages", id, (draft) => {
            draft.push({
              ...data,
              _id: "temp-id",
              createdAt: new Date().toISOString(),
            });
          })
        );

        try {
          const { data: newMessage } = await queryFulfilled;
          sendSocketMessage(newMessage);
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetUsersForSidebarMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
} = messagesApiSlice;
