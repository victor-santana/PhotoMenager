import Photo from "../models/Photo.js";
import cloudinary from "../config/cloudinary.js";

export const createPhoto = async (req, res) => {
    try {
        const newPhoto = await Photo.create(req.body);
        res.status(201).json(newPhoto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const listPhotosByAlbum = async (req, res) => {
    try {
        const { albumId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = 4;
        const skip = (page - 1) * limit;

        const photos = await Photo.find({ albumId })
            .skip(skip)
            .limit(limit)
            .sort({ acquisitionDate: -1 });

        const totalPhotos = await Photo.countDocuments({ albumId });

        res.status(200).json({
            photos,
            currentPage: page,
            totalPages: Math.ceil(totalPhotos / limit),
            totalItems: totalPhotos
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar fotos: " + error.message });
    }
};

export const updatePhoto = async (req, res) => {
    try {
        const updatedPhoto = await Photo.findByIdAndUpdate(
            req.params.id,
            { title: req.body.title, description: req.body.description },
            { new: true }
        );
        if (!updatedPhoto) return res.status(404).json({ message: "Foto não encontrada" });
        res.status(200).json(updatedPhoto);
    } catch (error) {
        res.status(400).json({ error: "Erro ao atualizar foto: " + error.message });
    }
};

export const deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) return res.status(404).json({ message: "Foto não encontrada" });

        const publicId = photo.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);

        await Photo.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Foto apagada do banco e do Cloudinary" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};