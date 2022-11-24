App = {
    loading: false,
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
        // App.account = web3.eth.accounts.givenProvider.selectedAddress;
        const accounts = await web3.eth.getAccounts();
        App.account = accounts[0];
        // console.log(App.account);
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
      // Prevent mutiple times rendering
      if (App.loading) {
        return
      }

      // Update App loading state
      App.setLoading(true);

      // Render Account
      $("#account").html(App.account);

      // Render all tasks
      await App.renderTasks();

      // Update App loading state
      App.setLoading(false);
    },

    renderTasks: async() => {
      // Load total taskCount
      const taskCount = await App.todoList.taskCount();
      const $taskTemplate = $(".taskTemplate");
      // console.log(taskCount);

      // Render each task with new task template
      for (var i=1; i<=taskCount; ++i) {
        // Fetching task data
        const task = await App.todoList.tasks(i);
        const taskID = task[0].toNumber();
        const taskContent = task[1];
        const taskCompleted = task[2];

        const $newTaskTemplate = $taskTemplate.clone()
        $newTaskTemplate.find(".content").html(taskContent);
        $newTaskTemplate.find("input")
                        .prop("name", taskID)
                        .prop("checked", taskCompleted)
                        // .on("click", App.toggleCompleted)

        // Display task in correct order
        if (taskCompleted) {
          $("#completedTaskList").append($newTaskTemplate);
        } else {
          $("#taskList").append($newTaskTemplate);
        }
        $newTaskTemplate.show();
      }
    },

    createTask: async() => {
      App.setLoading(true);
      const content = $("#newTask").val();
      await App.todoList.createTask(content, {from: App.account});
      window.location.reload();
    },

    setLoading: async(boolean) => {
      App.loading = boolean;
      const loader = $("#loader");
      const content = $("#content");
      if (boolean) {
        loader.show();
        content.hide();
      } else {
        loader.hide();
        content.show();
      }
    }

}

$(() => {
    $(window).load(() => {
      App.load();
    })  
})
