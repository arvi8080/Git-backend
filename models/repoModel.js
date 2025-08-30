const mongoose = require('mongoose');
const { Schema } = mongoose;

const RepositorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  content: [
    {
      type: String,
    }
  ],

  visibility: {
    type: Boolean,
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stars: {
    type: Number,
    default: 0,
  },
  forks: {
    type: Number,
    default: 0,
  },
  issues: [
    {
      type: Schema.Types.ObjectId,
      ref: "Issue",
    },
  ],
});

const Repository = mongoose.model("Repository", RepositorySchema);
module.exports = Repository;
