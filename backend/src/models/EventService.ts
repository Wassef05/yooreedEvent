import mongoose, { Schema, Document } from 'mongoose';

export interface IEventService extends Document {
  titre: string;
  description: string;
  features: string[];
  images: string[];
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventServiceSchema = new Schema<IEventService>(
  {
    titre: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    features: { type: [String], default: [] },
    images: { type: [String], default: [] },
    slug: { type: String, required: true, unique: true, index: true },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const EventService = mongoose.model<IEventService>('EventService', EventServiceSchema);

