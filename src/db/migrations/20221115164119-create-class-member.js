'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('class_members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      class_id: {
        type: Sequelize.INTEGER
      },
      joined_at: {
        type: Sequelize.DATE
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
    },
    updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
    }
    }).then(() => {
      return queryInterface.sequelize.query(`
      CREATE TRIGGER class_member_after_insert AFTER INSERT ON class_members
      FOR EACH ROW BEGIN

      UPDATE classes SET member_total=member_total+1 WHERE id = new.class_id;
      
     END
      `)
  }).then(() => {
    return queryInterface.sequelize.query(`
   
    CREATE TRIGGER class_member_after_delete AFTER DELETE ON class_members
    FOR EACH ROW BEGIN

    UPDATE classes SET member_total=member_total-1 WHERE id = old.class_id;
    
   END
    `)
});;
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('class_members');
  }
};