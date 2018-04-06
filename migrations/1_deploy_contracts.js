var Voting = artifacts.require("Voting");
var TransportHeadquarter = artifacts.require("TransportHeadquarter");
var TransportCenter = artifacts.require("TransportCenter");


module.exports = function(deployer, network, accounts) {
  deployer.deploy(Voting);
  deployer.deploy(TransportHeadquarter);
  deployer.deploy(TransportCenter,0);
};
