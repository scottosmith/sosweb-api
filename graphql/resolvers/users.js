import { transformUser } from '../../utils/relations';
import bcrypt from 'bcryptjs';
import User from '../../models/user';
import authorize from '../../utils/authorize';

export const users = async (args, request) => {
    try {
        authorize(request);
        const users = await User.find();
        return users.map(user => {
            return transformUser(user);
        });
    } 
    catch (error) {
        throw error;
    }
}

export const createUser = async (args, request) => {
    try {
        authorize(request);
        const existingUser = await User.findOne({email: args.userInput.email});
        if (existingUser) {
            throw new Error('Email already in use');
        }
        const hashPass = await bcrypt.hash(args.userInput.password, 12);
        const newUser = new User({
            firstName: args.userInput.firstName,
            lastName: args.userInput.lastName,
            email: args.userInput.email,
            password: hashPass
        });
        await newUser.save();
        return transformUser(newUser);
    } 
    catch (error) {
        throw error;
    }
}
