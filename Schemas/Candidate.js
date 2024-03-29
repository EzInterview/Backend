const mongoose = require('mongoose');
const { Schema } = mongoose;

const candidateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    skills: {
        type: Array,
        required: true,
    },
    role: {
        type: String,
        required: true
    },
    current_status: {
        type: String,
        required: true,
        enum: ["Waiting", "Screening In Progress", "Screening Passed", "Interview Scheduled", "Hired", "Not Selected"]
    },
    company_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},{timestamps: true});