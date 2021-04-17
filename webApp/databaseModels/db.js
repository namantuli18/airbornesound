var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

// create a sequelize instance with our local postgres database information.
const sequelize = new Sequelize('mysql://freedbtech_Hackpui:123456787@freedb.tech:3306/freedbtech_Dbhack');

// setup User model and its fields.
const Users = sequelize.define('users', {
    id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    Name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userRole: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    userName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    hooks: {
        beforeCreate: (user) => {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
        }
    },
    instanceMethods: {
        validPassword: function (password) {
            return bcrypt.compareSync(password, this.password);
        }
    }
});

const history = sequelize.define('history', {
    // Model attributes are defined here
    id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    deviceType: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dtProb: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    anaStatus: {
        type: Sequelize.STRING,
        allowNull: false
    },
    anaProb: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

const report = sequelize.define('report', {
    // Model attributes are defined here
    id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    facName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    deviceType: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dtProb: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    anaStatus: {
        type: Sequelize.STRING,
        allowNull: false
    },
    anaProb: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

Users.hasMany(history, {
    foreignKey: 'loginId'
});
history.belongsTo(Users);

sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
exports.Users = Users;
exports.History = history;
exports.report =report;

