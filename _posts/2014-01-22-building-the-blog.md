---
title: Building the blog
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

* Jekyll
* Foundation
* GitHub Pages
* Frills (JavaScript, comments, etc.)

So I'll get started with [Jekyll](http://jekyllrb.com/), a "simple, blog-aware, 
static site generator" (in their own words). Jekyll is the engine behind this 
site. If you've ever worked with WordPress themes, the concept of Jekyll should 
be familiar to you: it takes your posts, runs them through a loop, and spits 
them back out with whatever formatting you want to use for them. The difference 
is that while WordPress is written in PHP, and pages are assembled dynamically 
each time a client makes a request, Jekyll is written in Ruby and it only 
assembles your pages when you ask it to. Then, you take the static pages and put 
them online, and what you get is a site that appears to be dynamic, but actually 
isn't. This will allow you to get higher performance without all the 
complications of caches, databases and everything else that needs to be fine-
tuned with a dynamic content management system.

Sounds great, right? Unfortunately, setting up Jekyll isn't as easy as other 
CMS's, and you will have to write some code (and mess around in the terminal!). 
It also doesn't officially support Windows, so it was a little tricky to get the 
thing up and running. If you're a Windows user like me, the first thing you'll 
most likely have to do is install [Ruby](http://www.ruby-
lang.org/en/installation) and the Ruby Development Kit. Then you'll also want to 
install [Python](http://www.python.org/download/) in order to enable Pygments 
with Jekyll. Pygments is a syntax highlighter (just tell it what language you're 
using) and although you can use Jekyll without it, if you're using Jekyll as 
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
and files you need to get Jekyll running set up. To see what it looks like, `cd` 
into the newly created directory and run the command `jekyll serve`. Jekyll 
should generate the site and start serving at Port 4000. So open up a new window 
in your browser, navigate to localhost:4000, and voilà! You'll have a little 
demo site explaining some of Jekyll's functionalities.

### Making the site

Now let's dig into the site itself.