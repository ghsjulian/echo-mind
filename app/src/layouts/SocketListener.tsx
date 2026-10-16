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
    };

    const handleUserProfileInfo = (data: any) => {
      setUserProfile(data);
    };

    const handleAllNotifications = (notification: Notification[]) => {
      handleNotification(notification);
    };

    const handleAllPost = (data: any) => {
      console.log("Get All Post -------- ", data);
      setAllPost(data);
    };

    const handlePostPublishSuccess = (data: any) => {
      setPost(data);
    };

    // Attach event listeners
    socket.on("connection_ack", handleConnectionAck);
    socket.on("user-profile-info", handleUserProfileInfo);
    socket.on("all-notifications", handleAllNotifications);
    socket.on("all-post", handleAllPost);
    socket.on("post-publish:success", handlePostPublishSuccess);

    // Clean up listeners on unmount using the exact same handler references
    return () => {
      socket.off("connection_ack", handleConnectionAck);
      socket.off("user-profile-info", handleUserProfileInfo);
      socket.off("all-notifications", handleAllNotifications);
      socket.off("all-post", handleAllPost);
      socket.off("post-publish:success", handlePostPublishSuccess);
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
