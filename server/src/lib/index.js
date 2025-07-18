import {faker} from '@faker-js/faker/locale/zh_CN';
import _ from 'lodash';

const fakerData = (method) => {
  const funcStr = `return function fn(faker){return faker.${method}()}`;
  const run = new Function(funcStr);
  return run()(faker);
};

const type2data = (type, fakerMethod, idx) => {
  let result = '';
  switch (type) {
    case 'Faker.js':
      result = fakerData(fakerMethod);
      break;
    case 'Object ID':
      result = String(idx);
      break;
    case 'String':
      result = `string ${idx}`;
      break;
    case 'Number':
      result = parseInt(Math.random() * 100);
      break;
    case 'Boolean':
      result = Math.random() > 0.5;
      break;
    case 'Object':
      result = {};
      break;
    case 'Array':
      result = [];
      break;
    case 'Date':
      result = +new Date();
      break;
    default:
      result = 'Unkonw Type';
  }
  return result;
};

/**
 * 创建响应消息
 * @param {any} data
 * @param {Array} fields
 */

export const createRes = {
  success: (data = null, fields = []) => ({
    code: 1,
    errorMsg: '',
    data: fields.length > 0 ? pick(data, fields) : data,
  }),
  error: (errorMsg = '', code = 0, data = null) => ({
    code,
    errorMsg,
    data,
  }),
};

/**
 * 筛选数据
 * @param {Object | Array} data
 * @param {Array} fields
 */

export const pick = (data, fields) => {
  if (data instanceof Array) {
    return data.map((item) => _.pick(item, fields));
  }
  if (typeof data === 'object') {
    return _.pick(data, fields);
  }
  return data;
};

/**
 * 列表转树
 * @param {Array} list
 */

export const listToTree = (list = []) => {
  const res = [];
  list.forEach((item) => {
    if (!item.parentId) {
      res.push(item);
    } else {
      const parent = list.find((node) => node._id == item.parentId);
      parent.children = parent.children || [];
      parent.children.push(item);
    }
  });
  return res;
};

/**
 * 根据模板生成data
 * @param {Array} schemas
 * @param {String} template
 * @param {Number} count
 * @param {Array} skip
 * @returns
 */

export const render = (schemas = [], template = '', count = 0, skip = []) => {
  const result = [];
  for (let i = 0; i < count; i ++) {
    // 处理schemas
    const schemaData = {};
    for (let j = 0; j < schemas.length; j ++) {
      const item = schemas[j];
      if (skip.includes(item.type)) continue;
      schemaData[item.name] = type2data(
          item.type,
          item.fakerMethod,
          i + 1,
      );
    }
    // 处理template
    let tempData = {};
    if (template) {
      const text = template.replace(
          /\{\{(.*?)\}\}/g,
          (match, key) => fakerData(key.trim()),
      );
      tempData = JSON.parse(text);
    }

    // 合并
    const data = Object.assign(schemaData, tempData);

    result.push(data);
  }
  return result;
};

/**
 * 封装用户自定义的返回值
 * @param {String} response
 * @param {Object} origin
 */

export const renderRes = (response, origin) => {
  let text;
  try {
    JSON.parse(response);
    text = response
        .replace(
            /\{\{([a-z]{1,}\.[a-zA-Z]{1,})\}\}/g,
            (match, key) => fakerData(key.trim()),
        )
        .replace(/"\{\{(mockData)\}\}"/g, JSON.stringify(origin.mockData))
        .replace(/"\{\{(count)\}\}"/g, JSON.stringify(origin.count));
  } catch (err) {
    text = response.replace(
        /\{\{(.*?)\}\}/g,
        (match, key) => JSON.stringify(origin[key.trim()]),
    );
  }

  try {
    text = JSON.parse(text);
  } catch (err) {}

  return text;
};
