import express from 'express';
import {
    createCandidate,
    getAllCandidates,
    getCandidateById,
    updateCandidateById,
    deleteCandidateById,
    savePDFURL
} from '../controllers/candidateController.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();


router.post('/create', createCandidate);
router.get('/get-all',getAllCandidates);
router.get('/:id', getCandidateById);
router.put('update/:id', updateCandidateById);
router.delete('delete/:id',deleteCandidateById);
router.post('/save-pdf-url', savePDFURL);


export default router;
