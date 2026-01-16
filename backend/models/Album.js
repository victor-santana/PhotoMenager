import mongoose from "mongoose";

const AlbumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
}, { timestamps: true });

export default mongoose.model('Album', AlbumSchema);