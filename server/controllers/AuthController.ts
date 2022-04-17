import express, { Request, Response, Router, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/ErrorResponse";
import asyncHandler from "../middlewares/async";
import { pool } from "../config/db";
import User from "../models/User";

class AuthController {
  getUser = asyncHandler(async (req: any, res: any, next: any) => {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.includes("Bearer")
    ) {
      return next(new ErrorResponse("Go to log on.", 422));
    }

    const token = await req.headers.authorization.slice(
      req.headers.authorization.indexOf("Bearer") + 7
    );

    // SELECT * FROM accounts WHERE token = $1

    const user = await User.findOne({ where: { token } }) || false;

    res.json(user);
  });

  login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;

      // SELECT * FROM accounts WHERE email = $1

      const user = await User.findOne({ where: { email } }) || false;

      if (!user) {
        return next(new ErrorResponse("Invalid Credentials.", 422));
      }

      const isMatch = await bcrypt.compare(await password, user.password);

      if (!isMatch) {
        return next(new ErrorResponse("Invalid Credentials.", 422));
      }

      const payload = {
        user: {
          id: user.user_id,
        },
      };

      // UPDATE accounts SET last_login = now() WHERE email = $1

      user.last_login = new Date();
      

      const JWTSecretKey: any = process.env["jwtSecret"];
      return jwt.sign(
        payload,
        JWTSecretKey,
        { expiresIn: 360000 },
        async (err) => {
          if (err) {
            return next(new ErrorResponse(err.message, 422));
          }
          

          await user.save();

          // after save, in model
          // UPDATE accounts SET token = $1 WHERE email = $2

          res.json({ success: true, token: user.token });
        }
      );
    }
  );

  preLogin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;

      // SELECT email FROM accounts WHERE email = $1

      const user = await User.findOne({ where: { email } }) || false;

      if (!user) {
        return next(new ErrorResponse("Invalid Credentials.", 422));
      }

      res.json({ success: true, email });
    }
  );

  preRegister = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;

      // SELECT email FROM accounts WHERE email = $1

      const user = await User.findOne({ where: { email } }) || false;

      if (user) {
        return next(new ErrorResponse("Account already exists.", 422));
      }

      res.json({ success: true });
    }
  );

  update = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (
        !req.headers.authorization ||
        !req.headers.authorization.includes("Bearer")
      ) {
        return next(new ErrorResponse("Go to log on.", 422));
      }

      const {
        first_name,
        last_name,
        gender_title,
        date_of_birth,
        country,
        email,
        avatar,
      } = req.body;

      if (!avatar && !email) {
        return next(new ErrorResponse("Email address is required.", 422));
      }

      const token = req.headers.authorization.slice(
        req.headers.authorization.indexOf("Bearer") + 7
      );


      // SELECT * FROM accounts WHERE token = $1

      const user = await User.findOne({ where: { token } }) || false;

      if (!user) {
        return next(new ErrorResponse("Go to log on.", 422));
      }
      

        // UPDATE accounts SET first_name = $1, last_name = $2, gender_title = $3, date_of_birth = $4, country = $5 WHERE email = $6 RETURNING *

        user.first_name = first_name;
        user.last_name = last_name;
        user.gender_title = gender_title;
        user.date_of_birth = date_of_birth;
        user.country = country;

        if (email !== user?.email) {

          user.email = email;
          user.approved = false;

        }
        await user.save();
        

        return res.json({ success: true, user });

    }
  );

}

export default AuthController;
