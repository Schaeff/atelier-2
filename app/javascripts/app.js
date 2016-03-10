var accounts;
var accountID = 0
var balance;

function displayAccounts() {
    var dem = Democracy.deployed()

    Promise.map(accounts,
      function(index) {
        return dem.members(index)
      }).then(function(results) {
        document.getElementById("addresses").innerHTML = 
        accounts
        .map((x, i) => ('<button onclick="setChangeAccount(' + i + ')">' + i + '</button>' + ' : ' + x + ' is member : ' + results[i]) + (i == accountID ? '     <------ you are this guy' : ''))
        .join('<br>')
  })
};

function setChangeAccount(newAccount) {
  accountID = newAccount;
  account = accounts[accountID];
  displayAccounts();
  selfCanVote();

}

function selfCanVote() {
  Democracy.deployed().members(account).then(function(isAllowedToVote) {
    console.log(isAllowedToVote)
    var message = isAllowedToVote ? "You are allowed to vote" : "You are not allowed to vote"
    document.getElementById("selfCanVote").innerHTML = message
  }) 
}

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function refreshProposals() {
  var dem = Democracy.deployed();

  dem.nbProposals().then(function(nbProposals) {
    var array = _.range(nbProposals)
    Promise.map(array,
      function(index) {
        return dem.proposals(index)
      }).then(function(results) {
        document.getElementById("proposals").innerHTML = 
        results
        .map((x,i) => (i + ":" + x))
        .join('<br>');
      })
  })
};

function setVotingTime() {
  var dem = Democracy.deployed();

  var newVotingTime = document.getElementById('newVotingTimeField').value;
  dem.setVotingTime(newVotingTime, {from: account}).then(function(res, truc) {
    console.log(res)
    console.log("Voting time changed")
  })
  console.log("Changing voting time")
}

function newMember() {
  var dem = Democracy.deployed();

  var newMemberHash = document.getElementById('newMemberField').value;
  dem.addMember(newMemberHash, {from: account}).then(function(res, truc) {
    console.log(res)
    console.log("Member added")
  })
  console.log("Adding member")
}

function vote() {
  var dem = Democracy.deployed();

  var proposalId = document.getElementById('proposalIdField').value;
  var voteChoice = document.getElementById('voteField').value == 0 ? false : true;
  dem.vote(proposalId, voteChoice, {from: account}).then(function(res) {
    console.log(res)
  })
}

function executeProposal() {
  var dem = Democracy.deployed();

  var proposalId = document.getElementById('executeProposalIdField').value;
  dem.executeProposal(proposalId, {from: web3.eth.coinbase}).then(function(res) {
    console.log(res)
  })
}


window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[accountID];

    displayAccounts();
    selfCanVote();

    refreshProposals();
  });
}
