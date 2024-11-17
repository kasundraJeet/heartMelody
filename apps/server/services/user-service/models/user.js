const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, unique: true, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        number: { type: DataTypes.STRING, unique: true, allowNull: false },
        role: { type: DataTypes.ENUM('1', '2'), defaultValue: '2' },
        profile_picture: { type: DataTypes.STRING, allowNull: true },
        last_login: { type: DataTypes.DATE, allowNull: true },
        token_expiry: { type: DataTypes.DATE, allowNull: true },
        password_reset_token: { type: DataTypes.STRING, allowNull: true },
    });

    User.beforeCreate(async (user) => {
        user.password = crypto.createHash('sha256').update(user.password).digest('hex');
    });

    return User;
};
