import mongoose from 'mongoose';
const { Schema } = mongoose;

const ScheduleSchema = new Schema({
    participants: {
        type: [String],
        required: true
    },
    subject: String,
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    }
});

const ScheduleModel = mongoose.model('Schedule', ScheduleSchema);

export default ScheduleModel;