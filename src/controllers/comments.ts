import { Request, Response } from 'express';
import { Document, Model, Types } from 'mongoose';

import { HttpError } from '../httpError/Error.js';
import { createCommentService, getCommentByProductIdService } from '../services/comments.js';
import { User } from '../scheme/user.js';

interface RequestWithUser extends Request {
  user?: Document | Model<typeof User>;
}

export const createComment = async (req: RequestWithUser, res: Response): Promise<Response> => {
  try {
    const { _id } = req.user as { _id: Types.ObjectId };
    const { name } = req.user as { name: string };

    const comment = await createCommentService({ ...req.body, user: _id, userName: name });

    return res.status(201).json({ comment });
  } catch (err: any) {
    return res.status(err.code || 500).json({ message: err.message });
  }
};

export const getCommentByProductId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const comments = await getCommentByProductIdService(id);

    return res.status(201).json({ comments });
  } catch (err: any) {
    return res.status(err.code || 500).json({ message: err.message });
  }
};
