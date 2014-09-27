---
title: Setting Up a Development Environment in Ubuntu 14.04
layout: post
---

Lately I've been developing on Ubuntu and I really enjoy it. Package management simplifies everything and being on a Unix-like system means that open-source technologies, for the most part, just work. I installed the operating system alongside Windows on a separate HD partition and it has quickly become my preferred development environment. I thought I would write a quick post talking about some of the things that I did to get a nice environment up and running.

### Getting the LAMP stack ###

One of the first things that you'll probably want to do is install Apache, PHP, and MySQL. The [Advanced Packaging Tool](https://help.ubuntu.com/12.04/serverguide/apt-get.html) makes this as easy as running the following commands: `sudo apt-get update` to make sure that you have the most up to date packages indexed, and `sudo apt-get install lamp-server^` to install the programs. Apache2 and MySQL will be added to the startup scripts so you don't even have to turn them on. Just check out the [Apache2 Ubuntu Default Page](http://localhost) to see that it works and get some basic info on the setup. You should also be able to run PHP and MySQL from the command line, but note that a graphical interface such as [phpMyAdmin](http://www.phpmyadmin.net/home_page/index.php) will have to be installed separately. If you want to install the stack components separately, check out [this documentation page](https://help.ubuntu.com/community/ApacheMySQLPHP) for the details.

### Setting up virtual hosts ###

Once Apache is installed, the default host is 'localhost' and its document root is located at `/var/www/html`. I found this to be an inconvenient location for my projects as it's outside of the home directory and it's owned by root. This means that everytime you want to update a file you'll have to navigate out of the home directory and and either enter your password everytime you make a change or run your editing program as the root user. To avoid these headaches I decided to set up virtual hosts in my home directory. If you keep your projects in a folder called `Projects/`, for example, you would simply go there and create a new subdirectory called `local/` or `php/` or whatever, and then configure Apache to serve the pages from that directory in addition to the default directory. You can create as many sites as you want this way.

To add virtual hosts:
<ol>
<li><p>Set up the location of new site. Add `index.html` (or `index.php`) for testing.</p></li>

<li><p>Modify `/etc/hosts` file. Add a loopback address for the new site. This means that when you visit this domain name, your request will be routed back to your local computer. The address `localhost` should already be configured; just add your own site's name below. (`127.0.0.1 <tab> sitename`)</p></li>

<li><p>Go to `/etc/apache2/sites-available/` and add a `sitename.conf` file (or just `sitename`, depending on your version of Ubuntu). Add the virtual host configuration inside this file:</p>
{% highlight apacheconf %}
<VirtualHost *:80>
	DocumentRoot /path/to/site/root
	ServerName sitename
	ServerAlias sitealias
</VirtualHost>
{% endhighlight %}
An alias is another name that your site could be known by (for example the URLs [google.com](http://google.com) and [www.google.com](http://www.google.com) both refer to the same site).</li>

<li><p>If the site root is located anywhere other than `/var/www`, `/usr/share`, or a previously whitelisted directory, go to `/etc/apache2/apache2.conf` and add root directory:</p>
{% highlight apacheconf %}
<Directory /path/to/site/root>
	Options Indexes FollowSymLinks
	AllowOverride None
	Require all granted
</Directory>
{% endhighlight %}</li>

<li><p>Run the following commands as root: `a2ensite sitename` to enable site and `service apache2 reload` (or `/etc/init.d/apache2 reload`) to activate.</p></li>
</ol>
### Editing files ###

One big challenge when using Linux is editing files with Vi/Vim. This is a text-based editor that does not have a graphical user interface and is instead used from the command line. The first thing you might want to do is just run `vimtutor` in a terminal; this will open up a tutorial that will teach you the basics. Maybe one of the coolest aspects of Vim is the ability to customize it with a `.vimrc` file. Here's mine with some basics:
{% highlight vim %}
set nu
nnoremap ; :
set autoindent
:inoremap ( ()<Esc>i
:inoremap [ []<Esc>i
:inoremap { {}<Esc>i
{% endhighlight %}
Vim will run these commands everytime it starts so that I don't have to manually type them each time. My file adds line numbers and autoindentation, maps the semicolon to the colon in normal mode (saving my pinkie finger some work pushing the shift key), and inserts a closing bracket for each opening bracket typed in insert mode, automatically placing the cursor between them.

While you're learning Vim, however, if you, like me, decide you would still like to have Sublime Text 2, that's also easy enough to do. There are two methods, apt-get and building from source. In order to install via apt-get, you just have to add the repository to your package manager by running `sudo add-apt-respository ppa:webupd8team/sublime-text-2`. Then update your packages again and install by running `sudo apt-get install sublime-text-installer`. If you prefer to build from source, check out [this article](http://www.tecmint.com/install-sublime-text-editor-in-linux/).
