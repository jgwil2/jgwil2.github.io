---
title: "Building the Blog, Part 2"
layout: post
published: true
---

This post will be the second to tackle the creation of this blog. [The first post](/2014/01/22/building-the-blog/) mostly dealt with setting up Jekyll, from installation to file structure. In this section I'm going to talk about using the front-end framework [Foundation 5](http://foundation.zurb.com/) to provide the basic layouts of the site. Foundation is similar to [Bootstrap](http://getbootstrap.com/): it is a mobile-first, responsive framework built on a grid system, and it provides a stylesheet + tons of JS that you can use to get a prototype up and running in minutes. All you need to do is read the documentation and write the HTML, and the framework will take care of the rest. Later, you can customize the framework or override it with your own CSS. I had been wanting to get some experience using a responsive framework for a while, so I took a look at some tutorials and then got started writing HTML.

I started, naturally enough, with the home page at `index.html`. As you may recall, Jekyll works by separating different parts of a page in the _includes folder, which are organized into different layouts in the _layouts folder. Every page that you write will then specify what layout it needs to have at the very top:

```
---
title: Home
layout: default
---
```
<br />
And the file at `_layouts/default.html` just contains this:

```
{% raw %}
{% include header.html %}

{{ content }}

{% include footer.html %}
{% endraw %}
```
<br />
So when the final `_site/index.html` page is assembled by Jekyll, it's going to consist of whatever code is in `_includes/header.html`, followed by the content of `index.html`, and then the code from `_includes/footer.html`. So the first thing to do is write up a header with Foundation and put it in the _includes folder. To make things super easy, Foundation even provides [templates](http://foundation.zurb.com/templates.html) to get you started. For this example I'm going to use the "blog" template, which looks like this:

<figure>
	<img alt="Screenshot of Foundation blog template" src="/img/found_template_screen.png" />
</figure>
<br />
 Take a look at the HTML used to construct this page. If you're familiar with HTML, but you haven't used responsive frameworks before, some of the markup might seem strange. The most important thing to remember is that Foundation, like Bootstrap, is built on a grid system: content is organized into rows and columns which the framework will move around to fit any screen size. So all content has to be inside of a `<div class="row">`. The children of rows are always columns, and you can define the width of columns with numbers adding up to 12. So inside of a `<div class="row">`, you might have a `<div class="large-9 columns">` and a `<div class="large-3 columns">`. Or you might have two `<div class="large-6 columns">`. As long as the width of all columns in a given row adds up to twelve, you're good.

 Now that you've got the basics of Foundation, I'm going to use this template to create a new look for the blog. Let's start with `header.html`.

 The first thing to do is add a little `<head>` section to link the Foundation CSS (I'll also leave a link to Jekyll's `syntax.css`, so we can take advantage of Pygments syntax highlighting). I can even take advantage of Jekyll's Liquid variables to print the name and description of the site:

{% highlight html %}
<!doctype html>
<html class="no-js" lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{% raw %}{{ site.name }}{% endraw %}</title>
	<meta name="description" content="{% raw %}{{ site.description }}{% endraw %}"/>
    <link rel="stylesheet" href="/css/vendor/foundation.min.css" />
    <link rel="stylesheet" href="/syntax.css" />
  </head>
{% endhighlight %}
<br />
Then, I open up a `<body>` tag, and I drop the code from the template right in:

{% highlight html %}
<body>
   <!-- Nav Bar -->
 
  <div class="row">
    <div class="large-12 columns">
      <div class="nav-bar right">
       <ul class="button-group">
         <li><a href="#" class="button">Link 1</a></li>
         <li><a href="#" class="button">Link 2</a></li>
         <li><a href="#" class="button">Link 3</a></li>
         <li><a href="#" class="button">Link 4</a></li>
        </ul>
      </div>
      <h1>Blog <small>This is my blog. It's awesome.</small></h1>
      <hr />
    </div>
  </div>
 
  <!-- End Nav -->
{% endhighlight %}
<br />
For `footer.html` I can do the same thing, closing the `<body>` tag at the end:

{% highlight html %}
  <!-- Footer -->
 
  <footer class="row">
    <div class="large-12 columns">
      <hr />
      <div class="row">
        <div class="large-6 columns">
          <p>© Copyright no one at all. Go to town.</p>
        </div>
        <div class="large-6 columns">
          <ul class="inline-list right">
            <li><a href="#">Link 1</a></li>
            <li><a href="#">Link 2</a></li>
            <li><a href="#">Link 3</a></li>
            <li><a href="#">Link 4</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</body>
{% endhighlight %}
<br />

These two files will bookend every page that has `layout: default` set in its front matter. Now all I have to worry about is the `{% raw %}{{ content }}{% endraw %}` of the page.

If you read Part 1, you'll recall that the core of the home page of a blog is "the loop," that little bit of code that goes to the most recent posts and prints out information about them, one by one. Typically, this information would include the title, date of publication, and either a summary or a preview of the post, or the post itself. So if you've already got a few dummy posts (one should be generated by Jekyll when you create a new project), the only thing you need to put in the content area is the loop itself, and then Jekyll will take care of the rest. For this project, I'll drop a basic loop right into the Foundation template, replacing their dummy content with Jekyll's posts:

{% highlight html %}
{% raw %}
  <!-- Main Page Content and Sidebar -->
  <div class="row">
 
    <!-- Main Blog Content -->
    <div class="large-9 columns" role="content">

 	{% for post in site.posts %}
	<article>
	  <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>	
	  <p class="meta">{{ post.date | date_to_string }}</p>
	{{ post.content }}
	</article>

	<hr />
	{% endfor %}
 
    </div>
    <!-- End Main Content -->
 
    <!-- Sidebar -->
    <aside class="large-3 columns">
 
      <h5>Categories</h5>
      <ul class="side-nav">
        <li><a href="#">News</a></li>
        <li><a href="#">Code</a></li>
        <li><a href="#">Design</a></li>
        <li><a href="#">Fun</a></li>
        <li><a href="#">Weasels</a></li>
      </ul>
 
      <div class="panel">
        <h5>Featured</h5>
        <p>Pork drumstick turkey fugiat. Tri-tip elit turducken pork chop in. Swine short ribs meatball irure bacon nulla pork belly cupidatat meatloaf cow.</p>
        <a href="#">Read More →</a>
      </div>
 
    </aside>
 
    <!-- End Sidebar -->
  </div>
 
  <!-- End Main Content and Sidebar -->
{% endraw %}
{% endhighlight %}
<br />
Now I'll go to the terminal and run `jekyll serve`, and I have this:

<figure>
	<img alt="My Jekyll blog with the Foundation template" src="/img/found_jekyll_screen.png" />
</figure>
<br />
You might have noticed that I just went ahead and threw both the main content and the sidebar area into `index.html`. If we wanted to get even fancier, we could put the HTML for the sidebar into a separate `sidebar.html` file in the _includes folder, and modify `_layouts/default.html` so that it would look like this:

```
{% raw %}
{% include header.html %}

{{ content }}

{% include sidebar.html %}

{% include footer.html %}
{% endraw %}
```
<br />
Feel free to give it a shot; it will give you even more freedom when you start constructing new layouts. Just remember that in order for it to work with Foundation, each row has to have 12 columns. Sometimes that can be hard to keep track of when you're throwing different files together on the fly. 

If this post interested you, go and check out the Foudation docs: they've got tons of cool stuff that can make development easier and more fun. Next steps might include using the Foundation Sass to customize your site's look and adding some different web fonts; one problem with frameworks like this is that they tend to all look the same if you don't add a little personal flair. Let me know what you learn!