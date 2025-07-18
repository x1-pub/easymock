import {BaseValidator, Rule} from './base.js';

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

export class ProjectCreateValidator extends BaseValidator {
  constructor() {
    super();
    this.name = [
      new Rule('isLength', '请输入1-13位项目名称', {min: 1, max: 13}),
    ];
    this.themeColor = [
      new Rule('isIn', '无法识别的标记颜色', colorList),
    ];
  }

  async useValidate({apiPrefix, collaborators = []}) {
    if (apiPrefix && !/^\/[0-9a-zA-Z_\-\/]{1,}$/.test(apiPrefix)) {
      throw new Error('不合法的接口前缀');
    }
    if (!Array.isArray(collaborators)) {
      throw new Error('参数collaborators错误');
    }
    if (collaborators.length > 5) {
      throw new Error('项目成员最多五人');
    }
  }
}

export class ProjectUpdateValidator extends BaseValidator {
  constructor() {
    super();
    this._id = [
      new Rule(
          'matches',
          '参数_id有误',
          '^(?=[a-f\\d]{24}$)(\\d+[a-f]|[a-f]+\\d)',
      ),
    ];
    this.name = [
      new Rule('isLength', '请输入1-13位项目名称', {min: 1, max: 13}),
    ];
    this.themeColor = [
      new Rule('isIn', '无法识别的标记颜色', colorList),
    ];
  }
  async useValidate({apiPrefix, collaborators = []}) {
    if (apiPrefix && !/^\/[0-9a-zA-Z_\-\/]{1,}$/.test(apiPrefix)) {
      throw new Error('不合法的接口前缀');
    }
    if (!Array.isArray(collaborators)) {
      throw new Error('参数collaborators错误');
    }
    if (collaborators.length > 5) {
      throw new Error('项目成员最多五人');
    }
  }
}
