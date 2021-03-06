


/*CLASS*/
function SourceSyntaxColoring() {
	Base.apply(this, arguments);
}
SourceSyntaxColoring.Inherit(Base, "SourceSyntaxColoring");
SourceSyntaxColoring.ImplementProperty("brush", new InitializeStringParameter("Coloringlogic - jsBrush, jsonBrush etc.", "jsBrush"));
SourceSyntaxColoring.Brushes = {
	nullBrush: {
		brushName: "null",
		keywords : "",
		types : "",
		objects : "",
		operators : "",
		runner : function ( m ) {
			return m[0];
			
		},
		expression : /(.*)/g
	},
	docBrush: {
		keywords: "",
		runner: function(m) {
			if (m[1] != undefined) {
				return "<h4>" + m[1].substring(1) + "</h4>";
			} else if (m[2] != undefined) {
				return m[2];
			}
			
		},
		expression: /([\!].+)|([^!].*)/g
	},
	jsBrush: {
		// this is usefull for test // brushName: "js brush",
		keywords : ["break", "case", "class", "catch", "const", "continue", "debugger", "default", "delete", "do", "else", "export", "extends", "finally", "for", "function", "if", "import", "in", "instanceof", "let", "new", "prototype", "return", "super", "switch", "this", "throw", "try", "typeof", "var", "void", "while", "with", "yield"],
		types : "null true false undefined NaN Infinity",
		objects : "Object Number Math String RegExp Array Boolean Date Function JSON",
		operators : "/ * - + % ~ < > |",
		runner : function ( m ) {
			if ( m[1] !== undefined )
			{
				return '<span style="color:green">' + m[1] + '</span>';
			}
			else if ( m[2] !== undefined )
			{
				return '<span style="color:red">' + m[2] + '</span>';
			}
			else if ( m[3] !== undefined )
			{
				return ( this.keywords.indexOf ( m[3] ) !== -1 ) ? ( '<span style="color:blue">' + m[3] + '</span>' ) : ( m[3] );
			}
			else if ( m[4] !== undefined )
			{
				return '<span style="color:#606;">' + m[4] + '</span>';
			}
			else if ( m[5] !== undefined )
			{
				return '<span style="color:#800">' + m[5] + '</span>';
			}
		},
		//            |          1          |           2             |              3                |            4                |                               5
		//            |    quoted string    |        number           |            word               |          signs              |                            comments       
		expression : /(\"(?:[^\\"]|\\\")*\")|((?:\-|\+)?\d+(?:\.\d+)?)|([A-Za-z_\$]{1}[A-Za-z0-9_\$]*)|([\+\-\*\<\>\|\:\=\&\!\%\~]+)|((\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*\/)|(\/\/.*))/g
	},
	jsonBrush: {
		// this is usefull for test // brushName: "json brush",
		//init: function() {
		//	this.state = [];
		//},
		//$currentState = function() {
		//	if (this.state != null && this.state.length > 0) {
		//		return this.state[this.state.length - 1];
		//	}
		//	return null;
		//},
		keywords: "",
		sqlKeywords: ["AND", "AS", "ASC", "BETWEEN", "BY", "CASE", "CURRENT_DATE", "CURRENT_TIME", "DELETE", "DESC", "DISTINCT", "EACH", "ELSE", "ELSEIF", "FOR", "FROM", "GROUP", "HAVING", "IF", "IN", "INSERT", "INTERVAL", "INTO", "IS", "JOIN", "KEY", "KEYS", "LEFT", "LIKE", "LIMIT", "MATCH", "NOT", "NULL", "ON", "OPTION", "OR", "ORDER", "OUT", "OUTER", "REPLACE", "RIGHT", "SELECT", "SET", "TABLE", "THEN", "TO", "UPDATE", "VALUES", "WHEN", "WHERE"],
		frameworkKeywords: ["textfile", "var", "currentLanguage", "paging", "int" ],
		// sql keywords - color: purple;
		// sql function - color: red
		runner: function ( m ) {
			if ( m[1] !== undefined ) {
				var sqlw = new RegExp ( "(" + this.sqlKeywords.join ( "|" )       + ")", "g" );
				var frw =  new RegExp ( "(" + this.frameworkKeywords.join ( "|" ) + ")", "g" );
				
				if ( sqlw.test ( m[1] ) )
				{
					var r = m[1].replace ( sqlw, function ( m ) { return '<span style="color:purple">' + m + '</span>'; } );
					var rn = r.replace ( frw, function ( m ) { return '<span style="color:brown">' + m + '</span>'; } );
					return '<span style="color:blue">' + rn + '</span>';
				}
				return '<span style="color:green">' + m[1] + '</span>';
			}
			else if ( m[3] !== undefined ) {
				return '<span style="color:blue">' + m[3] + '</span>';
			}
			else if ( m[4] !== undefined ) {
				return '<span style="color:blue">' + m[4] + '</span>';
			}
			else if ( m[5] !== undefined ) {
				return '<span style="color:blue">' + m[5] + '</span>';
			}
			else if ( m[6] !== undefined ) { return m[6]; }
			else if ( m[7] !== undefined ) { return m[7]; }
			else if ( m[8] !== undefined ) { return m[8]; }
			else if ( m[9] !== undefined ) { return m[9]; }
			else if ( m[10] !== undefined ) { return m[10]; }
			else if ( m[11] !== undefined ) {
				return '<span style="color:blue">' + m[11] + '</span>';
			}
			else if ( m[12] !== undefined ) {
				return '<span style="color:red">' + m[12] + '</span>';
			}
		},
		//           | property |            quoted string               | value
		//expression : /(\w+(?=:))|("[\w\s\!\?\.\+\-\,\:\\"\/\(\)><\�']+")|(\w+)/g
		// 1 - quotted string, 2 - number (any), 3 - bool, 4 - null, 5 - :, 6 - object open, 7 - object close, 8 - array openm, 9 - array close, 10 - ,, 11 - key name
		//expression: /(?:\"((?:[^\"\\]|\\\"|\\(?!\"))*)\")|((?:\+|\-)?\d+(?:\.\d*(?:e|E(?:\+|\-)?\d+)?)?)|(true|false)|(null)|(:)|({)|(\})|(\[)|(\])|(,)|([A-Za-z][A-Za-z0-9_]*)/g
		expression: /("((?:[^\"\\]|\\\"|\\(?!\"))*)")|((?:\+|\-)?\d+(?:\.\d*(?:e|E(?:\+|\-)?\d+)?)?)|(true|false)|(null)|(:)|({)|(\})|(\[)|(\])|(,)|([A-Za-z][A-Za-z0-9_]*)/g
	}
};

SourceSyntaxColoring.prototype.init = function() {
	$(this.root).Empty();
};
SourceSyntaxColoring.prototype.$getActualBrush = function() {
	if (SourceSyntaxColoring.Brushes[this.get_brush()] != null) return SourceSyntaxColoring.Brushes[this.get_brush()];
	return null;// SourceSyntaxColoring.Brushes["nullBrush"];
}
SourceSyntaxColoring.prototype.get_source = function() {
	return $(this.root).text();
};
SourceSyntaxColoring.prototype.set_source = function(v) {
    if (this.get_brush() == "htmlbrush") {
        this.set_htmltext(v);
    } else if (!this.get_brush()) {
        $(this.root).html(v);
    }
    else {
        $(this.root).html(this.traverseString(v));
    }
};
SourceSyntaxColoring.prototype.paintJavascript = function(v) {

};
SourceSyntaxColoring.prototype.traverseString = function (v) {
	var brush = this.$getActualBrush();
	if (brush == null) return escape(v);
	if (BaseObject.is(v,"string") && v.length > 0) {
		var re = brush.expression;
		if (typeof brush.init == "function") brush.init();
		re.lastIndex = 0;
		var m, result = "";
		var pos = 0;
		while (m = re.exec(v)) {
			result += v.substring(pos, m.index);
			pos = re.lastIndex;
			result += brush.runner ( m );
		}
		
		result += v.substring(pos, v.length);
		return result;
	} else {
		return "No source";
	}
}
SourceSyntaxColoring.prototype.get_htmltext = function() {
	return $(this.root).text();
};
SourceSyntaxColoring.prototype.set_htmltext = function(v) {
	$(this.root).html(this.traverseHtmlString(v));
};
SourceSyntaxColoring.prototype.paintHtmlTagString = function (v) {
	// 1 - attribute
	//		2 - attribute value
	// 3 - framework directive
	//		4 - directive modifier
	//		5 - attribute value for the modifier
	var re = /(?:(class|style|tabindex|type|value|src|width|height|alt|title|id)=\"([^\"]*)\")|(?:data-(bind|on|behavior|context|template|class|key|parameters|root|sibling|validate|async)(?:-([^=]+))?=\"([^\"]*)\")/g;
	if (BaseObject.is(v,"string") && v.length > 0) {
		re.lastIndex = 0;
		var m, result = "";
		var pos = 0;
		while (m = re.exec(v)) {
			result += this.escapeHtml(v.substring(pos, m.index));
			pos = re.lastIndex;
			if (m[1] != null) { // Interesting attribute (one that we want to color
				result += this.htmlSpan(m[1], m[1] + "=&#34;" + this.escapeHtml(m[2]) + "&#34;");
			} else if (m[3] != null) { // Framework specific
				result += this.htmlSpan("$" + m[3], "data-" + m[3] + (m[4]?"-" + m[4]:"") + "=&#34;" + this.htmlSpan(["$" + m[3] + "_content","$bindingcontent"],this.escapeHtml(m[5])) + "&#34;" );
			}
		}
		result += this.escapeHtml(v.substring(pos, v.length));
		return result;
	} else {
		return "";
	}
}
SourceSyntaxColoring.prototype.escapeHtml = function(v) {
	if (v!=null) {
		v = v.replace(/"/g,'&#34;');
		v = v.replace(/'/g,'&#39;');
		v = v.replace(/</g,'&lt;');
		v = v.replace(/>/g,'&gt;');
		return v;
	}
	return "";
}
SourceSyntaxColoring.prototype.traverseHtmlString = function (v) {
	var re = /(?:<([a-zA-Z0-9\_\-\:]+)((?:.|\n|\r)*?)(\/)?>)|(?:<\/([a-zA-Z0-9_\-\:]+)>)|(?:<!--((?:.|\n|\r)*?)\-\->)/g;
	if (BaseObject.is(v,"string") && v.length > 0) {
		re.lastIndex = 0;
		var m, result = "";
		var pos = 0;
		while (m = re.exec(v)) {
			result += this.escapeHtml(v.substring(pos, m.index));
			pos = re.lastIndex;
			if (m[1] != null) {
				result += '&lt;' + this.htmlSpan("opentag", this.escapeHtml(m[1])) + this.paintHtmlTagString(m[2]?m[2]:"") + this.escapeHtml(m[3]?m[3]:"") + '&gt;';
			} else if (m[4] != null) {
				result += '&lt;/' + this.htmlSpan("closetag", this.escapeHtml(m[4])) + '&gt;';
			} else if (m[5] != null) {
				result += this.htmlSpan("comment", '&lt;!--' + this.escapeHtml(m[5]) + '--&gt;');
			}
		}
		result += this.escapeHtml(v.substring(pos, v.length));
		return result;
	} else {
		return "No source";
	}
}
SourceSyntaxColoring.prototype.htmlSpan = function(_vtype, content) {
	var r = "";
	var style = "";
	if (BaseObject.is(_vtype, "Array")) {
		for (var i = 0; i < _vtype.length; i++) {
			if (SourceSyntaxColoring.htmlColoring[_vtype[i]] != null) {
				style = SourceSyntaxColoring.htmlColoring[_vtype[i]];
				break;
			}
		}
	} else {
		if (SourceSyntaxColoring.htmlColoring[_vtype] != null) {
			style = SourceSyntaxColoring.htmlColoring[_vtype];
		}
	}
	
	r = "<span " + style + ">";
	r += content;
	r += "</span>";
	return r;
}

SourceSyntaxColoring.htmlColoring = {
	opentag: 'style="color: blue"',
	closetag: 'style="color: blue"',
	comment: 'style="color: gray"',
	style: 'style="color: #197519"',
	"class": 'style="color: #197519"',
	id: 'style="font-weight: bold;color: red"',
	$key: 'style="font-weight: bold;color: red"',
    $on: 'style="font-style: italic;color: white; background-color:orangered;"',
	$bind: 'style="color: orangered"',
	$bind_content: 'style="background-color: #EEEEEE;border: 1px dotted #888888;"',
	$bindingcontent: 'style="font-weight: bold;"',
	$behavior: 'style="font-weight: normal;color: darkslategray;"',
	$context: 'style="font-weight: normal;color: darkslategray;"',
	$template: 'style="font-weight: normal;color: darkslategray;"',
	$class: 'style="font-weight: bold;color: white;background-color: darkcyan;"',
	$class_content: 'style="font-weight: bold;color: yellow;"',
	$parameters: 'style="font-weight: normal;color: darkslategray;"',
	$root: 'style="font-weight: normal;color: darkslategray;"',
	$sibling: 'style="font-weight: normal;color: darkslategray;"',
	$validate: 'style="font-weight: normal;color: white; background-color: dodgerblue;"',
	$async: 'style="font-weight: bold;color: indigo; background-color: antiquewhite;"'
};