const mongoose = require('mongoose');
const { Schema } = mongoose;

const videoMaterialsSchema = Schema(
   {
      title: {
         type: String,
         required: true,
         trim: true,
      },
      url: {
         type: String,
         required: true,
      },
   },
   { timestamps: true }
);

const VideoMaterial = mongoose.model('video_material', videoMaterialsSchema);
module.exports = VideoMaterial;
