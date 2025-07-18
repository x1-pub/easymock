module.exports = {
  extends: [
    "google",
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    "require-jsdoc": "off",
    "valid-jsdoc": "off",
    "max-len": [
      "error",
      { 
        "code": 120,
        "ignoreUrls": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true,
        "ignoreRegExpLiterals": true,
      }
    ]
  },
};