import mongoose from "mongoose";

const ProjectSechma = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const ProjectModul = mongoose.model("Project", ProjectSechma);

export default ProjectModul;