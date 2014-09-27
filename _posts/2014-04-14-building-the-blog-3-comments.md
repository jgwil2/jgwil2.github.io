---
title: Building the Blog 3 - Disqus Comments
layout: post
---

In my previous Building the Blog installments I discussed the [basics of Jekyll](/2014/01/22/building-the-blog/) and [using Foundation](/2014/02/18/building-the-blog-part-2/). Now I'm going to talk about setting up comments. Since I'm using Github Pages, I can only serve static HTML, and I have no database. So setting up my own comments à la WordPress was out of the question. I knew I would have to go third-party, and [Disqus](http://disqus.com/) ended up being my choice. They are free, have a really simple API, and just about everybody uses them. They even have [some special instructions](http://help.disqus.com/customer/portal/articles/472138-jekyll-installation-instructions) for installation with Jekyll, although I didn't do exactly what they suggest. However, nothing ever comes quite so easily, so I'm going to talk to you about the problems I ran into and how I ended up solving them (or getting around them in any case).

The first thing to do for Disqus is to get an account and register your site. They then give you some JavScript to drop in wherever you want your comments to go, and that's that. Here is their script:

{% highlight javascript %}
<div id="disqus_thread"></div>
<script type="text/javascript">
    /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
    var disqus_shortname = 'example'; // required: replace example with your forum shortname

    /* * * DON'T EDIT BELOW THIS LINE * * */
    (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
</script>
{% endhighlight %}

So far so good. There's no need to even understand what's going on in the JS because all you need to to is replace 'example' with whatever name you've chosen to represent your forum. Since I only wanted comments to appear for articles, I just dropped it right into my `_layouts/post` file; after each post some comments will appear. But I also wanted to add a show/hide comments button that would allow users to have a look for themselves. I figured there would be few comments, at least to begin with, and I would rather have an interested user go ahead and click to have the option of commenting than just have an empty forum staring out from every post. To do this, I opened up `_include/footer` and dropped the following jQuery lines at the bottom:

{% highlight javascript %}
$(document).ready(function(){
	$("#comments").hide();
});

$("#show-comments").click(function(){
	$("#comments").toggle();
	var showHide = $(this).text() == "Show comments" ? "Hide comments" : "Show comments";
	$(this).text(showHide);
});
{% endhighlight %}

This code, in theory, would hide the comments (which I had encased in the `#comments` div) as soon as the page loads. Then the user would click on the `#show-comments` button in order to `toggle()` the div from `display: none` to its default display property. The button would then read "Hide comments" instead of "Show comments". However, when I went to try this out, I ran into some trouble. First of all, Firefox would not display the comments at all. The button would switch from "Hide comments" to "Show comments" and back, but nothing else would change. With a little more experimentation I realized that this issue immediately went away when I resized the browser or opened up dev tools, suggesting some kind of bug. Indeed, the display property was changing but the height was stuck at 0. A quick Google search and I had a solution in the form of the following code, to be placed right under my Disqus shortname, like so:

{% highlight javascript %}
<div id="disqus_thread"></div>
<script type="text/javascript">
    /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
    var disqus_shortname = 'example'; // required: replace example with your forum shortname
	disqus_config = function() { // fix display in firefox
		this.callbacks.onReady = [function() {
			$('#disqus_thread iframe').css({
				'height': '351px',
				'height': 'auto !important',
				'min-height': '351px'
			});
		}];
	};
    /* * * DON'T EDIT BELOW THIS LINE * * */
    (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
</script>
{% endhighlight %}

That seemed to do the trick. The 351px height was a figure that I arrived at after some experimentation: it's the height of the Disqus element when there are no comments. This seemed to force Firefox to actually display The `'height: auto'` then allows the div to figure out how high it should be in the event that there actually are comments. Okay, problem solved, right? Not so fast. Chrome is also having an issue with this. The problem in Chrome is that there ends up being about a thousand pixels of blank margin space in between the Disqus element and the element above it. Again, resizing the browser or opening up dev tools immediately solves the problem, but the JavaScript here does nothing; the div is too high here, so min-height won't cut it. On the other hand, max-height won't work either, since the height of the div will change as people add comments. And bizarrely, nobody on Google or Stack Overflow is talking about this issue, even though it seems to be analogous to the one with Firefox. After having tried a whole bunch of different things, I went to my man [Jon Dang](http://jondang.com), knowing he's the ninja of front-end development, for his opinion. Jon found [this blog post](http://blog.yjl.im/2012/04/let-your-readers-decide-when-to-load.html) on how to load Disqus comments with AJAX. This would create the same effect as having the user click to reveal the comments, with the added bonus of reducing my page's initial load time. Jon pushed it to my repo and I gave it a shot. It worked great; the only slight issue was a little Disqus element, `div.dsq-brlink`, that would show up on the first page load where the comments would go, but this was easily taken care of in jQuery. The solution involved deleting all of the JavaScript in `_layout/post.html`, leaving only the `<div id="disqus-thread">` element. Then, in the footer, all I needed was the following code:

{% highlight javascript %}
$(document).ready(function(){
	$(".dsq-brlink").css({
		'display': 'none'
	});
});
$("#show-comments").click(function(){	
	var showHide = $(this).text() == "Show comments" ? "Hide comments" : "Show comments";
	$(this).text(showHide);
	if (showHide != "Hide comments") {
		$('#disqus_thread').empty();
	}
	else {
		$.ajaxSetup({cache:true});
		$.getScript("http://example.disqus.com/embed.js");
		$.ajaxSetup({cache:false});
	}
});
{% endhighlight %}

Same switching between "Show comments" and "Hide comments", but instead of using `toggle()` to change the display property, we use AJAX to load the comments if they aren't there, and if they are there we use `empty()` to get rid of them.

The lesson to all of this, of course, is that there are always alternative solutions! It was really frustrating when I was trying to solve the Chrome bug, because no matter what I did I could not seem to find a fix. I was so zeroed in on that particular problem that it didn't occur to me to try to bypass it entirely, which is why it's so valuable to have a fresh set of eyes look at these things from time to time. So, thanks again, Jon! And thank you, dear reader, for checking out my blog. Go ahead and comment. You know you want to.
