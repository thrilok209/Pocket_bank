// var deviceToken = null;
var deviceToken = localStorage.getItem("DEVICE_TOKEN");
if (!deviceToken) {
    var array = new Uint8Array(25);
    window.crypto.getRandomValues(array);
    deviceToken = Array.prototype.map.call(array, x => ("00" + x.toString(16)).slice(-2)).join('');
    localStorage.setItem("DEVICE_TOKEN", deviceToken);
}

var wyreWidget = new Wyre.Widget({
    env: "prod",
    accountId: 'AC-QLWY4RBR62U',
    auth: {
        type: 'metamask',
        secretKey: deviceToken
    },
    operation: {
        type: "debitcard",
        sourceCurrency: "USD",
        sourceAmount: 5,
        destCurrency: "DAI",
        dest: "0x7284a8451d9a0e7Dc62B3a71C0593eA2eC5c5638"
    },
    style: {
        primaryColor: "#ff0000"
    }
    // todo add domain lock for messaging security
});

wyreWidget.on('close', function(e) {
    // the widget closed before completing the process
    if (e.error) {
        console.log("there was a problem: ", e.error);
    } else {
        console.log("the customer closed the widget");
    }
});

wyreWidget.on('complete', function(e) {
    console.log("onboarding was completed successfully!");
    // onboarding was completed successfully!
});

// open the widget when the user presses the button
function testWyre() {
    wyreWidget.open();
}