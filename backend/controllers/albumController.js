import Album from "../models/Album.js";
import Photo from "../models/Photo.js";

export const createAlbum = async (req, res) => {
    try {
        const newAlbum = await Album.create(req.body);
        res.status(201).json(newAlbum);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const listAlbumsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        const skip = (page - 1) * limit;

        const albums = await Album.find({ user: userId })
            .skip(skip)
            .limit(limit);

        const totalAlbums = await Album.countDocuments({ user: userId });

        res.status(200).json({
            albums,
            currentPage: page,
            totalPages: Math.ceil(totalAlbums / limit),
            totalItems: totalAlbums
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar álbuns: " + error.message });
    }
};

export const updateAlbum = async (req, res) => {
    try {
        const updatedAlbum = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAlbum) return res.status(404).json({ message: "Álbum não encontrado" });
        res.status(200).json(updatedAlbum);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteAlbum = async (req, res) => {
    try {
        const photoCount = await Photo.countDocuments({ album: req.params.id });
        if (photoCount > 0) {
            return res.status(400).json({ message: "Não é possível excluir um álbum que contenha fotos." });
        }
        const deletedAlbum = await Album.findByIdAndDelete(req.params.id);
        if (!deletedAlbum) return res.status(404).json({ message: "Álbum não encontrado" });
        res.status(200).json({ message: "Álbum excluído com sucesso" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};