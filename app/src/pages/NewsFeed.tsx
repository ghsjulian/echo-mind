import React, { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/Post";
import usePost from "../store/usePost";
import { type Post } from "../store/usePost";
import useAppStore from "../store/useAppStore";

const NewsFeed: React.FC = () => {
  const { isProfile } = useAppStore();
  const { all_post, fetchPost, hasMore, isLoading } = usePost();

  const parentRef = useRef<HTMLDivElement>(null);

  // 1. Fetch initial posts on mount
  /*
  useEffect(() => {
    if (all_post.length === 0) {
      fetchPost();
    }
  }, [fetchPost, all_post.length]);
*/

  // 2. Initialize dynamic virtualizer (no rigid hardcoded sizing)
  const rowVirtualizer = useVirtualizer({
    count: all_post.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 250, // Fallback initial estimate, auto-corrected on measure
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // 3. Infinite Scroll Trigger
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    if (lastItem.index >= all_post.length - 2 && hasMore && !isLoading) {
      fetchPost();
    }
  }, [virtualItems, all_post.length, hasMore, isLoading, fetchPost]);

  return (
    <>
      {!isProfile && (
        <div
          ref={parentRef}
          style={{
            maxWidth: "100%",
            margin: "0 auto",
            padding: "0",
            height: "700px",
            overflowY: "auto",
            contain: "strict",
          }}
        >
          <CreatePost />
          {/* {isLoading && (
            <p style={{ textAlign: "center", color: "#666" }}>
              Loading posts...
            </p>
          )} */}
          {!isLoading && all_post && all_post.length > 0 ? (
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {virtualItems.map((virtualRow) => {
                const post: Post = all_post[virtualRow.index];
                if (!post) return null;

                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement} // Measures real height automatically without touching PostCard styles
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <PostCard post={post} />
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#666" }}>
              No posts available
            </p>
          )}

          {/* Loading indicator */}
          {isLoading && all_post.length > 0 && (
            <p style={{ textAlign: "center", color: "#666", padding: "15px" }}>
              Loading more posts...
            </p>
          )}

          {/* No more posts indicator */}
          {!hasMore && all_post.length > 0 && (
            <p style={{ textAlign: "center", color: "#888", padding: "20px" }}>
              No more posts
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default NewsFeed;
