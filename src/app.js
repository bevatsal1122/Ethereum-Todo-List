App = {
    contracts: {},

    load: async() => {
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.render();
    },
   
    loadWeb3: async() => {
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider
          web3 = new Web3(web3.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum);
          try {
              // Request account access if needed
              await ethereum.enable();
              // Acccounts now exposed
              web3.eth.sendTransaction({/* ... */});
          } catch (error) {
              // User denied account access...
          }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
          window.web3 = new Web3(web3.currentProvider);
          // Acccounts always exposed
          web3.eth.sendTransaction({/* ... */});
      }
      // Non-dapp browsers...
      else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    },

    loadAccount: async() => {
        App.account = web3.eth.accounts.givenProvider.selectedAddress;
        console.log(App.account);
    },

    loadContract: async() => {
      const todoList = await $.getJSON('TodoList.json');
      // console.log(todoList);
      App.contracts.TodoList = TruffleContract(todoList);
      // App.contracts.TodoList.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
      App.contracts.TodoList.setProvider(App.web3Provider);

      App.todoList = await App.contracts.TodoList.deployed();
      // console.log(App.todoList);
    },

    render: async() => {
      // Render Account
      $("#account").html(App.account);
    }

}

$(() => {
    $(window).load(() => {
      App.load();
    })  
})
