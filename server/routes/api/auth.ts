

import express, {Request, Response, Router, NextFunction} from 'express';



const router: Router = express.Router();

import AuthController from '../../controllers/AuthController'


const authController: any = new AuthController;


//route get    api/auth
//description  get users
//access       private
router.get('/', authController.getUser);

//route get    api/auth
//description  login
//access       private
router.post('/', authController.login)

//route get    api/auth
//description  pre-login
//access       private
router.post('/pre-login', authController.preLogin)

//route get    api/auth
//description  pre-register
//access       private
router.post('/pre-register', authController.preRegister)

//route get    api/auth
//description  user update
//access       private
router.put('/', authController.update);





export default router;