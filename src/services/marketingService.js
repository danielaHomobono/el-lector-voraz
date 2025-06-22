// src/services/marketingService.js
const Post = require('../models/Post');

async function getPosts() {
  return await Post.find().sort({ createdAt: -1 });
}

async function createPost(postData) {
  const newPost = new Post({
    title: postData.title,
    content: postData.content,
    author: postData.author || undefined, // Si tienes autenticación, pásala aquí
    isPublished: postData.isPublished !== undefined ? postData.isPublished : true
  });
  await newPost.save();
  return newPost;
}

async function updatePost(id, postData) {
  const updated = await Post.findByIdAndUpdate(
    id,
    {
      title: postData.title,
      content: postData.content,
      isPublished: postData.isPublished !== undefined ? postData.isPublished : true
    },
    { new: true }
  );
  if (!updated) throw new Error('Post no encontrado');
  return updated;
}

async function deletePost(id) {
  const deleted = await Post.findByIdAndDelete(id);
  if (!deleted) throw new Error('Post no encontrado');
}

module.exports = { getPosts, createPost, updatePost, deletePost };