$(function() {
  var data = [
  { 
    action: 'type',
    strings: ["npm install bcoin"],
    output: '<span class="blue">bcoin-native@0.0.14 install Users/Satoshi/node_modules/bcoin-native</span><br><span class="blue">node-gyp rebuild</span>&nbsp;',
    postDelay: 1000
  },
  /*{ 
    action: 'type',
    strings: [""],
    output: '<span class="teal">bcoin successfully installed</span><br>&nbsp;',
    postDelay: 1000
  },*/
  { 
    action: 'type',
    //clear: true,
    strings: ["bcoin --prune"],
    output: '<span class="blue">[info] Chain is loading.<br>[info] Opening ChainDB...<br>[info] ChainDB successfully loaded.<br>[info] Scanning block 00000000839a8e6886ab5951d76f4114320161bbf18eb6048 (1).</blue><br>&nbsp;',
    postDelay: 1000
  },
  /*{ 
    action: 'type',
    strings: ['node browser/server.js 8080'],
    output: '<span class="teal"># simple webserver and websocket->tcp bridge started</span><br>&nbsp;',     
    postDelay: 2000
  },*/  
  { 
    action: 'type',
    strings: ['am i a menace to the network?',''],
    postDelay: 2000
  }
  
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
            typeSpeed: 30,
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
