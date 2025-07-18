export class UserProxyError extends Error {}

export class UserProxyNotFound extends UserProxyError {
  constructor(message = 'Not Found', code = 404) {
    super();
    this.message = message;
    this.code = code;
  }
}

export class UserProxyLimit extends UserProxyError {
  constructor(
      message = 'Data volume exceeds the limit (100 items)',
      code = 400,
  ) {
    super();
    this.message = message;
    this.code = code;
  }
}
