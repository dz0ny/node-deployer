var path     = require('path'),
    Deployer = require('../lib/deployer').Deployer;

Deployer.prototype._confirmSetup = function() {};

describe('new Deployer()', function() {
  it('gets its configuration from package.json', function() {
    var fixture_root = path.resolve(__dirname, 'fixtures/package_config');
    var mock_program = {};

    var deployer = new Deployer(fixture_root, mock_program);

    deployer.has_package_json.should.equal(true);

    deployer.host.should.equal('server.example.org');
    deployer.user.should.equal('deploy');
    deployer.repo.should.equal('git://example.org:example/app.git');
    deployer.path.should.equal('/var/sites');
  });

  it('gets its configuration from config/config.json', function() {
    var fixture_root = path.resolve(__dirname, 'fixtures/standalone_config');
    var mock_program = {};

    var deployer = new Deployer(fixture_root, mock_program);

    deployer.has_config_json.should.equal(true);

    deployer.host.should.equal('server.example.org');
    deployer.user.should.equal('deploy');
    deployer.repo.should.equal('git://example.org:example/app.git');
    deployer.path.should.equal('/var/sites');
  });

  it('overrides package.json configuration from config/config.json', function() {
    var fixture_root = path.resolve(__dirname, 'fixtures/override_config');
    var mock_program = {};

    var deployer = new Deployer(fixture_root, mock_program);

    deployer.has_package_json.should.equal(true);
    deployer.has_config_json.should.equal(true);

    deployer.host.should.equal('server.example.com');
    deployer.user.should.equal('deployer');
    deployer.repo.should.equal('git://example.com:example/app.git');
    deployer.path.should.equal('/var/apps');
  });

  it('overrides package.json configuration from command line arguments', function() {
    var fixture_root = path.resolve(__dirname, 'fixtures/package_config');
    var mock_program = {
      "host": "server.example.com",
      "user": "deployer",
      "repo": "git://example.com:example/app.git"
    };

    var deployer = new Deployer(fixture_root, mock_program);

    deployer.has_package_json.should.equal(true);

    deployer.host.should.equal('server.example.com');
    deployer.user.should.equal('deployer');
    deployer.repo.should.equal('git://example.com:example/app.git');
  });

  it('overrides config/config.json configuration from command line arguments', function() {
    var fixture_root = path.resolve(__dirname, 'fixtures/standalone_config');
    var mock_program = {
      "host": "server.example.com",
      "user": "deployer",
      "repo": "git://example.com:example/app.git"
    };

    var deployer = new Deployer(fixture_root, mock_program);

    deployer.has_config_json.should.equal(true);

    deployer.host.should.equal('server.example.com');
    deployer.user.should.equal('deployer');
    deployer.repo.should.equal('git://example.com:example/app.git');
  });
});