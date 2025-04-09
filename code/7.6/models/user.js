const { Sequelize } = require("sequelize");

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        name: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        age: {
          type: Sequelize.TINYINT.UNSIGNED,
          allowNull: false,
        },
        married: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        comment: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE, // DATETIME, MySQL DATE -> Sequelize DateOnly
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        // createdAt, updatedAt, deletedAt: true // soft delete
      },
      {
        sequelize,
        timestamps: false, // 시퀄라이즈에서 시간을 자동으로 추가할지 여부
        underscored: false, // 카멜 케이스를 스네이크 케이스로 변환할지 여부
        modelName: "User", // 모델 이름
        tableName: "users", // 테이블 이름
        paranoid: false, // 삭제 시 실제 삭제되지 않고 삭제 시간을 기록할지 여부
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
}

module.exports = User;
