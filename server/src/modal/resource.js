/* eslint-disable no-invalid-this */
import mongoose, {Schema} from 'mongoose';
import {createSchema} from '../db/index.js';

const resourceEndpoint = new Schema({
  method: String,
  url: String,
  response: String,
  enable: {
    type: Boolean,
    default: true,
  },
  delay: {
    type: Number,
    default: 0,
  },
});

const resourceSchema = new Schema({
  name: String,
  type: String,
  fakerMethod: String,
  childId: Schema.Types.ObjectId,
});

const schema = createSchema({
  parentId: Schema.Types.ObjectId,
  projectId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  dataId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: String,
  generator: String,
  endpoints: [resourceEndpoint],
  schemas: [resourceSchema],
  dataCount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model('Resource', schema);
