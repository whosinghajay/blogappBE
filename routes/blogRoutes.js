const express = require("express");
const Blog = require("../models/Blog");
const multer = require("multer");

const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// Create a new blog post
router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const { userId, title, description } = req.body;
    const coverImage = req.file ? req.file.path : null;

    const blog = new Blog({ userId, title, description, coverImage });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to create blog post" });
  }
});

// Get all blog posts
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

// Get a single blog post
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
});

// Update a blog post
router.put("/:id", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const coverImage = req.file ? req.file.path : null;

    const updatedData = { title, description };
    if (coverImage) updatedData.coverImage = coverImage;

    const blog = await Blog.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to update blog post" });
  }
});

// Delete a blog post
router.delete("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete blog post" });
  }
});

module.exports = router;
