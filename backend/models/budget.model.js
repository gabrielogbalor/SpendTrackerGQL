import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;
