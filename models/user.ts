import { Sequelize, DataTypes, Model } from "sequelize";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
//custom imports
import { dbSequelise } from "../config/db";

const User = dbSequelise.define(
  "accounts",
  {
    user_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: false,
      validate: {
        isAlphanumeric: true,
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING(250),
      allowNull: false,
      // validate: {
      //   len: {
      //     args: [6, 16],
      //     msg: "Password must be from 6 to 16 characters",
      //   },
      // },
      // set(value) {
      //   try {
      //     const salt = bcrypt.genSaltSync(10);
      //     const password = bcrypt.hashSync(value, salt);
      //     return this.setDataValue("password", password);
      //   } catch (err) {
      //     console.log(err);
      //   }
      // },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
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
    date_of_birth: { type: DataTypes.DATE, validate: { isDate: true } },
    created_at: { type: DataTypes.DATE, validate: { isDate: true } },
    last_login: { type: DataTypes.DATE, validate: { isDate: true } },
    avatar: { type: DataTypes.STRING(255), defaultValue: "" },
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

//To disable before production
//Checks if model structure has changed and drops the table
//does nothing if no changes are made
(async function () {
  try {
    await User.sync({ alter: true });
    console.log("The table for the User model was just (re)created!");
  } catch (error) {
    console.error(error);
  }
})();

// custom methods

export default User;
