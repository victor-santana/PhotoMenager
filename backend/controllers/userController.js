import User from "../models/User.js";

export const createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        newUser.password = undefined;
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: "Erro ao criar usuário: " + error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
        res.json({ name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if (!deleteUser) return res.status(404).json({ message: "Usuário não encontrado" });
        res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};