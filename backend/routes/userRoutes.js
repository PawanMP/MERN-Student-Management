import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deletUserById,
  getUserById,
  updateUserById,
  addUser
} from "../controllers/userController.js";

import { authenticate, authorizeAdmin } from "../middlwares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);
router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

// ADAMIN ROUTES
router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deletUserById)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);


router.post("/addUser", authenticate, authorizeAdmin, addUser)
export default router;