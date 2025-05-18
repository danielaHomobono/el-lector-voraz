const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fileService = require('./fileService');

const POSTS_FILE = path.resolve(__dirname, '..', 'data', 'posts.json');

async function getAllPosts() {
  return await fileService.readFile(POSTS_FILE);
}

async function createPost(data) {
  const posts = await fileService.readFile(POSTS_FILE);
  const post = {
    id: uuidv4(),
    title: data.title,
    content: data.content,
    date: new Date().toISOString()
  };
  if (!post.title || !post.content) {
    throw new Error('Faltan campos requeridos');
  }
  posts.push(post);
  await fileService.writeFile(POSTS_FILE, posts);
  return post;
}

module.exports = { getAllPosts, createPost };