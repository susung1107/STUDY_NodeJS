// 이용고객의 도메인 정보를 저장하는 테이블

const Sequelize = require("sequelize");

class Domain extends Sequelize.Model {
  static initiate(sequelize) {
    Domain.init(
      {
        host: {
          type: Sequelize.STRING(80),
          allowNull: false,
        },
        type: {
          type: Sequelize.ENUM("free", "premium"),
          allowNull: false,
        },
        clientSecret: {
          type: Sequelize.UUID, // 고유한 문자열, 로또맞은 확률보다 더 낮은 확률..ㅎ
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: "Domain",
        tableName: "domains",
      }
    );
  }

  static associate(db) {
    db.Domain.belongsTo(db.User);
  }
}

module.exports = Domain;
