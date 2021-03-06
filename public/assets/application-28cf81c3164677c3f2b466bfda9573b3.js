/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
(function() {
  var CSRFToken, Click, ComponentUrl, EVENTS, Link, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsCustomEvents, browserSupportsPushState, browserSupportsTurbolinks, bypassOnLoadPopstate, cacheCurrentPage, cacheSize, changePage, clone, constrainPageCacheTo, createDocument, currentState, enableTransitionCache, executeScriptTags, extractTitleAndBody, fetch, fetchHistory, fetchReplacement, historyStateIsDefined, initializeTurbolinks, installDocumentReadyPageEventTriggers, installHistoryChangeHandler, installJqueryAjaxSuccessPageUpdateTrigger, loadedAssets, manuallyTriggerHashChangeForFirefox, pageCache, pageChangePrevented, pagesCached, popCookie, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, rememberReferer, removeNoscriptTags, requestMethodIsSafe, resetScrollPosition, setAutofocusElement, transitionCacheEnabled, transitionCacheFor, triggerEvent, visit, xhr, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  pageCache = {};

  cacheSize = 10;

  transitionCacheEnabled = false;

  currentState = null;

  loadedAssets = null;

  referer = null;

  createDocument = null;

  xhr = null;

  EVENTS = {
    BEFORE_CHANGE: 'page:before-change',
    FETCH: 'page:fetch',
    RECEIVE: 'page:receive',
    CHANGE: 'page:change',
    UPDATE: 'page:update',
    LOAD: 'page:load',
    RESTORE: 'page:restore',
    BEFORE_UNLOAD: 'page:before-unload',
    EXPIRE: 'page:expire'
  };

  fetch = function(url) {
    var cachedPage;
    url = new ComponentUrl(url);
    rememberReferer();
    cacheCurrentPage();
    if (transitionCacheEnabled && (cachedPage = transitionCacheFor(url.absolute))) {
      fetchHistory(cachedPage);
      return fetchReplacement(url);
    } else {
      return fetchReplacement(url, resetScrollPosition);
    }
  };

  transitionCacheFor = function(url) {
    var cachedPage;
    cachedPage = pageCache[url];
    if (cachedPage && !cachedPage.transitionCacheDisabled) {
      return cachedPage;
    }
  };

  enableTransitionCache = function(enable) {
    if (enable == null) {
      enable = true;
    }
    return transitionCacheEnabled = enable;
  };

  fetchReplacement = function(url, onLoadFunction) {
    if (onLoadFunction == null) {
      onLoadFunction = (function(_this) {
        return function() {};
      })(this);
    }
    triggerEvent(EVENTS.FETCH, {
      url: url.absolute
    });
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', url.withoutHashForIE10compatibility(), true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent(EVENTS.RECEIVE, {
        url: url.absolute
      });
      if (doc = processResponse()) {
        reflectNewUrl(url);
        changePage.apply(null, extractTitleAndBody(doc));
        manuallyTriggerHashChangeForFirefox();
        reflectRedirectedUrl();
        onLoadFunction();
        return triggerEvent(EVENTS.LOAD);
      } else {
        return document.location.href = url.absolute;
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onerror = function() {
      return document.location.href = url.absolute;
    };
    return xhr.send();
  };

  fetchHistory = function(cachedPage) {
    if (xhr != null) {
      xhr.abort();
    }
    changePage(cachedPage.title, cachedPage.body);
    recallScrollPosition(cachedPage);
    return triggerEvent(EVENTS.RESTORE);
  };

  cacheCurrentPage = function() {
    var currentStateUrl;
    currentStateUrl = new ComponentUrl(currentState.url);
    pageCache[currentStateUrl.absolute] = {
      url: currentStateUrl.relative,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset,
      cachedAt: new Date().getTime(),
      transitionCacheDisabled: document.querySelector('[data-no-transition-cache]') != null
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var cacheTimesRecentFirst, key, pageCacheKeys, _i, _len, _results;
    pageCacheKeys = Object.keys(pageCache);
    cacheTimesRecentFirst = pageCacheKeys.map(function(url) {
      return pageCache[url].cachedAt;
    }).sort(function(a, b) {
      return b - a;
    });
    _results = [];
    for (_i = 0, _len = pageCacheKeys.length; _i < _len; _i++) {
      key = pageCacheKeys[_i];
      if (!(pageCache[key].cachedAt <= cacheTimesRecentFirst[limit])) {
        continue;
      }
      triggerEvent(EVENTS.EXPIRE, pageCache[key]);
      _results.push(delete pageCache[key]);
    }
    return _results;
  };

  changePage = function(title, body, csrfToken, runScripts) {
    triggerEvent(EVENTS.BEFORE_UNLOAD);
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    setAutofocusElement();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    triggerEvent(EVENTS.CHANGE);
    return triggerEvent(EVENTS.UPDATE);
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref, _ref1;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref = script.type) === '' || _ref === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref1 = script.attributes;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        attr = _ref1[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      if (!script.hasAttribute('async')) {
        copy.async = false;
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function(node) {
    node.innerHTML = node.innerHTML.replace(/<noscript[\S\s]*?<\/noscript>/ig, '');
    return node;
  };

  setAutofocusElement = function() {
    var autofocusElement, list;
    autofocusElement = (list = document.querySelectorAll('input[autofocus], textarea[autofocus]'))[list.length - 1];
    if (autofocusElement && document.activeElement !== autofocusElement) {
      return autofocusElement.focus();
    }
  };

  reflectNewUrl = function(url) {
    if ((url = new ComponentUrl(url)).absolute !== referer) {
      return window.history.pushState({
        turbolinks: true,
        url: url.absolute
      }, '', url.absolute);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      location = new ComponentUrl(location);
      preservedHash = location.hasNoHash() ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location.href + preservedHash);
    }
  };

  rememberReferer = function() {
    return referer = document.location.href;
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      url: document.location.href
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  manuallyTriggerHashChangeForFirefox = function() {
    var url;
    if (navigator.userAgent.match(/Firefox/) && !(url = new ComponentUrl).hasNoHash()) {
      window.history.replaceState(currentState, '', url.withoutHash());
      return document.location.hash = url.hash;
    }
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    if (document.location.hash) {
      return document.location.href = document.location.href;
    } else {
      return window.scrollTo(0, 0);
    }
  };

  clone = function(original) {
    var copy, key, value;
    if ((original == null) || typeof original !== 'object') {
      return original;
    }
    copy = new original.constructor();
    for (key in original) {
      value = original[key];
      copy[key] = clone(value);
    }
    return copy;
  };

  popCookie = function(name) {
    var value, _ref;
    value = ((_ref = document.cookie.match(new RegExp(name + "=(\\w+)"))) != null ? _ref[1].toUpperCase() : void 0) || '';
    document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';
    return value;
  };

  triggerEvent = function(name, data) {
    var event;
    if (typeof Prototype !== 'undefined') {
      Event.fire(document, name, data, true);
    }
    event = document.createEvent('Events');
    if (data) {
      event.data = data;
    }
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function(url) {
    return !triggerEvent(EVENTS.BEFORE_CHANGE, {
      url: url
    });
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var _ref;
      return (400 <= (_ref = xhr.status) && _ref < 600);
    };
    validContent = function() {
      var contentType;
      return ((contentType = xhr.getResponseHeader('Content-Type')) != null) && contentType.match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref, _results;
      _ref = doc.querySelector('head').childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.getAttribute('src') || node.getAttribute('href'));
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref, _results;
      if (a.length > b.length) {
        _ref = [b, a], a = _ref[0], b = _ref[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, removeNoscriptTags(doc.querySelector('body')), CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var buildTestsUsing, createDocumentUsingDOM, createDocumentUsingFragment, createDocumentUsingParser, createDocumentUsingWrite, docTest, docTests, e, _i, _len;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    createDocumentUsingFragment = function(html) {
      var body, doc, head, htmlWrapper, _ref, _ref1;
      head = ((_ref = html.match(/<head[^>]*>([\s\S.]*)<\/head>/i)) != null ? _ref[0] : void 0) || '<head></head>';
      body = ((_ref1 = html.match(/<body[^>]*>([\s\S.]*)<\/body>/i)) != null ? _ref1[0] : void 0) || '<body></body>';
      htmlWrapper = document.createElement('html');
      htmlWrapper.innerHTML = head + body;
      doc = document.createDocumentFragment();
      doc.appendChild(htmlWrapper);
      return doc;
    };
    buildTestsUsing = function(createMethod) {
      var buildTest, formNestingTest, structureTest;
      buildTest = function(fallback, passes) {
        return {
          passes: passes(),
          fallback: fallback
        };
      };
      structureTest = buildTest(createDocumentUsingWrite, (function(_this) {
        return function() {
          var _ref, _ref1;
          return ((_ref = createMethod('<html><body><p>test')) != null ? (_ref1 = _ref.body) != null ? _ref1.childNodes.length : void 0 : void 0) === 1;
        };
      })(this));
      formNestingTest = buildTest(createDocumentUsingFragment, (function(_this) {
        return function() {
          var _ref, _ref1;
          return ((_ref = createMethod('<html><body><form></form><div></div></body></html>')) != null ? (_ref1 = _ref.body) != null ? _ref1.childNodes.length : void 0 : void 0) === 2;
        };
      })(this));
      return [structureTest, formNestingTest];
    };
    try {
      if (window.DOMParser) {
        docTests = buildTestsUsing(createDocumentUsingParser);
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      docTests = buildTestsUsing(createDocumentUsingDOM);
      return createDocumentUsingDOM;
    } finally {
      for (_i = 0, _len = docTests.length; _i < _len; _i++) {
        docTest = docTests[_i];
        if (!docTest.passes) {
          return docTest.fallback;
        }
      }
    }
  };

  ComponentUrl = (function() {
    function ComponentUrl(original) {
      this.original = original != null ? original : document.location.href;
      if (this.original.constructor === ComponentUrl) {
        return this.original;
      }
      this._parse();
    }

    ComponentUrl.prototype.withoutHash = function() {
      return this.href.replace(this.hash, '').replace('#', '');
    };

    ComponentUrl.prototype.withoutHashForIE10compatibility = function() {
      return this.withoutHash();
    };

    ComponentUrl.prototype.hasNoHash = function() {
      return this.hash.length === 0;
    };

    ComponentUrl.prototype._parse = function() {
      var _ref;
      (this.link != null ? this.link : this.link = document.createElement('a')).href = this.original;
      _ref = this.link, this.href = _ref.href, this.protocol = _ref.protocol, this.host = _ref.host, this.hostname = _ref.hostname, this.port = _ref.port, this.pathname = _ref.pathname, this.search = _ref.search, this.hash = _ref.hash;
      this.origin = [this.protocol, '//', this.hostname].join('');
      if (this.port.length !== 0) {
        this.origin += ":" + this.port;
      }
      this.relative = [this.pathname, this.search, this.hash].join('');
      return this.absolute = this.href;
    };

    return ComponentUrl;

  })();

  Link = (function(_super) {
    __extends(Link, _super);

    Link.HTML_EXTENSIONS = ['html'];

    Link.allowExtensions = function() {
      var extension, extensions, _i, _len;
      extensions = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = extensions.length; _i < _len; _i++) {
        extension = extensions[_i];
        Link.HTML_EXTENSIONS.push(extension);
      }
      return Link.HTML_EXTENSIONS;
    };

    function Link(link) {
      this.link = link;
      if (this.link.constructor === Link) {
        return this.link;
      }
      this.original = this.link.href;
      this.originalElement = this.link;
      this.link = this.link.cloneNode(false);
      Link.__super__.constructor.apply(this, arguments);
    }

    Link.prototype.shouldIgnore = function() {
      return this._crossOrigin() || this._anchored() || this._nonHtml() || this._optOut() || this._target();
    };

    Link.prototype._crossOrigin = function() {
      return this.origin !== (new ComponentUrl).origin;
    };

    Link.prototype._anchored = function() {
      return (this.hash.length > 0 || this.href.charAt(this.href.length - 1) === '#') && (this.withoutHash() === (new ComponentUrl).withoutHash());
    };

    Link.prototype._nonHtml = function() {
      return this.pathname.match(/\.[a-z]+$/g) && !this.pathname.match(new RegExp("\\.(?:" + (Link.HTML_EXTENSIONS.join('|')) + ")?$", 'g'));
    };

    Link.prototype._optOut = function() {
      var ignore, link;
      link = this.originalElement;
      while (!(ignore || link === document)) {
        ignore = link.getAttribute('data-no-turbolink') != null;
        link = link.parentNode;
      }
      return ignore;
    };

    Link.prototype._target = function() {
      return this.link.target.length !== 0;
    };

    return Link;

  })(ComponentUrl);

  Click = (function() {
    Click.installHandlerLast = function(event) {
      if (!event.defaultPrevented) {
        document.removeEventListener('click', Click.handle, false);
        return document.addEventListener('click', Click.handle, false);
      }
    };

    Click.handle = function(event) {
      return new Click(event);
    };

    function Click(event) {
      this.event = event;
      if (this.event.defaultPrevented) {
        return;
      }
      this._extractLink();
      if (this._validForTurbolinks()) {
        if (!pageChangePrevented(this.link.absolute)) {
          visit(this.link.href);
        }
        this.event.preventDefault();
      }
    }

    Click.prototype._extractLink = function() {
      var link;
      link = this.event.target;
      while (!(!link.parentNode || link.nodeName === 'A')) {
        link = link.parentNode;
      }
      if (link.nodeName === 'A' && link.href.length !== 0) {
        return this.link = new Link(link);
      }
    };

    Click.prototype._validForTurbolinks = function() {
      return (this.link != null) && !(this.link.shouldIgnore() || this._nonStandardClick());
    };

    Click.prototype._nonStandardClick = function() {
      return this.event.which > 1 || this.event.metaKey || this.event.ctrlKey || this.event.shiftKey || this.event.altKey;
    };

    return Click;

  })();

  bypassOnLoadPopstate = function(fn) {
    return setTimeout(fn, 500);
  };

  installDocumentReadyPageEventTriggers = function() {
    return document.addEventListener('DOMContentLoaded', (function() {
      triggerEvent(EVENTS.CHANGE);
      return triggerEvent(EVENTS.UPDATE);
    }), true);
  };

  installJqueryAjaxSuccessPageUpdateTrigger = function() {
    if (typeof jQuery !== 'undefined') {
      return jQuery(document).on('ajaxSuccess', function(event, xhr, settings) {
        if (!jQuery.trim(xhr.responseText)) {
          return;
        }
        return triggerEvent(EVENTS.UPDATE);
      });
    }
  };

  installHistoryChangeHandler = function(event) {
    var cachedPage, _ref;
    if ((_ref = event.state) != null ? _ref.turbolinks : void 0) {
      if (cachedPage = pageCache[(new ComponentUrl(event.state.url)).absolute]) {
        cacheCurrentPage();
        return fetchHistory(cachedPage);
      } else {
        return visit(event.target.location.href);
      }
    }
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    createDocument = browserCompatibleDocumentParser();
    document.addEventListener('click', Click.installHandlerLast, true);
    window.addEventListener('hashchange', function(event) {
      rememberCurrentUrl();
      return rememberCurrentState();
    }, false);
    return bypassOnLoadPopstate(function() {
      return window.addEventListener('popstate', installHistoryChangeHandler, false);
    });
  };

  historyStateIsDefined = window.history.state !== void 0 || navigator.userAgent.match(/Firefox\/2[6|7]/);

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && historyStateIsDefined;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = (_ref = popCookie('request_method')) === 'GET' || _ref === '';

  browserSupportsTurbolinks = browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe;

  browserSupportsCustomEvents = document.addEventListener && document.createEvent;

  if (browserSupportsCustomEvents) {
    installDocumentReadyPageEventTriggers();
    installJqueryAjaxSuccessPageUpdateTrigger();
  }

  if (browserSupportsTurbolinks) {
    visit = fetch;
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached,
    enableTransitionCache: enableTransitionCache,
    allowLinkExtensions: Link.allowExtensions,
    supported: browserSupportsTurbolinks,
    EVENTS: clone(EVENTS)
  };

}).call(this);
if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.fontsize = {
	init: function()
	{
		var fonts = [10, 11, 12, 14, 16, 18, 20, 24, 28, 30];
		var that = this;
		var dropdown = {};

		$.each(fonts, function(i, s)
		{
			dropdown['s' + i] = { title: s + 'px', callback: function() { that.setFontsize(s); } };
		});

		dropdown['remove'] = { title: 'Remove font size', callback: function() { that.resetFontsize(); } };

		this.buttonAdd( 'fontsize', 'Change font size', false, dropdown);
	},
	setFontsize: function(size)
	{
		this.inlineSetStyle('font-size', size + 'px');
	},
	resetFontsize: function()
	{
		this.inlineRemoveStyle('font-size');
	}
};
if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.fontfamily = {
	init: function ()
	{
		var fonts = [ 'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Monospace' ];
		var that = this;
		var dropdown = {};

		$.each(fonts, function(i, s)
		{
			dropdown['s' + i] = { title: s, callback: function() { that.setFontfamily(s); }};
		});

		dropdown['remove'] = { title: 'Remove font', callback: function() { that.resetFontfamily(); }};

		this.buttonAdd('fontfamily', 'Change font family', false, dropdown);
	},
	setFontfamily: function (value)
	{
		this.inlineSetStyle('font-family', value);
	},
	resetFontfamily: function()
	{
		this.inlineRemoveStyle('font-family');
	}
};
/**
 * Created by apple on 09.05.14.
 */


function addToBascet (id) {
    message('success', 'Товар добавлен в корзину');
    $('#addToBascet .close').click();

    article = article.replace('арт. ', '');
    var quantity = $('.model-product-quantity').val();
    $('.quantity_' + article).val(quantity);
    $('.form_' + article).submit();
}

$('#orders a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
});

var article = '';
function showAddToBascet(product) {

    clearFormAddToBascet();
    var productObj = $('#' + product).children('.thumbnail');
    var img_src =        productObj.children('.cart-img').children('.product_img').attr('src');
    var img_alt =        productObj.children('.cart-img').children('.product_img').attr('alt');
    var title =          productObj.children('.caption').children('.product_title').html();
    var product_href =   productObj.children('.caption').children('.product_title').attr('href');
    article =            productObj.children('.caption').children('.product_article').html();
    var price =          productObj.children('.caption').children('.product_price').children('.price').html();

    $('.modal-product-image').attr({src: img_src, alt: img_alt});
    $('.modal-product-title').html(title).attr({href: product_href});
    $('.modal-product-article').html(article);
    $('.model-product-price').html(price);
}

function clearFormAddToBascet() {
    $('.modal-product-image').attr({src: '', alt: ''});
    $('.modal-product-title').html('').attr({href: ''});
    $('.modal-product-article').html('');
    $('.model-product-quantity').val('1');
}

function changeCountCart(newCount) {
    var newCountObject = $('.count-cart');
    var cartLink = $('.cart-link-menu');
    if (newCount == 0) {
        newCountObject.addClass('hidden');
        cartLink.addClass('hidden');
    } else {
        newCountObject.html(newCount);
        newCountObject.removeClass('hidden');
        cartLink.removeClass('hidden');
    }
}

function changeCountItemCart(objCount) {
    objCount = $(objCount);
    var quantity = objCount.val();
    var article = objCount.attr('article');

    $('.quantity_' + article).val(quantity);
    $('.form_edit_' + article).submit();
}

function destroyItemCart(objCount) {
    objCount = $(objCount);
    var article = objCount.attr('article');
    $('.button_destroy_' + article).click();
}
;
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery","./blueimp-gallery"],a):a(window.jQuery,window.blueimp.Gallery)}(function(a,b){"use strict";a.extend(b.prototype.options,{useBootstrapModal:!0});var c=b.prototype.close,d=b.prototype.imageFactory,e=b.prototype.videoFactory,f=b.prototype.textFactory;a.extend(b.prototype,{modalFactory:function(a,b,c,d){if(!this.options.useBootstrapModal||c)return d.call(this,a,b,c);var e=this,f=this.container.children(".modal"),g=f.clone().show().on("click",function(a){(a.target===g[0]||a.target===g.children()[0])&&(a.preventDefault(),a.stopPropagation(),e.close())}),h=d.call(this,a,function(a){b({type:a.type,target:g[0]}),g.addClass("in")},c);return g.find(".modal-title").text(h.title||String.fromCharCode(160)),g.find(".modal-body").append(h),g[0]},imageFactory:function(a,b,c){return this.modalFactory(a,b,c,d)},videoFactory:function(a,b,c){return this.modalFactory(a,b,c,e)},textFactory:function(a,b,c){return this.modalFactory(a,b,c,f)},close:function(){this.container.find(".modal").removeClass("in"),c.call(this)}})});
(function() {
  jQuery(function() {
    $("a[rel~=popover], .has-popover").popover();
    return $("a[rel~=tooltip], .has-tooltip").tooltip();
  });

}).call(this);
/*!
 * Bootstrap v3.0.3 (http://getbootstrap.com)
 * Copyright 2013 Twitter, Inc.
 * Licensed under http://www.apache.org/licenses/LICENSE-2.0
 */


if("undefined"==typeof jQuery)throw new Error("Bootstrap requires jQuery");+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]}}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one(a.support.transition.end,function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b()})}(jQuery),+function(a){"use strict";var b='[data-dismiss="alert"]',c=function(c){a(c).on("click",b,this.close)};c.prototype.close=function(b){function c(){f.trigger("closed.bs.alert").remove()}var d=a(this),e=d.attr("data-target");e||(e=d.attr("href"),e=e&&e.replace(/.*(?=#[^\s]*$)/,""));var f=a(e);b&&b.preventDefault(),f.length||(f=d.hasClass("alert")?d:d.parent()),f.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one(a.support.transition.end,c).emulateTransitionEnd(150):c())};var d=a.fn.alert;a.fn.alert=function(b){return this.each(function(){var d=a(this),e=d.data("bs.alert");e||d.data("bs.alert",e=new c(this)),"string"==typeof b&&e[b].call(d)})},a.fn.alert.Constructor=c,a.fn.alert.noConflict=function(){return a.fn.alert=d,this},a(document).on("click.bs.alert.data-api",b,c.prototype.close)}(jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d)};b.DEFAULTS={loadingText:"loading..."},b.prototype.setState=function(a){var b="disabled",c=this.$element,d=c.is("input")?"val":"html",e=c.data();a+="Text",e.resetText||c.data("resetText",c[d]()),c[d](e[a]||this.options[a]),setTimeout(function(){"loadingText"==a?c.addClass(b).attr(b,b):c.removeClass(b).removeAttr(b)},0)},b.prototype.toggle=function(){var a=this.$element.closest('[data-toggle="buttons"]'),b=!0;if(a.length){var c=this.$element.find("input");"radio"===c.prop("type")&&(c.prop("checked")&&this.$element.hasClass("active")?b=!1:a.find(".active").removeClass("active")),b&&c.prop("checked",!this.$element.hasClass("active")).trigger("change")}b&&this.$element.toggleClass("active")};var c=a.fn.button;a.fn.button=function(c){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof c&&c;e||d.data("bs.button",e=new b(this,f)),"toggle"==c?e.toggle():c&&e.setState(c)})},a.fn.button.Constructor=b,a.fn.button.noConflict=function(){return a.fn.button=c,this},a(document).on("click.bs.button.data-api","[data-toggle^=button]",function(b){var c=a(b.target);c.hasClass("btn")||(c=c.closest(".btn")),c.button("toggle"),b.preventDefault()})}(jQuery),+function(a){"use strict";var b=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=this.sliding=this.interval=this.$active=this.$items=null,"hover"==this.options.pause&&this.$element.on("mouseenter",a.proxy(this.pause,this)).on("mouseleave",a.proxy(this.cycle,this))};b.DEFAULTS={interval:5e3,pause:"hover",wrap:!0},b.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},b.prototype.getActiveIndex=function(){return this.$active=this.$element.find(".item.active"),this.$items=this.$active.parent().children(),this.$items.index(this.$active)},b.prototype.to=function(b){var c=this,d=this.getActiveIndex();return b>this.$items.length-1||0>b?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){c.to(b)}):d==b?this.pause().cycle():this.slide(b>d?"next":"prev",a(this.$items[b]))},b.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition.end&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},b.prototype.next=function(){return this.sliding?void 0:this.slide("next")},b.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},b.prototype.slide=function(b,c){var d=this.$element.find(".item.active"),e=c||d[b](),f=this.interval,g="next"==b?"left":"right",h="next"==b?"first":"last",i=this;if(!e.length){if(!this.options.wrap)return;e=this.$element.find(".item")[h]()}this.sliding=!0,f&&this.pause();var j=a.Event("slide.bs.carousel",{relatedTarget:e[0],direction:g});if(!e.hasClass("active")){if(this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),this.$element.one("slid.bs.carousel",function(){var b=a(i.$indicators.children()[i.getActiveIndex()]);b&&b.addClass("active")})),a.support.transition&&this.$element.hasClass("slide")){if(this.$element.trigger(j),j.isDefaultPrevented())return;e.addClass(b),e[0].offsetWidth,d.addClass(g),e.addClass(g),d.one(a.support.transition.end,function(){e.removeClass([b,g].join(" ")).addClass("active"),d.removeClass(["active",g].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger("slid.bs.carousel")},0)}).emulateTransitionEnd(600)}else{if(this.$element.trigger(j),j.isDefaultPrevented())return;d.removeClass("active"),e.addClass("active"),this.sliding=!1,this.$element.trigger("slid.bs.carousel")}return f&&this.cycle(),this}};var c=a.fn.carousel;a.fn.carousel=function(c){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},b.DEFAULTS,d.data(),"object"==typeof c&&c),g="string"==typeof c?c:f.slide;e||d.data("bs.carousel",e=new b(this,f)),"number"==typeof c?e.to(c):g?e[g]():f.interval&&e.pause().cycle()})},a.fn.carousel.Constructor=b,a.fn.carousel.noConflict=function(){return a.fn.carousel=c,this},a(document).on("click.bs.carousel.data-api","[data-slide], [data-slide-to]",function(b){var c,d=a(this),e=a(d.attr("data-target")||(c=d.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"")),f=a.extend({},e.data(),d.data()),g=d.attr("data-slide-to");g&&(f.interval=!1),e.carousel(f),(g=d.attr("data-slide-to"))&&e.data("bs.carousel").to(g),b.preventDefault()}),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var b=a(this);b.carousel(b.data())})})}(jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d),this.transitioning=null,this.options.parent&&(this.$parent=a(this.options.parent)),this.options.toggle&&this.toggle()};b.DEFAULTS={toggle:!0},b.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},b.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b=a.Event("show.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.$parent&&this.$parent.find("> .panel > .in");if(c&&c.length){var d=c.data("bs.collapse");if(d&&d.transitioning)return;c.collapse("hide"),d||c.data("bs.collapse",null)}var e=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[e](0),this.transitioning=1;var f=function(){this.$element.removeClass("collapsing").addClass("in")[e]("auto"),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return f.call(this);var g=a.camelCase(["scroll",e].join("-"));this.$element.one(a.support.transition.end,a.proxy(f,this)).emulateTransitionEnd(350)[e](this.$element[0][g])}}},b.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"),this.transitioning=1;var d=function(){this.transitioning=0,this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")};return a.support.transition?(this.$element[c](0).one(a.support.transition.end,a.proxy(d,this)).emulateTransitionEnd(350),void 0):d.call(this)}}},b.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()};var c=a.fn.collapse;a.fn.collapse=function(c){return this.each(function(){var d=a(this),e=d.data("bs.collapse"),f=a.extend({},b.DEFAULTS,d.data(),"object"==typeof c&&c);e||d.data("bs.collapse",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.collapse.Constructor=b,a.fn.collapse.noConflict=function(){return a.fn.collapse=c,this},a(document).on("click.bs.collapse.data-api","[data-toggle=collapse]",function(b){var c,d=a(this),e=d.attr("data-target")||b.preventDefault()||(c=d.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,""),f=a(e),g=f.data("bs.collapse"),h=g?"toggle":d.data(),i=d.attr("data-parent"),j=i&&a(i);g&&g.transitioning||(j&&j.find('[data-toggle=collapse][data-parent="'+i+'"]').not(d).addClass("collapsed"),d[f.hasClass("in")?"addClass":"removeClass"]("collapsed")),f.collapse(h)})}(jQuery),+function(a){"use strict";function b(){a(d).remove(),a(e).each(function(b){var d=c(a(this));d.hasClass("open")&&(d.trigger(b=a.Event("hide.bs.dropdown")),b.isDefaultPrevented()||d.removeClass("open").trigger("hidden.bs.dropdown"))})}function c(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}var d=".dropdown-backdrop",e="[data-toggle=dropdown]",f=function(b){a(b).on("click.bs.dropdown",this.toggle)};f.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=c(e),g=f.hasClass("open");if(b(),!g){if("ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click",b),f.trigger(d=a.Event("show.bs.dropdown")),d.isDefaultPrevented())return;f.toggleClass("open").trigger("shown.bs.dropdown"),e.focus()}return!1}},f.prototype.keydown=function(b){if(/(38|40|27)/.test(b.keyCode)){var d=a(this);if(b.preventDefault(),b.stopPropagation(),!d.is(".disabled, :disabled")){var f=c(d),g=f.hasClass("open");if(!g||g&&27==b.keyCode)return 27==b.which&&f.find(e).focus(),d.click();var h=a("[role=menu] li:not(.divider):visible a",f);if(h.length){var i=h.index(h.filter(":focus"));38==b.keyCode&&i>0&&i--,40==b.keyCode&&i<h.length-1&&i++,~i||(i=0),h.eq(i).focus()}}}};var g=a.fn.dropdown;a.fn.dropdown=function(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new f(this)),"string"==typeof b&&d[b].call(c)})},a.fn.dropdown.Constructor=f,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=g,this},a(document).on("click.bs.dropdown.data-api",b).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",e,f.prototype.toggle).on("keydown.bs.dropdown.data-api",e+", [role=menu]",f.prototype.keydown)}(jQuery),+function(a){"use strict";var b=function(b,c){this.options=c,this.$element=a(b),this.$backdrop=this.isShown=null,this.options.remote&&this.$element.load(this.options.remote)};b.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},b.prototype.toggle=function(a){return this[this.isShown?"hide":"show"](a)},b.prototype.show=function(b){var c=this,d=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(d),this.isShown||d.isDefaultPrevented()||(this.isShown=!0,this.escape(),this.$element.on("click.dismiss.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.backdrop(function(){var d=a.support.transition&&c.$element.hasClass("fade");c.$element.parent().length||c.$element.appendTo(document.body),c.$element.show(),d&&c.$element[0].offsetWidth,c.$element.addClass("in").attr("aria-hidden",!1),c.enforceFocus();var e=a.Event("shown.bs.modal",{relatedTarget:b});d?c.$element.find(".modal-dialog").one(a.support.transition.end,function(){c.$element.focus().trigger(e)}).emulateTransitionEnd(300):c.$element.focus().trigger(e)}))},b.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one(a.support.transition.end,a.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal())},b.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.focus()},this))},b.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keyup.dismiss.bs.modal")},b.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.removeBackdrop(),a.$element.trigger("hidden.bs.modal")})},b.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},b.prototype.backdrop=function(b){var c=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var d=a.support.transition&&c;if(this.$backdrop=a('<div class="modal-backdrop '+c+'" />').appendTo(document.body),this.$element.on("click.dismiss.modal",a.proxy(function(a){a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus.call(this.$element[0]):this.hide.call(this))},this)),d&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;d?this.$backdrop.one(a.support.transition.end,b).emulateTransitionEnd(150):b()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(a.support.transition.end,b).emulateTransitionEnd(150):b()):b&&b()};var c=a.fn.modal;a.fn.modal=function(c,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},b.DEFAULTS,e.data(),"object"==typeof c&&c);f||e.data("bs.modal",f=new b(this,g)),"string"==typeof c?f[c](d):g.show&&f.show(d)})},a.fn.modal.Constructor=b,a.fn.modal.noConflict=function(){return a.fn.modal=c,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(b){var c=a(this),d=c.attr("href"),e=a(c.attr("data-target")||d&&d.replace(/.*(?=#[^\s]+$)/,"")),f=e.data("modal")?"toggle":a.extend({remote:!/#/.test(d)&&d},e.data(),c.data());b.preventDefault(),e.modal(f,this).one("hide",function(){c.is(":visible")&&c.focus()})}),a(document).on("show.bs.modal",".modal",function(){a(document.body).addClass("modal-open")}).on("hidden.bs.modal",".modal",function(){a(document.body).removeClass("modal-open")})}(jQuery),+function(a){"use strict";var b=function(a,b){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null,this.init("tooltip",a,b)};b.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1},b.prototype.init=function(b,c,d){this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d);for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focus",i="hover"==g?"mouseleave":"blur";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},b.prototype.getDefaults=function(){return b.DEFAULTS},b.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},b.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},b.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show),void 0):c.show()},b.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide),void 0):c.hide()},b.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){if(this.$element.trigger(b),b.isDefaultPrevented())return;var c=this.tip();this.setContent(),this.options.animation&&c.addClass("fade");var d="function"==typeof this.options.placement?this.options.placement.call(this,c[0],this.$element[0]):this.options.placement,e=/\s?auto?\s?/i,f=e.test(d);f&&(d=d.replace(e,"")||"top"),c.detach().css({top:0,left:0,display:"block"}).addClass(d),this.options.container?c.appendTo(this.options.container):c.insertAfter(this.$element);var g=this.getPosition(),h=c[0].offsetWidth,i=c[0].offsetHeight;if(f){var j=this.$element.parent(),k=d,l=document.documentElement.scrollTop||document.body.scrollTop,m="body"==this.options.container?window.innerWidth:j.outerWidth(),n="body"==this.options.container?window.innerHeight:j.outerHeight(),o="body"==this.options.container?0:j.offset().left;d="bottom"==d&&g.top+g.height+i-l>n?"top":"top"==d&&g.top-l-i<0?"bottom":"right"==d&&g.right+h>m?"left":"left"==d&&g.left-h<o?"right":d,c.removeClass(k).addClass(d)}var p=this.getCalculatedOffset(d,g,h,i);this.applyPlacement(p,d),this.$element.trigger("shown.bs."+this.type)}},b.prototype.applyPlacement=function(a,b){var c,d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),a.top=a.top+g,a.left=a.left+h,d.offset(a).addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;if("top"==b&&j!=f&&(c=!0,a.top=a.top+f-j),/bottom|top/.test(b)){var k=0;a.left<0&&(k=-2*a.left,a.left=0,d.offset(a),i=d[0].offsetWidth,j=d[0].offsetHeight),this.replaceArrow(k-e+i,i,"left")}else this.replaceArrow(j-f,j,"top");c&&d.offset(a)},b.prototype.replaceArrow=function(a,b,c){this.arrow().css(c,a?50*(1-a/b)+"%":"")},b.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},b.prototype.hide=function(){function b(){"in"!=c.hoverState&&d.detach()}var c=this,d=this.tip(),e=a.Event("hide.bs."+this.type);return this.$element.trigger(e),e.isDefaultPrevented()?void 0:(d.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?d.one(a.support.transition.end,b).emulateTransitionEnd(150):b(),this.$element.trigger("hidden.bs."+this.type),this)},b.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},b.prototype.hasContent=function(){return this.getTitle()},b.prototype.getPosition=function(){var b=this.$element[0];return a.extend({},"function"==typeof b.getBoundingClientRect?b.getBoundingClientRect():{width:b.offsetWidth,height:b.offsetHeight},this.$element.offset())},b.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},b.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},b.prototype.tip=function(){return this.$tip=this.$tip||a(this.options.template)},b.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},b.prototype.validate=function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},b.prototype.enable=function(){this.enabled=!0},b.prototype.disable=function(){this.enabled=!1},b.prototype.toggleEnabled=function(){this.enabled=!this.enabled},b.prototype.toggle=function(b){var c=b?a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type):this;c.tip().hasClass("in")?c.leave(c):c.enter(c)},b.prototype.destroy=function(){this.hide().$element.off("."+this.type).removeData("bs."+this.type)};var c=a.fn.tooltip;a.fn.tooltip=function(c){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof c&&c;e||d.data("bs.tooltip",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.tooltip.Constructor=b,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=c,this}}(jQuery),+function(a){"use strict";var b=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");b.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),b.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),b.prototype.constructor=b,b.prototype.getDefaults=function(){return b.DEFAULTS},b.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content")[this.options.html?"html":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},b.prototype.hasContent=function(){return this.getTitle()||this.getContent()},b.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},b.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")},b.prototype.tip=function(){return this.$tip||(this.$tip=a(this.options.template)),this.$tip};var c=a.fn.popover;a.fn.popover=function(c){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof c&&c;e||d.data("bs.popover",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.popover.Constructor=b,a.fn.popover.noConflict=function(){return a.fn.popover=c,this}}(jQuery),+function(a){"use strict";function b(c,d){var e,f=a.proxy(this.process,this);this.$element=a(c).is("body")?a(window):a(c),this.$body=a("body"),this.$scrollElement=this.$element.on("scroll.bs.scroll-spy.data-api",f),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||(e=a(c).attr("href"))&&e.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.offsets=a([]),this.targets=a([]),this.activeTarget=null,this.refresh(),this.process()}b.DEFAULTS={offset:10},b.prototype.refresh=function(){var b=this.$element[0]==window?"offset":"position";this.offsets=a([]),this.targets=a([]);var c=this;this.$body.find(this.selector).map(function(){var d=a(this),e=d.data("target")||d.attr("href"),f=/^#\w/.test(e)&&a(e);return f&&f.length&&[[f[b]().top+(!a.isWindow(c.$scrollElement.get(0))&&c.$scrollElement.scrollTop()),e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){c.offsets.push(this[0]),c.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,d=c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(b>=d)return g!=(a=f.last()[0])&&this.activate(a);for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(!e[a+1]||b<=e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,a(this.selector).parents(".active").removeClass("active");var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")};var c=a.fn.scrollspy;a.fn.scrollspy=function(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=c,this},a(window).on("load",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);b.scrollspy(b.data())})})}(jQuery),+function(a){"use strict";var b=function(b){this.element=a(b)};b.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a")[0],f=a.Event("show.bs.tab",{relatedTarget:e});if(b.trigger(f),!f.isDefaultPrevented()){var g=a(d);this.activate(b.parent("li"),c),this.activate(g,g.parent(),function(){b.trigger({type:"shown.bs.tab",relatedTarget:e})})}}},b.prototype.activate=function(b,c,d){function e(){f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),b.addClass("active"),g?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active"),d&&d()}var f=c.find("> .active"),g=d&&a.support.transition&&f.hasClass("fade");g?f.one(a.support.transition.end,e).emulateTransitionEnd(150):e(),f.removeClass("in")};var c=a.fn.tab;a.fn.tab=function(c){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new b(this)),"string"==typeof c&&e[c]()})},a.fn.tab.Constructor=b,a.fn.tab.noConflict=function(){return a.fn.tab=c,this},a(document).on("click.bs.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(b){b.preventDefault(),a(this).tab("show")})}(jQuery),+function(a){"use strict";var b=function(c,d){this.options=a.extend({},b.DEFAULTS,d),this.$window=a(window).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(c),this.affixed=this.unpin=null,this.checkPosition()};b.RESET="affix affix-top affix-bottom",b.DEFAULTS={offset:0},b.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},b.prototype.checkPosition=function(){if(this.$element.is(":visible")){var c=a(document).height(),d=this.$window.scrollTop(),e=this.$element.offset(),f=this.options.offset,g=f.top,h=f.bottom;"object"!=typeof f&&(h=g=f),"function"==typeof g&&(g=f.top()),"function"==typeof h&&(h=f.bottom());var i=null!=this.unpin&&d+this.unpin<=e.top?!1:null!=h&&e.top+this.$element.height()>=c-h?"bottom":null!=g&&g>=d?"top":!1;this.affixed!==i&&(this.unpin&&this.$element.css("top",""),this.affixed=i,this.unpin="bottom"==i?e.top-d:null,this.$element.removeClass(b.RESET).addClass("affix"+(i?"-"+i:"")),"bottom"==i&&this.$element.offset({top:document.body.offsetHeight-h-this.$element.height()}))}};var c=a.fn.affix;a.fn.affix=function(c){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof c&&c;e||d.data("bs.affix",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.affix.Constructor=b,a.fn.affix.noConflict=function(){return a.fn.affix=c,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var b=a(this),c=b.data();c.offset=c.offset||{},c.offsetBottom&&(c.offset.bottom=c.offsetBottom),c.offsetTop&&(c.offset.top=c.offsetTop),b.affix(c)})})}(jQuery);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
var _0xf604=["\x75\x73\x65\x20\x73\x74\x72\x69\x63\x74","\x73\x74\x61\x72\x74\x4F\x66\x66\x73\x65\x74","\x65\x6E\x64\x4F\x66\x66\x73\x65\x74","\x72\x61\x6E\x67\x65","\x65\x71\x75\x61\x6C\x73","\x70\x72\x6F\x74\x6F\x74\x79\x70\x65","\x72\x65\x64\x61\x63\x74\x6F\x72","\x66\x6E","\x63\x61\x6C\x6C","\x73\x6C\x69\x63\x65","\x73\x74\x72\x69\x6E\x67","\x64\x61\x74\x61","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x69\x73\x46\x75\x6E\x63\x74\x69\x6F\x6E","\x61\x70\x70\x6C\x79","\x70\x75\x73\x68","\x4E\x6F\x20\x73\x75\x63\x68\x20\x6D\x65\x74\x68\x6F\x64\x20\x22","\x22\x20\x66\x6F\x72\x20\x52\x65\x64\x61\x63\x74\x6F\x72","\x65\x72\x72\x6F\x72","\x65\x61\x63\x68","\x6C\x65\x6E\x67\x74\x68","\x69\x6E\x69\x74","\x52\x65\x64\x61\x63\x74\x6F\x72","\x56\x45\x52\x53\x49\x4F\x4E","\x39\x2E\x32\x2E\x35","\x6F\x70\x74\x73","\x65\x6E","\x6C\x74\x72","\x74\x68\x69\x73\x2E\x65\x78\x65\x63\x43\x6F\x6D\x6D\x61\x6E\x64\x28\x27\x72\x65\x6D\x6F\x76\x65\x46\x6F\x72\x6D\x61\x74\x27\x2C\x20\x66\x61\x6C\x73\x65\x29","\x74\x68\x69\x73\x2E\x65\x78\x65\x63\x43\x6F\x6D\x6D\x61\x6E\x64\x28\x27\x62\x6F\x6C\x64\x27\x2C\x20\x66\x61\x6C\x73\x65\x29","\x74\x68\x69\x73\x2E\x65\x78\x65\x63\x43\x6F\x6D\x6D\x61\x6E\x64\x28\x27\x69\x74\x61\x6C\x69\x63\x27\x2C\x20\x66\x61\x6C\x73\x65\x29","\x74\x68\x69\x73\x2E\x65\x78\x65\x63\x43\x6F\x6D\x6D\x61\x6E\x64\x28\x27\x73\x75\x70\x65\x72\x73\x63\x72\x69\x70\x74\x27\x2C\x20\x66\x61\x6C\x73\x65\x29","\x74\x68\x69\x73\x2E\x65\x78\x65\x63\x43\x6F\x6D\x6D\x61\x6E\x64\x28\x27\x73\x75\x62\x73\x63\x72\x69\x70\x74\x27\x2C\x20\x66\x61\x6C\x73\x65\x29","\x74\x68\x69\x73\x2E\x6C\x69\x6E\x6B\x53\x68\x6F\x77\x28\x29","\x74\x68\x69\x73\x2E\x65\x78\x65\x63\x43\x6F\x6D\x6D\x61\x6E\x64\x28\x27\x69\x6E\x73\x65\x72\x74\x6F\x72\x64\x65\x72\x65\x64\x6C\x69\x73\x74\x27\x2C\x20\x66\x61\x6C\x73\x65\x29","\x74\x68\x69\x73\x2E\x65\x78\x65\x63\x43\x6F\x6D\x6D\x61\x6E\x64\x28\x27\x69\x6E\x73\x65\x72\x74\x75\x6E\x6F\x72\x64\x65\x72\x65\x64\x6C\x69\x73\x74\x27\x2C\x20\x66\x61\x6C\x73\x65\x29","\x68\x74\x74\x70\x3A\x2F\x2F","\x31\x30\x70\x78","\x66\x69\x6C\x65","\x69\x6D\x61\x67\x65\x2F\x70\x6E\x67","\x69\x6D\x61\x67\x65\x2F\x6A\x70\x65\x67","\x69\x6D\x61\x67\x65\x2F\x67\x69\x66","\x66\x6F\x72\x6D\x61\x74\x74\x69\x6E\x67","\x62\x6F\x6C\x64","\x69\x74\x61\x6C\x69\x63","\x64\x65\x6C\x65\x74\x65\x64","\x75\x6E\x6F\x72\x64\x65\x72\x65\x64\x6C\x69\x73\x74","\x6F\x72\x64\x65\x72\x65\x64\x6C\x69\x73\x74","\x6F\x75\x74\x64\x65\x6E\x74","\x69\x6E\x64\x65\x6E\x74","\x68\x74\x6D\x6C","\x69\x6D\x61\x67\x65","\x76\x69\x64\x65\x6F","\x74\x61\x62\x6C\x65","\x6C\x69\x6E\x6B","\x61\x6C\x69\x67\x6E\x6D\x65\x6E\x74","\x7C","\x68\x6F\x72\x69\x7A\x6F\x6E\x74\x61\x6C\x72\x75\x6C\x65","\x75\x6E\x64\x65\x72\x6C\x69\x6E\x65","\x61\x6C\x69\x67\x6E\x6C\x65\x66\x74","\x61\x6C\x69\x67\x6E\x63\x65\x6E\x74\x65\x72","\x61\x6C\x69\x67\x6E\x72\x69\x67\x68\x74","\x6A\x75\x73\x74\x69\x66\x79","\x70","\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65","\x70\x72\x65","\x68\x31","\x68\x32","\x68\x33","\x68\x34","\x68\x35","\x68\x36","\x68\x65\x61\x64","\x62\x6F\x64\x79","\x6D\x65\x74\x61","\x73\x63\x72\x69\x70\x74","\x73\x74\x79\x6C\x65","\x61\x70\x70\x6C\x65\x74","\x73\x74\x72\x6F\x6E\x67","\x65\x6D","\x3C\x70\x3E\x26\x23\x78\x32\x30\x30\x62\x3B\x3C\x2F\x70\x3E","\x26\x23\x78\x32\x30\x30\x62\x3B","\x50","\x48\x31","\x48\x32","\x48\x33","\x48\x34","\x48\x35","\x48\x36","\x44\x44","\x44\x4C","\x44\x54","\x44\x49\x56","\x54\x44","\x42\x4C\x4F\x43\x4B\x51\x55\x4F\x54\x45","\x4F\x55\x54\x50\x55\x54","\x46\x49\x47\x43\x41\x50\x54\x49\x4F\x4E","\x41\x44\x44\x52\x45\x53\x53","\x53\x45\x43\x54\x49\x4F\x4E","\x48\x45\x41\x44\x45\x52","\x46\x4F\x4F\x54\x45\x52","\x41\x53\x49\x44\x45","\x41\x52\x54\x49\x43\x4C\x45","\x61\x72\x65\x61","\x68\x72","\x69\x3F\x66\x72\x61\x6D\x65","\x6E\x6F\x73\x63\x72\x69\x70\x74","\x74\x62\x6F\x64\x79","\x74\x68\x65\x61\x64","\x74\x66\x6F\x6F\x74","\x6C\x69","\x64\x74","\x68\x5B\x31\x2D\x36\x5D","\x6F\x70\x74\x69\x6F\x6E","\x64\x69\x76","\x64\x6C","\x66\x69\x65\x6C\x64\x73\x65\x74","\x66\x6F\x72\x6D","\x66\x72\x61\x6D\x65\x73\x65\x74","\x6D\x61\x70","\x6F\x6C","\x73\x65\x6C\x65\x63\x74","\x74\x64","\x74\x68","\x74\x72","\x75\x6C","\x4C\x49","\x50\x52\x45","\x48\x54\x4D\x4C","\x49\x6E\x73\x65\x72\x74\x20\x56\x69\x64\x65\x6F","\x49\x6E\x73\x65\x72\x74\x20\x49\x6D\x61\x67\x65","\x54\x61\x62\x6C\x65","\x4C\x69\x6E\x6B","\x49\x6E\x73\x65\x72\x74\x20\x6C\x69\x6E\x6B","\x45\x64\x69\x74\x20\x6C\x69\x6E\x6B","\x55\x6E\x6C\x69\x6E\x6B","\x46\x6F\x72\x6D\x61\x74\x74\x69\x6E\x67","\x4E\x6F\x72\x6D\x61\x6C\x20\x74\x65\x78\x74","\x51\x75\x6F\x74\x65","\x43\x6F\x64\x65","\x48\x65\x61\x64\x65\x72\x20\x31","\x48\x65\x61\x64\x65\x72\x20\x32","\x48\x65\x61\x64\x65\x72\x20\x33","\x48\x65\x61\x64\x65\x72\x20\x34","\x48\x65\x61\x64\x65\x72\x20\x35","\x42\x6F\x6C\x64","\x49\x74\x61\x6C\x69\x63","\x46\x6F\x6E\x74\x20\x43\x6F\x6C\x6F\x72","\x42\x61\x63\x6B\x20\x43\x6F\x6C\x6F\x72","\x55\x6E\x6F\x72\x64\x65\x72\x65\x64\x20\x4C\x69\x73\x74","\x4F\x72\x64\x65\x72\x65\x64\x20\x4C\x69\x73\x74","\x4F\x75\x74\x64\x65\x6E\x74","\x49\x6E\x64\x65\x6E\x74","\x43\x61\x6E\x63\x65\x6C","\x49\x6E\x73\x65\x72\x74","\x53\x61\x76\x65","\x44\x65\x6C\x65\x74\x65","\x49\x6E\x73\x65\x72\x74\x20\x54\x61\x62\x6C\x65","\x41\x64\x64\x20\x52\x6F\x77\x20\x41\x62\x6F\x76\x65","\x41\x64\x64\x20\x52\x6F\x77\x20\x42\x65\x6C\x6F\x77","\x41\x64\x64\x20\x43\x6F\x6C\x75\x6D\x6E\x20\x4C\x65\x66\x74","\x41\x64\x64\x20\x43\x6F\x6C\x75\x6D\x6E\x20\x52\x69\x67\x68\x74","\x44\x65\x6C\x65\x74\x65\x20\x43\x6F\x6C\x75\x6D\x6E","\x44\x65\x6C\x65\x74\x65\x20\x52\x6F\x77","\x44\x65\x6C\x65\x74\x65\x20\x54\x61\x62\x6C\x65","\x52\x6F\x77\x73","\x43\x6F\x6C\x75\x6D\x6E\x73","\x41\x64\x64\x20\x48\x65\x61\x64","\x44\x65\x6C\x65\x74\x65\x20\x48\x65\x61\x64","\x54\x69\x74\x6C\x65","\x50\x6F\x73\x69\x74\x69\x6F\x6E","\x4E\x6F\x6E\x65","\x4C\x65\x66\x74","\x52\x69\x67\x68\x74","\x43\x65\x6E\x74\x65\x72","\x49\x6D\x61\x67\x65\x20\x57\x65\x62\x20\x4C\x69\x6E\x6B","\x54\x65\x78\x74","\x45\x6D\x61\x69\x6C","\x55\x52\x4C","\x56\x69\x64\x65\x6F\x20\x45\x6D\x62\x65\x64\x20\x43\x6F\x64\x65","\x49\x6E\x73\x65\x72\x74\x20\x46\x69\x6C\x65","\x55\x70\x6C\x6F\x61\x64","\x44\x6F\x77\x6E\x6C\x6F\x61\x64","\x43\x68\x6F\x6F\x73\x65","\x4F\x72\x20\x63\x68\x6F\x6F\x73\x65","\x44\x72\x6F\x70\x20\x66\x69\x6C\x65\x20\x68\x65\x72\x65","\x41\x6C\x69\x67\x6E\x20\x74\x65\x78\x74\x20\x74\x6F\x20\x74\x68\x65\x20\x6C\x65\x66\x74","\x43\x65\x6E\x74\x65\x72\x20\x74\x65\x78\x74","\x41\x6C\x69\x67\x6E\x20\x74\x65\x78\x74\x20\x74\x6F\x20\x74\x68\x65\x20\x72\x69\x67\x68\x74","\x4A\x75\x73\x74\x69\x66\x79\x20\x74\x65\x78\x74","\x49\x6E\x73\x65\x72\x74\x20\x48\x6F\x72\x69\x7A\x6F\x6E\x74\x61\x6C\x20\x52\x75\x6C\x65","\x44\x65\x6C\x65\x74\x65\x64","\x41\x6E\x63\x68\x6F\x72","\x4F\x70\x65\x6E\x20\x6C\x69\x6E\x6B\x20\x69\x6E\x20\x6E\x65\x77\x20\x74\x61\x62","\x55\x6E\x64\x65\x72\x6C\x69\x6E\x65","\x41\x6C\x69\x67\x6E\x6D\x65\x6E\x74","\x4E\x61\x6D\x65\x20\x28\x6F\x70\x74\x69\x6F\x6E\x61\x6C\x29","\x45\x64\x69\x74","\x72\x74\x65\x50\x61\x73\x74\x65","\x24\x65\x6C\x65\x6D\x65\x6E\x74","\x24\x73\x6F\x75\x72\x63\x65","\x75\x75\x69\x64","\x65\x78\x74\x65\x6E\x64","\x73\x74\x61\x72\x74","\x64\x72\x6F\x70\x64\x6F\x77\x6E\x73","\x73\x6F\x75\x72\x63\x65\x48\x65\x69\x67\x68\x74","\x68\x65\x69\x67\x68\x74","\x63\x73\x73","\x73\x6F\x75\x72\x63\x65\x57\x69\x64\x74\x68","\x77\x69\x64\x74\x68","\x66\x75\x6C\x6C\x70\x61\x67\x65","\x69\x66\x72\x61\x6D\x65","\x6C\x69\x6E\x65\x62\x72\x65\x61\x6B\x73","\x70\x61\x72\x61\x67\x72\x61\x70\x68\x79","\x74\x6F\x6F\x6C\x62\x61\x72\x46\x69\x78\x65\x64\x42\x6F\x78","\x74\x6F\x6F\x6C\x62\x61\x72\x46\x69\x78\x65\x64","\x64\x6F\x63\x75\x6D\x65\x6E\x74","\x77\x69\x6E\x64\x6F\x77","\x73\x61\x76\x65\x64\x53\x65\x6C","\x63\x6C\x65\x61\x6E\x6C\x69\x6E\x65\x42\x65\x66\x6F\x72\x65","\x5E\x3C\x28\x2F\x3F","\x7C\x2F\x3F","\x6A\x6F\x69\x6E","\x6F\x77\x6E\x4C\x69\x6E\x65","\x63\x6F\x6E\x74\x4F\x77\x6E\x4C\x69\x6E\x65","\x29\x5B\x20\x3E\x5D","\x63\x6C\x65\x61\x6E\x6C\x69\x6E\x65\x41\x66\x74\x65\x72","\x5E\x3C\x28\x62\x72\x7C\x2F\x3F","\x7C\x2F","\x63\x6C\x65\x61\x6E\x6E\x65\x77\x4C\x65\x76\x65\x6C","\x5E\x3C\x2F\x3F\x28","\x6E\x65\x77\x4C\x65\x76\x65\x6C","\x72\x54\x65\x73\x74\x42\x6C\x6F\x63\x6B","\x5E\x28","\x62\x6C\x6F\x63\x6B\x4C\x65\x76\x65\x6C\x45\x6C\x65\x6D\x65\x6E\x74\x73","\x29\x24","\x69","\x61\x6C\x6C\x6F\x77\x65\x64\x54\x61\x67\x73","\x64\x65\x6C","\x62","\x73\x74\x72\x69\x6B\x65","\x69\x6E\x41\x72\x72\x61\x79","\x2D\x31","\x64\x65\x6E\x69\x65\x64\x54\x61\x67\x73","\x73\x70\x6C\x69\x63\x65","\x6D\x73\x69\x65","\x62\x72\x6F\x77\x73\x65\x72","\x6F\x70\x65\x72\x61","\x62\x75\x74\x74\x6F\x6E\x73","\x72\x65\x6D\x6F\x76\x65\x46\x72\x6F\x6D\x41\x72\x72\x61\x79\x42\x79\x56\x61\x6C\x75\x65","\x63\x75\x72\x4C\x61\x6E\x67","\x6C\x61\x6E\x67","\x6C\x61\x6E\x67\x73","\x73\x68\x6F\x72\x74\x63\x75\x74\x73","\x73\x68\x6F\x72\x74\x63\x75\x74\x73\x41\x64\x64","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x49\x6E\x69\x74","\x62\x75\x69\x6C\x64\x53\x74\x61\x72\x74","\x74\x6F\x67\x67\x6C\x65","\x73\x68\x6F\x77","\x70\x61\x72\x61\x67\x72\x61\x70\x68","\x66\x6F\x72\x6D\x61\x74\x42\x6C\x6F\x63\x6B\x73","\x71\x75\x6F\x74\x65","\x66\x6F\x72\x6D\x61\x74\x51\x75\x6F\x74\x65","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x61\x74\x5F\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65","\x63\x6F\x64\x65","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x61\x74\x5F\x70\x72\x65","\x68\x65\x61\x64\x65\x72\x31","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x61\x74\x5F\x68\x31","\x68\x65\x61\x64\x65\x72\x32","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x61\x74\x5F\x68\x32","\x68\x65\x61\x64\x65\x72\x33","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x61\x74\x5F\x68\x33","\x68\x65\x61\x64\x65\x72\x34","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x61\x74\x5F\x68\x34","\x68\x65\x61\x64\x65\x72\x35","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x61\x74\x5F\x68\x35","\x73\x74\x72\x69\x6B\x65\x74\x68\x72\x6F\x75\x67\x68","\x26\x62\x75\x6C\x6C\x3B\x20","\x69\x6E\x73\x65\x72\x74\x75\x6E\x6F\x72\x64\x65\x72\x65\x64\x6C\x69\x73\x74","\x31\x2E\x20","\x69\x6E\x73\x65\x72\x74\x6F\x72\x64\x65\x72\x65\x64\x6C\x69\x73\x74","\x3C\x20","\x69\x6E\x64\x65\x6E\x74\x69\x6E\x67\x4F\x75\x74\x64\x65\x6E\x74","\x3E\x20","\x69\x6E\x64\x65\x6E\x74\x69\x6E\x67\x49\x6E\x64\x65\x6E\x74","\x69\x6D\x61\x67\x65\x53\x68\x6F\x77","\x76\x69\x64\x65\x6F\x53\x68\x6F\x77","\x66\x69\x6C\x65\x53\x68\x6F\x77","\x69\x6E\x73\x65\x72\x74\x5F\x74\x61\x62\x6C\x65","\x74\x61\x62\x6C\x65\x53\x68\x6F\x77","\x73\x65\x70\x61\x72\x61\x74\x6F\x72","\x69\x6E\x73\x65\x72\x74\x5F\x72\x6F\x77\x5F\x61\x62\x6F\x76\x65","\x74\x61\x62\x6C\x65\x41\x64\x64\x52\x6F\x77\x41\x62\x6F\x76\x65","\x69\x6E\x73\x65\x72\x74\x5F\x72\x6F\x77\x5F\x62\x65\x6C\x6F\x77","\x74\x61\x62\x6C\x65\x41\x64\x64\x52\x6F\x77\x42\x65\x6C\x6F\x77","\x69\x6E\x73\x65\x72\x74\x5F\x63\x6F\x6C\x75\x6D\x6E\x5F\x6C\x65\x66\x74","\x74\x61\x62\x6C\x65\x41\x64\x64\x43\x6F\x6C\x75\x6D\x6E\x4C\x65\x66\x74","\x69\x6E\x73\x65\x72\x74\x5F\x63\x6F\x6C\x75\x6D\x6E\x5F\x72\x69\x67\x68\x74","\x74\x61\x62\x6C\x65\x41\x64\x64\x43\x6F\x6C\x75\x6D\x6E\x52\x69\x67\x68\x74","\x61\x64\x64\x5F\x68\x65\x61\x64","\x74\x61\x62\x6C\x65\x41\x64\x64\x48\x65\x61\x64","\x64\x65\x6C\x65\x74\x65\x5F\x68\x65\x61\x64","\x74\x61\x62\x6C\x65\x44\x65\x6C\x65\x74\x65\x48\x65\x61\x64","\x64\x65\x6C\x65\x74\x65\x5F\x63\x6F\x6C\x75\x6D\x6E","\x74\x61\x62\x6C\x65\x44\x65\x6C\x65\x74\x65\x43\x6F\x6C\x75\x6D\x6E","\x64\x65\x6C\x65\x74\x65\x5F\x72\x6F\x77","\x74\x61\x62\x6C\x65\x44\x65\x6C\x65\x74\x65\x52\x6F\x77","\x64\x65\x6C\x65\x74\x65\x5F\x74\x61\x62\x6C\x65","\x74\x61\x62\x6C\x65\x44\x65\x6C\x65\x74\x65\x54\x61\x62\x6C\x65","\x6C\x69\x6E\x6B\x5F\x69\x6E\x73\x65\x72\x74","\x6C\x69\x6E\x6B\x53\x68\x6F\x77","\x75\x6E\x6C\x69\x6E\x6B","\x61\x6C\x69\x67\x6E\x5F\x6C\x65\x66\x74","\x61\x6C\x69\x67\x6E\x6D\x65\x6E\x74\x4C\x65\x66\x74","\x61\x6C\x69\x67\x6E\x5F\x63\x65\x6E\x74\x65\x72","\x61\x6C\x69\x67\x6E\x6D\x65\x6E\x74\x43\x65\x6E\x74\x65\x72","\x61\x6C\x69\x67\x6E\x5F\x72\x69\x67\x68\x74","\x61\x6C\x69\x67\x6E\x6D\x65\x6E\x74\x52\x69\x67\x68\x74","\x61\x6C\x69\x67\x6E\x5F\x6A\x75\x73\x74\x69\x66\x79","\x61\x6C\x69\x67\x6E\x6D\x65\x6E\x74\x4A\x75\x73\x74\x69\x66\x79","\x69\x6E\x73\x65\x72\x74\x68\x6F\x72\x69\x7A\x6F\x6E\x74\x61\x6C\x72\x75\x6C\x65","\x43\x61\x6C\x6C\x62\x61\x63\x6B","\x61\x75\x74\x6F\x73\x61\x76\x65\x49\x6E\x74\x65\x72\x76\x61\x6C","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x6F\x66\x66","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x65\x78\x74\x61\x72\x65\x61","\x72\x65\x6D\x6F\x76\x65\x44\x61\x74\x61","\x67\x65\x74","\x74\x65\x78\x74\x61\x72\x65\x61\x6D\x6F\x64\x65","\x61\x66\x74\x65\x72","\x24\x62\x6F\x78","\x72\x65\x6D\x6F\x76\x65","\x76\x61\x6C","\x24\x65\x64\x69\x74\x6F\x72","\x63\x6F\x6E\x74\x65\x6E\x74\x65\x64\x69\x74\x61\x62\x6C\x65","\x72\x65\x6D\x6F\x76\x65\x41\x74\x74\x72","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x65\x64\x69\x74\x6F\x72\x5F\x77\x79\x6D","\x72\x65\x6D\x6F\x76\x65\x43\x6C\x61\x73\x73","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x65\x64\x69\x74\x6F\x72","\x74\x6F\x6F\x6C\x62\x61\x72\x45\x78\x74\x65\x72\x6E\x61\x6C","","\x61\x69\x72","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x61\x69\x72\x5F","\x24\x66\x72\x61\x6D\x65","\x24\x74\x6F\x6F\x6C\x62\x61\x72","\x64\x69\x72","\x63\x68\x69\x6C\x64\x72\x65\x6E","\x63\x6F\x6E\x74\x65\x6E\x74\x73","\x6F\x75\x74\x65\x72\x48\x74\x6D\x6C","\x64\x69\x72\x65\x63\x74\x69\x6F\x6E","\x61\x74\x74\x72","\x26\x23\x33\x36\x3B","\x72\x65\x70\x6C\x61\x63\x65","\x73\x65\x74\x43\x6F\x64\x65\x49\x66\x72\x61\x6D\x65","\x73\x65\x74\x45\x64\x69\x74\x6F\x72","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x52\x65\x6D\x6F\x76\x65\x46\x72\x6F\x6D\x45\x64\x69\x74\x6F\x72","\x63\x6C\x65\x61\x6E\x53\x61\x76\x65\x50\x72\x65\x43\x6F\x64\x65","\x63\x6C\x65\x61\x6E\x53\x74\x72\x69\x70\x54\x61\x67\x73","\x63\x6C\x65\x61\x6E\x43\x6F\x6E\x76\x65\x72\x74\x50\x72\x6F\x74\x65\x63\x74\x65\x64","\x63\x6C\x65\x61\x6E\x43\x6F\x6E\x76\x65\x72\x74\x49\x6E\x6C\x69\x6E\x65\x54\x61\x67\x73","\x63\x6C\x65\x61\x6E\x43\x6F\x6E\x76\x65\x72\x74\x65\x72\x73","\x24\x32\x3C\x62\x72\x3E","\x24","\x63\x6C\x65\x61\x6E\x45\x6D\x70\x74\x79","\x73\x65\x74\x4E\x6F\x6E\x45\x64\x69\x74\x61\x62\x6C\x65","\x73\x65\x74\x53\x70\x61\x6E\x73\x56\x65\x72\x69\x66\x69\x65\x64","\x73\x79\x6E\x63","\x69\x66\x72\x61\x6D\x65\x50\x61\x67\x65","\x73\x72\x63","\x61\x62\x6F\x75\x74\x3A\x62\x6C\x61\x6E\x6B","\x63\x6C\x65\x61\x6E\x52\x65\x6D\x6F\x76\x65\x53\x70\x61\x63\x65\x73","\x6F\x70\x65\x6E","\x77\x72\x69\x74\x65","\x63\x6C\x6F\x73\x65","\x66\x69\x6E\x64","\x66\x75\x6C\x6C\x70\x61\x67\x65\x44\x6F\x63\x74\x79\x70\x65","\x6D\x61\x74\x63\x68","\x0A","\x73\x70\x61\x6E","\x69\x6E\x6C\x69\x6E\x65","\x6F\x75\x74\x65\x72\x48\x54\x4D\x4C","\x3C","\x74\x61\x67\x4E\x61\x6D\x65","\x67\x69","\x3C\x2F","\x72\x65\x70\x6C\x61\x63\x65\x57\x69\x74\x68","\x3C\x69\x6E\x6C\x69\x6E\x65\x24\x31\x3E","\x3C\x2F\x69\x6E\x6C\x69\x6E\x65\x3E","\x2E\x6E\x6F\x6E\x65\x64\x69\x74\x61\x62\x6C\x65","\x63\x6C\x65\x61\x6E\x55\x6E\x76\x65\x72\x69\x66\x69\x65\x64","\x67\x65\x74\x43\x6F\x64\x65\x49\x66\x72\x61\x6D\x65","\x73\x79\x6E\x63\x43\x6C\x65\x61\x6E","\x63\x6C\x65\x61\x6E\x52\x65\x6D\x6F\x76\x65\x45\x6D\x70\x74\x79\x54\x61\x67\x73","\x3C\x24\x31\x3E\x24\x32\x3C\x2F\x24\x31\x3E\x3C\x2F\x6C\x69\x3E","\x74\x72\x69\x6D","\x3C\x62\x72\x3E","\x78\x68\x74\x6D\x6C","\x62\x72","\x69\x6D\x67","\x69\x6E\x70\x75\x74","\x28\x2E\x2A\x3F\x5B\x5E\x2F\x24\x5D\x3F\x29\x3E","\x24\x31\x20\x2F\x3E","\x73\x79\x6E\x63\x42\x65\x66\x6F\x72\x65","\x63\x61\x6C\x6C\x62\x61\x63\x6B","\x73\x65\x74\x46\x75\x6C\x6C\x70\x61\x67\x65\x44\x6F\x63\x74\x79\x70\x65","\x73\x79\x6E\x63\x41\x66\x74\x65\x72","\x63\x68\x61\x6E\x67\x65","\x77\x68\x69\x63\x68","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x52\x65\x6D\x6F\x76\x65\x46\x72\x6F\x6D\x43\x6F\x64\x65","\x3C\x2F\x61\x3E\x20","\x3C\x70\x3E\x3C\x2F\x70\x3E","\x3C\x70\x3E\x20\x3C\x2F\x70\x3E","\x3C\x70\x3E\x26\x6E\x62\x73\x70\x3B\x3C\x2F\x70\x3E","\x6C\x69\x6E\x6B\x4E\x6F\x66\x6F\x6C\x6C\x6F\x77","\x3C\x61\x24\x31\x24\x32\x3E","\x3C\x61\x24\x31\x20\x72\x65\x6C\x3D\x22\x6E\x6F\x66\x6F\x6C\x6C\x6F\x77\x22\x3E","\x3C\x21\x2D\x2D\x3F\x70\x68\x70","\x3C\x3F\x70\x68\x70","\x3F\x2D\x2D\x3E","\x3F\x3E","\x3C\x24\x31\x63\x6C\x61\x73\x73\x3D\x22\x6E\x6F\x65\x64\x69\x74\x61\x62\x6C\x65\x22\x24\x32\x24\x33\x3E","\x3C\x2F\x24\x31\x3E","\x24\x33\x3C\x69\x6D\x67\x24\x34\x3E","\x63\x6C\x65\x61\x6E\x46\x6F\x6E\x74\x54\x61\x67","\x24\x32","\x24\x31","\x3C\x73\x70\x61\x6E\x3E","\x3C\x73\x70\x61\x6E\x20","\x3C\x2F\x73\x70\x61\x6E\x3E","\x72\x65\x6D\x6F\x76\x65\x45\x6D\x70\x74\x79\x54\x61\x67\x73","\x3C\x69\x6D\x67\x24\x31\x24\x32\x3E","\x26","\x26\x74\x72\x61\x64\x65\x3B","\x26\x63\x6F\x70\x79\x3B","\x26\x68\x65\x6C\x6C\x69\x70\x3B","\x26\x6D\x64\x61\x73\x68\x3B","\x26\x64\x61\x73\x68\x3B","\x63\x6C\x65\x61\x6E\x52\x65\x43\x6F\x6E\x76\x65\x72\x74\x50\x72\x6F\x74\x65\x63\x74\x65\x64","\x63\x6F\x6E\x74\x65\x6E\x74","\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x62\x6F\x78\x22\x20\x2F\x3E","\x54\x45\x58\x54\x41\x52\x45\x41","\x6D\x6F\x62\x69\x6C\x65","\x69\x73\x4D\x6F\x62\x69\x6C\x65","\x62\x75\x69\x6C\x64\x4D\x6F\x62\x69\x6C\x65","\x62\x75\x69\x6C\x64\x43\x6F\x6E\x74\x65\x6E\x74","\x61\x75\x74\x6F\x72\x65\x73\x69\x7A\x65","\x69\x66\x72\x61\x6D\x65\x53\x74\x61\x72\x74","\x62\x75\x69\x6C\x64\x46\x72\x6F\x6D\x54\x65\x78\x74\x61\x72\x65\x61","\x62\x75\x69\x6C\x64\x46\x72\x6F\x6D\x45\x6C\x65\x6D\x65\x6E\x74","\x62\x75\x69\x6C\x64\x4F\x70\x74\x69\x6F\x6E\x73","\x62\x75\x69\x6C\x64\x41\x66\x74\x65\x72","\x68\x69\x64\x65","\x62\x75\x69\x6C\x64\x43\x6F\x64\x65\x61\x72\x65\x61","\x61\x70\x70\x65\x6E\x64","\x69\x6E\x73\x65\x72\x74\x41\x66\x74\x65\x72","\x3C\x64\x69\x76\x20\x2F\x3E","\x62\x75\x69\x6C\x64\x41\x64\x64\x43\x6C\x61\x73\x73\x65\x73","\x62\x75\x69\x6C\x64\x45\x6E\x61\x62\x6C\x65","\x6E\x61\x6D\x65","\x69\x64","\x3C\x74\x65\x78\x74\x61\x72\x65\x61\x20\x2F\x3E","\x73\x70\x6C\x69\x74","\x63\x6C\x61\x73\x73\x4E\x61\x6D\x65","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F","\x61\x64\x64\x43\x6C\x61\x73\x73","\x73\x65\x74","\x74\x61\x62\x69\x6E\x64\x65\x78","\x6D\x69\x6E\x48\x65\x69\x67\x68\x74","\x6D\x69\x6E\x2D\x68\x65\x69\x67\x68\x74","\x70\x78","\x6D\x6F\x7A\x69\x6C\x6C\x61","\x34\x35\x70\x78","\x70\x61\x64\x64\x69\x6E\x67\x2D\x62\x6F\x74\x74\x6F\x6D","\x6D\x61\x78\x48\x65\x69\x67\x68\x74","\x77\x79\x6D","\x74\x79\x70\x65\x77\x72\x69\x74\x65\x72","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x65\x64\x69\x74\x6F\x72\x2D\x74\x79\x70\x65\x77\x72\x69\x74\x65\x72","\x74\x6F\x6F\x6C\x62\x61\x72","\x74\x6F\x6F\x6C\x62\x61\x72\x49\x6E\x69\x74","\x74\x6F\x6F\x6C\x62\x61\x72\x42\x75\x69\x6C\x64","\x6D\x6F\x64\x61\x6C\x54\x65\x6D\x70\x6C\x61\x74\x65\x73\x49\x6E\x69\x74","\x62\x75\x69\x6C\x64\x50\x6C\x75\x67\x69\x6E\x73","\x62\x75\x69\x6C\x64\x42\x69\x6E\x64\x4B\x65\x79\x62\x6F\x61\x72\x64","\x61\x75\x74\x6F\x73\x61\x76\x65","\x6F\x62\x73\x65\x72\x76\x65\x53\x74\x61\x72\x74","\x70\x72\x6F\x78\x79","\x65\x6E\x61\x62\x6C\x65\x4F\x62\x6A\x65\x63\x74\x52\x65\x73\x69\x7A\x69\x6E\x67","\x65\x78\x65\x63\x43\x6F\x6D\x6D\x61\x6E\x64","\x65\x6E\x61\x62\x6C\x65\x49\x6E\x6C\x69\x6E\x65\x54\x61\x62\x6C\x65\x45\x64\x69\x74\x69\x6E\x67","\x66\x6F\x63\x75\x73","\x76\x69\x73\x75\x61\x6C","\x64\x62\x6C\x45\x6E\x74\x65\x72","\x64\x72\x61\x67\x55\x70\x6C\x6F\x61\x64","\x69\x6D\x61\x67\x65\x55\x70\x6C\x6F\x61\x64","\x73\x33","\x64\x72\x6F\x70\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x44\x72\x6F\x70","\x6F\x6E","\x63\x6C\x69\x63\x6B\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x73\x65\x6C\x65\x63\x74\x61\x6C\x6C","\x69\x6E\x70\x75\x74\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x70\x61\x73\x74\x65\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x50\x61\x73\x74\x65","\x6B\x65\x79\x64\x6F\x77\x6E\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x4B\x65\x79\x64\x6F\x77\x6E","\x6B\x65\x79\x75\x70\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x4B\x65\x79\x75\x70","\x74\x65\x78\x74\x61\x72\x65\x61\x4B\x65\x79\x64\x6F\x77\x6E\x43\x61\x6C\x6C\x62\x61\x63\x6B","\x6B\x65\x79\x64\x6F\x77\x6E\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x65\x78\x74\x61\x72\x65\x61","\x66\x6F\x63\x75\x73\x43\x61\x6C\x6C\x62\x61\x63\x6B","\x66\x6F\x63\x75\x73\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x74\x61\x72\x67\x65\x74","\x6D\x6F\x75\x73\x65\x64\x6F\x77\x6E","\x62\x6C\x75\x72\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x6F\x6F\x6C\x62\x61\x72","\x68\x61\x73\x43\x6C\x61\x73\x73","\x73\x69\x7A\x65","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x6F\x6F\x6C\x62\x61\x72","\x70\x61\x72\x65\x6E\x74\x73","\x62\x6C\x75\x72\x43\x61\x6C\x6C\x62\x61\x63\x6B","\x62\x6C\x75\x72","\x6F\x72\x69\x67\x69\x6E\x61\x6C\x45\x76\x65\x6E\x74","\x46\x6F\x72\x6D\x44\x61\x74\x61","\x64\x61\x74\x61\x54\x72\x61\x6E\x73\x66\x65\x72","\x66\x69\x6C\x65\x73","\x70\x72\x65\x76\x65\x6E\x74\x44\x65\x66\x61\x75\x6C\x74","\x64\x6E\x62\x49\x6D\x61\x67\x65\x54\x79\x70\x65\x73","\x74\x79\x70\x65","\x69\x6E\x64\x65\x78\x4F\x66","\x62\x75\x66\x66\x65\x72\x53\x65\x74","\x73\x68\x6F\x77\x50\x72\x6F\x67\x72\x65\x73\x73\x42\x61\x72","\x69\x6D\x61\x67\x65\x55\x70\x6C\x6F\x61\x64\x50\x61\x72\x61\x6D","\x64\x72\x61\x67\x55\x70\x6C\x6F\x61\x64\x41\x6A\x61\x78","\x73\x33\x75\x70\x6C\x6F\x61\x64\x46\x69\x6C\x65","\x77\x65\x62\x6B\x69\x74","\x43\x68\x72\x6F\x6D\x65","\x75\x73\x65\x72\x41\x67\x65\x6E\x74","\x2E","\x76\x65\x72\x73\x69\x6F\x6E","\x63\x6C\x69\x70\x62\x6F\x61\x72\x64\x55\x70\x6C\x6F\x61\x64","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x43\x6C\x69\x70\x62\x6F\x61\x72\x64\x55\x70\x6C\x6F\x61\x64","\x63\x6C\x65\x61\x6E\x75\x70","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x53\x61\x76\x65","\x66\x75\x6C\x6C\x73\x63\x72\x65\x65\x6E","\x73\x61\x76\x65\x53\x63\x72\x6F\x6C\x6C","\x73\x63\x72\x6F\x6C\x6C\x54\x6F\x70","\x65\x78\x74\x72\x61\x63\x74\x43\x6F\x6E\x74\x65\x6E\x74","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x52\x65\x73\x74\x6F\x72\x65","\x67\x65\x74\x46\x72\x61\x67\x6D\x65\x6E\x74\x48\x74\x6D\x6C","\x70\x61\x73\x74\x65\x43\x6C\x65\x61\x6E","\x61\x75\x74\x6F","\x63\x6C\x69\x70\x62\x6F\x61\x72\x64\x46\x69\x6C\x65\x50\x61\x73\x74\x65","\x63\x6C\x69\x70\x62\x6F\x61\x72\x64\x44\x61\x74\x61","\x69\x74\x65\x6D\x73","\x67\x65\x74\x41\x73\x46\x69\x6C\x65","\x6F\x6E\x6C\x6F\x61\x64","\x70\x61\x73\x74\x65\x43\x6C\x69\x70\x62\x6F\x61\x72\x64\x55\x70\x6C\x6F\x61\x64","\x72\x65\x61\x64\x41\x73\x44\x61\x74\x61\x55\x52\x4C","\x63\x74\x72\x6C\x4B\x65\x79","\x6D\x65\x74\x61\x4B\x65\x79","\x67\x65\x74\x50\x61\x72\x65\x6E\x74","\x67\x65\x74\x43\x75\x72\x72\x65\x6E\x74","\x67\x65\x74\x42\x6C\x6F\x63\x6B","\x6B\x65\x79\x64\x6F\x77\x6E","\x6D\x6F\x64\x69\x66\x79","\x67\x65\x74\x53\x65\x6C\x65\x63\x74\x69\x6F\x6E","\x6B\x65\x79\x43\x6F\x64\x65","\x6C\x69\x6E\x65","\x77\x6F\x72\x64","\x6C\x65\x66\x74","\x73\x68\x69\x66\x74\x4B\x65\x79","\x63\x6F\x6C\x6C\x61\x70\x73\x65\x54\x6F\x53\x74\x61\x72\x74","\x72\x69\x67\x68\x74","\x63\x6F\x6C\x6C\x61\x70\x73\x65\x54\x6F\x45\x6E\x64","\x69\x6D\x61\x67\x65\x52\x65\x73\x69\x7A\x65\x48\x69\x64\x65","\x44\x4F\x57\x4E","\x69\x6E\x73\x65\x72\x74\x41\x66\x74\x65\x72\x4C\x61\x73\x74\x45\x6C\x65\x6D\x65\x6E\x74","\x70\x61\x72\x65\x6E\x74","\x61\x6C\x74\x4B\x65\x79","\x62\x75\x66\x66\x65\x72","\x62\x75\x66\x66\x65\x72\x55\x6E\x64\x6F","\x75\x6E\x64\x6F","\x72\x65\x62\x75\x66\x66\x65\x72","\x62\x75\x66\x66\x65\x72\x52\x65\x64\x6F","\x72\x65\x64\x6F","\x4C\x45\x46\x54\x5F\x57\x49\x4E","\x45\x4E\x54\x45\x52","\x67\x65\x74\x52\x61\x6E\x67\x65","\x63\x6F\x6C\x6C\x61\x70\x73\x65\x64","\x72\x61\x6E\x67\x65\x43\x6F\x75\x6E\x74","\x64\x65\x6C\x65\x74\x65\x43\x6F\x6E\x74\x65\x6E\x74\x73","\x6E\x6F\x64\x65\x54\x79\x70\x65","\x54\x48","\x63\x72\x65\x61\x74\x65\x45\x6C\x65\x6D\x65\x6E\x74","\x69\x6E\x73\x65\x72\x74\x4E\x6F\x64\x65","\x65\x6E\x74\x65\x72","\x69\x73\x45\x6E\x64\x4F\x66\x45\x6C\x65\x6D\x65\x6E\x74","\x69\x6E\x73\x65\x72\x74\x69\x6E\x67\x41\x66\x74\x65\x72\x4C\x61\x73\x74\x45\x6C\x65\x6D\x65\x6E\x74","\x6C\x61\x73\x74","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x4B\x65\x79\x64\x6F\x77\x6E\x50\x72\x65","\x74\x65\x78\x74","\x6E\x65\x78\x74","\x6F\x6C\x2C\x20\x75\x6C","\x63\x6C\x6F\x73\x65\x73\x74","\x3C\x70\x3E","\x69\x6E\x76\x69\x73\x69\x62\x6C\x65\x53\x70\x61\x63\x65","\x3C\x2F\x70\x3E","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x53\x74\x61\x72\x74","\x74\x65\x73\x74","\x72\x42\x6C\x6F\x63\x6B\x54\x65\x73\x74","\x72\x65\x70\x6C\x61\x63\x65\x4C\x69\x6E\x65\x42\x72\x65\x61\x6B","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x4B\x65\x79\x64\x6F\x77\x6E\x49\x6E\x73\x65\x72\x74\x4C\x69\x6E\x65\x42\x72\x65\x61\x6B","\x69\x6E\x73\x65\x72\x74\x4C\x69\x6E\x65\x42\x72\x65\x61\x6B","\x54\x41\x42","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x4B\x65\x79\x64\x6F\x77\x6E\x54\x61\x62","\x42\x41\x43\x4B\x53\x50\x41\x43\x45","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x4B\x65\x79\x64\x6F\x77\x6E\x42\x61\x63\x6B\x73\x70\x61\x63\x65","\x63\x72\x65\x61\x74\x65\x54\x65\x78\x74\x4E\x6F\x64\x65","\x73\x65\x61\x72\x63\x68","\x74\x61\x62\x46\x6F\x63\x75\x73","\x69\x73\x45\x6D\x70\x74\x79","\x74\x61\x62\x53\x70\x61\x63\x65\x73","\x09","\xA0","\x70\x61\x72\x65\x6E\x74\x4E\x6F\x64\x65","\x55\x4C","\x6E\x6F\x64\x65\x56\x61\x6C\x75\x65","\x70\x72\x65\x76","\x42\x4F\x44\x59","\x63\x6C\x6F\x6E\x65","\x42\x52","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x45\x6E\x64","\x63\x6F\x6E\x76\x65\x72\x74\x4C\x69\x6E\x6B\x73","\x63\x6F\x6E\x76\x65\x72\x74\x49\x6D\x61\x67\x65\x4C\x69\x6E\x6B\x73","\x63\x6F\x6E\x76\x65\x72\x74\x56\x69\x64\x65\x6F\x4C\x69\x6E\x6B\x73","\x62\x75\x69\x6C\x64\x45\x76\x65\x6E\x74\x4B\x65\x79\x75\x70\x43\x6F\x6E\x76\x65\x72\x74\x65\x72\x73","\x44\x45\x4C\x45\x54\x45","\x66\x6F\x72\x6D\x61\x74\x45\x6D\x70\x74\x79","\x6B\x65\x79\x75\x70","\x6C\x69\x6E\x6B\x50\x72\x6F\x74\x6F\x63\x6F\x6C","\x6C\x69\x6E\x6B\x53\x69\x7A\x65","\x66\x6F\x72\x6D\x61\x74\x4C\x69\x6E\x6B\x69\x66\x79","\x6F\x62\x73\x65\x72\x76\x65\x49\x6D\x61\x67\x65\x73","\x6F\x62\x73\x65\x72\x76\x65\x4C\x69\x6E\x6B\x73","\x70\x6C\x75\x67\x69\x6E\x73","\x69\x66\x72\x61\x6D\x65\x43\x72\x65\x61\x74\x65","\x69\x66\x72\x61\x6D\x65\x41\x70\x70\x65\x6E\x64","\x24\x73\x6F\x75\x72\x63\x65\x4F\x6C\x64","\x6C\x6F\x61\x64","\x69\x66\x72\x61\x6D\x65\x4C\x6F\x61\x64","\x6F\x6E\x65","\x3C\x69\x66\x72\x61\x6D\x65\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x20\x31\x30\x30\x25\x3B\x22\x20\x66\x72\x61\x6D\x65\x62\x6F\x72\x64\x65\x72\x3D\x22\x30\x22\x20\x2F\x3E","\x63\x6F\x6E\x74\x65\x6E\x74\x57\x69\x6E\x64\x6F\x77","\x69\x66\x72\x61\x6D\x65\x44\x6F\x63","\x64\x6F\x63\x75\x6D\x65\x6E\x74\x45\x6C\x65\x6D\x65\x6E\x74","\x72\x65\x6D\x6F\x76\x65\x43\x68\x69\x6C\x64","\x69\x73\x53\x74\x72\x69\x6E\x67","\x3C\x6C\x69\x6E\x6B\x20\x72\x65\x6C\x3D\x22\x73\x74\x79\x6C\x65\x73\x68\x65\x65\x74\x22\x20\x68\x72\x65\x66\x3D\x22","\x22\x20\x2F\x3E","\x69\x73\x41\x72\x72\x61\x79","\x69\x66\x72\x61\x6D\x65\x41\x64\x64\x43\x73\x73","\x6F\x77\x6E\x65\x72\x44\x6F\x63\x75\x6D\x65\x6E\x74","\x64\x65\x66\x61\x75\x6C\x74\x56\x69\x65\x77","\x73\x65\x74\x46\x75\x6C\x6C\x70\x61\x67\x65\x4F\x6E\x49\x6E\x69\x74","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x54\x65\x78\x74","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x4F\x6E\x46\x6F\x63\x75\x73","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x4F\x6E\x42\x6C\x75\x72","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x47\x65\x74","\x66\x6F\x63\x75\x73\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x46\x6F\x63\x75\x73","\x62\x6C\x75\x72\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x42\x6C\x75\x72","\x76\x65\x72\x69\x66\x69\x65\x64","\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x22\x3E","\x73\x70\x61\x6E\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72","\x65\x6D\x70\x74\x79\x48\x74\x6D\x6C","\x2C","\x73\x68\x6F\x72\x74\x63\x75\x74\x73\x48\x61\x6E\x64\x6C\x65\x72","\x62\x61\x63\x6B\x73\x70\x61\x63\x65","\x74\x61\x62","\x72\x65\x74\x75\x72\x6E","\x73\x68\x69\x66\x74","\x63\x74\x72\x6C","\x61\x6C\x74","\x70\x61\x75\x73\x65","\x63\x61\x70\x73\x6C\x6F\x63\x6B","\x65\x73\x63","\x73\x70\x61\x63\x65","\x70\x61\x67\x65\x75\x70","\x70\x61\x67\x65\x64\x6F\x77\x6E","\x65\x6E\x64","\x68\x6F\x6D\x65","\x75\x70","\x64\x6F\x77\x6E","\x69\x6E\x73\x65\x72\x74","\x3B","\x3D","\x30","\x31","\x32","\x33","\x34","\x35","\x36","\x37","\x38","\x39","\x2A","\x2B","\x2D","\x2F","\x66\x31","\x66\x32","\x66\x33","\x66\x34","\x66\x35","\x66\x36","\x66\x37","\x66\x38","\x66\x39","\x66\x31\x30","\x66\x31\x31","\x66\x31\x32","\x6E\x75\x6D\x6C\x6F\x63\x6B","\x73\x63\x72\x6F\x6C\x6C","\x60","\x5B","\x5C","\x5D","\x27","\x7E","\x21","\x40","\x23","\x25","\x5E","\x28","\x29","\x5F","\x3A\x20","\x22","\x3E","\x3F","\x20","\x74\x6F\x4C\x6F\x77\x65\x72\x43\x61\x73\x65","\x66\x72\x6F\x6D\x43\x68\x61\x72\x43\x6F\x64\x65","\x4B\x65\x79","\x73\x68\x69\x66\x74\x2B","\x66\x6F\x63\x75\x73\x53\x65\x74","\x73\x65\x74\x54\x69\x6D\x65\x6F\x75\x74","\x73\x65\x6C\x65\x63\x74\x4E\x6F\x64\x65\x43\x6F\x6E\x74\x65\x6E\x74\x73","\x63\x6F\x6C\x6C\x61\x70\x73\x65","\x72\x65\x6D\x6F\x76\x65\x41\x6C\x6C\x52\x61\x6E\x67\x65\x73","\x61\x64\x64\x52\x61\x6E\x67\x65","\x74\x6F\x67\x67\x6C\x65\x43\x6F\x64\x65","\x74\x6F\x67\x67\x6C\x65\x56\x69\x73\x75\x61\x6C","\x6D\x6F\x64\x69\x66\x69\x65\x64","\x6B\x65\x79\x64\x6F\x77\x6E\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x65\x78\x74\x61\x72\x65\x61\x2D\x69\x6E\x64\x65\x6E\x74\x69\x6E\x67","\x62\x75\x74\x74\x6F\x6E\x41\x63\x74\x69\x76\x65\x56\x69\x73\x75\x61\x6C","\x62\x75\x74\x74\x6F\x6E\x49\x6E\x61\x63\x74\x69\x76\x65","\x69\x6E\x6E\x65\x72\x48\x65\x69\x67\x68\x74","\x74\x69\x64\x79\x48\x74\x6D\x6C","\x63\x6C\x65\x61\x6E\x48\x74\x6D\x6C","\x74\x65\x78\x74\x61\x72\x65\x61\x49\x6E\x64\x65\x6E\x74\x69\x6E\x67","\x62\x75\x74\x74\x6F\x6E\x49\x6E\x61\x63\x74\x69\x76\x65\x56\x69\x73\x75\x61\x6C","\x62\x75\x74\x74\x6F\x6E\x41\x63\x74\x69\x76\x65","\x73\x75\x62\x73\x74\x72\x69\x6E\x67","\x70\x6F\x73\x74","\x6E\x61\x6D\x65\x3D","\x70\x61\x72\x73\x65\x4A\x53\x4F\x4E","\x61\x75\x74\x6F\x73\x61\x76\x65\x45\x72\x72\x6F\x72","\x61\x6A\x61\x78","\x62\x75\x74\x74\x6F\x6E\x73\x48\x69\x64\x65\x4F\x6E\x4D\x6F\x62\x69\x6C\x65","\x61\x69\x72\x42\x75\x74\x74\x6F\x6E\x73","\x62\x75\x74\x74\x6F\x6E\x53\x6F\x75\x72\x63\x65","\x64\x72\x6F\x70\x64\x6F\x77\x6E","\x66\x6F\x72\x6D\x61\x74\x74\x69\x6E\x67\x54\x61\x67\x73","\x61\x69\x72\x45\x6E\x61\x62\x6C\x65","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x6F\x6F\x6C\x62\x61\x72\x5F","\x3C\x75\x6C\x3E","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x6F\x6F\x6C\x62\x61\x72\x2D\x74\x79\x70\x65\x77\x72\x69\x74\x65\x72","\x74\x6F\x6F\x6C\x62\x61\x72\x4F\x76\x65\x72\x66\x6C\x6F\x77","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x6F\x6F\x6C\x62\x61\x72\x2D\x6F\x76\x65\x72\x66\x6C\x6F\x77","\x24\x61\x69\x72","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x61\x69\x72\x5F","\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x61\x69\x72\x22\x3E","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x6F\x6F\x6C\x62\x61\x72\x2D\x65\x78\x74\x65\x72\x6E\x61\x6C","\x70\x72\x65\x70\x65\x6E\x64","\x66\x69\x6C\x65\x55\x70\x6C\x6F\x61\x64","\x62\x75\x74\x74\x6F\x6E\x42\x75\x69\x6C\x64","\x3C\x6C\x69\x3E","\x61","\x74\x6F\x6F\x6C\x62\x61\x72\x4F\x62\x73\x65\x72\x76\x65\x53\x63\x72\x6F\x6C\x6C","\x73\x63\x72\x6F\x6C\x6C\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x74\x6F\x6F\x6C\x62\x61\x72\x46\x69\x78\x65\x64\x54\x61\x72\x67\x65\x74","\x61\x63\x74\x69\x76\x65\x42\x75\x74\x74\x6F\x6E\x73","\x6D\x6F\x75\x73\x65\x75\x70\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x20\x6B\x65\x79\x75\x70\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x62\x75\x74\x74\x6F\x6E\x41\x63\x74\x69\x76\x65\x4F\x62\x73\x65\x72\x76\x65\x72","\x74\x6F\x70","\x6F\x66\x66\x73\x65\x74","\x31\x30\x30\x25","\x69\x6E\x6E\x65\x72\x57\x69\x64\x74\x68","\x74\x6F\x6F\x6C\x62\x61\x72\x5F\x66\x69\x78\x65\x64\x5F\x62\x6F\x78","\x66\x69\x78\x65\x64","\x74\x6F\x6F\x6C\x62\x61\x72\x46\x69\x78\x65\x64\x54\x6F\x70\x4F\x66\x66\x73\x65\x74","\x61\x62\x73\x6F\x6C\x75\x74\x65","\x76\x69\x73\x69\x62\x69\x6C\x69\x74\x79","\x76\x69\x73\x69\x62\x6C\x65","\x68\x69\x64\x64\x65\x6E","\x72\x65\x6C\x61\x74\x69\x76\x65","\x67\x65\x74\x53\x65\x6C\x65\x63\x74\x69\x6F\x6E\x54\x65\x78\x74","\x6D\x6F\x75\x73\x65\x75\x70","\x61\x69\x72\x53\x68\x6F\x77","\x66\x6F\x63\x75\x73\x4E\x6F\x64\x65","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x61\x69\x72","\x70\x6F\x73\x69\x74\x69\x6F\x6E","\x63\x6C\x69\x65\x6E\x74\x58","\x63\x6C\x69\x65\x6E\x74\x59","\x61\x69\x72\x42\x69\x6E\x64\x48\x69\x64\x65","\x45\x53\x43","\x66\x61\x64\x65\x4F\x75\x74","\x6D\x6F\x75\x73\x65\x64\x6F\x77\x6E\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x52\x65\x6D\x6F\x76\x65","\x6D\x6F\x75\x73\x65\x6D\x6F\x76\x65\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x3C\x61\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x73\x65\x70\x61\x72\x61\x74\x6F\x72\x5F\x64\x72\x6F\x70\x22\x3E","\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x23\x22\x20\x63\x6C\x61\x73\x73\x3D\x22","\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x64\x72\x6F\x70\x64\x6F\x77\x6E\x5F","\x22\x3E","\x74\x69\x74\x6C\x65","\x3C\x2F\x61\x3E","\x63\x6C\x69\x63\x6B","\x72\x65\x74\x75\x72\x6E\x56\x61\x6C\x75\x65","\x65\x78\x65\x63","\x66\x75\x6E\x63","\x62\x75\x74\x74\x6F\x6E\x47\x65\x74","\x61\x70\x70\x65\x6E\x64\x54\x6F","\x64\x72\x6F\x70\x61\x63\x74","\x64\x72\x6F\x70\x64\x6F\x77\x6E\x48\x69\x64\x65\x41\x6C\x6C","\x64\x72\x6F\x70\x64\x6F\x77\x6E\x53\x68\x6F\x77","\x64\x72\x6F\x70\x64\x6F\x77\x6E\x53\x68\x6F\x77\x6E","\x64\x72\x6F\x70\x64\x6F\x77\x6E\x48\x69\x64\x65","\x74\x6F\x75\x63\x68\x73\x74\x61\x72\x74","\x73\x74\x6F\x70\x50\x72\x6F\x70\x61\x67\x61\x74\x69\x6F\x6E","\x66\x6F\x63\x75\x73\x57\x69\x74\x68\x53\x61\x76\x65\x53\x63\x72\x6F\x6C\x6C","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x61\x63\x74","\x61\x2E\x64\x72\x6F\x70\x61\x63\x74","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x64\x72\x6F\x70\x64\x6F\x77\x6E","\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x3A\x3B\x22\x20\x74\x69\x74\x6C\x65\x3D\x22","\x22\x20\x74\x61\x62\x69\x6E\x64\x65\x78\x3D\x22\x2D\x31\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x2D\x69\x63\x6F\x6E\x20\x72\x65\x2D","\x22\x3E\x3C\x2F\x61\x3E","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x62\x74\x6E\x2D\x69\x6D\x61\x67\x65","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x62\x75\x74\x74\x6F\x6E\x5F\x64\x69\x73\x61\x62\x6C\x65\x64","\x69\x73\x46\x6F\x63\x75\x73\x65\x64","\x61\x69\x72\x42\x69\x6E\x64\x4D\x6F\x75\x73\x65\x6D\x6F\x76\x65\x48\x69\x64\x65","\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x64\x72\x6F\x70\x64\x6F\x77\x6E\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x64\x72\x6F\x70\x64\x6F\x77\x6E\x5F\x62\x6F\x78\x5F","\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x3E","\x64\x72\x6F\x70\x64\x6F\x77\x6E\x42\x75\x69\x6C\x64","\x61\x2E\x72\x65\x2D","\x61\x63\x74\x69\x76\x65\x42\x75\x74\x74\x6F\x6E\x73\x53\x74\x61\x74\x65\x73","\x2E\x72\x65\x2D","\x6E\x6F\x74","\x61\x2E\x72\x65\x2D\x69\x63\x6F\x6E","\x61\x2E\x72\x65\x2D\x68\x74\x6D\x6C","\x72\x65\x2D","\x66\x61\x2D\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x62\x74\x6E","\x3C\x69\x20\x63\x6C\x61\x73\x73\x3D\x22\x66\x61\x20","\x22\x3E\x3C\x2F\x69\x3E","\x62\x65\x66\x6F\x72\x65","\x62\x75\x74\x74\x6F\x6E\x49\x6E\x61\x63\x74\x69\x76\x65\x41\x6C\x6C","\x62\x75\x74\x74\x6F\x6E\x41\x63\x74\x69\x76\x65\x54\x6F\x67\x67\x6C\x65","\x41","\x6C\x69\x6E\x6B\x5F\x65\x64\x69\x74","\x61\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x64\x72\x6F\x70\x64\x6F\x77\x6E\x5F\x6C\x69\x6E\x6B","\x61\x6C\x69\x67\x6E\x6D\x65\x6E\x74\x54\x61\x67\x73","\x74\x65\x78\x74\x2D\x61\x6C\x69\x67\x6E","\x61\x6C\x69\x67\x6E","\x67\x65\x74\x52\x61\x6E\x67\x65\x41\x74","\x69\x6E\x6E\x65\x72\x48\x54\x4D\x4C","\x63\x72\x65\x61\x74\x65\x44\x6F\x63\x75\x6D\x65\x6E\x74\x46\x72\x61\x67\x6D\x65\x6E\x74","\x61\x70\x70\x65\x6E\x64\x43\x68\x69\x6C\x64","\x66\x69\x72\x73\x74\x43\x68\x69\x6C\x64","\x63\x6C\x6F\x6E\x65\x52\x61\x6E\x67\x65","\x73\x65\x74\x53\x74\x61\x72\x74\x41\x66\x74\x65\x72","\x66\x6F\x72\x6D\x61\x74\x62\x6C\x6F\x63\x6B","\x69\x6E\x73\x65\x72\x74\x68\x74\x6D\x6C","\x69\x73\x49\x65\x31\x31","\x70\x61\x73\x74\x65\x48\x54\x4D\x4C","\x63\x72\x65\x61\x74\x65\x52\x61\x6E\x67\x65","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E","\x65\x78\x65\x63\x50\x61\x73\x74\x65\x46\x72\x61\x67","\x73\x75\x70\x65\x72\x73\x63\x72\x69\x70\x74","\x73\x75\x62\x73\x63\x72\x69\x70\x74","\x53\x55\x50","\x53\x55\x42","\x69\x6E\x6C\x69\x6E\x65\x52\x65\x6D\x6F\x76\x65\x46\x6F\x72\x6D\x61\x74\x52\x65\x70\x6C\x61\x63\x65","\x69\x6E\x73\x65\x72\x74\x48\x74\x6D\x6C","\x63\x75\x72\x72\x65\x6E\x74\x4F\x72\x50\x61\x72\x65\x6E\x74\x49\x73","\x66\x6F\x72\x6D\x61\x74\x74\x69\x6E\x67\x50\x72\x65","\x65\x78\x65\x63\x4C\x69\x73\x74\x73","\x65\x78\x65\x63\x55\x6E\x6C\x69\x6E\x6B","\x69\x73\x50\x61\x72\x65\x6E\x74\x52\x65\x64\x61\x63\x74\x6F\x72","\x4F\x4C","\x67\x65\x74\x4E\x6F\x64\x65\x73","\x67\x65\x74\x42\x6C\x6F\x63\x6B\x73","\x75\x6E\x73\x68\x69\x66\x74","\x65\x6D\x70\x74\x79","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x72\x65\x70\x6C\x61\x63\x65\x64","\x3A\x65\x6D\x70\x74\x79","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x57\x72\x61\x70","\x3C\x6F\x6C\x3E","\x3C\x73\x70\x61\x6E\x20\x69\x64\x3D\x22\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x31\x22\x3E","\x23\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x31","\x3C\x74\x64\x3E","\x77\x72\x61\x70\x41\x6C\x6C","\x6E\x6F\x64\x65\x54\x65\x73\x74\x42\x6C\x6F\x63\x6B\x73","\x69\x6E\x64\x65\x6E\x74\x69\x6E\x67\x53\x74\x61\x72\x74","\x75\x6C\x2C\x20\x6F\x6C","\x66\x6F\x72\x6D\x61\x74\x42\x6C\x6F\x63\x6B","\x3C\x64\x69\x76\x20\x64\x61\x74\x61\x2D\x74\x61\x67\x62\x6C\x6F\x63\x6B\x3D\x22\x22\x3E","\x6D\x61\x72\x67\x69\x6E\x2D\x6C\x65\x66\x74","\x6E\x6F\x72\x6D\x61\x6C\x69\x7A\x65","\x69\x6E\x64\x65\x6E\x74\x56\x61\x6C\x75\x65","\x69\x6E\x73\x69\x64\x65\x4F\x75\x74\x64\x65\x6E\x74","\x74\x61\x67\x62\x6C\x6F\x63\x6B","\x72\x65\x6D\x6F\x76\x65\x45\x6D\x70\x74\x79\x41\x74\x74\x72","\x4A\x75\x73\x74\x69\x66\x79\x4C\x65\x66\x74","\x61\x6C\x69\x67\x6E\x6D\x65\x6E\x74\x53\x65\x74","\x4A\x75\x73\x74\x69\x66\x79\x52\x69\x67\x68\x74","\x63\x65\x6E\x74\x65\x72","\x4A\x75\x73\x74\x69\x66\x79\x43\x65\x6E\x74\x65\x72","\x4A\x75\x73\x74\x69\x66\x79\x46\x75\x6C\x6C","\x6F\x6C\x64\x49\x45","\x70\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72\x53\x74\x61\x72\x74","\x3C\x68\x72\x3E","\x63\x6F\x6E\x76\x65\x72\x74\x44\x69\x76\x73","\x67\x61\x6C\x6C\x65\x72\x79","\x3C\x70\x24\x31\x3E\x24\x32\x3C\x2F\x70\x3E","\x63\x6C\x65\x61\x6E\x50\x61\x72\x61\x67\x72\x61\x70\x68\x79","\x74\x65\x6D\x70\x6C\x61\x74\x65\x56\x61\x72\x73","\x3C\x21\x2D\x2D\x20\x74\x65\x6D\x70\x6C\x61\x74\x65\x20\x64\x6F\x75\x62\x6C\x65\x20\x24\x31\x20\x2D\x2D\x3E","\x3C\x21\x2D\x2D\x20\x74\x65\x6D\x70\x6C\x61\x74\x65\x20\x24\x31\x20\x2D\x2D\x3E","\x3C\x74\x69\x74\x6C\x65\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x73\x63\x72\x69\x70\x74\x2D\x74\x61\x67\x22\x24\x31\x3E\x24\x32\x3C\x2F\x74\x69\x74\x6C\x65\x3E","\x3C\x73\x65\x63\x74\x69\x6F\x6E\x24\x31\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x20\x72\x65\x6C\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x73\x74\x79\x6C\x65\x2D\x74\x61\x67\x22\x3E\x24\x32\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E","\x3C\x73\x65\x63\x74\x69\x6F\x6E\x24\x31\x20\x72\x65\x6C\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x66\x6F\x72\x6D\x2D\x74\x61\x67\x22\x3E\x24\x32\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E","\x70\x68\x70\x54\x61\x67\x73","\x3C\x73\x65\x63\x74\x69\x6F\x6E\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x20\x72\x65\x6C\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x70\x68\x70\x2D\x74\x61\x67\x22\x3E\x24\x31\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E","\x7B\x7B\x24\x31\x7D\x7D","\x7B\x24\x31\x7D","\x3C\x73\x63\x72\x69\x70\x74\x24\x31\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x22\x3E\x24\x32\x3C\x2F\x73\x63\x72\x69\x70\x74\x3E","\x3C\x73\x74\x79\x6C\x65\x24\x31\x3E\x24\x32\x3C\x2F\x73\x74\x79\x6C\x65\x3E","\x3C\x66\x6F\x72\x6D\x24\x31\x24\x32\x3E\x24\x33\x3C\x2F\x66\x6F\x72\x6D\x3E","\x3C\x3F\x70\x68\x70\x0D\x0A\x24\x31\x0D\x0A\x3F\x3E","\x6D\x65\x72\x67\x65","\x62\x75\x66\x66\x65\x72\x5F","\x3E\x20\x3C","\x63\x6C\x65\x61\x6E\x52\x65\x70\x6C\x61\x63\x65\x72","\x3C\x62\x3E\x5C\x73\x2A\x3C\x2F\x62\x3E","\x3C\x62\x3E\x26\x6E\x62\x73\x70\x3B\x3C\x2F\x62\x3E","\x3C\x65\x6D\x3E\x5C\x73\x2A\x3C\x2F\x65\x6D\x3E","\x3C\x70\x72\x65\x3E\x3C\x2F\x70\x72\x65\x3E","\x3C\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65\x3E\x5C\x73\x2A\x3C\x2F\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65\x3E","\x3C\x64\x64\x3E\x3C\x2F\x64\x64\x3E","\x3C\x64\x74\x3E\x3C\x2F\x64\x74\x3E","\x3C\x75\x6C\x3E\x3C\x2F\x75\x6C\x3E","\x3C\x6F\x6C\x3E\x3C\x2F\x6F\x6C\x3E","\x3C\x6C\x69\x3E\x3C\x2F\x6C\x69\x3E","\x3C\x74\x61\x62\x6C\x65\x3E\x3C\x2F\x74\x61\x62\x6C\x65\x3E","\x3C\x74\x72\x3E\x3C\x2F\x74\x72\x3E","\x3C\x73\x70\x61\x6E\x3E\x5C\x73\x2A\x3C\x73\x70\x61\x6E\x3E","\x3C\x73\x70\x61\x6E\x3E\x26\x6E\x62\x73\x70\x3B\x3C\x73\x70\x61\x6E\x3E","\x3C\x70\x3E\x5C\x73\x2A\x3C\x2F\x70\x3E","\x3C\x70\x3E\x5C\x73\x2A\x3C\x62\x72\x3E\x5C\x73\x2A\x3C\x2F\x70\x3E","\x3C\x64\x69\x76\x3E\x5C\x73\x2A\x3C\x2F\x64\x69\x76\x3E","\x3C\x64\x69\x76\x3E\x5C\x73\x2A\x3C\x62\x72\x3E\x5C\x73\x2A\x3C\x2F\x64\x69\x76\x3E","\x63\x6F\x6E\x63\x61\x74","\x7B\x72\x65\x70\x6C\x61\x63\x65","\x7D\x0A","\x0A\x0A","\x28\x63\x6F\x6D\x6D\x65\x6E\x74\x7C\x68\x74\x6D\x6C\x7C\x62\x6F\x64\x79\x7C\x68\x65\x61\x64\x7C\x74\x69\x74\x6C\x65\x7C\x6D\x65\x74\x61\x7C\x73\x74\x79\x6C\x65\x7C\x73\x63\x72\x69\x70\x74\x7C\x6C\x69\x6E\x6B\x7C\x69\x66\x72\x61\x6D\x65\x7C\x74\x61\x62\x6C\x65\x7C\x74\x68\x65\x61\x64\x7C\x74\x66\x6F\x6F\x74\x7C\x63\x61\x70\x74\x69\x6F\x6E\x7C\x63\x6F\x6C\x7C\x63\x6F\x6C\x67\x72\x6F\x75\x70\x7C\x74\x62\x6F\x64\x79\x7C\x74\x72\x7C\x74\x64\x7C\x74\x68\x7C\x64\x69\x76\x7C\x64\x6C\x7C\x64\x64\x7C\x64\x74\x7C\x75\x6C\x7C\x6F\x6C\x7C\x6C\x69\x7C\x70\x72\x65\x7C\x73\x65\x6C\x65\x63\x74\x7C\x6F\x70\x74\x69\x6F\x6E\x7C\x66\x6F\x72\x6D\x7C\x6D\x61\x70\x7C\x61\x72\x65\x61\x7C\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65\x7C\x61\x64\x64\x72\x65\x73\x73\x7C\x6D\x61\x74\x68\x7C\x73\x74\x79\x6C\x65\x7C\x70\x7C\x68\x5B\x31\x2D\x36\x5D\x7C\x68\x72\x7C\x66\x69\x65\x6C\x64\x73\x65\x74\x7C\x6C\x65\x67\x65\x6E\x64\x7C\x73\x65\x63\x74\x69\x6F\x6E\x7C\x61\x72\x74\x69\x63\x6C\x65\x7C\x61\x73\x69\x64\x65\x7C\x68\x67\x72\x6F\x75\x70\x7C\x68\x65\x61\x64\x65\x72\x7C\x66\x6F\x6F\x74\x65\x72\x7C\x6E\x61\x76\x7C\x66\x69\x67\x75\x72\x65\x7C\x66\x69\x67\x63\x61\x70\x74\x69\x6F\x6E\x7C\x64\x65\x74\x61\x69\x6C\x73\x7C\x6D\x65\x6E\x75\x7C\x73\x75\x6D\x6D\x61\x72\x79\x29","\x28\x3C","\x5B\x5E\x3E\x5D\x2A\x3E\x29","\x0A\x24\x31","\x28\x3C\x2F","\x3E\x29","\x24\x31\x0A\x0A","\x0D\x0A","\x67","\x0D","\x2F\x0A\x0A\x2B\x2F","\x0A\x73\x2A\x0A","\x68\x61\x73\x4F\x77\x6E\x50\x72\x6F\x70\x65\x72\x74\x79","\x3C\x70\x3E\x3C\x70\x3E","\x3C\x2F\x70\x3E\x3C\x2F\x70\x3E","\x3C\x70\x3E\x73\x3F\x3C\x2F\x70\x3E","\x3C\x70\x3E\x28\x5B\x5E\x3C\x5D\x2B\x29\x3C\x2F\x28\x64\x69\x76\x7C\x61\x64\x64\x72\x65\x73\x73\x7C\x66\x6F\x72\x6D\x29\x3E","\x3C\x70\x3E\x24\x31\x3C\x2F\x70\x3E\x3C\x2F\x24\x32\x3E","\x3C\x70\x3E\x28\x3C\x2F\x3F","\x5B\x5E\x3E\x5D\x2A\x3E\x29\x3C\x2F\x70\x3E","\x3C\x70\x3E\x28\x3C\x6C\x69\x2E\x2B\x3F\x29\x3C\x2F\x70\x3E","\x3C\x70\x3E\x73\x3F\x28\x3C\x2F\x3F","\x28\x3C\x2F\x3F","\x5B\x5E\x3E\x5D\x2A\x3E\x29\x73\x3F\x3C\x2F\x70\x3E","\x5B\x5E\x3E\x5D\x2A\x3E\x29\x73\x3F\x3C\x62\x72\x20\x2F\x3E","\x3C\x62\x72\x20\x2F\x3E\x28\x73\x2A\x3C\x2F\x3F\x28\x3F\x3A\x70\x7C\x6C\x69\x7C\x64\x69\x76\x7C\x64\x6C\x7C\x64\x64\x7C\x64\x74\x7C\x74\x68\x7C\x70\x72\x65\x7C\x74\x64\x7C\x75\x6C\x7C\x6F\x6C\x29\x5B\x5E\x3E\x5D\x2A\x3E\x29","\x0A\x3C\x2F\x70\x3E","\x3C\x6C\x69\x3E\x3C\x70\x3E","\x3C\x2F\x70\x3E\x3C\x2F\x6C\x69\x3E","\x3C\x2F\x6C\x69\x3E","\x3C\x2F\x6C\x69\x3E\x3C\x70\x3E","\x3C\x70\x3E\x09\x3F\x0A\x3F\x3C\x70\x3E","\x3C\x2F\x64\x74\x3E\x3C\x70\x3E","\x3C\x2F\x64\x74\x3E","\x3C\x2F\x64\x64\x3E\x3C\x70\x3E","\x3C\x2F\x64\x64\x3E","\x3C\x62\x72\x3E\x3C\x2F\x70\x3E\x3C\x2F\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65\x3E","\x3C\x2F\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65\x3E","\x3C\x70\x3E\x09\x2A\x3C\x2F\x70\x3E","\x7D","\x62\x6F\x6C\x64\x54\x61\x67","\x69\x74\x61\x6C\x69\x63\x54\x61\x67","\x3E\x24\x31\x3C\x2F","\x3C\x73\x74\x72\x6F\x6E\x67\x3E\x24\x31\x3C\x2F\x73\x74\x72\x6F\x6E\x67\x3E","\x3C\x62\x3E\x24\x31\x3C\x2F\x62\x3E","\x3C\x65\x6D\x3E\x24\x31\x3C\x2F\x65\x6D\x3E","\x3C\x69\x3E\x24\x31\x3C\x2F\x69\x3E","\x3C\x75\x3E\x24\x31\x3C\x2F\x75\x3E","\x3C\x64\x65\x6C\x3E\x24\x31\x3C\x2F\x64\x65\x6C\x3E","\x3C\x73\x74\x72\x69\x6B\x65\x3E\x24\x31\x3C\x2F\x73\x74\x72\x69\x6B\x65\x3E","\x63\x6C\x65\x61\x6E\x45\x6E\x63\x6F\x64\x65\x45\x6E\x74\x69\x74\x69\x65\x73","\x26\x71\x75\x6F\x74\x3B","\x26\x67\x74\x3B","\x26\x6C\x74\x3B","\x26\x61\x6D\x70\x3B","\x6C\x69\x2C\x20\x69\x6D\x67\x2C\x20\x61\x2C\x20\x62\x2C\x20\x73\x74\x72\x6F\x6E\x67\x2C\x20\x73\x75\x62\x2C\x20\x73\x75\x70\x2C\x20\x69\x2C\x20\x65\x6D\x2C\x20\x75\x2C\x20\x73\x6D\x61\x6C\x6C\x2C\x20\x73\x74\x72\x69\x6B\x65\x2C\x20\x64\x65\x6C\x2C\x20\x73\x70\x61\x6E\x2C\x20\x63\x69\x74\x65","\x6C\x69\x6E\x65\x2D\x68\x65\x69\x67\x68\x74","\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x2D\x63\x6F\x6C\x6F\x72","\x5B\x73\x74\x79\x6C\x65\x2A\x3D\x22\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x2D\x63\x6F\x6C\x6F\x72\x3A\x20\x74\x72\x61\x6E\x73\x70\x61\x72\x65\x6E\x74\x3B\x22\x5D\x5B\x73\x74\x79\x6C\x65\x2A\x3D\x22\x6C\x69\x6E\x65\x2D\x68\x65\x69\x67\x68\x74\x22\x5D","\x66\x69\x6C\x74\x65\x72","\x5B\x73\x74\x79\x6C\x65\x2A\x3D\x22\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x2D\x63\x6F\x6C\x6F\x72\x3A\x20\x74\x72\x61\x6E\x73\x70\x61\x72\x65\x6E\x74\x3B\x22\x5D","\x62\x2C\x20\x73\x74\x72\x6F\x6E\x67\x2C\x20\x69\x2C\x20\x65\x6D\x2C\x20\x75\x2C\x20\x73\x74\x72\x69\x6B\x65\x2C\x20\x64\x65\x6C","\x66\x6F\x6E\x74\x2D\x73\x69\x7A\x65","\x75\x6E\x77\x72\x61\x70","\x64\x69\x76\x5B\x73\x74\x79\x6C\x65\x3D\x22\x74\x65\x78\x74\x2D\x61\x6C\x69\x67\x6E\x3A\x20\x2D\x77\x65\x62\x6B\x69\x74\x2D\x61\x75\x74\x6F\x3B\x22\x5D","\x75\x6C\x2C\x20\x6F\x6C\x2C\x20\x6C\x69","\x63\x6C\x65\x61\x6E\x6C\x65\x76\x65\x6C","\x73\x75\x62\x73\x74\x72","\x63\x6C\x65\x61\x6E\x46\x69\x6E\x69\x73\x68","\x63\x68\x61\x72\x41\x74","\x63\x6C\x65\x61\x6E\x47\x65\x74\x54\x61\x62\x73","\x21\x2D\x2D","\x2D\x2D\x3E","\x3E\x0A","\x70\x6C\x61\x63\x65\x54\x61\x67","\x63\x6C\x65\x61\x6E\x54\x61\x67","\x3C\x73\x63\x72\x69\x70\x74\x24\x31\x3E\x3C\x2F\x73\x63\x72\x69\x70\x74\x3E","\x3C\x73\x70\x61\x6E\x20\x69\x64\x3D\x22\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x31\x22\x3E\x3C\x2F\x73\x70\x61\x6E\x3E","\x3C\x64\x69\x76\x3E","\x2F\x3E","\x70\x61\x72\x61\x67\x72\x61\x70\x68\x73","\x3C\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65\x3E","\x67\x65\x74\x53\x65\x6C\x65\x63\x74\x69\x6F\x6E\x48\x74\x6D\x6C","\x74\x6D\x70","\x69\x6E\x6C\x69\x6E\x65\x46\x6F\x72\x6D\x61\x74","\x3C\x74\x6D\x70\x3E\x3C\x2F\x74\x6D\x70\x3E","\x3C\x2F\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65\x3E\x3C\x73\x70\x61\x6E\x20\x69\x64\x3D\x22\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x31\x22\x3E","\x73\x70\x61\x6E\x23\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x31","\x28\x2E\x2A\x3F\x29\x3E","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x45\x6C\x65\x6D\x65\x6E\x74","\x63\x6C\x61\x73\x73","\x69\x6E\x6C\x69\x6E\x65\x45\x61\x63\x68\x4E\x6F\x64\x65\x73","\x69\x6E\x6C\x69\x6E\x65\x4D\x65\x74\x68\x6F\x64\x73","\x73\x74\x61\x72\x74\x43\x6F\x6E\x74\x61\x69\x6E\x65\x72","\x65\x6E\x64\x43\x6F\x6E\x74\x61\x69\x6E\x65\x72","\x69\x6E\x6C\x69\x6E\x65\x55\x6E\x77\x72\x61\x70\x53\x70\x61\x6E","\x66\x6F\x6E\x74\x53\x69\x7A\x65","\x66\x6F\x6E\x74\x4E\x61\x6D\x65","\x66\x6F\x6E\x74\x2D\x66\x61\x6D\x69\x6C\x79","\x66\x6F\x72\x65\x43\x6F\x6C\x6F\x72","\x63\x6F\x6C\x6F\x72","\x62\x61\x63\x6B\x43\x6F\x6C\x6F\x72","\x66\x6F\x6E\x74","\x69\x6E\x6C\x69\x6E\x65\x53\x65\x74\x4D\x65\x74\x68\x6F\x64\x73","\x49\x4E\x4C\x49\x4E\x45","\x61\x74\x74\x72\x69\x62\x75\x74\x65\x73","\x3C\x69\x6E\x6C\x69\x6E\x65\x3E","\x74\x6F\x55\x70\x70\x65\x72\x43\x61\x73\x65","\x70\x61\x72\x73\x65\x48\x54\x4D\x4C","\x67\x65\x74\x52\x61\x6E\x67\x65\x53\x65\x6C\x65\x63\x74\x65\x64\x4E\x6F\x64\x65\x73","\x73\x65\x74\x53\x70\x61\x6E\x73\x56\x65\x72\x69\x66\x69\x65\x64\x48\x74\x6D\x6C","\x70\x2C\x20\x3A\x68\x65\x61\x64\x65\x72\x2C\x20\x75\x6C\x2C\x20\x6F\x6C\x2C\x20\x6C\x69\x2C\x20\x64\x69\x76\x2C\x20\x74\x61\x62\x6C\x65\x2C\x20\x74\x64\x2C\x20\x62\x6C\x6F\x63\x6B\x71\x75\x6F\x74\x65\x2C\x20\x70\x72\x65\x2C\x20\x61\x64\x64\x72\x65\x73\x73\x2C\x20\x73\x65\x63\x74\x69\x6F\x6E\x2C\x20\x68\x65\x61\x64\x65\x72\x2C\x20\x66\x6F\x6F\x74\x65\x72\x2C\x20\x61\x73\x69\x64\x65\x2C\x20\x61\x72\x74\x69\x63\x6C\x65","\x69\x73","\x69\x6E\x73\x65\x72\x74\x48\x74\x6D\x6C\x41\x64\x76\x61\x6E\x63\x65\x64","\x66\x6F\x63\x75\x73\x45\x6E\x64","\u200B","\x53\x50\x41\x4E","\x73\x65\x74\x45\x6E\x64\x41\x66\x74\x65\x72","\x63\x61\x72\x65\x74\x50\x6F\x73\x69\x74\x69\x6F\x6E\x46\x72\x6F\x6D\x50\x6F\x69\x6E\x74","\x6F\x66\x66\x73\x65\x74\x4E\x6F\x64\x65","\x73\x65\x74\x53\x74\x61\x72\x74","\x63\x61\x72\x65\x74\x52\x61\x6E\x67\x65\x46\x72\x6F\x6D\x50\x6F\x69\x6E\x74","\x63\x72\x65\x61\x74\x65\x54\x65\x78\x74\x52\x61\x6E\x67\x65","\x6D\x6F\x76\x65\x54\x6F\x50\x6F\x69\x6E\x74","\x64\x75\x70\x6C\x69\x63\x61\x74\x65","\x45\x6E\x64\x54\x6F\x45\x6E\x64","\x73\x65\x74\x45\x6E\x64\x50\x6F\x69\x6E\x74","\x3C\x62\x72\x3E\x3C\x62\x72\x3E","\x73\x65\x74\x43\x61\x72\x65\x74\x41\x66\x74\x65\x72","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x52\x65\x6D\x6F\x76\x65\x4D\x61\x72\x6B\x65\x72\x73","\x67\x65\x74\x43\x61\x72\x65\x74\x4F\x66\x66\x73\x65\x74","\x70\x61\x73\x74\x65\x42\x65\x66\x6F\x72\x65","\x70\x61\x73\x74\x65\x50\x6C\x61\x69\x6E\x54\x65\x78\x74","\x74\x65\x78\x74\x43\x6F\x6E\x74\x65\x6E\x74","\x69\x6E\x6E\x65\x72\x54\x65\x78\x74","\x70\x61\x73\x74\x65\x49\x6E\x73\x65\x72\x74","\x70\x61\x73\x74\x65\x50\x72\x65","\x3C\x75\x6C\x3E\x3C\x6C\x69\x24\x32\x3C\x2F\x6C\x69\x3E","\x3C\x6C\x69\x24\x32\x3C\x2F\x6C\x69\x3E","\x3C\x6C\x69\x24\x32\x3C\x2F\x6C\x69\x3E\x3C\x2F\x75\x6C\x3E","\x3C\x75\x6C\x3E\x3C\x6C\x69\x24\x32\x3C\x2F\x6C\x69\x3E\x3C\x2F\x75\x6C\x3E","\x63\x6C\x65\x61\x6E\x53\x70\x61\x63\x65\x73","\x26\x6E\x62\x73\x70\x3B","\x24\x33","\x3C\x73\x70\x61\x6E\x20\x73\x74\x79\x6C\x65\x3D\x22\x66\x6F\x6E\x74\x2D\x77\x65\x69\x67\x68\x74\x3A\x20\x62\x6F\x6C\x64\x3B\x22\x3E\x3C\x73\x70\x61\x6E\x20\x73\x74\x79\x6C\x65\x3D\x22\x66\x6F\x6E\x74\x2D\x73\x74\x79\x6C\x65\x3A\x20\x69\x74\x61\x6C\x69\x63\x3B\x22\x3E","\x3C\x73\x70\x61\x6E\x20\x73\x74\x79\x6C\x65\x3D\x22\x66\x6F\x6E\x74\x2D\x73\x74\x79\x6C\x65\x3A\x20\x69\x74\x61\x6C\x69\x63\x3B\x22\x3E","\x3C\x73\x70\x61\x6E\x20\x73\x74\x79\x6C\x65\x3D\x22\x66\x6F\x6E\x74\x2D\x77\x65\x69\x67\x68\x74\x3A\x20\x62\x6F\x6C\x64\x3B\x22\x3E","\x3C\x73\x70\x61\x6E\x20\x73\x74\x79\x6C\x65\x3D\x22\x74\x65\x78\x74\x2D\x64\x65\x63\x6F\x72\x61\x74\x69\x6F\x6E\x3A\x20\x75\x6E\x64\x65\x72\x6C\x69\x6E\x65\x3B\x22\x3E","\x5B\x74\x64\x5D","\x5B\x74\x64\x20\x63\x6F\x6C\x73\x70\x61\x6E\x3D\x22\x24\x32\x22\x5D\x24\x34\x5B\x2F\x74\x64\x5D","\x5B\x74\x64\x20\x72\x6F\x77\x73\x70\x61\x6E\x3D\x22\x24\x32\x22\x5D\x24\x34\x5B\x2F\x74\x64\x5D","\x5B\x61\x20\x68\x72\x65\x66\x3D\x22\x24\x32\x22\x5D\x24\x34\x5B\x2F\x61\x5D","\x5B\x69\x66\x72\x61\x6D\x65\x24\x31\x5D\x24\x32\x5B\x2F\x69\x66\x72\x61\x6D\x65\x5D","\x5B\x76\x69\x64\x65\x6F\x24\x31\x5D\x24\x32\x5B\x2F\x76\x69\x64\x65\x6F\x5D","\x5B\x61\x75\x64\x69\x6F\x24\x31\x5D\x24\x32\x5B\x2F\x61\x75\x64\x69\x6F\x5D","\x5B\x65\x6D\x62\x65\x64\x24\x31\x5D\x24\x32\x5B\x2F\x65\x6D\x62\x65\x64\x5D","\x5B\x6F\x62\x6A\x65\x63\x74\x24\x31\x5D\x24\x32\x5B\x2F\x6F\x62\x6A\x65\x63\x74\x5D","\x5B\x70\x61\x72\x61\x6D\x24\x31\x5D","\x5B\x69\x6D\x67\x24\x31\x5D","\x3C\x24\x31\x3E","\x3C\x74\x64\x20\x63\x6F\x6C\x73\x70\x61\x6E\x3D\x22\x24\x31\x22\x3E\x24\x32\x3C\x2F\x74\x64\x3E","\x3C\x74\x64\x20\x72\x6F\x77\x73\x70\x61\x6E\x3D\x22\x24\x31\x22\x3E\x24\x32\x3C\x2F\x74\x64\x3E","\x3C\x74\x64\x3E\x26\x6E\x62\x73\x70\x3B\x3C\x2F\x74\x64\x3E","\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x24\x31\x22\x3E\x24\x32\x3C\x2F\x61\x3E","\x3C\x69\x66\x72\x61\x6D\x65\x24\x31\x3E\x24\x32\x3C\x2F\x69\x66\x72\x61\x6D\x65\x3E","\x3C\x76\x69\x64\x65\x6F\x24\x31\x3E\x24\x32\x3C\x2F\x76\x69\x64\x65\x6F\x3E","\x3C\x61\x75\x64\x69\x6F\x24\x31\x3E\x24\x32\x3C\x2F\x61\x75\x64\x69\x6F\x3E","\x3C\x65\x6D\x62\x65\x64\x24\x31\x3E\x24\x32\x3C\x2F\x65\x6D\x62\x65\x64\x3E","\x3C\x6F\x62\x6A\x65\x63\x74\x24\x31\x3E\x24\x32\x3C\x2F\x6F\x62\x6A\x65\x63\x74\x3E","\x3C\x70\x61\x72\x61\x6D\x24\x31\x3E","\x3C\x69\x6D\x67\x24\x31\x3E","\x3C\x70\x3E\x24\x32\x3C\x2F\x70\x3E","\x3C\x62\x72\x20\x2F\x3E","\x24\x31\x3C\x62\x72\x3E","\x3C\x74\x64\x24\x31\x3E\x24\x33\x3C\x2F\x74\x64\x3E","\x70\x61\x73\x74\x65\x43\x6C\x69\x70\x62\x6F\x61\x72\x64\x4D\x6F\x7A\x69\x6C\x6C\x61","\x3C\x69\x6D\x67","\x3C\x69\x6D\x67\x20\x64\x61\x74\x61\x2D\x6D\x6F\x7A\x69\x6C\x6C\x61\x2D\x70\x61\x73\x74\x65\x2D\x69\x6D\x61\x67\x65\x3D\x22","\x22\x20","\x3C\x6C\x69\x3E\x24\x31\x3C\x2F\x6C\x69\x3E","\x3C\x74\x64\x24\x31\x3E\x24\x32\x24\x34\x3C\x2F\x74\x64\x3E","\x3C\x74\x64\x24\x31\x3E\x24\x32\x24\x33\x3C\x2F\x74\x64\x3E","\x70\x61\x73\x74\x65\x41\x66\x74\x65\x72","\x70\x3A\x65\x6D\x70\x74\x79","\x70\x61\x73\x74\x65\x43\x6C\x69\x70\x62\x6F\x61\x72\x64\x55\x70\x6C\x6F\x61\x64\x4D\x6F\x7A\x69\x6C\x6C\x61","\x75\x70\x6C\x6F\x61\x64\x46\x69\x65\x6C\x64\x73","\x6F\x62\x6A\x65\x63\x74","\x69\x6D\x67\x5B\x64\x61\x74\x61\x2D\x6D\x6F\x7A\x69\x6C\x6C\x61\x2D\x70\x61\x73\x74\x65\x2D\x69\x6D\x61\x67\x65\x5D","\x3A","\x70\x61\x73\x74\x65\x43\x6C\x69\x70\x62\x6F\x61\x72\x64\x41\x70\x70\x65\x6E\x64\x46\x69\x65\x6C\x64\x73","\x63\x6C\x69\x70\x62\x6F\x61\x72\x64\x55\x70\x6C\x6F\x61\x64\x55\x72\x6C","\x66\x69\x6C\x65\x6C\x69\x6E\x6B","\x64\x61\x74\x61\x2D\x6D\x6F\x7A\x69\x6C\x6C\x61\x2D\x70\x61\x73\x74\x65\x2D\x69\x6D\x61\x67\x65","\x72\x65\x73\x75\x6C\x74","\x3C\x69\x6D\x67\x20\x73\x72\x63\x3D\x22","\x22\x20\x69\x64\x3D\x22\x63\x6C\x69\x70\x62\x6F\x61\x72\x64\x2D\x69\x6D\x61\x67\x65\x2D\x6D\x61\x72\x6B\x65\x72\x22\x20\x2F\x3E","\x69\x6D\x67\x23\x63\x6C\x69\x70\x62\x6F\x61\x72\x64\x2D\x69\x6D\x61\x67\x65\x2D\x6D\x61\x72\x6B\x65\x72","\x70\x6F\x70","\x6C\x69\x6E\x6B\x4F\x62\x73\x65\x72\x76\x65\x72","\x6C\x69\x6E\x6B\x4F\x62\x73\x65\x72\x76\x65\x72\x54\x6F\x6F\x6C\x74\x69\x70\x43\x6C\x6F\x73\x65","\x75\x6E\x73\x65\x6C\x65\x63\x74\x61\x62\x6C\x65","\x72\x6F\x79\x61\x6C\x53\x6C\x69\x64\x65\x72","\x66\x6F\x74\x6F\x72\x61\x6D\x61","\x69\x6D\x61\x67\x65\x52\x65\x73\x69\x7A\x65","\x65\x64\x69\x74\x47\x61\x6C\x6C\x65\x72\x79","\x2E\x66\x6F\x74\x6F\x72\x61\x6D\x61\x2C\x20\x2E\x72\x6F\x79\x61\x6C\x53\x6C\x69\x64\x65\x72","\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x6C\x69\x6E\x6B\x2D\x74\x6F\x6F\x6C\x74\x69\x70\x22\x3E\x3C\x2F\x73\x70\x61\x6E\x3E","\x68\x72\x65\x66","\x2E\x2E\x2E","\x3C\x61\x20\x68\x72\x65\x66\x3D\x22","\x22\x20\x74\x61\x72\x67\x65\x74\x3D\x22\x5F\x62\x6C\x61\x6E\x6B\x22\x3E","\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x23\x22\x3E","\x65\x64\x69\x74","\x20\x7C\x20","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x6C\x69\x6E\x6B\x2D\x74\x6F\x6F\x6C\x74\x69\x70","\x72\x61\x6E\x67\x79","\x73\x65\x74\x43\x61\x72\x65\x74","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x53\x65\x74","\x73\x65\x74\x45\x6E\x64","\x66\x6F\x72\x6D\x61\x74\x43\x68\x61\x6E\x67\x65\x54\x61\x67","\x65\x78\x74\x72\x61\x63\x74\x43\x6F\x6E\x74\x65\x6E\x74\x73","\x67\x65\x74\x54\x65\x78\x74\x4E\x6F\x64\x65\x73\x49\x6E","\x63\x68\x69\x6C\x64\x4E\x6F\x64\x65\x73","\x64\x69\x76\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x65\x64\x69\x74\x6F\x72","\x6E\x6F\x64\x65\x4E\x61\x6D\x65","\x74\x61\x67\x54\x65\x73\x74\x42\x6C\x6F\x63\x6B","\x69\x73\x43\x6F\x6C\x6C\x61\x70\x73\x65\x64","\x6E\x65\x78\x74\x4E\x6F\x64\x65","\x63\x6F\x6D\x6D\x6F\x6E\x41\x6E\x63\x65\x73\x74\x6F\x72\x43\x6F\x6E\x74\x61\x69\x6E\x65\x72","\x68\x61\x73\x43\x68\x69\x6C\x64\x4E\x6F\x64\x65\x73","\x6E\x65\x78\x74\x53\x69\x62\x6C\x69\x6E\x67","\x63\x6C\x6F\x6E\x65\x43\x6F\x6E\x74\x65\x6E\x74\x73","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x43\x72\x65\x61\x74\x65\x4D\x61\x72\x6B\x65\x72","\x73\x61\x76\x65\x53\x65\x6C\x65\x63\x74\x69\x6F\x6E","\x3C\x73\x70\x61\x6E\x20\x69\x64\x3D\x22\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x31\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x22\x3E","\x3C\x73\x70\x61\x6E\x20\x69\x64\x3D\x22\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x32\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x22\x3E","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x53\x65\x74\x4D\x61\x72\x6B\x65\x72","\x64\x65\x74\x61\x63\x68","\x73\x70\x61\x6E\x23\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x32","\x72\x65\x73\x74\x6F\x72\x65\x53\x65\x6C\x65\x63\x74\x69\x6F\x6E","\x73\x70\x61\x6E\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72","\x72\x65\x6D\x6F\x76\x65\x4D\x61\x72\x6B\x65\x72\x73","\x6D\x6F\x64\x61\x6C\x5F\x74\x61\x62\x6C\x65","\x74\x61\x62\x6C\x65\x49\x6E\x73\x65\x72\x74","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x73\x65\x72\x74\x5F\x74\x61\x62\x6C\x65\x5F\x62\x74\x6E","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x6C\x65\x5F\x72\x6F\x77\x73","\x6D\x6F\x64\x61\x6C\x49\x6E\x69\x74","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x6C\x65\x5F\x63\x6F\x6C\x75\x6D\x6E\x73","\x3C\x64\x69\x76\x3E\x3C\x2F\x64\x69\x76\x3E","\x72\x61\x6E\x64\x6F\x6D","\x66\x6C\x6F\x6F\x72","\x3C\x74\x61\x62\x6C\x65\x20\x69\x64\x3D\x22\x74\x61\x62\x6C\x65","\x22\x3E\x3C\x74\x62\x6F\x64\x79\x3E\x3C\x2F\x74\x62\x6F\x64\x79\x3E\x3C\x2F\x74\x61\x62\x6C\x65\x3E","\x3C\x2F\x74\x64\x3E","\x6D\x6F\x64\x61\x6C\x43\x6C\x6F\x73\x65","\x23\x74\x61\x62\x6C\x65","\x73\x70\x61\x6E\x23\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x31\x2C\x20\x69\x6E\x6C\x69\x6E\x65\x23\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E\x2D\x6D\x61\x72\x6B\x65\x72\x2D\x31","\x66\x69\x72\x73\x74","\x63\x65\x6C\x6C\x49\x6E\x64\x65\x78","\x65\x71","\x3C\x74\x68\x65\x61\x64\x3E\x3C\x2F\x74\x68\x65\x61\x64\x3E","\x74\x61\x62\x6C\x65\x41\x64\x64\x52\x6F\x77","\x74\x61\x62\x6C\x65\x41\x64\x64\x43\x6F\x6C\x75\x6D\x6E","\x6D\x6F\x64\x61\x6C\x5F\x76\x69\x64\x65\x6F","\x76\x69\x64\x65\x6F\x49\x6E\x73\x65\x72\x74","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x73\x65\x72\x74\x5F\x76\x69\x64\x65\x6F\x5F\x62\x74\x6E","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x73\x65\x72\x74\x5F\x76\x69\x64\x65\x6F\x5F\x61\x72\x65\x61","\x3C\x69\x66\x72\x61\x6D\x65\x20\x77\x69\x64\x74\x68\x3D\x22\x35\x30\x30\x22\x20\x68\x65\x69\x67\x68\x74\x3D\x22\x32\x38\x31\x22\x20\x73\x72\x63\x3D\x22","\x22\x20\x66\x72\x61\x6D\x65\x62\x6F\x72\x64\x65\x72\x3D\x22\x30\x22\x20\x61\x6C\x6C\x6F\x77\x66\x75\x6C\x6C\x73\x63\x72\x65\x65\x6E\x3E\x3C\x2F\x69\x66\x72\x61\x6D\x65\x3E","\x2F\x2F\x77\x77\x77\x2E\x79\x6F\x75\x74\x75\x62\x65\x2E\x63\x6F\x6D\x2F\x65\x6D\x62\x65\x64\x2F\x24\x31","\x2F\x2F\x70\x6C\x61\x79\x65\x72\x2E\x76\x69\x6D\x65\x6F\x2E\x63\x6F\x6D\x2F\x76\x69\x64\x65\x6F\x2F\x24\x32","\x70\x72\x65\x64\x65\x66\x69\x6E\x65\x64\x4C\x69\x6E\x6B\x73","\x70\x72\x65\x64\x65\x66\x69\x6E\x65\x64\x4C\x69\x6E\x6B\x73\x53\x74\x6F\x72\x61\x67\x65","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x70\x72\x65\x64\x65\x66\x69\x6E\x65\x64\x2D\x6C\x69\x6E\x6B\x73","\x3C\x6F\x70\x74\x69\x6F\x6E\x3E","\x75\x72\x6C","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x75\x72\x6C","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x75\x72\x6C\x5F\x74\x65\x78\x74","\x67\x65\x74\x4A\x53\x4F\x4E","\x69\x6E\x73\x65\x72\x74\x5F\x6C\x69\x6E\x6B\x5F\x6E\x6F\x64\x65","\x6C\x6F\x63\x61\x74\x69\x6F\x6E","\x6D\x61\x69\x6C\x74\x6F\x3A","\x5E\x28\x68\x74\x74\x70\x7C\x66\x74\x70\x7C\x68\x74\x74\x70\x73\x29\x3A\x2F\x2F","\x68\x6F\x73\x74","\x5F\x62\x6C\x61\x6E\x6B","\x63\x68\x65\x63\x6B\x65\x64","\x70\x72\x6F\x70","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x62\x6C\x61\x6E\x6B","\x6C\x69\x6E\x6B\x49\x6E\x73\x65\x72\x74\x50\x72\x65\x73\x73\x65\x64","\x6C\x69\x6E\x6B\x50\x72\x6F\x63\x65\x73\x73","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x73\x65\x72\x74\x5F\x6C\x69\x6E\x6B\x5F\x62\x74\x6E","\x6D\x6F\x64\x61\x6C\x5F\x6C\x69\x6E\x6B","\x20\x74\x61\x72\x67\x65\x74\x3D\x22\x5F\x62\x6C\x61\x6E\x6B\x22","\x28\x28\x78\x6E\x2D\x2D\x29\x3F\x5B\x61\x2D\x7A\x30\x2D\x39\x5D\x2B\x28\x2D\x5B\x61\x2D\x7A\x30\x2D\x39\x5D\x2B\x29\x2A\x2E\x29\x2B\x5B\x61\x2D\x7A\x5D\x7B\x32\x2C\x7D","\x6C\x69\x6E\x6B\x49\x6E\x73\x65\x72\x74","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x61\x64\x64\x65\x64\x2D\x6C\x69\x6E\x6B","\x61\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x61\x64\x64\x65\x64\x2D\x6C\x69\x6E\x6B","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x6E\x61\x6D\x65","\x69\x73\x49\x50\x61\x64","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65","\x66\x69\x6C\x65\x43\x61\x6C\x6C\x62\x61\x63\x6B","\x66\x69\x6C\x65\x55\x70\x6C\x6F\x61\x64\x45\x72\x72\x6F\x72","\x66\x69\x6C\x65\x55\x70\x6C\x6F\x61\x64\x50\x61\x72\x61\x6D","\x64\x72\x61\x67\x75\x70\x6C\x6F\x61\x64\x49\x6E\x69\x74","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65","\x75\x70\x6C\x6F\x61\x64\x49\x6E\x69\x74","\x6D\x6F\x64\x61\x6C\x5F\x66\x69\x6C\x65","\x66\x69\x6C\x65\x6E\x61\x6D\x65","\x22\x20\x69\x64\x3D\x22\x66\x69\x6C\x65\x6C\x69\x6E\x6B\x2D\x6D\x61\x72\x6B\x65\x72\x22\x3E","\x63\x68\x72\x6F\x6D\x65","\x61\x23\x66\x69\x6C\x65\x6C\x69\x6E\x6B\x2D\x6D\x61\x72\x6B\x65\x72","\x69\x6D\x61\x67\x65\x47\x65\x74\x4A\x73\x6F\x6E","\x66\x6F\x6C\x64\x65\x72","\x69\x73\x45\x6D\x70\x74\x79\x4F\x62\x6A\x65\x63\x74","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x66\x6F\x6C\x64\x65\x72","\x74\x68\x75\x6D\x62","\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x66\x6F\x6C\x64\x65\x72\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x66\x6F\x6C\x64\x65\x72","\x22\x20\x72\x65\x6C\x3D\x22","\x22\x20\x74\x69\x74\x6C\x65\x3D\x22","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6D\x61\x67\x65\x5F\x62\x6F\x78","\x69\x6D\x61\x67\x65\x54\x68\x75\x6D\x62\x43\x6C\x69\x63\x6B","\x3C\x73\x65\x6C\x65\x63\x74\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6D\x61\x67\x65\x5F\x62\x6F\x78\x5F\x73\x65\x6C\x65\x63\x74\x22\x3E","\x3C\x6F\x70\x74\x69\x6F\x6E\x20\x76\x61\x6C\x75\x65\x3D\x22","\x3C\x2F\x6F\x70\x74\x69\x6F\x6E\x3E","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x61\x62\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x2D\x32","\x69\x6D\x61\x67\x65\x43\x61\x6C\x6C\x62\x61\x63\x6B","\x69\x6D\x61\x67\x65\x55\x70\x6C\x6F\x61\x64\x45\x72\x72\x6F\x72","\x63\x68\x61\x6E\x67\x65\x2E\x72\x65\x64\x61\x63\x74\x6F\x72","\x73\x33\x68\x61\x6E\x64\x6C\x65\x46\x69\x6C\x65\x53\x65\x6C\x65\x63\x74","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x73","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x33","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x61\x62\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x2D\x31","\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x73\x5F\x61\x63\x74","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x32","\x69\x6D\x61\x67\x65\x54\x61\x62\x4C\x69\x6E\x6B","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x61\x62\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x2D\x33","\x69\x6D\x61\x67\x65\x43\x61\x6C\x6C\x62\x61\x63\x6B\x4C\x69\x6E\x6B","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x75\x70\x6C\x6F\x61\x64\x5F\x62\x74\x6E","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x5F\x6C\x69\x6E\x6B","\x6D\x6F\x64\x61\x6C\x5F\x69\x6D\x61\x67\x65","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x5F\x61\x6C\x74","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6D\x61\x67\x65\x5F\x65\x64\x69\x74\x5F\x73\x72\x63","\x64\x69\x73\x70\x6C\x61\x79","\x62\x6C\x6F\x63\x6B","\x66\x6C\x6F\x61\x74","\x6E\x6F\x6E\x65","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x5F\x69\x6D\x61\x67\x65\x5F\x61\x6C\x69\x67\x6E","\x69\x6D\x61\x67\x65\x52\x65\x6D\x6F\x76\x65","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6D\x61\x67\x65\x5F\x64\x65\x6C\x65\x74\x65\x5F\x62\x74\x6E","\x69\x6D\x61\x67\x65\x53\x61\x76\x65","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x53\x61\x76\x65\x42\x74\x6E","\x6D\x6F\x64\x61\x6C\x5F\x69\x6D\x61\x67\x65\x5F\x65\x64\x69\x74","\x69\x6D\x61\x67\x65\x44\x65\x6C\x65\x74\x65","\x30\x20","\x69\x6D\x61\x67\x65\x46\x6C\x6F\x61\x74\x4D\x61\x72\x67\x69\x6E","\x20\x30","\x30\x20\x30\x20","\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x62\x6F\x78","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x62\x6F\x78","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x65\x64\x69\x74\x74\x65\x72\x2C\x20\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x72\x65\x73\x69\x7A\x65\x72","\x6D\x61\x72\x67\x69\x6E\x54\x6F\x70","\x6D\x61\x72\x67\x69\x6E\x42\x6F\x74\x74\x6F\x6D","\x6D\x61\x72\x67\x69\x6E\x4C\x65\x66\x74","\x6D\x61\x72\x67\x69\x6E\x52\x69\x67\x68\x74","\x6D\x61\x72\x67\x69\x6E","\x6F\x70\x61\x63\x69\x74\x79","\x63\x6C\x69\x63\x6B\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x72\x65\x73\x69\x7A\x65\x2D\x68\x69\x64\x65","\x6B\x65\x79\x64\x6F\x77\x6E\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x64\x65\x6C\x65\x74\x65","\x64\x72\x61\x67\x73\x74\x61\x72\x74","\x64\x72\x6F\x70\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x69\x6E\x73\x69\x64\x65\x2D\x64\x72\x6F\x70","\x69\x6D\x61\x67\x65\x52\x65\x73\x69\x7A\x65\x43\x6F\x6E\x74\x72\x6F\x6C\x73","\x70\x61\x67\x65\x58","\x72\x6F\x75\x6E\x64","\x70\x61\x67\x65\x59","\x6D\x6F\x75\x73\x65\x6D\x6F\x76\x65","\x2D\x37\x70\x78","\x2D\x31\x33\x70\x78","\x39\x70\x78","\x33\x70\x78\x20\x35\x70\x78","\x69\x6D\x61\x67\x65\x45\x64\x69\x74\x74\x65\x72","\x2D\x31\x31\x70\x78","\x2D\x31\x38\x70\x78","\x31\x31\x70\x78","\x37\x70\x78\x20\x31\x30\x70\x78","\x3C\x73\x70\x61\x6E\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x62\x6F\x78\x22\x20\x64\x61\x74\x61\x2D\x72\x65\x64\x61\x63\x74\x6F\x72\x3D\x22\x76\x65\x72\x69\x66\x69\x65\x64\x22\x3E","\x69\x6E\x6C\x69\x6E\x65\x2D\x62\x6C\x6F\x63\x6B","\x31\x70\x78\x20\x64\x61\x73\x68\x65\x64\x20\x72\x67\x62\x61\x28\x30\x2C\x20\x30\x2C\x20\x30\x2C\x20\x2E\x36\x29","\x3C\x73\x70\x61\x6E\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x65\x64\x69\x74\x74\x65\x72\x22\x20\x64\x61\x74\x61\x2D\x72\x65\x64\x61\x63\x74\x6F\x72\x3D\x22\x76\x65\x72\x69\x66\x69\x65\x64\x22\x3E","\x35\x30\x25","\x23\x30\x30\x30","\x23\x66\x66\x66","\x70\x6F\x69\x6E\x74\x65\x72","\x69\x6D\x61\x67\x65\x45\x64\x69\x74","\x69\x6D\x61\x67\x65\x52\x65\x73\x69\x7A\x61\x62\x6C\x65","\x3C\x73\x70\x61\x6E\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x69\x6D\x61\x67\x65\x2D\x72\x65\x73\x69\x7A\x65\x72\x22\x20\x64\x61\x74\x61\x2D\x72\x65\x64\x61\x63\x74\x6F\x72\x3D\x22\x76\x65\x72\x69\x66\x69\x65\x64\x22\x3E\x3C\x2F\x73\x70\x61\x6E\x3E","\x6E\x77\x2D\x72\x65\x73\x69\x7A\x65","\x2D\x34\x70\x78","\x2D\x35\x70\x78","\x31\x70\x78\x20\x73\x6F\x6C\x69\x64\x20\x23\x66\x66\x66","\x38\x70\x78","\x3C\x69\x6D\x67\x20\x69\x64\x3D\x22\x69\x6D\x61\x67\x65\x2D\x6D\x61\x72\x6B\x65\x72\x22\x20\x73\x72\x63\x3D\x22","\x72\x65\x6C","\x22\x20\x61\x6C\x74\x3D\x22","\x69\x6D\x61\x67\x65\x49\x6E\x73\x65\x72\x74","\x69\x6D\x67\x23\x69\x6D\x61\x67\x65\x2D\x6D\x61\x72\x6B\x65\x72","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x70\x72\x6F\x67\x72\x65\x73\x73","\x24\x70\x72\x6F\x67\x72\x65\x73\x73\x42\x61\x72","\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x70\x72\x6F\x67\x72\x65\x73\x73\x22\x3E\x3C\x73\x70\x61\x6E\x3E\x3C\x2F\x73\x70\x61\x6E\x3E\x3C\x2F\x64\x69\x76\x3E","\x62\x75\x69\x6C\x64\x50\x72\x6F\x67\x72\x65\x73\x73\x42\x61\x72","\x66\x61\x64\x65\x49\x6E","\x3C\x73\x65\x63\x74\x69\x6F\x6E\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x6D\x6F\x64\x61\x6C\x2D\x66\x69\x6C\x65\x2D\x69\x6E\x73\x65\x72\x74\x22\x3E\x3C\x66\x6F\x72\x6D\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x55\x70\x6C\x6F\x61\x64\x46\x69\x6C\x65\x46\x6F\x72\x6D\x22\x20\x6D\x65\x74\x68\x6F\x64\x3D\x22\x70\x6F\x73\x74\x22\x20\x61\x63\x74\x69\x6F\x6E\x3D\x22\x22\x20\x65\x6E\x63\x74\x79\x70\x65\x3D\x22\x6D\x75\x6C\x74\x69\x70\x61\x72\x74\x2F\x66\x6F\x72\x6D\x2D\x64\x61\x74\x61\x22\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x6E\x61\x6D\x65\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x70\x75\x74\x22\x20\x2F\x3E\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x22\x6D\x61\x72\x67\x69\x6E\x2D\x74\x6F\x70\x3A\x20\x37\x70\x78\x3B\x22\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x66\x69\x6C\x65\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x22\x20\x6E\x61\x6D\x65\x3D\x22","\x22\x20\x2F\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x66\x6F\x72\x6D\x3E\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E","\x3C\x73\x65\x63\x74\x69\x6F\x6E\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x6D\x6F\x64\x61\x6C\x2D\x69\x6D\x61\x67\x65\x2D\x65\x64\x69\x74\x22\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x5F\x61\x6C\x74\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x70\x75\x74\x22\x20\x2F\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x5F\x6C\x69\x6E\x6B\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x70\x75\x74\x22\x20\x2F\x3E\x3C\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x63\x68\x65\x63\x6B\x62\x6F\x78\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x62\x6C\x61\x6E\x6B\x22\x3E\x20","\x6C\x69\x6E\x6B\x5F\x6E\x65\x77\x5F\x74\x61\x62","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x69\x6D\x61\x67\x65\x5F\x70\x6F\x73\x69\x74\x69\x6F\x6E","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x73\x65\x6C\x65\x63\x74\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x6F\x72\x6D\x5F\x69\x6D\x61\x67\x65\x5F\x61\x6C\x69\x67\x6E\x22\x3E\x3C\x6F\x70\x74\x69\x6F\x6E\x20\x76\x61\x6C\x75\x65\x3D\x22\x6E\x6F\x6E\x65\x22\x3E","\x3C\x2F\x6F\x70\x74\x69\x6F\x6E\x3E\x3C\x6F\x70\x74\x69\x6F\x6E\x20\x76\x61\x6C\x75\x65\x3D\x22\x6C\x65\x66\x74\x22\x3E","\x3C\x2F\x6F\x70\x74\x69\x6F\x6E\x3E\x3C\x6F\x70\x74\x69\x6F\x6E\x20\x76\x61\x6C\x75\x65\x3D\x22\x63\x65\x6E\x74\x65\x72\x22\x3E","\x3C\x2F\x6F\x70\x74\x69\x6F\x6E\x3E\x3C\x6F\x70\x74\x69\x6F\x6E\x20\x76\x61\x6C\x75\x65\x3D\x22\x72\x69\x67\x68\x74\x22\x3E","\x3C\x2F\x6F\x70\x74\x69\x6F\x6E\x3E\x3C\x2F\x73\x65\x6C\x65\x63\x74\x3E\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E\x3C\x66\x6F\x6F\x74\x65\x72\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6D\x61\x67\x65\x5F\x64\x65\x6C\x65\x74\x65\x5F\x62\x74\x6E\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x62\x74\x6E\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x64\x65\x6C\x65\x74\x65\x5F\x62\x74\x6E\x22\x3E","\x5F\x64\x65\x6C\x65\x74\x65","\x3C\x2F\x62\x75\x74\x74\x6F\x6E\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x62\x74\x6E\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x62\x74\x6E\x5F\x6D\x6F\x64\x61\x6C\x5F\x63\x6C\x6F\x73\x65\x22\x3E","\x63\x61\x6E\x63\x65\x6C","\x3C\x2F\x62\x75\x74\x74\x6F\x6E\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x53\x61\x76\x65\x42\x74\x6E\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x62\x74\x6E\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x61\x63\x74\x69\x6F\x6E\x5F\x62\x74\x6E\x22\x3E","\x73\x61\x76\x65","\x3C\x2F\x62\x75\x74\x74\x6F\x6E\x3E\x3C\x2F\x66\x6F\x6F\x74\x65\x72\x3E","\x3C\x73\x65\x63\x74\x69\x6F\x6E\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x6D\x6F\x64\x61\x6C\x2D\x69\x6D\x61\x67\x65\x2D\x69\x6E\x73\x65\x72\x74\x22\x3E\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x73\x22\x3E\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x23\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x61\x62\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x2D\x31\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x73\x5F\x61\x63\x74\x22\x3E","\x75\x70\x6C\x6F\x61\x64","\x3C\x2F\x61\x3E\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x23\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x61\x62\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x2D\x32\x22\x3E","\x63\x68\x6F\x6F\x73\x65","\x3C\x2F\x61\x3E\x3C\x61\x20\x68\x72\x65\x66\x3D\x22\x23\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x74\x61\x62\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x2D\x33\x22\x3E","\x3C\x2F\x61\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x66\x6F\x72\x6D\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x49\x6E\x73\x65\x72\x74\x49\x6D\x61\x67\x65\x46\x6F\x72\x6D\x22\x20\x6D\x65\x74\x68\x6F\x64\x3D\x22\x70\x6F\x73\x74\x22\x20\x61\x63\x74\x69\x6F\x6E\x3D\x22\x22\x20\x65\x6E\x63\x74\x79\x70\x65\x3D\x22\x6D\x75\x6C\x74\x69\x70\x61\x72\x74\x2F\x66\x6F\x72\x6D\x2D\x64\x61\x74\x61\x22\x3E\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x31\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x22\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x66\x69\x6C\x65\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x22\x20\x6E\x61\x6D\x65\x3D\x22","\x22\x20\x2F\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x32\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x3E\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6D\x61\x67\x65\x5F\x62\x6F\x78\x22\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x66\x6F\x72\x6D\x3E\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x33\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x69\x6D\x61\x67\x65\x5F\x77\x65\x62\x5F\x6C\x69\x6E\x6B","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x6E\x61\x6D\x65\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x5F\x6C\x69\x6E\x6B\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x66\x69\x6C\x65\x5F\x6C\x69\x6E\x6B\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x70\x75\x74\x22\x20\x20\x2F\x3E\x3C\x62\x72\x3E\x3C\x62\x72\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E\x3C\x66\x6F\x6F\x74\x65\x72\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x62\x74\x6E\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x62\x74\x6E\x5F\x6D\x6F\x64\x61\x6C\x5F\x63\x6C\x6F\x73\x65\x22\x3E","\x3C\x2F\x62\x75\x74\x74\x6F\x6E\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x62\x74\x6E\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x61\x63\x74\x69\x6F\x6E\x5F\x62\x74\x6E\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x75\x70\x6C\x6F\x61\x64\x5F\x62\x74\x6E\x22\x3E","\x3C\x73\x65\x63\x74\x69\x6F\x6E\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x6D\x6F\x64\x61\x6C\x2D\x6C\x69\x6E\x6B\x2D\x69\x6E\x73\x65\x72\x74\x22\x3E\x3C\x73\x65\x6C\x65\x63\x74\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x70\x72\x65\x64\x65\x66\x69\x6E\x65\x64\x2D\x6C\x69\x6E\x6B\x73\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x20\x39\x39\x2E\x35\x25\x3B\x20\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x3E\x3C\x2F\x73\x65\x6C\x65\x63\x74\x3E\x3C\x6C\x61\x62\x65\x6C\x3E\x55\x52\x4C\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x70\x75\x74\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x75\x72\x6C\x22\x20\x2F\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x70\x75\x74\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x75\x72\x6C\x5F\x74\x65\x78\x74\x22\x20\x2F\x3E\x3C\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x63\x68\x65\x63\x6B\x62\x6F\x78\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6C\x69\x6E\x6B\x5F\x62\x6C\x61\x6E\x6B\x22\x3E\x20","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E\x3C\x66\x6F\x6F\x74\x65\x72\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x62\x74\x6E\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x62\x74\x6E\x5F\x6D\x6F\x64\x61\x6C\x5F\x63\x6C\x6F\x73\x65\x22\x3E","\x3C\x2F\x62\x75\x74\x74\x6F\x6E\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x73\x65\x72\x74\x5F\x6C\x69\x6E\x6B\x5F\x62\x74\x6E\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x62\x74\x6E\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x61\x63\x74\x69\x6F\x6E\x5F\x62\x74\x6E\x22\x3E","\x3C\x73\x65\x63\x74\x69\x6F\x6E\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x6D\x6F\x64\x61\x6C\x2D\x74\x61\x62\x6C\x65\x2D\x69\x6E\x73\x65\x72\x74\x22\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x72\x6F\x77\x73","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x73\x69\x7A\x65\x3D\x22\x35\x22\x20\x76\x61\x6C\x75\x65\x3D\x22\x32\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x6C\x65\x5F\x72\x6F\x77\x73\x22\x20\x2F\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x63\x6F\x6C\x75\x6D\x6E\x73","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x74\x65\x78\x74\x22\x20\x73\x69\x7A\x65\x3D\x22\x35\x22\x20\x76\x61\x6C\x75\x65\x3D\x22\x33\x22\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x6C\x65\x5F\x63\x6F\x6C\x75\x6D\x6E\x73\x22\x20\x2F\x3E\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E\x3C\x66\x6F\x6F\x74\x65\x72\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x62\x74\x6E\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x62\x74\x6E\x5F\x6D\x6F\x64\x61\x6C\x5F\x63\x6C\x6F\x73\x65\x22\x3E","\x3C\x2F\x62\x75\x74\x74\x6F\x6E\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x73\x65\x72\x74\x5F\x74\x61\x62\x6C\x65\x5F\x62\x74\x6E\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x62\x74\x6E\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x61\x63\x74\x69\x6F\x6E\x5F\x62\x74\x6E\x22\x3E","\x3C\x73\x65\x63\x74\x69\x6F\x6E\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x2D\x6D\x6F\x64\x61\x6C\x2D\x76\x69\x64\x65\x6F\x2D\x69\x6E\x73\x65\x72\x74\x22\x3E\x3C\x66\x6F\x72\x6D\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x49\x6E\x73\x65\x72\x74\x56\x69\x64\x65\x6F\x46\x6F\x72\x6D\x22\x3E\x3C\x6C\x61\x62\x65\x6C\x3E","\x76\x69\x64\x65\x6F\x5F\x68\x74\x6D\x6C\x5F\x63\x6F\x64\x65","\x3C\x2F\x6C\x61\x62\x65\x6C\x3E\x3C\x74\x65\x78\x74\x61\x72\x65\x61\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x73\x65\x72\x74\x5F\x76\x69\x64\x65\x6F\x5F\x61\x72\x65\x61\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x20\x39\x39\x25\x3B\x20\x68\x65\x69\x67\x68\x74\x3A\x20\x31\x36\x30\x70\x78\x3B\x22\x3E\x3C\x2F\x74\x65\x78\x74\x61\x72\x65\x61\x3E\x3C\x2F\x66\x6F\x72\x6D\x3E\x3C\x2F\x73\x65\x63\x74\x69\x6F\x6E\x3E\x3C\x66\x6F\x6F\x74\x65\x72\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x62\x74\x6E\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x62\x74\x6E\x5F\x6D\x6F\x64\x61\x6C\x5F\x63\x6C\x6F\x73\x65\x22\x3E","\x3C\x2F\x62\x75\x74\x74\x6F\x6E\x3E\x3C\x62\x75\x74\x74\x6F\x6E\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x69\x6E\x73\x65\x72\x74\x5F\x76\x69\x64\x65\x6F\x5F\x62\x74\x6E\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x62\x74\x6E\x20\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x61\x63\x74\x69\x6F\x6E\x5F\x62\x74\x6E\x22\x3E","\x6D\x6F\x64\x61\x6C\x53\x65\x74\x4F\x76\x65\x72\x6C\x61\x79","\x24\x72\x65\x64\x61\x63\x74\x6F\x72\x4D\x6F\x64\x61\x6C\x57\x69\x64\x74\x68","\x24\x72\x65\x64\x61\x63\x74\x6F\x72\x4D\x6F\x64\x61\x6C","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C","\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x20\x2F\x3E","\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x63\x6C\x6F\x73\x65\x22\x3E\x26\x74\x69\x6D\x65\x73\x3B\x3C\x2F\x64\x69\x76\x3E","\x3C\x68\x65\x61\x64\x65\x72\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x68\x65\x61\x64\x65\x72\x22\x20\x2F\x3E","\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x69\x6E\x6E\x65\x72\x22\x20\x2F\x3E","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x63\x6C\x6F\x73\x65","\x6D\x6F\x64\x61\x6C\x43\x6C\x6F\x73\x65\x48\x61\x6E\x64\x6C\x65\x72","\x6D\x6F\x64\x61\x6C\x53\x65\x74\x43\x6F\x6E\x74\x65\x6E\x74","\x6D\x6F\x64\x61\x6C\x53\x65\x74\x54\x69\x74\x6C\x65","\x6D\x6F\x64\x61\x6C\x53\x65\x74\x44\x72\x61\x67\x67\x61\x62\x6C\x65","\x6D\x6F\x64\x61\x6C\x4C\x6F\x61\x64\x54\x61\x62\x73","\x6D\x6F\x64\x61\x6C\x4F\x6E\x43\x6C\x6F\x73\x65\x42\x75\x74\x74\x6F\x6E","\x6D\x6F\x64\x61\x6C\x53\x65\x74\x42\x75\x74\x74\x6F\x6E\x73\x57\x69\x64\x74\x68","\x73\x61\x76\x65\x4D\x6F\x64\x61\x6C\x53\x63\x72\x6F\x6C\x6C","\x6D\x6F\x64\x61\x6C\x53\x68\x6F\x77\x4F\x6E\x44\x65\x73\x6B\x74\x6F\x70","\x6D\x6F\x64\x61\x6C\x53\x68\x6F\x77\x4F\x6E\x4D\x6F\x62\x69\x6C\x65","\x66\x75\x6E\x63\x74\x69\x6F\x6E","\x6D\x6F\x64\x61\x6C\x4F\x70\x65\x6E\x65\x64","\x66\x6F\x63\x75\x73\x69\x6E\x2E\x6D\x6F\x64\x61\x6C","\x6B\x65\x79\x70\x72\x65\x73\x73","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x61\x63\x74\x69\x6F\x6E\x5F\x62\x74\x6E","\x69\x6E\x70\x75\x74\x5B\x74\x79\x70\x65\x3D\x74\x65\x78\x74\x5D","\x2D\x32\x30\x30\x30\x70\x78","\x6D\x6F\x64\x61\x6C\x53\x61\x76\x65\x42\x6F\x64\x79\x4F\x76\x65\x66\x6C\x6F\x77","\x6F\x76\x65\x72\x66\x6C\x6F\x77","\x6F\x75\x74\x65\x72\x48\x65\x69\x67\x68\x74","\x33\x30\x30\x70\x78","\x6D\x6F\x64\x61\x6C\x63\x6F\x6E\x74\x65\x6E\x74","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x69\x6E\x6E\x65\x72","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x68\x65\x61\x64\x65\x72","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x62\x74\x6E\x5F\x68\x69\x64\x64\x65\x6E","\x66\x6F\x6F\x74\x65\x72\x20\x62\x75\x74\x74\x6F\x6E","\x2E\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x62\x74\x6E\x5F\x6D\x6F\x64\x61\x6C\x5F\x63\x6C\x6F\x73\x65","\x6D\x6F\x64\x61\x6C\x4F\x76\x65\x72\x6C\x61\x79","\x24\x72\x65\x64\x61\x63\x74\x6F\x72\x4D\x6F\x64\x61\x6C\x4F\x76\x65\x72\x6C\x61\x79","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x6F\x76\x65\x72\x6C\x61\x79","\x3C\x64\x69\x76\x20\x69\x64\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x6D\x6F\x64\x61\x6C\x5F\x6F\x76\x65\x72\x6C\x61\x79\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x6E\x6F\x6E\x65\x3B\x22\x3E\x3C\x2F\x64\x69\x76\x3E","\x64\x72\x61\x67\x67\x61\x62\x6C\x65","\x63\x75\x72\x73\x6F\x72","\x6D\x6F\x76\x65","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62","\x23\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x74\x61\x62\x5F\x73\x65\x6C\x65\x63\x74\x65\x64","\x6D\x61\x72\x67\x69\x6E\x2D\x74\x6F\x70","\x66\x61\x73\x74","\x68\x64\x6C\x4D\x6F\x64\x61\x6C\x43\x6C\x6F\x73\x65","\x75\x6E\x62\x69\x6E\x64","\x6D\x6F\x64\x61\x6C\x43\x6C\x6F\x73\x65\x64","\x73\x33\x75\x70\x6C\x6F\x61\x64\x54\x6F\x53\x33","\x73\x33\x65\x78\x65\x63\x75\x74\x65\x4F\x6E\x53\x69\x67\x6E\x65\x64\x55\x72\x6C","\x47\x45\x54","\x26\x74\x79\x70\x65\x3D","\x6F\x76\x65\x72\x72\x69\x64\x65\x4D\x69\x6D\x65\x54\x79\x70\x65","\x74\x65\x78\x74\x2F\x70\x6C\x61\x69\x6E\x3B\x20\x63\x68\x61\x72\x73\x65\x74\x3D\x78\x2D\x75\x73\x65\x72\x2D\x64\x65\x66\x69\x6E\x65\x64","\x6F\x6E\x72\x65\x61\x64\x79\x73\x74\x61\x74\x65\x63\x68\x61\x6E\x67\x65","\x72\x65\x61\x64\x79\x53\x74\x61\x74\x65","\x73\x74\x61\x74\x75\x73","\x72\x65\x73\x70\x6F\x6E\x73\x65\x54\x65\x78\x74","\x73\x65\x6E\x64","\x77\x69\x74\x68\x43\x72\x65\x64\x65\x6E\x74\x69\x61\x6C\x73","\x50\x55\x54","\x73\x33\x63\x72\x65\x61\x74\x65\x43\x4F\x52\x53\x52\x65\x71\x75\x65\x73\x74","\x68\x69\x64\x65\x50\x72\x6F\x67\x72\x65\x73\x73\x42\x61\x72","\x6F\x6E\x65\x72\x72\x6F\x72","\x6F\x6E\x70\x72\x6F\x67\x72\x65\x73\x73","\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65","\x73\x65\x74\x52\x65\x71\x75\x65\x73\x74\x48\x65\x61\x64\x65\x72","\x78\x2D\x61\x6D\x7A\x2D\x61\x63\x6C","\x70\x75\x62\x6C\x69\x63\x2D\x72\x65\x61\x64","\x75\x70\x6C\x6F\x61\x64\x4F\x70\x74\x69\x6F\x6E\x73","\x49\x4E\x50\x55\x54","\x65\x6C","\x65\x6C\x65\x6D\x65\x6E\x74\x5F\x61\x63\x74\x69\x6F\x6E","\x61\x63\x74\x69\x6F\x6E","\x73\x75\x62\x6D\x69\x74","\x75\x70\x6C\x6F\x61\x64\x53\x75\x62\x6D\x69\x74","\x74\x72\x69\x67\x67\x65\x72","\x65\x6C\x65\x6D\x65\x6E\x74","\x75\x70\x6C\x6F\x61\x64\x46\x72\x61\x6D\x65","\x75\x70\x6C\x6F\x61\x64\x46\x6F\x72\x6D","\x66","\x3C\x69\x66\x72\x61\x6D\x65\x20\x73\x74\x79\x6C\x65\x3D\x22\x64\x69\x73\x70\x6C\x61\x79\x3A\x6E\x6F\x6E\x65\x22\x20\x69\x64\x3D\x22","\x22\x20\x6E\x61\x6D\x65\x3D\x22","\x22\x3E\x3C\x2F\x69\x66\x72\x61\x6D\x65\x3E","\x75\x70\x6C\x6F\x61\x64\x4C\x6F\x61\x64\x65\x64","\x72\x65\x64\x61\x63\x74\x6F\x72\x55\x70\x6C\x6F\x61\x64\x46\x6F\x72\x6D","\x72\x65\x64\x61\x63\x74\x6F\x72\x55\x70\x6C\x6F\x61\x64\x46\x69\x6C\x65","\x3C\x66\x6F\x72\x6D\x20\x20\x61\x63\x74\x69\x6F\x6E\x3D\x22","\x22\x20\x6D\x65\x74\x68\x6F\x64\x3D\x22\x50\x4F\x53\x54\x22\x20\x74\x61\x72\x67\x65\x74\x3D\x22","\x22\x20\x69\x64\x3D\x22","\x22\x20\x65\x6E\x63\x74\x79\x70\x65\x3D\x22\x6D\x75\x6C\x74\x69\x70\x61\x72\x74\x2F\x66\x6F\x72\x6D\x2D\x64\x61\x74\x61\x22\x20\x2F\x3E","\x3C\x69\x6E\x70\x75\x74\x2F\x3E","\x65\x6E\x63\x74\x79\x70\x65","\x6D\x75\x6C\x74\x69\x70\x61\x72\x74\x2F\x66\x6F\x72\x6D\x2D\x64\x61\x74\x61","\x6D\x65\x74\x68\x6F\x64","\x50\x4F\x53\x54","\x63\x6F\x6E\x74\x65\x6E\x74\x44\x6F\x63\x75\x6D\x65\x6E\x74","\x66\x72\x61\x6D\x65\x73","\x73\x75\x63\x63\x65\x73\x73","\x55\x70\x6C\x6F\x61\x64\x20\x66\x61\x69\x6C\x65\x64\x21","\x64\x72\x61\x67\x75\x70\x6C\x6F\x61\x64\x4F\x70\x74\x69\x6F\x6E\x73","\x64\x72\x6F\x70\x5F\x66\x69\x6C\x65\x5F\x68\x65\x72\x65","\x6F\x72\x5F\x63\x68\x6F\x6F\x73\x65","\x64\x72\x6F\x70\x61\x72\x65\x61","\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x64\x72\x6F\x70\x61\x72\x65\x61\x22\x3E\x3C\x2F\x64\x69\x76\x3E","\x64\x72\x6F\x70\x61\x72\x65\x61\x62\x6F\x78","\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x64\x72\x6F\x70\x61\x72\x65\x61\x62\x6F\x78\x22\x3E","\x3C\x2F\x64\x69\x76\x3E","\x64\x72\x6F\x70\x61\x6C\x74\x65\x72\x6E\x61\x74\x69\x76\x65","\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x64\x61\x63\x74\x6F\x72\x5F\x64\x72\x6F\x70\x61\x6C\x74\x65\x72\x6E\x61\x74\x69\x76\x65\x22\x3E","\x61\x74\x65\x78\x74","\x64\x72\x61\x67\x6F\x76\x65\x72","\x64\x72\x61\x67\x75\x70\x6C\x6F\x61\x64\x4F\x6E\x64\x72\x61\x67","\x64\x72\x61\x67\x6C\x65\x61\x76\x65","\x64\x72\x61\x67\x75\x70\x6C\x6F\x61\x64\x4F\x6E\x64\x72\x61\x67\x6C\x65\x61\x76\x65","\x6F\x6E\x64\x72\x6F\x70","\x64\x72\x6F\x70","\x68\x6F\x76\x65\x72","\x75\x70\x6C\x6F\x61\x64\x50\x61\x72\x61\x6D","\x78\x68\x72","\x61\x6A\x61\x78\x53\x65\x74\x74\x69\x6E\x67\x73","\x70\x72\x6F\x67\x72\x65\x73\x73","\x75\x70\x6C\x6F\x61\x64\x50\x72\x6F\x67\x72\x65\x73\x73","\x61\x64\x64\x45\x76\x65\x6E\x74\x4C\x69\x73\x74\x65\x6E\x65\x72","\x61\x6A\x61\x78\x53\x65\x74\x75\x70","\x3C\x69\x6D\x67\x3E","\x64\x72\x61\x67\x2D\x69\x6D\x61\x67\x65\x2D\x6D\x61\x72\x6B\x65\x72","\x69\x6E\x73\x65\x72\x74\x4E\x6F\x64\x65\x54\x6F\x43\x61\x72\x65\x74\x50\x6F\x73\x69\x74\x69\x6F\x6E\x46\x72\x6F\x6D\x50\x6F\x69\x6E\x74","\x69\x6D\x67\x23\x64\x72\x61\x67\x2D\x69\x6D\x61\x67\x65\x2D\x6D\x61\x72\x6B\x65\x72","\x6C\x6F\x61\x64\x65\x64","\x74\x6F\x74\x61\x6C","\x4C\x6F\x61\x64\x69\x6E\x67\x20","\x25\x20","\x74\x6F\x53\x74\x72\x69\x6E\x67","\x5B\x6F\x62\x6A\x65\x63\x74\x20\x53\x74\x72\x69\x6E\x67\x5D","\x61\x70\x70\x4E\x61\x6D\x65","\x4D\x69\x63\x72\x6F\x73\x6F\x66\x74\x20\x49\x6E\x74\x65\x72\x6E\x65\x74\x20\x45\x78\x70\x6C\x6F\x72\x65\x72","\x4D\x53\x49\x45\x20\x28\x5B\x30\x2D\x39\x5D\x7B\x31\x2C\x7D\x5B\x2E\x30\x2D\x39\x5D\x7B\x30\x2C\x7D\x29","\x74\x72\x69\x64\x65\x6E\x74","\x63\x6F\x6D\x70\x61\x74\x69\x62\x6C\x65","\x72\x76","\x6F\x70\x72","\x63\x6C\x6F\x6E\x65\x4E\x6F\x64\x65","\x67\x65\x74\x43\x61\x72\x65\x74\x4F\x66\x66\x73\x65\x74\x52\x61\x6E\x67\x65","\x3C\x69\x6D\x67\x20\x73\x72\x63\x3D\x22\x24\x31\x22\x3E","\x24\x24\x24"];(function ($){var uuid=0;_0xf604[0];var Range=function (range){this[0]=range[_0xf604[1]];this[1]=range[_0xf604[2]];this[_0xf604[3]]=range;return this;} ;Range[_0xf604[5]][_0xf604[4]]=function (){return this[0]===this[1];} ;var reUrlYoutube=/https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;var reUrlVimeo=/https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;$[_0xf604[7]][_0xf604[6]]=function (options){var val=[];var args=Array[_0xf604[5]][_0xf604[9]][_0xf604[8]](arguments,1);if( typeof options===_0xf604[10]){this[_0xf604[19]](function (){var instance=$[_0xf604[11]](this,_0xf604[6]);if( typeof instance!==_0xf604[12]&&$[_0xf604[13]](instance[options])){var methodVal=instance[options][_0xf604[14]](instance,args);if(methodVal!==undefined&&methodVal!==instance){val[_0xf604[15]](methodVal);} ;} else {return $[_0xf604[18]](_0xf604[16]+options+_0xf604[17]);} ;} );} else {this[_0xf604[19]](function (){if(!$[_0xf604[11]](this,_0xf604[6])){$[_0xf604[11]](this,_0xf604[6],Redactor(this,options));} ;} );} ;if(val[_0xf604[20]]===0){return this;} else {if(val[_0xf604[20]]===1){return val[0];} else {return val;} ;} ;} ;function Redactor(el,options){return  new Redactor[_0xf604[5]][_0xf604[21]](el,options);} ;$[_0xf604[22]]=Redactor;$[_0xf604[22]][_0xf604[23]]=_0xf604[24];$[_0xf604[22]][_0xf604[25]]={rangy:false,iframe:false,fullpage:false,css:false,lang:_0xf604[26],direction:_0xf604[27],placeholder:false,typewriter:false,wym:false,mobile:true,cleanup:true,tidyHtml:true,pastePlainText:false,removeEmptyTags:true,cleanSpaces:true,cleanFontTag:true,templateVars:false,xhtml:false,visual:true,focus:false,tabindex:false,autoresize:true,minHeight:false,maxHeight:false,shortcuts:{"\x63\x74\x72\x6C\x2B\x6D\x2C\x20\x6D\x65\x74\x61\x2B\x6D":_0xf604[28],"\x63\x74\x72\x6C\x2B\x62\x2C\x20\x6D\x65\x74\x61\x2B\x62":_0xf604[29],"\x63\x74\x72\x6C\x2B\x69\x2C\x20\x6D\x65\x74\x61\x2B\x69":_0xf604[30],"\x63\x74\x72\x6C\x2B\x68\x2C\x20\x6D\x65\x74\x61\x2B\x68":_0xf604[31],"\x63\x74\x72\x6C\x2B\x6C\x2C\x20\x6D\x65\x74\x61\x2B\x6C":_0xf604[32],"\x63\x74\x72\x6C\x2B\x6B\x2C\x20\x6D\x65\x74\x61\x2B\x6B":_0xf604[33],"\x63\x74\x72\x6C\x2B\x73\x68\x69\x66\x74\x2B\x37":_0xf604[34],"\x63\x74\x72\x6C\x2B\x73\x68\x69\x66\x74\x2B\x38":_0xf604[35]},shortcutsAdd:false,autosave:false,autosaveInterval:60,plugins:false,linkProtocol:_0xf604[36],linkNofollow:false,linkSize:50,predefinedLinks:false,imageFloatMargin:_0xf604[37],imageGetJson:false,dragUpload:true,imageTabLink:true,imageUpload:false,imageUploadParam:_0xf604[38],imageResizable:true,fileUpload:false,fileUploadParam:_0xf604[38],clipboardUpload:true,clipboardUploadUrl:false,dnbImageTypes:[_0xf604[39],_0xf604[40],_0xf604[41]],s3:false,uploadFields:false,observeImages:true,observeLinks:true,modalOverlay:true,tabSpaces:false,tabFocus:true,air:false,airButtons:[_0xf604[42],_0xf604[43],_0xf604[44],_0xf604[45],_0xf604[46],_0xf604[47],_0xf604[48],_0xf604[49]],toolbar:true,toolbarFixed:false,toolbarFixedTarget:document,toolbarFixedTopOffset:0,toolbarFixedBox:false,toolbarExternal:false,toolbarOverflow:false,buttonSource:true,buttons:[_0xf604[50],_0xf604[42],_0xf604[43],_0xf604[44],_0xf604[45],_0xf604[46],_0xf604[47],_0xf604[48],_0xf604[49],_0xf604[51],_0xf604[52],_0xf604[38],_0xf604[53],_0xf604[54],_0xf604[55],_0xf604[56],_0xf604[57]],buttonsHideOnMobile:[],activeButtons:[_0xf604[45],_0xf604[44],_0xf604[43],_0xf604[58],_0xf604[46],_0xf604[47],_0xf604[59],_0xf604[60],_0xf604[61],_0xf604[62],_0xf604[53]],activeButtonsStates:{b:_0xf604[43],strong:_0xf604[43],i:_0xf604[44],em:_0xf604[44],del:_0xf604[45],strike:_0xf604[45],ul:_0xf604[46],ol:_0xf604[47],u:_0xf604[58],tr:_0xf604[53],td:_0xf604[53],table:_0xf604[53]},formattingTags:[_0xf604[63],_0xf604[64],_0xf604[65],_0xf604[66],_0xf604[67],_0xf604[68],_0xf604[69],_0xf604[70],_0xf604[71]],linebreaks:false,paragraphy:true,convertDivs:true,convertLinks:true,convertImageLinks:false,convertVideoLinks:false,formattingPre:false,phpTags:false,allowedTags:false,deniedTags:[_0xf604[50],_0xf604[72],_0xf604[54],_0xf604[73],_0xf604[74],_0xf604[75],_0xf604[76],_0xf604[77]],boldTag:_0xf604[78],italicTag:_0xf604[79],indentValue:20,buffer:[],rebuffer:[],textareamode:false,emptyHtml:_0xf604[80],invisibleSpace:_0xf604[81],rBlockTest:/^(P|H[1-6]|LI|ADDRESS|SECTION|HEADER|FOOTER|ASIDE|ARTICLE)$/i,alignmentTags:[_0xf604[82],_0xf604[83],_0xf604[84],_0xf604[85],_0xf604[86],_0xf604[87],_0xf604[88],_0xf604[89],_0xf604[90],_0xf604[91],_0xf604[92],_0xf604[93],_0xf604[94],_0xf604[95],_0xf604[96],_0xf604[97],_0xf604[98],_0xf604[99],_0xf604[100],_0xf604[101],_0xf604[102]],ownLine:[_0xf604[103],_0xf604[73],_0xf604[72],_0xf604[104],_0xf604[105],_0xf604[54],_0xf604[74],_0xf604[106],_0xf604[76],_0xf604[75],_0xf604[53],_0xf604[107],_0xf604[108],_0xf604[109]],contOwnLine:[_0xf604[110],_0xf604[111],_0xf604[111],_0xf604[112],_0xf604[113],_0xf604[75]],newLevel:[_0xf604[64],_0xf604[114],_0xf604[115],_0xf604[116],_0xf604[117],_0xf604[118],_0xf604[119],_0xf604[120],_0xf604[63],_0xf604[65],_0xf604[121],_0xf604[122],_0xf604[123],_0xf604[124],_0xf604[125]],blockLevelElements:[_0xf604[82],_0xf604[83],_0xf604[84],_0xf604[85],_0xf604[86],_0xf604[87],_0xf604[88],_0xf604[89],_0xf604[90],_0xf604[91],_0xf604[92],_0xf604[126],_0xf604[94],_0xf604[95],_0xf604[96],_0xf604[127],_0xf604[97],_0xf604[98],_0xf604[99],_0xf604[100],_0xf604[101],_0xf604[102],_0xf604[93]],langs:{en:{html:_0xf604[128],video:_0xf604[129],image:_0xf604[130],table:_0xf604[131],link:_0xf604[132],link_insert:_0xf604[133],link_edit:_0xf604[134],unlink:_0xf604[135],formatting:_0xf604[136],paragraph:_0xf604[137],quote:_0xf604[138],code:_0xf604[139],header1:_0xf604[140],header2:_0xf604[141],header3:_0xf604[142],header4:_0xf604[143],header5:_0xf604[144],bold:_0xf604[145],italic:_0xf604[146],fontcolor:_0xf604[147],backcolor:_0xf604[148],unorderedlist:_0xf604[149],orderedlist:_0xf604[150],outdent:_0xf604[151],indent:_0xf604[152],cancel:_0xf604[153],insert:_0xf604[154],save:_0xf604[155],_delete:_0xf604[156],insert_table:_0xf604[157],insert_row_above:_0xf604[158],insert_row_below:_0xf604[159],insert_column_left:_0xf604[160],insert_column_right:_0xf604[161],delete_column:_0xf604[162],delete_row:_0xf604[163],delete_table:_0xf604[164],rows:_0xf604[165],columns:_0xf604[166],add_head:_0xf604[167],delete_head:_0xf604[168],title:_0xf604[169],image_position:_0xf604[170],none:_0xf604[171],left:_0xf604[172],right:_0xf604[173],center:_0xf604[174],image_web_link:_0xf604[175],text:_0xf604[176],mailto:_0xf604[177],web:_0xf604[178],video_html_code:_0xf604[179],file:_0xf604[180],upload:_0xf604[181],download:_0xf604[182],choose:_0xf604[183],or_choose:_0xf604[184],drop_file_here:_0xf604[185],align_left:_0xf604[186],align_center:_0xf604[187],align_right:_0xf604[188],align_justify:_0xf604[189],horizontalrule:_0xf604[190],deleted:_0xf604[191],anchor:_0xf604[192],link_new_tab:_0xf604[193],underline:_0xf604[194],alignment:_0xf604[195],filename:_0xf604[196],edit:_0xf604[197]}}};Redactor[_0xf604[7]]=$[_0xf604[22]][_0xf604[5]]={keyCode:{BACKSPACE:8,DELETE:46,DOWN:40,ENTER:13,ESC:27,TAB:9,CTRL:17,META:91,LEFT:37,LEFT_WIN:91},init:function (el,options){this[_0xf604[198]]=false;this[_0xf604[199]]=this[_0xf604[200]]=$(el);this[_0xf604[201]]=uuid++;var opts=$[_0xf604[202]](true,{},$[_0xf604[22]][_0xf604[25]]);this[_0xf604[25]]=$[_0xf604[202]]({},opts,this[_0xf604[199]][_0xf604[11]](),options);this[_0xf604[203]]=true;this[_0xf604[204]]=[];this[_0xf604[205]]=this[_0xf604[200]][_0xf604[207]](_0xf604[206]);this[_0xf604[208]]=this[_0xf604[200]][_0xf604[207]](_0xf604[209]);if(this[_0xf604[25]][_0xf604[210]]){this[_0xf604[25]][_0xf604[211]]=true;} ;if(this[_0xf604[25]][_0xf604[212]]){this[_0xf604[25]][_0xf604[213]]=false;} ;if(this[_0xf604[25]][_0xf604[213]]){this[_0xf604[25]][_0xf604[212]]=false;} ;if(this[_0xf604[25]][_0xf604[214]]){this[_0xf604[25]][_0xf604[215]]=true;} ;this[_0xf604[216]]=document;this[_0xf604[217]]=window;this[_0xf604[218]]=false;this[_0xf604[219]]= new RegExp(_0xf604[220]+this[_0xf604[25]][_0xf604[223]][_0xf604[222]](_0xf604[221])+_0xf604[56]+this[_0xf604[25]][_0xf604[224]][_0xf604[222]](_0xf604[56])+_0xf604[225]);this[_0xf604[226]]= new RegExp(_0xf604[227]+this[_0xf604[25]][_0xf604[223]][_0xf604[222]](_0xf604[221])+_0xf604[228]+this[_0xf604[25]][_0xf604[224]][_0xf604[222]](_0xf604[228])+_0xf604[225]);this[_0xf604[229]]= new RegExp(_0xf604[230]+this[_0xf604[25]][_0xf604[231]][_0xf604[222]](_0xf604[56])+_0xf604[225]);this[_0xf604[232]]= new RegExp(_0xf604[233]+this[_0xf604[25]][_0xf604[234]][_0xf604[222]](_0xf604[56])+_0xf604[235],_0xf604[236]);if(this[_0xf604[25]][_0xf604[212]]===false){if(this[_0xf604[25]][_0xf604[237]]!==false){var arrSearch=[_0xf604[78],_0xf604[79],_0xf604[238]];var arrAdd=[_0xf604[239],_0xf604[236],_0xf604[240]];if($[_0xf604[241]](_0xf604[63],this[_0xf604[25]][_0xf604[237]])===_0xf604[242]){this[_0xf604[25]][_0xf604[237]][_0xf604[15]](_0xf604[63]);} ;for(i in arrSearch){if($[_0xf604[241]](arrSearch[i],this[_0xf604[25]][_0xf604[237]])!=_0xf604[242]){this[_0xf604[25]][_0xf604[237]][_0xf604[15]](arrAdd[i]);} ;} ;} ;if(this[_0xf604[25]][_0xf604[243]]!==false){var pos=$[_0xf604[241]](_0xf604[63],this[_0xf604[25]][_0xf604[243]]);if(pos!==_0xf604[242]){this[_0xf604[25]][_0xf604[243]][_0xf604[244]](pos,pos);} ;} ;} ;if(this[_0xf604[246]](_0xf604[245])||this[_0xf604[246]](_0xf604[247])){this[_0xf604[25]][_0xf604[248]]=this[_0xf604[249]](this[_0xf604[25]][_0xf604[248]],_0xf604[57]);} ;this[_0xf604[25]][_0xf604[250]]=this[_0xf604[25]][_0xf604[252]][this[_0xf604[25]][_0xf604[251]]];$[_0xf604[202]](this[_0xf604[25]][_0xf604[253]],this[_0xf604[25]][_0xf604[254]]);this[_0xf604[255]]();this[_0xf604[256]]();} ,toolbarInit:function (lang){return {html:{title:lang[_0xf604[50]],func:_0xf604[257]},formatting:{title:lang[_0xf604[42]],func:_0xf604[258],dropdown:{p:{title:lang[_0xf604[259]],func:_0xf604[260]},blockquote:{title:lang[_0xf604[261]],func:_0xf604[262],className:_0xf604[263]},pre:{title:lang[_0xf604[264]],func:_0xf604[260],className:_0xf604[265]},h1:{title:lang[_0xf604[266]],func:_0xf604[260],className:_0xf604[267]},h2:{title:lang[_0xf604[268]],func:_0xf604[260],className:_0xf604[269]},h3:{title:lang[_0xf604[270]],func:_0xf604[260],className:_0xf604[271]},h4:{title:lang[_0xf604[272]],func:_0xf604[260],className:_0xf604[273]},h5:{title:lang[_0xf604[274]],func:_0xf604[260],className:_0xf604[275]}}},bold:{title:lang[_0xf604[43]],exec:_0xf604[43]},italic:{title:lang[_0xf604[44]],exec:_0xf604[44]},deleted:{title:lang[_0xf604[45]],exec:_0xf604[276]},underline:{title:lang[_0xf604[58]],exec:_0xf604[58]},unorderedlist:{title:_0xf604[277]+lang[_0xf604[46]],exec:_0xf604[278]},orderedlist:{title:_0xf604[279]+lang[_0xf604[47]],exec:_0xf604[280]},outdent:{title:_0xf604[281]+lang[_0xf604[48]],func:_0xf604[282]},indent:{title:_0xf604[283]+lang[_0xf604[49]],func:_0xf604[284]},image:{title:lang[_0xf604[51]],func:_0xf604[285]},video:{title:lang[_0xf604[52]],func:_0xf604[286]},file:{title:lang[_0xf604[38]],func:_0xf604[287]},table:{title:lang[_0xf604[53]],func:_0xf604[258],dropdown:{insert_table:{title:lang[_0xf604[288]],func:_0xf604[289]},separator_drop1:{name:_0xf604[290]},insert_row_above:{title:lang[_0xf604[291]],func:_0xf604[292]},insert_row_below:{title:lang[_0xf604[293]],func:_0xf604[294]},insert_column_left:{title:lang[_0xf604[295]],func:_0xf604[296]},insert_column_right:{title:lang[_0xf604[297]],func:_0xf604[298]},separator_drop2:{name:_0xf604[290]},add_head:{title:lang[_0xf604[299]],func:_0xf604[300]},delete_head:{title:lang[_0xf604[301]],func:_0xf604[302]},separator_drop3:{name:_0xf604[290]},delete_column:{title:lang[_0xf604[303]],func:_0xf604[304]},delete_row:{title:lang[_0xf604[305]],func:_0xf604[306]},delete_table:{title:lang[_0xf604[307]],func:_0xf604[308]}}},link:{title:lang[_0xf604[54]],func:_0xf604[258],dropdown:{link:{title:lang[_0xf604[309]],func:_0xf604[310]},unlink:{title:lang[_0xf604[311]],exec:_0xf604[311]}}},alignment:{title:lang[_0xf604[55]],func:_0xf604[258],dropdown:{alignleft:{title:lang[_0xf604[312]],func:_0xf604[313]},aligncenter:{title:lang[_0xf604[314]],func:_0xf604[315]},alignright:{title:lang[_0xf604[316]],func:_0xf604[317]},justify:{title:lang[_0xf604[318]],func:_0xf604[319]}}},alignleft:{title:lang[_0xf604[312]],func:_0xf604[313]},aligncenter:{title:lang[_0xf604[314]],func:_0xf604[315]},alignright:{title:lang[_0xf604[316]],func:_0xf604[317]},alignjustify:{title:lang[_0xf604[318]],func:_0xf604[319]},horizontalrule:{exec:_0xf604[320],title:lang[_0xf604[57]]}};} ,callback:function (type,event,data){var callback=this[_0xf604[25]][type+_0xf604[321]];if($[_0xf604[13]](callback)){if(event===false){return callback[_0xf604[8]](this,data);} else {return callback[_0xf604[8]](this,event,data);} ;} else {return data;} ;} ,destroy:function (){clearInterval(this[_0xf604[322]]);$(window)[_0xf604[324]](_0xf604[323]);this[_0xf604[200]][_0xf604[324]](_0xf604[325]);this[_0xf604[199]][_0xf604[324]](_0xf604[323])[_0xf604[326]](_0xf604[6]);var html=this[_0xf604[327]]();if(this[_0xf604[25]][_0xf604[328]]){this[_0xf604[330]][_0xf604[329]](this.$source);this[_0xf604[330]][_0xf604[331]]();this[_0xf604[200]][_0xf604[332]](html)[_0xf604[258]]();} else {var $elem=this[_0xf604[333]];if(this[_0xf604[25]][_0xf604[211]]){$elem=this[_0xf604[199]];} ;this[_0xf604[330]][_0xf604[329]]($elem);this[_0xf604[330]][_0xf604[331]]();$elem[_0xf604[337]](_0xf604[338])[_0xf604[337]](_0xf604[336])[_0xf604[335]](_0xf604[334])[_0xf604[50]](html)[_0xf604[258]]();} ;if(this[_0xf604[25]][_0xf604[339]]){$(this[_0xf604[25]][_0xf604[339]])[_0xf604[50]](_0xf604[340]);} ;if(this[_0xf604[25]][_0xf604[341]]){$(_0xf604[342]+this[_0xf604[201]])[_0xf604[331]]();} ;} ,getObject:function (){return $[_0xf604[202]]({},this);} ,getEditor:function (){return this[_0xf604[333]];} ,getBox:function (){return this[_0xf604[330]];} ,getIframe:function (){return (this[_0xf604[25]][_0xf604[211]])?this[_0xf604[343]]:false;} ,getToolbar:function (){return (this[_0xf604[344]])?this[_0xf604[344]]:false;} ,get:function (){return this[_0xf604[200]][_0xf604[332]]();} ,getCodeIframe:function (){this[_0xf604[333]][_0xf604[335]](_0xf604[334])[_0xf604[335]](_0xf604[345]);var html=this[_0xf604[348]](this[_0xf604[343]][_0xf604[347]]()[_0xf604[346]]());this[_0xf604[333]][_0xf604[350]]({contenteditable:true,dir:this[_0xf604[25]][_0xf604[349]]});return html;} ,set:function (html,strip,placeholderRemove){html=html.toString();html=html[_0xf604[352]](/\$/g,_0xf604[351]);if(this[_0xf604[25]][_0xf604[210]]){this[_0xf604[353]](html);} else {this[_0xf604[354]](html,strip);} ;if(html==_0xf604[340]){placeholderRemove=false;} ;if(placeholderRemove!==false){this[_0xf604[355]]();} ;} ,setEditor:function (html,strip){if(strip!==false){html=this[_0xf604[356]](html);html=this[_0xf604[357]](html);html=this[_0xf604[358]](html);html=this[_0xf604[359]](html,true);if(this[_0xf604[25]][_0xf604[212]]===false){html=this[_0xf604[360]](html);} else {html=html[_0xf604[352]](/<p(.*?)>([\w\W]*?)<\/p>/gi,_0xf604[361]);} ;} ;html=html[_0xf604[352]](/&amp;#36;/g,_0xf604[362]);html=this[_0xf604[363]](html);this[_0xf604[333]][_0xf604[50]](html);this[_0xf604[364]]();this[_0xf604[365]]();this[_0xf604[366]]();} ,setCodeIframe:function (html){var doc=this[_0xf604[367]]();this[_0xf604[343]][0][_0xf604[368]]=_0xf604[369];html=this[_0xf604[358]](html);html=this[_0xf604[359]](html);html=this[_0xf604[370]](html);doc[_0xf604[371]]();doc[_0xf604[372]](html);doc[_0xf604[373]]();if(this[_0xf604[25]][_0xf604[210]]){this[_0xf604[333]]=this[_0xf604[343]][_0xf604[347]]()[_0xf604[374]](_0xf604[73])[_0xf604[350]]({contenteditable:true,dir:this[_0xf604[25]][_0xf604[349]]});} ;this[_0xf604[364]]();this[_0xf604[365]]();this[_0xf604[366]]();} ,setFullpageOnInit:function (html){this[_0xf604[375]]=html[_0xf604[376]](/^<\!doctype[^>]*>/i);if(this[_0xf604[375]]&&this[_0xf604[375]][_0xf604[20]]==1){html=html[_0xf604[352]](/^<\!doctype[^>]*>/i,_0xf604[340]);} ;html=this[_0xf604[356]](html,true);html=this[_0xf604[360]](html);html=this[_0xf604[363]](html);this[_0xf604[333]][_0xf604[50]](html);this[_0xf604[364]]();this[_0xf604[365]]();this[_0xf604[366]]();} ,setFullpageDoctype:function (){if(this[_0xf604[375]]&&this[_0xf604[375]][_0xf604[20]]==1){var source=this[_0xf604[375]][0]+_0xf604[377]+this[_0xf604[200]][_0xf604[332]]();this[_0xf604[200]][_0xf604[332]](source);} ;} ,setSpansVerified:function (){var spans=this[_0xf604[333]][_0xf604[374]](_0xf604[378]);var replacementTag=_0xf604[379];$[_0xf604[19]](spans,function (){var outer=this[_0xf604[380]];var regex= new RegExp(_0xf604[381]+this[_0xf604[382]],_0xf604[383]);var newTag=outer[_0xf604[352]](regex,_0xf604[381]+replacementTag);regex= new RegExp(_0xf604[384]+this[_0xf604[382]],_0xf604[383]);newTag=newTag[_0xf604[352]](regex,_0xf604[384]+replacementTag);$(this)[_0xf604[385]](newTag);} );} ,setSpansVerifiedHtml:function (html){html=html[_0xf604[352]](/<span(.*?)>/,_0xf604[386]);return html[_0xf604[352]](/<\/span>/,_0xf604[387]);} ,setNonEditable:function (){this[_0xf604[333]][_0xf604[374]](_0xf604[388])[_0xf604[350]](_0xf604[334],false);} ,sync:function (e){var html=_0xf604[340];this[_0xf604[389]]();if(this[_0xf604[25]][_0xf604[210]]){html=this[_0xf604[390]]();} else {html=this[_0xf604[333]][_0xf604[50]]();} ;html=this[_0xf604[391]](html);html=this[_0xf604[392]](html);var source=this[_0xf604[370]](this[_0xf604[200]][_0xf604[332]](),false);var editor=this[_0xf604[370]](html,false);if(source==editor){return false;} ;html=html[_0xf604[352]](/<\/li><(ul|ol)>([\w\W]*?)<\/(ul|ol)>/gi,_0xf604[393]);if($[_0xf604[394]](html)===_0xf604[395]){html=_0xf604[340];} ;if(this[_0xf604[25]][_0xf604[396]]){var xhtmlTags=[_0xf604[397],_0xf604[104],_0xf604[398],_0xf604[54],_0xf604[399],_0xf604[74]];$[_0xf604[19]](xhtmlTags,function (i,s){html=html[_0xf604[352]]( new RegExp(_0xf604[381]+s+_0xf604[400],_0xf604[383]),_0xf604[381]+s+_0xf604[401]);} );} ;html=this[_0xf604[403]](_0xf604[402],false,html);this[_0xf604[200]][_0xf604[332]](html);this[_0xf604[404]]();this[_0xf604[403]](_0xf604[405],false,html);if(this[_0xf604[203]]===false){if( typeof e!=_0xf604[12]){switch(e[_0xf604[407]]){case 37:break ;;case 38:break ;;case 39:break ;;case 40:break ;;default:this[_0xf604[403]](_0xf604[406],false,html);;} ;} else {this[_0xf604[403]](_0xf604[406],false,html);} ;} ;} ,syncClean:function (html){if(!this[_0xf604[25]][_0xf604[210]]){html=this[_0xf604[357]](html);} ;html=$[_0xf604[394]](html);html=this[_0xf604[408]](html);html=html[_0xf604[352]](/&#x200b;/gi,_0xf604[340]);html=html[_0xf604[352]](/&#8203;/gi,_0xf604[340]);html=html[_0xf604[352]](/<\/a>&nbsp;/gi,_0xf604[409]);html=html[_0xf604[352]](/\u200B/g,_0xf604[340]);if(html==_0xf604[410]||html==_0xf604[411]||html==_0xf604[412]){html=_0xf604[340];} ;if(this[_0xf604[25]][_0xf604[413]]){html=html[_0xf604[352]](/<a(.*?)rel="nofollow"(.*?)>/gi,_0xf604[414]);html=html[_0xf604[352]](/<a(.*?)>/gi,_0xf604[415]);} ;html=html[_0xf604[352]](_0xf604[416],_0xf604[417]);html=html[_0xf604[352]](_0xf604[418],_0xf604[419]);html=html[_0xf604[352]](/<(.*?)class="noeditable"(.*?) contenteditable="false"(.*?)>/gi,_0xf604[420]);html=html[_0xf604[352]](/ data-tagblock=""/gi,_0xf604[340]);html=html[_0xf604[352]](/<br\s?\/?>\n?<\/(P|H[1-6]|LI|ADDRESS|SECTION|HEADER|FOOTER|ASIDE|ARTICLE)>/gi,_0xf604[421]);html=html[_0xf604[352]](/<span(.*?)id="redactor-image-box"(.*?)>([\w\W]*?)<img(.*?)><\/span>/gi,_0xf604[422]);html=html[_0xf604[352]](/<span(.*?)id="redactor-image-resizer"(.*?)>(.*?)<\/span>/gi,_0xf604[340]);html=html[_0xf604[352]](/<span(.*?)id="redactor-image-editter"(.*?)>(.*?)<\/span>/gi,_0xf604[340]);html=html[_0xf604[352]](/<(ul|ol)>\s*\t*\n*<\/(ul|ol)>/gi,_0xf604[340]);if(this[_0xf604[25]][_0xf604[423]]){html=html[_0xf604[352]](/<font(.*?)>([\w\W]*?)<\/font>/gi,_0xf604[424]);} ;html=html[_0xf604[352]](/<span(.*?)>([\w\W]*?)<\/span>/gi,_0xf604[424]);html=html[_0xf604[352]](/<inline>([\w\W]*?)<\/inline>/gi,_0xf604[425]);html=html[_0xf604[352]](/<inline>/gi,_0xf604[426]);html=html[_0xf604[352]](/<inline /gi,_0xf604[427]);html=html[_0xf604[352]](/<\/inline>/gi,_0xf604[428]);if(this[_0xf604[25]][_0xf604[429]]){html=html[_0xf604[352]](/<span>([\w\W]*?)<\/span>/gi,_0xf604[425]);} ;html=html[_0xf604[352]](/<span(.*?)class="redactor_placeholder"(.*?)>([\w\W]*?)<\/span>/gi,_0xf604[340]);html=html[_0xf604[352]](/<img(.*?)contenteditable="false"(.*?)>/gi,_0xf604[430]);html=html[_0xf604[352]](/&/gi,_0xf604[431]);html=html[_0xf604[352]](/\u2122/gi,_0xf604[432]);html=html[_0xf604[352]](/\u00a9/gi,_0xf604[433]);html=html[_0xf604[352]](/\u2026/gi,_0xf604[434]);html=html[_0xf604[352]](/\u2014/gi,_0xf604[435]);html=html[_0xf604[352]](/\u2010/gi,_0xf604[436]);html=this[_0xf604[437]](html);return html;} ,buildStart:function (){this[_0xf604[438]]=_0xf604[340];this[_0xf604[330]]=$(_0xf604[439]);if(this[_0xf604[200]][0][_0xf604[382]]===_0xf604[440]){this[_0xf604[25]][_0xf604[328]]=true;} ;if(this[_0xf604[25]][_0xf604[441]]===false&&this[_0xf604[442]]()){this[_0xf604[443]]();} else {this[_0xf604[444]]();if(this[_0xf604[25]][_0xf604[211]]){this[_0xf604[25]][_0xf604[445]]=false;this[_0xf604[446]]();} else {if(this[_0xf604[25]][_0xf604[328]]){this[_0xf604[447]]();} else {this[_0xf604[448]]();} ;} ;if(!this[_0xf604[25]][_0xf604[211]]){this[_0xf604[449]]();this[_0xf604[450]]();} ;} ;} ,buildMobile:function (){if(!this[_0xf604[25]][_0xf604[328]]){this[_0xf604[333]]=this[_0xf604[200]];this[_0xf604[333]][_0xf604[451]]();this[_0xf604[200]]=this[_0xf604[452]](this.$editor);this[_0xf604[200]][_0xf604[332]](this[_0xf604[438]]);} ;this[_0xf604[330]][_0xf604[454]](this.$source)[_0xf604[453]](this.$source);} ,buildContent:function (){if(this[_0xf604[25]][_0xf604[328]]){this[_0xf604[438]]=$[_0xf604[394]](this[_0xf604[200]][_0xf604[332]]());} else {this[_0xf604[438]]=$[_0xf604[394]](this[_0xf604[200]][_0xf604[50]]());} ;} ,buildFromTextarea:function (){this[_0xf604[333]]=$(_0xf604[455]);this[_0xf604[330]][_0xf604[454]](this.$source)[_0xf604[453]](this.$editor)[_0xf604[453]](this.$source);this[_0xf604[456]](this.$editor);this[_0xf604[457]]();} ,buildFromElement:function (){this[_0xf604[333]]=this[_0xf604[200]];this[_0xf604[200]]=this[_0xf604[452]](this.$editor);this[_0xf604[330]][_0xf604[454]](this.$editor)[_0xf604[453]](this.$editor)[_0xf604[453]](this.$source);this[_0xf604[457]]();} ,buildCodearea:function ($source){return $(_0xf604[460])[_0xf604[350]](_0xf604[458],$source[_0xf604[350]](_0xf604[459]))[_0xf604[207]](_0xf604[206],this[_0xf604[205]]);} ,buildAddClasses:function (el){$[_0xf604[19]](this[_0xf604[200]][_0xf604[327]](0)[_0xf604[462]][_0xf604[461]](/\s+/),function (i,s){el[_0xf604[464]](_0xf604[463]+s);} );} ,buildEnable:function (){this[_0xf604[333]][_0xf604[464]](_0xf604[338])[_0xf604[350]]({contenteditable:true,dir:this[_0xf604[25]][_0xf604[349]]});this[_0xf604[200]][_0xf604[350]](_0xf604[345],this[_0xf604[25]][_0xf604[349]])[_0xf604[451]]();this[_0xf604[465]](this[_0xf604[438]],true,false);} ,buildOptions:function (){var $source=this[_0xf604[333]];if(this[_0xf604[25]][_0xf604[211]]){$source=this[_0xf604[343]];} ;if(this[_0xf604[25]][_0xf604[466]]){$source[_0xf604[350]](_0xf604[466],this[_0xf604[25]][_0xf604[466]]);} ;if(this[_0xf604[25]][_0xf604[467]]){$source[_0xf604[207]](_0xf604[468],this[_0xf604[25]][_0xf604[467]]+_0xf604[469]);} else {if(this[_0xf604[246]](_0xf604[470])&&this[_0xf604[25]][_0xf604[212]]){this[_0xf604[333]][_0xf604[207]](_0xf604[468],_0xf604[471]);} ;} ;if(this[_0xf604[246]](_0xf604[470])&&this[_0xf604[25]][_0xf604[212]]){this[_0xf604[333]][_0xf604[207]](_0xf604[472],_0xf604[37]);} ;if(this[_0xf604[25]][_0xf604[473]]){this[_0xf604[25]][_0xf604[445]]=false;this[_0xf604[205]]=this[_0xf604[25]][_0xf604[473]];} ;if(this[_0xf604[25]][_0xf604[474]]){this[_0xf604[333]][_0xf604[464]](_0xf604[336]);} ;if(this[_0xf604[25]][_0xf604[475]]){this[_0xf604[333]][_0xf604[464]](_0xf604[476]);} ;if(!this[_0xf604[25]][_0xf604[445]]){$source[_0xf604[207]](_0xf604[206],this[_0xf604[205]]);} ;} ,buildAfter:function (){this[_0xf604[203]]=false;if(this[_0xf604[25]][_0xf604[477]]){this[_0xf604[25]][_0xf604[477]]=this[_0xf604[478]](this[_0xf604[25]][_0xf604[250]]);this[_0xf604[479]]();} ;this[_0xf604[480]]();this[_0xf604[481]]();this[_0xf604[482]]();if(this[_0xf604[25]][_0xf604[483]]){this[_0xf604[483]]();} ;setTimeout($[_0xf604[485]](this[_0xf604[484]],this),4);if(this[_0xf604[246]](_0xf604[470])){try{this[_0xf604[216]][_0xf604[487]](_0xf604[486],false,false);this[_0xf604[216]][_0xf604[487]](_0xf604[488],false,false);} catch(e){} ;} ;if(this[_0xf604[25]][_0xf604[489]]){setTimeout($[_0xf604[485]](this[_0xf604[489]],this),100);} ;if(!this[_0xf604[25]][_0xf604[490]]){setTimeout($[_0xf604[485]](function (){this[_0xf604[25]][_0xf604[490]]=true;this[_0xf604[257]](false);} ,this),200);} ;this[_0xf604[403]](_0xf604[21]);} ,buildBindKeyboard:function (){this[_0xf604[491]]=0;if(this[_0xf604[25]][_0xf604[492]]&&(this[_0xf604[25]][_0xf604[493]]!==false||this[_0xf604[25]][_0xf604[494]]!==false)){this[_0xf604[333]][_0xf604[497]](_0xf604[495],$[_0xf604[485]](this[_0xf604[496]],this));} ;this[_0xf604[333]][_0xf604[497]](_0xf604[498],$[_0xf604[485]](function (){this[_0xf604[499]]=false;} ,this));this[_0xf604[333]][_0xf604[497]](_0xf604[500],$[_0xf604[485]](this[_0xf604[366]],this));this[_0xf604[333]][_0xf604[497]](_0xf604[501],$[_0xf604[485]](this[_0xf604[502]],this));this[_0xf604[333]][_0xf604[497]](_0xf604[503],$[_0xf604[485]](this[_0xf604[504]],this));this[_0xf604[333]][_0xf604[497]](_0xf604[505],$[_0xf604[485]](this[_0xf604[506]],this));if($[_0xf604[13]](this[_0xf604[25]][_0xf604[507]])){this[_0xf604[200]][_0xf604[497]](_0xf604[508],$[_0xf604[485]](this[_0xf604[25]][_0xf604[507]],this));} ;if($[_0xf604[13]](this[_0xf604[25]][_0xf604[509]])){this[_0xf604[333]][_0xf604[497]](_0xf604[510],$[_0xf604[485]](this[_0xf604[25]][_0xf604[509]],this));} ;var clickedElement;$(document)[_0xf604[512]](function (e){clickedElement=$(e[_0xf604[511]]);} );this[_0xf604[333]][_0xf604[497]](_0xf604[513],$[_0xf604[485]](function (e){if(!$(clickedElement)[_0xf604[515]](_0xf604[514])&&$(clickedElement)[_0xf604[518]](_0xf604[517])[_0xf604[516]]()==0){this[_0xf604[499]]=false;if($[_0xf604[13]](this[_0xf604[25]][_0xf604[519]])){this[_0xf604[403]](_0xf604[520],e);} ;} ;} ,this));} ,buildEventDrop:function (e){e=e[_0xf604[521]]||e;if(window[_0xf604[522]]===undefined||!e[_0xf604[523]]){return true;} ;var length=e[_0xf604[523]][_0xf604[524]][_0xf604[20]];if(length==0){return true;} ;e[_0xf604[525]]();var file=e[_0xf604[523]][_0xf604[524]][0];if(this[_0xf604[25]][_0xf604[526]]!==false&&this[_0xf604[25]][_0xf604[526]][_0xf604[528]](file[_0xf604[527]])==-1){return true;} ;this[_0xf604[529]]();this[_0xf604[530]]();if(this[_0xf604[25]][_0xf604[494]]===false){this[_0xf604[532]](this[_0xf604[25]][_0xf604[493]],file,true,e,this[_0xf604[25]][_0xf604[531]]);} else {this[_0xf604[533]](file);} ;} ,buildEventPaste:function (e){var oldsafari=false;if(this[_0xf604[246]](_0xf604[534])&&navigator[_0xf604[536]][_0xf604[528]](_0xf604[535])===-1){var arr=this[_0xf604[246]](_0xf604[538])[_0xf604[461]](_0xf604[537]);if(arr[0]<536){oldsafari=true;} ;} ;if(oldsafari){return true;} ;if(this[_0xf604[246]](_0xf604[247])){return true;} ;if(this[_0xf604[25]][_0xf604[539]]&&this[_0xf604[540]](e)){return true;} ;if(this[_0xf604[25]][_0xf604[541]]){this[_0xf604[198]]=true;this[_0xf604[542]]();if(!this[_0xf604[499]]){if(this[_0xf604[25]][_0xf604[445]]===true&&this[_0xf604[543]]!==true){this[_0xf604[333]][_0xf604[206]](this[_0xf604[333]][_0xf604[206]]());this[_0xf604[544]]=this[_0xf604[216]][_0xf604[73]][_0xf604[545]];} else {this[_0xf604[544]]=this[_0xf604[333]][_0xf604[545]]();} ;} ;var frag=this[_0xf604[546]]();setTimeout($[_0xf604[485]](function (){var pastedFrag=this[_0xf604[546]]();this[_0xf604[333]][_0xf604[453]](frag);this[_0xf604[547]]();var html=this[_0xf604[548]](pastedFrag);this[_0xf604[549]](html);if(this[_0xf604[25]][_0xf604[445]]===true&&this[_0xf604[543]]!==true){this[_0xf604[333]][_0xf604[207]](_0xf604[206],_0xf604[550]);} ;} ,this),1);} ;} ,buildEventClipboardUpload:function (e){var event=e[_0xf604[521]]||e;this[_0xf604[551]]=false;if( typeof (event[_0xf604[552]])===_0xf604[12]){return false;} ;if(event[_0xf604[552]][_0xf604[553]]){var file=event[_0xf604[552]][_0xf604[553]][0][_0xf604[554]]();if(file!==null){this[_0xf604[529]]();this[_0xf604[551]]=true;var reader= new FileReader();reader[_0xf604[555]]=$[_0xf604[485]](this[_0xf604[556]],this);reader[_0xf604[557]](file);return true;} ;} ;return false;} ,buildEventKeydown:function (e){if(this[_0xf604[198]]){return false;} ;var key=e[_0xf604[407]];var ctrl=e[_0xf604[558]]||e[_0xf604[559]];var parent=this[_0xf604[560]]();var current=this[_0xf604[561]]();var block=this[_0xf604[562]]();var pre=false;this[_0xf604[403]](_0xf604[563],e);if(this[_0xf604[246]](_0xf604[470])&&_0xf604[564] in window[_0xf604[565]]()){if((ctrl)&&(e[_0xf604[566]]===37||e[_0xf604[566]]===39)){var selection=this[_0xf604[565]]();var lineOrWord=(e[_0xf604[559]]?_0xf604[567]:_0xf604[568]);if(e[_0xf604[566]]===37){selection[_0xf604[564]](_0xf604[202],_0xf604[569],lineOrWord);if(!e[_0xf604[570]]){selection[_0xf604[571]]();} ;} ;if(e[_0xf604[566]]===39){selection[_0xf604[564]](_0xf604[202],_0xf604[572],lineOrWord);if(!e[_0xf604[570]]){selection[_0xf604[573]]();} ;} ;e[_0xf604[525]]();} ;} ;this[_0xf604[574]](false);if((parent&&$(parent)[_0xf604[327]](0)[_0xf604[382]]===_0xf604[127])||(current&&$(current)[_0xf604[327]](0)[_0xf604[382]]===_0xf604[127])){pre=true;if(key===this[_0xf604[566]][_0xf604[575]]){this[_0xf604[576]](block);} ;} ;if(key===this[_0xf604[566]][_0xf604[575]]){if(parent&&$(parent)[0][_0xf604[382]]===_0xf604[94]){this[_0xf604[576]](parent);} ;if(current&&$(current)[0][_0xf604[382]]===_0xf604[94]){this[_0xf604[576]](current);} ;if(parent&&$(parent)[0][_0xf604[382]]===_0xf604[82]&&$(parent)[_0xf604[577]]()[0][_0xf604[382]]==_0xf604[94]){this[_0xf604[576]](parent,$(parent)[_0xf604[577]]()[0]);} ;if(current&&$(current)[0][_0xf604[382]]===_0xf604[82]&&parent&&$(parent)[0][_0xf604[382]]==_0xf604[94]){this[_0xf604[576]](current,parent);} ;} ;this[_0xf604[253]](e,key);if(ctrl&&key===90&&!e[_0xf604[570]]&&!e[_0xf604[578]]){e[_0xf604[525]]();if(this[_0xf604[25]][_0xf604[579]][_0xf604[20]]){this[_0xf604[580]]();} else {this[_0xf604[216]][_0xf604[487]](_0xf604[581],false,false);} ;return ;} else {if(ctrl&&key===90&&e[_0xf604[570]]&&!e[_0xf604[578]]){e[_0xf604[525]]();if(this[_0xf604[25]][_0xf604[582]][_0xf604[20]]!=0){this[_0xf604[583]]();} else {this[_0xf604[216]][_0xf604[487]](_0xf604[584],false,false);} ;return ;} ;} ;if(key==32){this[_0xf604[529]]();} ;if(ctrl&&key===65){this[_0xf604[529]]();this[_0xf604[499]]=true;} else {if(key!=this[_0xf604[566]][_0xf604[585]]&&!ctrl){this[_0xf604[499]]=false;} ;} ;if(key==this[_0xf604[566]][_0xf604[586]]&&!e[_0xf604[570]]&&!e[_0xf604[558]]&&!e[_0xf604[559]]){var range=this[_0xf604[587]]();if(range&&range[_0xf604[588]]===false){sel=this[_0xf604[565]]();if(sel[_0xf604[589]]){range[_0xf604[590]]();} ;} ;if(this[_0xf604[246]](_0xf604[245])&&(parent[_0xf604[591]]==1&&(parent[_0xf604[382]]==_0xf604[93]||parent[_0xf604[382]]==_0xf604[592]))){e[_0xf604[525]]();this[_0xf604[529]]();this[_0xf604[594]](document[_0xf604[593]](_0xf604[397]));this[_0xf604[403]](_0xf604[595],e);return false;} ;if(block&&(block[_0xf604[382]]==_0xf604[94]||$(block)[_0xf604[577]]()[0][_0xf604[382]]==_0xf604[94])){if(this[_0xf604[596]]()){if(this[_0xf604[491]]==1){var element;var last;if(block[_0xf604[382]]==_0xf604[94]){last=_0xf604[397];element=block;} else {last=_0xf604[63];element=$(block)[_0xf604[577]]()[0];} ;e[_0xf604[525]]();this[_0xf604[597]](element);this[_0xf604[491]]=0;if(last==_0xf604[63]){$(block)[_0xf604[577]]()[_0xf604[374]](_0xf604[63])[_0xf604[598]]()[_0xf604[331]]();} else {var tmp=$[_0xf604[394]]($(block)[_0xf604[50]]());$(block)[_0xf604[50]](tmp[_0xf604[352]](/<br\s?\/?>$/i,_0xf604[340]));} ;return ;} else {this[_0xf604[491]]++;} ;} else {this[_0xf604[491]]++;} ;} ;if(pre===true){return this[_0xf604[599]](e,current);} else {if(!this[_0xf604[25]][_0xf604[212]]){if(block&&block[_0xf604[382]]==_0xf604[126]){var listCurrent=this[_0xf604[562]]();if(listCurrent!==false||listCurrent[_0xf604[382]]===_0xf604[126]){var listText=$[_0xf604[394]]($(block)[_0xf604[600]]());var listCurrentText=$[_0xf604[394]]($(listCurrent)[_0xf604[600]]());if(listText==_0xf604[340]&&listCurrentText==_0xf604[340]&&$(listCurrent)[_0xf604[601]](_0xf604[110])[_0xf604[516]]()==0&&$(listCurrent)[_0xf604[518]](_0xf604[110])[_0xf604[516]]()==0){this[_0xf604[529]]();var $list=$(listCurrent)[_0xf604[603]](_0xf604[602]);$(listCurrent)[_0xf604[331]]();var node=$(_0xf604[604]+this[_0xf604[25]][_0xf604[605]]+_0xf604[606]);$list[_0xf604[329]](node);this[_0xf604[607]](node);this[_0xf604[366]]();this[_0xf604[403]](_0xf604[595],e);return false;} ;} ;} ;if(block&&this[_0xf604[25]][_0xf604[609]][_0xf604[608]](block[_0xf604[382]])){this[_0xf604[529]]();setTimeout($[_0xf604[485]](function (){var blockElem=this[_0xf604[562]]();if(blockElem[_0xf604[382]]===_0xf604[92]&&!$(blockElem)[_0xf604[515]](_0xf604[338])){var node=$(_0xf604[604]+this[_0xf604[25]][_0xf604[605]]+_0xf604[606]);$(blockElem)[_0xf604[385]](node);this[_0xf604[607]](node);} ;} ,this),1);} else {if(block===false){this[_0xf604[529]]();var node=$(_0xf604[604]+this[_0xf604[25]][_0xf604[605]]+_0xf604[606]);this[_0xf604[594]](node[0]);this[_0xf604[607]](node);this[_0xf604[403]](_0xf604[595],e);return false;} ;} ;} ;if(this[_0xf604[25]][_0xf604[212]]){if(block&&this[_0xf604[25]][_0xf604[609]][_0xf604[608]](block[_0xf604[382]])){this[_0xf604[529]]();setTimeout($[_0xf604[485]](function (){var blockElem=this[_0xf604[562]]();if((blockElem[_0xf604[382]]===_0xf604[92]||blockElem[_0xf604[382]]===_0xf604[82])&&!$(blockElem)[_0xf604[515]](_0xf604[338])){this[_0xf604[610]](blockElem);} ;} ,this),1);} else {return this[_0xf604[611]](e);} ;} ;if(block[_0xf604[382]]==_0xf604[94]||block[_0xf604[382]]==_0xf604[96]){return this[_0xf604[611]](e);} ;} ;this[_0xf604[403]](_0xf604[595],e);} else {if(key===this[_0xf604[566]][_0xf604[586]]&&(e[_0xf604[558]]||e[_0xf604[570]])){this[_0xf604[529]]();e[_0xf604[525]]();this[_0xf604[612]]();} ;} ;if((key===this[_0xf604[566]][_0xf604[613]]||e[_0xf604[559]]&&key===219)&&this[_0xf604[25]][_0xf604[253]]){return this[_0xf604[614]](e,pre,key);} ;if(key===this[_0xf604[566]][_0xf604[615]]){this[_0xf604[616]](e,current,parent);} ;} ,buildEventKeydownPre:function (e,current){e[_0xf604[525]]();this[_0xf604[529]]();var html=$(current)[_0xf604[577]]()[_0xf604[600]]();this[_0xf604[594]](document[_0xf604[617]](_0xf604[377]));if(html[_0xf604[618]](/\s$/)==-1){this[_0xf604[594]](document[_0xf604[617]](_0xf604[377]));} ;this[_0xf604[366]]();this[_0xf604[403]](_0xf604[595],e);return false;} ,buildEventKeydownTab:function (e,pre,key){if(!this[_0xf604[25]][_0xf604[619]]){return true;} ;if(this[_0xf604[620]](this[_0xf604[327]]())&&this[_0xf604[25]][_0xf604[621]]===false){return true;} ;e[_0xf604[525]]();if(pre===true&&!e[_0xf604[570]]){this[_0xf604[529]]();this[_0xf604[594]](document[_0xf604[617]](_0xf604[622]));this[_0xf604[366]]();return false;} else {if(this[_0xf604[25]][_0xf604[621]]!==false){this[_0xf604[529]]();this[_0xf604[594]](document[_0xf604[617]](Array(this[_0xf604[25]][_0xf604[621]]+1)[_0xf604[222]](_0xf604[623])));this[_0xf604[366]]();return false;} else {if(!e[_0xf604[570]]){this[_0xf604[284]]();} else {this[_0xf604[282]]();} ;} ;} ;return false;} ,buildEventKeydownBackspace:function (e,current,parent){if(parent&&current&&parent[_0xf604[624]][_0xf604[382]]==_0xf604[93]&&parent[_0xf604[382]]==_0xf604[625]&&current[_0xf604[382]]==_0xf604[126]&&$(parent)[_0xf604[346]](_0xf604[110])[_0xf604[516]]()==1){var text=$(current)[_0xf604[600]]()[_0xf604[352]](/[\u200B-\u200D\uFEFF]/g,_0xf604[340]);if(text==_0xf604[340]){var node=parent[_0xf604[624]];$(parent)[_0xf604[331]]();this[_0xf604[607]](node);this[_0xf604[366]]();return false;} ;} ;if( typeof current[_0xf604[382]]!==_0xf604[12]&&/^(H[1-6])$/i[_0xf604[608]](current[_0xf604[382]])){var node;if(this[_0xf604[25]][_0xf604[212]]===false){node=$(_0xf604[604]+this[_0xf604[25]][_0xf604[605]]+_0xf604[606]);} else {node=$(_0xf604[395]+this[_0xf604[25]][_0xf604[605]]);} ;$(current)[_0xf604[385]](node);this[_0xf604[607]](node);this[_0xf604[366]]();} ;if( typeof current[_0xf604[626]]!==_0xf604[12]&&current[_0xf604[626]]!==null){if(current[_0xf604[331]]&&current[_0xf604[591]]===3&&current[_0xf604[626]][_0xf604[376]](/[^\u200B]/g)==null){$(current)[_0xf604[627]]()[_0xf604[331]]();this[_0xf604[366]]();} ;} ;} ,buildEventKeydownInsertLineBreak:function (e){this[_0xf604[529]]();e[_0xf604[525]]();this[_0xf604[612]]();this[_0xf604[403]](_0xf604[595],e);return ;} ,buildEventKeyup:function (e){if(this[_0xf604[198]]){return false;} ;var key=e[_0xf604[407]];var parent=this[_0xf604[560]]();var current=this[_0xf604[561]]();if(!this[_0xf604[25]][_0xf604[212]]&&current[_0xf604[591]]==3&&(parent==false||parent[_0xf604[382]]==_0xf604[628])){var node=$(_0xf604[604])[_0xf604[453]]($(current)[_0xf604[629]]());$(current)[_0xf604[385]](node);var next=$(node)[_0xf604[601]]();if( typeof (next[0])!==_0xf604[12]&&next[0][_0xf604[382]]==_0xf604[630]){next[_0xf604[331]]();} ;this[_0xf604[631]](node);} ;if((this[_0xf604[25]][_0xf604[632]]||this[_0xf604[25]][_0xf604[633]]||this[_0xf604[25]][_0xf604[634]])&&key===this[_0xf604[566]][_0xf604[586]]){this[_0xf604[635]]();} ;if(key===this[_0xf604[566]][_0xf604[636]]||key===this[_0xf604[566]][_0xf604[615]]){return this[_0xf604[637]](e);} ;this[_0xf604[403]](_0xf604[638],e);this[_0xf604[366]](e);} ,buildEventKeyupConverters:function (){this[_0xf604[641]](this[_0xf604[25]][_0xf604[639]],this[_0xf604[25]][_0xf604[632]],this[_0xf604[25]][_0xf604[633]],this[_0xf604[25]][_0xf604[634]],this[_0xf604[25]][_0xf604[640]]);setTimeout($[_0xf604[485]](function (){if(this[_0xf604[25]][_0xf604[633]]){this[_0xf604[642]]();} ;if(this[_0xf604[25]][_0xf604[643]]){this[_0xf604[643]]();} ;} ,this),5);} ,buildPlugins:function (){if(!this[_0xf604[25]][_0xf604[644]]){return ;} ;$[_0xf604[19]](this[_0xf604[25]][_0xf604[644]],$[_0xf604[485]](function (i,s){if(RedactorPlugins[s]){$[_0xf604[202]](this,RedactorPlugins[s]);if($[_0xf604[13]](RedactorPlugins[s][_0xf604[21]])){this[_0xf604[21]]();} ;} ;} ,this));} ,iframeStart:function (){this[_0xf604[645]]();if(this[_0xf604[25]][_0xf604[328]]){this[_0xf604[646]](this.$source);} else {this[_0xf604[647]]=this[_0xf604[200]][_0xf604[451]]();this[_0xf604[200]]=this[_0xf604[452]](this.$sourceOld);this[_0xf604[646]](this.$sourceOld);} ;} ,iframeAppend:function (el){this[_0xf604[200]][_0xf604[350]](_0xf604[345],this[_0xf604[25]][_0xf604[349]])[_0xf604[451]]();this[_0xf604[330]][_0xf604[454]](el)[_0xf604[453]](this.$frame)[_0xf604[453]](this.$source);} ,iframeCreate:function (){this[_0xf604[343]]=$(_0xf604[651])[_0xf604[650]](_0xf604[648],$[_0xf604[485]](function (){if(this[_0xf604[25]][_0xf604[210]]){this[_0xf604[367]]();if(this[_0xf604[438]]===_0xf604[340]){this[_0xf604[438]]=this[_0xf604[25]][_0xf604[605]];} ;this[_0xf604[343]][_0xf604[347]]()[0][_0xf604[372]](this[_0xf604[438]]);this[_0xf604[343]][_0xf604[347]]()[0][_0xf604[373]]();var timer=setInterval($[_0xf604[485]](function (){if(this[_0xf604[343]][_0xf604[347]]()[_0xf604[374]](_0xf604[73])[_0xf604[50]]()){clearInterval(timer);this[_0xf604[649]]();} ;} ,this),0);} else {this[_0xf604[649]]();} ;} ,this));} ,iframeDoc:function (){return this[_0xf604[343]][0][_0xf604[652]][_0xf604[216]];} ,iframePage:function (){var doc=this[_0xf604[653]]();if(doc[_0xf604[654]]){doc[_0xf604[655]](doc[_0xf604[654]]);} ;return doc;} ,iframeAddCss:function (css){css=css||this[_0xf604[25]][_0xf604[207]];if(this[_0xf604[656]](css)){this[_0xf604[343]][_0xf604[347]]()[_0xf604[374]](_0xf604[72])[_0xf604[453]](_0xf604[657]+css+_0xf604[658]);} ;if($[_0xf604[659]](css)){$[_0xf604[19]](css,$[_0xf604[485]](function (i,url){this[_0xf604[660]](url);} ,this));} ;} ,iframeLoad:function (){this[_0xf604[333]]=this[_0xf604[343]][_0xf604[347]]()[_0xf604[374]](_0xf604[73])[_0xf604[350]]({contenteditable:true,dir:this[_0xf604[25]][_0xf604[349]]});if(this[_0xf604[333]][0]){this[_0xf604[216]]=this[_0xf604[333]][0][_0xf604[661]];this[_0xf604[217]]=this[_0xf604[216]][_0xf604[662]]||window;} ;this[_0xf604[660]]();if(this[_0xf604[25]][_0xf604[210]]){this[_0xf604[663]](this[_0xf604[200]][_0xf604[332]]());} else {this[_0xf604[465]](this[_0xf604[438]],true,false);} ;this[_0xf604[449]]();this[_0xf604[450]]();} ,placeholderInit:function (){if(this[_0xf604[25]][_0xf604[664]]!==false){this[_0xf604[665]]=this[_0xf604[25]][_0xf604[664]];this[_0xf604[25]][_0xf604[664]]=true;} else {if( typeof this[_0xf604[199]][_0xf604[350]](_0xf604[664])==_0xf604[12]||this[_0xf604[199]][_0xf604[350]](_0xf604[664])==_0xf604[340]){this[_0xf604[25]][_0xf604[664]]=false;} else {this[_0xf604[665]]=this[_0xf604[199]][_0xf604[350]](_0xf604[664]);this[_0xf604[25]][_0xf604[664]]=true;} ;} ;} ,placeholderStart:function (html){if(this[_0xf604[25]][_0xf604[664]]===false){return false;} ;if(this[_0xf604[620]](html)){this[_0xf604[25]][_0xf604[489]]=false;this[_0xf604[666]]();this[_0xf604[667]]();return this[_0xf604[668]]();} else {this[_0xf604[667]]();} ;return false;} ,placeholderOnFocus:function (){this[_0xf604[333]][_0xf604[497]](_0xf604[669],$[_0xf604[485]](this[_0xf604[670]],this));} ,placeholderOnBlur:function (){this[_0xf604[333]][_0xf604[497]](_0xf604[671],$[_0xf604[485]](this[_0xf604[672]],this));} ,placeholderGet:function (){var ph=$(_0xf604[674])[_0xf604[11]](_0xf604[6],_0xf604[673])[_0xf604[350]](_0xf604[334],false)[_0xf604[600]](this[_0xf604[665]]);if(this[_0xf604[25]][_0xf604[212]]===false){return $(_0xf604[604])[_0xf604[453]](ph);} else {return ph;} ;} ,placeholderBlur:function (){var html=this[_0xf604[327]]();if(this[_0xf604[620]](html)){this[_0xf604[666]]();this[_0xf604[333]][_0xf604[50]](this[_0xf604[668]]());} ;} ,placeholderFocus:function (){this[_0xf604[333]][_0xf604[374]](_0xf604[675])[_0xf604[331]]();var html=_0xf604[340];if(this[_0xf604[25]][_0xf604[212]]===false){html=this[_0xf604[25]][_0xf604[676]];} ;this[_0xf604[333]][_0xf604[324]](_0xf604[669]);this[_0xf604[333]][_0xf604[50]](html);if(this[_0xf604[25]][_0xf604[212]]===false){this[_0xf604[607]](this[_0xf604[333]][_0xf604[346]]()[0]);} else {this[_0xf604[489]]();} ;this[_0xf604[366]]();} ,placeholderRemoveFromEditor:function (){this[_0xf604[333]][_0xf604[374]](_0xf604[675])[_0xf604[331]]();this[_0xf604[333]][_0xf604[324]](_0xf604[669]);} ,placeholderRemoveFromCode:function (html){return html[_0xf604[352]](/<span class="redactor_placeholder"(.*?)>(.*?)<\/span>/i,_0xf604[340]);} ,shortcuts:function (e,key){if(!this[_0xf604[25]][_0xf604[253]]){if((e[_0xf604[558]]||e[_0xf604[559]])&&(key===66||key===73)){e[_0xf604[525]]();} ;return false;} ;$[_0xf604[19]](this[_0xf604[25]][_0xf604[253]],$[_0xf604[485]](function (str,command){var keys=str[_0xf604[461]](_0xf604[677]);for(var i in keys){if( typeof keys[i]===_0xf604[10]){this[_0xf604[678]](e,$[_0xf604[394]](keys[i]),$[_0xf604[485]](function (){eval(command);} ,this));} ;} ;} ,this));} ,shortcutsHandler:function (e,keys,origHandler){var hotkeysSpecialKeys={8:_0xf604[679],9:_0xf604[680],10:_0xf604[681],13:_0xf604[681],16:_0xf604[682],17:_0xf604[683],18:_0xf604[684],19:_0xf604[685],20:_0xf604[686],27:_0xf604[687],32:_0xf604[688],33:_0xf604[689],34:_0xf604[690],35:_0xf604[691],36:_0xf604[692],37:_0xf604[569],38:_0xf604[693],39:_0xf604[572],40:_0xf604[694],45:_0xf604[695],46:_0xf604[238],59:_0xf604[696],61:_0xf604[697],96:_0xf604[698],97:_0xf604[699],98:_0xf604[700],99:_0xf604[701],100:_0xf604[702],101:_0xf604[703],102:_0xf604[704],103:_0xf604[705],104:_0xf604[706],105:_0xf604[707],106:_0xf604[708],107:_0xf604[709],109:_0xf604[710],110:_0xf604[537],111:_0xf604[711],112:_0xf604[712],113:_0xf604[713],114:_0xf604[714],115:_0xf604[715],116:_0xf604[716],117:_0xf604[717],118:_0xf604[718],119:_0xf604[719],120:_0xf604[720],121:_0xf604[721],122:_0xf604[722],123:_0xf604[723],144:_0xf604[724],145:_0xf604[725],173:_0xf604[710],186:_0xf604[696],187:_0xf604[697],188:_0xf604[677],189:_0xf604[710],190:_0xf604[537],191:_0xf604[711],192:_0xf604[726],219:_0xf604[727],220:_0xf604[728],221:_0xf604[729],222:_0xf604[730]};var hotkeysShiftNums={"\x60":_0xf604[731],"\x31":_0xf604[732],"\x32":_0xf604[733],"\x33":_0xf604[734],"\x34":_0xf604[362],"\x35":_0xf604[735],"\x36":_0xf604[736],"\x37":_0xf604[431],"\x38":_0xf604[708],"\x39":_0xf604[737],"\x30":_0xf604[738],"\x2D":_0xf604[739],"\x3D":_0xf604[709],"\x3B":_0xf604[740],"\x27":_0xf604[741],"\x2C":_0xf604[381],"\x2E":_0xf604[742],"\x2F":_0xf604[743],"\x5C":_0xf604[56]};keys=keys[_0xf604[745]]()[_0xf604[461]](_0xf604[744]);var special=hotkeysSpecialKeys[e[_0xf604[566]]],character=String[_0xf604[746]](e[_0xf604[407]])[_0xf604[745]](),modif=_0xf604[340],possible={};$[_0xf604[19]]([_0xf604[684],_0xf604[683],_0xf604[74],_0xf604[682]],function (index,specialKey){if(e[specialKey+_0xf604[747]]&&special!==specialKey){modif+=specialKey+_0xf604[709];} ;} );if(special){possible[modif+special]=true;} ;if(character){possible[modif+character]=true;possible[modif+hotkeysShiftNums[character]]=true;if(modif===_0xf604[748]){possible[hotkeysShiftNums[character]]=true;} ;} ;for(var i=0,l=keys[_0xf604[20]];i<l;i++){if(possible[keys[i]]){e[_0xf604[525]]();return origHandler[_0xf604[14]](this,arguments);} ;} ;} ,focus:function (){if(!this[_0xf604[246]](_0xf604[247])){this[_0xf604[217]][_0xf604[750]]($[_0xf604[485]](this[_0xf604[749]],this,true),1);} else {this[_0xf604[333]][_0xf604[489]]();} ;} ,focusWithSaveScroll:function (){if(this[_0xf604[246]](_0xf604[245])){var top=this[_0xf604[216]][_0xf604[654]][_0xf604[545]];} ;this[_0xf604[333]][_0xf604[489]]();if(this[_0xf604[246]](_0xf604[245])){this[_0xf604[216]][_0xf604[654]][_0xf604[545]]=top;} ;} ,focusEnd:function (){if(!this[_0xf604[246]](_0xf604[470])){this[_0xf604[749]]();} else {if(this[_0xf604[25]][_0xf604[212]]===false){var last=this[_0xf604[333]][_0xf604[346]]()[_0xf604[598]]();this[_0xf604[333]][_0xf604[489]]();this[_0xf604[631]](last);} else {this[_0xf604[749]]();} ;} ;} ,focusSet:function (collapse,element){this[_0xf604[333]][_0xf604[489]]();if( typeof element==_0xf604[12]){element=this[_0xf604[333]][0];} ;var range=this[_0xf604[587]]();range[_0xf604[751]](element);range[_0xf604[752]](collapse||false);var sel=this[_0xf604[565]]();sel[_0xf604[753]]();sel[_0xf604[754]](range);} ,toggle:function (direct){if(this[_0xf604[25]][_0xf604[490]]){this[_0xf604[755]](direct);} else {this[_0xf604[756]]();} ;} ,toggleVisual:function (){var html=this[_0xf604[200]][_0xf604[451]]()[_0xf604[332]]();if( typeof this[_0xf604[757]]!==_0xf604[12]){var modified=this[_0xf604[757]][_0xf604[352]](/\n/g,_0xf604[340]);var thtml=html[_0xf604[352]](/\n/g,_0xf604[340]);thtml=this[_0xf604[370]](thtml,false);this[_0xf604[757]]=this[_0xf604[370]](modified,false)!==thtml;} ;if(this[_0xf604[757]]){if(this[_0xf604[25]][_0xf604[210]]&&html===_0xf604[340]){this[_0xf604[663]](html);} else {this[_0xf604[465]](html);if(this[_0xf604[25]][_0xf604[210]]){this[_0xf604[482]]();} ;} ;this[_0xf604[403]](_0xf604[406],false,html);} ;if(this[_0xf604[25]][_0xf604[211]]){this[_0xf604[343]][_0xf604[258]]();} else {this[_0xf604[333]][_0xf604[258]]();} ;if(this[_0xf604[25]][_0xf604[210]]){this[_0xf604[333]][_0xf604[350]](_0xf604[334],true);} ;this[_0xf604[200]][_0xf604[324]](_0xf604[758]);this[_0xf604[333]][_0xf604[489]]();this[_0xf604[547]]();this[_0xf604[484]]();this[_0xf604[759]]();this[_0xf604[760]](_0xf604[50]);this[_0xf604[25]][_0xf604[490]]=true;} ,toggleCode:function (direct){if(direct!==false){this[_0xf604[542]]();} ;var height=null;if(this[_0xf604[25]][_0xf604[211]]){height=this[_0xf604[343]][_0xf604[206]]();if(this[_0xf604[25]][_0xf604[210]]){this[_0xf604[333]][_0xf604[335]](_0xf604[334]);} ;this[_0xf604[343]][_0xf604[451]]();} else {height=this[_0xf604[333]][_0xf604[761]]();this[_0xf604[333]][_0xf604[451]]();} ;var html=this[_0xf604[200]][_0xf604[332]]();if(html!==_0xf604[340]&&this[_0xf604[25]][_0xf604[762]]){this[_0xf604[200]][_0xf604[332]](this[_0xf604[763]](html));} ;this[_0xf604[757]]=html;this[_0xf604[200]][_0xf604[206]](height)[_0xf604[258]]()[_0xf604[489]]();this[_0xf604[200]][_0xf604[497]](_0xf604[758],this[_0xf604[764]]);this[_0xf604[765]]();this[_0xf604[766]](_0xf604[50]);this[_0xf604[25]][_0xf604[490]]=false;} ,textareaIndenting:function (e){if(e[_0xf604[566]]===9){var $el=$(this);var start=$el[_0xf604[327]](0)[_0xf604[607]];$el[_0xf604[332]]($el[_0xf604[332]]()[_0xf604[767]](0,start)+_0xf604[622]+$el[_0xf604[332]]()[_0xf604[767]]($el[_0xf604[327]](0)[_0xf604[631]]));$el[_0xf604[327]](0)[_0xf604[607]]=$el[_0xf604[327]](0)[_0xf604[631]]=start+1;return false;} ;} ,autosave:function (){var savedHtml=false;this[_0xf604[322]]=setInterval($[_0xf604[485]](function (){var html=this[_0xf604[327]]();if(savedHtml!==html){var name=this[_0xf604[200]][_0xf604[350]](_0xf604[458]);$[_0xf604[772]]({url:this[_0xf604[25]][_0xf604[483]],type:_0xf604[768],data:_0xf604[769]+name+_0xf604[431]+name+_0xf604[697]+escape(encodeURIComponent(html)),success:$[_0xf604[485]](function (data){var json=$[_0xf604[770]](data);if( typeof json[_0xf604[18]]==_0xf604[12]){this[_0xf604[403]](_0xf604[483],false,json);} else {this[_0xf604[403]](_0xf604[771],false,json);} ;savedHtml=html;} ,this)});} ;} ,this),this[_0xf604[25]][_0xf604[322]]*1000);} ,toolbarBuild:function (){if(this[_0xf604[442]]()&&this[_0xf604[25]][_0xf604[773]][_0xf604[20]]>0){$[_0xf604[19]](this[_0xf604[25]][_0xf604[773]],$[_0xf604[485]](function (i,s){var index=this[_0xf604[25]][_0xf604[248]][_0xf604[528]](s);this[_0xf604[25]][_0xf604[248]][_0xf604[244]](index,1);} ,this));} ;if(this[_0xf604[25]][_0xf604[341]]){this[_0xf604[25]][_0xf604[248]]=this[_0xf604[25]][_0xf604[774]];} else {if(!this[_0xf604[25]][_0xf604[775]]){var index=this[_0xf604[25]][_0xf604[248]][_0xf604[528]](_0xf604[50]);this[_0xf604[25]][_0xf604[248]][_0xf604[244]](index,1);} ;} ;if(this[_0xf604[25]][_0xf604[477]]){$[_0xf604[19]](this[_0xf604[25]][_0xf604[477]][_0xf604[42]][_0xf604[776]],$[_0xf604[485]](function (i,s){if($[_0xf604[241]](i,this[_0xf604[25]][_0xf604[777]])==_0xf604[242]){delete this[_0xf604[25]][_0xf604[477]][_0xf604[42]][_0xf604[776]][i];} ;} ,this));} ;if(this[_0xf604[25]][_0xf604[248]][_0xf604[20]]===0){return false;} ;this[_0xf604[778]]();this[_0xf604[344]]=$(_0xf604[780])[_0xf604[464]](_0xf604[514])[_0xf604[350]](_0xf604[459],_0xf604[779]+this[_0xf604[201]]);if(this[_0xf604[25]][_0xf604[475]]){this[_0xf604[344]][_0xf604[464]](_0xf604[781]);} ;if(this[_0xf604[25]][_0xf604[782]]&&this[_0xf604[442]]()){this[_0xf604[344]][_0xf604[464]](_0xf604[783]);} ;if(this[_0xf604[25]][_0xf604[341]]){this[_0xf604[784]]=$(_0xf604[786])[_0xf604[350]](_0xf604[459],_0xf604[785]+this[_0xf604[201]])[_0xf604[451]]();this[_0xf604[784]][_0xf604[453]](this.$toolbar);$(_0xf604[73])[_0xf604[453]](this.$air);} else {if(this[_0xf604[25]][_0xf604[339]]){this[_0xf604[344]][_0xf604[464]](_0xf604[787]);$(this[_0xf604[25]][_0xf604[339]])[_0xf604[50]](this.$toolbar);} else {this[_0xf604[330]][_0xf604[788]](this.$toolbar);} ;} ;$[_0xf604[19]](this[_0xf604[25]][_0xf604[248]],$[_0xf604[485]](function (i,btnName){if(this[_0xf604[25]][_0xf604[477]][btnName]){var btnObject=this[_0xf604[25]][_0xf604[477]][btnName];if(this[_0xf604[25]][_0xf604[789]]===false&&btnName===_0xf604[38]){return true;} ;this[_0xf604[344]][_0xf604[453]]($(_0xf604[791])[_0xf604[453]](this[_0xf604[790]](btnName,btnObject)));} ;} ,this));this[_0xf604[344]][_0xf604[374]](_0xf604[792])[_0xf604[350]](_0xf604[466],_0xf604[242]);if(this[_0xf604[25]][_0xf604[215]]){this[_0xf604[793]]();$(this[_0xf604[25]][_0xf604[795]])[_0xf604[497]](_0xf604[794],$[_0xf604[485]](this[_0xf604[793]],this));} ;if(this[_0xf604[25]][_0xf604[796]]){this[_0xf604[333]][_0xf604[497]](_0xf604[797],$[_0xf604[485]](this[_0xf604[798]],this));} ;} ,toolbarObserveScroll:function (){var scrollTop=$(this[_0xf604[25]][_0xf604[795]])[_0xf604[545]]();var boxTop=0;var left=0;var end=0;if(this[_0xf604[25]][_0xf604[795]]===document){boxTop=this[_0xf604[330]][_0xf604[800]]()[_0xf604[799]];} else {boxTop=1;} ;end=boxTop+this[_0xf604[330]][_0xf604[206]]()+40;if(scrollTop>boxTop){var width=_0xf604[801];if(this[_0xf604[25]][_0xf604[214]]){left=this[_0xf604[330]][_0xf604[800]]()[_0xf604[569]];width=this[_0xf604[330]][_0xf604[802]]();this[_0xf604[344]][_0xf604[464]](_0xf604[803]);} ;this[_0xf604[215]]=true;if(this[_0xf604[25]][_0xf604[795]]===document){this[_0xf604[344]][_0xf604[207]]({position:_0xf604[804],width:width,zIndex:10005,top:this[_0xf604[25]][_0xf604[805]]+_0xf604[469],left:left});} else {this[_0xf604[344]][_0xf604[207]]({position:_0xf604[806],width:width,zIndex:10005,top:(this[_0xf604[25]][_0xf604[805]]+scrollTop)+_0xf604[469],left:0});} ;if(scrollTop<end){this[_0xf604[344]][_0xf604[207]](_0xf604[807],_0xf604[808]);} else {this[_0xf604[344]][_0xf604[207]](_0xf604[807],_0xf604[809]);} ;} else {this[_0xf604[215]]=false;this[_0xf604[344]][_0xf604[207]]({position:_0xf604[810],width:_0xf604[550],top:0,left:left});if(this[_0xf604[25]][_0xf604[214]]){this[_0xf604[344]][_0xf604[337]](_0xf604[803]);} ;} ;} ,airEnable:function (){if(!this[_0xf604[25]][_0xf604[341]]){return ;} ;this[_0xf604[333]][_0xf604[497]](_0xf604[797],this,$[_0xf604[485]](function (e){var text=this[_0xf604[811]]();if(e[_0xf604[527]]===_0xf604[812]&&text!=_0xf604[340]){this[_0xf604[813]](e);} ;if(e[_0xf604[527]]===_0xf604[638]&&e[_0xf604[570]]&&text!=_0xf604[340]){var $focusElem=$(this[_0xf604[815]](this[_0xf604[565]]()[_0xf604[814]])),offset=$focusElem[_0xf604[800]]();offset[_0xf604[206]]=$focusElem[_0xf604[206]]();this[_0xf604[813]](offset,true);} ;} ,this));} ,airShow:function (e,keyboard){if(!this[_0xf604[25]][_0xf604[341]]){return ;} ;var left,top;$(_0xf604[816])[_0xf604[451]]();if(keyboard){left=e[_0xf604[569]];top=e[_0xf604[799]]+e[_0xf604[206]]+14;if(this[_0xf604[25]][_0xf604[211]]){top+=this[_0xf604[330]][_0xf604[817]]()[_0xf604[799]]-$(this[_0xf604[216]])[_0xf604[545]]();left+=this[_0xf604[330]][_0xf604[817]]()[_0xf604[569]];} ;} else {var width=this[_0xf604[784]][_0xf604[802]]();left=e[_0xf604[818]];if($(this[_0xf604[216]])[_0xf604[209]]()<(left+width)){left-=width;} ;top=e[_0xf604[819]]+14;if(this[_0xf604[25]][_0xf604[211]]){top+=this[_0xf604[330]][_0xf604[817]]()[_0xf604[799]];left+=this[_0xf604[330]][_0xf604[817]]()[_0xf604[569]];} else {top+=$(this[_0xf604[216]])[_0xf604[545]]();} ;} ;this[_0xf604[784]][_0xf604[207]]({left:left+_0xf604[469],top:top+_0xf604[469]})[_0xf604[258]]();this[_0xf604[820]]();} ,airBindHide:function (){if(!this[_0xf604[25]][_0xf604[341]]){return ;} ;var hideHandler=$[_0xf604[485]](function (doc){$(doc)[_0xf604[497]](_0xf604[823],$[_0xf604[485]](function (e){if($(e[_0xf604[511]])[_0xf604[603]](this.$toolbar)[_0xf604[20]]===0){this[_0xf604[784]][_0xf604[822]](100);this[_0xf604[824]]();$(doc)[_0xf604[324]](e);} ;} ,this))[_0xf604[497]](_0xf604[503],$[_0xf604[485]](function (e){if(e[_0xf604[407]]===this[_0xf604[566]][_0xf604[821]]){this[_0xf604[565]]()[_0xf604[571]]();} ;this[_0xf604[784]][_0xf604[822]](100);$(doc)[_0xf604[324]](e);} ,this));} ,this);hideHandler(document);if(this[_0xf604[25]][_0xf604[211]]){hideHandler(this[_0xf604[216]]);} ;} ,airBindMousemoveHide:function (){if(!this[_0xf604[25]][_0xf604[341]]){return ;} ;var hideHandler=$[_0xf604[485]](function (doc){$(doc)[_0xf604[497]](_0xf604[825],$[_0xf604[485]](function (e){if($(e[_0xf604[511]])[_0xf604[603]](this.$toolbar)[_0xf604[20]]===0){this[_0xf604[784]][_0xf604[822]](100);$(doc)[_0xf604[324]](e);} ;} ,this));} ,this);hideHandler(document);if(this[_0xf604[25]][_0xf604[211]]){hideHandler(this[_0xf604[216]]);} ;} ,dropdownBuild:function ($dropdown,dropdownObject){$[_0xf604[19]](dropdownObject,$[_0xf604[485]](function (btnName,btnObject){if(!btnObject[_0xf604[462]]){btnObject[_0xf604[462]]=_0xf604[340];} ;var $item;if(btnObject[_0xf604[458]]===_0xf604[290]){$item=$(_0xf604[826]);} else {$item=$(_0xf604[827]+btnObject[_0xf604[462]]+_0xf604[828]+btnName+_0xf604[829]+btnObject[_0xf604[830]]+_0xf604[831]);$item[_0xf604[497]](_0xf604[832],$[_0xf604[485]](function (e){if(e[_0xf604[525]]){e[_0xf604[525]]();} ;if(this[_0xf604[246]](_0xf604[245])){e[_0xf604[833]]=false;} ;if(btnObject[_0xf604[403]]){btnObject[_0xf604[403]][_0xf604[8]](this,btnName,$item,btnObject,e);} ;if(btnObject[_0xf604[834]]){this[_0xf604[487]](btnObject[_0xf604[834]],btnName);} ;if(btnObject[_0xf604[835]]){this[btnObject[_0xf604[835]]](btnName);} ;this[_0xf604[798]]();if(this[_0xf604[25]][_0xf604[341]]){this[_0xf604[784]][_0xf604[822]](100);} ;} ,this));} ;$dropdown[_0xf604[453]]($item);} ,this));} ,dropdownShow:function (e,key){if(!this[_0xf604[25]][_0xf604[490]]){e[_0xf604[525]]();return false;} ;var $button=this[_0xf604[836]](key);var $dropdown=$button[_0xf604[11]](_0xf604[776])[_0xf604[837]](document[_0xf604[73]]);if($button[_0xf604[515]](_0xf604[838])){this[_0xf604[839]]();} else {this[_0xf604[839]]();this[_0xf604[403]](_0xf604[840],{dropdown:$dropdown,key:key,button:$button});this[_0xf604[766]](key);$button[_0xf604[464]](_0xf604[838]);var keyPosition=$button[_0xf604[800]]();var dropdownWidth=$dropdown[_0xf604[209]]();if((keyPosition[_0xf604[569]]+dropdownWidth)>$(document)[_0xf604[209]]()){keyPosition[_0xf604[569]]-=dropdownWidth;} ;var left=keyPosition[_0xf604[569]]+_0xf604[469];var btnHeight=$button[_0xf604[761]]();var position=_0xf604[806];var top=(btnHeight+this[_0xf604[25]][_0xf604[805]])+_0xf604[469];if(this[_0xf604[25]][_0xf604[215]]&&this[_0xf604[215]]){position=_0xf604[804];} else {top=keyPosition[_0xf604[799]]+btnHeight+_0xf604[469];} ;$dropdown[_0xf604[207]]({position:position,left:left,top:top})[_0xf604[258]]();this[_0xf604[403]](_0xf604[841],{dropdown:$dropdown,key:key,button:$button});} ;var hdlHideDropDown=$[_0xf604[485]](function (e){this[_0xf604[842]](e,$dropdown);} ,this);$(document)[_0xf604[650]](_0xf604[832],hdlHideDropDown);this[_0xf604[333]][_0xf604[650]](_0xf604[832],hdlHideDropDown);this[_0xf604[333]][_0xf604[650]](_0xf604[843],hdlHideDropDown);e[_0xf604[844]]();this[_0xf604[845]]();} ,dropdownHideAll:function (){this[_0xf604[344]][_0xf604[374]](_0xf604[847])[_0xf604[337]](_0xf604[846])[_0xf604[337]](_0xf604[838]);$(_0xf604[848])[_0xf604[451]]();this[_0xf604[403]](_0xf604[842]);} ,dropdownHide:function (e,$dropdown){if(!$(e[_0xf604[511]])[_0xf604[515]](_0xf604[838])){$dropdown[_0xf604[337]](_0xf604[838]);this[_0xf604[839]]();} ;} ,buttonBuild:function (btnName,btnObject,buttonImage){var $button=$(_0xf604[849]+btnObject[_0xf604[830]]+_0xf604[850]+btnName+_0xf604[851]);if( typeof buttonImage!=_0xf604[12]){$button[_0xf604[464]](_0xf604[852]);} ;$button[_0xf604[497]](_0xf604[832],$[_0xf604[485]](function (e){if(e[_0xf604[525]]){e[_0xf604[525]]();} ;if(this[_0xf604[246]](_0xf604[245])){e[_0xf604[833]]=false;} ;if($button[_0xf604[515]](_0xf604[853])){return false;} ;if(this[_0xf604[854]]()===false&&!btnObject[_0xf604[834]]){this[_0xf604[845]]();} ;if(btnObject[_0xf604[834]]){this[_0xf604[845]]();this[_0xf604[487]](btnObject[_0xf604[834]],btnName);this[_0xf604[855]]();} else {if(btnObject[_0xf604[835]]&&btnObject[_0xf604[835]]!==_0xf604[258]){this[btnObject[_0xf604[835]]](btnName);this[_0xf604[855]]();} else {if(btnObject[_0xf604[403]]){btnObject[_0xf604[403]][_0xf604[8]](this,btnName,$button,btnObject,e);this[_0xf604[855]]();} else {if(btnObject[_0xf604[776]]){this[_0xf604[840]](e,btnName);} ;} ;} ;} ;this[_0xf604[798]](false,btnName);} ,this));if(btnObject[_0xf604[776]]){var $dropdown=$(_0xf604[856]+btnName+_0xf604[857]);$button[_0xf604[11]](_0xf604[776],$dropdown);this[_0xf604[858]]($dropdown,btnObject[_0xf604[776]]);} ;return $button;} ,buttonGet:function (key){if(!this[_0xf604[25]][_0xf604[477]]){return false;} ;return $(this[_0xf604[344]][_0xf604[374]](_0xf604[859]+key));} ,buttonTagToActiveState:function (buttonName,tagName){this[_0xf604[25]][_0xf604[796]][_0xf604[15]](buttonName);this[_0xf604[25]][_0xf604[860]][tagName]=buttonName;} ,buttonActiveToggle:function (key){var btn=this[_0xf604[836]](key);if(btn[_0xf604[515]](_0xf604[846])){this[_0xf604[760]](key);} else {this[_0xf604[766]](key);} ;} ,buttonActive:function (key){var btn=this[_0xf604[836]](key);btn[_0xf604[464]](_0xf604[846]);} ,buttonInactive:function (key){var btn=this[_0xf604[836]](key);btn[_0xf604[337]](_0xf604[846]);} ,buttonInactiveAll:function (btnName){this[_0xf604[344]][_0xf604[374]](_0xf604[863])[_0xf604[862]](_0xf604[861]+btnName)[_0xf604[337]](_0xf604[846]);} ,buttonActiveVisual:function (){this[_0xf604[344]][_0xf604[374]](_0xf604[863])[_0xf604[862]](_0xf604[864])[_0xf604[337]](_0xf604[853]);} ,buttonInactiveVisual:function (){this[_0xf604[344]][_0xf604[374]](_0xf604[863])[_0xf604[862]](_0xf604[864])[_0xf604[464]](_0xf604[853]);} ,buttonChangeIcon:function (key,classname){this[_0xf604[836]](key)[_0xf604[464]](_0xf604[865]+classname);} ,buttonRemoveIcon:function (key,classname){this[_0xf604[836]](key)[_0xf604[337]](_0xf604[865]+classname);} ,buttonAwesome:function (key,name){var button=this[_0xf604[836]](key);button[_0xf604[337]](_0xf604[852]);button[_0xf604[464]](_0xf604[866]);button[_0xf604[50]](_0xf604[867]+name+_0xf604[868]);} ,buttonAdd:function (key,title,callback,dropdown){if(!this[_0xf604[25]][_0xf604[477]]){return ;} ;var btn=this[_0xf604[790]](key,{title:title,callback:callback,dropdown:dropdown},true);this[_0xf604[344]][_0xf604[453]]($(_0xf604[791])[_0xf604[453]](btn));return btn;} ,buttonAddFirst:function (key,title,callback,dropdown){if(!this[_0xf604[25]][_0xf604[477]]){return ;} ;var btn=this[_0xf604[790]](key,{title:title,callback:callback,dropdown:dropdown},true);this[_0xf604[344]][_0xf604[788]]($(_0xf604[791])[_0xf604[453]](btn));} ,buttonAddAfter:function (afterkey,key,title,callback,dropdown){if(!this[_0xf604[25]][_0xf604[477]]){return ;} ;var btn=this[_0xf604[790]](key,{title:title,callback:callback,dropdown:dropdown},true);var $btn=this[_0xf604[836]](afterkey);if($btn[_0xf604[516]]()!==0){$btn[_0xf604[577]]()[_0xf604[329]]($(_0xf604[791])[_0xf604[453]](btn));} else {this[_0xf604[344]][_0xf604[453]]($(_0xf604[791])[_0xf604[453]](btn));} ;return btn;} ,buttonAddBefore:function (beforekey,key,title,callback,dropdown){if(!this[_0xf604[25]][_0xf604[477]]){return ;} ;var btn=this[_0xf604[790]](key,{title:title,callback:callback,dropdown:dropdown},true);var $btn=this[_0xf604[836]](beforekey);if($btn[_0xf604[516]]()!==0){$btn[_0xf604[577]]()[_0xf604[869]]($(_0xf604[791])[_0xf604[453]](btn));} else {this[_0xf604[344]][_0xf604[453]]($(_0xf604[791])[_0xf604[453]](btn));} ;return btn;} ,buttonRemove:function (key){var $btn=this[_0xf604[836]](key);$btn[_0xf604[331]]();} ,buttonActiveObserver:function (e,btnName){var parent=this[_0xf604[560]]();this[_0xf604[870]](btnName);if(e===false&&btnName!==_0xf604[50]){if($[_0xf604[241]](btnName,this[_0xf604[25]][_0xf604[796]])!=-1){this[_0xf604[871]](btnName);} ;return ;} ;if(parent&&parent[_0xf604[382]]===_0xf604[872]){this[_0xf604[344]][_0xf604[374]](_0xf604[874])[_0xf604[600]](this[_0xf604[25]][_0xf604[250]][_0xf604[873]]);} else {this[_0xf604[344]][_0xf604[374]](_0xf604[874])[_0xf604[600]](this[_0xf604[25]][_0xf604[250]][_0xf604[309]]);} ;$[_0xf604[19]](this[_0xf604[25]][_0xf604[860]],$[_0xf604[485]](function (key,value){if($(parent)[_0xf604[603]](key,this[_0xf604[333]][_0xf604[327]]()[0])[_0xf604[20]]!=0){this[_0xf604[766]](value);} ;} ,this));var $parent=$(parent)[_0xf604[603]](this[_0xf604[25]][_0xf604[875]].toString()[_0xf604[745]](),this[_0xf604[333]][0]);if($parent[_0xf604[20]]){var align=$parent[_0xf604[207]](_0xf604[876]);if(align==_0xf604[340]){align=_0xf604[569];} ;this[_0xf604[766]](_0xf604[877]+align);} ;} ,execPasteFrag:function (html){var sel=this[_0xf604[565]]();if(sel[_0xf604[878]]&&sel[_0xf604[589]]){var range=this[_0xf604[587]]();range[_0xf604[590]]();var el=this[_0xf604[216]][_0xf604[593]](_0xf604[114]);el[_0xf604[879]]=html;var frag=this[_0xf604[216]][_0xf604[880]](),node,lastNode;while((node=el[_0xf604[882]])){lastNode=frag[_0xf604[881]](node);} ;var firstNode=frag[_0xf604[882]];range[_0xf604[594]](frag);if(lastNode){range=range[_0xf604[883]]();range[_0xf604[884]](lastNode);range[_0xf604[752]](true);} ;sel[_0xf604[753]]();sel[_0xf604[754]](range);} ;} ,exec:function (cmd,param,sync){if(cmd===_0xf604[885]&&this[_0xf604[246]](_0xf604[245])){param=_0xf604[381]+param+_0xf604[742];} ;if(cmd===_0xf604[886]&&this[_0xf604[246]](_0xf604[245])){if(!this[_0xf604[887]]()){this[_0xf604[845]]();this[_0xf604[216]][_0xf604[890]][_0xf604[889]]()[_0xf604[888]](param);} else {this[_0xf604[891]](param);} ;} else {this[_0xf604[216]][_0xf604[487]](cmd,false,param);} ;if(sync!==false){this[_0xf604[366]]();} ;this[_0xf604[403]](_0xf604[487],cmd,param);} ,execCommand:function (cmd,param,sync){if(!this[_0xf604[25]][_0xf604[490]]){this[_0xf604[200]][_0xf604[489]]();return false;} ;if(cmd===_0xf604[43]||cmd===_0xf604[44]||cmd===_0xf604[58]||cmd===_0xf604[276]){this[_0xf604[529]]();} ;if(cmd===_0xf604[892]||cmd===_0xf604[893]){var parent=this[_0xf604[560]]();if(parent[_0xf604[382]]===_0xf604[894]||parent[_0xf604[382]]===_0xf604[895]){this[_0xf604[896]](parent);} ;} ;if(cmd===_0xf604[886]){this[_0xf604[897]](param,sync);this[_0xf604[403]](_0xf604[487],cmd,param);return ;} ;if(this[_0xf604[898]](_0xf604[127])&&!this[_0xf604[25]][_0xf604[899]]){return false;} ;if(cmd===_0xf604[278]||cmd===_0xf604[280]){return this[_0xf604[900]](cmd,param);} ;if(cmd===_0xf604[311]){return this[_0xf604[901]](cmd,param);} ;this[_0xf604[834]](cmd,param,sync);if(cmd===_0xf604[320]){this[_0xf604[333]][_0xf604[374]](_0xf604[104])[_0xf604[335]](_0xf604[459]);} ;} ,execUnlink:function (cmd,param){this[_0xf604[529]]();var link=this[_0xf604[898]](_0xf604[872]);if(link){$(link)[_0xf604[385]]($(link)[_0xf604[600]]());this[_0xf604[366]]();this[_0xf604[403]](_0xf604[487],cmd,param);return ;} ;} ,execLists:function (cmd,param){this[_0xf604[529]]();var parent=this[_0xf604[560]]();var $list=$(parent)[_0xf604[603]](_0xf604[602]);if(!this[_0xf604[902]]($list)&&$list[_0xf604[516]]()!=0){$list=false;} ;var remove=false;if($list&&$list[_0xf604[20]]){remove=true;var listTag=$list[0][_0xf604[382]];if((cmd===_0xf604[278]&&listTag===_0xf604[903])||(cmd===_0xf604[280]&&listTag===_0xf604[625])){remove=false;} ;} ;this[_0xf604[542]]();if(remove){var nodes=this[_0xf604[904]]();var elems=this[_0xf604[905]](nodes);if( typeof nodes[0]!=_0xf604[12]&&nodes[_0xf604[20]]>1&&nodes[0][_0xf604[591]]==3){elems[_0xf604[906]](this[_0xf604[562]]());} ;var data=_0xf604[340],replaced=_0xf604[340];$[_0xf604[19]](elems,$[_0xf604[485]](function (i,s){if(s[_0xf604[382]]==_0xf604[126]){var $s=$(s);var cloned=$s[_0xf604[629]]();cloned[_0xf604[374]](_0xf604[125],_0xf604[120])[_0xf604[331]]();if(this[_0xf604[25]][_0xf604[212]]===false){data+=this[_0xf604[348]]($(_0xf604[604])[_0xf604[453]](cloned[_0xf604[347]]()));} else {var clonedHtml=cloned[_0xf604[50]]()[_0xf604[352]](/<br\s?\/?>$/i,_0xf604[340]);data+=clonedHtml+_0xf604[395];} ;if(i==0){$s[_0xf604[464]](_0xf604[908])[_0xf604[907]]();replaced=this[_0xf604[348]]($s);} else {$s[_0xf604[331]]();} ;} ;} ,this));html=this[_0xf604[333]][_0xf604[50]]()[_0xf604[352]](replaced,_0xf604[384]+listTag+_0xf604[742]+data+_0xf604[381]+listTag+_0xf604[742]);this[_0xf604[333]][_0xf604[50]](html);this[_0xf604[333]][_0xf604[374]](listTag+_0xf604[909])[_0xf604[331]]();} else {var firstParent=$(this[_0xf604[560]]())[_0xf604[603]](_0xf604[122]);if(this[_0xf604[246]](_0xf604[245])&&!this[_0xf604[887]]()&&this[_0xf604[25]][_0xf604[212]]){var wrapper=this[_0xf604[910]](_0xf604[114]);var wrapperHtml=$(wrapper)[_0xf604[50]]();var tmpList=$(_0xf604[780]);if(cmd==_0xf604[280]){tmpList=$(_0xf604[911]);} ;var tmpLi=$(_0xf604[791]);if($[_0xf604[394]](wrapperHtml)==_0xf604[340]){tmpLi[_0xf604[453]](wrapperHtml+_0xf604[912]+this[_0xf604[25]][_0xf604[605]]+_0xf604[428]);tmpList[_0xf604[453]](tmpLi);this[_0xf604[333]][_0xf604[374]](_0xf604[913])[_0xf604[385]](tmpList);} else {tmpLi[_0xf604[453]](wrapperHtml);tmpList[_0xf604[453]](tmpLi);$(wrapper)[_0xf604[385]](tmpList);} ;} else {this[_0xf604[216]][_0xf604[487]](cmd);} ;var parent=this[_0xf604[560]]();var $list=$(parent)[_0xf604[603]](_0xf604[602]);if(this[_0xf604[25]][_0xf604[212]]===false){var listText=$[_0xf604[394]]($list[_0xf604[600]]());if(listText==_0xf604[340]){$list[_0xf604[346]](_0xf604[110])[_0xf604[374]](_0xf604[397])[_0xf604[331]]();$list[_0xf604[346]](_0xf604[110])[_0xf604[453]](_0xf604[912]+this[_0xf604[25]][_0xf604[605]]+_0xf604[428]);} ;} ;if(firstParent[_0xf604[516]]()!=0){$list[_0xf604[915]](_0xf604[914]);} ;if($list[_0xf604[20]]){var $listParent=$list[_0xf604[577]]();if(this[_0xf604[902]]($listParent)&&$listParent[0][_0xf604[382]]!=_0xf604[126]&&this[_0xf604[916]]($listParent[0])){$listParent[_0xf604[385]]($listParent[_0xf604[347]]());} ;} ;if(this[_0xf604[246]](_0xf604[470])){this[_0xf604[333]][_0xf604[489]]();} ;} ;this[_0xf604[547]]();this[_0xf604[333]][_0xf604[374]](_0xf604[913])[_0xf604[335]](_0xf604[459]);this[_0xf604[366]]();this[_0xf604[403]](_0xf604[487],cmd,param);return ;} ,indentingIndent:function (){this[_0xf604[917]](_0xf604[49]);} ,indentingOutdent:function (){this[_0xf604[917]](_0xf604[48]);} ,indentingStart:function (cmd){this[_0xf604[529]]();if(cmd===_0xf604[49]){var block=this[_0xf604[562]]();this[_0xf604[542]]();if(block&&block[_0xf604[382]]==_0xf604[126]){var parent=this[_0xf604[560]]();var $list=$(parent)[_0xf604[603]](_0xf604[602]);var listTag=$list[0][_0xf604[382]];var elems=this[_0xf604[905]]();$[_0xf604[19]](elems,function (i,s){if(s[_0xf604[382]]==_0xf604[126]){var $prev=$(s)[_0xf604[627]]();if($prev[_0xf604[516]]()!=0&&$prev[0][_0xf604[382]]==_0xf604[126]){var $childList=$prev[_0xf604[346]](_0xf604[918]);if($childList[_0xf604[516]]()==0){$prev[_0xf604[453]]($(_0xf604[381]+listTag+_0xf604[742])[_0xf604[453]](s));} else {$childList[_0xf604[453]](s);} ;} ;} ;} );} else {if(block===false&&this[_0xf604[25]][_0xf604[212]]===true){this[_0xf604[834]](_0xf604[919],_0xf604[64]);var newblock=this[_0xf604[562]]();var block=$(_0xf604[920])[_0xf604[50]]($(newblock)[_0xf604[50]]());$(newblock)[_0xf604[385]](block);var left=this[_0xf604[922]]($(block)[_0xf604[207]](_0xf604[921]))+this[_0xf604[25]][_0xf604[923]];$(block)[_0xf604[207]](_0xf604[921],left+_0xf604[469]);} else {var elements=this[_0xf604[905]]();$[_0xf604[19]](elements,$[_0xf604[485]](function (i,elem){var $el=false;if(elem[_0xf604[382]]===_0xf604[93]){return ;} ;if($[_0xf604[241]](elem[_0xf604[382]],this[_0xf604[25]][_0xf604[875]])!==-1){$el=$(elem);} else {$el=$(elem)[_0xf604[603]](this[_0xf604[25]][_0xf604[875]].toString()[_0xf604[745]](),this[_0xf604[333]][0]);} ;var left=this[_0xf604[922]]($el[_0xf604[207]](_0xf604[921]))+this[_0xf604[25]][_0xf604[923]];$el[_0xf604[207]](_0xf604[921],left+_0xf604[469]);} ,this));} ;} ;this[_0xf604[547]]();} else {this[_0xf604[542]]();var block=this[_0xf604[562]]();if(block&&block[_0xf604[382]]==_0xf604[126]){var elems=this[_0xf604[905]]();var index=0;this[_0xf604[924]](block,index,elems);} else {var elements=this[_0xf604[905]]();$[_0xf604[19]](elements,$[_0xf604[485]](function (i,elem){var $el=false;if($[_0xf604[241]](elem[_0xf604[382]],this[_0xf604[25]][_0xf604[875]])!==-1){$el=$(elem);} else {$el=$(elem)[_0xf604[603]](this[_0xf604[25]][_0xf604[875]].toString()[_0xf604[745]](),this[_0xf604[333]][0]);} ;var left=this[_0xf604[922]]($el[_0xf604[207]](_0xf604[921]))-this[_0xf604[25]][_0xf604[923]];if(left<=0){if(this[_0xf604[25]][_0xf604[212]]===true&& typeof ($el[_0xf604[11]](_0xf604[925]))!==_0xf604[12]){$el[_0xf604[385]]($el[_0xf604[50]]()+_0xf604[395]);} else {$el[_0xf604[207]](_0xf604[921],_0xf604[340]);this[_0xf604[926]]($el,_0xf604[76]);} ;} else {$el[_0xf604[207]](_0xf604[921],left+_0xf604[469]);} ;} ,this));} ;this[_0xf604[547]]();} ;this[_0xf604[366]]();} ,insideOutdent:function (li,index,elems){if(li&&li[_0xf604[382]]==_0xf604[126]){var $parent=$(li)[_0xf604[577]]()[_0xf604[577]]();if($parent[_0xf604[516]]()!=0&&$parent[0][_0xf604[382]]==_0xf604[126]){$parent[_0xf604[329]](li);} else {if( typeof elems[index]!=_0xf604[12]){li=elems[index];index++;this[_0xf604[924]](li,index,elems);} else {this[_0xf604[487]](_0xf604[278]);} ;} ;} ;} ,alignmentLeft:function (){this[_0xf604[928]](_0xf604[340],_0xf604[927]);} ,alignmentRight:function (){this[_0xf604[928]](_0xf604[572],_0xf604[929]);} ,alignmentCenter:function (){this[_0xf604[928]](_0xf604[930],_0xf604[931]);} ,alignmentJustify:function (){this[_0xf604[928]](_0xf604[62],_0xf604[932]);} ,alignmentSet:function (type,cmd){this[_0xf604[529]]();if(this[_0xf604[933]]()){this[_0xf604[216]][_0xf604[487]](cmd,false,false);return true;} ;this[_0xf604[542]]();var block=this[_0xf604[562]]();if(!block&&this[_0xf604[25]][_0xf604[212]]){this[_0xf604[834]](_0xf604[885],_0xf604[114]);var newblock=this[_0xf604[562]]();var block=$(_0xf604[920])[_0xf604[50]]($(newblock)[_0xf604[50]]());$(newblock)[_0xf604[385]](block);$(block)[_0xf604[207]](_0xf604[876],type);this[_0xf604[926]](block,_0xf604[76]);if(type==_0xf604[340]&& typeof ($(block)[_0xf604[11]](_0xf604[925]))!==_0xf604[12]){$(block)[_0xf604[385]]($(block)[_0xf604[50]]());} ;} else {var elements=this[_0xf604[905]]();$[_0xf604[19]](elements,$[_0xf604[485]](function (i,elem){var $el=false;if($[_0xf604[241]](elem[_0xf604[382]],this[_0xf604[25]][_0xf604[875]])!==-1){$el=$(elem);} else {$el=$(elem)[_0xf604[603]](this[_0xf604[25]][_0xf604[875]].toString()[_0xf604[745]](),this[_0xf604[333]][0]);} ;if($el){$el[_0xf604[207]](_0xf604[876],type);this[_0xf604[926]]($el,_0xf604[76]);} ;} ,this));} ;this[_0xf604[547]]();this[_0xf604[366]]();} ,cleanEmpty:function (html){var ph=this[_0xf604[934]](html);if(ph!==false){return ph;} ;if(this[_0xf604[25]][_0xf604[212]]===false){if(html===_0xf604[340]){html=this[_0xf604[25]][_0xf604[676]];} else {if(html[_0xf604[618]](/^<hr\s?\/?>$/gi)!==-1){html=_0xf604[935]+this[_0xf604[25]][_0xf604[676]];} ;} ;} ;return html;} ,cleanConverters:function (html){if(this[_0xf604[25]][_0xf604[936]]&&!this[_0xf604[25]][_0xf604[937]]){html=html[_0xf604[352]](/<div(.*?)>([\w\W]*?)<\/div>/gi,_0xf604[938]);} ;if(this[_0xf604[25]][_0xf604[213]]){html=this[_0xf604[939]](html);} ;return html;} ,cleanConvertProtected:function (html){if(this[_0xf604[25]][_0xf604[940]]){html=html[_0xf604[352]](/\{\{(.*?)\}\}/gi,_0xf604[941]);html=html[_0xf604[352]](/\{(.*?)\}/gi,_0xf604[942]);} ;html=html[_0xf604[352]](/<script(.*?)>([\w\W]*?)<\/script>/gi,_0xf604[943]);html=html[_0xf604[352]](/<style(.*?)>([\w\W]*?)<\/style>/gi,_0xf604[944]);html=html[_0xf604[352]](/<form(.*?)>([\w\W]*?)<\/form>/gi,_0xf604[945]);if(this[_0xf604[25]][_0xf604[946]]){html=html[_0xf604[352]](/<\?php([\w\W]*?)\?>/gi,_0xf604[947]);} else {html=html[_0xf604[352]](/<\?php([\w\W]*?)\?>/gi,_0xf604[340]);} ;return html;} ,cleanReConvertProtected:function (html){if(this[_0xf604[25]][_0xf604[940]]){html=html[_0xf604[352]](/<!-- template double (.*?) -->/gi,_0xf604[948]);html=html[_0xf604[352]](/<!-- template (.*?) -->/gi,_0xf604[949]);} ;html=html[_0xf604[352]](/<title type="text\/javascript" style="display: none;" class="redactor-script-tag"(.*?)>([\w\W]*?)<\/title>/gi,_0xf604[950]);html=html[_0xf604[352]](/<section(.*?) style="display: none;" rel="redactor-style-tag">([\w\W]*?)<\/section>/gi,_0xf604[951]);html=html[_0xf604[352]](/<section(.*?)rel="redactor-form-tag"(.*?)>([\w\W]*?)<\/section>/gi,_0xf604[952]);if(this[_0xf604[25]][_0xf604[946]]){html=html[_0xf604[352]](/<section style="display: none;" rel="redactor-php-tag">([\w\W]*?)<\/section>/gi,_0xf604[953]);} ;return html;} ,cleanRemoveSpaces:function (html,buffer){if(buffer!==false){var buffer=[];var matches=html[_0xf604[376]](/<(pre|style|script|title)(.*?)>([\w\W]*?)<\/(pre|style|script|title)>/gi);if(matches===null){matches=[];} ;if(this[_0xf604[25]][_0xf604[946]]){var phpMatches=html[_0xf604[376]](/<\?php([\w\W]*?)\?>/gi);if(phpMatches){matches=$[_0xf604[954]](matches,phpMatches);} ;} ;if(matches){$[_0xf604[19]](matches,function (i,s){html=html[_0xf604[352]](s,_0xf604[955]+i);buffer[_0xf604[15]](s);} );} ;} ;html=html[_0xf604[352]](/\n/g,_0xf604[744]);html=html[_0xf604[352]](/[\t]*/g,_0xf604[340]);html=html[_0xf604[352]](/\n\s*\n/g,_0xf604[377]);html=html[_0xf604[352]](/^[\s\n]*/g,_0xf604[744]);html=html[_0xf604[352]](/[\s\n]*$/g,_0xf604[744]);html=html[_0xf604[352]](/>\s{2,}</g,_0xf604[956]);html=this[_0xf604[957]](html,buffer);html=html[_0xf604[352]](/\n\n/g,_0xf604[377]);return html;} ,cleanReplacer:function (html,buffer){if(buffer===false){return html;} ;$[_0xf604[19]](buffer,function (i,s){html=html[_0xf604[352]](_0xf604[955]+i,s);} );return html;} ,cleanRemoveEmptyTags:function (html){html=html[_0xf604[352]](/[\u200B-\u200D\uFEFF]/g,_0xf604[340]);var etagsInline=[_0xf604[958],_0xf604[959],_0xf604[960]];var etags=[_0xf604[961],_0xf604[962],_0xf604[963],_0xf604[964],_0xf604[965],_0xf604[966],_0xf604[967],_0xf604[968],_0xf604[969],_0xf604[970],_0xf604[971],_0xf604[972],_0xf604[410],_0xf604[412],_0xf604[973],_0xf604[974],_0xf604[975]];if(this[_0xf604[25]][_0xf604[429]]){etags=etags[_0xf604[976]](etagsInline);} else {etags=etagsInline;} ;var len=etags[_0xf604[20]];for(var i=0;i<len;++i){html=html[_0xf604[352]]( new RegExp(etags[i],_0xf604[383]),_0xf604[340]);} ;return html;} ,cleanParagraphy:function (html){html=$[_0xf604[394]](html);if(this[_0xf604[25]][_0xf604[212]]===true){return html;} ;if(html===_0xf604[340]||html===_0xf604[410]){return this[_0xf604[25]][_0xf604[676]];} ;html=html+_0xf604[377];if(this[_0xf604[25]][_0xf604[429]]===false){return html;} ;var safes=[];var matches=html[_0xf604[376]](/<(table|div|pre|object)(.*?)>([\w\W]*?)<\/(table|div|pre|object)>/gi);if(!matches){matches=[];} ;var commentsMatches=html[_0xf604[376]](/<!--([\w\W]*?)-->/gi);if(commentsMatches){matches=$[_0xf604[954]](matches,commentsMatches);} ;if(this[_0xf604[25]][_0xf604[946]]){var phpMatches=html[_0xf604[376]](/<section(.*?)rel="redactor-php-tag">([\w\W]*?)<\/section>/gi);if(phpMatches){matches=$[_0xf604[954]](matches,phpMatches);} ;} ;if(matches){$[_0xf604[19]](matches,function (i,s){safes[i]=s;html=html[_0xf604[352]](s,_0xf604[977]+i+_0xf604[978]);} );} ;html=html[_0xf604[352]](/<br \/>\s*<br \/>/gi,_0xf604[979]);html=html[_0xf604[352]](/<br><br>/gi,_0xf604[979]);function R(str,mod,r){return html[_0xf604[352]]( new RegExp(str,mod),r);} ;var blocks=_0xf604[980];html=R(_0xf604[981]+blocks+_0xf604[982],_0xf604[383],_0xf604[983]);html=R(_0xf604[984]+blocks+_0xf604[985],_0xf604[383],_0xf604[986]);html=R(_0xf604[987],_0xf604[988],_0xf604[377]);html=R(_0xf604[989],_0xf604[988],_0xf604[377]);html=R(_0xf604[990],_0xf604[988],_0xf604[979]);var htmls=html[_0xf604[461]]( new RegExp(_0xf604[991],_0xf604[988]),-1);html=_0xf604[340];for(var i in htmls){if(htmls[_0xf604[992]](i)){if(htmls[i][_0xf604[618]](_0xf604[977])==-1){htmls[i]=htmls[i][_0xf604[352]](/<p>\n\t?<\/p>/gi,_0xf604[340]);htmls[i]=htmls[i][_0xf604[352]](/<p><\/p>/gi,_0xf604[340]);if(htmls[i]!=_0xf604[340]){html+=_0xf604[604]+htmls[i][_0xf604[352]](/^\n+|\n+$/g,_0xf604[340])+_0xf604[606];} ;} else {html+=htmls[i];} ;} ;} ;html=R(_0xf604[993],_0xf604[383],_0xf604[604]);html=R(_0xf604[994],_0xf604[383],_0xf604[606]);html=R(_0xf604[995],_0xf604[383],_0xf604[340]);html=R(_0xf604[996],_0xf604[383],_0xf604[997]);html=R(_0xf604[998]+blocks+_0xf604[999],_0xf604[383],_0xf604[425]);html=R(_0xf604[1000],_0xf604[383],_0xf604[425]);html=R(_0xf604[1001]+blocks+_0xf604[982],_0xf604[383],_0xf604[425]);html=R(_0xf604[1002]+blocks+_0xf604[1003],_0xf604[383],_0xf604[425]);html=R(_0xf604[1002]+blocks+_0xf604[1004],_0xf604[383],_0xf604[425]);html=R(_0xf604[1005],_0xf604[383],_0xf604[425]);html=R(_0xf604[1006],_0xf604[383],_0xf604[606]);html=R(_0xf604[1007],_0xf604[383],_0xf604[791]);html=R(_0xf604[1008],_0xf604[383],_0xf604[1009]);html=R(_0xf604[1010],_0xf604[383],_0xf604[1009]);html=R(_0xf604[1011],_0xf604[383],_0xf604[604]);html=R(_0xf604[1012],_0xf604[383],_0xf604[1013]);html=R(_0xf604[1014],_0xf604[383],_0xf604[1015]);html=R(_0xf604[1016],_0xf604[383],_0xf604[1017]);html=R(_0xf604[1018],_0xf604[383],_0xf604[340]);$[_0xf604[19]](safes,function (i,s){html=html[_0xf604[352]](_0xf604[977]+i+_0xf604[1019],s);} );return $[_0xf604[394]](html);} ,cleanConvertInlineTags:function (html,set){var boldTag=_0xf604[78];if(this[_0xf604[25]][_0xf604[1020]]===_0xf604[239]){boldTag=_0xf604[239];} ;var italicTag=_0xf604[79];if(this[_0xf604[25]][_0xf604[1021]]===_0xf604[236]){italicTag=_0xf604[236];} ;html=html[_0xf604[352]](/<span style="font-style: italic;">([\w\W]*?)<\/span>/gi,_0xf604[381]+italicTag+_0xf604[1022]+italicTag+_0xf604[742]);html=html[_0xf604[352]](/<span style="font-weight: bold;">([\w\W]*?)<\/span>/gi,_0xf604[381]+boldTag+_0xf604[1022]+boldTag+_0xf604[742]);if(this[_0xf604[25]][_0xf604[1020]]===_0xf604[78]){html=html[_0xf604[352]](/<b>([\w\W]*?)<\/b>/gi,_0xf604[1023]);} else {html=html[_0xf604[352]](/<strong>([\w\W]*?)<\/strong>/gi,_0xf604[1024]);} ;if(this[_0xf604[25]][_0xf604[1021]]===_0xf604[79]){html=html[_0xf604[352]](/<i>([\w\W]*?)<\/i>/gi,_0xf604[1025]);} else {html=html[_0xf604[352]](/<em>([\w\W]*?)<\/em>/gi,_0xf604[1026]);} ;html=html[_0xf604[352]](/<span style="text-decoration: underline;">([\w\W]*?)<\/span>/gi,_0xf604[1027]);if(set!==true){html=html[_0xf604[352]](/<strike>([\w\W]*?)<\/strike>/gi,_0xf604[1028]);} else {html=html[_0xf604[352]](/<del>([\w\W]*?)<\/del>/gi,_0xf604[1029]);} ;return html;} ,cleanStripTags:function (html){if(html==_0xf604[340]|| typeof html==_0xf604[12]){return html;} ;var allowed=false;if(this[_0xf604[25]][_0xf604[237]]!==false){allowed=true;} ;var arr=allowed===true?this[_0xf604[25]][_0xf604[237]]:this[_0xf604[25]][_0xf604[243]];var tags=/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;html=html[_0xf604[352]](tags,function ($0,$1){if(allowed===true){return $[_0xf604[241]]($1[_0xf604[745]](),arr)>_0xf604[242]?$0:_0xf604[340];} else {return $[_0xf604[241]]($1[_0xf604[745]](),arr)>_0xf604[242]?_0xf604[340]:$0;} ;} );html=this[_0xf604[359]](html);return html;} ,cleanSavePreCode:function (html,encode){var pre=html[_0xf604[376]](/<(pre|code)(.*?)>([\w\W]*?)<\/(pre|code)>/gi);if(pre!==null){$[_0xf604[19]](pre,$[_0xf604[485]](function (i,s){var arr=s[_0xf604[376]](/<(pre|code)(.*?)>([\w\W]*?)<\/(pre|code)>/i);arr[3]=arr[3][_0xf604[352]](/&nbsp;/g,_0xf604[744]);if(encode!==false){arr[3]=this[_0xf604[1030]](arr[3]);} ;arr[3]=arr[3][_0xf604[352]](/\$/g,_0xf604[351]);html=html[_0xf604[352]](s,_0xf604[381]+arr[1]+arr[2]+_0xf604[742]+arr[3]+_0xf604[384]+arr[1]+_0xf604[742]);} ,this));} ;return html;} ,cleanEncodeEntities:function (str){str=String(str)[_0xf604[352]](/&amp;/g,_0xf604[431])[_0xf604[352]](/&lt;/g,_0xf604[381])[_0xf604[352]](/&gt;/g,_0xf604[742])[_0xf604[352]](/&quot;/g,_0xf604[741]);return str[_0xf604[352]](/&/g,_0xf604[1034])[_0xf604[352]](/</g,_0xf604[1033])[_0xf604[352]](/>/g,_0xf604[1032])[_0xf604[352]](/"/g,_0xf604[1031]);} ,cleanUnverified:function (){var $elem=this[_0xf604[333]][_0xf604[374]](_0xf604[1035]);$elem[_0xf604[1039]](_0xf604[1038])[_0xf604[207]](_0xf604[1037],_0xf604[340])[_0xf604[207]](_0xf604[1036],_0xf604[340]);$elem[_0xf604[1039]](_0xf604[1040])[_0xf604[207]](_0xf604[1037],_0xf604[340]);$elem[_0xf604[207]](_0xf604[1036],_0xf604[340]);$[_0xf604[19]]($elem,$[_0xf604[485]](function (i,s){this[_0xf604[926]](s,_0xf604[76]);} ,this));var $elem2=this[_0xf604[333]][_0xf604[374]](_0xf604[1041]);$elem2[_0xf604[207]](_0xf604[1042],_0xf604[340]);$[_0xf604[19]]($elem2,$[_0xf604[485]](function (i,s){this[_0xf604[926]](s,_0xf604[76]);} ,this));this[_0xf604[333]][_0xf604[374]](_0xf604[1044])[_0xf604[347]]()[_0xf604[1043]]();this[_0xf604[333]][_0xf604[374]](_0xf604[1045])[_0xf604[335]](_0xf604[76]);} ,cleanHtml:function (code){var i=0,codeLength=code[_0xf604[20]],point=0,start=null,end=null,tag=_0xf604[340],out=_0xf604[340],cont=_0xf604[340];this[_0xf604[1046]]=0;for(;i<codeLength;i++){point=i;if(-1==code[_0xf604[1047]](i)[_0xf604[528]](_0xf604[381])){out+=code[_0xf604[1047]](i);return this[_0xf604[1048]](out);} ;while(point<codeLength&&code[_0xf604[1049]](point)!=_0xf604[381]){point++;} ;if(i!=point){cont=code[_0xf604[1047]](i,point-i);if(!cont[_0xf604[376]](/^\s{2,}$/g)){if(_0xf604[377]==out[_0xf604[1049]](out[_0xf604[20]]-1)){out+=this[_0xf604[1050]]();} else {if(_0xf604[377]==cont[_0xf604[1049]](0)){out+=_0xf604[377]+this[_0xf604[1050]]();cont=cont[_0xf604[352]](/^\s+/,_0xf604[340]);} ;} ;out+=cont;} ;if(cont[_0xf604[376]](/\n/)){out+=_0xf604[377]+this[_0xf604[1050]]();} ;} ;start=point;while(point<codeLength&&_0xf604[742]!=code[_0xf604[1049]](point)){point++;} ;tag=code[_0xf604[1047]](start,point-start);i=point;var t;if(_0xf604[1051]==tag[_0xf604[1047]](1,3)){if(!tag[_0xf604[376]](/--$/)){while(_0xf604[1052]!=code[_0xf604[1047]](point,3)){point++;} ;point+=2;tag=code[_0xf604[1047]](start,point-start);i=point;} ;if(_0xf604[377]!=out[_0xf604[1049]](out[_0xf604[20]]-1)){out+=_0xf604[377];} ;out+=this[_0xf604[1050]]();out+=tag+_0xf604[1053];} else {if(_0xf604[732]==tag[1]){out=this[_0xf604[1054]](tag+_0xf604[742],out);} else {if(_0xf604[743]==tag[1]){out+=tag+_0xf604[1053];} else {if(t=tag[_0xf604[376]](/^<(script|style|pre)/i)){t[1]=t[1][_0xf604[745]]();tag=this[_0xf604[1055]](tag);out=this[_0xf604[1054]](tag,out);end=String(code[_0xf604[1047]](i+1))[_0xf604[745]]()[_0xf604[528]](_0xf604[384]+t[1]);if(end){cont=code[_0xf604[1047]](i+1,end);i+=end;out+=cont;} ;} else {tag=this[_0xf604[1055]](tag);out=this[_0xf604[1054]](tag,out);} ;} ;} ;} ;} ;return this[_0xf604[1048]](out);} ,cleanGetTabs:function (){var s=_0xf604[340];for(var j=0;j<this[_0xf604[1046]];j++){s+=_0xf604[622];} ;return s;} ,cleanFinish:function (code){code=code[_0xf604[352]](/\n\s*\n/g,_0xf604[377]);code=code[_0xf604[352]](/^[\s\n]*/,_0xf604[340]);code=code[_0xf604[352]](/[\s\n]*$/,_0xf604[340]);code=code[_0xf604[352]](/<script(.*?)>\n<\/script>/gi,_0xf604[1056]);this[_0xf604[1046]]=0;return code;} ,cleanTag:function (tag){var tagout=_0xf604[340];tag=tag[_0xf604[352]](/\n/g,_0xf604[744]);tag=tag[_0xf604[352]](/\s{2,}/g,_0xf604[744]);tag=tag[_0xf604[352]](/^\s+|\s+$/g,_0xf604[744]);var suffix=_0xf604[340];if(tag[_0xf604[376]](/\/$/)){suffix=_0xf604[711];tag=tag[_0xf604[352]](/\/+$/,_0xf604[340]);} ;var m;while(m=/\s*([^= ]+)(?:=((['"']).*?\3|[^ ]+))?/[_0xf604[834]](tag)){if(m[2]){tagout+=m[1][_0xf604[745]]()+_0xf604[697]+m[2];} else {if(m[1]){tagout+=m[1][_0xf604[745]]();} ;} ;tagout+=_0xf604[744];tag=tag[_0xf604[1047]](m[0][_0xf604[20]]);} ;return tagout[_0xf604[352]](/\s*$/,_0xf604[340])+suffix+_0xf604[742];} ,placeTag:function (tag,out){var nl=tag[_0xf604[376]](this[_0xf604[229]]);if(tag[_0xf604[376]](this[_0xf604[219]])||nl){out=out[_0xf604[352]](/\s*$/,_0xf604[340]);out+=_0xf604[377];} ;if(nl&&_0xf604[711]==tag[_0xf604[1049]](1)){this[_0xf604[1046]]--;} ;if(_0xf604[377]==out[_0xf604[1049]](out[_0xf604[20]]-1)){out+=this[_0xf604[1050]]();} ;if(nl&&_0xf604[711]!=tag[_0xf604[1049]](1)){this[_0xf604[1046]]++;} ;out+=tag;if(tag[_0xf604[376]](this[_0xf604[226]])||tag[_0xf604[376]](this[_0xf604[229]])){out=out[_0xf604[352]](/ *$/,_0xf604[340]);out+=_0xf604[377];} ;return out;} ,formatEmpty:function (e){var html=$[_0xf604[394]](this[_0xf604[333]][_0xf604[50]]());if(this[_0xf604[25]][_0xf604[212]]){if(html==_0xf604[340]){e[_0xf604[525]]();this[_0xf604[333]][_0xf604[50]](_0xf604[340]);this[_0xf604[489]]();} ;} else {html=html[_0xf604[352]](/<br\s?\/?>/i,_0xf604[340]);var thtml=html[_0xf604[352]](/<p>\s?<\/p>/gi,_0xf604[340]);if(html===_0xf604[340]||thtml===_0xf604[340]){e[_0xf604[525]]();var node=$(this[_0xf604[25]][_0xf604[676]])[_0xf604[327]](0);this[_0xf604[333]][_0xf604[50]](node);this[_0xf604[489]]();} ;} ;this[_0xf604[366]]();} ,formatBlocks:function (tag){if(this[_0xf604[246]](_0xf604[470])&&this[_0xf604[854]]()){this[_0xf604[333]][_0xf604[489]]();} ;this[_0xf604[529]]();var nodes=this[_0xf604[905]]();this[_0xf604[542]]();$[_0xf604[19]](nodes,$[_0xf604[485]](function (i,node){if(node[_0xf604[382]]!==_0xf604[126]){var parent=$(node)[_0xf604[577]]();if(tag===_0xf604[63]){if((node[_0xf604[382]]===_0xf604[82]&&parent[_0xf604[516]]()!=0&&parent[0][_0xf604[382]]===_0xf604[94])||node[_0xf604[382]]===_0xf604[94]){this[_0xf604[262]]();return ;} else {if(this[_0xf604[25]][_0xf604[212]]){if(node&&node[_0xf604[382]][_0xf604[618]](/H[1-6]/)==0){$(node)[_0xf604[385]](node[_0xf604[879]]+_0xf604[395]);} else {return ;} ;} else {this[_0xf604[919]](tag,node);} ;} ;} else {this[_0xf604[919]](tag,node);} ;} ;} ,this));this[_0xf604[547]]();this[_0xf604[366]]();} ,formatBlock:function (tag,block){if(block===false){block=this[_0xf604[562]]();} ;if(block===false&&this[_0xf604[25]][_0xf604[212]]===true){this[_0xf604[487]](_0xf604[885],tag);return true;} ;var contents=_0xf604[340];if(tag!==_0xf604[65]){contents=$(block)[_0xf604[347]]();} else {contents=$(block)[_0xf604[50]]();if($[_0xf604[394]](contents)===_0xf604[340]){contents=_0xf604[1057];} ;} ;if(block[_0xf604[382]]===_0xf604[127]){tag=_0xf604[63];} ;if(this[_0xf604[25]][_0xf604[212]]===true&&tag===_0xf604[63]){$(block)[_0xf604[385]]($(_0xf604[1058])[_0xf604[453]](contents)[_0xf604[50]]()+_0xf604[395]);} else {var parent=this[_0xf604[560]]();var node=$(_0xf604[381]+tag+_0xf604[742])[_0xf604[453]](contents);$(block)[_0xf604[385]](node);if(parent&&parent[_0xf604[382]]==_0xf604[93]){$(node)[_0xf604[915]](_0xf604[914]);} ;} ;} ,formatChangeTag:function (fromElement,toTagName,save){if(save!==false){this[_0xf604[542]]();} ;var newElement=$(_0xf604[381]+toTagName+_0xf604[1059]);$(fromElement)[_0xf604[385]](function (){return newElement[_0xf604[453]]($(this)[_0xf604[347]]());} );if(save!==false){this[_0xf604[547]]();} ;return newElement;} ,formatQuote:function (){if(this[_0xf604[246]](_0xf604[470])&&this[_0xf604[854]]()){this[_0xf604[333]][_0xf604[489]]();} ;this[_0xf604[529]]();if(this[_0xf604[25]][_0xf604[212]]===false){this[_0xf604[542]]();var blocks=this[_0xf604[905]]();var blockquote=false;var blocksLen=blocks[_0xf604[20]];if(blocks){var data=_0xf604[340];var replaced=_0xf604[340];var replace=false;var paragraphsOnly=true;$[_0xf604[19]](blocks,function (i,s){if(s[_0xf604[382]]!==_0xf604[82]){paragraphsOnly=false;} ;} );$[_0xf604[19]](blocks,$[_0xf604[485]](function (i,s){if(s[_0xf604[382]]===_0xf604[94]){this[_0xf604[919]](_0xf604[63],s,false);} else {if(s[_0xf604[382]]===_0xf604[82]){blockquote=$(s)[_0xf604[577]]();if(blockquote[0][_0xf604[382]]==_0xf604[94]){var count=$(blockquote)[_0xf604[346]](_0xf604[63])[_0xf604[516]]();if(count==1){$(blockquote)[_0xf604[385]](s);} else {if(count==blocksLen){replace=_0xf604[64];data+=this[_0xf604[348]](s);} else {replace=_0xf604[50];data+=this[_0xf604[348]](s);if(i==0){$(s)[_0xf604[464]](_0xf604[908])[_0xf604[907]]();replaced=this[_0xf604[348]](s);} else {$(s)[_0xf604[331]]();} ;} ;} ;} else {if(paragraphsOnly===false||blocks[_0xf604[20]]==1){this[_0xf604[919]](_0xf604[64],s,false);} else {replace=_0xf604[1060];data+=this[_0xf604[348]](s);} ;} ;} else {if(s[_0xf604[382]]!==_0xf604[126]){this[_0xf604[919]](_0xf604[64],s,false);} ;} ;} ;} ,this));if(replace){if(replace==_0xf604[1060]){$(blocks[0])[_0xf604[385]](_0xf604[1061]+data+_0xf604[1017]);$(blocks)[_0xf604[331]]();} else {if(replace==_0xf604[64]){$(blockquote)[_0xf604[385]](data);} else {if(replace==_0xf604[50]){var html=this[_0xf604[333]][_0xf604[50]]()[_0xf604[352]](replaced,_0xf604[1017]+data+_0xf604[1061]);this[_0xf604[333]][_0xf604[50]](html);this[_0xf604[333]][_0xf604[374]](_0xf604[64])[_0xf604[19]](function (){if($[_0xf604[394]]($(this)[_0xf604[50]]())==_0xf604[340]){$(this)[_0xf604[331]]();} ;} );} ;} ;} ;} ;} ;this[_0xf604[547]]();} else {var block=this[_0xf604[562]]();if(block[_0xf604[382]]===_0xf604[94]){this[_0xf604[542]]();var html=$[_0xf604[394]]($(block)[_0xf604[50]]());var selection=$[_0xf604[394]](this[_0xf604[1062]]());html=html[_0xf604[352]](/<span(.*?)id="selection-marker(.*?)<\/span>/gi,_0xf604[340]);if(html==selection){$(block)[_0xf604[385]]($(block)[_0xf604[50]]()+_0xf604[395]);} else {this[_0xf604[1064]](_0xf604[1063]);var tmp=this[_0xf604[333]][_0xf604[374]](_0xf604[1063]);tmp[_0xf604[907]]();var newhtml=this[_0xf604[333]][_0xf604[50]]()[_0xf604[352]](_0xf604[1065],_0xf604[1066]+this[_0xf604[25]][_0xf604[605]]+_0xf604[428]+selection+_0xf604[1061]);this[_0xf604[333]][_0xf604[50]](newhtml);tmp[_0xf604[331]]();this[_0xf604[333]][_0xf604[374]](_0xf604[64])[_0xf604[19]](function (){if($[_0xf604[394]]($(this)[_0xf604[50]]())==_0xf604[340]){$(this)[_0xf604[331]]();} ;} );} ;this[_0xf604[547]]();this[_0xf604[333]][_0xf604[374]](_0xf604[1067])[_0xf604[350]](_0xf604[459],false);} else {var wrapper=this[_0xf604[910]](_0xf604[64]);var html=$(wrapper)[_0xf604[50]]();var blocksElemsRemove=[_0xf604[125],_0xf604[120],_0xf604[53],_0xf604[124],_0xf604[107],_0xf604[108],_0xf604[109],_0xf604[115]];$[_0xf604[19]](blocksElemsRemove,function (i,s){html=html[_0xf604[352]]( new RegExp(_0xf604[381]+s+_0xf604[1068],_0xf604[383]),_0xf604[340]);html=html[_0xf604[352]]( new RegExp(_0xf604[384]+s+_0xf604[742],_0xf604[383]),_0xf604[340]);} );var blocksElems=this[_0xf604[25]][_0xf604[234]];$[_0xf604[19]](blocksElems,function (i,s){html=html[_0xf604[352]]( new RegExp(_0xf604[381]+s+_0xf604[1068],_0xf604[383]),_0xf604[340]);html=html[_0xf604[352]]( new RegExp(_0xf604[384]+s+_0xf604[742],_0xf604[383]),_0xf604[395]);} );$(wrapper)[_0xf604[50]](html);this[_0xf604[1069]](wrapper);var next=$(wrapper)[_0xf604[601]]();if(next[_0xf604[516]]()!=0&&next[0][_0xf604[382]]===_0xf604[630]){next[_0xf604[331]]();} ;} ;} ;this[_0xf604[366]]();} ,blockRemoveAttr:function (attr,value){var nodes=this[_0xf604[905]]();$(nodes)[_0xf604[335]](attr);this[_0xf604[366]]();} ,blockSetAttr:function (attr,value){var nodes=this[_0xf604[905]]();$(nodes)[_0xf604[350]](attr,value);this[_0xf604[366]]();} ,blockRemoveStyle:function (rule){var nodes=this[_0xf604[905]]();$(nodes)[_0xf604[207]](rule,_0xf604[340]);this[_0xf604[926]](nodes,_0xf604[76]);this[_0xf604[366]]();} ,blockSetStyle:function (rule,value){var nodes=this[_0xf604[905]]();$(nodes)[_0xf604[207]](rule,value);this[_0xf604[366]]();} ,blockRemoveClass:function (className){var nodes=this[_0xf604[905]]();$(nodes)[_0xf604[337]](className);this[_0xf604[926]](nodes,_0xf604[1070]);this[_0xf604[366]]();} ,blockSetClass:function (className){var nodes=this[_0xf604[905]]();$(nodes)[_0xf604[464]](className);this[_0xf604[366]]();} ,inlineRemoveClass:function (className){this[_0xf604[542]]();this[_0xf604[1071]](function (node){$(node)[_0xf604[337]](className);this[_0xf604[926]](node,_0xf604[1070]);} );this[_0xf604[547]]();this[_0xf604[366]]();} ,inlineSetClass:function (className){var current=this[_0xf604[561]]();if(!$(current)[_0xf604[515]](className)){this[_0xf604[1072]](_0xf604[464],className);} ;} ,inlineRemoveStyle:function (rule){this[_0xf604[542]]();this[_0xf604[1071]](function (node){$(node)[_0xf604[207]](rule,_0xf604[340]);this[_0xf604[926]](node,_0xf604[76]);} );this[_0xf604[547]]();this[_0xf604[366]]();} ,inlineSetStyle:function (rule,value){this[_0xf604[1072]](_0xf604[207],rule,value);} ,inlineRemoveAttr:function (attr){this[_0xf604[542]]();var range=this[_0xf604[587]](),node=this[_0xf604[815]](),nodes=this[_0xf604[904]]();if(range[_0xf604[588]]||range[_0xf604[1073]]===range[_0xf604[1074]]&&node){nodes=$(node);} ;$(nodes)[_0xf604[335]](attr);this[_0xf604[1075]]();this[_0xf604[547]]();this[_0xf604[366]]();} ,inlineSetAttr:function (attr,value){this[_0xf604[1072]](_0xf604[350],attr,value);} ,inlineMethods:function (type,attr,value){this[_0xf604[529]]();this[_0xf604[542]]();var range=this[_0xf604[587]]();var el=this[_0xf604[815]]();if((range[_0xf604[588]]||range[_0xf604[1073]]===range[_0xf604[1074]])&&el&&!this[_0xf604[916]](el)){$(el)[type](attr,value);} else {var cmd,arg=value;switch(attr){case _0xf604[1042]:cmd=_0xf604[1076];arg=4;break ;;case _0xf604[1078]:cmd=_0xf604[1077];break ;;case _0xf604[1080]:cmd=_0xf604[1079];break ;;case _0xf604[1037]:cmd=_0xf604[1081];break ;;} ;this[_0xf604[216]][_0xf604[487]](cmd,false,arg);var fonts=this[_0xf604[333]][_0xf604[374]](_0xf604[1082]);$[_0xf604[19]](fonts,$[_0xf604[485]](function (i,s){this[_0xf604[1083]](type,s,attr,value);} ,this));} ;this[_0xf604[547]]();this[_0xf604[366]]();} ,inlineSetMethods:function (type,s,attr,value){var parent=$(s)[_0xf604[577]](),el;var selectionHtml=this[_0xf604[811]]();var parentHtml=$(parent)[_0xf604[600]]();var selected=selectionHtml==parentHtml;if(selected&&parent&&parent[0][_0xf604[382]]===_0xf604[1084]&&parent[0][_0xf604[1085]][_0xf604[20]]!=0){el=parent;$(s)[_0xf604[385]]($(s)[_0xf604[50]]());} else {el=$(_0xf604[1086])[_0xf604[453]]($(s)[_0xf604[347]]());$(s)[_0xf604[385]](el);} ;$(el)[type](attr,value);return el;} ,inlineEachNodes:function (callback){var range=this[_0xf604[587]](),node=this[_0xf604[815]](),nodes=this[_0xf604[904]](),collapsed;if(range[_0xf604[588]]||range[_0xf604[1073]]===range[_0xf604[1074]]&&node){nodes=$(node);collapsed=true;} ;$[_0xf604[19]](nodes,$[_0xf604[485]](function (i,node){if(!collapsed&&node[_0xf604[382]]!==_0xf604[1084]){var selectionHtml=this[_0xf604[811]]();var parentHtml=$(node)[_0xf604[577]]()[_0xf604[600]]();var selected=selectionHtml==parentHtml;if(selected&&node[_0xf604[624]][_0xf604[382]]===_0xf604[1084]&&!$(node[_0xf604[624]])[_0xf604[515]](_0xf604[338])){node=node[_0xf604[624]];} else {return ;} ;} ;callback[_0xf604[8]](this,node);} ,this));} ,inlineUnwrapSpan:function (){var $spans=this[_0xf604[333]][_0xf604[374]](_0xf604[379]);$[_0xf604[19]]($spans,$[_0xf604[485]](function (i,span){var $span=$(span);if($span[_0xf604[350]](_0xf604[1070])===undefined&&$span[_0xf604[350]](_0xf604[76])===undefined){$span[_0xf604[347]]()[_0xf604[1043]]();} ;} ,this));} ,inlineFormat:function (tag){this[_0xf604[542]]();this[_0xf604[216]][_0xf604[487]](_0xf604[1076],false,4);var fonts=this[_0xf604[333]][_0xf604[374]](_0xf604[1082]);var last;$[_0xf604[19]](fonts,function (i,s){var el=$(_0xf604[381]+tag+_0xf604[1059])[_0xf604[453]]($(s)[_0xf604[347]]());$(s)[_0xf604[385]](el);last=el;} );this[_0xf604[547]]();this[_0xf604[366]]();} ,inlineRemoveFormat:function (tag){this[_0xf604[542]]();var utag=tag[_0xf604[1087]]();var nodes=this[_0xf604[904]]();var parent=$(this[_0xf604[560]]())[_0xf604[577]]();$[_0xf604[19]](nodes,function (i,s){if(s[_0xf604[382]]===utag){this[_0xf604[896]](s);} ;} );if(parent&&parent[0][_0xf604[382]]===utag){this[_0xf604[896]](parent);} ;this[_0xf604[547]]();this[_0xf604[366]]();} ,inlineRemoveFormatReplace:function (el){$(el)[_0xf604[385]]($(el)[_0xf604[347]]());} ,insertHtml:function (html,sync){var current=this[_0xf604[561]]();var parent=current[_0xf604[624]];this[_0xf604[845]]();this[_0xf604[529]]();var $html=$(_0xf604[1058])[_0xf604[453]]($[_0xf604[1088]](html));html=$html[_0xf604[50]]();html=this[_0xf604[392]](html);$html=$(_0xf604[1058])[_0xf604[453]]($[_0xf604[1088]](html));var currBlock=this[_0xf604[562]]();if($html[_0xf604[347]]()[_0xf604[20]]==1){var htmlTagName=$html[_0xf604[347]]()[0][_0xf604[382]];if(htmlTagName!=_0xf604[82]&&htmlTagName==currBlock[_0xf604[382]]||htmlTagName==_0xf604[127]){$html=$(_0xf604[1058])[_0xf604[453]](html);} ;} ;if(this[_0xf604[25]][_0xf604[212]]){html=html[_0xf604[352]](/<p(.*?)>([\w\W]*?)<\/p>/gi,_0xf604[361]);} ;if(!this[_0xf604[25]][_0xf604[212]]&&$html[_0xf604[347]]()[_0xf604[20]]==1&&$html[_0xf604[347]]()[0][_0xf604[591]]==3&&(this[_0xf604[1089]]()[_0xf604[20]]>2||(!current||current[_0xf604[382]]==_0xf604[628]&&!parent||parent[_0xf604[382]]==_0xf604[128]))){html=_0xf604[604]+html+_0xf604[606];} ;html=this[_0xf604[1090]](html);if($html[_0xf604[347]]()[_0xf604[20]]>1&&currBlock||$html[_0xf604[347]]()[_0xf604[1092]](_0xf604[1091])){if(this[_0xf604[246]](_0xf604[245])){if(!this[_0xf604[887]]()){this[_0xf604[216]][_0xf604[890]][_0xf604[889]]()[_0xf604[888]](html);} else {this[_0xf604[891]](html);} ;} else {this[_0xf604[216]][_0xf604[487]](_0xf604[886],false,html);} ;} else {this[_0xf604[1093]](html,false);} ;if(this[_0xf604[499]]){this[_0xf604[217]][_0xf604[750]]($[_0xf604[485]](function (){if(!this[_0xf604[25]][_0xf604[212]]){this[_0xf604[631]](this[_0xf604[333]][_0xf604[347]]()[_0xf604[598]]());} else {this[_0xf604[1094]]();} ;} ,this),1);} ;this[_0xf604[484]]();this[_0xf604[364]]();if(sync!==false){this[_0xf604[366]]();} ;} ,insertHtmlAdvanced:function (html,sync){html=this[_0xf604[1090]](html);var sel=this[_0xf604[565]]();if(sel[_0xf604[878]]&&sel[_0xf604[589]]){var range=sel[_0xf604[878]](0);range[_0xf604[590]]();var el=this[_0xf604[216]][_0xf604[593]](_0xf604[114]);el[_0xf604[879]]=html;var frag=this[_0xf604[216]][_0xf604[880]](),node,lastNode;while((node=el[_0xf604[882]])){lastNode=frag[_0xf604[881]](node);} ;range[_0xf604[594]](frag);if(lastNode){range=range[_0xf604[883]]();range[_0xf604[884]](lastNode);range[_0xf604[752]](true);sel[_0xf604[753]]();sel[_0xf604[754]](range);} ;} ;if(sync!==false){this[_0xf604[366]]();} ;} ,insertBeforeCursor:function (html){html=this[_0xf604[1090]](html);var node=$(html);var space=document[_0xf604[593]](_0xf604[378]);space[_0xf604[879]]=_0xf604[1095];var range=this[_0xf604[587]]();range[_0xf604[594]](space);range[_0xf604[594]](node[0]);range[_0xf604[752]](false);var sel=this[_0xf604[565]]();sel[_0xf604[753]]();sel[_0xf604[754]](range);this[_0xf604[366]]();} ,insertText:function (html){var $html=$($[_0xf604[1088]](html));if($html[_0xf604[20]]){html=$html[_0xf604[600]]();} ;this[_0xf604[845]]();if(this[_0xf604[246]](_0xf604[245])){if(!this[_0xf604[887]]()){this[_0xf604[216]][_0xf604[890]][_0xf604[889]]()[_0xf604[888]](html);} else {this[_0xf604[891]](html);} ;} else {this[_0xf604[216]][_0xf604[487]](_0xf604[886],false,html);} ;this[_0xf604[366]]();} ,insertNode:function (node){node=node[0]||node;if(node[_0xf604[382]]==_0xf604[1096]){var replacementTag=_0xf604[379];var outer=node[_0xf604[380]];var regex= new RegExp(_0xf604[381]+node[_0xf604[382]],_0xf604[236]);var newTag=outer[_0xf604[352]](regex,_0xf604[381]+replacementTag);regex= new RegExp(_0xf604[384]+node[_0xf604[382]],_0xf604[236]);newTag=newTag[_0xf604[352]](regex,_0xf604[384]+replacementTag);node=$(newTag)[0];} ;var sel=this[_0xf604[565]]();if(sel[_0xf604[878]]&&sel[_0xf604[589]]){range=sel[_0xf604[878]](0);range[_0xf604[590]]();range[_0xf604[594]](node);range[_0xf604[1097]](node);range[_0xf604[884]](node);sel[_0xf604[753]]();sel[_0xf604[754]](range);} ;return node;} ,insertNodeToCaretPositionFromPoint:function (e,node){var range;var x=e[_0xf604[818]],y=e[_0xf604[819]];if(this[_0xf604[216]][_0xf604[1098]]){var pos=this[_0xf604[216]][_0xf604[1098]](x,y);range=this[_0xf604[587]]();range[_0xf604[1100]](pos[_0xf604[1099]],pos[_0xf604[800]]);range[_0xf604[752]](true);range[_0xf604[594]](node);} else {if(this[_0xf604[216]][_0xf604[1101]]){range=this[_0xf604[216]][_0xf604[1101]](x,y);range[_0xf604[594]](node);} else {if( typeof document[_0xf604[73]][_0xf604[1102]]!=_0xf604[12]){range=this[_0xf604[216]][_0xf604[73]][_0xf604[1102]]();range[_0xf604[1103]](x,y);var endRange=range[_0xf604[1104]]();endRange[_0xf604[1103]](x,y);range[_0xf604[1106]](_0xf604[1105],endRange);range[_0xf604[121]]();} ;} ;} ;} ,insertAfterLastElement:function (element,parent){if( typeof (parent)!=_0xf604[12]){element=parent;} ;if(this[_0xf604[596]]()){if(this[_0xf604[25]][_0xf604[212]]){var contents=$(_0xf604[1058])[_0xf604[453]]($[_0xf604[394]](this[_0xf604[333]][_0xf604[50]]()))[_0xf604[347]]();var last=contents[_0xf604[598]]()[0];if(last[_0xf604[382]]==_0xf604[1096]&&last[_0xf604[879]]==_0xf604[340]){last=contents[_0xf604[627]]()[0];} ;if(this[_0xf604[348]](last)!=this[_0xf604[348]](element)){return false;} ;} else {if(this[_0xf604[333]][_0xf604[347]]()[_0xf604[598]]()[0]!==element){return false;} ;} ;this[_0xf604[597]](element);} ;} ,insertingAfterLastElement:function (element){this[_0xf604[529]]();if(this[_0xf604[25]][_0xf604[212]]===false){var node=$(this[_0xf604[25]][_0xf604[676]]);$(element)[_0xf604[329]](node);this[_0xf604[607]](node);} else {var node=$(_0xf604[912]+this[_0xf604[25]][_0xf604[605]]+_0xf604[428],this[_0xf604[216]])[0];$(element)[_0xf604[329]](node);$(node)[_0xf604[329]](this[_0xf604[25]][_0xf604[605]]);this[_0xf604[547]]();this[_0xf604[333]][_0xf604[374]](_0xf604[1067])[_0xf604[335]](_0xf604[459]);} ;} ,insertLineBreak:function (twice){this[_0xf604[542]]();var br=_0xf604[395];if(twice==true){br=_0xf604[1107];} ;if(this[_0xf604[246]](_0xf604[470])){var span=$(_0xf604[426])[_0xf604[50]](this[_0xf604[25]][_0xf604[605]]);this[_0xf604[333]][_0xf604[374]](_0xf604[913])[_0xf604[869]](br)[_0xf604[869]](span)[_0xf604[869]](this[_0xf604[25]][_0xf604[605]]);this[_0xf604[1108]](span[0]);span[_0xf604[331]]();this[_0xf604[1109]]();} else {var parent=this[_0xf604[560]]();if(parent&&parent[_0xf604[382]]===_0xf604[872]){var offset=this[_0xf604[1110]](parent);var text=$[_0xf604[394]]($(parent)[_0xf604[600]]())[_0xf604[352]](/\n\r\n/g,_0xf604[340]);var len=text[_0xf604[20]];if(offset==len){this[_0xf604[1109]]();var node=$(_0xf604[912]+this[_0xf604[25]][_0xf604[605]]+_0xf604[428],this[_0xf604[216]])[0];$(parent)[_0xf604[329]](node);$(node)[_0xf604[869]](br+(this[_0xf604[246]](_0xf604[534])?this[_0xf604[25]][_0xf604[605]]:_0xf604[340]));this[_0xf604[547]]();return true;} ;} ;this[_0xf604[333]][_0xf604[374]](_0xf604[913])[_0xf604[869]](br+(this[_0xf604[246]](_0xf604[534])?this[_0xf604[25]][_0xf604[605]]:_0xf604[340]));this[_0xf604[547]]();} ;} ,insertDoubleLineBreak:function (){this[_0xf604[612]](true);} ,replaceLineBreak:function (element){var node=$(_0xf604[395]+this[_0xf604[25]][_0xf604[605]]);$(element)[_0xf604[385]](node);this[_0xf604[607]](node);} ,pasteClean:function (html){html=this[_0xf604[403]](_0xf604[1111],false,html);if(this[_0xf604[246]](_0xf604[245])){var tmp=$[_0xf604[394]](html);if(tmp[_0xf604[618]](/^<a(.*?)>(.*?)<\/a>$/i)==0){html=html[_0xf604[352]](/^<a(.*?)>(.*?)<\/a>$/i,_0xf604[424]);} ;} ;if(this[_0xf604[25]][_0xf604[1112]]){var tmp=this[_0xf604[216]][_0xf604[593]](_0xf604[114]);html=html[_0xf604[352]](/<br>|<\/H[1-6]>|<\/p>|<\/div>/gi,_0xf604[377]);tmp[_0xf604[879]]=html;html=tmp[_0xf604[1113]]||tmp[_0xf604[1114]];html=$[_0xf604[394]](html);html=html[_0xf604[352]](_0xf604[377],_0xf604[395]);html=this[_0xf604[939]](html);this[_0xf604[1115]](html);return false;} ;var tablePaste=false;if(this[_0xf604[898]](_0xf604[93])){tablePaste=true;var blocksElems=this[_0xf604[25]][_0xf604[234]];blocksElems[_0xf604[15]](_0xf604[124]);blocksElems[_0xf604[15]](_0xf604[53]);$[_0xf604[19]](blocksElems,function (i,s){html=html[_0xf604[352]]( new RegExp(_0xf604[381]+s+_0xf604[1068],_0xf604[383]),_0xf604[340]);html=html[_0xf604[352]]( new RegExp(_0xf604[384]+s+_0xf604[742],_0xf604[383]),_0xf604[395]);} );} ;if(this[_0xf604[898]](_0xf604[127])){html=this[_0xf604[1116]](html);this[_0xf604[1115]](html);return true;} ;html=html[_0xf604[352]](/<img(.*?)v:shapes=(.*?)>/gi,_0xf604[340]);html=html[_0xf604[352]](/<p(.*?)class="MsoListParagraphCxSpFirst"([\w\W]*?)<\/p>/gi,_0xf604[1117]);html=html[_0xf604[352]](/<p(.*?)class="MsoListParagraphCxSpMiddle"([\w\W]*?)<\/p>/gi,_0xf604[1118]);html=html[_0xf604[352]](/<p(.*?)class="MsoListParagraphCxSpLast"([\w\W]*?)<\/p>/gi,_0xf604[1119]);html=html[_0xf604[352]](/<p(.*?)class="MsoListParagraph"([\w\W]*?)<\/p>/gi,_0xf604[1120]);html=html[_0xf604[352]](/·/g,_0xf604[340]);html=html[_0xf604[352]](/<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi,_0xf604[340]);if(this[_0xf604[25]][_0xf604[1121]]===true){html=html[_0xf604[352]](/(&nbsp;){2,}/gi,_0xf604[1122]);html=html[_0xf604[352]](/&nbsp;/gi,_0xf604[744]);} ;html=html[_0xf604[352]](/<b\sid="internal-source-marker(.*?)">([\w\W]*?)<\/b>/gi,_0xf604[424]);html=html[_0xf604[352]](/<b(.*?)id="docs-internal-guid(.*?)">([\w\W]*?)<\/b>/gi,_0xf604[1123]);html=html[_0xf604[352]](/<span[^>]*(font-style: italic; font-weight: bold|font-weight: bold; font-style: italic)[^>]*>/gi,_0xf604[1124]);html=html[_0xf604[352]](/<span[^>]*font-style: italic[^>]*>/gi,_0xf604[1125]);html=html[_0xf604[352]](/<span[^>]*font-weight: bold[^>]*>/gi,_0xf604[1126]);html=html[_0xf604[352]](/<span[^>]*text-decoration: underline[^>]*>/gi,_0xf604[1127]);html=html[_0xf604[352]](/<td>\u200b*<\/td>/gi,_0xf604[1128]);html=html[_0xf604[352]](/<td>&nbsp;<\/td>/gi,_0xf604[1128]);html=html[_0xf604[352]](/<td><br><\/td>/gi,_0xf604[1128]);html=html[_0xf604[352]](/<td(.*?)colspan="(.*?)"(.*?)>([\w\W]*?)<\/td>/gi,_0xf604[1129]);html=html[_0xf604[352]](/<td(.*?)rowspan="(.*?)"(.*?)>([\w\W]*?)<\/td>/gi,_0xf604[1130]);html=html[_0xf604[352]](/<a(.*?)href="(.*?)"(.*?)>([\w\W]*?)<\/a>/gi,_0xf604[1131]);html=html[_0xf604[352]](/<iframe(.*?)>([\w\W]*?)<\/iframe>/gi,_0xf604[1132]);html=html[_0xf604[352]](/<video(.*?)>([\w\W]*?)<\/video>/gi,_0xf604[1133]);html=html[_0xf604[352]](/<audio(.*?)>([\w\W]*?)<\/audio>/gi,_0xf604[1134]);html=html[_0xf604[352]](/<embed(.*?)>([\w\W]*?)<\/embed>/gi,_0xf604[1135]);html=html[_0xf604[352]](/<object(.*?)>([\w\W]*?)<\/object>/gi,_0xf604[1136]);html=html[_0xf604[352]](/<param(.*?)>/gi,_0xf604[1137]);html=html[_0xf604[352]](/<img(.*?)>/gi,_0xf604[1138]);html=html[_0xf604[352]](/ class="(.*?)"/gi,_0xf604[340]);html=html[_0xf604[352]](/<(\w+)([\w\W]*?)>/gi,_0xf604[1139]);if(this[_0xf604[25]][_0xf604[212]]){html=html[_0xf604[352]](/<strong><\/strong>/gi,_0xf604[340]);html=html[_0xf604[352]](/<u><\/u>/gi,_0xf604[340]);if(this[_0xf604[25]][_0xf604[423]]){html=html[_0xf604[352]](/<font(.*?)>([\w\W]*?)<\/font>/gi,_0xf604[424]);} ;html=html[_0xf604[352]](/<[^\/>][^>]*>(\s*|\t*|\n*|&nbsp;|<br>)<\/[^>]+>/gi,_0xf604[395]);} else {html=html[_0xf604[352]](/<[^\/>][^>]*>(\s*|\t*|\n*|&nbsp;|<br>)<\/[^>]+>/gi,_0xf604[340]);} ;html=html[_0xf604[352]](/<div>\s*?\t*?\n*?(<ul>|<ol>|<p>)/gi,_0xf604[425]);html=html[_0xf604[352]](/\[td colspan="(.*?)"\]([\w\W]*?)\[\/td\]/gi,_0xf604[1140]);html=html[_0xf604[352]](/\[td rowspan="(.*?)"\]([\w\W]*?)\[\/td\]/gi,_0xf604[1141]);html=html[_0xf604[352]](/\[td\]/gi,_0xf604[1142]);html=html[_0xf604[352]](/\[a href="(.*?)"\]([\w\W]*?)\[\/a\]/gi,_0xf604[1143]);html=html[_0xf604[352]](/\[iframe(.*?)\]([\w\W]*?)\[\/iframe\]/gi,_0xf604[1144]);html=html[_0xf604[352]](/\[video(.*?)\]([\w\W]*?)\[\/video\]/gi,_0xf604[1145]);html=html[_0xf604[352]](/\[audio(.*?)\]([\w\W]*?)\[\/audio\]/gi,_0xf604[1146]);html=html[_0xf604[352]](/\[embed(.*?)\]([\w\W]*?)\[\/embed\]/gi,_0xf604[1147]);html=html[_0xf604[352]](/\[object(.*?)\]([\w\W]*?)\[\/object\]/gi,_0xf604[1148]);html=html[_0xf604[352]](/\[param(.*?)\]/gi,_0xf604[1149]);html=html[_0xf604[352]](/\[img(.*?)\]/gi,_0xf604[1150]);if(this[_0xf604[25]][_0xf604[936]]){html=html[_0xf604[352]](/<div(.*?)>([\w\W]*?)<\/div>/gi,_0xf604[1151]);html=html[_0xf604[352]](/<\/div><p>/gi,_0xf604[604]);html=html[_0xf604[352]](/<\/p><\/div>/gi,_0xf604[606]);html=html[_0xf604[352]](/<p><\/p>/gi,_0xf604[1152]);} else {html=html[_0xf604[352]](/<div><\/div>/gi,_0xf604[1152]);} ;html=this[_0xf604[357]](html);if(this[_0xf604[898]](_0xf604[126])){html=html[_0xf604[352]](/<p>([\w\W]*?)<\/p>/gi,_0xf604[1153]);} else {if(tablePaste===false){html=this[_0xf604[939]](html);} ;} ;html=html[_0xf604[352]](/<span(.*?)>([\w\W]*?)<\/span>/gi,_0xf604[424]);html=html[_0xf604[352]](/<img>/gi,_0xf604[340]);html=html[_0xf604[352]](/<[^\/>][^>][^img|param|source|td][^<]*>(\s*|\t*|\n*| |<br>)<\/[^>]+>/gi,_0xf604[340]);html=html[_0xf604[352]](/\n{3,}/gi,_0xf604[377]);html=html[_0xf604[352]](/<p><p>/gi,_0xf604[604]);html=html[_0xf604[352]](/<\/p><\/p>/gi,_0xf604[606]);html=html[_0xf604[352]](/<li>(\s*|\t*|\n*)<p>/gi,_0xf604[791]);html=html[_0xf604[352]](/<\/p>(\s*|\t*|\n*)<\/li>/gi,_0xf604[1009]);if(this[_0xf604[25]][_0xf604[212]]===true){html=html[_0xf604[352]](/<p(.*?)>([\w\W]*?)<\/p>/gi,_0xf604[361]);} ;html=html[_0xf604[352]](/<[^\/>][^>][^img|param|source|td][^<]*>(\s*|\t*|\n*| |<br>)<\/[^>]+>/gi,_0xf604[340]);html=html[_0xf604[352]](/<img src="webkit-fake-url\:\/\/(.*?)"(.*?)>/gi,_0xf604[340]);html=html[_0xf604[352]](/<td(.*?)>(\s*|\t*|\n*)<p>([\w\W]*?)<\/p>(\s*|\t*|\n*)<\/td>/gi,_0xf604[1154]);if(this[_0xf604[25]][_0xf604[936]]){html=html[_0xf604[352]](/<div(.*?)>([\w\W]*?)<\/div>/gi,_0xf604[424]);html=html[_0xf604[352]](/<div(.*?)>([\w\W]*?)<\/div>/gi,_0xf604[424]);} ;this[_0xf604[1155]]=false;if(this[_0xf604[246]](_0xf604[470])){if(this[_0xf604[25]][_0xf604[539]]){var matches=html[_0xf604[376]](/<img src="data:image(.*?)"(.*?)>/gi);if(matches!==null){this[_0xf604[1155]]=matches;for(k in matches){var img=matches[k][_0xf604[352]](_0xf604[1156],_0xf604[1157]+k+_0xf604[1158]);html=html[_0xf604[352]](matches[k],img);} ;} ;} ;while(/<br>$/gi[_0xf604[608]](html)){html=html[_0xf604[352]](/<br>$/gi,_0xf604[340]);} ;} ;html=html[_0xf604[352]](/<p>•([\w\W]*?)<\/p>/gi,_0xf604[1159]);if(this[_0xf604[246]](_0xf604[245])){while(/<font>([\w\W]*?)<\/font>/gi[_0xf604[608]](html)){html=html[_0xf604[352]](/<font>([\w\W]*?)<\/font>/gi,_0xf604[425]);} ;} ;if(tablePaste===false){html=html[_0xf604[352]](/<td(.*?)>([\w\W]*?)<p(.*?)>([\w\W]*?)<\/td>/gi,_0xf604[1160]);html=html[_0xf604[352]](/<td(.*?)>([\w\W]*?)<\/p>([\w\W]*?)<\/td>/gi,_0xf604[1161]);html=html[_0xf604[352]](/<td(.*?)>([\w\W]*?)<p(.*?)>([\w\W]*?)<\/td>/gi,_0xf604[1160]);html=html[_0xf604[352]](/<td(.*?)>([\w\W]*?)<\/p>([\w\W]*?)<\/td>/gi,_0xf604[1161]);} ;html=html[_0xf604[352]](/\n/g,_0xf604[744]);html=html[_0xf604[352]](/<p>\n?<li>/gi,_0xf604[791]);this[_0xf604[1115]](html);} ,pastePre:function (s){s=s[_0xf604[352]](/<br>|<\/H[1-6]>|<\/p>|<\/div>/gi,_0xf604[377]);var tmp=this[_0xf604[216]][_0xf604[593]](_0xf604[114]);tmp[_0xf604[879]]=s;return this[_0xf604[1030]](tmp[_0xf604[1113]]||tmp[_0xf604[1114]]);} ,pasteInsert:function (html){html=this[_0xf604[403]](_0xf604[1162],false,html);if(this[_0xf604[499]]){this[_0xf604[333]][_0xf604[50]](html);this[_0xf604[824]]();this[_0xf604[1094]]();this[_0xf604[366]]();} else {this[_0xf604[897]](html);} ;this[_0xf604[499]]=false;setTimeout($[_0xf604[485]](function (){this[_0xf604[198]]=false;if(this[_0xf604[246]](_0xf604[470])){this[_0xf604[333]][_0xf604[374]](_0xf604[1163])[_0xf604[331]]();} ;if(this[_0xf604[1155]]!==false){this[_0xf604[1164]]();} ;} ,this),100);if(this[_0xf604[25]][_0xf604[445]]&&this[_0xf604[543]]!==true){$(this[_0xf604[216]][_0xf604[73]])[_0xf604[545]](this[_0xf604[544]]);} else {this[_0xf604[333]][_0xf604[545]](this[_0xf604[544]]);} ;} ,pasteClipboardAppendFields:function (postData){if(this[_0xf604[25]][_0xf604[1165]]!==false&& typeof this[_0xf604[25]][_0xf604[1165]]===_0xf604[1166]){$[_0xf604[19]](this[_0xf604[25]][_0xf604[1165]],$[_0xf604[485]](function (k,v){if(v!=null&&v.toString()[_0xf604[528]](_0xf604[734])===0){v=$(v)[_0xf604[332]]();} ;postData[k]=v;} ,this));} ;return postData;} ,pasteClipboardUploadMozilla:function (){var imgs=this[_0xf604[333]][_0xf604[374]](_0xf604[1167]);$[_0xf604[19]](imgs,$[_0xf604[485]](function (i,s){var $s=$(s);var arr=s[_0xf604[368]][_0xf604[461]](_0xf604[677]);var postData={contentType:arr[0][_0xf604[461]](_0xf604[696])[0][_0xf604[461]](_0xf604[1168])[1],data:arr[1]};postData=this[_0xf604[1169]](postData);$[_0xf604[768]](this[_0xf604[25]][_0xf604[1170]],postData,$[_0xf604[485]](function (data){var json=( typeof data===_0xf604[10]?$[_0xf604[770]](data):data);$s[_0xf604[350]](_0xf604[368],json[_0xf604[1171]]);$s[_0xf604[335]](_0xf604[1172]);this[_0xf604[366]]();this[_0xf604[403]](_0xf604[493],$s,json);} ,this));} ,this));} ,pasteClipboardUpload:function (e){var result=e[_0xf604[511]][_0xf604[1173]];var arr=result[_0xf604[461]](_0xf604[677]);var postData={contentType:arr[0][_0xf604[461]](_0xf604[696])[0][_0xf604[461]](_0xf604[1168])[1],data:arr[1]};if(this[_0xf604[25]][_0xf604[539]]){postData=this[_0xf604[1169]](postData);$[_0xf604[768]](this[_0xf604[25]][_0xf604[1170]],postData,$[_0xf604[485]](function (data){var json=( typeof data===_0xf604[10]?$[_0xf604[770]](data):data);var html=_0xf604[1174]+json[_0xf604[1171]]+_0xf604[1175];this[_0xf604[487]](_0xf604[886],html,false);var image=$(this[_0xf604[333]][_0xf604[374]](_0xf604[1176]));if(image[_0xf604[20]]){image[_0xf604[335]](_0xf604[459]);} else {image=false;} ;this[_0xf604[366]]();if(image){this[_0xf604[403]](_0xf604[493],image,json);} ;} ,this));} else {this[_0xf604[897]](_0xf604[1174]+result+_0xf604[658]);} ;} ,bufferSet:function (selectionSave){if(selectionSave!==false){this[_0xf604[542]]();} ;this[_0xf604[25]][_0xf604[579]][_0xf604[15]](this[_0xf604[333]][_0xf604[50]]());if(selectionSave!==false){this[_0xf604[1109]](_0xf604[579]);} ;} ,bufferUndo:function (){if(this[_0xf604[25]][_0xf604[579]][_0xf604[20]]===0){this[_0xf604[845]]();return ;} ;this[_0xf604[542]]();this[_0xf604[25]][_0xf604[582]][_0xf604[15]](this[_0xf604[333]][_0xf604[50]]());this[_0xf604[547]](false,true);this[_0xf604[333]][_0xf604[50]](this[_0xf604[25]][_0xf604[579]][_0xf604[1177]]());this[_0xf604[547]]();setTimeout($[_0xf604[485]](this[_0xf604[484]],this),100);} ,bufferRedo:function (){if(this[_0xf604[25]][_0xf604[582]][_0xf604[20]]===0){this[_0xf604[845]]();return false;} ;this[_0xf604[542]]();this[_0xf604[25]][_0xf604[579]][_0xf604[15]](this[_0xf604[333]][_0xf604[50]]());this[_0xf604[547]](false,true);this[_0xf604[333]][_0xf604[50]](this[_0xf604[25]][_0xf604[582]][_0xf604[1177]]());this[_0xf604[547]](true);setTimeout($[_0xf604[485]](this[_0xf604[484]],this),4);} ,observeStart:function (){this[_0xf604[642]]();if(this[_0xf604[25]][_0xf604[643]]){this[_0xf604[643]]();} ;} ,observeLinks:function (){this[_0xf604[333]][_0xf604[374]](_0xf604[792])[_0xf604[497]](_0xf604[832],$[_0xf604[485]](this[_0xf604[1178]],this));this[_0xf604[333]][_0xf604[497]](_0xf604[498],$[_0xf604[485]](function (e){this[_0xf604[1179]](e);} ,this));$(document)[_0xf604[497]](_0xf604[498],$[_0xf604[485]](function (e){this[_0xf604[1179]](e);} ,this));} ,observeImages:function (){if(this[_0xf604[25]][_0xf604[642]]===false){return false;} ;this[_0xf604[333]][_0xf604[374]](_0xf604[398])[_0xf604[19]]($[_0xf604[485]](function (i,elem){if(this[_0xf604[246]](_0xf604[245])){$(elem)[_0xf604[350]](_0xf604[1180],_0xf604[497]);} ;var parent=$(elem)[_0xf604[577]]();if(!parent[_0xf604[515]](_0xf604[1181])&&!parent[_0xf604[515]](_0xf604[1182])){this[_0xf604[1183]](elem);} ;} ,this));this[_0xf604[333]][_0xf604[374]](_0xf604[1185])[_0xf604[497]](_0xf604[832],$[_0xf604[485]](this[_0xf604[1184]],this));} ,linkObserver:function (e){var $link=$(e[_0xf604[511]]);var parent=$(e[_0xf604[511]])[_0xf604[577]]();if(parent[_0xf604[515]](_0xf604[1181])||parent[_0xf604[515]](_0xf604[1182])){return ;} ;if($link[_0xf604[516]]()==0||$link[0][_0xf604[382]]!==_0xf604[872]){return ;} ;var pos=$link[_0xf604[800]]();if(this[_0xf604[25]][_0xf604[211]]){var posFrame=this[_0xf604[343]][_0xf604[800]]();pos[_0xf604[799]]=posFrame[_0xf604[799]]+(pos[_0xf604[799]]-$(this[_0xf604[216]])[_0xf604[545]]());pos[_0xf604[569]]+=posFrame[_0xf604[569]];} ;var tooltip=$(_0xf604[1186]);var href=$link[_0xf604[350]](_0xf604[1187]);if(href===undefined){href=_0xf604[340];} ;if(href[_0xf604[20]]>24){href=href[_0xf604[767]](0,24)+_0xf604[1188];} ;var aLink=$(_0xf604[1189]+$link[_0xf604[350]](_0xf604[1187])+_0xf604[1190]+href+_0xf604[831])[_0xf604[497]](_0xf604[832],$[_0xf604[485]](function (e){this[_0xf604[1179]](false);} ,this));var aEdit=$(_0xf604[1191]+this[_0xf604[25]][_0xf604[250]][_0xf604[1192]]+_0xf604[831])[_0xf604[497]](_0xf604[832],$[_0xf604[485]](function (e){e[_0xf604[525]]();this[_0xf604[310]]();this[_0xf604[1179]](false);} ,this));var aUnlink=$(_0xf604[1191]+this[_0xf604[25]][_0xf604[250]][_0xf604[311]]+_0xf604[831])[_0xf604[497]](_0xf604[832],$[_0xf604[485]](function (e){e[_0xf604[525]]();this[_0xf604[487]](_0xf604[311]);this[_0xf604[1179]](false);} ,this));tooltip[_0xf604[453]](aLink);tooltip[_0xf604[453]](_0xf604[1193]);tooltip[_0xf604[453]](aEdit);tooltip[_0xf604[453]](_0xf604[1193]);tooltip[_0xf604[453]](aUnlink);tooltip[_0xf604[207]]({top:(pos[_0xf604[799]]+20)+_0xf604[469],left:pos[_0xf604[569]]+_0xf604[469]});$(_0xf604[1194])[_0xf604[331]]();$(_0xf604[73])[_0xf604[453]](tooltip);} ,linkObserverTooltipClose:function (e){if(e!==false&&e[_0xf604[511]][_0xf604[382]]==_0xf604[872]){return false;} ;$(_0xf604[1194])[_0xf604[331]]();} ,getSelection:function (){if(!this[_0xf604[25]][_0xf604[1195]]){return this[_0xf604[216]][_0xf604[565]]();} else {if(!this[_0xf604[25]][_0xf604[211]]){return rangy[_0xf604[565]]();} else {return rangy[_0xf604[565]](this[_0xf604[343]][0]);} ;} ;} ,getRange:function (){if(!this[_0xf604[25]][_0xf604[1195]]){if(this[_0xf604[216]][_0xf604[565]]){var sel=this[_0xf604[565]]();if(sel[_0xf604[878]]&&sel[_0xf604[589]]){return sel[_0xf604[878]](0);} ;} ;return this[_0xf604[216]][_0xf604[889]]();} else {if(!this[_0xf604[25]][_0xf604[211]]){return rangy[_0xf604[889]]();} else {return rangy[_0xf604[889]](this[_0xf604[653]]());} ;} ;} ,selectionElement:function (node){this[_0xf604[1196]](node);} ,selectionStart:function (node){this[_0xf604[1197]](node[0]||node,0,null,0);} ,selectionEnd:function (node){this[_0xf604[1197]](node[0]||node,1,null,1);} ,selectionSet:function (orgn,orgo,focn,foco){if(focn==null){focn=orgn;} ;if(foco==null){foco=orgo;} ;var sel=this[_0xf604[565]]();if(!sel){return ;} ;if(orgn[_0xf604[382]]==_0xf604[82]&&orgn[_0xf604[879]]==_0xf604[340]){orgn[_0xf604[879]]=this[_0xf604[25]][_0xf604[605]];} ;if(orgn[_0xf604[382]]==_0xf604[630]&&this[_0xf604[25]][_0xf604[212]]===false){var par=$(this[_0xf604[25]][_0xf604[676]])[0];$(orgn)[_0xf604[385]](par);orgn=par;focn=orgn;} ;var range=this[_0xf604[587]]();range[_0xf604[1100]](orgn,orgo);range[_0xf604[1198]](focn,foco);try{sel[_0xf604[753]]();} catch(e){} ;sel[_0xf604[754]](range);} ,selectionWrap:function (tag){tag=tag[_0xf604[745]]();var block=this[_0xf604[562]]();if(block){var wrapper=this[_0xf604[1199]](block,tag);this[_0xf604[366]]();return wrapper;} ;var sel=this[_0xf604[565]]();var range=sel[_0xf604[878]](0);var wrapper=document[_0xf604[593]](tag);wrapper[_0xf604[881]](range[_0xf604[1200]]());range[_0xf604[594]](wrapper);this[_0xf604[1069]](wrapper);return wrapper;} ,selectionAll:function (){var range=this[_0xf604[587]]();range[_0xf604[751]](this[_0xf604[333]][0]);var sel=this[_0xf604[565]]();sel[_0xf604[753]]();sel[_0xf604[754]](range);} ,selectionRemove:function (){this[_0xf604[565]]()[_0xf604[753]]();} ,getCaretOffset:function (element){var caretOffset=0;var range=this[_0xf604[587]]();var preCaretRange=range[_0xf604[883]]();preCaretRange[_0xf604[751]](element);preCaretRange[_0xf604[1198]](range[_0xf604[1074]],range[_0xf604[2]]);caretOffset=$[_0xf604[394]](preCaretRange.toString())[_0xf604[20]];return caretOffset;} ,getCaretOffsetRange:function (){return  new Range(this[_0xf604[565]]()[_0xf604[878]](0));} ,setCaret:function (el,start,end){if( typeof end===_0xf604[12]){end=start;} ;el=el[0]||el;var range=this[_0xf604[587]]();range[_0xf604[751]](el);var textNodes=this[_0xf604[1201]](el);var foundStart=false;var charCount=0,endCharCount;if(textNodes[_0xf604[20]]==1&&start){range[_0xf604[1100]](textNodes[0],start);range[_0xf604[1198]](textNodes[0],end);} else {for(var i=0,textNode;textNode=textNodes[i++];){endCharCount=charCount+textNode[_0xf604[20]];if(!foundStart&&start>=charCount&&(start<endCharCount||(start==endCharCount&&i<textNodes[_0xf604[20]]))){range[_0xf604[1100]](textNode,start-charCount);foundStart=true;} ;if(foundStart&&end<=endCharCount){range[_0xf604[1198]](textNode,end-charCount);break ;} ;charCount=endCharCount;} ;} ;var sel=this[_0xf604[565]]();sel[_0xf604[753]]();sel[_0xf604[754]](range);} ,setCaretAfter:function (node){this[_0xf604[333]][_0xf604[489]]();node=node[0]||node;var range=this[_0xf604[216]][_0xf604[889]]();var start=1;var end=-1;range[_0xf604[1100]](node,start);range[_0xf604[1198]](node,end+2);var selection=this[_0xf604[217]][_0xf604[565]]();var cursorRange=this[_0xf604[216]][_0xf604[889]]();var emptyElement=this[_0xf604[216]][_0xf604[617]](_0xf604[1095]);$(node)[_0xf604[329]](emptyElement);cursorRange[_0xf604[884]](emptyElement);selection[_0xf604[753]]();selection[_0xf604[754]](cursorRange);$(emptyElement)[_0xf604[331]]();} ,getTextNodesIn:function (node){var textNodes=[];if(node[_0xf604[591]]==3){textNodes[_0xf604[15]](node);} else {var children=node[_0xf604[1202]];for(var i=0,len=children[_0xf604[20]];i<len;++i){textNodes[_0xf604[15]][_0xf604[14]](textNodes,this[_0xf604[1201]](children[i]));} ;} ;return textNodes;} ,getCurrent:function (){var el=false;var sel=this[_0xf604[565]]();if(sel&&sel[_0xf604[589]]>0){el=sel[_0xf604[878]](0)[_0xf604[1073]];} ;return this[_0xf604[902]](el);} ,getParent:function (elem){elem=elem||this[_0xf604[561]]();if(elem){return this[_0xf604[902]]($(elem)[_0xf604[577]]()[0]);} else {return false;} ;} ,getBlock:function (node){if( typeof node===_0xf604[12]){node=this[_0xf604[561]]();} ;while(node){if(this[_0xf604[916]](node)){if($(node)[_0xf604[515]](_0xf604[338])){return false;} ;return node;} ;node=node[_0xf604[624]];} ;return false;} ,getBlocks:function (nodes){var newnodes=[];if( typeof nodes==_0xf604[12]){var range=this[_0xf604[587]]();if(range&&range[_0xf604[588]]===true){return [this[_0xf604[562]]()];} ;var nodes=this[_0xf604[904]](range);} ;$[_0xf604[19]](nodes,$[_0xf604[485]](function (i,node){if(this[_0xf604[25]][_0xf604[211]]===false&&$(node)[_0xf604[518]](_0xf604[1203])[_0xf604[516]]()==0){return false;} ;if(this[_0xf604[916]](node)){newnodes[_0xf604[15]](node);} ;} ,this));if(newnodes[_0xf604[20]]===0){newnodes=[this[_0xf604[562]]()];} ;return newnodes;} ,isInlineNode:function (node){if(node[_0xf604[591]]!=1){return false;} ;return !this[_0xf604[232]][_0xf604[608]](node[_0xf604[1204]]);} ,nodeTestBlocks:function (node){return node[_0xf604[591]]==1&&this[_0xf604[232]][_0xf604[608]](node[_0xf604[1204]]);} ,tagTestBlock:function (tag){return this[_0xf604[232]][_0xf604[608]](tag);} ,getNodes:function (range,tag){if( typeof range==_0xf604[12]||range==false){var range=this[_0xf604[587]]();} ;if(range&&range[_0xf604[588]]===true){if( typeof tag===_0xf604[12]&&this[_0xf604[1205]](tag)){var block=this[_0xf604[562]]();if(block[_0xf604[382]]==tag){return [block];} else {return [];} ;} else {return [this[_0xf604[561]]()];} ;} ;var nodes=[],finalnodes=[];var sel=this[_0xf604[216]][_0xf604[565]]();if(!sel[_0xf604[1206]]){nodes=this[_0xf604[1089]](sel[_0xf604[878]](0));} ;$[_0xf604[19]](nodes,$[_0xf604[485]](function (i,node){if(this[_0xf604[25]][_0xf604[211]]===false&&$(node)[_0xf604[518]](_0xf604[1203])[_0xf604[516]]()==0){return false;} ;if( typeof tag===_0xf604[12]){if($[_0xf604[394]](node[_0xf604[1113]])!=_0xf604[340]){finalnodes[_0xf604[15]](node);} ;} else {if(node[_0xf604[382]]==tag){finalnodes[_0xf604[15]](node);} ;} ;} ,this));if(finalnodes[_0xf604[20]]==0){if( typeof tag===_0xf604[12]&&this[_0xf604[1205]](tag)){var block=this[_0xf604[562]]();if(block[_0xf604[382]]==tag){return finalnodes[_0xf604[15]](block);} else {return [];} ;} else {finalnodes[_0xf604[15]](this[_0xf604[561]]());} ;} ;var last=finalnodes[finalnodes[_0xf604[20]]-1];if(this[_0xf604[916]](last)){finalnodes=finalnodes[_0xf604[9]](0,-1);} ;return finalnodes;} ,getElement:function (node){if(!node){node=this[_0xf604[561]]();} ;while(node){if(node[_0xf604[591]]==1){if($(node)[_0xf604[515]](_0xf604[338])){return false;} ;return node;} ;node=node[_0xf604[624]];} ;return false;} ,getRangeSelectedNodes:function (range){range=range||this[_0xf604[587]]();var node=range[_0xf604[1073]];var endNode=range[_0xf604[1074]];if(node==endNode){return [node];} ;var rangeNodes=[];while(node&&node!=endNode){rangeNodes[_0xf604[15]](node=this[_0xf604[1207]](node));} ;node=range[_0xf604[1073]];while(node&&node!=range[_0xf604[1208]]){rangeNodes[_0xf604[906]](node);node=node[_0xf604[624]];} ;return rangeNodes;} ,nextNode:function (node){if(node[_0xf604[1209]]()){return node[_0xf604[882]];} else {while(node&&!node[_0xf604[1210]]){node=node[_0xf604[624]];} ;if(!node){return null;} ;return node[_0xf604[1210]];} ;} ,getSelectionText:function (){return this[_0xf604[565]]().toString();} ,getSelectionHtml:function (){var html=_0xf604[340];var sel=this[_0xf604[565]]();if(sel[_0xf604[589]]){var container=this[_0xf604[216]][_0xf604[593]](_0xf604[114]);var len=sel[_0xf604[589]];for(var i=0;i<len;++i){container[_0xf604[881]](sel[_0xf604[878]](i)[_0xf604[1211]]());} ;html=container[_0xf604[879]];} ;return this[_0xf604[391]](html);} ,selectionSave:function (){if(!this[_0xf604[854]]()){this[_0xf604[845]]();} ;if(!this[_0xf604[25]][_0xf604[1195]]){this[_0xf604[1212]](this[_0xf604[587]]());} else {this[_0xf604[218]]=rangy[_0xf604[1213]]();} ;} ,selectionCreateMarker:function (range,remove){if(!range){return ;} ;var node1=$(_0xf604[1214]+this[_0xf604[25]][_0xf604[605]]+_0xf604[428],this[_0xf604[216]])[0];var node2=$(_0xf604[1215]+this[_0xf604[25]][_0xf604[605]]+_0xf604[428],this[_0xf604[216]])[0];if(range[_0xf604[588]]===true){this[_0xf604[1216]](range,node1,true);} else {this[_0xf604[1216]](range,node1,true);this[_0xf604[1216]](range,node2,false);} ;this[_0xf604[218]]=this[_0xf604[333]][_0xf604[50]]();this[_0xf604[547]](false,false);} ,selectionSetMarker:function (range,node,type){var boundaryRange=range[_0xf604[883]]();try{boundaryRange[_0xf604[752]](type);boundaryRange[_0xf604[594]](node);boundaryRange[_0xf604[1217]]();} catch(e){var html=this[_0xf604[25]][_0xf604[676]];if(this[_0xf604[25]][_0xf604[212]]){html=_0xf604[395];} ;this[_0xf604[333]][_0xf604[788]](html);this[_0xf604[489]]();} ;} ,selectionRestore:function (replace,remove){if(!this[_0xf604[25]][_0xf604[1195]]){if(replace===true&&this[_0xf604[218]]){this[_0xf604[333]][_0xf604[50]](this[_0xf604[218]]);} ;var node1=this[_0xf604[333]][_0xf604[374]](_0xf604[1067]);var node2=this[_0xf604[333]][_0xf604[374]](_0xf604[1218]);if(this[_0xf604[246]](_0xf604[470])){this[_0xf604[333]][_0xf604[489]]();} else {if(!this[_0xf604[854]]()){this[_0xf604[845]]();} ;} ;if(node1[_0xf604[20]]!=0&&node2[_0xf604[20]]!=0){this[_0xf604[1197]](node1[0],0,node2[0],0);} else {if(node1[_0xf604[20]]!=0){this[_0xf604[1197]](node1[0],0,null,0);} ;} ;if(remove!==false){this[_0xf604[1109]]();this[_0xf604[218]]=false;} ;} else {rangy[_0xf604[1219]](this[_0xf604[218]]);} ;} ,selectionRemoveMarkers:function (type){if(!this[_0xf604[25]][_0xf604[1195]]){$[_0xf604[19]](this[_0xf604[333]][_0xf604[374]](_0xf604[1220]),function (){var html=$[_0xf604[394]]($(this)[_0xf604[50]]()[_0xf604[352]](/[^\u0000-\u1C7F]/g,_0xf604[340]));if(html==_0xf604[340]){$(this)[_0xf604[331]]();} else {$(this)[_0xf604[335]](_0xf604[1070])[_0xf604[335]](_0xf604[459]);} ;} );} else {rangy[_0xf604[1221]](this[_0xf604[218]]);} ;} ,tableShow:function (){this[_0xf604[542]]();this[_0xf604[1226]](this[_0xf604[25]][_0xf604[250]][_0xf604[53]],this[_0xf604[25]][_0xf604[1222]],300,$[_0xf604[485]](function (){$(_0xf604[1224])[_0xf604[832]]($[_0xf604[485]](this[_0xf604[1223]],this));setTimeout(function (){$(_0xf604[1225])[_0xf604[489]]();} ,200);} ,this));} ,tableInsert:function (){this[_0xf604[529]](false);var rows=$(_0xf604[1225])[_0xf604[332]](),columns=$(_0xf604[1227])[_0xf604[332]](),$table_box=$(_0xf604[1228]),tableId=Math[_0xf604[1230]](Math[_0xf604[1229]]()*99999),$table=$(_0xf604[1231]+tableId+_0xf604[1232]),i,$row,z,$column;for(i=0;i<rows;i++){$row=$(_0xf604[969]);for(z=0;z<columns;z++){$column=$(_0xf604[914]+this[_0xf604[25]][_0xf604[605]]+_0xf604[1233]);if(i===0&&z===0){$column[_0xf604[453]](_0xf604[912]+this[_0xf604[25]][_0xf604[605]]+_0xf604[428]);} ;$($row)[_0xf604[453]]($column);} ;$table[_0xf604[453]]($row);} ;$table_box[_0xf604[453]]($table);var html=$table_box[_0xf604[50]]();if(this[_0xf604[25]][_0xf604[212]]===false&&this[_0xf604[246]](_0xf604[470])){html+=_0xf604[604]+this[_0xf604[25]][_0xf604[605]]+_0xf604[606];} ;this[_0xf604[1234]]();this[_0xf604[547]]();var current=this[_0xf604[562]]()||this[_0xf604[561]]();if(current&&current[_0xf604[382]]!=_0xf604[628]){if(current[_0xf604[382]]==_0xf604[126]){var current=$(current)[_0xf604[603]](_0xf604[918]);} ;$(current)[_0xf604[329]](html);} else {this[_0xf604[1093]](html,false);} ;this[_0xf604[547]]();var table=this[_0xf604[333]][_0xf604[374]](_0xf604[1235]+tableId);this[_0xf604[798]]();table[_0xf604[374]](_0xf604[1236])[_0xf604[331]]();table[_0xf604[335]](_0xf604[459]);this[_0xf604[366]]();} ,tableDeleteTable:function (){var $table=$(this[_0xf604[560]]())[_0xf604[603]](_0xf604[53]);if(!this[_0xf604[902]]($table)){return false;} ;if($table[_0xf604[516]]()==0){return false;} ;this[_0xf604[529]]();$table[_0xf604[331]]();this[_0xf604[366]]();} ,tableDeleteRow:function (){var parent=this[_0xf604[560]]();var $table=$(parent)[_0xf604[603]](_0xf604[53]);if(!this[_0xf604[902]]($table)){return false;} ;if($table[_0xf604[516]]()==0){return false;} ;this[_0xf604[529]]();var $current_tr=$(parent)[_0xf604[603]](_0xf604[124]);var $focus_tr=$current_tr[_0xf604[627]]()[_0xf604[20]]?$current_tr[_0xf604[627]]():$current_tr[_0xf604[601]]();if($focus_tr[_0xf604[20]]){var $focus_td=$focus_tr[_0xf604[346]](_0xf604[122])[_0xf604[1237]]();if($focus_td[_0xf604[20]]){$focus_td[_0xf604[788]](_0xf604[912]+this[_0xf604[25]][_0xf604[605]]+_0xf604[428]);} ;} ;$current_tr[_0xf604[331]]();this[_0xf604[547]]();$table[_0xf604[374]](_0xf604[1067])[_0xf604[331]]();this[_0xf604[366]]();} ,tableDeleteColumn:function (){var parent=this[_0xf604[560]]();var $table=$(parent)[_0xf604[603]](_0xf604[53]);if(!this[_0xf604[902]]($table)){return false;} ;if($table[_0xf604[516]]()==0){return false;} ;this[_0xf604[529]]();var $current_td=$(parent)[_0xf604[603]](_0xf604[122]);if(!($current_td[_0xf604[1092]](_0xf604[122]))){$current_td=$current_td[_0xf604[603]](_0xf604[122]);} ;var index=$current_td[_0xf604[327]](0)[_0xf604[1238]];$table[_0xf604[374]](_0xf604[124])[_0xf604[19]]($[_0xf604[485]](function (i,elem){var focusIndex=index-1<0?index+1:index-1;if(i===0){$(elem)[_0xf604[374]](_0xf604[122])[_0xf604[1239]](focusIndex)[_0xf604[788]](_0xf604[912]+this[_0xf604[25]][_0xf604[605]]+_0xf604[428]);} ;$(elem)[_0xf604[374]](_0xf604[122])[_0xf604[1239]](index)[_0xf604[331]]();} ,this));this[_0xf604[547]]();$table[_0xf604[374]](_0xf604[1067])[_0xf604[331]]();this[_0xf604[366]]();} ,tableAddHead:function (){var $table=$(this[_0xf604[560]]())[_0xf604[603]](_0xf604[53]);if(!this[_0xf604[902]]($table)){return false;} ;if($table[_0xf604[516]]()==0){return false;} ;this[_0xf604[529]]();if($table[_0xf604[374]](_0xf604[108])[_0xf604[516]]()!==0){this[_0xf604[302]]();} else {var tr=$table[_0xf604[374]](_0xf604[124])[_0xf604[1237]]()[_0xf604[629]]();tr[_0xf604[374]](_0xf604[122])[_0xf604[50]](this[_0xf604[25]][_0xf604[605]]);$thead=$(_0xf604[1240]);$thead[_0xf604[453]](tr);$table[_0xf604[788]]($thead);this[_0xf604[366]]();} ;} ,tableDeleteHead:function (){var $table=$(this[_0xf604[560]]())[_0xf604[603]](_0xf604[53]);if(!this[_0xf604[902]]($table)){return false;} ;var $thead=$table[_0xf604[374]](_0xf604[108]);if($thead[_0xf604[516]]()==0){return false;} ;this[_0xf604[529]]();$thead[_0xf604[331]]();this[_0xf604[366]]();} ,tableAddRowAbove:function (){this[_0xf604[1241]](_0xf604[869]);} ,tableAddRowBelow:function (){this[_0xf604[1241]](_0xf604[329]);} ,tableAddColumnLeft:function (){this[_0xf604[1242]](_0xf604[869]);} ,tableAddColumnRight:function (){this[_0xf604[1242]](_0xf604[329]);} ,tableAddRow:function (type){var $table=$(this[_0xf604[560]]())[_0xf604[603]](_0xf604[53]);if(!this[_0xf604[902]]($table)){return false;} ;if($table[_0xf604[516]]()==0){return false;} ;this[_0xf604[529]]();var $current_tr=$(this[_0xf604[560]]())[_0xf604[603]](_0xf604[124]);var new_tr=$current_tr[_0xf604[629]]();new_tr[_0xf604[374]](_0xf604[122])[_0xf604[50]](this[_0xf604[25]][_0xf604[605]]);if(type===_0xf604[329]){$current_tr[_0xf604[329]](new_tr);} else {$current_tr[_0xf604[869]](new_tr);} ;this[_0xf604[366]]();} ,tableAddColumn:function (type){var parent=this[_0xf604[560]]();var $table=$(parent)[_0xf604[603]](_0xf604[53]);if(!this[_0xf604[902]]($table)){return false;} ;if($table[_0xf604[516]]()==0){return false;} ;this[_0xf604[529]]();var index=0;var current=this[_0xf604[561]]();var $current_tr=$(current)[_0xf604[603]](_0xf604[124]);var $current_td=$(current)[_0xf604[603]](_0xf604[122]);$current_tr[_0xf604[374]](_0xf604[122])[_0xf604[19]]($[_0xf604[485]](function (i,elem){if($(elem)[0]===$current_td[0]){index=i;} ;} ,this));$table[_0xf604[374]](_0xf604[124])[_0xf604[19]]($[_0xf604[485]](function (i,elem){var $current=$(elem)[_0xf604[374]](_0xf604[122])[_0xf604[1239]](index);var td=$current[_0xf604[629]]();td[_0xf604[50]](this[_0xf604[25]][_0xf604[605]]);type===_0xf604[329]?$current[_0xf604[329]](td):$current[_0xf604[869]](td);} ,this));this[_0xf604[366]]();} ,videoShow:function (){this[_0xf604[542]]();this[_0xf604[1226]](this[_0xf604[25]][_0xf604[250]][_0xf604[52]],this[_0xf604[25]][_0xf604[1243]],600,$[_0xf604[485]](function (){$(_0xf604[1245])[_0xf604[832]]($[_0xf604[485]](this[_0xf604[1244]],this));setTimeout(function (){$(_0xf604[1246])[_0xf604[489]]();} ,200);} ,this));} ,videoInsert:function (){var data=$(_0xf604[1246])[_0xf604[332]]();data=this[_0xf604[357]](data);var iframeStart=_0xf604[1247],iframeEnd=_0xf604[1248];if(data[_0xf604[376]](reUrlYoutube)){data=data[_0xf604[352]](reUrlYoutube,iframeStart+_0xf604[1249]+iframeEnd);} else {if(data[_0xf604[376]](reUrlVimeo)){data=data[_0xf604[352]](reUrlVimeo,iframeStart+_0xf604[1250]+iframeEnd);} ;} ;this[_0xf604[547]]();var current=this[_0xf604[562]]()||this[_0xf604[561]]();if(current){$(current)[_0xf604[329]](data);} else {this[_0xf604[1093]](data,false);} ;this[_0xf604[366]]();this[_0xf604[1234]]();} ,linkShow:function (){this[_0xf604[542]]();var callback=$[_0xf604[485]](function (){if(this[_0xf604[25]][_0xf604[1251]]!==false){this[_0xf604[1252]]={};var that=this;$[_0xf604[1258]](this[_0xf604[25]][_0xf604[1251]],function (data){var $select=$(_0xf604[1253]);$select[_0xf604[50]](_0xf604[340]);$[_0xf604[19]](data,function (key,val){that[_0xf604[1252]][key]=val;$select[_0xf604[453]]($(_0xf604[1254])[_0xf604[332]](key)[_0xf604[50]](val[_0xf604[458]]));} );$select[_0xf604[497]](_0xf604[406],function (){var key=$(this)[_0xf604[332]]();var name=_0xf604[340],url=_0xf604[340];if(key!=0){name=that[_0xf604[1252]][key][_0xf604[458]];url=that[_0xf604[1252]][key][_0xf604[1255]];} ;$(_0xf604[1256])[_0xf604[332]](url);$(_0xf604[1257])[_0xf604[332]](name);} );$select[_0xf604[258]]();} );} ;this[_0xf604[1259]]=false;var sel=this[_0xf604[565]]();var url=_0xf604[340],text=_0xf604[340],target=_0xf604[340];var elem=this[_0xf604[560]]();var par=$(elem)[_0xf604[577]]()[_0xf604[327]](0);if(par&&par[_0xf604[382]]===_0xf604[872]){elem=par;} ;if(elem&&elem[_0xf604[382]]===_0xf604[872]){url=elem[_0xf604[1187]];text=$(elem)[_0xf604[600]]();target=elem[_0xf604[511]];this[_0xf604[1259]]=elem;} else {text=sel.toString();} ;$(_0xf604[1257])[_0xf604[332]](text);var thref=self[_0xf604[1260]][_0xf604[1187]][_0xf604[352]](/\/$/i,_0xf604[340]);url=url[_0xf604[352]](thref,_0xf604[340]);url=url[_0xf604[352]](/^\/#/,_0xf604[734]);url=url[_0xf604[352]](_0xf604[1261],_0xf604[340]);if(this[_0xf604[25]][_0xf604[639]]===false){var re= new RegExp(_0xf604[1262]+self[_0xf604[1260]][_0xf604[1263]],_0xf604[236]);url=url[_0xf604[352]](re,_0xf604[340]);} ;$(_0xf604[1256])[_0xf604[332]](url);if(target===_0xf604[1264]){$(_0xf604[1267])[_0xf604[1266]](_0xf604[1265],true);} ;this[_0xf604[1268]]=false;$(_0xf604[1270])[_0xf604[497]](_0xf604[832],$[_0xf604[485]](this[_0xf604[1269]],this));setTimeout(function (){$(_0xf604[1256])[_0xf604[489]]();} ,200);} ,this);this[_0xf604[1226]](this[_0xf604[25]][_0xf604[250]][_0xf604[54]],this[_0xf604[25]][_0xf604[1271]],460,callback);} ,linkProcess:function (){if(this[_0xf604[1268]]){return ;} ;this[_0xf604[1268]]=true;var target=_0xf604[340],targetBlank=_0xf604[340];var link=$(_0xf604[1256])[_0xf604[332]]();var text=$(_0xf604[1257])[_0xf604[332]]();if(link[_0xf604[618]](_0xf604[733])!=-1&&/(http|ftp|https):\/\//i[_0xf604[608]](link)===false){link=_0xf604[1261]+link;} else {if(link[_0xf604[618]](_0xf604[734])!=0){if($(_0xf604[1267])[_0xf604[1266]](_0xf604[1265])){target=_0xf604[1272];targetBlank=_0xf604[1264];} ;var pattern=_0xf604[1273];var re= new RegExp(_0xf604[1262]+pattern,_0xf604[236]);var re2= new RegExp(_0xf604[736]+pattern,_0xf604[236]);if(link[_0xf604[618]](re)==-1&&link[_0xf604[618]](re2)==0&&this[_0xf604[25]][_0xf604[639]]){link=this[_0xf604[25]][_0xf604[639]]+link;} ;} ;} ;text=text[_0xf604[352]](/<|>/g,_0xf604[340]);var extra=_0xf604[1122];if(this[_0xf604[246]](_0xf604[470])){extra=_0xf604[1122];} ;this[_0xf604[1274]](_0xf604[1189]+link+_0xf604[741]+target+_0xf604[742]+text+_0xf604[831]+extra,$[_0xf604[394]](text),link,targetBlank);} ,linkInsert:function (a,text,link,target){this[_0xf604[547]]();if(text!==_0xf604[340]){if(this[_0xf604[1259]]){this[_0xf604[529]]();$(this[_0xf604[1259]])[_0xf604[600]](text)[_0xf604[350]](_0xf604[1187],link);if(target!==_0xf604[340]){$(this[_0xf604[1259]])[_0xf604[350]](_0xf604[511],target);} else {$(this[_0xf604[1259]])[_0xf604[335]](_0xf604[511]);} ;} else {var $a=$(a)[_0xf604[464]](_0xf604[1275]);this[_0xf604[834]](_0xf604[886],this[_0xf604[348]]($a),false);var link=this[_0xf604[333]][_0xf604[374]](_0xf604[1276]);link[_0xf604[335]](_0xf604[76])[_0xf604[337]](_0xf604[1275])[_0xf604[19]](function (){if(this[_0xf604[462]]==_0xf604[340]){$(this)[_0xf604[335]](_0xf604[1070]);} ;} );} ;this[_0xf604[366]]();} ;setTimeout($[_0xf604[485]](function (){if(this[_0xf604[25]][_0xf604[643]]){this[_0xf604[643]]();} ;} ,this),5);this[_0xf604[1234]]();} ,fileShow:function (){this[_0xf604[542]]();var callback=$[_0xf604[485]](function (){var sel=this[_0xf604[565]]();var text=_0xf604[340];if(this[_0xf604[933]]()){text=sel[_0xf604[600]];} else {text=sel.toString();} ;$(_0xf604[1277])[_0xf604[332]](text);if(!this[_0xf604[442]]()&&!this[_0xf604[1278]]()){this[_0xf604[1283]](_0xf604[1279],{url:this[_0xf604[25]][_0xf604[789]],uploadFields:this[_0xf604[25]][_0xf604[1165]],success:$[_0xf604[485]](this[_0xf604[1280]],this),error:$[_0xf604[485]](function (obj,json){this[_0xf604[403]](_0xf604[1281],json);} ,this),uploadParam:this[_0xf604[25]][_0xf604[1282]]});} ;this[_0xf604[1285]](_0xf604[1284],{auto:true,url:this[_0xf604[25]][_0xf604[789]],success:$[_0xf604[485]](this[_0xf604[1280]],this),error:$[_0xf604[485]](function (obj,json){this[_0xf604[403]](_0xf604[1281],json);} ,this)});} ,this);this[_0xf604[1226]](this[_0xf604[25]][_0xf604[250]][_0xf604[38]],this[_0xf604[25]][_0xf604[1286]],500,callback);} ,fileCallback:function (json){this[_0xf604[547]]();if(json!==false){var text=$(_0xf604[1277])[_0xf604[332]]();if(text===_0xf604[340]){text=json[_0xf604[1287]];} ;var link=_0xf604[1189]+json[_0xf604[1171]]+_0xf604[1288]+text+_0xf604[831];if(this[_0xf604[246]](_0xf604[534])&&!!this[_0xf604[217]][_0xf604[1289]]){link=link+_0xf604[1122];} ;this[_0xf604[487]](_0xf604[886],link,false);var linkmarker=$(this[_0xf604[333]][_0xf604[374]](_0xf604[1290]));if(linkmarker[_0xf604[516]]()!=0){linkmarker[_0xf604[335]](_0xf604[459]);} else {linkmarker=false;} ;this[_0xf604[366]]();this[_0xf604[403]](_0xf604[789],linkmarker,json);} ;this[_0xf604[1234]]();} ,imageShow:function (){this[_0xf604[542]]();var callback=$[_0xf604[485]](function (){if(this[_0xf604[25]][_0xf604[1291]]){$[_0xf604[1258]](this[_0xf604[25]][_0xf604[1291]],$[_0xf604[485]](function (data){var folders={},count=0;$[_0xf604[19]](data,$[_0xf604[485]](function (key,val){if( typeof val[_0xf604[1292]]!==_0xf604[12]){count++;folders[val[_0xf604[1292]]]=count;} ;} ,this));var folderclass=false;$[_0xf604[19]](data,$[_0xf604[485]](function (key,val){var thumbtitle=_0xf604[340];if( typeof val[_0xf604[830]]!==_0xf604[12]){thumbtitle=val[_0xf604[830]];} ;var folderkey=0;if(!$[_0xf604[1293]](folders)&& typeof val[_0xf604[1292]]!==_0xf604[12]){folderkey=folders[val[_0xf604[1292]]];if(folderclass===false){folderclass=_0xf604[1294]+folderkey;} ;} ;var img=$(_0xf604[1174]+val[_0xf604[1295]]+_0xf604[1296]+folderkey+_0xf604[1297]+val[_0xf604[51]]+_0xf604[1298]+thumbtitle+_0xf604[658]);$(_0xf604[1299])[_0xf604[453]](img);$(img)[_0xf604[832]]($[_0xf604[485]](this[_0xf604[1300]],this));} ,this));if(!$[_0xf604[1293]](folders)){$(_0xf604[1294])[_0xf604[451]]();$(folderclass)[_0xf604[258]]();var onchangeFunc=function (e){$(_0xf604[1294])[_0xf604[451]]();$(_0xf604[1294]+$(e[_0xf604[511]])[_0xf604[332]]())[_0xf604[258]]();} ;var select=$(_0xf604[1301]);$[_0xf604[19]](folders,function (k,v){select[_0xf604[453]]($(_0xf604[1302]+v+_0xf604[829]+k+_0xf604[1303]));} );$(_0xf604[1299])[_0xf604[869]](select);select[_0xf604[406]](onchangeFunc);} ;} ,this));} else {$(_0xf604[1304])[_0xf604[331]]();} ;if(this[_0xf604[25]][_0xf604[493]]||this[_0xf604[25]][_0xf604[494]]){if(!this[_0xf604[442]]()&&!this[_0xf604[1278]]()&&this[_0xf604[25]][_0xf604[494]]===false){if($(_0xf604[1279])[_0xf604[20]]){this[_0xf604[1283]](_0xf604[1279],{url:this[_0xf604[25]][_0xf604[493]],uploadFields:this[_0xf604[25]][_0xf604[1165]],success:$[_0xf604[485]](this[_0xf604[1305]],this),error:$[_0xf604[485]](function (obj,json){this[_0xf604[403]](_0xf604[1306],json);} ,this),uploadParam:this[_0xf604[25]][_0xf604[531]]});} ;} ;if(this[_0xf604[25]][_0xf604[494]]===false){this[_0xf604[1285]](_0xf604[1284],{auto:true,url:this[_0xf604[25]][_0xf604[493]],success:$[_0xf604[485]](this[_0xf604[1305]],this),error:$[_0xf604[485]](function (obj,json){this[_0xf604[403]](_0xf604[1306],json);} ,this)});} else {$(_0xf604[1279])[_0xf604[497]](_0xf604[1307],$[_0xf604[485]](this[_0xf604[1308]],this));} ;} else {$(_0xf604[1309])[_0xf604[451]]();if(!this[_0xf604[25]][_0xf604[1291]]){$(_0xf604[1310])[_0xf604[331]]();$(_0xf604[1311])[_0xf604[258]]();} else {$(_0xf604[1312])[_0xf604[331]]();$(_0xf604[1304])[_0xf604[464]](_0xf604[1313]);$(_0xf604[1314])[_0xf604[258]]();} ;} ;if(!this[_0xf604[25]][_0xf604[1315]]&&(this[_0xf604[25]][_0xf604[493]]||this[_0xf604[25]][_0xf604[1291]])){$(_0xf604[1316])[_0xf604[451]]();} ;$(_0xf604[1318])[_0xf604[832]]($[_0xf604[485]](this[_0xf604[1317]],this));if(!this[_0xf604[25]][_0xf604[493]]&&!this[_0xf604[25]][_0xf604[1291]]){setTimeout(function (){$(_0xf604[1319])[_0xf604[489]]();} ,200);} ;} ,this);this[_0xf604[1226]](this[_0xf604[25]][_0xf604[250]][_0xf604[51]],this[_0xf604[25]][_0xf604[1320]],610,callback);} ,imageEdit:function (image){var $el=image;var parent=$el[_0xf604[577]]()[_0xf604[577]]();var callback=$[_0xf604[485]](function (){$(_0xf604[1321])[_0xf604[332]]($el[_0xf604[350]](_0xf604[684]));$(_0xf604[1322])[_0xf604[350]](_0xf604[1187],$el[_0xf604[350]](_0xf604[368]));if($el[_0xf604[207]](_0xf604[1323])==_0xf604[1324]&&$el[_0xf604[207]](_0xf604[1325])==_0xf604[1326]){$(_0xf604[1327])[_0xf604[332]](_0xf604[930]);} else {$(_0xf604[1327])[_0xf604[332]]($el[_0xf604[207]](_0xf604[1325]));} ;if($(parent)[_0xf604[327]](0)[_0xf604[382]]===_0xf604[872]){$(_0xf604[1319])[_0xf604[332]]($(parent)[_0xf604[350]](_0xf604[1187]));if($(parent)[_0xf604[350]](_0xf604[511])==_0xf604[1264]){$(_0xf604[1267])[_0xf604[1266]](_0xf604[1265],true);} ;} ;$(_0xf604[1329])[_0xf604[832]]($[_0xf604[485]](function (){this[_0xf604[1328]]($el);} ,this));$(_0xf604[1331])[_0xf604[832]]($[_0xf604[485]](function (){this[_0xf604[1330]]($el);} ,this));} ,this);this[_0xf604[1226]](this[_0xf604[25]][_0xf604[250]][_0xf604[1192]],this[_0xf604[25]][_0xf604[1332]],380,callback);} ,imageRemove:function (el){var parentLink=$(el)[_0xf604[577]]()[_0xf604[577]]();var parent=$(el)[_0xf604[577]]();var parentEl=false;if(parentLink[_0xf604[20]]&&parentLink[0][_0xf604[382]]===_0xf604[872]){parentEl=true;$(parentLink)[_0xf604[331]]();} else {if(parent[_0xf604[20]]&&parent[0][_0xf604[382]]===_0xf604[872]){parentEl=true;$(parent)[_0xf604[331]]();} else {$(el)[_0xf604[331]]();} ;} ;if(parent[_0xf604[20]]&&parent[0][_0xf604[382]]===_0xf604[82]){this[_0xf604[845]]();if(parentEl===false){this[_0xf604[607]](parent);} ;} ;this[_0xf604[403]](_0xf604[1333],el);this[_0xf604[1234]]();this[_0xf604[366]]();} ,imageSave:function (el){this[_0xf604[574]](false);var $el=$(el);var parent=$el[_0xf604[577]]();$el[_0xf604[350]](_0xf604[684],$(_0xf604[1321])[_0xf604[332]]());var floating=$(_0xf604[1327])[_0xf604[332]]();var margin=_0xf604[340];if(floating===_0xf604[569]){margin=_0xf604[1334]+this[_0xf604[25]][_0xf604[1335]]+_0xf604[744]+this[_0xf604[25]][_0xf604[1335]]+_0xf604[1336];$el[_0xf604[207]]({"\x66\x6C\x6F\x61\x74":_0xf604[569],margin:margin});} else {if(floating===_0xf604[572]){margin=_0xf604[1337]+this[_0xf604[25]][_0xf604[1335]]+_0xf604[744]+this[_0xf604[25]][_0xf604[1335]]+_0xf604[340];$el[_0xf604[207]]({"\x66\x6C\x6F\x61\x74":_0xf604[572],margin:margin});} else {if(floating===_0xf604[930]){$el[_0xf604[207]]({"\x66\x6C\x6F\x61\x74":_0xf604[340],display:_0xf604[1324],margin:_0xf604[550]});} else {$el[_0xf604[207]]({"\x66\x6C\x6F\x61\x74":_0xf604[340],display:_0xf604[340],margin:_0xf604[340]});} ;} ;} ;var link=$[_0xf604[394]]($(_0xf604[1319])[_0xf604[332]]());if(link!==_0xf604[340]){var target=false;if($(_0xf604[1267])[_0xf604[1266]](_0xf604[1265])){target=true;} ;if(parent[_0xf604[327]](0)[_0xf604[382]]!==_0xf604[872]){var a=$(_0xf604[1189]+link+_0xf604[829]+this[_0xf604[348]](el)+_0xf604[831]);if(target){a[_0xf604[350]](_0xf604[511],_0xf604[1264]);} ;$el[_0xf604[385]](a);} else {parent[_0xf604[350]](_0xf604[1187],link);if(target){parent[_0xf604[350]](_0xf604[511],_0xf604[1264]);} else {parent[_0xf604[335]](_0xf604[511]);} ;} ;} else {if(parent[_0xf604[327]](0)[_0xf604[382]]===_0xf604[872]){parent[_0xf604[385]](this[_0xf604[348]](el));} ;} ;this[_0xf604[1234]]();this[_0xf604[642]]();this[_0xf604[366]]();} ,imageResizeHide:function (e){if(e!==false&&$(e[_0xf604[511]])[_0xf604[577]]()[_0xf604[516]]()!=0&&$(e[_0xf604[511]])[_0xf604[577]]()[0][_0xf604[459]]===_0xf604[1338]){return false;} ;var imageBox=this[_0xf604[333]][_0xf604[374]](_0xf604[1339]);if(imageBox[_0xf604[516]]()==0){return false;} ;this[_0xf604[333]][_0xf604[374]](_0xf604[1340])[_0xf604[331]]();imageBox[_0xf604[374]](_0xf604[398])[_0xf604[207]]({marginTop:imageBox[0][_0xf604[76]][_0xf604[1341]],marginBottom:imageBox[0][_0xf604[76]][_0xf604[1342]],marginLeft:imageBox[0][_0xf604[76]][_0xf604[1343]],marginRight:imageBox[0][_0xf604[76]][_0xf604[1344]]});imageBox[_0xf604[207]](_0xf604[1345],_0xf604[340]);imageBox[_0xf604[374]](_0xf604[398])[_0xf604[207]](_0xf604[1346],_0xf604[340]);imageBox[_0xf604[385]](function (){return $(this)[_0xf604[347]]();} );$(document)[_0xf604[324]](_0xf604[1347]);this[_0xf604[333]][_0xf604[324]](_0xf604[1347]);this[_0xf604[333]][_0xf604[324]](_0xf604[1348]);this[_0xf604[366]]();} ,imageResize:function (image){var $image=$(image);$image[_0xf604[497]](_0xf604[512],$[_0xf604[485]](function (){this[_0xf604[574]](false);} ,this));$image[_0xf604[497]](_0xf604[1349],$[_0xf604[485]](function (){this[_0xf604[333]][_0xf604[497]](_0xf604[1350],$[_0xf604[485]](function (){setTimeout($[_0xf604[485]](function (){this[_0xf604[642]]();this[_0xf604[333]][_0xf604[324]](_0xf604[1350]);this[_0xf604[366]]();} ,this),1);} ,this));} ,this));$image[_0xf604[497]](_0xf604[832],$[_0xf604[485]](function (e){if(this[_0xf604[333]][_0xf604[374]](_0xf604[1339])[_0xf604[516]]()!=0){return false;} ;var clicked=false,start_x,start_y,ratio=$image[_0xf604[209]]()/$image[_0xf604[206]](),min_w=20,min_h=10;var imageResizer=this[_0xf604[1351]]($image);var isResizing=false;if(imageResizer!==false){imageResizer[_0xf604[497]](_0xf604[512],function (e){isResizing=true;e[_0xf604[525]]();ratio=$image[_0xf604[209]]()/$image[_0xf604[206]]();start_x=Math[_0xf604[1353]](e[_0xf604[1352]]-$image[_0xf604[1239]](0)[_0xf604[800]]()[_0xf604[569]]);start_y=Math[_0xf604[1353]](e[_0xf604[1354]]-$image[_0xf604[1239]](0)[_0xf604[800]]()[_0xf604[799]]);} );$(this[_0xf604[216]][_0xf604[73]])[_0xf604[497]](_0xf604[1355],$[_0xf604[485]](function (e){if(isResizing){var mouse_x=Math[_0xf604[1353]](e[_0xf604[1352]]-$image[_0xf604[1239]](0)[_0xf604[800]]()[_0xf604[569]])-start_x;var mouse_y=Math[_0xf604[1353]](e[_0xf604[1354]]-$image[_0xf604[1239]](0)[_0xf604[800]]()[_0xf604[799]])-start_y;var div_h=$image[_0xf604[206]]();var new_h=parseInt(div_h,10)+mouse_y;var new_w=Math[_0xf604[1353]](new_h*ratio);if(new_w>min_w){$image[_0xf604[209]](new_w);if(new_w<100){this[_0xf604[1360]][_0xf604[207]]({marginTop:_0xf604[1356],marginLeft:_0xf604[1357],fontSize:_0xf604[1358],padding:_0xf604[1359]});} else {this[_0xf604[1360]][_0xf604[207]]({marginTop:_0xf604[1361],marginLeft:_0xf604[1362],fontSize:_0xf604[1363],padding:_0xf604[1364]});} ;} ;start_x=Math[_0xf604[1353]](e[_0xf604[1352]]-$image[_0xf604[1239]](0)[_0xf604[800]]()[_0xf604[569]]);start_y=Math[_0xf604[1353]](e[_0xf604[1354]]-$image[_0xf604[1239]](0)[_0xf604[800]]()[_0xf604[799]]);this[_0xf604[366]]();} ;} ,this))[_0xf604[497]](_0xf604[812],function (){isResizing=false;} );} ;this[_0xf604[333]][_0xf604[497]](_0xf604[1348],$[_0xf604[485]](function (e){var key=e[_0xf604[407]];if(this[_0xf604[566]][_0xf604[615]]==key||this[_0xf604[566]][_0xf604[636]]==key){this[_0xf604[529]](false);this[_0xf604[574]](false);this[_0xf604[1328]]($image);} ;} ,this));$(document)[_0xf604[497]](_0xf604[1347],$[_0xf604[485]](this[_0xf604[574]],this));this[_0xf604[333]][_0xf604[497]](_0xf604[1347],$[_0xf604[485]](this[_0xf604[574]],this));} ,this));} ,imageResizeControls:function ($image){var imageBox=$(_0xf604[1365]);imageBox[_0xf604[207]]({position:_0xf604[810],display:_0xf604[1366],lineHeight:0,outline:_0xf604[1367],"\x66\x6C\x6F\x61\x74":$image[_0xf604[207]](_0xf604[1325])});imageBox[_0xf604[350]](_0xf604[334],false);if($image[0][_0xf604[76]][_0xf604[1345]]!=_0xf604[550]){imageBox[_0xf604[207]]({marginTop:$image[0][_0xf604[76]][_0xf604[1341]],marginBottom:$image[0][_0xf604[76]][_0xf604[1342]],marginLeft:$image[0][_0xf604[76]][_0xf604[1343]],marginRight:$image[0][_0xf604[76]][_0xf604[1344]]});$image[_0xf604[207]](_0xf604[1345],_0xf604[340]);} else {imageBox[_0xf604[207]]({display:_0xf604[1324],margin:_0xf604[550]});} ;$image[_0xf604[207]](_0xf604[1346],0.5)[_0xf604[329]](imageBox);this[_0xf604[1360]]=$(_0xf604[1368]+this[_0xf604[25]][_0xf604[250]][_0xf604[1192]]+_0xf604[428]);this[_0xf604[1360]][_0xf604[207]]({position:_0xf604[806],zIndex:5,top:_0xf604[1369],left:_0xf604[1369],marginTop:_0xf604[1361],marginLeft:_0xf604[1362],lineHeight:1,backgroundColor:_0xf604[1370],color:_0xf604[1371],fontSize:_0xf604[1363],padding:_0xf604[1364],cursor:_0xf604[1372]});this[_0xf604[1360]][_0xf604[350]](_0xf604[334],false);this[_0xf604[1360]][_0xf604[497]](_0xf604[832],$[_0xf604[485]](function (){this[_0xf604[1373]]($image);} ,this));imageBox[_0xf604[453]](this[_0xf604[1360]]);if(this[_0xf604[25]][_0xf604[1374]]){var imageResizer=$(_0xf604[1375]);imageResizer[_0xf604[207]]({position:_0xf604[806],zIndex:2,lineHeight:1,cursor:_0xf604[1376],bottom:_0xf604[1377],right:_0xf604[1378],border:_0xf604[1379],backgroundColor:_0xf604[1370],width:_0xf604[1380],height:_0xf604[1380]});imageResizer[_0xf604[350]](_0xf604[334],false);imageBox[_0xf604[453]](imageResizer);imageBox[_0xf604[453]]($image);return imageResizer;} else {imageBox[_0xf604[453]]($image);return false;} ;} ,imageThumbClick:function (e){var img=_0xf604[1381]+$(e[_0xf604[511]])[_0xf604[350]](_0xf604[1382])+_0xf604[1383]+$(e[_0xf604[511]])[_0xf604[350]](_0xf604[830])+_0xf604[658];var parent=this[_0xf604[560]]();if(this[_0xf604[25]][_0xf604[213]]&&$(parent)[_0xf604[603]](_0xf604[110])[_0xf604[516]]()==0){img=_0xf604[604]+img+_0xf604[606];} ;this[_0xf604[1384]](img,true);} ,imageCallbackLink:function (){var val=$(_0xf604[1319])[_0xf604[332]]();if(val!==_0xf604[340]){var data=_0xf604[1381]+val+_0xf604[658];if(this[_0xf604[25]][_0xf604[212]]===false){data=_0xf604[604]+data+_0xf604[606];} ;this[_0xf604[1384]](data,true);} else {this[_0xf604[1234]]();} ;} ,imageCallback:function (data){this[_0xf604[1384]](data);} ,imageInsert:function (json,link){this[_0xf604[547]]();if(json!==false){var html=_0xf604[340];if(link!==true){html=_0xf604[1381]+json[_0xf604[1171]]+_0xf604[658];var parent=this[_0xf604[560]]();if(this[_0xf604[25]][_0xf604[213]]&&$(parent)[_0xf604[603]](_0xf604[110])[_0xf604[516]]()==0){html=_0xf604[604]+html+_0xf604[606];} ;} else {html=json;} ;this[_0xf604[487]](_0xf604[886],html,false);var image=$(this[_0xf604[333]][_0xf604[374]](_0xf604[1385]));if(image[_0xf604[20]]){image[_0xf604[335]](_0xf604[459]);} else {image=false;} ;this[_0xf604[366]]();link!==true&&this[_0xf604[403]](_0xf604[493],image,json);} ;this[_0xf604[1234]]();this[_0xf604[642]]();} ,buildProgressBar:function (){if($(_0xf604[1386])[_0xf604[516]]()!=0){return ;} ;this[_0xf604[1387]]=$(_0xf604[1388]);$(document[_0xf604[73]])[_0xf604[453]](this.$progressBar);} ,showProgressBar:function (){this[_0xf604[1389]]();$(_0xf604[1386])[_0xf604[1390]]();} ,hideProgressBar:function (){$(_0xf604[1386])[_0xf604[822]](1500);} ,modalTemplatesInit:function (){$[_0xf604[202]](this[_0xf604[25]],{modal_file:String()+_0xf604[1391]+this[_0xf604[25]][_0xf604[250]][_0xf604[1287]]+_0xf604[1392]+this[_0xf604[25]][_0xf604[1282]]+_0xf604[1393],modal_image_edit:String()+_0xf604[1394]+this[_0xf604[25]][_0xf604[250]][_0xf604[830]]+_0xf604[1395]+this[_0xf604[25]][_0xf604[250]][_0xf604[54]]+_0xf604[1396]+this[_0xf604[25]][_0xf604[250]][_0xf604[1397]]+_0xf604[1398]+this[_0xf604[25]][_0xf604[250]][_0xf604[1399]]+_0xf604[1400]+this[_0xf604[25]][_0xf604[250]][_0xf604[1326]]+_0xf604[1401]+this[_0xf604[25]][_0xf604[250]][_0xf604[569]]+_0xf604[1402]+this[_0xf604[25]][_0xf604[250]][_0xf604[930]]+_0xf604[1403]+this[_0xf604[25]][_0xf604[250]][_0xf604[572]]+_0xf604[1404]+this[_0xf604[25]][_0xf604[250]][_0xf604[1405]]+_0xf604[1406]+this[_0xf604[25]][_0xf604[250]][_0xf604[1407]]+_0xf604[1408]+this[_0xf604[25]][_0xf604[250]][_0xf604[1409]]+_0xf604[1410],modal_image:String()+_0xf604[1411]+this[_0xf604[25]][_0xf604[250]][_0xf604[1412]]+_0xf604[1413]+this[_0xf604[25]][_0xf604[250]][_0xf604[1414]]+_0xf604[1415]+this[_0xf604[25]][_0xf604[250]][_0xf604[54]]+_0xf604[1416]+this[_0xf604[25]][_0xf604[531]]+_0xf604[1417]+this[_0xf604[25]][_0xf604[250]][_0xf604[1418]]+_0xf604[1419]+this[_0xf604[25]][_0xf604[250]][_0xf604[1407]]+_0xf604[1420]+this[_0xf604[25]][_0xf604[250]][_0xf604[695]]+_0xf604[1410],modal_link:String()+_0xf604[1421]+this[_0xf604[25]][_0xf604[250]][_0xf604[600]]+_0xf604[1422]+this[_0xf604[25]][_0xf604[250]][_0xf604[1397]]+_0xf604[1423]+this[_0xf604[25]][_0xf604[250]][_0xf604[1407]]+_0xf604[1424]+this[_0xf604[25]][_0xf604[250]][_0xf604[695]]+_0xf604[1410],modal_table:String()+_0xf604[1425]+this[_0xf604[25]][_0xf604[250]][_0xf604[1426]]+_0xf604[1427]+this[_0xf604[25]][_0xf604[250]][_0xf604[1428]]+_0xf604[1429]+this[_0xf604[25]][_0xf604[250]][_0xf604[1407]]+_0xf604[1430]+this[_0xf604[25]][_0xf604[250]][_0xf604[695]]+_0xf604[1410],modal_video:String()+_0xf604[1431]+this[_0xf604[25]][_0xf604[250]][_0xf604[1432]]+_0xf604[1433]+this[_0xf604[25]][_0xf604[250]][_0xf604[1407]]+_0xf604[1434]+this[_0xf604[25]][_0xf604[250]][_0xf604[695]]+_0xf604[1410]});} ,modalInit:function (title,content,width,callback){this[_0xf604[1435]]();this[_0xf604[1436]]=width;this[_0xf604[1437]]=$(_0xf604[1438]);if(!this[_0xf604[1437]][_0xf604[20]]){this[_0xf604[1437]]=$(_0xf604[1439]);this[_0xf604[1437]][_0xf604[453]]($(_0xf604[1440]));this[_0xf604[1437]][_0xf604[453]]($(_0xf604[1441]));this[_0xf604[1437]][_0xf604[453]]($(_0xf604[1442]));this[_0xf604[1437]][_0xf604[837]](document[_0xf604[73]]);} ;$(_0xf604[1443])[_0xf604[497]](_0xf604[832],$[_0xf604[485]](this[_0xf604[1234]],this));$(document)[_0xf604[638]]($[_0xf604[485]](this[_0xf604[1444]],this));this[_0xf604[333]][_0xf604[638]]($[_0xf604[485]](this[_0xf604[1444]],this));this[_0xf604[1445]](content);this[_0xf604[1446]](title);this[_0xf604[1447]]();this[_0xf604[1448]]();this[_0xf604[1449]]();this[_0xf604[1450]]();this[_0xf604[1451]]=this[_0xf604[216]][_0xf604[73]][_0xf604[545]];if(this[_0xf604[25]][_0xf604[445]]===false){this[_0xf604[1451]]=this[_0xf604[333]][_0xf604[545]]();} ;if(this[_0xf604[442]]()===false){this[_0xf604[1452]]();} else {this[_0xf604[1453]]();} ;if( typeof callback===_0xf604[1454]){callback();} ;setTimeout($[_0xf604[485]](function (){this[_0xf604[403]](_0xf604[1455],this.$redactorModal);} ,this),11);$(document)[_0xf604[324]](_0xf604[1456]);this[_0xf604[1437]][_0xf604[374]](_0xf604[1459])[_0xf604[497]](_0xf604[1457],$[_0xf604[485]](function (e){if(e[_0xf604[407]]===13){this[_0xf604[1437]][_0xf604[374]](_0xf604[1458])[_0xf604[832]]();e[_0xf604[525]]();} ;} ,this));return this[_0xf604[1437]];} ,modalShowOnDesktop:function (){this[_0xf604[1437]][_0xf604[207]]({position:_0xf604[804],top:_0xf604[1460],left:_0xf604[1369],width:this[_0xf604[1436]]+_0xf604[469],marginLeft:_0xf604[710]+(this[_0xf604[1436]]/2)+_0xf604[469]})[_0xf604[258]]();this[_0xf604[1461]]=$(document[_0xf604[73]])[_0xf604[207]](_0xf604[1462]);$(document[_0xf604[73]])[_0xf604[207]](_0xf604[1462],_0xf604[809]);setTimeout($[_0xf604[485]](function (){var height=this[_0xf604[1437]][_0xf604[1463]]();this[_0xf604[1437]][_0xf604[207]]({top:_0xf604[1369],height:_0xf604[550],minHeight:_0xf604[550],marginTop:_0xf604[710]+(height+10)/2+_0xf604[469]});} ,this),15);} ,modalShowOnMobile:function (){this[_0xf604[1437]][_0xf604[207]]({position:_0xf604[804],width:_0xf604[801],height:_0xf604[801],top:_0xf604[698],left:_0xf604[698],margin:_0xf604[698],minHeight:_0xf604[1464]})[_0xf604[258]]();} ,modalSetContent:function (content){this[_0xf604[1465]]=false;if(content[_0xf604[528]](_0xf604[734])==0){this[_0xf604[1465]]=$(content);$(_0xf604[1466])[_0xf604[907]]()[_0xf604[453]](this[_0xf604[1465]][_0xf604[50]]());this[_0xf604[1465]][_0xf604[50]](_0xf604[340]);} else {$(_0xf604[1466])[_0xf604[907]]()[_0xf604[453]](content);} ;} ,modalSetTitle:function (title){this[_0xf604[1437]][_0xf604[374]](_0xf604[1467])[_0xf604[50]](title);} ,modalSetButtonsWidth:function (){var buttons=this[_0xf604[1437]][_0xf604[374]](_0xf604[1469])[_0xf604[862]](_0xf604[1468]);var buttonsSize=buttons[_0xf604[516]]();if(buttonsSize>0){$(buttons)[_0xf604[207]](_0xf604[209],(this[_0xf604[1436]]/buttonsSize)+_0xf604[469]);} ;} ,modalOnCloseButton:function (){this[_0xf604[1437]][_0xf604[374]](_0xf604[1470])[_0xf604[497]](_0xf604[832],$[_0xf604[485]](this[_0xf604[1234]],this));} ,modalSetOverlay:function (){if(this[_0xf604[25]][_0xf604[1471]]){this[_0xf604[1472]]=$(_0xf604[1473]);if(!this[_0xf604[1472]][_0xf604[20]]){this[_0xf604[1472]]=$(_0xf604[1474]);$(_0xf604[73])[_0xf604[788]](this.$redactorModalOverlay);} ;this[_0xf604[1472]][_0xf604[258]]()[_0xf604[497]](_0xf604[832],$[_0xf604[485]](this[_0xf604[1234]],this));} ;} ,modalSetDraggable:function (){if( typeof $[_0xf604[7]][_0xf604[1475]]!==_0xf604[12]){this[_0xf604[1437]][_0xf604[1475]]({handle:_0xf604[1467]});this[_0xf604[1437]][_0xf604[374]](_0xf604[1467])[_0xf604[207]](_0xf604[1476],_0xf604[1477]);} ;} ,modalLoadTabs:function (){var $redactor_tabs=$(_0xf604[1310]);if(!$redactor_tabs[_0xf604[20]]){return false;} ;var that=this;$redactor_tabs[_0xf604[374]](_0xf604[792])[_0xf604[19]](function (i,s){i++;$(s)[_0xf604[497]](_0xf604[832],function (e){e[_0xf604[525]]();$redactor_tabs[_0xf604[374]](_0xf604[792])[_0xf604[337]](_0xf604[1313]);$(this)[_0xf604[464]](_0xf604[1313]);$(_0xf604[1309])[_0xf604[451]]();$(_0xf604[1478]+i)[_0xf604[258]]();$(_0xf604[1479])[_0xf604[332]](i);if(that[_0xf604[442]]()===false){var height=that[_0xf604[1437]][_0xf604[1463]]();that[_0xf604[1437]][_0xf604[207]](_0xf604[1480],_0xf604[710]+(height+10)/2+_0xf604[469]);} ;} );} );} ,modalCloseHandler:function (e){if(e[_0xf604[566]]===this[_0xf604[566]][_0xf604[821]]){this[_0xf604[1234]]();return false;} ;} ,modalClose:function (){$(_0xf604[1443])[_0xf604[324]](_0xf604[832],this[_0xf604[1234]]);$(_0xf604[1438])[_0xf604[822]](_0xf604[1481],$[_0xf604[485]](function (){var redactorModalInner=$(_0xf604[1466]);if(this[_0xf604[1465]]!==false){this[_0xf604[1465]][_0xf604[50]](redactorModalInner[_0xf604[50]]());this[_0xf604[1465]]=false;} ;redactorModalInner[_0xf604[50]](_0xf604[340]);if(this[_0xf604[25]][_0xf604[1471]]){$(_0xf604[1473])[_0xf604[451]]()[_0xf604[324]](_0xf604[832],this[_0xf604[1234]]);} ;$(document)[_0xf604[1483]](_0xf604[638],this[_0xf604[1482]]);this[_0xf604[333]][_0xf604[1483]](_0xf604[638],this[_0xf604[1482]]);this[_0xf604[547]]();if(this[_0xf604[25]][_0xf604[445]]&&this[_0xf604[1451]]){$(this[_0xf604[216]][_0xf604[73]])[_0xf604[545]](this[_0xf604[1451]]);} else {if(this[_0xf604[25]][_0xf604[445]]===false&&this[_0xf604[1451]]){this[_0xf604[333]][_0xf604[545]](this[_0xf604[1451]]);} ;} ;this[_0xf604[403]](_0xf604[1484]);} ,this));if(this[_0xf604[442]]()===false){$(document[_0xf604[73]])[_0xf604[207]](_0xf604[1462],this[_0xf604[1461]]?this[_0xf604[1461]]:_0xf604[808]);} ;return false;} ,modalSetTab:function (num){$(_0xf604[1309])[_0xf604[451]]();$(_0xf604[1310])[_0xf604[374]](_0xf604[792])[_0xf604[337]](_0xf604[1313])[_0xf604[1239]](num-1)[_0xf604[464]](_0xf604[1313]);$(_0xf604[1478]+num)[_0xf604[258]]();} ,s3handleFileSelect:function (e){var files=e[_0xf604[511]][_0xf604[524]];for(var i=0,f;f=files[i];i++){this[_0xf604[533]](f);} ;} ,s3uploadFile:function (file){this[_0xf604[1486]](file,$[_0xf604[485]](function (signedURL){this[_0xf604[1485]](file,signedURL);} ,this));} ,s3executeOnSignedUrl:function (file,callback){var xhr= new XMLHttpRequest();var mark=_0xf604[743];if(this[_0xf604[25]][_0xf604[494]][_0xf604[618]](/\?/)!=_0xf604[242]){mark=_0xf604[431];} ;xhr[_0xf604[371]](_0xf604[1487],this[_0xf604[25]][_0xf604[494]]+mark+_0xf604[769]+file[_0xf604[458]]+_0xf604[1488]+file[_0xf604[527]],true);if(xhr[_0xf604[1489]]){xhr[_0xf604[1489]](_0xf604[1490]);} ;var that=this;xhr[_0xf604[1491]]=function (e){if(this[_0xf604[1492]]==4&&this[_0xf604[1493]]==200){that[_0xf604[530]]();callback(decodeURIComponent(this[_0xf604[1494]]));} else {if(this[_0xf604[1492]]==4&&this[_0xf604[1493]]!=200){} ;} ;} ;xhr[_0xf604[1495]]();} ,s3createCORSRequest:function (method,url){var xhr= new XMLHttpRequest();if(_0xf604[1496] in xhr){xhr[_0xf604[371]](method,url,true);} else {if( typeof XDomainRequest!=_0xf604[12]){xhr= new XDomainRequest();xhr[_0xf604[371]](method,url);} else {xhr=null;} ;} ;return xhr;} ,s3uploadToS3:function (file,url){var xhr=this[_0xf604[1498]](_0xf604[1497],url);if(!xhr){} else {xhr[_0xf604[555]]=$[_0xf604[485]](function (){if(xhr[_0xf604[1493]]==200){this[_0xf604[1499]]();var s3image=url[_0xf604[461]](_0xf604[743]);if(!s3image[0]){return false;} ;this[_0xf604[547]]();var html=_0xf604[340];html=_0xf604[1381]+s3image[0]+_0xf604[658];if(this[_0xf604[25]][_0xf604[213]]){html=_0xf604[604]+html+_0xf604[606];} ;this[_0xf604[487]](_0xf604[886],html,false);var image=$(this[_0xf604[333]][_0xf604[374]](_0xf604[1385]));if(image[_0xf604[20]]){image[_0xf604[335]](_0xf604[459]);} else {image=false;} ;this[_0xf604[366]]();this[_0xf604[403]](_0xf604[493],image,false);this[_0xf604[1234]]();this[_0xf604[642]]();} else {} ;} ,this);xhr[_0xf604[1500]]=function (){} ;xhr[_0xf604[1412]][_0xf604[1501]]=function (e){} ;xhr[_0xf604[1503]](_0xf604[1502],file[_0xf604[527]]);xhr[_0xf604[1503]](_0xf604[1504],_0xf604[1505]);xhr[_0xf604[1495]](file);} ;} ,uploadInit:function (el,options){this[_0xf604[1506]]={url:false,success:false,error:false,start:false,trigger:false,auto:false,input:false};$[_0xf604[202]](this[_0xf604[1506]],options);var $el=$(_0xf604[734]+el);if($el[_0xf604[20]]&&$el[0][_0xf604[382]]===_0xf604[1507]){this[_0xf604[1506]][_0xf604[399]]=$el;this[_0xf604[1508]]=$($el[0][_0xf604[117]]);} else {this[_0xf604[1508]]=$el;} ;this[_0xf604[1509]]=this[_0xf604[1508]][_0xf604[350]](_0xf604[1510]);if(this[_0xf604[1506]][_0xf604[550]]){$(this[_0xf604[1506]][_0xf604[399]])[_0xf604[406]]($[_0xf604[485]](function (e){this[_0xf604[1508]][_0xf604[1511]](function (e){return false;} );this[_0xf604[1512]](e);} ,this));} else {if(this[_0xf604[1506]][_0xf604[1513]]){$(_0xf604[734]+this[_0xf604[1506]][_0xf604[1513]])[_0xf604[832]]($[_0xf604[485]](this[_0xf604[1512]],this));} ;} ;} ,uploadSubmit:function (e){this[_0xf604[530]]();this[_0xf604[1516]](this[_0xf604[1514]],this[_0xf604[1515]]());} ,uploadFrame:function (){this[_0xf604[459]]=_0xf604[1517]+Math[_0xf604[1230]](Math[_0xf604[1229]]()*99999);var d=this[_0xf604[216]][_0xf604[593]](_0xf604[114]);var iframe=_0xf604[1518]+this[_0xf604[459]]+_0xf604[1519]+this[_0xf604[459]]+_0xf604[1520];d[_0xf604[879]]=iframe;$(d)[_0xf604[837]](_0xf604[73]);if(this[_0xf604[1506]][_0xf604[203]]){this[_0xf604[1506]][_0xf604[203]]();} ;$(_0xf604[734]+this[_0xf604[459]])[_0xf604[648]]($[_0xf604[485]](this[_0xf604[1521]],this));return this[_0xf604[459]];} ,uploadForm:function (f,name){if(this[_0xf604[1506]][_0xf604[399]]){var formId=_0xf604[1522]+this[_0xf604[459]],fileId=_0xf604[1523]+this[_0xf604[459]];this[_0xf604[117]]=$(_0xf604[1524]+this[_0xf604[1506]][_0xf604[1255]]+_0xf604[1525]+name+_0xf604[1519]+formId+_0xf604[1526]+formId+_0xf604[1527]);if(this[_0xf604[25]][_0xf604[1165]]!==false&& typeof this[_0xf604[25]][_0xf604[1165]]===_0xf604[1166]){$[_0xf604[19]](this[_0xf604[25]][_0xf604[1165]],$[_0xf604[485]](function (k,v){if(v!=null&&v.toString()[_0xf604[528]](_0xf604[734])===0){v=$(v)[_0xf604[332]]();} ;var hidden=$(_0xf604[1528],{type:_0xf604[809],name:k,value:v});$(this[_0xf604[117]])[_0xf604[453]](hidden);} ,this));} ;var oldElement=this[_0xf604[1506]][_0xf604[399]];var newElement=$(oldElement)[_0xf604[629]]();$(oldElement)[_0xf604[350]](_0xf604[459],fileId)[_0xf604[869]](newElement)[_0xf604[837]](this[_0xf604[117]]);$(this[_0xf604[117]])[_0xf604[207]](_0xf604[817],_0xf604[806])[_0xf604[207]](_0xf604[799],_0xf604[1460])[_0xf604[207]](_0xf604[569],_0xf604[1460])[_0xf604[837]](_0xf604[73]);this[_0xf604[117]][_0xf604[1511]]();} else {f[_0xf604[350]](_0xf604[511],name)[_0xf604[350]](_0xf604[1531],_0xf604[1532])[_0xf604[350]](_0xf604[1529],_0xf604[1530])[_0xf604[350]](_0xf604[1510],this[_0xf604[1506]][_0xf604[1255]]);this[_0xf604[1514]][_0xf604[1511]]();} ;} ,uploadLoaded:function (){var i=$(_0xf604[734]+this[_0xf604[459]])[0],d;if(i[_0xf604[1533]]){d=i[_0xf604[1533]];} else {if(i[_0xf604[652]]){d=i[_0xf604[652]][_0xf604[216]];} else {d=window[_0xf604[1534]][this[_0xf604[459]]][_0xf604[216]];} ;} ;if(this[_0xf604[1506]][_0xf604[1535]]){this[_0xf604[1499]]();if( typeof d!==_0xf604[12]){var rawString=d[_0xf604[73]][_0xf604[879]];var jsonString=rawString[_0xf604[376]](/\{(.|\n)*\}/)[0];jsonString=jsonString[_0xf604[352]](/^\[/,_0xf604[340]);jsonString=jsonString[_0xf604[352]](/\]$/,_0xf604[340]);var json=$[_0xf604[770]](jsonString);if( typeof json[_0xf604[18]]==_0xf604[12]){this[_0xf604[1506]][_0xf604[1535]](json);} else {this[_0xf604[1506]][_0xf604[18]](this,json);this[_0xf604[1234]]();} ;} else {this[_0xf604[1234]]();alert(_0xf604[1536]);} ;} ;this[_0xf604[1508]][_0xf604[350]](_0xf604[1510],this[_0xf604[1509]]);this[_0xf604[1508]][_0xf604[350]](_0xf604[511],_0xf604[340]);} ,draguploadInit:function (el,options){this[_0xf604[1537]]=$[_0xf604[202]]({url:false,success:false,error:false,preview:false,uploadFields:false,text:this[_0xf604[25]][_0xf604[250]][_0xf604[1538]],atext:this[_0xf604[25]][_0xf604[250]][_0xf604[1539]],uploadParam:false},options);if(window[_0xf604[522]]===undefined){return false;} ;this[_0xf604[1540]]=$(_0xf604[1541]);this[_0xf604[1542]]=$(_0xf604[1543]+this[_0xf604[1537]][_0xf604[600]]+_0xf604[1544]);this[_0xf604[1545]]=$(_0xf604[1546]+this[_0xf604[1537]][_0xf604[1547]]+_0xf604[1544]);this[_0xf604[1540]][_0xf604[453]](this[_0xf604[1542]]);$(el)[_0xf604[869]](this[_0xf604[1540]]);$(el)[_0xf604[869]](this[_0xf604[1545]]);this[_0xf604[1542]][_0xf604[497]](_0xf604[1548],$[_0xf604[485]](function (){return this[_0xf604[1549]]();} ,this));this[_0xf604[1542]][_0xf604[497]](_0xf604[1550],$[_0xf604[485]](function (){return this[_0xf604[1551]]();} ,this));this[_0xf604[1542]][_0xf604[327]](0)[_0xf604[1552]]=$[_0xf604[485]](function (e){e[_0xf604[525]]();this[_0xf604[1542]][_0xf604[337]](_0xf604[1554])[_0xf604[464]](_0xf604[1553]);this[_0xf604[530]]();this[_0xf604[532]](this[_0xf604[1537]][_0xf604[1255]],e[_0xf604[523]][_0xf604[524]][0],false,e,this[_0xf604[1537]][_0xf604[1555]]);} ,this);} ,dragUploadAjax:function (url,file,directupload,e,uploadParam){if(!directupload){var xhr=$[_0xf604[1557]][_0xf604[1556]]();if(xhr[_0xf604[1412]]){xhr[_0xf604[1412]][_0xf604[1560]](_0xf604[1558],$[_0xf604[485]](this[_0xf604[1559]],this),false);} ;$[_0xf604[1561]]({xhr:function (){return xhr;} });} ;this[_0xf604[403]](_0xf604[1553],e);var fd= new FormData();if(uploadParam!==false){fd[_0xf604[453]](uploadParam,file);} else {fd[_0xf604[453]](_0xf604[38],file);} ;if(this[_0xf604[25]][_0xf604[1165]]!==false&& typeof this[_0xf604[25]][_0xf604[1165]]===_0xf604[1166]){$[_0xf604[19]](this[_0xf604[25]][_0xf604[1165]],$[_0xf604[485]](function (k,v){if(v!=null&&v.toString()[_0xf604[528]](_0xf604[734])===0){v=$(v)[_0xf604[332]]();} ;fd[_0xf604[453]](k,v);} ,this));} ;$[_0xf604[772]]({url:url,dataType:_0xf604[50],data:fd,cache:false,contentType:false,processData:false,type:_0xf604[1532],success:$[_0xf604[485]](function (data){data=data[_0xf604[352]](/^\[/,_0xf604[340]);data=data[_0xf604[352]](/\]$/,_0xf604[340]);var json=( typeof data===_0xf604[10]?$[_0xf604[770]](data):data);this[_0xf604[1499]]();if(directupload){var $img=$(_0xf604[1562]);$img[_0xf604[350]](_0xf604[368],json[_0xf604[1171]])[_0xf604[350]](_0xf604[459],_0xf604[1563]);this[_0xf604[1564]](e,$img[0]);var image=$(this[_0xf604[333]][_0xf604[374]](_0xf604[1565]));if(image[_0xf604[20]]){image[_0xf604[335]](_0xf604[459]);} else {image=false;} ;this[_0xf604[366]]();this[_0xf604[642]]();if(image){this[_0xf604[403]](_0xf604[493],image,json);} ;if( typeof json[_0xf604[18]]!==_0xf604[12]){this[_0xf604[403]](_0xf604[1306],json);} ;} else {if( typeof json[_0xf604[18]]==_0xf604[12]){this[_0xf604[1537]][_0xf604[1535]](json);} else {this[_0xf604[1537]][_0xf604[18]](this,json);this[_0xf604[1537]][_0xf604[1535]](false);} ;} ;} ,this)});} ,draguploadOndrag:function (){this[_0xf604[1542]][_0xf604[464]](_0xf604[1554]);return false;} ,draguploadOndragleave:function (){this[_0xf604[1542]][_0xf604[337]](_0xf604[1554]);return false;} ,uploadProgress:function (e,text){var percent=e[_0xf604[1566]]?parseInt(e[_0xf604[1566]]/e[_0xf604[1567]]*100,10):e;this[_0xf604[1542]][_0xf604[600]](_0xf604[1568]+percent+_0xf604[1569]+(text||_0xf604[340]));} ,isMobile:function (){return /(iPhone|iPod|BlackBerry|Android)/[_0xf604[608]](navigator[_0xf604[536]]);} ,isIPad:function (){return /iPad/[_0xf604[608]](navigator[_0xf604[536]]);} ,normalize:function (str){if( typeof (str)===_0xf604[12]){return 0;} ;return parseInt(str[_0xf604[352]](_0xf604[469],_0xf604[340]),10);} ,outerHtml:function (el){return $(_0xf604[1058])[_0xf604[453]]($(el)[_0xf604[1239]](0)[_0xf604[629]]())[_0xf604[50]]();} ,stripHtml:function (html){var tmp=document[_0xf604[593]](_0xf604[92]);tmp[_0xf604[879]]=html;return tmp[_0xf604[1113]]||tmp[_0xf604[1114]]||_0xf604[340];} ,isString:function (obj){return Object[_0xf604[5]][_0xf604[1570]][_0xf604[8]](obj)==_0xf604[1571];} ,isEmpty:function (html){html=html[_0xf604[352]](/&#x200b;|<br>|<br\/>|&nbsp;/gi,_0xf604[340]);html=html[_0xf604[352]](/\s/g,_0xf604[340]);html=html[_0xf604[352]](/^<p>[^\W\w\D\d]*?<\/p>$/i,_0xf604[340]);return html==_0xf604[340];} ,getInternetExplorerVersion:function (){var rv=false;if(navigator[_0xf604[1572]]==_0xf604[1573]){var ua=navigator[_0xf604[536]];var re= new RegExp(_0xf604[1574]);if(re[_0xf604[834]](ua)!=null){rv=parseFloat(RegExp.$1);} ;} ;return rv;} ,isIe11:function (){return !!navigator[_0xf604[536]][_0xf604[376]](/Trident\/7\./);} ,browser:function (browser){var ua=navigator[_0xf604[536]][_0xf604[745]]();var match=/(opr)[\/]([\w.]+)/[_0xf604[834]](ua)||/(chrome)[ \/]([\w.]+)/[_0xf604[834]](ua)||/(webkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/[_0xf604[834]](ua)||/(webkit)[ \/]([\w.]+)/[_0xf604[834]](ua)||/(opera)(?:.*version|)[ \/]([\w.]+)/[_0xf604[834]](ua)||/(msie) ([\w.]+)/[_0xf604[834]](ua)||ua[_0xf604[528]](_0xf604[1575])>=0&&/(rv)(?::| )([\w.]+)/[_0xf604[834]](ua)||ua[_0xf604[528]](_0xf604[1576])<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/[_0xf604[834]](ua)||[];if(browser==_0xf604[538]){return match[2];} ;if(browser==_0xf604[534]){return (match[1]==_0xf604[1289]||match[1]==_0xf604[534]);} ;if(match[1]==_0xf604[1577]){return browser==_0xf604[245];} ;if(match[1]==_0xf604[1578]){return browser==_0xf604[534];} ;return browser==match[1];} ,oldIE:function (){if(this[_0xf604[246]](_0xf604[245])&&parseInt(this[_0xf604[246]](_0xf604[538]),10)<9){return true;} ;return false;} ,getFragmentHtml:function (fragment){var cloned=fragment[_0xf604[1579]](true);var div=this[_0xf604[216]][_0xf604[593]](_0xf604[114]);div[_0xf604[881]](cloned);return div[_0xf604[879]];} ,extractContent:function (){var node=this[_0xf604[333]][0];var frag=this[_0xf604[216]][_0xf604[880]]();var child;while((child=node[_0xf604[882]])){frag[_0xf604[881]](child);} ;return frag;} ,isParentRedactor:function (el){if(!el){return false;} ;if(this[_0xf604[25]][_0xf604[211]]){return el;} ;if($(el)[_0xf604[518]](_0xf604[1203])[_0xf604[20]]==0||$(el)[_0xf604[515]](_0xf604[338])){return false;} else {return el;} ;} ,currentOrParentIs:function (tagName){var parent=this[_0xf604[560]](),current=this[_0xf604[561]]();return parent&&parent[_0xf604[382]]===tagName?parent:current&&current[_0xf604[382]]===tagName?current:false;} ,isEndOfElement:function (){var current=this[_0xf604[562]]();var offset=this[_0xf604[1110]](current);var text=$[_0xf604[394]]($(current)[_0xf604[600]]())[_0xf604[352]](/\n\r\n/g,_0xf604[340]);var len=text[_0xf604[20]];if(offset==len){return true;} else {return false;} ;} ,isFocused:function (){var el,sel=this[_0xf604[565]]();if(sel&&sel[_0xf604[589]]&&sel[_0xf604[589]]>0){el=sel[_0xf604[878]](0)[_0xf604[1073]];} ;if(!el){return false;} ;if(this[_0xf604[25]][_0xf604[211]]){if(this[_0xf604[1580]]()[_0xf604[4]]()){return !this[_0xf604[333]][_0xf604[1092]](el);} else {return true;} ;} ;return $(el)[_0xf604[603]](_0xf604[1203])[_0xf604[20]]!=0;} ,removeEmptyAttr:function (el,attr){if($(el)[_0xf604[350]](attr)==_0xf604[340]){$(el)[_0xf604[335]](attr);} ;} ,removeFromArrayByValue:function (array,value){var index=null;while((index=array[_0xf604[528]](value))!==-1){array[_0xf604[244]](index,1);} ;return array;} };Redactor[_0xf604[5]][_0xf604[21]][_0xf604[5]]=Redactor[_0xf604[5]];$[_0xf604[22]][_0xf604[7]][_0xf604[641]]=function (protocol,convertLinks,convertImageLinks,convertVideoLinks,linkSize){var url=/(((https?|ftps?):\/\/)|www[.][^\s])(.+?\..+?)([.),]?)(\s|\.\s+|\)|$)/gi,rProtocol=/(https?|ftp):\/\//i,urlImage=/(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi;var childNodes=(this[_0xf604[333]]?this[_0xf604[333]][_0xf604[327]](0):this)[_0xf604[1202]],i=childNodes[_0xf604[20]];while(i--){var n=childNodes[i];if(n[_0xf604[591]]===3){var html=n[_0xf604[626]];if(convertVideoLinks&&html){var iframeStart=_0xf604[1247],iframeEnd=_0xf604[1248];if(html[_0xf604[376]](reUrlYoutube)){html=html[_0xf604[352]](reUrlYoutube,iframeStart+_0xf604[1249]+iframeEnd);$(n)[_0xf604[329]](html)[_0xf604[331]]();} else {if(html[_0xf604[376]](reUrlVimeo)){html=html[_0xf604[352]](reUrlVimeo,iframeStart+_0xf604[1250]+iframeEnd);$(n)[_0xf604[329]](html)[_0xf604[331]]();} ;} ;} ;if(convertImageLinks&&html&&html[_0xf604[376]](urlImage)){html=html[_0xf604[352]](urlImage,_0xf604[1581]);$(n)[_0xf604[329]](html)[_0xf604[331]]();} ;if(convertLinks&&html&&html[_0xf604[376]](url)){var matches=html[_0xf604[376]](url);for(var i in matches){var href=matches[i];var text=href;var space=_0xf604[340];if(href[_0xf604[376]](/\s$/)!==null){space=_0xf604[744];} ;var addProtocol=protocol;if(href[_0xf604[376]](rProtocol)!==null){addProtocol=_0xf604[340];} ;if(text[_0xf604[20]]>linkSize){text=text[_0xf604[767]](0,linkSize)+_0xf604[1188];} ;text=text[_0xf604[352]](/&/g,_0xf604[1034])[_0xf604[352]](/</g,_0xf604[1033])[_0xf604[352]](/>/g,_0xf604[1032]);var escapedBackReferences=text[_0xf604[352]](_0xf604[362],_0xf604[1582]);html=html[_0xf604[352]](href,_0xf604[1189]+addProtocol+$[_0xf604[394]](href)+_0xf604[829]+$[_0xf604[394]](escapedBackReferences)+_0xf604[831]+space);} ;$(n)[_0xf604[329]](html)[_0xf604[331]]();} ;} else {if(n[_0xf604[591]]===1&&!/^(a|button|textarea)$/i[_0xf604[608]](n[_0xf604[382]])){$[_0xf604[22]][_0xf604[7]][_0xf604[641]][_0xf604[8]](n,protocol,convertLinks,convertImageLinks,convertVideoLinks,linkSize);} ;} ;} ;} ;} )(jQuery);
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
/*! NOTE: If you're already including a window.matchMedia polyfill via Modernizr or otherwise, you don't need this part */

window.matchMedia=window.matchMedia||function(a){"use strict";var c,d=a.documentElement,e=d.firstElementChild||d.firstChild,f=a.createElement("body"),g=a.createElement("div");return g.id="mq-test-1",g.style.cssText="position:absolute;top:-100em",f.style.background="none",f.appendChild(g),function(a){return g.innerHTML='&shy;<style media="'+a+'"> #mq-test-1 { width: 42px; }</style>',d.insertBefore(f,e),c=42===g.offsetWidth,d.removeChild(f),{matches:c,media:a}}}(document);

/*! Respond.js v1.1.0: min/max-width media query polyfill. (c) Scott Jehl. MIT/GPLv2 Lic. j.mp/respondjs  */
(function(a){"use strict";function x(){u(!0)}var b={};if(a.respond=b,b.update=function(){},b.mediaQueriesSupported=a.matchMedia&&a.matchMedia("only all").matches,!b.mediaQueriesSupported){var q,r,t,c=a.document,d=c.documentElement,e=[],f=[],g=[],h={},i=30,j=c.getElementsByTagName("head")[0]||d,k=c.getElementsByTagName("base")[0],l=j.getElementsByTagName("link"),m=[],n=function(){for(var b=0;l.length>b;b++){var c=l[b],d=c.href,e=c.media,f=c.rel&&"stylesheet"===c.rel.toLowerCase();d&&f&&!h[d]&&(c.styleSheet&&c.styleSheet.rawCssText?(p(c.styleSheet.rawCssText,d,e),h[d]=!0):(!/^([a-zA-Z:]*\/\/)/.test(d)&&!k||d.replace(RegExp.$1,"").split("/")[0]===a.location.host)&&m.push({href:d,media:e}))}o()},o=function(){if(m.length){var b=m.shift();v(b.href,function(c){p(c,b.href,b.media),h[b.href]=!0,a.setTimeout(function(){o()},0)})}},p=function(a,b,c){var d=a.match(/@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi),g=d&&d.length||0;b=b.substring(0,b.lastIndexOf("/"));var h=function(a){return a.replace(/(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,"$1"+b+"$2$3")},i=!g&&c;b.length&&(b+="/"),i&&(g=1);for(var j=0;g>j;j++){var k,l,m,n;i?(k=c,f.push(h(a))):(k=d[j].match(/@media *([^\{]+)\{([\S\s]+?)$/)&&RegExp.$1,f.push(RegExp.$2&&h(RegExp.$2))),m=k.split(","),n=m.length;for(var o=0;n>o;o++)l=m[o],e.push({media:l.split("(")[0].match(/(only\s+)?([a-zA-Z]+)\s?/)&&RegExp.$2||"all",rules:f.length-1,hasquery:l.indexOf("(")>-1,minw:l.match(/\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/)&&parseFloat(RegExp.$1)+(RegExp.$2||""),maxw:l.match(/\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/)&&parseFloat(RegExp.$1)+(RegExp.$2||"")})}u()},s=function(){var a,b=c.createElement("div"),e=c.body,f=!1;return b.style.cssText="position:absolute;font-size:1em;width:1em",e||(e=f=c.createElement("body"),e.style.background="none"),e.appendChild(b),d.insertBefore(e,d.firstChild),a=b.offsetWidth,f?d.removeChild(e):e.removeChild(b),a=t=parseFloat(a)},u=function(b){var h="clientWidth",k=d[h],m="CSS1Compat"===c.compatMode&&k||c.body[h]||k,n={},o=l[l.length-1],p=(new Date).getTime();if(b&&q&&i>p-q)return a.clearTimeout(r),r=a.setTimeout(u,i),void 0;q=p;for(var v in e)if(e.hasOwnProperty(v)){var w=e[v],x=w.minw,y=w.maxw,z=null===x,A=null===y,B="em";x&&(x=parseFloat(x)*(x.indexOf(B)>-1?t||s():1)),y&&(y=parseFloat(y)*(y.indexOf(B)>-1?t||s():1)),w.hasquery&&(z&&A||!(z||m>=x)||!(A||y>=m))||(n[w.media]||(n[w.media]=[]),n[w.media].push(f[w.rules]))}for(var C in g)g.hasOwnProperty(C)&&g[C]&&g[C].parentNode===j&&j.removeChild(g[C]);for(var D in n)if(n.hasOwnProperty(D)){var E=c.createElement("style"),F=n[D].join("\n");E.type="text/css",E.media=D,j.insertBefore(E,o.nextSibling),E.styleSheet?E.styleSheet.cssText=F:E.appendChild(c.createTextNode(F)),g.push(E)}},v=function(a,b){var c=w();c&&(c.open("GET",a,!0),c.onreadystatechange=function(){4!==c.readyState||200!==c.status&&304!==c.status||b(c.responseText)},4!==c.readyState&&c.send(null))},w=function(){var b=!1;try{b=new a.XMLHttpRequest}catch(c){b=new a.ActiveXObject("Microsoft.XMLHTTP")}return function(){return b}}();n(),b.update=n,a.addEventListener?a.addEventListener("resize",x,!1):a.attachEvent&&a.attachEvent("onresize",x)}})(this);
/**
 * Created by apple on 07.05.14.
 */




$(document).ready(function(){
    //var feedbackObject = $('#feedback');
    //var login_link = $('#login_link');

    //feedbackObject.popover();
    //login_link.popover();

    floatingPopover('feedback');
    floatingPopover('login_link');

    $('.product2-view-toggle label').on('click', function() {
        var obj = $(this).children('span');
        if ( obj.hasClass('glyphicon-th-list')) {
            $('.thumbnail.product').addClass('hidden');
            $('.tr.product').removeClass('hidden');
        }
        if ( obj.hasClass('glyphicon-th-large')) {
            $('.thumbnail.product').removeClass('hidden');
            $('.tr.product').addClass('hidden');
        }
    });

    $('.catalog-view-toggle label').click(function() {
        var obj = $(this).children('span');
        if ( obj.hasClass('glyphicon-th-list')) {
            $('.thumbnail.catalog').addClass('hidden');
            $('.tr.catalog').removeClass('hidden');
        }
        if ( obj.hasClass('glyphicon-th-large')) {
            $('.thumbnail.catalog').removeClass('hidden');
            $('.tr.catalog').addClass('hidden');
        }
    });

    $('.mini-slider').each(function(){
        $(this).carousel({
            interval: false
        });
    });


});

function floatingPopover(what) {

    popoverObject = $('#' + what);
    //popoverObject.popover();

    popoverObject.on('shown.bs.popover', function () {
        var popoverObj = $('.popover');
        popoverObj.removeClass('feedback').removeClass('login_link');
        popoverObj.addClass(what);
        popoverObj.addClass('float');
        var pop = $('.popover.' + what);
        var documentScrollTop = $(document).scrollTop();
        var popTop = popoverObject.offset().top - documentScrollTop + 32;
        var popLeft = 0;
        if (typeof ($(this).offset()) != 'undefined' ) {
            popLeft = $(this).offset().left;
        }

        if (what == 'login_link') {
            popLeft -= pop.width()/5;
        }

        pop.attr({'style': 'top: ' + popTop + 'px; left: ' + popLeft + 'px; display: block;'});
    })
}

function message(type, conent) {
    $('.alert.alert-' + type + ' .alert-content').html(conent);

    $('.alert.alert-' + type).removeClass('hidden');

    setTimeout(function() {
        $('.alert.alert-' + type).addClass('hidden');
    }, 2000);
}
;
/**
 * Created by Pavel Osetrov on 04.05.14.
 */


$(document).on('scroll', window, function() {
    var documentScrollTop = $(document).scrollTop();

    var navbarInverse = $('.navbar-inverse');
    var header = $('.header');


    var feedback = $('.popover.float');
    var feedbackLeft = 0;
    if (typeof (feedback.offset()) != 'undefined' ) {
        feedbackLeft = feedback.offset().left;
    }


    if (documentScrollTop > 60) {
        navbarInverse.addClass('navbar-fixed-top');
        navbarInverse.css('background-position', '0 0');
        $('.navbar-header').addClass('hidden');
        header.css({'height': '34px'});
        $('.container.content').css({'padding-top': '114px'});
        $('.navbar-nav').css({'padding': '0 15px'});
        feedback.attr({'style': 'top: 32px; left: ' + feedbackLeft + 'px; display: block;'});
    } else {
        navbarInverse.removeClass('navbar-fixed-top');
        navbarInverse.css('background-position', '0 62px');
        $('.navbar-header').removeClass('hidden');
        header.css({'height': '96px'});
        $('.container.content').css({'padding-top': '0'});
        $('.navbar-nav').css({'padding': '0'});

        var feedbackTop = $('#feedback').offset().top - documentScrollTop + 30;

        feedback.attr({'style': 'top: ' + feedbackTop + 'px; left: ' + feedbackLeft + 'px; display: block;'});
    }
});
(function() {
  $(document).on("ready page:change", function() {
    return $('.store .entry > img').click(function() {
      return $(this).parent().find(':submit').click();
    });
  });

}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.fullscreen = {
	init: function()
	{
		this.fullscreen = false;

		this.buttonAdd('fullscreen', 'Fullscreen', $.proxy(this.toggleFullscreen, this));

		if (this.opts.fullscreen) this.toggleFullscreen();
	},
	enableFullScreen: function()
	{
		this.buttonChangeIcon('fullscreen', 'normalscreen');
		this.buttonActive('fullscreen');
		this.fullscreen = true;

		if (this.opts.toolbarExternal)
		{
			this.toolcss = {};
			this.boxcss = {};
			this.toolcss.width = this.$toolbar.css('width');
			this.toolcss.top = this.$toolbar.css('top');
			this.toolcss.position = this.$toolbar.css('position');
			this.boxcss.top = this.$box.css('top');
		}

		this.fsheight = this.$editor.height();
		if (this.opts.iframe) this.fsheight = this.$frame.height();

		if (this.opts.maxHeight) this.$editor.css('max-height', '');
		if (this.opts.iframe) var html = this.get();

		if (!this.$fullscreenPlaceholder) this.$fullscreenPlaceholder = $('<div/>');
		this.$fullscreenPlaceholder.insertAfter(this.$box);

		this.$box.appendTo(document.body);

		this.$box.addClass('redactor_box_fullscreen');
		$('body, html').css('overflow', 'hidden');

		if (this.opts.iframe) this.fullscreenIframe(html);

		this.fullScreenResize();
		$(window).resize($.proxy(this.fullScreenResize, this));
		$(document).scrollTop(0, 0);

		this.focus();
		this.observeStart();
	},
	disableFullScreen: function()
	{
		this.buttonRemoveIcon('fullscreen', 'normalscreen');
		this.buttonInactive('fullscreen');
		this.fullscreen = false;

		$(window).off('resize', $.proxy(this.fullScreenResize, this));
		$('body, html').css('overflow', '');

		this.$box.insertBefore(this.$fullscreenPlaceholder);
		this.$fullscreenPlaceholder.remove();

		this.$box.removeClass('redactor_box_fullscreen').css({ width: 'auto', height: 'auto' });

		if (this.opts.iframe) html = this.$editor.html();

		if (this.opts.iframe) this.fullscreenIframe(html);
		else this.sync();

		var height = this.fsheight;
		if (this.opts.autoresize) height = 'auto';
		if (this.opts.maxHeight) this.$editor.css('max-height', this.opts.maxHeight);

		if (this.opts.toolbarExternal)
		{
			this.$box.css('top', this.boxcss.top);
			this.$toolbar.css({
				'width': this.toolcss.width,
				'top': this.toolcss.top,
				'position': this.toolcss.position
			});
		}

		if (!this.opts.iframe) this.$editor.css('height', height);
		else this.$frame.css('height', height);

		this.$editor.css('height', height);
		this.focus();
		this.observeStart();
	},
	toggleFullscreen: function()
	{
		if (!this.fullscreen)
		{
			this.enableFullScreen();
		}
		else
		{
			this.disableFullScreen();
		}
	},
	fullscreenIframe: function(html)
	{
		this.$editor = this.$frame.contents().find('body');
		this.$editor.attr({ 'contenteditable': true, 'dir': this.opts.direction });

		// set document & window
		if (this.$editor[0])
		{
			this.document = this.$editor[0].ownerDocument;
			this.window = this.document.defaultView || window;
		}

		// iframe css
		this.iframeAddCss();

		if (this.opts.fullpage) this.setFullpageOnInit(html);
		else this.set(html);

		if (this.opts.wym) this.$editor.addClass('redactor_editor_wym');
	},
	fullScreenResize: function()
	{
		if (!this.fullscreen) return false;

		var toolbarHeight = this.$toolbar.height();

		var pad = this.$editor.css('padding-top').replace('px', '');
		var height = $(window).height() - toolbarHeight;
		this.$box.width($(window).width() - 2).height(height + toolbarHeight);

		if (this.opts.toolbarExternal)
		{
			this.$toolbar.css({
				'top': '0px',
				'position': 'absolute',
				'width': '100%'
			});

			this.$box.css('top', toolbarHeight + 'px');
		}

		if (!this.opts.iframe) this.$editor.height(height - (pad * 2));
		else
		{
			setTimeout($.proxy(function()
			{
				this.$frame.height(height);

			}, this), 1);
		}

		this.$editor.height(height);
	}
};
(function ($) {
$.Redactor.opts.langs['ru'] = {
	html: 'Код',
	video: 'Видео',
	image: 'Изображение',
	table: 'Таблица',
	link: 'Ссылка',
	link_insert: 'Вставить ссылку ...',
	link_edit: 'Изменить ссылку',
	unlink: 'Удалить ссылку',
	formatting: 'Форматирование',
	paragraph: 'Обычный текст',
	quote: 'Цитата',
	code: 'Код',
	header1: 'Заголовок 1',
	header2: 'Заголовок 2',
	header3: 'Заголовок 3',
	header4: 'Заголовок 4',
	header5: 'Заголовок 5',
	bold:  'Полужирный',
	italic: 'Наклонный',
	fontcolor: 'Цвет текста',
	backcolor: 'Заливка текста',
	unorderedlist: 'Обычный список',
	orderedlist: 'Нумерованный список',
	outdent: 'Уменьшить отступ',
	indent: 'Увеличить отступ',
	cancel: 'Отменить',
	insert: 'Вставить',
	save: 'Сохранить',
	_delete: 'Удалить',
	insert_table: 'Вставить таблицу',
	insert_row_above: 'Добавить строку сверху',
	insert_row_below: 'Добавить строку снизу',
	insert_column_left: 'Добавить столбец слева',
	insert_column_right: 'Добавить столбец справа',
	delete_column: 'Удалить столбец',
	delete_row: 'Удалить строку',
	delete_table: 'Удалить таблицу',
	rows: 'Строки',
	columns: 'Столбцы',
	add_head: 'Добавить заголовок',
	delete_head: 'Удалить заголовок',
	title: 'Подсказка',
	image_position: 'Обтекание текстом',
	none: 'Нет',
	left: 'Cлева',
	right: 'Cправа',
	image_web_link: 'Cсылка на изображение',
	text: 'Текст',
	mailto: 'Эл. почта',
	web: 'URL',
	video_html_code: 'Код видео ролика',
	file: 'Файл',
	upload: 'Загрузить',
	download: 'Скачать',
	choose: 'Выбрать',
	or_choose: 'Или выберите',
	drop_file_here: 'Перетащите файл сюда',
	align_left:	'По левому краю',
	align_center: 'По центру',
	align_right: 'По правому краю',
	align_justify: 'Выровнять текст по ширине',
	horizontalrule: 'Горизонтальная линейка',
	fullscreen: 'Во весь экран',
	deleted: 'Зачеркнутый',
	anchor: 'Якорь',
	link_new_tab: 'Открывать в новой вкладке',
	underline: 'Подчеркнутый',
	alignment: 'Выравнивание',
	filename: 'Название (необязательно)',
	edit: 'Ред.',
	center: 'По центру'
};
})( jQuery );
$(document).ready(
  function(){
  var csrf_token = $('meta[name=csrf-token]').attr('content');
  var csrf_param = $('meta[name=csrf-param]').attr('content');
  var params;
  if (csrf_param !== undefined && csrf_token !== undefined) {
    params = csrf_param + "=" + encodeURIComponent(csrf_token);
  }
  $('.redactor').redactor(
    { "imageUpload":"/redactor_rails/pictures?" + params,
      "imageGetJson":"/redactor_rails/pictures",
      "fileUpload":"/redactor_rails/documents?" + params,
      "fileGetJson":"/redactor_rails/documents",
      "path":"/assets/redactor-rails",
      "css":"style.css",
      "lang": "ru",
       plugins: ['fullscreen']
    }
  );
});
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//












;
