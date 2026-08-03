const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [{ type: String, required: true }],
    githubLink: { type: String },
    demoLink: { type: String },
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;