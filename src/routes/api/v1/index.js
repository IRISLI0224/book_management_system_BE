const express = require("express");
const router = new express.Router();
const userController = require("../../../controller/user");
const bookController = require("../../../controller/book");

//user routes
router.get("/users", userController.index);
router.put("/users/:id", userController.update);
router.get("/users/:id", userController.show);
router.delete("/users/:id", userController.destroy);
router.post("/create/user", userController.store);

//books routes
router.post("/create/book", bookController.store);
router.get("/books/:id", bookController.show);
router.delete("/books/:id", bookController.destroy);
router.put("/books/:id", bookController.update);
router.put("/books/borrow/:bookid/:userid", bookController.borrow);

module.exports = router;
