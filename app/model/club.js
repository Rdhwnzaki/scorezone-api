module.exports = (sequelize, Sequelize) => {
    const Club = sequelize.define("club", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    }, {});

    Club.associate = models => {
        Club.hasMany(models.Score, {
            foreignKey: 'clubId1',
            as: 'scores1'
        });
        Club.hasMany(models.Score, {
            foreignKey: 'clubId2',
            as: 'scores2'
        });
    };

    return Club;
};
