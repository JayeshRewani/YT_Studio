import mongoose from 'mongoose';

const generationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  videoType: {
    type: String,
    required: true
  },
  tone: {
    type: String,
    required: true
  },
  generatedTitles: [{
    title: String,
    score: Number,
    emotional: Number,
    clarity: Number,
    clickbait: Number
  }],
  generatedDescription: {
    type: String,
    required: true
  },
  generatedTags: [{
    tag: String,
    competition: {
      type: String,
      enum: ['high', 'medium', 'low']
    },
    trending: Boolean
  }],
  generatedKeywords: [{
    keyword: String,
    volume: String,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    },
    trending: Boolean
  }],
  creditsUsed: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

const Generation = mongoose.model('Generation', generationSchema);
export default Generation;