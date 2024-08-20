const mongoose = require("mongoose");
const Save = require("./Save");
const { Schema, model, Types } = mongoose;

const CollectionSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Instance Method: Add a save to the collection
CollectionSchema.methods.addSave = async function (saveId) {
  const save = await Save.findById(saveId);
  if (!save) throw new Error("Save not found");
  save.collectionId = this._id;
  await save.save();
  this.totalItems += 1;
  await this.save();
};

// Instance Method: Remove a save from the collection
CollectionSchema.methods.removeSave = async function (saveId) {
  const save = await Save.findById(saveId);
  if (!save || String(save.collectionId) !== String(this._id)) {
    throw new Error("Save not found in this collection");
  }
  save.collectionId = null;
  await save.save();
  this.totalItems = Math.max(0, this.totalItems - 1);
  await this.save();
};

// Instance Method: Get all saves in a collection
CollectionSchema.methods.getSaves = async function (limit = 10, skip = 0) {
  const saves = await Save.find({ collectionId: this._id })
    .populate("postId")
    .limit(limit)
    .skip(skip);
  const collectionWithSaves = { ...this.toObject(), saves };
  return collectionWithSaves;
};

// Instance Method: Rename the collection
CollectionSchema.methods.rename = async function (newName) {
  this.name = newName;
  await this.save();
};

const Collection = model("Collection", CollectionSchema);
module.exports = Collection;
