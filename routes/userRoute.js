import express from 'express';
import { google,signin, signup,signOut ,verifyOTP, updateUser} from '../controllers/userController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post('/google', google);
router.post('/verify-otp', verifyOTP);
router.post("/update/:id",verifyToken,  updateUser);
router.get('/signout', verifyToken, signOut);

export default router;