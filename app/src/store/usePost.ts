import { create } from "zustand"
import socket from "../services/socket-sevice"
import useAPI from "./useAPI"

export interface Profile {
    totalPost: number
    followers: number
    reactions: number
}
type Comment = {
    commenter_id: string
    comment: string
    time: string
}
export type Post = {
    _id: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
    likes: string[];
    comments: Comment[]
    shares: string[];
    post_content: string;
    post_feeling: string;
    post_media?: string;
    poster_id: string;
}

interface ManagePostState {
    totalPost: number
    all_post: Post[]
    hasMore: boolean
    isLoading: boolean
    profile: Profile | null
    isOpenComment: boolean
    selectedPost: Post | null

    setPost: (data: any) => void
    setAllPost: (posts: any) => void
    fetchPost: () => void
    setUserProfile: (data: Profile) => void
    toggleLike: (postID: string) => void
    isLiked: (postID: string) => boolean
    openComment: (post: Post | null) => void,
    createComment: (comment: string) => void
}

const usePost = create<ManagePostState>((set, get) => ({
    totalPost: 0,
    all_post: [],
    hasMore: true,
    isLoading: false,
    profile: null,
    isOpenComment: false,
    selectedPost: null,

    setPost: (data: any) => {
        set({
            totalPost: data?.totalPost || 0,
            all_post: data?.latestPost || [],
            hasMore: (data?.latestPost?.length || 0) < (data?.totalPost || 0)
        })
    },
    setAllPost: (posts) => {
        set({ all_post: posts })
    },
    fetchPost: () => {
        const { isLoading, hasMore, all_post } = get();
        if (isLoading || !hasMore) return;

        set({ isLoading: true });

        // Pass skip parameter so backend knows how many items to offset
        socket.emit("fetch-post", { limit: 5, skip: all_post.length }, (response: any) => {
            // Handles both array responses or object responses { posts: [], totalPost: number }
            const posts: Post[] = response?.latestPost || [];
            const total = response?.totalPost;
            console.log("Latest post : ", posts)

            set((state) => {
                const combined = [...state.all_post, ...posts];
                // If fewer than 5 items are returned or we've hit the total count, mark hasMore as false
                const noMore = posts.length < 5 || (total !== undefined && combined.length >= total);

                return {
                    all_post: combined,
                    hasMore: !noMore,
                    isLoading: false
                };
            });
        })
    },
    setUserProfile: (data: Profile) => {
        set({ profile: data })
    },
    isLiked: (postID: string): boolean => {
        const apiState = useAPI.getState ? useAPI.getState() : undefined
        const user = apiState?.user
        const selectedPost = get().all_post.filter((post) => post._id === postID)
        if (selectedPost?.length == 1) {
            if (selectedPost[0].likes.includes(user?.user_id as string)) {
                return true
            } else {
                return false
            }
        }
        return false
    },
    toggleLike: (postID: string) => {
        const apiState = useAPI.getState ? useAPI.getState() : undefined;
        const user = apiState?.user;

        // Ensure user is logged in before proceeding
        if (!user || !user.user_id) return;
        const userID = user.user_id;

        const { isLiked, all_post } = get();
        const alreadyLiked = isLiked(postID);

        // Map through posts to find and update the target post immutably
        const updatedPosts = all_post.map((post) => {
            // Adjust '_id' or 'id' based on your database schema
            if (post._id === postID || post._id === postID) {
                const currentLikes = post.likes || [];

                return {
                    ...post,
                    likes: alreadyLiked
                        ? currentLikes.filter((id: string) => id !== userID) // Unlike
                        : [...currentLikes, userID] // Like
                };
            }
            return post;
        });

        // Update the store state
        set({ all_post: updatedPosts });
        socket.emit("handle-like", postID)
    },
    openComment: (post: Post | null) => {
        set({ isOpenComment: !get().isOpenComment, selectedPost: post })
    },
    createComment: (comment: string): void => {
        if (!comment) return

        const { selectedPost, all_post } = get()
        const apiState = useAPI.getState ? useAPI.getState() : undefined;
        const user = apiState?.user;
        if (!user || !user.user_id) return;
        const userID = user.user_id;

        const tempComment: Comment = {
            commenter_id: userID,
            comment, time: Date()
        }

        const updatedPosts = all_post.map((post) => {
            if (post._id === selectedPost?._id || post._id === selectedPost?._id) {
                const currentComments = post.comments || [];

                return {
                    ...post,
                    comments: [...currentComments, tempComment]
                };
            }
            return post;
        });
        set({ all_post: updatedPosts })
        set({ selectedPost: updatedPosts.filter((post) => post._id === selectedPost?._id)[0] })
        socket.emit("create-comment", selectedPost?._id, tempComment)
    }
}))

export default usePost