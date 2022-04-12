
import express, {Request, Response, Router, NextFunction} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ErrorResponse from "../utils/ErrorResponse";
import asyncHandler from "../middlewares/async";
import { pool } from '../config/db';


class AuthController {


    getUser = asyncHandler( async (req: any, res: any, next: any) => {
        
        if (!req.headers.authorization || !req.headers.authorization.includes('Bearer')) {
            return next(new ErrorResponse('Go to log on.', 422))
        }

        const token = await req.headers.authorization.slice(req.headers.authorization.indexOf('Bearer') + 7)

        const { rows } = await pool.query(`SELECT * FROM accounts WHERE token = $1`, [token]);
    
        const user = await rows[0] || false;

        res.json(user);

    })

    login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
        const { email, password } = req.body;
    
        const { rows } = await pool.query(`SELECT * FROM accounts WHERE email = $1`, [email]);
        
        const user = await rows[0] || false;
        
        if(!user){
            return next(new ErrorResponse('Invalid Credentials.', 422))
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch){
            return next(new ErrorResponse('Invalid Credentials.', 422))
        }
    
        const payload = {
            user: {
                id: user.user_id
            }
        }

        await pool.query(`UPDATE accounts SET last_login = now() WHERE email = $1`, [email]);
    
        const JWTSecretKey: any = process.env["jwtSecret"]
        return jwt.sign(payload, JWTSecretKey, { expiresIn: 360000 },
            async (err, token) => {
                if(err) {
                    return next(new ErrorResponse(err.message, 422))
                }
    
                await pool.query(`UPDATE accounts SET token = $1 WHERE email = $2`, [token, email]);
    
                res.json({ success: true, token }); 
                
        });
    
    })

    
    preLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
        const { email } = req.body;
    
        const { rows } = await pool.query(`SELECT email FROM accounts WHERE email = $1`, [email]);
        
        const user = await rows[0] || false;
        
        if(!user) {
            return next(new ErrorResponse('Invalid Credentials.', 422))
        }
    
        res.json({ success: true, email }); 
           
    })
    
    preRegister = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
        const { email } = req.body;
    
        const { rows } = await pool.query(`SELECT email FROM accounts WHERE email = $1`, [email]);
        
        const user = await rows[0] || false;
        
        if(user) {
            return next(new ErrorResponse('Account already exists.', 422))
        }
    
        res.json({ success: true });
           
    })
    
    update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
        if (!req.headers.authorization || !req.headers.authorization.includes('Bearer')) {
            return next(new ErrorResponse('Go to log on.', 422))
        }
    
    
        const { first_name, last_name, gender_title, date_of_birth, country, email, avatar } = req.body;
    
        if ( !avatar && !email ) {
            return next(new ErrorResponse('Email address is required.', 422))
        }
    
        const token = req.headers.authorization.slice(req.headers.authorization.indexOf('Bearer') + 7)
    
        const { rows } = await pool.query(`SELECT * FROM accounts WHERE token = $1`, [token]);
    
        const user = await rows[0] || false;
        
        if (!user) {
            return next(new ErrorResponse('Go to log on.', 422))
        }
        
        if (email && (email === user?.email)) {

            const users = await pool.query(`UPDATE accounts SET first_name = $1, last_name = $2, gender_title = $3, date_of_birth = $4, country = $5 WHERE email = $6 RETURNING *`, [ first_name, last_name, gender_title, date_of_birth, country, user?.email ]);
            
            return res.json({ success: true, user: users?.rows[0] });

        } else {
            
            const users = await pool.query(`UPDATE accounts SET avatar = $1 WHERE email = $2  RETURNING *`, [ avatar, user?.email ]);
            
            return res.json({ success: true, user: users?.rows[0] });
            
        }
           
    })
    
    setMainWallet = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
        if (!req.headers.authorization || !req.headers.authorization.includes('Bearer')) {
            return next(new ErrorResponse('Go to log on.', 422))
        }
    
    
        const { main_wallet } = req.body;
        
        if ( !main_wallet ) {
            return next(new ErrorResponse('Currency is required.', 422))
        }
    
        const token = req.headers.authorization.slice(req.headers.authorization.indexOf('Bearer') + 7)
    
        const { rows } = await pool.query(`SELECT * FROM accounts WHERE token = $1`, [token]);
    
        const user = await rows[0] || false;
        
        if (!user) {
            return next(new ErrorResponse('Go to log on.', 422))
        }
    
        const updates: any = await pool.query(`UPDATE accounts SET main_wallet = $1 WHERE email = $2 RETURNING *`, [ main_wallet, user.email ]);
     
        res.json({ success: true, user: updates?.rows[0] || {} });
           
    })
    
    createWallet = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
        if (!req.headers.authorization || !req.headers.authorization.includes('Bearer')) {
            return next(new ErrorResponse('Go to log on.', 422))
        }
    
        const { wallet } = req.body;
        
        if ( !wallet ) {
            return next(new ErrorResponse('Currency is required.', 422))
        }
    
        const token = req.headers.authorization.slice(req.headers.authorization.indexOf('Bearer') + 7)
    
        const { rows } = await pool.query(`SELECT * FROM accounts WHERE token = $1`, [token]);
    
        const user = await rows[0] || false;
        
        if (!user) {
            return next(new ErrorResponse('Go to log on.', 422))
        }
    
        const updates: any = await pool.query(`UPDATE accounts SET wallets = array_append(wallets, $1) WHERE email = $2 RETURNING *`, [ wallet, user.email ]);
     
        res.json({ success: true, user: updates?.rows[0] || {} });
           
    })

    verifySecret = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        
        const { secret, password } = req.body;
        
        const { rows } = await pool.query(`SELECT * FROM accounts WHERE private_key = $1 `, [secret]);
    
        const user = await rows[0] || false;
        
        if (!user) {
            return next(new ErrorResponse('Invalid Credentials.', 422))
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch){
            return next(new ErrorResponse('Invalid Credentials.', 422))
        }

        res.json({ success: true });
           
    })
    


    updateEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
        const { secret, password, email, emailConfirmation } = req.body;
        
                
        if (email !== emailConfirmation) {
            return next(new ErrorResponse('These emails are not equal.', 422))
        }

        const { rows } = await pool.query(`SELECT * FROM accounts WHERE private_key = $1 `, [secret]);
    
        const user = await rows[0] || false;
        
        if (!user) {
            return next(new ErrorResponse('Invalid Credentials.', 422))
        }

        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch){
            return next(new ErrorResponse('Invalid Credentials.', 422))
        }
        
        const users: any = await pool.query(`UPDATE accounts SET email = $1 WHERE email = $3 RETURNING *`, [ email, false, user.email ]);

        user.email = await email;


        res.json({ success: true, user: users?.rows[0] });

    })

}

export default AuthController;