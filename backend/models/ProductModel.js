import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Product = db.define(
  "products",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.INTEGER, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { freezeTableName: true }
);

export default Product;


