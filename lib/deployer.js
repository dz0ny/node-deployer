var control  = require('control');

var Deployer = exports.Deployer = function(root, program) {
  this._parseConfiguration(root);
  this._parseCommandArguments(program);
  this._confirmSetup();
};

Deployer.prototype._parseConfiguration = function(root) {
  try {
    var package_file = fs.readFileSync(root +'/package.json', 'utf8');
    var package_config = JSON.parse(package_file);

    this.host = package_config.deployment.host;
    this.user = package_config.deployment.user;
    this.repo = package_config.repository.url;
  } catch(err) {}

  try {
    var config_file = fs.readFileSync(root +'/package.json', 'utf8');
    var config = JSON.parse(config_file);

    this.host = config.deployment.host;
    this.user = config.deployment.user;
    this.repo = config.deployment.repo;
  } catch(err) {}
};

Deployer.prototype._parseCommandArguments = function(program) {
  if (program.host != undefined) { this.host = program.host }
  if (program.user != undefined) { this.user = program.user }
  if (program.repo != undefined) { this.repo = program.repo }
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

  if (!setupConfirmed) { process.exit() }
};