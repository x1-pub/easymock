import validator from 'validator';

export class Rule {
  constructor(name, msg, params) {
    Object.assign(this, {
      name,
      msg,
      params,
    });
  }

  validate(val) {
    let errMsg = '';
    if (!validator[this.name](val, this.params)) {
      errMsg = this.msg;
    }
    return errMsg;
  }
}

export class BaseValidator {
  constructor() {
    // console.log(Reflect.ownKeys(this));
  }
  async v(ctx) {
    const {query, body, params} = ctx.request;
    const vals = {
      ...query,
      ...body,
      ...params,
    };
    // 验证rules
    const fields = Reflect.ownKeys(this);
    for (const field of fields) {
      const rules = this[field];
      for (const rule of rules) {
        const errMsg = rule.validate(String(vals[field]));
        if (errMsg) {
          throw new Error(errMsg);
        }
      }
    }
    // 执行自定义验证
    if (this.useValidate) {
      await this.useValidate(vals);
    }

    return vals;
  }
}
