import express from 'express';
import { signup , login ,logout , updateProfile , checkAuth , refreshTokens} from '../controllers/auth.controllers.js';
import { protectRoute } from '../middleware/auth.middlewera.js';
const router = express.Router();    



router.post('/signup', signup);

router.post('/login',login );

router.post('/logout', logout);

router.post("/refresh", refreshTokens);


router.put('/update-profile',protectRoute,updateProfile);

router.get('/check' , protectRoute ,checkAuth )
export default router;