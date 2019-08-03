// $(document).ready(function () {
var userAccount;
var userStats;
var apr = 0
var userDaiBal = 0;

// //test net
// var tokenData = {
//   eth : {name: "ETH" , tokenAdd: ""} ,
//   bat : {name: "BAT" , tokenAdd: "0xDA5B056Cfb861282B4b59d29c9B395bcC238D29B"} ,
//   dai : {name: "DAI" , tokenAdd: "0x2448eE2641d78CC42D7AD76498917359D961A783"} ,
//   omg : {name: "OMG" , tokenAdd: "0x879884c3C46A24f56089f3bBbe4d5e38dB5788C0"}
//
// }
// main net
var tokenData = {
  eth : {name: "ETH" , tokenAdd: ""} ,
  bat : {name: "BAT" , tokenAdd: "0x0d8775f648430679a709e98d2b0cb6250d2887ef"} ,
  dai : {name: "DAI" , tokenAdd: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"} ,
  omg : {name: "OMG" , tokenAdd: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07"}

}

var cDaiAddress = "0xf5dce57282a584d2746faf1593d3121fcac444dc"
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
    getCStats()
    approveToken()
  }); // ['0x...']
  // console.log(web3.eth.accounts[0])
});

  // startApp()
})

function getCStats() {
  var that = this;
      $.ajax({
        url: `https://api.compound.finance/api/v2/ctoken`,
        context: document.body
      }).done(function(data) {
        data.cToken.forEach((token)=>{
          if(token.underlying_symbol == "DAI"){
            console.log(token)
            apr = Number(token.supply_rate.value)*100;

            $(".aprValue").val(apr.toFixed(2));
            getStats(userAccount)
          }
        })

      });
}
function getStats(address) {
  var that = this;
      $.ajax({
        url: `https://api.compound.finance/api/v2/account?addresses[]=${"0xb83470cd5850DE7E5943C4Decc5620D48e4Adc9f"}`,
        context: document.body
      }).done(function(data) {
        console.log(data)
        setEarnRate(data)
      });
}

function setEarnRate(data) {
  let lifeTimeEarned = 0
  if(data.accounts && data.accounts[0].tokens){
    data.accounts[0].tokens.forEach((token)=>{
      console.log(token)
      if(token.address == "0xf5dce57282a584d2746faf1593d3121fcac444dc" ){
        lifeTimeEarned = Number(token.supply_balance_underlying.value)
        let bal = Number(token.supply_balance_underlying.value) - Number(token.lifetime_supply_interest_accrued.value)
        userDaiBal = bal
        setInterval(()=>{
          let liveEarn = apr/(100*2073600*100)*userDaiBal
          console.log(liveEarn, apr ,userDaiBal)
          lifeTimeEarned += liveEarn
          $(".balance").text(lifeTimeEarned.toFixed(8));

        },10)
      }
    })
  }

}

function approveToken(){
  var exchangeContract = new web3js.eth.Contract(DaiABI, tokenData.dai.address);
  var eth = String(10**18);
  exchangeContract.options.address = tokenData.dai.address;
  var tokenValue =  String(1*(10**56))        // big integer, msg.value

  exchangeContract.methods.approve(cDaiAddress,String(10*56)).send({from:userAccount}).then(x => {

    console.log(x)
    // showStatus(("Approve TX Hash: "+String(x.blockHash)))
  });

}

function supplyToken() {
  var exchangeContract = new web3js.eth.Contract(cDai, cDaiAddress);
    // exchangeContract.methods.mint().send({
    //
    // }).then((a) => {
}
