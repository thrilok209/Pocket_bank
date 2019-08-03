// $(document).ready(function () {
var userAccount;
window.addEventListener('load', function() { // setup metamask

  let fm = new Fortmatic('pk_test_6C9E311D9924D050');
  web3js = new Web3(fm.getProvider());
  console.log(web3)
  var version = web3.version.api;
  console.log(version);
  console.log(web3js.eth.accounts);
  fm.user.login().then(() => {
  web3js.eth.getAccounts().then((data)=> {
    console.log(data)
    userAccount = data
  }); // ['0x...']
  // console.log(web3.eth.accounts[0])
});
  // startApp()
})
