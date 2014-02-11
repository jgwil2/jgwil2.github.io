---
title: An Intro to PDO
layout: post
---

<div id="cookie-trick" class="reveal-modal" data-reveal>
<p>To set a cookie in <code>minichat_post.php</code>, I just run a quick test to see if a cookie is already set, and if it is, whether it's equal to the username that has just been submitted. If there is no cookie, or if the cookie does not correspond to the username, then I set a cookie to that name:</p>

	{% highlight php %}
	<?php
	if((!$_COOKIE['username']) || ($_COOKIE['username'] !== $_POST['username'])){ // If the cookie is not set or does not equal the current username, set cookie.
		setCookie("username",$_POST['username'],time()+3600*24*365);
		}
	?>
	{% endhighlight %}
	<br />
	
	<p>Then, back in <code>minichat.php</code>, I just add this bit of code to the form:</p>
	
	{% highlight html+php %}
	<input type="text" required name="username" value="<?php if(isset($_COOKIE['username'])){echo htmlentities($_COOKIE['username']);}?>" />
	{% endhighlight %}
	<br />
	
	<p>Now whatever has been entered as a username will be stored in the cookie, and the user will be spared having to rewrite it before every message. If no cookie has been set, as in the case of a totally new user, the PHP won't do anything and the field will remain empty.</p>
	<a href="#" class="close-reveal-modal">&#215;</a>
</div>

One of the first projects that I did with MySQL was this "minichat." It is sort of a chatroom application that takes user input, stores it in a database, and then displays it back to the user. It's very basic but it gave me a chance to use PHP to read and write into a database, and do a couple of other neat things, too. I used PDO (PHP data objects) to access the database, which is a really cool technique because it works with any kind of SQL database. The whole project consistes of two small files, `minichat.php`, which prints out the contents of the database (earlier messages, the user who sent them, and the time at which they were sent) as well as the form for submitting new messages, and `minichat_post.php`, which contains the code that will write the data into the database and redirect the user back to the chat page.

The first thing to do when working on a project like this is of course to set up the table in the database. As mentioned, I have three values that I want to store: username, message, and the time when the message was submitted. In addition, it's usually a good idea to get a generic 'ID' value and auto-increment, so that each item in the database has a unique identifier. So I fired up Apache and MySQL, navigated over to localhost/phpmyadmin (I'm using [XAMPP](http://www.apachefriends.org/index.html)). opened up my 'test' database, and ran something like the following code:

{% highlight mysql %}
CREATE TABLE IF NOT EXISTS minichat(
	`ID` INT( 11 ) NOT NULL AUTO_INCREMENT ,
	`username` VARCHAR( 255 ) ,
	`message` TEXT,
	`datetime` DATETIME,
PRIMARY KEY ( ID )
)
{% endhighlight %}
<br />
This code creates a table with four columns: 

* The `ID` column has the type `INT` (integer), and everytime we add an entry to the table this value will increase by one, so that the first entry will have an `ID` of `'1'`, the second `'2'`, etc. 
* The `username` column is `VARCHAR(255)`, meaning it will contain a character string up to 256 characters long. 
* The `message` column is defined as `TEXT`, which can contain a whole lot of characters, far more than we will need, but it's always better to err on the side of caution. 
* Finally, `datetime` column has type `DATETIME`, which stores the date and the time as a value in `'YYYY-MM-DD HH:MM:SS'` format (later we'll be able to clean it up for human consumption).

The little `PRIMARY KEY` bit at the end just means that I'm using `ID` as the unique identifier for each record, and without it the code won't work. `AUTO_INCREMENT` ensures that it will always be unique.

Now that the table has been created, the fun begins! I created the PHP documents and got to work on `minichat.php`, the page that will display the chat and allow users to fill out the form. To make it easier to test, I also entered a few records into my table directly via phpmyadmin, so that I would have some actual data to read. I also set up the HTML document with some styles in the header, just so that everything will line up the way i want it (username/message on the left, time on the right):

{% highlight html %}
<DOCTYPE html>
<html>
	<head>
		<title>Minichat</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<style>
			body{line-height: 1.75em}
			.time{display: inline-block; float: right}
			.message{display: inline-block; width: 60%}
		</style>
	</head>
	<body>
	
	</body>
{% endhighlight %}
<br />
The next thing to do in the document is connect to the database with PDO, which is done with the following code:

{% highlight php %}
<?php
try{
		$db = new PDO('mysql:host=localhost;dbname=test','root',''); // Connection to database.
	}
	catch(Exception $e){
		die('Error: '.$e->getMessage());
	}
?>
{% endhighlight %}
<br />
This code creates a new data object, `$db`, or, in the event of a problem, stops executing and prints the error (the `die()` function). As you see, the PDO object takes a number of parameters: the first one contains information about the database (including the name of the database to access, which in this case is `'test'`). The second and third are the username and password that allow access to the database; as I am using XAMPP locally, the default values are 'root' and '' (no password), but of course if this were to go online it would have to have some real credentials associated with it. 

The next move, is to actually write a SQL query to pull some data out of the PDO. The table `'minichat'` has four columns, but I only need data from three of them, so my query will look like this:

{% highlight php %}
<?php
$que = $db->query('SELECT username, message, DATE_FORMAT(datetime, \'%e/%c/%Y %r\') AS date FROM minichat ORDER BY ID') or die(print_r($que->errorInfo())); 
?>
{% endhighlight %}
<br />
Pretty straightforward until that `DATE_FORMAT` bit, right? Actually, that's a MySQL function that let's us reformat that ugly `DATETIME` format into something human-readable. The parameters of the function are the column to be reformatted, and the format that we want to give it. Each of the `'%'` symbols followed by a letter indicates a different way of representing some aspect of the date and time. So here `'%e/%c/%Y'` is going to show the date as 'MM/DD/YYYY', in the American style, and `'%r'` will print the hour, minute, and second in a twelve-hour, AM/PM format (the time is stored in the 24-hour format in the database). The `DATE_FORMAT()` function can be used to [display the date and time in any format you could want](http://www.w3schools.com/sql/func_date_format.asp), so it is a very useful tool. We use `AS date` so that we can access the reformatted data in the key `'date'` (more on that later). The `ORDER BY ID` code will just make sure that the entries are ordered from oldest to most recent. This order can be reversed by adding `DESC` for "descending." Finally, the `die()` function will stop the code if there's an error and print the relevant info.

The last thing to do is to iterate over the records from the database and print them on the screen. To do this I used a `while` loop, along with the PDO `fetch()` method, which will read the selected entries row by row, return the results in an array, and then return 0 when there are no more entries, halting the loop:

{% highlight php %}
<?php
while($data = $que->fetch()){
		echo '<div class="message">'.$data['username'].': '.$data['message'].'</div><div class="time">'.$data['date'].'</div>';
	$que->closeCursor();
?>
{% endhighlight %}
<br />
So for each row of data, I `echo` the values corresponding to the keys `'username'`, `'message'`, and `'date'`, and at the end the `closeCursor()` method resets the cursor for another loop.

And that's it for the reading the database. To allow the user to write in the database I am going to use an HTML form that will send the data to `minchat_post.php`, which will contain the query that will insert new entries into my table. The form will look like this:

{% highlight html %}
<form method="post" action="minichat_post.php"> <!-- Form sends information to the posting page. -->
		<p>Username:</p>
		<p>
			<input type="text" required name="username" /> <!-- username will be transmitted as $_POST['username']-->
		</p>

		<p>Message:</p>
		<p>
			<textarea type="text" required name="message" rows="5" cols="40"></textarea> <!-- message will be transmitted as $_POST['message']-->
		<p/>
	
		<p>
			<input type="submit" value="Enter"/>
		</p>
		</form>
		<a name="bottom"></a>
{% endhighlight %}
<br />
Now that the user has provided some input, it's time to have a look at the `minichat_post.php` page, which recovers the data from the form and writes it into the database. In this document I first connect to the database again, then recuperate the user data and modify it a bit:

{% highlight php %}
<?php
$username = trim($_POST['username']);
$message = trim($_POST['message']);
?>
{% endhighlight %}
<br />
The `trim()` function just takes off any extra spaces at the end of the character strings. The last thing to do here is to write the data into the database and redirect the user to the display page, `minichat.php`. For security purposes, I'm going to write the data in using a prepared query, so there will actually be two lines here instead of just one:

{% highlight php %}
<?php
$que = $db->prepare('INSERT INTO minichat(username, message, datetime) VALUES(:username, :message, NOW())'); // Prepare request with variables. New row w/username and message.
$que->execute(array(
	'username' => $username, // Execute request with variables from the form in minichat.php
	'message'  => $message 
	)) or die(print_r($que->errorInfo()));
?>
{% endhighlight %}
<br />
Instead of the `query()` method, I have used the `prepare()` method to set up the insert with the values represented by the variables `:username` and `:message`; the `execute()` method defines these variables. Instead of manually writing in some value for the `datetime` column, I just used the function `NOW()`, which returns the current time, properly formatted for insertion into the database. After all of this is done, a little redirect will send the user back to the display page, where the new message should be printed out:

{% highlight php %}
<?php
header('Location: minichat.php#bottom'); // Redirect back to bottom of minichat.php, where the form and most recent messages are situated.
?>
{% endhighlight %}
<br />
And those are the basics of PDO. Admittedly, this is a very limited app. The biggest defect is of course the fact that you would need to reload the page everytime someone writes a new message into the database. Other issues I didn't approach here include pagination for long chats and a registration and login interface for usernames (as a quick and easy substitute, I used <a href="#" data-reveal-id="cookie-trick">this little bit of code</a> to automatically fill the username field in the form with a cookie). But the basics are all there. Take a shot at improving this code, and let me know what you learn. Are there other features that could be added that would make it better?