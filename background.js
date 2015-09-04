
var keyWords = [
  "Collection","Debug","Print","Input","Error","Lock","Unlock","Line Input","Call","Erase","Put","Get","Empty","Step","Wend","While","Until","Let","Null","Each","To","True","False","Like","Is","Mod","Imp","Eqv","On Error","Set","Nothing","Declare","Lib","ByVal","ByRef","Dim","ReDim","Preserve","Const","Static","If","Then","End If","ElseIf","Else","GoTo","Open","Close","Output","Binary","Random","Access","Read","Write","ReadWrite","And","Or","Xor","Not","Private","Public","Sub","Function","Property","Case","Do","For","End","With","Select","Exit Function","Exit Sub","Exit Do","Exit For","Exit Property","End Sub","End Function","End Property","End Type","End With","End Select","Type","Enum","Option Explicit","Option Base","As","String","Integer","Long","Double","Single","Date","Boolean","Byte","Currency","Variant","New","Object","OLE_CANCELBOOL","OLE_COLOR","OLE_HANDLE","OLE_OPTEXCLUSIVE","OLE_TRISTATE","Next"
];

var activeExtension = (function() {
    var _activate = false;
    
    var init = function() {
      var location = window.location.origin.toLowerCase();
      
      if(location.indexOf("wbprx") > 0) {
       if( document.getElementsByName("generator")[0].content.toLowerCase().indexOf("vbulletin") >= 0 ) {
        _activate = true; 
       }
      } else {
        _activate = true;
      }
    }
    
    init();
    return _activate;
})();


if( activeExtension ) {
  var colours = (function () {
  
    var cols = {};
  
    var keyword = function () {
      return cols.keyWord || "darkblue";
    }
    var comment = function () {
      return cols.comment || "green";
    }
    var fn = function () {
      return cols.functionSub || "darkcyan";
    }
  
    var init = function() {
      chrome.storage.sync.get("colours", function (c) {
        if (!chrome.runtime.error) {
          if (c.colours !== undefined) {
            cols = c.colours;
          }
        }
      });
    }
  
      init();
    
    return {
      keyWord: keyword,
      comment: comment,
      functionSub: fn
    }
  })();
  
  
  (function() {
    if(typeof(SyntaxHighlighter)!="undefined") {
      chrome.storage.sync.get("highlighting", function(h) {
        if(!chrome.runtime.error) {
          if(h.highlighting === undefined || h.highlighting.on) {
          Array.prototype.slice.call(document.querySelectorAll("pre"),0).forEach(function(pre){
              if(pre.id != "preview") {
                pre.innerHTML = pre.innerText; pre.className = "brush: vb;";
              } else {
                pre.className = ""
              }
            });
            SyntaxHighlighter.highlight();
          }
        }
      });
  
    }
  })()
  
  
  var colourTag = {
    open: function(colour) {
      return "[color=" + colour + "]";
    },
    close: "[/color]"
  };
  
  
  var map = []; // Or you could call it "key"
  var app = app || {};
  
  document.onkeydown = onkeyup = function(e){
      e = e || event; // to deal with IE
      map[e.keyCode] = e.type == 'keydown';
    if(map[65] && map[18]) {
  
      replaceSelectedText(document.querySelector(".cke_source.cke_enable_context_menu"), addCodeTags(getSelectedText()));
      map = [];
    }
  }
  
  
  
  function addCodeTags(text) {
  
    var intext = text;
  
    //Replace KeyWords
    for(var i=0;i<keyWords.length;i++){
      var keyWord = keyWords[i];
      intext = replaceKeyWords(intext, keyWord, colourTag.open(colours.keyWord()) + keyWord + colourTag.close);
    }
  
    //Add comments
    var comments = intext.match(/'+.*$/mg) ||[];
    var remComments = intext.match(/Rem+.*$/mg) ||[];
    comments = comments.concat(remComments);
  
    var uniqueComments = comments.filter(onlyUnique);
    for(var i=0;i<uniqueComments.length;i++){
      intext = replaceAll(intext, uniqueComments[i],colourTag.open(colours.comment()) + uniqueComments[i] + colourTag.close);
    }
  
    //Highlight function/sub calls
    var functions = intext.match(/[A-z0-9$]+(?=\()/mg)||[];
  
    var uniqueFunctions = functions.filter(onlyUnique);
    for(var i=0;i<uniqueFunctions.length;i++){
      intext = replaceKeyWords(intext, uniqueFunctions[i],colourTag.open(colours.functionSub()) + uniqueFunctions[i] + colourTag.close);
    }
  
    //Parse strings
    var strings = intext.match(/"[^"]*"/mg) || [];
    var uniqueStrings = strings.filter(onlyUnique);
    for(var i=0;i<uniqueStrings.length;i++) {
      intext = replaceAll(intext, uniqueStrings[i], colourTag.open(colours.comment()) + uniqueStrings[i] + colourTag.close);
    }
  
  
  
    return "[code]" + intext + "[/code]";
  }
  
  
  //Helper functions:
  function replaceKeyWords(string, find, replace) {
    var search = find.replace("$","");
    var findR = reverseString(search);
    return reverseString(reverseString(string).replace(new RegExp( '"[^"]*"|((?:\\b|\\$)' + escapeRegExp(findR) + "\\b(?!.*'))", "mg"), function(m, group1) {
      if(group1==reverseString(find)) return reverseString(replace);
      else return m;
    })
    );
  }
  
  
  
  function escapeRegExp(string) {
      return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }
  
  function reverseString(string) {
    return string.split("").reverse().join("");
  }
  
  
  function getSelectedText() {
        var text = "";
      if (window.getSelection) {
          text = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
          text = document.selection.createRange().text;
      }
      return text;
  }
  
  function onlyUnique(value, index, self) {
      if ( value === "'" ) {
        return false;
      } else {
        return self.indexOf(value) === index;      
      }
  
  }
  
  function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }
  
  function getInputSelection(el) {
      var start = 0, end = 0, normalizedValue, range,
          textInputRange, len, endRange;
  
      if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
          start = el.selectionStart;
          end = el.selectionEnd;
      } else {
          range = document.selection.createRange();
  
          if (range && range.parentElement() == el) {
              len = el.value.length;
              normalizedValue = el.value.replace(/\r\n/g, "\n");
  
              // Create a working TextRange that lives only in the input
              textInputRange = el.createTextRange();
              textInputRange.moveToBookmark(range.getBookmark());
  
              // Check if the start and end of the selection are at the very end
              // of the input, since moveStart/moveEnd doesn't return what we want
              // in those cases
              endRange = el.createTextRange();
              endRange.collapse(false);
  
              if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                  start = end = len;
              } else {
                  start = -textInputRange.moveStart("character", -len);
                  start += normalizedValue.slice(0, start).split("\n").length - 1;
  
                  if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                      end = len;
                  } else {
                      end = -textInputRange.moveEnd("character", -len);
                      end += normalizedValue.slice(0, end).split("\n").length - 1;
                  }
              }
          }
      }
  
      return {
          start: start,
          end: end
      };
  }
  
  function replaceSelectedText(el, text) {
      var sel = getInputSelection(el), val = el.value;
      el.value = val.slice(0, sel.start) + text + val.slice(sel.end);
  }
}




