const { transformUser } = require('../../utils/relations');
const bcrypt = require('bcryptjs');
const User = require('../../models/user');

module.exports = {
    users: async () => {
        try {
            const users = await User.find();
            return users.map(user => {
                return transformUser(user);
            });
        } 
        catch (error) {
            throw error;
        }
    },
    createUser: async args => {
        try {
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
}