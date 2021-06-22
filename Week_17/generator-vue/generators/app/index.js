var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }

  async initPackage() {
    let answer = this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
      },
    ]);
    const pkgJson = {
      "name": answer.name,
      "version": "1.0.0",
      "description": "",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "author": "",
      "license": "ISC",
      "files": [
        "app"
      ],
      "devDependencies": {
      },
      "dependencies": {
      }
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    this.npmInstall(['vue'], { 'save-dev': false });   // 安装最新版本的vue
    this.npmInstall(['webpack', 'vue-loader'], { 'save-dev': true });
  }
};