Package.describe({
  name: 'napsy:contract-inspector',
  version: '0.0.3',
  // Brief, one-line summary of the package.
  summary: 'This package allows you to inspect and manipulate the state of your contracts in your browser.',
  // URL to the Git repository containing the source code for this package.
  git: 'git@github.com:mhhf/meteor-contract-inspector.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  
  api.use('react@0.1.7');
  api.use('napsy:solidity@0.1.2');
  api.use('fourseven:scss@3.2.0');
  api.use('ethereum:web3@0.12.2');

  api.addFiles('abi.jsx', ['client']);
  api.addFiles('app.jsx', ['client']);
  api.addFiles('contract.jsx', ['client']);
  api.addFiles('web3.jsx', ['client']);
  api.addFiles('app.scss', ['client']);
  api.addFiles('ethereum-logo.png', ['client']);
  
  api.export('ContractInspector', ['client']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('napsy:contract-inspector');
  api.addFiles('contract-inspector-tests.js');
});
