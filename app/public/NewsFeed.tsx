import "../styles/app.layout.css";
import AppHeader from "../layouts/AppHeader";
import AppSidebar from "../layouts/AppSidebar";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import AppMobileBar from "../layouts/AppMobileBar";
import AIChat from "../layouts/AIChat";
import useAPI from "../store/useAPI";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Preloader from "../components/Preloader";
import SocketListener from "../layouts/SocketListener";

const NewsFeed = () => {
  const navigate = useNavigate();
  const { userID, verifyUser, isVerifying } = useAPI();
  useEffect(() => {
    verifyUser(userID, navigate);
  }, [userID, verifyUser]);

  if (isVerifying) {
    return <Preloader />;
  }

  return (
    <>
      <SocketListener />
      <AppHeader />
      <div className="app-container">
        <AppSidebar />
        <main className="feed-stream">
          <CreatePost />
          <PostCard />
        </main>
        <AIChat />
      </div>
      <AppMobileBar />
    </>
  );
};

export default NewsFeed;
