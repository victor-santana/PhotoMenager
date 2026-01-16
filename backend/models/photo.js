import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    acquisitionDate: { type: Date, required: true },
    size: { type: Number, required: true },
    predominantColor: { type: String },
    imageUrl: { type: String, required: true }, 
    
    albumId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Album',
        required: true 
    }
});

export default mongoose.model('Photo', PhotoSchema);