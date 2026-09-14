import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema ({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: [ true, "Please add a title" ],
        trim: true,
    },
    type: {
        type: String,
        enum: ["Album", "Single", "Untitled"],
        required: true,
        default: "Untitled",
    },
    percent: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 100
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    song_count: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    },
    {   
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


export default mongoose.model ('Project', ProjectSchema);