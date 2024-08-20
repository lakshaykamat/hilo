const { HttpStatusCode, CustomError } = require("../lib/util");
const Collection = require("../models/Collection");

class CollectionController {
  static async createCollection(req, res, next) {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: true, message: "Invaild name" });
    }

    const newCollection = new Collection({
      user: req.user._id.toString(),
      name: name.trim(),
    });
    await newCollection.save();
    return res.status(200).json(newCollection);
  }
  static async getCollection(req, res, next) {
    try {
      const { collectionId } = req.params;
      if (!collectionId) {
        throw new CustomError(
          HttpStatusCode.BAD_REQUEST,
          "Invalild collection id"
        );
      }
      let collection = await Collection.findById(collectionId);
      collection = await collection.getSaves();
      return res.status(HttpStatusCode.OK).json({ ...collection });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = CollectionController;
