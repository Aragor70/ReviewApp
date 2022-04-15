import express, { Request, Response, Router, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//custom imports
import User from "../models/user";
import asyncHandler from "../middlewares/async";
import ErrorResponse from "../utils/ErrorResponse";
//types
import { ec } from "elliptic";
const ecGenerate = new ec("secp256k1");

class UserController {
  /**
   * Create new user method, returns object with success message
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
      return res.status(400).send({
        message: "password provided does not match the confirmation password",
      });
    }
    try {
      const newUser = await User.create(req.body);
      console.log("this is the response", newUser);
      res.status(201).json({
        message: "User Created",
        auth: true,
        token: newUser.token,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  });
}

export default UserController;
