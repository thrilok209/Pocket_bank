// $(document).ready(function () {
var userAccount;
window.addEventListener('load', function() { // setup metamask

  if (typeof web3 !== 'undefined') {

    web3js = new Web3(web3.currentProvider);
    console.log("connected to metamask")

  } else {
    web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    console.log("connected to localhost")
  }

  var accountInterval = setInterval(function() {
    web3js.eth.getAccounts().then(x =>
      {
        if (String(x) != String(userAccount)) {
          console.log("checking userAccount")
          userAccount = String(x)
          $("#Address .badge").text(userAccount)
        }
      });
            }, 100);
            // web3js.eth.getAccounts().then(x => userAccount=x);
  var version = web3.version.api;
  console.log(version);
  startApp()
})

var factoryContract;
var exchangeContract;
var exchangeInAdd;
var exchangeOutAdd;
// var userAccount;

const owner = "0xf4B9aaae3AB39325D12EA62fCcD3c05266e07e21";
var to_Address = "0xf4B9aaae3AB39325D12EA62fCcD3c05266e07e21"
// var main_dai = "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359"
var test_dai = "0x2448eE2641d78CC42D7AD76498917359D961A783";
var main_dai = "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359";
var test_bat = "0xDA5B056Cfb861282B4b59d29c9B395bcC238D29B";
//test net
var tokenData = {
  eth : {name: "ETH" , tokenAdd: ""} ,
  bat : {name: "BAT" , tokenAdd: "0xDA5B056Cfb861282B4b59d29c9B395bcC238D29B"} ,
  dai : {name: "DAI" , tokenAdd: "0x2448eE2641d78CC42D7AD76498917359D961A783"} ,
  omg : {name: "OMG" , tokenAdd: "0x879884c3C46A24f56089f3bBbe4d5e38dB5788C0"}

}
// main net
// var tokenData = {
//   eth : {name: "ETH" , tokenAdd: ""} ,
//   bat : {name: "BAT" , tokenAdd: "0x0d8775f648430679a709e98d2b0cb6250d2887ef"} ,
//   dai : {name: "DAI" , tokenAdd: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"} ,
//   omg : {name: "OMG" , tokenAdd: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07"}
//
// }


var inputToken;
var outputToken;
var inputPrice;
var outputPrice;
var inDecimal;
var outDecimal;
var eth_to_token_price;
var token_to_eth_price;
var token_to_token_price;
var tokenProtocol;


var max_number = 10**56;
var min_number = 1;


var isInput=false;
var isOutput=false;
var isInputPrice=false;
var isOutputPrice=false;
var isTokenAllowed = false;
var isToAddress = false;
var swapMode = true;
function startApp() { // connect to uniSwap factoryContract
  var  main_factoryAddress = "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95";

  // Rinkeby Testnet
  var test_factoryAddress = "0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36";
  factoryContract = new web3js.eth.Contract(factoryABI, test_factoryAddress);
}


function getExchangeContract(_tokenAdd , _type) { // connect to uniSwap exchangeContract
  exchangeAddress = factoryContract.methods.getExchange(_tokenAdd).call().then(c => {
    // console.log(c);
    console.log("getting Exchange Address")
    if(_type == "out"){
      exchangeOutAdd = c;
      getPrice( 10**18 ,  outputToken["tokenAdd"] , "out" )
    } else {
      exchangeInAdd = c;
      getPrice( 10**18 ,  inputToken["tokenAdd"] , "in" )
    }
    // $("#status").text("");

    if(tokenProtocol != "ETH_TO_TOKEN"){
      allowanceToken();
    }else{
      showStatus("Enter The Input Amount.")
      $("#loading").hide()

    }
  })
}

function getTotalSupply(){
  var exchangeContract = new web3js.eth.Contract(exchangeABI, exchangeOutAdd);
  exchangeContract.methods.totalSupply().call().then((a) => {
    console.log(a)
    $("#totalSupply").text("Total Supply of Token : " + a);
  });

}

function getTokenDecimal(_Protocol){
  if(_Protocol == "ETH_TO_TOKEN"){
    var exchangeContract = new web3js.eth.Contract(exchangeABI, exchangeOutAdd);
    exchangeContract.methods.decimals().call().then((a) => {
      console.log(a)
      $("#totalSupply").text("Total Supply of Token : " + a);
      outDecimal = a;
      return outDecimal;
    });
  }
}

function getPrice(_val, _tokenAdd, _type) { // get the price of conversation
  console.log("getting Price")
  if(_type == "out"){
    var exchangeContract = new web3js.eth.Contract(exchangeABI, exchangeOutAdd);
    var eth = String(10**18);
    exchangeContract.methods.getEthToTokenInputPrice(eth).call().then((x) => {
      console.log("price of token_eth: "+String(x));
      eth_to_token_price = x;
      if(tokenProtocol != "TOKEN_TO_TOKEN" ){
        $("#priceConv").text("Exchange Price from ether to token : " + String(x/(10**18)));
      }
      if(tokenProtocol == "TOKEN_TO_TOKEN" ){
        $("#priceConv").text("Exchange Price from token to token : " + String((eth_to_token_price/token_to_eth_price)));
        console.log("token to token price(eth to token)")
      }
    })
  }
  if(_type == "in"){
    var exchangeContract = new web3js.eth.Contract(exchangeABI, exchangeInAdd);
    var token = String(10**18);
    exchangeContract.methods.getTokenToEthInputPrice(token).call().then((x) => {
      console.log("price of eth_token: "+String(x));
      token_to_eth_price = x;
      if(tokenProtocol != "TOKEN_TO_TOKEN" ){
        $("#priceConv").text("Exchange Price from token to ether : " + String(x/(10**18)));
      }
      if(tokenProtocol == "TOKEN_TO_TOKEN" ){
        $("#priceConv").text("Exchange Price from token to token : " + String((eth_to_token_price/token_to_eth_price)));
        console.log("token to token price (token to eth)")
      }
    })
  }



}
$(document).ready(function () {
  showStatus("Select The Input Token")
  $("#unlockBtn").hide();
  $("#loading").hide()
  $('#transBtn').prop('disabled', true);
   $('#swapBtn').prop('disabled', true);



  Object.entries(tokenData).forEach(
    ([key, value]) =>{
      $('#sel_input').append(`<option value="${key}" >${value.name}</option>`);
      $('#sel_output').append(`<option value="${key}" >${value.name}</option>`);
    });


    // Initialize Select2
    $('#sel_output').select2();
    $('#sel_input').select2();

    // Set option selected onchange
    $('#sel_output').change(function(){
      $("#inputToken").val(0)
      $("#outputToken").val(0)
      var value = $(this).val();
      // console.log(value)
      outputToken = tokenData[value];
      if(outputToken.name ==  inputToken.name ){
        alert("cant be same token")
        $('#sel_output').val("");
         $('#sel_output').select2().trigger('change');
         return false
      }
      checkTokenTransferProtocol();


    });

    $('#sel_input').change(function(){
      $("#inputToken").val(0)
      $("#outputToken").val(0)
      var value = $(this).val();
      // console.log("input token data: "+tokenData[value])
      inputToken = tokenData[value];
      showStatus("Select The Output Token")
      // $("#status").text();

      // console.log(inputToken["name"])
      if(outputToken != undefined){
        checkTokenTransferProtocol();

      }
      // if(outputToken.name == "ETH" && inputToken.name == "ETH"){
      //   // tokenProtocol = "ETH_TO_TOKEN";
      //   $('#sel_output').val();
      //   $('#sel_output').select2().trigger('change');
      // }
    });

    $("#inputToken").on('input',function() {
      inputPrice = $("#inputToken").val();
      getConversionPrice(inputPrice ,  tokenProtocol);

    })

    $("#toAddress").on('input',function() {
      to_Address = $("#toAddress").val();
      if(to_Address!=""){
        $('#transBtn').prop('disabled', false);
        $('#swapBtn').prop('disabled', true);
        isToAddress = true;
      }else{
        $('#transBtn').prop('disabled', true);
        $('#swapBtn').prop('disabled', false);
        isToAddress = false;

      }

      console.log("to :" , to_Address);
    })
  });


  function checkTokenTransferProtocol() {
    // $("#status").text("Fetching Our Data");
    showStatus("Fetching Our Data.....")
    $("#loading").show()

    if(outputToken["name"] != "ETH" && inputToken["name"] == "ETH"){
      tokenProtocol = "ETH_TO_TOKEN";
      // $("#unlockBtn").hide();
      getExchangeContract(outputToken["tokenAdd"] , "out")
    }
    if(outputToken["name"] == "ETH" && inputToken["name"] != "ETH"){
      tokenProtocol = "TOKEN_TO_ETH";
      // $("#unlockBtn").show();

      getExchangeContract(inputToken["tokenAdd"] , "in")
    }
    if(outputToken["name"] != "ETH" && inputToken["name"] != "ETH"){
      tokenProtocol = "TOKEN_TO_TOKEN";
      // $("#unlockBtn").show();

      getExchangeContract(outputToken["tokenAdd"] , "out")
      getExchangeContract(inputToken["tokenAdd"] , "in")
      $("#priceConv").text("Exchange Price from token to token : " + String((eth_to_token_price/token_to_eth_price)));
    }
    console.log(tokenProtocol)
  }

  function getConversionPrice(_val , _Protocol){
    if(_Protocol == "ETH_TO_TOKEN"){
      outputPrice = eth_to_token_price*_val/(10**18);
      console.log(tokenProtocol+" : "+outputPrice)
      $("#outputToken").val(outputPrice);
    }
    if(_Protocol == "TOKEN_TO_ETH"){
      outputPrice = token_to_eth_price*_val/(10**18);
      console.log(tokenProtocol+" : "+outputPrice)
      $("#outputToken").val(outputPrice);
    }
    if(_Protocol == "TOKEN_TO_TOKEN"){
      token_to_token_price = eth_to_token_price/token_to_eth_price;
      outputPrice = token_to_token_price*_val;
      console.log(tokenProtocol+" : "+outputPrice)
      $("#outputToken").val(outputPrice);
    }
    if(inputPrice == "" || inputPrice == 0){
      showStatus("Input price should be greater than 0.")

    }else{
      showStatus("Ready.!!!")
    }

  }




  function ethToTokenTransferInput() { // not in use
    console.log("eth transfer 2 not in use")
    var exchangeContract = new web3js.eth.Contract(exchangeABI, exchangeOutAdd);
    var eth = String(10**18);
    var ethValue =  String(inputPrice*(10**18))        // big integer, msg.value

    exchangeContract.methods.ethToTokenTransferInput( String(outputPrice*(10**18)) , 1739591241 , to_Address).send({from:userAccount , value: ethValue}).then(x => {
      console.log(x);
      $("#txHash").text("TX hash : " + String(x.blockHash));

    })


  }

  function swap(){
    showStatus("Proccessing")
    $("#loading").show()

    if(tokenProtocol == "ETH_TO_TOKEN"){
      swapEthToToken()
    }
    if(tokenProtocol == "TOKEN_TO_ETH"){
      swapTokenToEth()
    }
    if(tokenProtocol == "TOKEN_TO_TOKEN"){
      swapTokenToToken()
    }

  }


function swapEthToToken() {
  console.log("eth_token Swap")
  var exchangeContract = new web3js.eth.Contract(exchangeABI, exchangeOutAdd);
  var eth = String(10**18);

  var _ethValue =  String(inputPrice*(10**18))        // big integer, msg.value
  var _token_brought = String(outputPrice*(10**18));
  exchangeContract.methods.ethToTokenSwapOutput( _token_brought, 1739591241).send({from:userAccount , value: _ethValue}).then(x => {
  console.log(x);
  showStatus(("TX hash : " + String(x.blockHash)))

  // $("#txHash").text("TX hash : " + String(x[blockHash]));
})
}

  function swapTokenToEth() {
    console.log("token_eth Swap")

    var exchangeContract = new web3js.eth.Contract(exchangeABI, exchangeInAdd);
    var eth = String(10**18);

    var tokenValue =  String(inputPrice*(10**18))        // big integer, msg.value
    var _eth_brought =  String(Math.round(outputPrice*(10**18)))
    var _max_token = String((10**18))
    exchangeContract.methods.tokenToEthSwapOutput(_eth_brought, _max_token , 1739591241).send({from:userAccount}).then(x => {
    console.log(x);
    showStatus(("TX hash : " + String(x.blockHash)))

    // $("#txHash").text("TX hash : " + String(x.blockHash));
  })

  }

  function swapTokenToToken() {
    console.log("token_token Swap")

    var exchangeContract = new web3js.eth.Contract(exchangeABI, exchangeOutAdd);
    // var eth =  String(Math.round(outputPrice*(10**18)));

    var tokenValue =  String(inputPrice*(10**18))
    var _token_sold = String(Math.round(inputPrice*(10**18)))
    var _min_token_brought = String(min_number)
    var _min_eth_brought = String(min_number)
    var _token_address = outputToken["tokenAdd"]
    exchangeContract.methods.tokenToTokenSwapInput(_token_sold,_min_token_brought,_min_eth_brought, 1739591241,_token_address).send({from:userAccount}).then(x => {
    console.log(x);
    showStatus(("TX hash : " + String(x.blockHash)))

    // $("#txHash").text("TX hash : " + String(x.blockHash));
  })

  }

  function transfer(){
    showStatus("Proccessing")
    $("#loading").show()

    if(checkList() != true){
      return false;
    }
    if(tokenProtocol == "ETH_TO_TOKEN"){
      transferEthToToken()
    }
    if(tokenProtocol == "TOKEN_TO_ETH"){
      transferTokenToEth()
    }
    if(tokenProtocol == "TOKEN_TO_TOKEN"){
      transferTokenToToken()
    }
  }

  function transferEthToToken() {
    console.log("eth_token transfer")
    var exchangeContract = new web3js.eth.Contract(exchangeABI, exchangeOutAdd);
    var eth = String(10**18);
    var _ethValue =  String(inputPrice*(10**18))        // big integer, msg.value
    var _token_brought = String(outputPrice*(10**18));
    exchangeContract.methods.ethToTokenTransferOutput( String(outputPrice*(10**18)), 1739591241 , to_Address).send({from:userAccount , value: _ethValue}).then(x => {
    console.log(x);
    showStatus(("TX hash : " + String(x.blockHash)))

  })
}

  function transferTokenToEth(){
      console.log("token_eth transfer")

      var exchangeContract = new web3js.eth.Contract(exchangeABI, exchangeInAdd);
      var eth = String(10**18);

      var _tokenValue =  String(inputPrice*(10**18))
      var _min_eth = String(min_number)
              // big integer, msg.value
      // String(Math.round(outputPrice*(10**18)))?
      exchangeContract.methods.tokenToEthTransferInput(_tokenValue,_min_eth, 1739591241 , to_Address).send({from:userAccount}).then(x => {
      console.log(x);
      showStatus(("TX hash : " + String(x.blockHash)))

    })
  }

  function transferTokenToToken() {
    console.log("token_token transfer")

    var exchangeContract = new web3js.eth.Contract(exchangeABI, exchangeOutAdd);
    var eth = String(10**18);

    var _tokenValue =  String(inputPrice*(10**18))
    var _min_token = String(min_number)
    var _min_eth = String(min_number)
    var _token_address = outputToken["tokenAdd"]
    // String(Math.round(outputPrice*(10**18)))?
    exchangeContract.methods.tokenToTokenTransferInput(_tokenValue,_min_token,_min_eth, 1739591241 , to_Address, _token_address).send({from:userAccount}).then(x => {
    console.log(x);
    showStatus(("TX hash : " + String(x.blockHash)))
  })
  }

  function approveToken(){
    var exchangeContract = new web3js.eth.Contract(exchangeABI, exchangeInAdd);
    var eth = String(10**18);
    exchangeContract.options.address = exchangeInAdd;
    var tokenValue =  String(inputPrice*(10**56))        // big integer, msg.value

    exchangeContract.methods.approve(exchangeInAdd,String(10*56)).send({from:userAccount}).then(x => {

      console.log(x)
      showStatus(("Approve TX Hash: "+String(x.blockHash)))

    });
  }

    function allowanceToken(){
      var exchangeContract = new web3js.eth.Contract(exchangeABI, exchangeInAdd);
      var eth = String(10**18);
      exchangeContract.options.address = exchangeInAdd;
      var tokenValue =  String(inputPrice*(10**18))        // big integer, msg.value

      exchangeContract.methods.allowance(String(userAccount),exchangeInAdd).call().then(x => {
        if(x>0){
          //
          $("#unlockBtn").hide();
          isTokenAllowed = true;
          showStatus("Enter The Input Amount.!!")
          $("#loading").hide()


          // $("#status").text();

        }else{
          showStatus("Please Unlock Your Token")
          $("#unlockBtn").show();
          isTokenAllowed = false;
        }
        console.log("tokenAllowance : "+x)

      });
  }

function  showStatus(_text) {
    $("#status").text(_text);
    if(_text.slice(0,2) == "TX"){
      $("#loading").hide()

    }
    if(_text.slice(0,5) == "Ready"){
      $('#transBtn').prop('disabled', true);
      $('#swapBtn').prop('disabled', false);
    }else if(_text.slice(0,5) == "Ready" && isToAddress==true){
      $('#transBtn').prop('disabled', false);
      $('#swapBtn').prop('disabled', true);
    }else{
      $('#transBtn').prop('disabled', true);
      $('#swapBtn').prop('disabled', true);
    }
    // if(_text.slice(0,5) == "ready" && isToAddress==false){
    //   $('#transBtn').prop('disabled', false);
    //   $('#swapBtn').prop('disabled', true);
    // }
  }

  function checkList() {
    if(isToAddress != true){
      alert("enter To Address")
      return false
    }
    if(isTokenAllowed != true && tokenProtocol != "ETH_TO_TOKEN"){
      alert("unlock the token")
      return false
    }
    return true
  }
