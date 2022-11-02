const mongoose = require('mongoose');
const { Schema } = mongoose;

const strandSchema = new Schema({
   name: {
      type: String,
      required: true,
      trim: true,
   },
});

const Strand = mongoose.model('strand', strandSchema);
module.exports = Strand;
