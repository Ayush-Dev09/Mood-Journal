const Testimonial = require("../models/Testimonial");

// Create a new testimonial
const createTestimonial = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id; // assuming protect middleware adds `req.user`

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const testimonial = new Testimonial({ content, author: userId });
    await testimonial.save();

    res.status(201).json({ message: "Testimonial submitted", testimonial });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all testimonials
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .populate("author", "name email") // show author's name and email
      .sort({ createdAt: -1 });

    res.status(200).json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTestimonial,
  getAllTestimonials,
};
