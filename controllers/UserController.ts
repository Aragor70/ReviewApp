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

      // INSERT INTO accounts (name, email, password, avatar, public_key, private_key, account_type) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *
      
      const createdUser = await User.create(req.body);
      res.status(201).json({
        message: "User Created",
        success: true,
        token: createdUser.token,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  });


  getUsers = asyncHandler(async (req: any, res: any, next: any) => {
    if (
      req?.headers?.authorization &&
      req?.headers?.authorization?.includes("Bearer")
    ) {
      const token = req.headers.authorization.slice(
        req.headers.authorization.indexOf("Bearer") + 7
      );

      // SELECT * FROM accounts WHERE token = $1

      const user = await User.findOne({ where: { token } }) || false;


      if (user) {
        
        // SELECT * FROM accounts

        const users = await User.findAll()

        res.json(users);

      } else {

        // SELECT user_id FROM accounts
        
        const users = await User.findAll({ attributes: ['user_id'] })

        res.json(users);
      }
    } else {

        // SELECT user_id FROM accounts

        const users = await User.findAll({ attributes: ['user_id'] })

        res.json(users);
    }
  });



}

export default UserController;
