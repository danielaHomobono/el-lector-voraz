// src/services/marketingService.js
  const fileService = require('./fileService');
  const { generateUUID } = require('../utils/uuid');

  async function getPosts() {
    return await fileService.readFile('src/data/posts.json');
  }

  async function createPost(postData) {
    const posts = await getPosts();
    const newPost = {
      id: generateUUID(),
      title: postData.title,
      content: postData.content,
      date: new Date().toISOString()
    };
    posts.push(newPost);
    await fileService.writeFile('src/data/posts.json', posts);
    return newPost;
  }

  async function updatePost(id, postData) {
    const posts = await getPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Post no encontrado');
    }
    posts[index] = {
      id,
      title: postData.title,
      content: postData.content,
      date: posts[index].date
    };
    await fileService.writeFile('src/data/posts.json', posts);
    return posts[index];
  }

  async function deletePost(id) {
    const posts = await getPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Post no encontrado');
    }
    posts.splice(index, 1);
    await fileService.writeFile('src/data/posts.json', posts);
  }

  module.exports = { getPosts, createPost, updatePost, deletePost };