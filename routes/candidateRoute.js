import express from 'express';
import {
    createCandidate,
    getAllCandidates,
    getCandidateById,
    updateCandidateById,
    deleteCandidateById
} from '../controllers/candidateController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();


router.post('create/', verifyToken,createCandidate);
router.get('get-all/', verifyToken,getAllCandidates);
router.get('/:id',verifyToken, getCandidateById);
router.put('update/:id',verifyToken, updateCandidateById);
router.delete('delete/:id',verifyToken ,deleteCandidateById);

export default router;
