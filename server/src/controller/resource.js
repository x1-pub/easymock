import mongoose from 'mongoose';
import {
  Project,
  Resource,
  Data,
} from '../modal/index.js';
import {
  createRes,
  listToTree,
  render,
} from '../lib/index.js';
import {
  ResourceCreateValidator,
  ResourceUpdateValidator,
  GenerateDataValidator,
  UpdateDataValidator,
} from '../validators/resource.js';

export default class ResourceCtl {
  /**
   * 查询项目下的资源
   * @param {Object} ctx
   */
  static async tree(ctx) {
    const {projectId} = ctx.request.params;

    const project = await Project.findById(projectId);
    const resources = await Resource.find({
      projectId,
    });

    const tree = listToTree(JSON.parse(JSON.stringify(resources)));
    const data = {
      projectId,
      name: project.name,
      apiPrefix: project.apiPrefix,
      resources: tree,
    };

    ctx.body = createRes.success(data);
  }

  /**
   * 创建资源
   * @param {Object} ctx
   */
  static async create(ctx) {
    const {
      projectId,
      parentId,
      name,
      generator,
      schemas,
      endpoints,
    } = await new ResourceCreateValidator().v(ctx);

    const dataId = new mongoose.Types.ObjectId();

    const resource = await new Resource({
      projectId,
      parentId,
      name,
      generator,
      schemas,
      endpoints,
      dataId,
    }).save();

    new Data({_id: dataId, data: []}).save();

    ctx.body = createRes.success(resource);
  }

  /**
   * 生成数据
   * @param {Object} ctx
   */
  static async generateData(ctx) {
    const {
      _id,
      projectId,
      count,
    } = await new GenerateDataValidator().v(ctx);

    // 资源
    const resource = await Resource.findOne({
      _id,
      projectId,
    });

    // 生成data
    let preData = render(
        resource.schemas,
        resource.generator,
        count,
        ['Parent ID'],
    );

    // 添加pid
    if (resource.parentId) {
      const {name: resourceParentIdName} = resource.schemas.find(
          (field) => field.type === 'Parent ID',
      );

      const parentResource = await Resource.findById(resource.parentId);
      const parentData = await Data.findById(parentResource.dataId);
      const parentDataLen = parentData.data.length;

      if (!parentDataLen) {
        ctx.body = createRes.error('请先向其父资源添加数据');
        return;
      }

      const {name: parentResourceIdName} = parentResource.schemas.find(
          (field) => field.type === 'Object ID',
      );

      preData = preData.map((d, index) => {
        const pIdx = index % parentDataLen;
        return {
          ...d,
          [resourceParentIdName]: parentData.data[pIdx][parentResourceIdName],
        };
      });
    }

    // 删除自身的data和子资源的data
    const childrenResource = await Resource.find({parentId: _id});
    const childrenIds = childrenResource.map((r) => r._id);
    if (childrenIds.length > 0) {
      const grandsonResources = await Resource.find({
        parentId: {$in: childrenIds},
      });
      const deleteIds =[
        ...grandsonResources,
        ...childrenResource,
      ].map((r) => r.dataId);
      if (deleteIds.length > 0) {
        await Data.updateMany({_id: {$in: deleteIds}}, {data: []});
      }
    }

    // 保存
    await Data.updateOne({_id: resource.dataId}, {data: preData});

    ctx.body = createRes.success();
  }

  /**
   * 更新数据
   * @param {Object} ctx
   */
  static async updateData(ctx) {
    const {_id, projectId, data} = await new UpdateDataValidator().v(ctx);
    const resource = await Resource.findOne({_id, projectId});
    await Data.updateOne({_id: resource.dataId}, {data});
    ctx.body = createRes.success();
  }

  /**
   * 获取数据
   * @param {Object} ctx
   */
  static async getData(ctx) {
    const {_id, projectId} = ctx.request.params;
    const resource = await Resource.findOne({_id, projectId});
    const data = await Data.findById(resource.dataId);
    ctx.body = createRes.success(data?.data);
  }

  /**
   * 删除资源
   * @param {Object} ctx
   */
  static async delete(ctx) {
    const {projectId, _id} = ctx.request.params;

    const delResIds = [_id];
    const resource = await Resource.findOne({projectId, _id});
    const delDataIds = [resource.dataId];
    const son = await Resource.find({projectId, parentId: _id});
    if (son.length) {
      const sonIds = [];
      son.forEach((res) => {
        sonIds.push(res._id);
        delResIds.push(res._id);
        delDataIds.push(res.dataId);
      });
      const grandson = await Resource.find({
        projectId,
        parentId: {$in: sonIds},
      });
      if (grandson.length) {
        grandson.forEach((res) => {
          delResIds.push(res._id);
          delDataIds.push(res.dataId);
        });
      }
    }

    await Resource.deleteMany({_id: {$in: delResIds}});
    await Data.deleteMany({_id: {$in: delDataIds}});

    ctx.body = createRes.success();
  }

  /**
   * 更新资源
   * @param {Object} ctx
   */
  static async update(ctx) {
    const {
      _id,
      schemas,
      generator,
      endpoints,
      projectId,
    } = await new ResourceUpdateValidator().v(ctx);

    // 更新资源
    const resource = await Resource.findOneAndUpdate(
        {_id, projectId},
        {schemas, generator, endpoints},
    );

    const preData = render(
        schemas,
        generator,
        resource.dataCount,
        ['Object ID', 'Parent ID'],
    );

    // 查找原始数据
    const {data} = await Data.findById(resource.dataId);

    // 老的id pid复制到新的数据
    const {name: newIdName} = schemas.find((s) => s.type === 'Object ID');
    const {name: oldIdName} = resource.schemas.find(
        (s) => s.type === 'Object ID',
    );
    const newPidSchema = schemas.find((s) => s.type === 'Parent ID');
    if (newPidSchema) {
      const {name: oldPIdName} = resource.schemas.find(
          (s) => s.type === 'Parent ID',
      );
      preData.forEach((pd, index) => {
        pd[newIdName] = data[index][oldIdName];
        pd[newPidSchema.name] = data[index][oldPIdName];
      });
    } else {
      preData.forEach((pd, index) => {
        pd[newIdName] = data[index][oldIdName];
      });
    }

    await Data.updateOne({_id: resource.dataId}, {data: preData});

    ctx.body = createRes.success();
  }
}
