import express from 'express';
import { tryCatchWrapper } from '../tryCatchWrapper/tryCatchWrapper.js';
import { createComment, getCommentByProductId } from '../controllers/comments.js';
import { auth } from '../middlewares/auth.js';

export const commentsRouter = express.Router();

commentsRouter.post('/create', auth, tryCatchWrapper(createComment));
commentsRouter.get('/getByProductId/:id', tryCatchWrapper(getCommentByProductId));
