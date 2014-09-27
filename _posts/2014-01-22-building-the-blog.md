---
title: Building the Blog
layout: post
---

Hello, and welcome to my new blog, where I will be sharing new things I learn 
about web development. I'm a newbie, and as such, there are tons of things to 
learn. I'm hoping that this blog will help me consolidate and concretize this 
knowledge, and maybe help some other newbies out too! I plan on making each post 
a description of a small project that clarifies some aspect of web development. 
In this way the blog will follow my progress as a developer.

The first project that I'll discuss will be, well, this blog! It was a pretty 
big project for me since I had never done anything like this before, so I'll 
break it down into some subsections:

  - Jekyll
  - Foundation
  - GitHub Pages
  - Frills (JavaScript, comments, etc.)

So I'll get started with [Jekyll](http://jekyllrb.com/), a "simple, blog-aware, 
static site generator" (in their own words). Jekyll is the engine behind this 
site. If you've ever worked with WordPress themes, the concept of Jekyll should 
be familiar to you: it takes your posts, runs them through a loop, and spits 
them back out with whatever formatting you want to use for them. The difference 
is that while WordPress is written in PHP, and pages are assembled dynamically 
each time a client makes a request, Jekyll is written in Ruby and it only 
assembles your pages when you ask it to. Then, you take the static pages that it generates and put 
them online, and what you get is a site that appears to be dynamic, but actually 
isn't. This will allow you to get higher performance without all the 
complications of caches, databases and everything else that needs to be fine-tuned with a dynamic content management system.

Sounds great, right? Unfortunately, setting up Jekyll isn't as easy as installing WordPress and picking a theme, and you will have to write some code (and mess around in the terminal!). 
It also doesn't officially support Windows, so it was a little tricky to get the 
thing up and running. If you're a Windows user like me, the first thing you'll 
most likely have to do is install [Ruby](http://www.ruby-
lang.org/en/installation) and the Ruby Development Kit. Then you'll also want to 
install [Python](http://www.python.org/download/) in order to enable Pygments 
with Jekyll. Pygments is a syntax highlighter for computer languages (just tell it what language you're 
using, and it will help make it pretty and easy to read) and although you can use Jekyll without it, if you're using Jekyll as 
your platform you're probably going to be writing some code at some point, so go 
for it! Then you can open up the _Start Command Prompt with Ruby_ application 
and install the Jekyll gem. If you run into trouble (as I did), check out [this 
blog post](http://www.madhur.co.in/blog/2011/09/01/runningjekyllwindows.html) or 
[this one](http://yizeng.me/2013/05/10/setup-jekyll-on-windows/) on running 
Jekyll on Windows. It was a bit of a struggle, but after a few hours of yelling 
at my command prompt, searching Google, and soliciting help from my friend [Jon 
Dang](http://jondang.com/), I got Jekyll up and running.

Now that everything is installed, the next move is to create a new project and 
get it to serve. So, from the terminal, you `cd` into the directory where you 
want to build your project and run the command `jekyll new name_of_project`. 
This will create a directory with whatever name you like, with all the folders 
and files you need to get Jekyll running. To see what it looks like, `cd` 
into the newly created directory and run the command `jekyll serve`. Jekyll 
should generate the site and start serving at Port 4000. So open up a new window 
in your browser, navigate to localhost:4000, and voilà! You'll have a little 
demo site explaining some of Jekyll's functionalities:

<figure>
	<img alt="Jekyll defaul site" src="/img/default_jekyll_post.png" />
</figure>

### Making the site work

Again, if you're familiar with WordPress, the basic concept of Jekyll shouldn't be too strange to you. When you build your site, Jekyll should generate the following file structure in your project folder:

* _layouts
	* `default.html`
	* `post.html`
* _posts
	* `2014-01-18-welcome-to-jekyll.markdown` (sample post generated when you create the new project)
* _site (contains all pages that Jekyll generates when you build; this is what the user will see)
* css
	* `main.css` (Jekyll's default stylesheet)
	* `syntax.css` (another stylesheet designed to work with Pygments to highlight your code snippets)
* `_config.yml`
* `index.html`

To this you will want to add at least one subdirectory, _includes, which will contain page elements that you can then mix together, just like a PHP site. The _posts folder is where you put your posts (if you're making a blog), and _layouts is going to allow us to store different layouts for different pages. You should already have a post in your _posts subdirectory, so take note of the title format. Mine is entitled 2014-01-18-welcome-to-jekyll.markdown. It's important to title each of your posts in the YYYY-MM-DD-slug format, with everything separated by dashes. Jekyll is going to use this format to create your post's URL and store its date. Finally, if you want to make any other pages, like "About" or "Contact", you do so simply by adding a folder with the name that you want to appear in the URL of the page. Then, you write your page as the `index.html` of that subdirectory.

In the _layouts subdirectory you should already have a couple of files, `default.html` and `post.html`. If you open them up you'll find some pretty basic HTML surrounding an interesting little element {% raw %}`{{content}}`{% endraw %}. This wierd little piece of bracketed code is a [Liquid template tag](http://liquidmarkup.org/), and it's going to help fit our different files together. Everytime we create a page with Jekyll, we have to tell it what layout to use, and if we go with the default, Jekyll is going to generate a new file consisting of everything in `default.html` *plus* the content of the page. If we want to simplify our layout page even more, we can cut all of the HTML above {% raw %}`{{content}}`{% endraw %} and paste it into `_includes/header.html`, and all the HTML below can got into `_includes/footer.html`. This leaves us with three lines of code in `_layouts/default.html`:

{% highlight html %}
{% raw %}
{% include header.html %}

{{ content }}

{% include footer.html %}
{% endraw %}
{% endhighlight %}

When we build the site, however, Jekyll is going go to the _includes directory and get those files, and then put them together with our content. So far so good, right? But what exactly is our content, and where can we find it?

The heart of a Jekyll blog is the loop, which lives in `index.html` in the project's root dircetory. Your file should look something like this:

{% highlight html %}
{% raw %}
---
title: Home
layout: default
---

	<h2>This is the home page</h2>

	{% for post in site.posts %}
	
		<h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
		
		<p class="meta">{{ post.date | date_to_string }}</p>
		
		{{ post.content }}
		
	{% endfor %}
{% endraw %}
{% endhighlight%}

For now we'll ignore the HTML and focus on the Jekyll-specific code. First of all, at the very top of the file we have the Front Matter between two sets of three dashes. The first is the page title, which will now be available to us as a variable. The second is just where we tell Jekyll to use `_layouts/default.html` when generating the page.

In between the {% raw %}`{% %}`{% endraw %} tags we find a good old fashioned for loop that allows us to print out the content and other information for each post. Jekyll will repeat everything between {% raw %}`{% for post in site.posts %}` and `{% endfor %}`{% endraw %}, for every post you have. If you want to limit the number of posts displayed, just use something like {% raw %}`{% for post in site.posts limit:1 %}`{% endraw %}. This will tell Jekyll to only show the most recent post, whereas `limit:5` will display the five most recent.

You will also notice the some more Liquid tags: {% raw %}`{{post.url}}`, `{{post.title}}`, `{{post.content}}`{% endraw %}, etc. These are variables associated with each post; the date and the title are defined in the Front Matter, and the URL is defined by the slug portion of the file name. If you don't enter a date in the Front Matter, Jekyll will use the date in the file name. The content is then everything below the Front Matter, processed into HTML. So in the code above we're telling Jekyll to take the most recent post and print its title as a link pointing to the post's own URL. Below that we tell it to take the post's date, convert it to a human-friendly string, and print it, followed by the posts content. After we're done with all that we use the {% raw %}`{% endfor %}`{% endraw %} to close the loop. As I said, you can print as many entries as you want on this page. If you just wanna break 'em off a little preview of the remix, you can use {% raw %}`{{post.excerpt}}`{% endraw %} to print an excerpt of your post, or something like {% raw %}`{{post.content | truncatewords: 30}}`{% endraw %} if you want to control the exact number of words displayed.

So now you've got your `_includes/header.html`, `_includes/footer.html`, `_layouts/default.html`, at least one post (YYYY-MM-DD-url-friendly-title.ext) in _posts, and a simple `index.html` in the root of your project folder to bring it all together with the loop. All you have to do now is again run `jekyll serve` in the command prompt and you'll see your new site! You may have noticed that we haven't touched the _site subdirectory; that's where Jekyll puts the generated site. You give it the pieces of the puzzle, and it fits them together. Just copy the contents of this folder when you want to put your site online.

Final thing that I want to mention before signing off is the `_config.yml` file. Mine looks like this:

{% highlight yaml %}
name: John Willard
description: A blog by John Willard
markdown: redcarpet
pygments: true
permalink: pretty
url: "http://jgwil2.github.io"
{% endhighlight %}

You can define variables here that will be available site-wide, such as {% raw %}`{{site.name}}`{% endraw %} and {% raw %}`{{site.url}}`{% endraw %}, which can also come in handy. And finally, setting `permalink` to `pretty` will cause Jekyll to create a subdirectory with the name of your slug, and your post will be found at the index of that subdirectory. That way, instead of "site/2014/01/22/building-the-blog.html," you'll have a nice clean URL without that extension: "/2014/01/22/building-the-blog/".

So that is a really quick treatment of Jekyll and what I did with it. Check out the [documentation](http://jekyllrb.com/docs/home/) or [this tutorial](https://learn.andrewmunsell.com/learn/jekyll-by-example/introduction) for more info. In a coming post I'll talk about using the Foundation 5 framework for the front-end of the site, and I'll try to tackle whatever else comes along too. Please don't hesitate to comment if you have any other knowledge to drop, or I'm missint something, or I'm just dead wrong about something. Thanks for reading!
