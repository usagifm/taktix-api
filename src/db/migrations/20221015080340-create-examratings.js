'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exam_ratings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
  
      rate: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
  
      feedback: {
        type: Sequelize.STRING,
      },
  
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },

      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
    },
    }).then(() => {
      return queryInterface.sequelize.query(`
      CREATE TRIGGER exam_ratings_after_insert AFTER INSERT ON exam_ratings
      FOR EACH ROW BEGIN

      UPDATE exams
      SET rating = (SELECT AVG(rate) FROM exam_ratings
                           WHERE exams.id = exam_ratings.exam_id)
      WHERE exams.id = NEW.exam_id;
      
     END
      `)
  }).then(() => {
    return queryInterface.sequelize.query(`
    CREATE TRIGGER exam_ratings_after_delete AFTER DELETE ON exam_ratings
    FOR EACH ROW BEGIN

    UPDATE exams
    SET rating = (SELECT AVG(rate) FROM exam_ratings
                         WHERE exams.id = exam_ratings.exam_id)
    WHERE exams.id = OLD.exam_id;
    
   END
    `)
});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('exam_ratings');
  }
};