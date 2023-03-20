'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.detail_transaksi,{
        foreignKey: "id_transaksi",
        as: "detail_transaksi"
      })

      this.belongsTo(models.meja,{
        foreignKey: "id_meja",
        as: "meja"
      })

      this.belongsTo(models.user,{
        foreignKey: "id_user",
        as: "user"
      })
    }
  }
  transaksi.init({
    id_transaksi: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    kode_invoice: DataTypes.STRING,
    tgl: DataTypes.DATE,
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_meja: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nama_pelanggan: DataTypes.STRING,
    status: DataTypes.ENUM('belum_bayar','lunas'),
    total: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'transaksi',
    tableName: 'transaksi'
  });
  return transaksi;
};