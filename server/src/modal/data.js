/* eslint-disable no-invalid-this */
import mongoose from 'mongoose';
import {createSchema} from '../db/index.js';
import {Resource} from './index.js';

const schema = createSchema({
  data: {
    type: [Object],
    default: [],
  },
});

schema.post('updateOne', async function({modifiedCount, matchedCount}) {
  if (modifiedCount === 1 && matchedCount === 1) {
    const _id = this._conditions._id;
    if (this._update.$push) {
      await Resource.updateOne({dataId: _id}, {$inc: {dataCount: 1}});
    } else if (this._update.$pull) {
      await Resource.updateOne({dataId: _id}, {$inc: {dataCount: -1}});
    } else if (this._update.$set?.data instanceof Array) {
      const dataCount = this._update.$set.data.length;
      await Resource.updateOne({dataId: _id}, {dataCount});
    }
  }
});

schema.post('updateMany', async function({modifiedCount, matchedCount}) {
  if (modifiedCount > 0 && matchedCount > 0) {
    const ids = this._conditions?._id?.$in;
    if (ids && this._update.$set?.data instanceof Array) {
      const dataCount = this._update.$set.data.length;
      await Resource.updateMany({dataId: {$in: ids}}, {dataCount});
    }
  }
});

export default mongoose.model('Data', schema);
