---
title: Contact Page With Heroku and Mandrill
layout: post
---

In this post I'm going to talk about setting up this site's contact page. The idea is pretty basic in a normal web application: I have a form that I want users to be able to fill out and send, and then I want that information emailed to me so that I can get back to them. However, this is complicated by the fact that this is Jekyll and GitHub Pages; the server can only serve static HTML, which means that for emailing I have to find an alternative solution. For me, this solution ended up being a simple application hosted on [Heroku](https://www.heroku.com/). The application, written in Python with the [Bottle](http://bottlepy.org/docs/dev/index.html) framework, takes the contents of the form submitted by the user and emails them to me via a [Mandrill](http://mandrill.com/) account. Both of these services are free at such a low usage level and they're both really easy and useful.

The contact form went through a couple of evolutions. At first I was using [fwdform](https://github.com/samdobson/fwdform) to send the emails. It was really easy to set up; you just register and submit your form to a URL with the token that you're given. The problem was that after the form submit it redirects you to a really simple thank you page on another domain and then the user has to hit the back button to return to the site. Not the best user experience. So basing my application on the fwdform code, I wrote my own Python app that would redirect to a thank you page on my site. Running the app on Heroku is pretty easy; you just have to install Python and [virtualenv](http://virtualenv.readthedocs.org/en/latest/), install the dependencies in the virtual environment, and then write them out to `requirements.txt`. You can find more information at the [Heroku Dev Center](https://devcenter.heroku.com/). Here is a sample of what that looked like:
{% highlight python %}
import bottle
import cgi
import re
import mandrill
import os

mandrill_client = mandrill.Mandrill('mandrill-api-key')

@bottle.post('/')
def send_mail():
	destination = 'jgwil2@gmail.com'
	name = bottle.request.forms.get('name')
	email = bottle.request.forms.get('email')
	message = bottle.request.forms.get('message')

	form = {
				'to': [{'email': destination}],
				'from_email': email,
				'subject': 'Message from ' + name,
				'text': message
			}

	result = mandrill_client.messages.send(message=form)
	if result[0]['status'] != 'sent':
		abort(500)

	return bottle.redirect('http://jgwil2.github.io/contact/thanks')

bottle.debug(True)
bottle.run(host='0.0.0.0', port=int(os.environ.get('PORT',5000)))
{% endhighlight %}
Then on the contact page, I just set up a form to point at my app:
{% highlight html %}
<form action="http://my-cool-app.herokuapp.com/" method="post">
<div class="row" >

	<div class="large-12 columns" id="formRow">
		
		<p>Email: <input type="text" name="email" required></p><br />
		<p>Name: <input type="text" name="name" required></p><br />
		<p>Message: <textarea name="message" cols="40" rows="10"></textarea></p><br />
		<input type="submit" value="Send Message">
		
	</div>

</div>
</form>
{% endhighlight %}
Definitely better, but still a little old school. What I really wanted to do was to send the form asynchronously and then just post a success message to the user when it's sent. The problem with this approach is that most servers will not accept asynchronous requests from another domain. This is called [Cross-origin resource sharing (CORS)](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) and it has to be explicitly enabled in the response headers. To do this in Bottle, all we need to do is import the hook plugin and set up a callback function to be executed after each request:
{% highlight python %}
import bottle
from bottle import hook, response
import cgi
import re
import mandrill
import os

@hook('after_request')
def enable_cors():
	response.headers['Access-Control-Allow-Origin'] = '*'
# ...
{% endhighlight %}
I also changed the response from a redirect to a dictionary, which will be converted to a JSON object:
{% highlight python %}
# ...
	result = mandrill_client.messages.send(message=form)
	if result[0]['status'] != 'sent':
		abort(500)

	return {'message': 'Thank you! Your message has been sent succesfully.'}

# ...
{% endhighlight %}
This will make it easy to display the message to the user with some JavaScript. All we need to do now is add the asynchronous post request and handle a response. In my `_includes/footer.html` file I put the following code:
{% highlight javascript %}
{% raw %}
{% if page.url == "/contact/" %}
<script>
$(document).ready(function(){
	$('form').submit(function(event){
		var formData = {
			'email': $('input[name=email]').val(),
			'name': $('input[name=name').val(),
			'message': $('textarea[name=message]').val()
		};
		$.ajax({
			type: 'POST',
			url: 'http://my-cool-app.herokuapp.com/',
			data: formData,
			dataType: 'json',
			encode: true,
			success: function(data){
				$('#formRow').append(
					'<div data-alert class="alert-box success radius">'
					+ data.message
					+ '<a href="#" class="close">&times;</a></div>'
					);
				$(document).foundation();
			}
		});
		event.preventDefault();
	});
});
</script>
{% endif %}
{% endraw %}
{% endhighlight %}
The JS will take the data from the form and submit it asynchronously to the Python app's URL. The Python app replies with the JSON object containing the key `message` and the value to display to the user. When the site recieves this reply it will add an alert containing the massage. The `foundation()` method is then called again so that the new alert component will be initialized, allowing the user to close it. `event.preventDefault` just stops the form from being sent via a regular post request. For error handling, you can also add a second `error` callback function.