var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }

  async initPackage() {
    let answer = await this.prompt([
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
      "author": "",
      "license": "ISC",
      "files": [
        "app"
      ],
      "scripts": {
        "dev": "webpack-dev-server",
        "build": "webpack",
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "devDependencies": {
      },
      "dependencies": {
      }
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    this.npmInstall(['vue'], { 'save-dev': false });   // 安装最新版本的vue
    this.npmInstall(['webpack', 'webpack-cli', 'vue-loader', 'vue-style-loader', 'css-loader', 'vue-template-compiler', 'copy-webpack-plugin'], { 'save-dev': true });
  }

  copyFiles() {
    this.fs.copyTpl(
      this.templatePath('HelloWorld.vue'),
      this.destinationPath('src/HelloWorld.vue'),
    );
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js'),
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      {title: 'vue demo'}
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
    )
  }
};