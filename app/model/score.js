module.exports = (sequelize, Sequelize) => {
    const Score = sequelize.define("score", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        score1: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        clubId1: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'clubs',
                key: 'id'
            }
        },
        score2: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        clubId2: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'clubs',
                key: 'id'
            }
        },
        isMultiple: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {});

    Score.associate = models => {
        Score.belongsTo(models.Club, {
            foreignKey: 'clubId1',
            as: 'club1'
        });
        Score.belongsTo(models.Club, {
            foreignKey: 'clubId2',
            as: 'club2'
        });
    };

    return Score;
};
