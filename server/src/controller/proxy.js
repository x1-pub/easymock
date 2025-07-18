/* eslint-disable no-unused-vars */
import _ from 'lodash';
import {UserProxyLimit} from '../lib/error.js';
import {render, renderRes} from '../lib/index.js';
import {Data, Resource} from '../modal/index.js';

export default class ProxyCtl {
  /**
   * 所有get方法入口
   * @param {Object} ctx
   */
  static async methodGet(ctx) {
    const {emParaseObj} = ctx.request;
    const {
      fr,
      frid,
      sr,
      srid,
      tr,
      trid,
      response,
    } = emParaseObj;

    let data;
    if (trid) {
      data = await ProxyCtl.getLv3Item(emParaseObj);
    } else if (tr) {
      data = await ProxyCtl.getLv3List(emParaseObj);
    } else if (srid) {
      data = await ProxyCtl.getLv2Item(emParaseObj);
    } else if (sr) {
      data = await ProxyCtl.getLv2List(emParaseObj);
    } else if (frid) {
      data = await ProxyCtl.getLv1Item(emParaseObj);
    } else if (fr) {
      data = await ProxyCtl.getLv1List(emParaseObj);
    }

    let result = 'Not Found';
    let status = 404;
    if (data) {
      const origin = {
        count: data instanceof Array ? data.length : '{{count}}',
        mockData: data,
      };

      result = renderRes(response, origin);
      status = 200;
    }

    ctx.status = status;
    ctx.body = result;
  }

  /**
   * 所有post方法入口
   * @param {Object} ctx
   */
  static async methodPost(ctx) {
    const {
      fr,
      frid,
      sr,
      srid,
      tr,
      trid,
      response,
    } = ctx.request.emParaseObj;

    let data;
    if (tr) {
      data = await ProxyCtl.postLv3Item(ctx);
    } else if (sr) {
      data = await ProxyCtl.postLv2Item(ctx);
    } else if (fr) {
      data = await ProxyCtl.postLv1Item(ctx);
    }

    let result = 'Not Found';
    let status = 404;
    if (data) {
      const origin = {
        count: '{{count}}',
        mockData: data,
      };

      result = renderRes(response, origin);
      status = 200;
    }

    ctx.status = status;
    ctx.body = result;
  }

  /**
   * 所有put方法入口
   * @param {Object} ctx
   */
  static async methodPut(ctx) {
    const {
      fr,
      frid,
      sr,
      srid,
      tr,
      trid,
      response,
    } = ctx.request.emParaseObj;

    let data;
    if (trid) {
      data = await ProxyCtl.putLv3Item(ctx);
    } else if (srid) {
      data = await ProxyCtl.putLv2Item(ctx);
    } else if (frid) {
      data = await ProxyCtl.putLv1Item(ctx);
    }

    let result = 'Not Found';
    let status = 404;
    if (data) {
      const origin = {
        count: '{{count}}',
        mockData: data,
      };

      result = renderRes(response, origin);
      status = 200;
    }

    ctx.status = status;
    ctx.body = result;
  }

  /**
   * 所有delete方法入口
   * @param {Object} ctx
   */
  static async methodDelete(ctx) {
    const {
      fr,
      frid,
      sr,
      srid,
      tr,
      trid,
      response,
    } = ctx.request.emParaseObj;

    let data;
    if (trid) {
      data = await ProxyCtl.deleteLv3Item(ctx);
    } else if (srid) {
      data = await ProxyCtl.deleteLv2Item(ctx);
    } else if (frid) {
      data = await ProxyCtl.deleteLv1Item(ctx);
    }

    let result = 'Not Found';
    let status = 404;
    if (data) {
      const origin = {
        count: '{{count}}',
        mockData: data,
      };

      result = renderRes(response, origin);
      status = 200;
    }

    ctx.status = status;
    ctx.body = result;
  }

  /**
   * get: 所有一级资源
   * @param {Object} ctx
   */
  static async getLv1List({dataId}) {
    const {data} = await Data.findById(dataId);
    return data;
  }

  /**
   * get: 指定id一级资源
   * @param {Object} ctx
   */
  static async getLv1Item({dataId, frid, idName}) {
    const {data} = await Data.findById(dataId);
    const result = data.find((d) => d[idName] == frid);
    return result;
  }

  /**
   * get: 所有二级资源
   * @param {Object} ctx
   */
  static async getLv2List({dataId, frid, pidName}) {
    const {data} = await Data.findById(dataId);
    const result = data.filter((d) => d[pidName] == frid);
    return result;
  }

  /**
   * get: 指定id二级资源
   * @param {Object} ctx
   */
  static async getLv2Item({dataId, frid, srid, idName, pidName}) {
    const {data} = await Data.findById(dataId);
    const result = data.find(
        (d) => d[pidName] == frid && d[idName] == srid,
    );
    return result;
  }

  /**
   * get: 所有三级资源
   * @param {Object} ctx
   */
  static async getLv3List({dataId, srid, pidName}) {
    const {data} = await Data.findById(dataId);
    const result = data.filter(
        (d) => d[pidName] == srid,
    );
    return result;
  }

  /**
   * get: 指定id三级资源
   * @param {Object} ctx
   */
  static async getLv3Item({dataId, srid, trid, idName, pidName}) {
    const {data} = await Data.findById(dataId);
    const result = data.find(
        (d) => d[pidName] == srid && d[idName] == trid,
    );
    return result;
  }

  /**
   * delete: 指定id一级资源
   * @param {Object} ctx
   */
  static async deleteLv1Item(ctx) {
    const {
      dataId,
      response,
      delay,
      url,
      fr,
      frid,
      sr,
      srid,
      tr,
      trid,
      projectId,
      idName,
      pidName,
    } = ctx.request.emParaseObj;

    const result = await Data.findOneAndUpdate(
        {
          _id: dataId,
          data: {
            $elemMatch: {
              [idName]: frid,
            },
          },
        },
        {
          $pull: {
            data: {[idName]: frid},
          },
        },
    );

    if (!result) {
      return null;
    }

    await Resource.updateOne({dataId}, {$inc: {dataCount: -1}});
    const data = result.data.find((d) => d[idName] == frid);
    return data;
  }

  /**
   * delete: 指定id二级资源
   * @param {Object} ctx
   */
  static async deleteLv2Item(ctx) {
    const {
      dataId,
      response,
      delay,
      url,
      fr,
      frid,
      sr,
      srid,
      tr,
      trid,
      projectId,
      idName,
      pidName,
    } = ctx.request.emParaseObj;

    const result = await Data.findOneAndUpdate(
        {
          _id: dataId,
          data: {
            $elemMatch: {
              [idName]: srid,
              [pidName]: frid,
            },
          },
        },
        {
          $pull: {
            data: {
              [idName]: srid,
              [pidName]: frid,
            },
          },
        },
    );

    if (!result) {
      return null;
    }

    await Resource.updateOne({dataId}, {$inc: {dataCount: -1}});
    const data = result.data.find(
        (d) => d[idName] == srid && d[pidName] == frid,
    );
    return data;
  }

  /**
   * delete: 指定id三级资源
   * @param {Object} ctx
   */
  static async deleteLv3Item(ctx) {
    const {
      dataId,
      response,
      delay,
      url,
      fr,
      frid,
      sr,
      srid,
      tr,
      trid,
      projectId,
      idName,
      pidName,
    } = ctx.request.emParaseObj;

    const result = await Data.findOneAndUpdate(
        {
          _id: dataId,
          data: {
            $elemMatch: {
              [idName]: trid,
              [pidName]: srid,
            },
          },
        },
        {
          $pull: {
            data: {
              [idName]: trid,
              [pidName]: srid,
            },
          },
        },
    );

    if (!result) {
      return null;
    }

    await Resource.updateOne({dataId}, {$inc: {dataCount: -1}});
    const data = result.data.find(
        (d) => d[idName] == trid && d[pidName] == srid,
    );
    return data;
  }

  /**
   * post: 添加一级资源
   * @param {Object} ctx
   */
  static async postLv1Item(ctx) {
    const {
      dataId,
      response,
      delay,
      url,
      fr,
      frid,
      sr,
      srid,
      tr,
      trid,
      projectId,
      schemas,
      generator,
      idName,
      pidName,
    } = ctx.request.emParaseObj;
    const form = ctx.request.body;
    const [preData] = render(schemas, generator, 1, ['Object ID', 'Parent ID']);
    const {data} = await Data.findOne({_id: dataId});

    if (data.length >= 100) {
      throw new UserProxyLimit();
    }

    const mergeData = {...form, ...preData};
    mergeData[idName] = String(+data[data.length - 1][idName] + 1);
    await Data.updateOne(
        {
          _id: dataId,
        },
        {
          $push: {
            data: {...mergeData},
          },
        },
    );

    return mergeData;
  }

  /**
   * post: 添加二级资源
   * @param {Object} ctx
   */
  static async postLv2Item(ctx) {
    const {
      dataId,
      response,
      delay,
      url,
      fr,
      frid,
      sr,
      srid,
      tr,
      trid,
      projectId,
      schemas,
      generator,
      idName,
      pidName,
    } = ctx.request.emParaseObj;
    const form = ctx.request.body;

    const [preData] = render(schemas, generator, 1, ['Object ID', 'Parent ID']);
    const {data} = await Data.findById(dataId);
    const mergeData = {...form, ...preData};
    mergeData[idName] = String(+data[data.length - 1][idName] + 1);
    mergeData[pidName] = frid;
    await Data.updateOne(
        {
          _id: dataId,
        },
        {
          $push: {
            data: {...mergeData},
          },
        },
    );

    return mergeData;
  }

  /**
   * post: 添加三级资源
   * @param {Object} ctx
   */
  static async postLv3Item(ctx) {
    const {
      dataId,
      response,
      delay,
      url,
      fr,
      frid,
      sr,
      srid,
      tr,
      trid,
      projectId,
      schemas,
      generator,
      idName,
      pidName,
    } = ctx.request.emParaseObj;
    const form = ctx.request.body;

    const [preData] = render(schemas, generator, 1, ['Object ID', 'Parent ID']);
    const {data} = await Data.findById(dataId);
    const mergeData = {...form, ...preData};
    mergeData[idName] = String(+data[data.length - 1][idName] + 1);
    mergeData[pidName] = srid;
    await Data.updateOne(
        {
          _id: dataId,
        },
        {
          $push: {
            data: {...mergeData},
          },
        },
    );

    return mergeData;
  }

  /**
   * put: 更新一级资源
   * @param {Object} ctx
   */
  static async putLv1Item(ctx) {
    const {
      dataId,
      response,
      delay,
      url,
      fr,
      frid,
      sr,
      srid,
      tr,
      trid,
      projectId,
      schemas,
      generator,
      idName,
      pidName,
    } = ctx.request.emParaseObj;
    const form = ctx.request.body;

    const cleanForm = _.omit(form, [idName]);
    const sets = {};
    for (const key in cleanForm) {
      if (cleanForm.hasOwnProperty(key)) {
        sets[`data.$.${key}`] = cleanForm[key];
      }
    }
    const result = await Data.findOneAndUpdate(
        {
          _id: dataId,
          data: {$elemMatch: {[idName]: frid}},
        },
        {
          $set: sets,
        },
        {
          new: true,
        },
    );

    if (!result) {
      return null;
    }

    const data = result.data.find((d) => d[idName] == frid);
    return data;
  }

  /**
   * put: 更新二级资源
   * @param {Object} ctx
   */
  static async putLv2Item(ctx) {
    const {
      dataId,
      response,
      delay,
      url,
      fr,
      frid,
      sr,
      srid,
      tr,
      trid,
      projectId,
      schemas,
      generator,
      idName,
      pidName,
    } = ctx.request.emParaseObj;
    const form = ctx.request.body;

    const cleanForm = _.omit(form, [idName, pidName]);
    const sets = {};
    for (const key in cleanForm) {
      if (cleanForm.hasOwnProperty(key)) {
        sets[`data.$.${key}`] = cleanForm[key];
      }
    }
    const result = await Data.findOneAndUpdate(
        {
          _id: dataId,
          data: {
            $elemMatch: {
              [idName]: srid,
              [pidName]: frid,
            },
          },
        },
        {
          $set: sets,
        },
        {
          new: true,
        },
    );

    if (!result) {
      return null;
    }

    const data = result.data.find(
        (d) => d[idName] == srid && d[pidName] == frid,
    );
    return data;
  }

  /**
   * put: 更新三级资源
   * @param {Object} ctx
   */
  static async putLv3Item(ctx) {
    const {
      dataId,
      response,
      delay,
      url,
      fr,
      frid,
      sr,
      srid,
      tr,
      trid,
      projectId,
      schemas,
      generator,
      idName,
      pidName,
    } = ctx.request.emParaseObj;
    const form = ctx.request.body;

    const cleanForm = _.omit(form, [idName, pidName]);
    const sets = {};
    for (const key in cleanForm) {
      if (cleanForm.hasOwnProperty(key)) {
        sets[`data.$.${key}`] = cleanForm[key];
      }
    }
    const result = await Data.findOneAndUpdate(
        {
          _id: dataId,
          data: {
            $elemMatch: {
              [idName]: trid,
              [pidName]: srid,
            },
          },
        },
        {
          $set: sets,
        },
        {
          new: true,
        },
    );

    if (!result) {
      return null;
    }

    const data = result.data.find(
        (d) => d[idName] == trid && d[pidName] == srid,
    );
    return data;
  }
}
