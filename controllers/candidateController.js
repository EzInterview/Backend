import Candidate from '../models/candidateModel.js';
import { errorHandler } from '../utils/error.js';


export const createCandidate = async (req, res, next) => {
    const { name, email, contact, skills, role, current_status, company_id } = req.body;
    
    if (!name) return next(errorHandler(401, 'Name is required'));
    if (!email) return next(errorHandler(401, 'Email is required'));
    if (!contact) return next(errorHandler(401, 'Contact is required'));
    if (!skills || !Array.isArray(skills) || skills.length === 0) return next(errorHandler(401, 'Skills are required'));
    if (!role) return next(errorHandler(401, 'Role is required'));
    if (!current_status) return next(errorHandler(401, 'Current status is required'));
    if (!company_id) return next(errorHandler(401, 'Company ID is required'));

    try {
        const candidate = new Candidate({
            name,
            email,
            contact,
            skills,
            role,
            current_status,
            company_id
        });

        await candidate.save();
        res.status(201).json(candidate);
    } catch (error) {
        console.log(error);
        next(errorHandler(500, 'Internal Server Error'));
    }
};


export const getAllCandidates = async (req, res, next) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (error) {
        next(errorHandler(500, 'Internal Server Error'));
    }
};
export const savePDFURL = async (req, res, next) => {
    try {
        // Destructure the request body to get candidateId and pdf_url
        const { candidateId, pdf_url } = req.body;

        // Find the candidate by ID and update the pdf_url field
        const updatedCandidate = await Candidate.findByIdAndUpdate(
            candidateId,
            { $set: { pdf_url } },
            { new: true }
        );

        // If candidate not found, return an error
        if (!updatedCandidate) {
            return next(errorHandler(404, 'Candidate not found'));
        }

        // Return the updated candidate document
        res.status(200).json({ message: 'PDF URL saved successfully', candidate: updatedCandidate });
    } catch (error) {
        // Handle any errors and return an error response
        console.error('Error saving PDF URL:', error.message);
        next(errorHandler(500, 'Internal Server Error'));
    }
};


export const getCandidateById = async (req, res, next) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return next(errorHandler(404, 'Candidate not found'));
        }
        res.json(candidate);
    } catch (error) {
        next(errorHandler(500, 'Internal Server Error'));
    }
};


export const updateCandidateById = async (req, res, next) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!candidate) {
            return next(errorHandler(404, 'Candidate not found'));
        }
        res.json(candidate);
    } catch (error) {
        next(errorHandler(500, 'Internal Server Error'));
    }
};

// Delete a candidate by ID
export const deleteCandidateById = async (req, res, next) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!candidate) {
            return next(errorHandler(404, 'Candidate not found'));
        }
        res.json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        next(errorHandler(500, 'Internal Server Error'));
    }
};
