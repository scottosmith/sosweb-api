import bcrypt from 'bcryptjs';
import User from '../../models/user';
import jwt from 'jsonwebtoken';

export const login = async ({email, password}) => {
    try {
        const user = await User.findOne({email: email});
        if (!user) {
            throw new Error("Login failed!");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Login failed!");
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email }, 
            process.env.AUTH_HASH, 
            { expiresIn: '3h' }
        );
        return {
            userId: user.id,
            token: token,
            tokenExpiration: 3
        }
    } 
    catch (error) {
        throw error;
    }
}