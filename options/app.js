var app = (function(){
	var preview = document.querySelector("#preview");
	var source =  document.querySelector("#input");
	
	var parseCode = function(toParse) {
		var parsed = XBBCODE.process({
			text: toParse,
			removeMisalignedTags: false,
			addInLineBreaks: false
		});
		
		return parsed.html;
	}
	
	var update = function() {
		
		colours = {
			keyWord: function() { return document.querySelector("#keyword").value; },
			functionSub: function() { return document.querySelector("#function").value },
			comment: function() { return document.querySelector("#string").value }
		}
		
		var temp = addCodeTags(source.innerText).substring(6);
		temp = temp.substring(0, temp.length - 7);
		preview.innerHTML = parseCode(temp);
	}
	
	var setColours = function(cols) {
		document.querySelector("#keyword").value = cols.keyWord;
		document.querySelector("#function").value = cols.functionSub;
		document.querySelector("#string").value = cols.comment;
		
		colours = cols;
	}
	
	var init = (function() {
		
		var outputSelect = [];
		var selects = Array.prototype.slice.call(document.querySelectorAll(".colour-box"),0);
		//Add colours to selects
		var cols = "aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen".split("|");
		
		for(var i=0;i<cols.length;i++) {
			outputSelect.push("<option style=\"background-color:" + cols[i] + "\" value=\"" + cols[i] + "\">" + cols[i] + "</option>");
		}
				
		document.querySelector("#SaveColours").addEventListener("click", function(e) {
			chrome.storage.sync.set({
				colours : {
					keyWord: document.querySelector("#keyword").value,
					functionSub: document.querySelector("#function").value,
					comment: document.querySelector("#string").value
				}
			}, function() {
				alert("Colours Saved!");
			});
		});
		
		chrome.storage.sync.get("colours", function(c) {
			if ( !chrome.runtime.error ) {
				if( c.colours !== undefined ) {
						setColours(c.colours);
						update();
				} else {
					var colours = {
						keyWord: "darkblue",
						functionSub: "darkcyan",
						comment: "green"
					}
					chrome.storage.sync.set({colours:colours}, function(c) {
					
					setColours(colours);
					update();
				});
				}
			} else {
				console.log(chrome.runtime.error);
			}
		});
		
		selects.forEach(function(elem) {
			elem.innerHTML = outputSelect.join("\n");
			elem.addEventListener("change", function(e) {
				update();
			});
		});
		
		
		
		
		
	})()
	

	
	return {
		parseCode: update
	}
	
})()
	