import bcrypt from 'bcryptjs';
import User from '../../models/user';

export const login = async ({email, password}) => {
    try {
        const user = User.findOne({email: email});
        if (!user) {
            throw new Error("Login failed!");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Login failed!");
        }
    } 
    catch (error) {
        throw error;
    }
}