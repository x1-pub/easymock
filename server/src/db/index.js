import mongoose from 'mongoose';
import chalk from 'chalk';
import {MONGODB_CONNECT_KEY} from '../config/index.js';

const {Schema} = mongoose;

const defaultOption = {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated',
  },
};

mongoose.connect(MONGODB_CONNECT_KEY);

export const db = mongoose.connection;

db.once('open', () => {
  console.log('');
  console.log(
      chalk.green('  ➜  ') +
    'Mongo:  ' +
    chalk.hex('#8EFAFD').underline('Connection successful'),
  );
  console.log('');
});

export const createSchema = (fields, options = {}) => {
  return new Schema(fields, {...defaultOption, ...options});
};
