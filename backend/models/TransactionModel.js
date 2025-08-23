import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Transaction = db.define(
  "transactions",
  {
    productId: { type: DataTypes.INTEGER, allowNull: false },
    productName: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    paidAmount: { type: DataTypes.INTEGER, allowNull: false },
    changeAmount: { type: DataTypes.INTEGER, allowNull: false },
    totalPrice: { type: DataTypes.INTEGER, allowNull: false },
  },
  { freezeTableName: true }
);

export default Transaction;


