import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema ({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        index: true
    },
    title: {
        type: String,
        required: [true, "Please add a title"],
        trim: true
    },
    lyric_body: {
        type: String,
        default: '',
        maxlength: 50000,
    },
    poem_by: {
        name: {
            type: String,
            required: false,
            default: ""
        },
        honorific_title: {
            type: String,
            default: "",
            trim: true
        }
    },
    melody_by: {
        name: {
            type: String,
            required: false,
            default: ""
        },
        honorific_title: {
            type: String,
            default: "",
            trim: true
        }
    },
    sung_by: {
        name: {
            type: String,
            required: false,
            default: "",
        },
        honorific_title: {
            type: String,
            default: "",
            trim: true
        }
    },
    scale: {
        type: String,
        enum: ["Tizita", "Ambassel", "Anchihoye", "Selamta", "Bati", "EOTC Chants - Ge'ez", "EOTC Chants - Ezl", "EOTC Chants - Araray", "Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian", "Major Pentatonic", "Minor Pentatonic", "Insen", "Hirajoshi", "Yo"],
        required: false,
        default: "TBA"
    },
    major: {
        type: String,
        enum: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
        default: "C",
    },
    status: {
        type: String,
        enum: ["idea", "draft", "composed", "rehearsed", "recorded", "released"],
        default: "idea",
    },
    percent: {
        type: Number,
        default: 0,
        max: 100,
        min: 0
    },
    notes: {
        type: String,
        default: "",
    },
},
{
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});


SongSchema.index ({
    user_id: 1,
    title: 1
}, {unique: true});
export default mongoose.model (
    "Song", SongSchema
)