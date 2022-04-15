import express, { Request, Response, Router, NextFunction } from "express";

import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//custom imports
import User from "../models/User";
import asyncHandler from "../middlewares/async";
import ErrorResponse from "../utils/ErrorResponse";
//types
import { ec } from "elliptic";
const ecGenerate = new ec("secp256k1");

class UserController {
  /**
   * Create new user controller method, returns object with success message
   * authentication status true on user creation
   * and the token generated
   *
   * @param req
   * @param res
   * @param next
   * @returns object
   */
  register = asyncHandler(async (req: any, res: any, next: any) => {
    //check if password matches the confirmation password 2 form inputs
    if (req.body.password !== req.body.confPassword) {
      return next(new ErrorResponse("Password provided does not match the confirmation password.", 422));
    }
    try {

      const { name, email, password } = req.body;
      
      let user

      let avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      if (avatar && avatar.toString() && !avatar.toString().includes("https")) {
        avatar = "https:" + avatar.toString();
      }

      const userName = (await name) || email.slice(0, email.indexOf("@"));

      // encrypt password using bcrypt
      const salt = await bcrypt.genSalt(10);

      const safePassword = await bcrypt.hash(password, salt);

      const key = ecGenerate.genKeyPair();
      const public_key = key.getPublic("hex");
      const private_key = key.getPrivate("hex");

      user = {
        name: userName,
        email,
        password: safePassword,
        avatar: avatar || "",
        public_key,
        private_key,
      }
      
      // INSERT INTO accounts (name, email, password, avatar, public_key, private_key, account_type) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *
      
      const createdUser = await User.create(user);
      res.status(201).json({
        message: "User Created",
        success: true,
        token: createdUser.token,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  });
}

export default UserController;
