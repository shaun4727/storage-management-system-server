import { Types } from 'mongoose';

export interface IFileType {
  name?: string;
  createdBy?: Types.ObjectId;
  fieldname?: string;
  originalname?: string;
  encoding?: string;
  mimetype?: string;
  destination?: string;
  favourite?: boolean;
  filename?: string;
  path?: string;
  size?: number;
  location?: string;
}
