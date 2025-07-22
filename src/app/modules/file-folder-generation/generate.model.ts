/**
 * Agent Schema definition
 */

import { model, Schema } from 'mongoose';
import { IFileType } from './generate.interface';

// 2. Define the Mongoose Schema
const FileTypeSchema: Schema = new Schema<IFileType>(
  {
    name: {
      type: String, // Use Mongoose's ObjectId type
      required: false, // Assuming orderId is mandatory
    },
    favourite: {
      type: Boolean, // Use Mongoose's ObjectId type
      default: false, // Assuming orderId is mandatory
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  },
);

// 3. Create and export the Mongoose Model
export const FileType = model<IFileType>('FileType', FileTypeSchema);
