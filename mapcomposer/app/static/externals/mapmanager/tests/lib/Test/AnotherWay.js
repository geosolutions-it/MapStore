/*

=head1 NAME

Test.AnotherWay - better replacement for Test.Simple 

=head1 SYNOPSIS

	// Make sure that run-tests.html is in the same directory with tests.
	
	// In a test page:
	
	<pre id="test"><script type="text/javascript">
		JSAN.use( "Test.AnotherWay" );
		var test=new Test.Builder();
		test.ok( true, "this is ok" );
		// and also:
		test.fail( description );
		test.eq( got, expected, description ); // deep equality
		test.like( got, expected_regex, description );
		test.html_eq( got_html, expected_html, description ); // html either string or node
		test.debug_print( text ); // for tracing test execution
		test.wait_result( seconds ); // for testing asyncronous code
		test.delay_call( optional_delay, functions, ... ); // for testing asyncronous code
		test.open_window( url, function( wnd ) {...} ); // for testing html pages (beware of popup blockers!)
		test.replay_events( wnd, events ); // for replaying prerecorded mouse input
	</script></pre>
	
	
	// In index.html file that runs all tests:
	
	<body><script type="text/javascript">
		JSAN.use( "Test.AnotherWay" );
		var t = new Test.Harness.Browser();
		t.runTests(
			"one.t.html",
			"two.t.html"
		);
	</script></body>
	

=head1 DESCRIPTION

Test.AnotherWay is an adapter that allows tests written for Test.Simple framework 
to use prettier run-tests.html web page for displaying results.

It also has methods for testing web pages, testing asyncronous code, recording and
replaying mouse input, and tracing test execution.

This description is a stub.

See README.jsan for the details on JSAN Test.Simple compatibility.

See ../../doc/doc.html or http://straytree.com/TestAnotherWay/doc/doc.html 
for the documentation for run-tests.html web page.


=head1 AUTHOR

Artem Khodush, http://straytree.com, greenkaa at gmail dot com.

=head1 COPYRIGHT

Copyright (c) 2005 Artem Khodush, http://straytree.org

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

=cut

*/

if( typeof( Test )=="undefined" ) {
	Test={};
}
if( typeof( Test.AnotherWay )=="undefined" ) {
	Test.AnotherWay={};
}
if( typeof( Test.AnotherWay.Wrapper )=="undefined" ) {
	Test.AnotherWay.Wrapper={};
}

Test.AnotherWay.Wrapper._g_path_to_runner=null;
Test.AnotherWay.Wrapper._g_path_to_tests=null;
Test.AnotherWay.Wrapper._g_pages_to_run=null;
Test.AnotherWay.Wrapper._g_object=null;

Test.AnotherWay.set_runner_location=function( path_to_runner, path_to_tests )
{
	Test.AnotherWay.Wrapper._g_path_to_runner=path_to_runner;
	Test.AnotherWay.Wrapper._g_path_to_tests=path_to_tests;
}

// test page may run in two ways: first, in test_iframe inside run-tests.html
if( window.parent!=null && window.parent.test_iframe!=null && window.parent.test_iframe==window ) {
	if( window.parent.Test!=null && window.parent.Test.AnotherWay!=null ) {
		Test.AnotherWay.Wrapper._g_object=window.parent.Test.AnotherWay._g_test_object_for_jsan;
	}
}

if( window.parent!=null && window.parent.frames["test_frame"]!=null ) {
	var runner_frame=window.parent.frames[1];
	if( runner_frame!=null && runner_frame.name=="runner_frame" && runner_frame.nodeName!=null && runner_frame.contentWindow!=null ) {
		runner_frame=runner_frame.contentWindow;
	}
	if( runner_frame!=null && runner_frame.Test!=null && runner_frame.Test.AnotherWay!=null ) {
		Test.AnotherWay.Wrapper._g_object=runner_frame.Test.AnotherWay._g_test_object_for_jsan;
	}
}

// if it's neither, set up the wrapper and run test page in the second way
Test.AnotherWay.Wrapper._on_load=function()
{
	if( Test.AnotherWay.Wrapper._g_object==null ) {
		Test.AnotherWay.Wrapper._wrap_page( window.location.href );
	}
}

if( Test.AnotherWay.Wrapper._g_object==null ) {
	if( window.attachEvent ) {
		window.attachEvent( "onload", Test.AnotherWay.Wrapper._on_load );
	}else if( window.addEventListener ) {
		window.addEventListener( "load", Test.AnotherWay.Wrapper._on_load, false );
	}else {
		onload=Test.AnotherWay.Wrapper._on_load;
	}
}

// Test.Harness replacement
Test.Harness=function() {}
Test.Harness.Browser=function() { return new Test.Harness() }
Test.Harness.Director=function() { return new Test.Harness() }
Test.Harness.prototype.runTests=function()
{
	if( Test.AnotherWay.Wrapper._g_pages_to_run==null ) {
		Test.AnotherWay.Wrapper._g_pages_to_run=[];
	}
	for( var i=0; i<arguments.length; ++i ) {
		var page=arguments[i];
		if( Test.AnotherWay.Wrapper._g_path_to_tests!=null ) {
			if( page.indexOf( "://" )==-1 ) {
				page=Test.AnotherWay.Wrapper._g_path_to_tests+"/"+page;
			}
		}
		Test.AnotherWay.Wrapper._g_pages_to_run.push( page );
	}
}

// Test.Builder replacement
Test.Builder=function()
{
	return this;
}
Test.AnotherWay.Wrapper._call_test_method=function( method, args )
{
	if( Test.AnotherWay.Wrapper._g_object!=null ) {
		Test.AnotherWay.Wrapper._g_object[method].apply( Test.AnotherWay.Wrapper._g_object, args );
	}
}

Test.AnotherWay.Wrapper._setup_builder=function() {
	var proto=Test.Builder.prototype;

	proto.plan=function( p ) { if( p!=null && p.tests!=null ) Test.AnotherWay.Wrapper._call_test_method( "plan", [p.tests] ); };
	window.plan=proto.plan;
	proto.ok=function( p ) { Test.AnotherWay.Wrapper._call_test_method( "ok", arguments ); };
	proto.fail=function( p ) { Test.AnotherWay.Wrapper._call_test_method( "fail", arguments ); };
	proto.eq=function( p ) { Test.AnotherWay.Wrapper._call_test_method( "eq", arguments ); };
	proto.like=function( p ) { Test.AnotherWay.Wrapper._call_test_method( "like", arguments ); };
	proto.html_eq=function( p ) { Test.AnotherWay.Wrapper._call_test_method( "html_eq", arguments ); };
	proto.debug_print=function( p ) { Test.AnotherWay.Wrapper._call_test_method( "debug_print", arguments ); };
	proto.wait_result=function( p ) { Test.AnotherWay.Wrapper._call_test_method( "wait_result", arguments ); };
	proto.delay_call=function( p ) { Test.AnotherWay.Wrapper._call_test_method( "delay_call", arguments ); };
	proto.open_window=function( p ) { Test.AnotherWay.Wrapper._call_test_method( "open_window", arguments ); };
	proto.replay_events=function( p ) { Test.AnotherWay.Wrapper._call_test_method( "replay_events", arguments ); };
	var methods=["ok", "fail", "eq", "like", "html_eq", "debug_print", "wait_result", "delay_call", "open_window", "replay_events"];
	for( var i=0; i<methods.length; ++i ) {
		window[methods[i]]=proto[methods[i]];
	}
}

Test.AnotherWay.Wrapper._setup_builder();

// silly but nice looking splitter
Test.AnotherWay.Wrapper._g_top_half=null;
Test.AnotherWay.Wrapper._g_bottom_half=null;
Test.AnotherWay.Wrapper._g_test_frame=null;
Test.AnotherWay.Wrapper._g_runner_frame=null;
Test.AnotherWay.Wrapper._g_splitter=null;

Test.AnotherWay.Wrapper._g_top_height=null;
Test.AnotherWay.Wrapper._g_bottom_height=null;

Test.AnotherWay.Wrapper._g_dragging=false;
Test.AnotherWay.Wrapper._g_drag_start_mouse_pos=null;
Test.AnotherWay.Wrapper._g_drag_start_top_height=null;
Test.AnotherWay.Wrapper._g_drag_start_bottom_height=null;

Test.AnotherWay.Wrapper._update_height=function()
{
	Test.AnotherWay.Wrapper._g_top_half.style.top="0px";
	Test.AnotherWay.Wrapper._g_top_half.style.height=Test.AnotherWay.Wrapper._g_top_height+"px";
	Test.AnotherWay.Wrapper._g_splitter.style.top=(Test.AnotherWay.Wrapper._g_top_height+3)+"px";
	Test.AnotherWay.Wrapper._g_bottom_half.style.bottom= window.opera==null ? "0px" : "1px";
	Test.AnotherWay.Wrapper._g_bottom_half.style.height=Test.AnotherWay.Wrapper._g_bottom_height+"px";
	if( Test.AnotherWay.Wrapper._g_test_frame.style.display!="none" ) {
		Test.AnotherWay.Wrapper._g_test_frame.style.height=(Test.AnotherWay.Wrapper._g_top_height-4)+"px";
	}
	if( Test.AnotherWay.Wrapper._g_runner_frame.style.display!="none" ) {
		var fudge= window.opera==null ? 4 : 8;
		Test.AnotherWay.Wrapper._g_runner_frame.style.height=(Test.AnotherWay.Wrapper._g_bottom_height-fudge)+"px";
	}
}
Test.AnotherWay.Wrapper._event_coords=function( e )
{
	if( e.pageX!=null && e.pageY!=null ) {
		return { x: e.pageX, y: e.pageY };
	}else if( e.clientX!=null && e.clientY!=null ) {
		return { x: e.clientX+document.body.scrollLeft, y: e.clientY+document.body.scrollTop };
	}
	return { x: 0, y:0 };
}
Test.AnotherWay.Wrapper._on_mousedown=function( e )
{
	if( !Test.AnotherWay.Wrapper._g_dragging) {
		var target;
		if( e==null ) {
			e=window.event;
			target=e.srcElement;
		}else {
			target=e.target;
		}
		if( target==Test.AnotherWay.Wrapper._g_splitter ) {
			Test.AnotherWay.Wrapper._g_dragging=true;
			Test.AnotherWay.Wrapper._g_drag_start_mouse_pos=Test.AnotherWay.Wrapper._event_coords( e );
			Test.AnotherWay.Wrapper._g_drag_start_top_height=Test.AnotherWay.Wrapper._g_top_height;
			Test.AnotherWay.Wrapper._g_drag_start_bottom_height=Test.AnotherWay.Wrapper._g_bottom_height;
			Test.AnotherWay.Wrapper._g_test_frame.style.display="none";
			Test.AnotherWay.Wrapper._g_runner_frame.style.display="none";
			Test.AnotherWay.Wrapper._g_top_half.style.border="1px dotted #777";
			Test.AnotherWay.Wrapper._g_bottom_half.style.border="1px dotted #777";
		}
	}else {
		Test.AnotherWay.Wrapper._g_dragging=false;
	}
}
Test.AnotherWay.Wrapper._on_mousemove=function( e )
{
	if( Test.AnotherWay.Wrapper._g_dragging ) {
		if( e==null ) {
			e=window.event;
		}
		var cur_mouse_pos=Test.AnotherWay.Wrapper._event_coords( e );
		var delta=cur_mouse_pos.y-Test.AnotherWay.Wrapper._g_drag_start_mouse_pos.y;
		Test.AnotherWay.Wrapper._g_top_height=Test.AnotherWay.Wrapper._g_drag_start_top_height+delta;
		Test.AnotherWay.Wrapper._g_bottom_height=Test.AnotherWay.Wrapper._g_drag_start_bottom_height-delta;
		Test.AnotherWay.Wrapper._update_height();
	}
}
Test.AnotherWay.Wrapper._on_mouseup=function()
{
	if( Test.AnotherWay.Wrapper._g_dragging ) {
		Test.AnotherWay.Wrapper._g_dragging=false;
		Test.AnotherWay.Wrapper._g_test_frame.style.display="inline";
		Test.AnotherWay.Wrapper._g_runner_frame.style.display="inline";
		Test.AnotherWay.Wrapper._g_top_half.style.border="";
		Test.AnotherWay.Wrapper._g_bottom_half.style.border="";
		Test.AnotherWay.Wrapper._update_height();
	}
}

Test.AnotherWay.Wrapper._get_window_height=function( w )
{
	if( w.innerHeight ) {
		return w.innerHeight;
	}else if( w.document.body.clientHeight ) {
		return w.document.body.clientHeight;
	}
	return 500;
}
Test.AnotherWay.Wrapper._setup_splitter=function()
{
	var window_height=Test.AnotherWay.Wrapper._get_window_height( window )*0.995*0.995;
	Test.AnotherWay.Wrapper._g_top_height=window_height*0.25;

	var splitter_height=Test.AnotherWay.Wrapper._g_splitter.clientHeight+2;

	Test.AnotherWay.Wrapper._g_bottom_height=window_height-Test.AnotherWay.Wrapper._g_top_height-splitter_height;

	Test.AnotherWay.Wrapper._update_height();

	document.body.onmousedown=Test.AnotherWay.Wrapper._on_mousedown;
	document.body.onmousemove=Test.AnotherWay.Wrapper._on_mousemove;
	document.body.onmouseup=Test.AnotherWay.Wrapper._on_mouseup;
}
Test.AnotherWay.Wrapper._set_padding=function( style, top, right, bottom, left )
{
	style.paddingTop=top;
	style.paddingRight=right;
	style.paddingBottom=bottom;
	style.paddingLeft=left;
}
Test.AnotherWay.Wrapper._set_margin=function( style, top, right, bottom, left )
{
	style.marginTop=top;
	style.marginRight=right;
	style.marginBottom=bottom;
	style.marginLeft=left;
}
// create new blank page with two iframes, load run-tests.html and the test into them, and run tests.
Test.AnotherWay.Wrapper._g_onload_count=0;
Test.AnotherWay.Wrapper._iframe_onload=function()
{
	var pages_to_run=[];
	if( Test.AnotherWay.Wrapper._g_pages_to_run==null ) {
		var current_page=window.location.href;
		var last_slash=current_page.lastIndexOf( "/" );
		current_page=current_page.substring( last_slash+1, current_page.length );
		if( Test.AnotherWay.Wrapper._g_path_to_tests!=null ) {
			current_page=Test.AnotherWay.Wrapper._g_path_to_tests+"/"+current_page;
		}
		pages_to_run=[current_page];
	}else {
		pages_to_run=Test.AnotherWay.Wrapper._g_pages_to_run;
	}
	if( ++Test.AnotherWay.Wrapper._g_onload_count==2 ) {
		var pages="";
		for( var i=0; i<pages_to_run.length; ++i ) {
			pages+=";jsantestpage="+encodeURIComponent( pages_to_run[i] );
		}
		// do not pass "run" on command line here, since it will cause each test to run twice on page reload.
		var runner="run-tests.html";
		if( Test.AnotherWay.Wrapper._g_path_to_runner!=null ) {
			runner=Test.AnotherWay.Wrapper._g_path_to_runner+"/"+runner;
		}
		Test.AnotherWay.Wrapper._g_runner_frame.src=runner+"?testframe=0;testframe_no_clear"+pages;
	}
	// wait till run-tests is loaded, then dig into it and make it run the tests
	var loc="";
	var tst=null;
	if( this.contentWindow!=null && this.contentWindow.location!=null ) {
		loc+=this.contentWindow.location;
		tst=this.contentWindow.Test;
	}else if( window.event && window.event.srcElement && window.event.srcElement.src!=null ) {
		loc+=window.event.srcElement.src;
		tst=window.event.srcElement.contentWindow.Test;
	}
	if( loc.indexOf( "run-tests.html?testframe=0;testframe_no_clear;" )!=-1 && tst!=null && tst.AnotherWay!=null) {
		tst.AnotherWay._g_pages_to_run=pages_to_run;
		// mozilla and Opera use caller page directory as a base for relative urls,
		// IE always use run-tests directory as a base for relative urls,
		var span=document.createElement( "SPAN" );
		span.innerHTML="<!--[if IE]><br /><![endif]-"+"->";
		var is_ie=span.getElementsByTagName( "BR" ).length>0;
		if( !is_ie ) {
			tst.AnotherWay._g_outside_path_correction=Test.AnotherWay.Wrapper._g_path_to_tests;
		}
		tst.AnotherWay._run_pages_to_run( true ); 
	}
}
Test.AnotherWay.Wrapper._wrap_page=function( url )
{
	// repeat checks to avoid infinite reloading on page refresh in IE. Why the checks don't work before onload, or why sometimes test_frame can be found by name, but its name is null,
	// and sometimes test_frame may be found only by index, and its name is valid, i have no idea.
	if( window.parent!=null && window.parent.test_iframe!=null && window.parent.test_iframe==window ) {
		if( window.parent.Test!=null && window.parent.Test.AnotherWay!=null ) {
			return;
		}
	}
	if( window.parent!=null && (window.parent.frames.test_frame!=null || (window.parent.frames[0]!=null && window.parent.frames[0].name=="test_frame")) ) {
		var runner_frame=window.parent.frames[1];
		if( runner_frame!=null && runner_frame.name=="runner_frame" && runner_frame.nodeName!=null && runner_frame.contentWindow!=null ) {
			runner_frame=runner_frame.contentWindow;
		}
		if( runner_frame!=null && runner_frame.Test!=null && runner_frame.Test.AnotherWay!=null ) {
			return;
		}
	}

	// replace the page.
	document.body.innerHTML="";
	var HTML=document.getElementsByTagName( "HTML" );
	HTML[0].style.height="99.5%";
	document.body.style.height="99.5%";
	Test.AnotherWay.Wrapper._set_padding( document.body.style, "0", "0", "0", "0" );
	Test.AnotherWay.Wrapper._set_margin( document.body.style, "0", "0", "0", "0" );

	Test.AnotherWay.Wrapper._g_top_half=document.body.appendChild( document.createElement( "DIV" ) );
	Test.AnotherWay.Wrapper._g_splitter=document.body.appendChild( document.createElement( "DIV" ) );
	Test.AnotherWay.Wrapper._g_bottom_half=document.body.appendChild( document.createElement( "DIV" ) );
	Test.AnotherWay.Wrapper._g_test_frame=document.createElement( "IFRAME" );
	Test.AnotherWay.Wrapper._g_runner_frame=document.createElement( "IFRAME" );

	var setup_half_div=function( s, f, n ) {
		s.position="absolute";
		s.left="0";
		s.width="98%";
		Test.AnotherWay.Wrapper._set_padding( s, "0", "0", "0", "0" );
		Test.AnotherWay.Wrapper._set_margin( s,  "0", "0", "0", "0" );
		f.id=n;
		f.name=n;
		f.src="about:blank";
		f.style.width="99.5%";
		f.frameBorder="0"; // IE ignores frameBorder setting if iframe is already in the document, so iframes are appended later.
		if( f.attachEvent!=null ) {
			f.attachEvent( "onload", Test.AnotherWay.Wrapper._iframe_onload );
		}else {
			f.onload=Test.AnotherWay.Wrapper._iframe_onload;
		}
	}
	setup_half_div( Test.AnotherWay.Wrapper._g_top_half.style, Test.AnotherWay.Wrapper._g_test_frame, "test_frame" );
	setup_half_div( Test.AnotherWay.Wrapper._g_bottom_half.style, Test.AnotherWay.Wrapper._g_runner_frame, "runner_frame" );

	Test.AnotherWay.Wrapper._g_top_half.appendChild( Test.AnotherWay.Wrapper._g_test_frame );
	Test.AnotherWay.Wrapper._g_bottom_half.appendChild( Test.AnotherWay.Wrapper._g_runner_frame );

	var s=Test.AnotherWay.Wrapper._g_splitter.style;
	s.position="absolute";
	s.left="0";
	s.width="98%";
	s.height="3px";
	s.fontSize="1pt";
	Test.AnotherWay.Wrapper._set_padding( s, "0", "0", "0", "0" );
	s.maringTop="0";
	s.marginBottom="0";
	s.marginLeft="5px";
	s.marginRight="5px";
	s.borderTop="1px solid #442";
	s.borderBottom="1px solid #442";
	s.backgroundColor="scrollbar";
	s.cursor="row-resize";
	s.cursor="n-resize";

	Test.AnotherWay.Wrapper._setup_splitter();
}

