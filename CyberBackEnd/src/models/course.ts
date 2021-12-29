import { model, Schema, Document } from 'mongoose';


export interface ICourse extends Document{
  id: number;
  description: string;
  iconUrl: string;
  longDescription: string;
  category: string;
  lessonsCount: number;
}

const courseSchema = new Schema({
  id: {
      type: Number
  },
  description: {
      type: String
  },
  iconUrl: {
      type: String
  },
  longDescription: {
      type: String
  },
  category: {
      type: String
  },
  lessonsCount: {
      type: Number
  }
});


export default model<ICourse>('Course', courseSchema);