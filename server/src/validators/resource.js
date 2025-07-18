import {BaseValidator, Rule} from './base.js';
import {Resource, Project} from '../modal/index.js';

export class ResourceCreateValidator extends BaseValidator {
  constructor() {
    super();
    this.name = [
      new Rule('isLength', '请输入1-13位项目名称', {min: 1, max: 13}),
    ];
  }

  async useValidate({parentId, projectId}) {
    if (parentId) {
      const resource = await Resource.findById(parentId);
      if (!resource) {
        throw new Error('父资源不存在');
      }
    }
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('项目不存在');
    }
  }
}

export class ResourceUpdateValidator extends BaseValidator {
  constructor() {
    super();
    this._id = [
      new Rule(
          'matches',
          '参数_id有误',
          '^(?=[a-f\\d]{24}$)(\\d+[a-f]|[a-f]+\\d)',
      ),
    ];
    this.projectId = [
      new Rule(
          'matches',
          '参数projectId有误',
          '^(?=[a-f\\d]{24}$)(\\d+[a-f]|[a-f]+\\d)',
      ),
    ];
  }
}

export class UpdateDataValidator extends ResourceUpdateValidator {
  constructor() {
    super();
  }

  async useValidate({data}) {
    if (data instanceof Array) {
      if (data.length > 100) {
        throw new Error('数据量超出上限（100条）');
      }
      for (const d of data) {
        if (Object.prototype.toString.call(d).indexOf('Object]') === -1) {
          throw new Error('数据类型错误');
        }
      }
    } else {
      throw new Error('数据类型错误');
    }
  }
}

export class GenerateDataValidator extends BaseValidator {
  constructor() {
    super();
    this.count = [
      new Rule('isInt', '数据数量请选择0-100之间的整数', {min: 0, max: 100}),
    ];
  }
}
