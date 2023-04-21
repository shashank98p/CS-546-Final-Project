import {events, posts, users} from "../config/mongoCollections.js";
import validation from "../validationchecker.js";
import {ObjectId} from "mongodb";
import {userData} from "./index.js";

let exportedMethods = {
    async createPost(category,
                     image,
                     postedContent,
                     userId
    ) {
        category = validation.checkLegitName(category, "category");
        postedContent = validation.checkPhrases(postedContent, "PostedContent");
        userId = validation.checkId(userId);
        const user = await users().findOne({userId: userId});
        if(!user){
            throw `The user does not exist with that Id &{id}`;
        }
        if(user.isAdmin){
            throw "Post can only create by users."
        }
        let path = "";
        if(!image || image.trim().length === 0){
            path = "public/images/default.png";
        }else{
            path = validation.createImage(image);
        }

        let post = {
            category: category,
            content: postedContent,
            image: path,
            userName: user._id,
            created_Date: validation.getDate(),
            likes: 0,
            dislikes: 0,
            commentIds: {}
        };

        const insertInfo = await posts().insertOne(post);
        if (!post.acknowledged || !post.insertedId) {
            throw "Could not add post";
        }
        post._id = insertInfo.insertedId.toString();
        post = Object.assign({_id: post._id}, post);
        return post;
    },

    async getAllPosts() {
        return await posts().find({}).sort({created_Date: -1}).toArray();
    },

    async getPostByCategory(category){
        category = validation.checkLegitName(category);
        return await posts().find({category: category}).toArray();
    },

    async getPostById(id) {
        id = await validation.checkId(id);
        const post = await posts().findOne({_id: new ObjectId(id)});
        if (post === null) {
            throw `No post found with that ID ${id}`;
        }
        post._id = new ObjectId(post._id).toString();
        return post;
    },

    async removeById(id) {
        id = await validation.checkId(id);
        const post = await posts().findOne({_id: new ObjectId(id)});
        if (post === null) {
            throw `No post found with that Id ${id}`;
        }
        const user = await users().findOne({_id: new ObjectId(post.userId)});
        if (user.isAdmin === undefined || !user.isAdmin || !user.postIDs.includes(id)) {
            throw "Only administrators or the poster can delete posts.";
        }

        const removePost = await posts().deleteOne({_id: new ObjectId(id)});
        if (removePost.deletedCount === 0) {
            throw `Could not delete band with id of ${id}`;
        }
        await userData.removePost(post.userId.toString(), id);
        return {
            eventId: id,
            deleted: true
        };

    },

    async updatePost(id,
                     userId,
                     category,
                     postedContent,
                     image) {
        id = validation.checkId(id);
        userId = validation.checkId(userId);
        category = validation.checkLegitName(category, "category");
        postedContent = validation.checkPhrases(postedContent, "PostedContent");
        let path = "";
        if (!image || image.trim().length === 0) {
            path = "public/images/default.png";
        } else {
            path = validation.createImage(image);
        }

        const checkPostExist = users().findOne({_id: new ObjectId(id)});
        if (!checkPostExist) throw `Post is not exist with that ${id}`;
        const user = await users().findOne({_id: new ObjectId(userId)})
        if (user.isAdmin === undefined || !user.isAdmin || !user.postIDs.includes(id)) {
            throw "Only administrators or the poster can delete posts.";
        }
        const updatedPost = {
            category: category,
            content: postedContent,
            created_Date: validation.getDate(),
            image: path
        }

        const post = await posts().updateOne({_id: new ObjectId(id)}, {$set: updatedPost});
        if (!post.acknowledged || post.matchedCount !== 1) {
            throw "Could not update post with that ID.";
        }
        return await posts().findOne({_id: new ObjectId(id)});
    },

    async getPostByEmail(email) {
        email = validation.checkEmail(email);
        let postIdList = await userData.getPostList(email);
        return await Promise.all(
            postIdList.map(async (eventId) => {
                return await this.getEventByID(eventId);
            })
        );
    }


};
//express session,handlebars
export default exportedMethods;


