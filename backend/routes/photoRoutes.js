import express from "express";
import {
    createPhoto,
    listPhotosByAlbum,
    updatePhoto,
    deletePhoto
} from "../controllers/photoController.js";

const router = express.Router();

router.post("/", createPhoto);
router.get("/album/:albumId", listPhotosByAlbum);
router.put("/:id", updatePhoto);
router.delete("/:id", deletePhoto);

export default router;