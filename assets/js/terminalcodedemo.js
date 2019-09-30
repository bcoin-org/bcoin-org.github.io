$(function() {
  var data = [
  {
    action: 'type',
    strings: ["bcoin-cli --help"],
    output: '<span class="teal">Commands:<br/>$ info: Get server info.<br/>$ broadcast [tx-hex]: Broadcast transaction.<br/>$ mempool: Get mempool snapshot.<br/>$ tx [hash/address]: View transactions.<br/>$ coin [hash+index]: View coins.<br/>$ block [hash/height]: View block.<br/>$ header [hash/height]: View block header.<br/>$ filter [hash/height]: View filter.<br/>$ reset [height/hash]: Reset chain to desired block.<br/>$ rpc [command] [args]: Execute RPC command. (bcoin-cli rpc help for more)</span><br>&nbsp;',
    preDelay: 5000,
    postDelay: 5000
  },
  {
    action: 'type',
    strings: ["bwallet-cli --help"],
    output: '<span class="teal">Commands:<br/>$ listen: Listen for events.<br/>$ get: View wallet.<br/>$ master: View wallet master key.<br/>$ shared add [xpubkey]: Add key to wallet.<br/>$ shared remove [xpubkey]: Remove key from wallet.<br/>$ balance: Get wallet balance.<br/>$ history: View TX history.<br/>$ pending: View pending TXs.<br/>$ coins: View wallet coins.<br/>$ account list: List account names.<br/>$ account create [account-name]: Create account.<br/>$ account get [account-name]: Get account details.<br/>$ address: Derive new address.<br/>$ change: Derive new change address.<br/>$ nested: Derive new nested address.<br/>$ retoken: Create new api key.<br/>$ send [address] [value]: Send transaction.<br/>$ mktx [address] [value]: Create transaction.<br/>$ sign [tx-hex]: Sign transaction.<br/>$ zap [age?]: Zap pending wallet TXs.<br/>$ tx [hash]: View transaction details.<br/>$ blocks: List wallet blocks.<br/>$ block [height]: View wallet block.<br/>$ view [tx-hex]: Parse and view transaction.<br/>$ import [wif|hex]: Import private or public key.<br/>$ watch [address]: Import an address.<br/>$ key [address]: Get wallet key by address.<br/>$ dump [address]: Get wallet key WIF by address.<br/>$ lock: Lock wallet.<br/>$ unlock [passphrase] [timeout?]: Unlock wallet.<br/>$ resend: Resend pending transactions.<br/>$ rescan [height]: Rescan for transactions.<br/>$ admin [command]: Admin commands<br/>$ rpc [command] [args]: Execute RPC command. (bwallet-cli rpc help for more)<br/>Other Options:<br/>&nbsp;&nbsp;--passphrase [passphrase]: For signing/account-creation.<br/>&nbsp;&nbsp;--account [account-name]: Account name.<br/></span><br>&nbsp;',
    postDelay: 5000
  },
];
  runScripts(data, 0);
});

function runScripts(data, pos) {
    var prompt = $('.prompt'),
        script = data[pos];
    if(script.clear === true) {
      $('.history').html('');
    }
    switch(script.action) {
        case 'type':
          // cleanup for next execution
          prompt.removeData();
          $('.typed-cursor').text('');
          prompt.typed({
            strings: script.strings,
            typeSpeed: 150,
            callback: function() {
              var history = $('.history').html();
              history = history ? [history] : [];
              history.push('$ ' + prompt.text());
              if(script.output) {
                history.push(script.output);
                prompt.html('');
                $('.history').html(history.join('<br>'));
              }
              // scroll to bottom of screen
              $('section.terminal').scrollTop($('section.terminal').height());
              // Run next script
              pos++;
              if(pos < data.length) {
                setTimeout(function() {
                  runScripts(data, pos);
                }, script.postDelay || 1000);
              }
            }
          });
          break;
        case 'view':

          break;
    }
}
