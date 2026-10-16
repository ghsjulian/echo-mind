import { Notification, NotificationModel } from "../models/notification.model.js";
import postModel, { Comment } from "../models/post.model.js";
import { getSocketById } from "../socket/index.js";

const createComment = async (postID: string, comment: Comment): Promise<void> => {
    try {
        const post = await postModel.findById(postID)
        if (!post) return

        post.comments.push(comment)
        await post.save()

        const notification: Notification = {
            sender_id: comment?.commenter_id,
            receiver_id: post?.poster_id,
            post_id: post?._id?.toString(),
            text: `${comment?.commenter_id} commented to your post`,
            time: Date(),
            read: false
        }
        await NotificationModel.create(notification)
        /* ---IF THE USER IS ONLINE--- */
        const socket = getSocketById(post?.poster_id)
        if (socket && comment?.commenter_id !== post?.poster_id) {
            socket.emit("new-notification", notification)
        }
    } catch (error) {
        console.log("Error while create comment : ", error)
    }
}

export default createComment