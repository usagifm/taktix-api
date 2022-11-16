'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lks_contents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lks_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lks_section_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lks_content_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      content_name: {
        type: Sequelize.STRING
      },
      text_content: {
        type: Sequelize.TEXT
      },
      video_link: {
        type: Sequelize.STRING
      },
      file_attachment: {
        type: Sequelize.STRING
      },
      exam_duration: {
        type: Sequelize.INTEGER
      },
      exam_question_total: {
        type: Sequelize.INTEGER,
        defaultValue:0
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
      CREATE TRIGGER lks_content_after_insert AFTER INSERT ON lks_contents
      FOR EACH ROW BEGIN

      DECLARE current_lks_id INT;

      SELECT lks_id INTO current_lks_id FROM lks_sections WHERE id = new.lks_section_id;  

      UPDATE lks SET content_total=content_total+1 WHERE id = current_lks_id;
      
     END
      `)
  }).then(() => {
    return queryInterface.sequelize.query(`
   
    CREATE TRIGGER lks_content_after_delete AFTER DELETE ON lks_contents
    FOR EACH ROW BEGIN

    DECLARE current_lks_id INT;

    SELECT lks_id INTO current_lks_id FROM lks_sections WHERE id = old.lks_section_id;

    UPDATE lks SET content_total=content_total-1 WHERE id=current_lks_id;
    
   END
    `)
});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lks_contents');
  }
};