const express = require("express");
const router = express.Router();
const CollectionController = require("../controller/CollectionController");

// Create a new conversation
router.post("/", CollectionController.createCollection);
router.get("/:collectionId", CollectionController.getCollection);

module.exports = router;
