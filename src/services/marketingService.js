const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fileService = require('./fileService');

const POSTS_FILE = path.resolve(__dirname, '..', 'data', 'posts.json');

async function getAllPosts() {
  return await fileService.readFile(POSTS_FILE);
}

async function createPost(data) {
  const posts = await getAllPosts();
  const post = {
    id: uuidv4(),
    platform: data.platform,
    content: data.content,
    date: new Date()
  };
  posts.push(post);
  await fileService.writeFile(POSTS_FILE, posts);
  return post;
}

module.exports = { getAllPosts, createPost };