const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chapterSchema = new Schema({
  title: { type: String },
  article: { type: String },
  image: { type: String },
  video: { type: String },
  author: { type: String },
  date:  {
    type: Date,
    default: Date.now
  },
});

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;