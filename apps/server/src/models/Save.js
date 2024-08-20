const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const SaveSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User", required: true, index: true },
  postId: { type: Types.ObjectId, ref: "Post", required: true, index: true },
  collectionId: {
    type: Types.ObjectId,
    ref: "Collection",
    default: null,
    index: true,
  },
  savedAt: { type: Date, default: Date.now },
});

// Static Method: Check if a post is saved by a user
SaveSchema.statics.isPostSaved = async function (userId, postId) {
  return await this.exists({ user: userId, postId });
};

// Static Method: Get all saves by a user
SaveSchema.statics.getSavesByUser = async function (
  userId,
  limit = 10,
  skip = 0
) {
  return await this.find({ user: userId })
    .populate("postId")
    .limit(limit)
    .skip(skip);
};

// Instance Method: Add a save to a collection
SaveSchema.methods.addToCollection = async function (collectionId) {
  this.collectionId = collectionId;
  await this.save();
};

// Static Method: Remove a save
SaveSchema.statics.removeSave = async function (userId, postId) {
  return await this.findOneAndDelete({ user: userId, postId });
};

const Save = model("Save", SaveSchema);
module.exports = Save;
