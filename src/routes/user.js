import { Router } from 'express';
import { createUser, deleteUser, fetchAllUserByType, fetchOneUser, updateUser } from '../controllers/user.js';
import { authenticate } from '../middleware/authentication.js';

const router = Router();

router.get("/:id", fetchOneUser);

router.get("/", authenticate, fetchAllUserByType);

router.post("/", authenticate, createUser);

router.put("/:id", authenticate, updateUser);

router.delete("/:id", authenticate, deleteUser);

export default router;