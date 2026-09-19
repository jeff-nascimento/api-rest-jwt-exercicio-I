'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tarefas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tarefas.init({
    titulo: DataTypes.STRING,
    descricao: DataTypes.STRING,
    concluida: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'tarefas',
  });
  return tarefas;
};