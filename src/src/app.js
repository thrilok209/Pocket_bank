  //
  // var factoryContract;
  // var userAccount;
  // var factoryABI = [{"name": "NewExchange", "inputs": [{"type": "address", "name": "token", "indexed": true}, {"type": "address", "name": "exchange", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "initializeFactory", "outputs": [], "inputs": [{"type": "address", "name": "template"}], "constant": false, "payable": false, "type": "function", "gas": 35725}, {"name": "createExchange", "outputs": [{"type": "address", "name": "out"}], "inputs": [{"type": "address", "name": "token"}], "constant": false, "payable": false, "type": "function", "gas": 187911}, {"name": "getExchange", "outputs": [{"type": "address", "name": "out"}], "inputs": [{"type": "address", "name": "token"}], "constant": true, "payable": false, "type": "function", "gas": 715}, {"name": "getToken", "outputs": [{"type": "address", "name": "out"}], "inputs": [{"type": "address", "name": "exchange"}], "constant": true, "payable": false, "type": "function", "gas": 745}, {"name": "getTokenWithId", "outputs": [{"type": "address", "name": "out"}], "inputs": [{"type": "uint256", "name": "token_id"}], "constant": true, "payable": false, "type": "function", "gas": 736}, {"name": "exchangeTemplate", "outputs": [{"type": "address", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 633}, {"name": "tokenCount", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 663}];
  //
  //
  // function startApp() {
  //   var factoryAddress = "0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36";
  //   factoryContract = new web3js.eth.Contract(factoryABI, factoryAddress);
  //
  //   var accountInterval = setInterval(function() {
  //     // Check if account has changed
  //     if (web3.eth.accounts[0] !== userAccount) {
  //       userAccount = web3.eth.accounts[0];
  //       console.log(userAccount)
  //       // Call a function to update the UI with the new account
  //       // getZombiesByOwner(userAccount)
  //       // .then(displayZombies);
  //     }
  //   }, 100);
  //
  //
  //
  //
  //   // Start here
  // }
  //
  // function test() {
  //   console.log(factoryContract.methods);
  // }
  //
  // function displayZombies(ids) {
  //   $("#zombies").empty();
  //   for (id of ids) {
  //     // Look up zombie details from our contract. Returns a `zombie` object
  //     getZombieDetails(id)
  //     .then(function(zombie) {
  //       // Using ES6's "template literals" to inject variables into the HTML.
  //       // Append each one to our #zombies div
  //       $("#zombies").append(`<div class="zombie">
  //         <ul>
  //           <li>Name: ${zombie.name}</li>
  //           <li>DNA: ${zombie.dna}</li>
  //           <li>Level: ${zombie.level}</li>
  //           <li>Wins: ${zombie.winCount}</li>
  //           <li>Losses: ${zombie.lossCount}</li>
  //           <li>Ready Time: ${zombie.readyTime}</li>
  //         </ul>
  //       </div>`);
  //     });
  //   }
  // }
  //
  // function createRandomZombie(name) {
  //   // This is going to take a while, so update the UI to let the user know
  //   // the transaction has been sent
  //   $("#txStatus").text("Creating new zombie on the blockchain. This may take a while...");
  //   // Send the tx to our contract:
  //   return uniSwap.methods.createRandomZombie(name)
  //   .send({ from: userAccount })
  //   .on("receipt", function(receipt) {
  //     $("#txStatus").text("Successfully created " + name + "!");
  //     // Transaction was accepted into the blockchain, let's redraw the UI
  //     getZombiesByOwner(userAccount).then(displayZombies);
  //   })
  //   .on("error", function(error) {
  //     // Do something to alert the user their transaction has failed
  //     $("#txStatus").text(error);
  //   });
  // }
  //
  // function feedOnKitty(zombieId, kittyId) {
  //   $("#txStatus").text("Eating a kitty. This may take a while...");
  //   return uniSwap.methods.feedOnKitty(zombieId, kittyId)
  //   .send({ from: userAccount })
  //   .on("receipt", function(receipt) {
  //     $("#txStatus").text("Ate a kitty and spawned a new Zombie!");
  //     getZombiesByOwner(userAccount).then(displayZombies);
  //   })
  //   .on("error", function(error) {
  //     $("#txStatus").text(error);
  //   });
  // }
  //
  // function levelUp(zombieId) {
  //   $("#txStatus").text("Leveling up your zombie...");
  //   return uniSwap.methods.levelUp(zombieId)
  //   .send({ from: userAccount, value: web3.utils.toWei("0.001", "ether") })
  //   .on("receipt", function(receipt) {
  //     $("#txStatus").text("Power overwhelming! Zombie successfully leveled up");
  //   })
  //   .on("error", function(error) {
  //     $("#txStatus").text(error);
  //   });
  // }
  //
  // function getZombieDetails(id) {
  //   return uniSwap.methods.zombies(id).call()
  // }
  //
  // function zombieToOwner(id) {
  //   return uniSwap.methods.zombieToOwner(id).call()
  // }
  //
  // function getZombiesByOwner(owner) {
  //   return uniSwap.methods.getZombiesByOwner(owner).call()
  // }
  //
  // window.addEventListener('load', function() {
  //
  //   if (typeof web3 !== 'undefined') {
  //
  //     web3js = new Web3(web3.currentProvider);
  //     console.log("connected to metamask")
  //
  //   } else {
  //     web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  //     console.log("connected to localhost")
  //   }
  //   var version = web3.version.api;
  //   console.log(version);
  //   // console.log(web3);
  //
  //
  //
  //   startApp()
  //
  // })
