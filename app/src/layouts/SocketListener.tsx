import { useEffect } from "react";
import { connectSocket, socket } from "../services/socket-sevice";
import useAPI from "../store/useAPI";
import usePost from "../store/usePost";
import useAppStore, { type Notification } from "../store/useAppStore";

const SocketListener = () => {
  const { handleNotification } = useAppStore();
  const { setUser } = useAPI();
  const { setPost, fetchPost, setAllPost, setUserProfile } = usePost();

  useEffect(() => {
    connectSocket();

    const handleConnectionAck = (data: any) => {
      setUser(data);
      fetchPost();
      console.log("Fetching Post From Listener : ");
      // console.log("[+] Socket Server Connected ---- ", data);
    };

    const handleNewNotification = (notification: Notification) => {
      handleNotification(notification);
    };

    // Attach event listeners
    socket.on("connection_ack", handleConnectionAck);

    // Get user profile info
    socket.on("user-profile-info", (data) => {
      setUserProfile(data);
    });

    // Fetch all post and set
    socket.on("all-post", (data) => {
      console.log("Get All Post -------- ", data);
      setAllPost(data);
    });

    // When published a post
    socket.on("post-publish:success", (data) => {
      setPost(data);
    });

    // Handle new notification
    socket.on("new-notification", handleNewNotification);

    // Clean up listeners on unmount
    return () => {
      socket.off("connection_ack", handleConnectionAck);
      socket.off("user-profile-info", setUserProfile);
      socket.off("all-post", setAllPost);
      socket.off("post-publish:success", setPost);
      socket.off("new-notification", handleNewNotification);
    };
  }, [
    fetchPost,
    handleNotification,
    setAllPost,
    setPost,
    setUser,
    setUserProfile,
  ]);

  return null;
};

export default SocketListener;
