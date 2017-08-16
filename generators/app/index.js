const Generator = require('yeoman-generator');
const path = require('path');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    // this.option('babel');
    this.props = {
      sourcePath: this.sourceRoot(),
      destinationPath: this.destinationRoot()
    };
    this.installingNpm = (name) => {
      this.npmInstall(name, {'save': true});
    };
  }
  prompting() {
    const _rootPath = this.props.destinationPath;
    return this.prompt([{
      type: 'confirm',
      name: 'pathConfirm',
      message: `是否要安装到 ${_rootPath} ?`
    },{
      type: 'confirm',
      name: 'needMsg306',
      message: `是否需要xxx npm 包？`
    }]).then((answers) => {
      Object.assign(this.props, answers);
      if (!answers.pathConfirm) {
        this.log.error('已退出');
        process.exit();
      }
    });
  }
  begin() {
    this.log(chalk.green('--我要开始变身了--'));
  }
  // 开始写入文件
  writing() {
    const pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    // 先复制整个目录
    this.fs.copy(this.templatePath(), this.destinationPath());
    // 再复制特殊文件
    this.fs.copy(this.templatePath('.eslintrc.json'), this.destinationPath('.eslintrc.json'), true);
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }
  // 安装依赖
  end() {
    if (this.props.needMsg306) {
      this.log(yosay('开始安装依赖^_^'));
      // this.installingNpm(['xxx']);
    } else {
      this.log(yosay('--变身结束--'));
    }
  }
};
