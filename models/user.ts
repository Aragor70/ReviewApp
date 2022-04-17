import { Sequelize, DataTypes, Model } from "sequelize";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
//custom imports
import { dbSequelise } from "../config/db";
import { ec } from "elliptic";

const ecGenerate = new ec("secp256k1");

interface User {
  user_id: number;
  name: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  gender_title: string;
  country: string;
  date_of_birth: string;
  created_at: Date;
  last_login: Date;
  avatar: string;
  token: string;
  public_key: string;
  private_key: string;
  account_type: string | number;
  approved: string;
  code: string;
  createToken: any;
}

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
      validate: {
        notEmpty: { msg: "Please enter a password" },
        notNull: { msg: "Please enter a password" },
        len: {
          args: [6, 20],
          msg: "Password must be from 6 to 20 characters",
        },
      },
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
    hooks: {
      beforeCreate: (user: any) => {
        try {
          //password hashing
          const salt = bcrypt.genSaltSync(10);
          const safePassword = bcrypt.hashSync(user.password, salt);

          user.password = safePassword; //safe password replasing the User object

          //key generation
          const key = ecGenerate.genKeyPair();
          const publicKey = key.getPublic("hex");
          const privateKey = key.getPrivate("hex");

          user.public_key = publicKey; //key assingment
          user.private_key = privateKey; //key assingment

          //avatar handling, probably export this to re-use it
          let avatar = gravatar.url(user.email, {
            s: "200",
            r: "pg",
            d: "mm",
          });

          
          if (
            avatar &&
            avatar.toString() &&
            !avatar.toString().includes("https")
          ) {
            avatar = "https:" + avatar.toString();
            user.avatar = avatar;
          }
        } catch (err) {
          console.log(err);
        }
      },
      beforeSave: async (user) => {

        // UPDATE accounts SET token = $1 WHERE email = $2

        user.token = await user.createToken(user["user_id"], {
          name: "Review_Secret_Key",
        });
      },
      // after user is saved to db password is protected
      afterSave: (user) => {
        user.password = "protected";
      },
    },
  }
);

/**
 * Create token on User model, for options check the JTW documentation
 * only default option is the expiry that is set to 10h
 *
 * @param user user['user_id']
 * @param payload message to be encrypted
 * @param options by default the expiry is set to 10h
 * @returns string
 */
User.prototype.createToken = async (
  user: User["user_id"],
  payload: {},
  options?: { expiresIn: "24h" | "36H" | string }
) => {
  const JWTSecretKey: string = process.env["jwtSecret"]!;
  console.log(user);
  try {
    // prettier-ignore
    const token = await jwt.sign({...payload},JWTSecretKey,{...options} || {expiresIn: '10h'});
    return token;
  } catch (error) {
    console.error(error);
  }
};

User.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());

  delete values.password;
  return values;
};

//To disable before production
//Checks if model structure has changed and alters the table
//does nothing if no changes are made
(async function () {
  try {
    await User.sync({ alter: true });
    console.log("The table for the User model was just (re)created!");
  } catch (error) {
    console.error(error);
  }
})();

export default User;
