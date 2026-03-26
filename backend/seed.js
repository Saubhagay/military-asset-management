const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/user');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/military-asset-management';

async function seedUsers() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        await User.deleteMany({});

        const salt = await bcrypt.genSalt(10);

        const users = [
            {
                username: 'admin',
                password: await bcrypt.hash('admin123', salt),
                role: 'Admin',
                base: null
            },
            {
                username: 'commander_alpha',
                password: await bcrypt.hash('commander123', salt),
                role: 'Base Commander',
                base: 'Base Alpha'
            },
            {
                username: 'logistics_bravo',
                password: await bcrypt.hash('logistics123', salt),
                role: 'Logistics Officer',
                base: 'Base Bravo'
            }
        ];

        await User.insertMany(users);

        console.log('Default users created!');
        console.log('Admin:              username: admin,             password: admin123');
        console.log('Base Commander:     username: commander_alpha,  password: commander123');
        console.log('Logistics Officer:  username: logistics_bravo,  password: logistics123');

        mongoose.disconnect();
    } catch (err) {
        console.error('Error seeding users:', err.message);
        mongoose.disconnect();
    }
}

seedUsers();
