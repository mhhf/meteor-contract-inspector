Package.describe({
  name: 'napsy:contract-inspector',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  
  api.use('react');
  api.use('napsy:solidity');
  api.use('fourseven:scss');
  api.use('ethereum:web3');

  api.addFiles('abi.jsx', ['client']);
  api.addFiles('app.jsx', ['client']);
  api.addFiles('contract.jsx', ['client']);
  api.addFiles('web3.jsx', ['client']);
  api.addFiles('app.scss', ['client']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('napsy:contract-inspector');
  api.addFiles('contract-inspector-tests.js');
});
