import express from "express";
import {
    createAlbum,
    listAlbumsByUser,
    updateAlbum,
    deleteAlbum
} from "../controllers/albumController.js";

const router = express.Router();

router.post("/", createAlbum);
router.get("/user/:userId", listAlbumsByUser);
router.put("/:id", updateAlbum);
router.delete("/:id", deleteAlbum);

export default router;