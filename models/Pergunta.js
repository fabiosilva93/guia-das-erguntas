const Sequelize = require("sequelize");
const connection = require("../database/database");

const Pergunta = connection.define('perguntas',{
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    pergunta:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//O parâmetro force = false faz com que não deixe forçar uma nova criação
//da tabela caso ela já exista
Pergunta.sync({force: false}).then(() => {});

module.exports = Pergunta;