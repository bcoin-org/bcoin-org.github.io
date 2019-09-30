$(function() {
  var data = [
  {
    action: 'type',
    strings: ["bcoin-cli info"],
    output: '<span class="teal">{<br/>&nbsp;&nbsp;"version":&nbsp;"2.0.0-dev",<br/>&nbsp;&nbsp;"network":&nbsp;"main",<br/>&nbsp;&nbsp;"chain":&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;"height":&nbsp;597278,<br/>&nbsp;&nbsp;&nbsp;&nbsp;"tip":&nbsp;"000000000000000000114ab8c7d77b0bce885cbecc12f95f2f1cbdfcefb86aa6",<br/>&nbsp;&nbsp;&nbsp;&nbsp;"progress":&nbsp;1<br/>&nbsp;&nbsp;},<br/>&nbsp;&nbsp;"indexes":&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;"addr":&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"enabled":&nbsp;true,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"height":&nbsp;597278<br/>&nbsp;&nbsp;&nbsp;&nbsp;},<br/>&nbsp;&nbsp;&nbsp;&nbsp;"tx":&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"enabled":&nbsp;true,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"height":&nbsp;597278<br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/>&nbsp;&nbsp;&nbsp;&nbsp;"filter":&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"enabled":&nbsp;true,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"height":&nbsp;597278<br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/>&nbsp;&nbsp;},<br/>&nbsp;&nbsp;"pool":&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;"host":&nbsp;"50.81.201.97",<br/>&nbsp;&nbsp;&nbsp;&nbsp;"port":&nbsp;8333,<br/>&nbsp;&nbsp;&nbsp;&nbsp;"agent":&nbsp;"/bcoin:2.0.0-dev/",<br/>&nbsp;&nbsp;&nbsp;&nbsp;"services":&nbsp;"1001",<br/>&nbsp;&nbsp;&nbsp;&nbsp;"outbound":&nbsp;8,<br/>&nbsp;&nbsp;&nbsp;&nbsp;"inbound":&nbsp;0<br/>&nbsp;&nbsp;},<br/>&nbsp;&nbsp;"mempool":&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;"tx":&nbsp;164,<br/>&nbsp;&nbsp;&nbsp;&nbsp;"size":&nbsp;472712<br/>&nbsp;&nbsp;},<br/>&nbsp;&nbsp;"time":&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;"uptime":&nbsp;1035007,<br/>&nbsp;&nbsp;&nbsp;&nbsp;"system":&nbsp;1569876412,<br/>&nbsp;&nbsp;&nbsp;&nbsp;"adjusted":&nbsp;1569876412,<br/>&nbsp;&nbsp;&nbsp;&nbsp;"offset":&nbsp;0<br/>&nbsp;&nbsp;},<br/>&nbsp;&nbsp;"memory":&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;"total":&nbsp;168,<br/>&nbsp;&nbsp;&nbsp;&nbsp;"jsHeap":&nbsp;52,<br/>&nbsp;&nbsp;&nbsp;&nbsp;"jsHeapTotal":&nbsp;82,<br/>&nbsp;&nbsp;&nbsp;&nbsp;"nativeHeap":&nbsp;85,<br/>&nbsp;&nbsp;&nbsp;&nbsp;"external":&nbsp;18<br/>&nbsp;&nbsp;}<br/>}</span><br>&nbsp;',
    preDelay: 5000,
    postDelay: 5000
  },
  {
    action: 'type',
    strings: ["bwallet-cli account get default"],
    output: '<span class="teal">{<br/>&nbsp;&nbsp;"name":&nbsp;"default",<br/>&nbsp;&nbsp;"initialized":&nbsp;true,<br/>&nbsp;&nbsp;"witness":&nbsp;true,<br/>&nbsp;&nbsp;"watchOnly":&nbsp;false,<br/>&nbsp;&nbsp;"type":&nbsp;"pubkeyhash",<br/>&nbsp;&nbsp;"m":&nbsp;1,<br/>&nbsp;&nbsp;"n":&nbsp;1,<br/>&nbsp;&nbsp;"accountIndex":&nbsp;0,<br/>&nbsp;&nbsp;"receiveDepth":&nbsp;1,<br/>&nbsp;&nbsp;"changeDepth":&nbsp;1,<br/>&nbsp;&nbsp;"nestedDepth":&nbsp;0,<br/>&nbsp;&nbsp;"lookahead":&nbsp;10,<br/>&nbsp;&nbsp;"receiveAddress":&nbsp;"bc1qmnej7kvmde3g5hpt39khunv6mwfl750ygejr92",<br/>&nbsp;&nbsp;"changeAddress":&nbsp;"bc1q0w8y68csn0a5793yw2k2cr4s2x48lfad52y08y",<br/>&nbsp;&nbsp;"nestedAddress":&nbsp;3MzjvWzRTLe6SFwqqvuorJDpr5mvb8ApzUE,<br/>&nbsp;&nbsp;"accountKey":&nbsp;"xpubDCEf3giqwrde3yUvCBoMDWfNdxGmefjXHMY5EuvBg7ErJMrHr1cXTodiT4anxv2RN1wX9GHMMLi9hysYtr58PHfES929bpa8MB1q6zWZhKu",<br/>&nbsp;&nbsp;"keys":&nbsp;[],<br/>&nbsp;&nbsp;"balance":&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;"tx":&nbsp;0,<br/>&nbsp;&nbsp;&nbsp;&nbsp;"coin":&nbsp;0,<br/>&nbsp;&nbsp;&nbsp;&nbsp;"unconfirmed":&nbsp;0,<br/>&nbsp;&nbsp;&nbsp;&nbsp;"confirmed":&nbsp;0<br/>&nbsp;&nbsp;}<br/>}</span><br>&nbsp;',
    postDelay: 5000
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
            typeSpeed: 150,
            callback: function() {
              var history = $('.history').html();
              history = history ? [history] : [];
              history.push('$ ' + prompt.text());
              if(script.output) {
                setTimeout( function() {
                  history.push(script.output);
                  prompt.html('');
                  $('.history').html(history.join('<br>'));

                  // scroll to bottom of screen
                  $('section.terminal').animate({ scrollTop: $('.history').height() }, 'slow');
                }, 1000);
              }

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
