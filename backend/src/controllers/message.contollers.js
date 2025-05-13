import AsyncHandler from "express-async-handler";
import Message from "../model/message.model.js";
import User from "../model/user.model.js";
import cloudinary from "../lib/cloudinary.js";

const getUsersForSidebar = AsyncHandler(async (req, res) => {
  try {
    const loggefInUser = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: loggefInUser } }).select(
      "-password"
    );
    res.status(200).json(filteredUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
    throw new Error("Error fetching users");
  }
});

const getMessages = AsyncHandler(async (req, res) => {
  try {
    const { id: userToCharId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToCharId },
        { senderId: userToCharId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
    throw new Error("Error fetching messages");
  }
});

const sendMessage = AsyncHandler(async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl = "";

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl || undefined,
    });
    await newMessage.save();

    res.status(200).json(newMessage);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
});

export { getUsersForSidebar, getMessages, sendMessage };
