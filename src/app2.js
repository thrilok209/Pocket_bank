// $(document).ready(function () {
var userAccount;
var userStats;
var apr = 0
var userDaiBal = 0;
var amtToLend = 0
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
  eth : {name: "ETH" , tokenAdd: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"} ,
  bat : {name: "BAT" , tokenAdd: "0x0d8775f648430679a709e98d2b0cb6250d2887ef"} ,
  dai : {name: "DAI" , tokenAdd: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359"} ,
  omg : {name: "ZRX" , tokenAdd: "0xe41d2489571d322189246dafa5ebde1f4699f498"} ,
  usdc : {name: "USDC" , tokenAdd: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"} ,

}

var pocketContractAddr = "0x14a09329d0f1273e1e99c52392729d5e1fccec25"
var cDaiAddress = "0xf5dce57282a584d2746faf1593d3121fcac444dc"
 var checkTimeInterval;

// let web3;
var web3js;



window.addEventListener('load', function() { // setup metamask

checkTimeInterval=  setInterval(()=>{
  userAccount = web3.eth.accounts[0]
    console.log(userAccount , web3.eth.accounts[0])
      if(userAccount){
        getCStats()
      }
    },1000)

    console.log(userAccount)
    console.log(web3)

    setTimeout(()=>{
      console.log('web3 init')
      web3js = new Web3(window.web3.currentProvider)
    },2000)

   var version = web3.version.api;
   console.log(version);
})

function getCStats() {
  clearInterval(checkTimeInterval)
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
        url: `https://api.compound.finance/api/v2/account?addresses[]=${userAccount}`,
        // url: `https://api.compound.finance/api/v2/account?addresses[]=${"0xb83470cd5850DE7E5943C4Decc5620D48e4Adc9f"}`,

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
          let liveEarn = apr/(100*2073600*10)*userDaiBal
          lifeTimeEarned += liveEarn
          $(".balance").text("$"+lifeTimeEarned.toFixed(8));

        },100)
      }
    })
  }

}

function approveToken(){
  let token = $('#tokenAmt').attr("dataToken")
  token = token.toLowerCase()
  var exchangeContract = window.web3.eth.contract(ERC20).at(tokenData[token].tokenAdd);

  var eth = String(10**18);
  var tokenValue =  String(1*(10**56))        // big integer, msg.value

  exchangeContract.approve("0x14a09329d0f1273e1e99c52392729d5e1fccec25",String(10*56),(err,data)=>{
    console.log(data)
    supplyToken(tokenData[token].tokenAdd,amtToLend,0)
  })
}

function openValModal(name){
  if(name == "DAI"){
    $('#exampleModal').modal('hide')
    $("#tokenValueModalTitle").text("Lend " + name)
    $('#tokenAmt').attr("placeholder", name+ "To Lend")
    $('#tokenAmt').attr("dataToken", name)
    $('#tokenValueModal').modal('show')

  }

  $("#tokenValueModalTitle").text("Lend " + name)
  $('#tokenAmt').attr("placeholder", name+ "To swap")
  $('#tokenAmt').attr("dataToken", name)
  // console.log($('#tokenAmt').attr("dataToken"))
  $('#exampleModal').modal('hide')
  $('#tokenValueModal').modal('show')
}

function checkApproval(){
  getApproval()
}
function getApproval(){
  let token = $('#tokenAmt').attr("dataToken")
  token = token.toLowerCase()
  if(token == "eth"){
    $('#tokenValueModal').modal('hide')
    return supplyToken(tokenData[token].tokenAdd,amtToLend)
    console.log("lending ETH")
  }else{

    var exchangeContract = window.web3.eth.contract(ERC20).at(tokenData[token].tokenAdd);
    exchangeContract.allowance.call(String(userAccount),"0x14a09329d0f1273e1e99c52392729d5e1fccec25", (err,data)=>
    {
      if(Number(data) == 0){
        $('#tokenValueModal').modal('hide')
        $('#approveModal').modal('show')
      }else{
        $('#tokenValueModal').modal('hide')
        supplyToken(tokenData[token].tokenAdd,amtToLend, 0)
      }

    })
  }
}

function supplyToken(tokenAddr, amount, ethVal) {
  console.log(tokenAddr, amount)
  var pocketContract = window.web3.eth.contract(pocketContractABI).at(pocketContractAddr);
  console.log(pocketContract)
    pocketContract.swapAndLend(tokenAddr,amount,{from:userAccount, value:amount},(err,data)=>{
      console.log(data)
      $('#tnxModal').modal('show')
      $('#tnxValue').text("TNX HASH: "+ data)
    })
//
//     }).then((a) => {
// }
}
// $('#tokenAmt').change(function() {
//     // $(this).val() will work here
//     console.log(this)
// });


function calDai() {
  console.log($('#tokenAmt').val())
  amtToLend = $('#tokenAmt').val()
  amtToLend = (amtToLend*(10**18))
  // $('#expectedDai').value(daiExpected)
}
