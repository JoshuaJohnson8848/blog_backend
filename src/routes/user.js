import { Router } from 'express';
import { createUser, deleteUser, fetchAllUserByType, fetchOneUser, updateUser } from '../controllers/user.js';

const router = Router();

router.get("/:id", fetchOneUser);

router.get("/", fetchAllUserByType);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;