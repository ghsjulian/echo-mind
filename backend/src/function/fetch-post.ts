import postModel from "../models/post.model.js"

const fetchPost = async (limit: number, skip: number, callback: (result: { latestPost: unknown[]; totalPost: number }) => void): Promise<void> => {
    try {
        const totalPost = await postModel.countDocuments();
        const latestPost = await postModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        if (typeof callback === "function") {
            callback({
                latestPost,
                totalPost
            });
        }
    } catch (error) {
        console.error("Error fetching posts via socket:", error);
        if (typeof callback === "function") {
            callback({
                latestPost: [],
                totalPost: 0
            });
        }
    }
}

export default fetchPost