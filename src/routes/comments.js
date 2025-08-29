import { Router } from 'express';
import { authenticate } from '../middleware/authentication.js';
import { createComment, deleteComment, fetchAllComments, fetchOneComment, updateComment } from '../controllers/comments.js';

const router = Router();

router.get("/:id", fetchOneComment);

router.get("/", authenticate, fetchAllComments);

router.post("/", authenticate, createComment);

router.put("/:id", authenticate, updateComment);

router.delete("/:id", authenticate, deleteComment);

export default router;