import { Schema } from 'mongoose';
import { HttpError } from '../httpError/Error.js';
import { Comments } from '../scheme/comments.js';

interface iComment {
  stars: number;
  text: string;
  user: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  userName: string;
}
export const createCommentService = async (data: iComment) => {
  try {
    const comment = await Comments.create(data);
    return comment;
  } catch (error: unknown | any) {
    throw new HttpError(error.message, 404);
  }
};
export const getCommentByProductIdService = async (id: string) => {
  try {
    const commentsDto = await Comments.find({ product: id });

    return commentsDto;
  } catch (error: unknown | any) {
    throw new HttpError(error.message, 404);
  }
};
