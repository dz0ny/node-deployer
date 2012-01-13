var control = require('control');

var Deployer = exports.Deployer = function(root, program) {
  this._parseConfiguration(root);
  this._parseCommandArguments(program);
  this._setupCallbacks(root);
  this._setupController();
  this._confirmSetup();
};

Deployer.prototype._parseConfiguration = function(root) {
  try {
    var package_file = fs.readFileSync(root +'/package.json', 'utf8');
    var config = JSON.parse(package_file);

    this.has_package_json = true;
  } catch(err) {}

  try {
    var config_file = fs.readFileSync(root +'/config/config.json', 'utf8');
    var config = JSON.parse(config_file);

    this.config_json = config;

    this.has_config_json = true
  } catch(err) {}

  this.host = config.deployment.host;
  this.user = config.deployment.user;
  this.repo = config.deployment.repo;
  this.path = config.deployment.path;
};

Deployer.prototype._parseCommandArguments = function(program) {
  if (program.host != undefined) { this.host = program.host }
  if (program.user != undefined) { this.user = program.user }
  if (program.repo != undefined) { this.repo = program.repo }
};

Deployer.prototype._setupCallbacks = function(root) {
  try {
    this.callbacks = require(root + '/config/deployer.js');
  } catch(err) {
    this.callbacks = {};
  }
};

Deployer.prototype._setupController = function() {
  this.controller = Object.create(control.controller);
  this.controller.user = this.user;
  this.controller.address = this.host;
};

Deployer.prototype._confirmSetup = function() {
  var setupConfirmed = true;

  if (this.host == undefined || this.host == '') {
    console.log('You must supply a deployment host in your configuration or via th -H option.');
    setupConfirmed = false;
  }

  if (this.user == undefined || this.user == '') {
    console.log('You must supply a deployment user in your configuration or via th -U option.');
    setupConfirmed = false;
  }

  if (this.repo == undefined || this.repo == '') {
    console.log('You must supply a deployment repo in your configuration or via th -R option.');
    setupConfirmed = false;
  }

  if (this.path == undefined || this.path == '') {
    console.log('You must supply a deployment path in your configuration.');
    setupConfirmed = false;
  }

  if (!setupConfirmed) { process.exit() }
};

Deployer.prototype._installDependencies = function() {
  if (this.has_package_json) { controller.ssh('npm install') }

  if (this.has_config_json && this.config_json.dependencies != undefined) {
    var dependencies = this.config_json.dependencies;

    for (key in dependencies) {
      var version = '';

      if (dependencies[key] != null || dependencies[key] != '' || dependencies[key] != undefined) {
        version = '@'+ dependencies[key];
      }

      controller.ssh('npm install '+ key + version);
    }
  }
};

Deployer.prototype.deploy = function() {
  var repo = this.repo;
  var path = this.path;
  var controller = this.controller;
  var callbacks = this.callbacks;

  try { callbacks.beforeDeploy(this); }

  try { callbacks.beforeClone(this); }
  controller.ssh('git clone '+ repo +' '+ path);
  controller.ssh('cd '+ path);
  try { callbacks.afterClone(this); }

  try { callbacks.beforeNPM(this); }
  this._installDependencies();
  try { callbacks.afterNPM(this); }

  try { callbacks.beforeRestart(this); }
  try { callbacks.onRestart(this); }
  try { callbacks.afterRestart(this); }

  try { callbacks.afterDeploy(this); }
};