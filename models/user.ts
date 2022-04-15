import { Sequelize, DataTypes, Model } from "sequelize";
import { dbSequelise } from "../config/db";
import jwt from "jsonwebtoken";

const User = dbSequelise.define(
  "accounts",
  {
    user_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: false,
    },
    password: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    gender_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    date_of_birth: { type: DataTypes.DATE },
    created_at: { type: DataTypes.DATE },
    last_login: { type: DataTypes.DATE },
    avatar: { type: DataTypes.BLOB("long") },
    token: { type: DataTypes.STRING(255) },
    public_key: { type: DataTypes.STRING(255) },
    private_key: { type: DataTypes.STRING(255) },
    account_type: { type: DataTypes.STRING(255) },
    approved: { type: DataTypes.BOOLEAN },
    code: { type: DataTypes.STRING(255) },
  },
  {
    freezeTableName: true, // telling sequilize i want the table name defined above
  }
);

(async function () {
  try {
    await User.sync({ force: true });
    console.log("The table for the User model was just (re)created!");
  } catch (error) {
    console.error(error);
  }
})();

// custom methods
