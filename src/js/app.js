App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  // Instance Web3
  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      // Only useful in a development environment
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  // Instance contract
  initContract: function() {
    $.getJSON('Voting.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      App.contracts.Voting = TruffleContract(data);
      // Set the provider for our contract
      App.contracts.Voting.setProvider(App.web3Provider);
      // Use our contract to retrieve value data
      App.getProposals();
    });
    $.getJSON('TransportHeadquarter.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      App.contracts.TransportHeadquarter = TruffleContract(data);
      // Set the provider for our contract
      App.contracts.TransportHeadquarter.setProvider(App.web3Provider);
      // Use our contract to retrieve value data
    });
    $.getJSON('TransportCenter.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      App.contracts.TransportCenter = TruffleContract(data);
      // Set the provider for our contract
      App.contracts.TransportCenter.setProvider(App.web3Provider);
      // Use our contract to retrieve value data
    });
    return App.bindEvents();
  },

  bindEvents: function() {

    $(document).on('click', '.btn-value', function(e){
      var $this = $(this);
      $this.button('loading');
      App.handleAddProposal(e);
    });

  },
    deployCenters: function(howmany) {
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.TransportHeadquarter.deployed().then(function(instance) {
      console.log("yeast of thoughts and minds");
      headquarterInstance = instance;
      headquarterInstance.mintTransportCenter(10, {from: account});
      });
    });
  },
  getProposals: function() {
    var proposalsInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Voting.deployed().then(function(instance) {
        proposalsInstance = instance;
        proposalsInstance.getNumProposals.call().then(function(numProposals) {
          var wrapperProposals = $('#wrapperProposals');
          wrapperProposals.empty();
          var proposalTemplate = $('#proposalTemplate');
          for (var i=0; i<numProposals; i++) {
            proposalsInstance.getProposal.call(i).then(function(data) {
              var idx = data[0];
              proposalTemplate.find('.panel-title').text(data[1]);
              proposalTemplate.find('.numVotesPos').text(data[2]);
              proposalTemplate.find('.numVotesNeg').text(data[3]);
              proposalTemplate.find('.numVotesAbs').text(data[4]);
              proposalTemplate.find('.btn-vote').attr('data-proposal', idx);
              proposalTemplate.find('.btn-vote').attr('disabled', false);
              for (j=0; j<data[5].length; j++) {
                if (data[5][j] == account) {
                  proposalTemplate.find('.btn-vote').attr('disabled', true);
                }
              }
              wrapperProposals.append(proposalTemplate.html());
            }).catch(function(err) {
              console.log(err.message);
            });
          }
        }).catch(function(err) {
          console.log(err.message);
        });
      });
    });
    $('button').button('reset');
  },

  handleAddProposal: function(event) {
    event.preventDefault();
    var proposalInstance;
    var headquarterInstance;
    var value = $('.input-value').val();
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.TransportHeadquarter.deployed().then(function(instance) {
      console.log("I am the yeast of thoughts and minds");
      console.log(instance.address);
      console.log(account);
      headquarterInstance = instance;
      headquarterInstance.mintTransportCenter(10, {from: account}).then(function(result) {
      console.log(result);
      });
      });
      
      App.contracts.Voting.deployed().then(function(instance) {
      	proposalInstance = instance;
        return proposalInstance.addProposal(value, {from: account});
      }).then(function(result) {
        var event = proposalInstance.CreatedProposalEvent();
        App.handleEvent(event);
        $('.input-value').val(''); // clean input
      }).catch(function(err) {
        console.log(err.message);
        $('button').button('reset');
      });
    });
  },


  handleEvent: function(event) {
    console.log('Waiting for a event...');
    event.watch(function(error, result) {
      if (!error) {
        App.getProposals();
      } else {
        console.log(error);
      }
      event.stopWatching();
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
