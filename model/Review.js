const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
    },
    reviewer : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Employee'
    },
    sent : {
      type : Boolean
    }
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;