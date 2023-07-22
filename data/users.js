const bcrypt = require('bcryptjs');

const users = [
    {
        name:'Admin',
        email:"admin@example.com",
        password: bcrypt.hashSync("123456",10),
        isAdmin: true
    },
    {
        name:'User',
        email:"user@example.com",
        password: bcrypt.hashSync("123456",10),
        isAdmin: false
    }
]


module.exports = users