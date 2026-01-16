import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import albumRoutes from "./routes/albumRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cors());


app.use("/user", userRoutes);
app.use("/album", albumRoutes);
app.use("/photo", photoRoutes);
app.use("/", authRoutes);

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Rotas de Álbuns: http://localhost:${PORT}/album`);
    console.log(`Rotas de Fotos: http://localhost:${PORT}/photo`);
});