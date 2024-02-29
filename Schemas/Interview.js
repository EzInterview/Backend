const mongoose = require('mongoose');
const { Schema } = mongoose;
 
const interviewSchema = new Schema({
    candidate_id: {
        type: Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    company_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scheduled_time: {
        type: Date,
        required: true
    },
    room_id: {
        type: String,
        required: true
    },
    looking_away_time: {
        type: Number,
        default: 0
    },
    outoftab_time: {   
        type: Number,
        default: 0
    },
})