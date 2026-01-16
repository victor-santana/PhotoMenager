import User from "../models/User.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ error: "E-mail ou senha inválidos" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "E-mail ou senha inválidos" });
        }

        user.password = undefined;
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};