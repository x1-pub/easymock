import mongoose from 'mongoose';
import {createSchema} from '../db/index.js';

const colorList = [
  '#f5222d',
  '#fa8c16',
  '#fadb14',
  '#52c41a',
  '#13c2c2',
  '#1890ff',
  '#722ed1',
  '#eb2f96',
];

const schema = createSchema({
  name: String,
  apiPrefix: String,
  description: String,
  themeColor: {
    type: String,
    enum: colorList,
    default: colorList[0],
  },
  themeMark: String,
  onwer: String,
  collaborators: {
    type: [String],
    default: [],
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Project', schema);
