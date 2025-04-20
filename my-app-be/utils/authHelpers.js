const bcrypt = require('bcrypt');

const saltRounds = 10;

// returns promise!
const hashPassword = (password) => {
    return bcrypt.hash(password, saltRounds);
};

// returns promise!
const comparePassword = (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
