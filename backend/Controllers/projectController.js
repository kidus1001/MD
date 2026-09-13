import Project from "../Models/projectModel.js";
import mongoose from 'mongoose';

export async function FetchProjects (req, res) {
    try {
        const projects = await Project.find({ user_id: req.user._id })
            .sort({updated_at: -1})
            .lean();
        
            return res.status(200).json({
                success: true,
                count: projects.length,
                projects,
            })
    } catch (err) {
        console.error ("Fetch projects error: ", err);
        return res.status (500).json({
            success: false,
            message: "Server Error"
        })
    }
}

export async function CreateProject (req, res) {
    try {
        const { title, type, description } = req.body;
        
        if (!title || !type ) {
            res.status (400).json ({message: "Please provide title and type"});
            return;
        }

        const titleExists = await Project.findOne({title, user_id: req.user._id});
        if (titleExists) {
            return res.status (409).json ({
                success: false,
                message: "Title is already in use"
            }) 
        }

        const project = await Project.create ({
            user_id: req.user._id,
            title: title,
            type: type,
            percent: 0,
            description: description,
            song_count: 0 
        })

        return res.status (201).json ({
            success: true,
            message: 'Project created',
            project,
        });

    } catch (err) {
        console.log ("Error: ", err);
        return res.status (500).json ({
            success: false,
            message: "Server error"
        })
    }
}


export async function fetchProject (req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID',
            });
        }
        const project = await Project.findOne ({
            _id: id,
            user_id: req.user._id
        })

        if (!project) {
            return res.status(404).json ({
                success: false,
                message: "Project not found"
            })
        }

        return res.status (200).json ({
            success: true,
            project
        })
    } catch (err) {
        console.log ("Project error: ", err);
        return res.status(500).json ({
            success: false,
            message: "Server error"
        })
    }
}


export async function UpdateProject (req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID',
            });
        }
        const project = await Project.findOne ({
            _id: id,
            user_id: req.user._id
        })

        if (!project) {
            return res.status(404).json ({
                success: false,
                message: "Project not found"
            })
        }

        const { title, type, percent, description } = req.body;

        project.title = title;
        project.type = type;
        project.percent = percent;
        project.description = description;

        await project.save();

        return res.status (200).json ({
            success: true,
            message: "Project updated successfully"
        })
    } catch (err) {
        console.log ("Error: ", err);
        return res.status (500).json ({
            success: false,
            message: "Server error"
        })
    }
}


export async function DeleteProject (req, res) {
    try {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID"
            })
        }
        const project = await Project.findOneAndDelete ({
            _id: id,
            user_id: req.user._id
        })

        if (!project) {
            return res.status(404).json ({
                success: false,
                message: "Project not found"
            })
        }

        return res.status(200).json ({
            success: true,
            message: "Project deleted successfully",
            project,
        })
    } catch (err) {
        console.log ("Error: ", err);
        return res.status (500).json ({
            success: false,
            message: "Server error"
        })
    }
}