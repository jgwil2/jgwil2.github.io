---
title: Creating a Password-Protected Site with PHP
layout: post
---

Recently I was working on a project that involved creating a user-interface for maintaining and updating a database. I wanted all visitors to be able to consult the database and execute searches, but I only wanted to allow authorized users to be able to update entries and insert new entries. Since I wanted to make certain actions only available to known users, I was trying to figure out the best way to securely store and verify passwords. Fortunately, PHP has some features that make this pretty easy to do. The first of these are [PHP sessions](http://www.php.net/manual/en/book.session.php). Basically, when you open a session, the server will create an ID that will allow it to store variables that are accessible to all pages of an application. You can set a session variable when your user signs in and the variable will stay there until your user destroys the session by signing out. 

Another feature that makes authentification easy is that PHP has hash functions built right in. Hashing means one-way encryption that is necessary for storing and verifying sensitive information like passwords. When you get a user to register with a password, you should never store this password as plaintext. In fact, you shouldn't ever have access to the plaintext version, because if you can get it someone else may be able to as well. But just hashing isn't enough; you should also add a "salt," an extra character string that is concatenated to the password. This combats the use of rainbow tables, which are lists of plaintext passwords and their corresponding hashes. Without a salt, the same password encrypted by the same algorithm will result in the same hash everytime, rendering common passwords useless if someone gets their hands on the hash. Salts prevent this by adding more characters that will be scrambled up by the algorithm, resulting in a different hash. But again, this is not enough; the salt also needs to be randomly generated and different for every password (__Caveat emptor__: I am not a security expert by any means; everything here is based on what I have read to be the best security practices. This is just my implementation of them). It sounds complicated, but PHP can take care of all of this for you with some of its built-in functions. In this post, I am going to give an example PHP application that is password-protected using these PHP features.

The first thing I'll talk about is the file structure for the app. Let's say we're dealing with a single page app. In addition to the `index.php` file and a `connect.php` file that connects to a database, I have three other files that are linked to security: `auth.php` provides a login form for the user; `verif.php` will get username/password combinations from the database and compare them to the user's input; and `kill.php` will be called when the user logs out. When a user is logged in, a link to `kill.php` is shown on the index page; when a user is not logged in, a link to `auth.php` is shown:

{% highlight html+php %}
<?php
session_start();
if(!isset($_SESSION['login'])){
	echo '<a href="auth.php">Sign in</a>';
}
else{
	echo '<a href="kill.php">Sign out, '.$_SESSION['login'].'</a>';
}
?>
{% endhighlight %}
<br />
As you can see, the very first thing that appears on the page is the `session_start()` function; calling this function will allow us to access session variables, and it has to be called immediately, before writing any HTML. Once the session is started we have access to the variable `$_SESSION['login']`, which will contain the user's name. The if/else statement then displays a link inviting the visitor to sign in if the `$_SESSION['login']` variable is empty; if this is not the case, and the user is already logged in, a link to `kill.php` is displayed, along with the user's name. Now, everytime we want to limit an action to a signed in user, we simply run the same test:

{% highlight html+php %}
<?php
if($_SERVER['REQUEST_METHOD'] == "POST"){
	if(isset($_SESSION['login'])){
		// run some code to update the database
	}
	else{
		// send the user a message saying they must sign in to do this
	}
}
?>
{% endhighlight %}
<br />
The first if statement will make sure that the user has actually posted data to the server; the second will determine if the user is logged in, and will process the data if that's the case. If not, the user will be invited to log in before completing this action. That's pretty much it for the index page. Now let's have a look at the login page, `auth.php`. At its most basic, this will just be an HTML form pointing to the verification page:

{% highlight html+php %}
<h2>Login</h2>
<form role="form" action="verif.php" method="post">
	<label>Username</label>
	<input type="text" placeholder="Username" name="login" required>
	<label>Password</label>
	<input type="password" placeholder="Password" name="pass" required>
	<button class="btn btn-primary" type="submit">Sign in</button>
</form>
{% endhighlight %}
<br />
Whatever information the user inputs here will be sent to the verification page, and that's where it gets interesting. As mentioned earlier, passwords should never ever be stored in plaintext in a database. Instead, we store an encrypted version of the password called a hash, with a randomly generated salt attached to it. It looks somthing like this: 

```
$2y$10$qsyC0jX1UurGta94KFpXVuXKGyPjM082rnWh.8jMnqTrQwmMwRuoO
```
<br />
Scary, right? But there's no need to do this by ourselves! PHP offers [two functions that make this super easy](http://www.php.net/manual/en/function.password-hash.php) : `password_hash()` and `password_verify()`. The former is used to generate a hash with a salt; you can pass the salt in as a parameter but if you don't it will randomly generate one for you. You can also choose the hashing algorithm if you want, but it is recommeneded to use the default, which is currently bcrypt but may change over time. The really cool thing about this function is that the hash that it generates contains character strings indicating the algorithm and the salt used, so you have everything you need to test a user password against it. This is done using `password_verify()`, which takes two parameters: a plaintext password and a hash. It will use the salt and algorithm indicated by the hash to re-encrypt the password it's given, and then if it gets the same hash it returns `true`. Let's have a look at how that all fits together in `verif.php`:

{% highlight php %}
<?php
session_start();

function verification($user, $pass){

	require 'connect.php'; // connect to database
	$req = $bdd->prepare('SELECT user, pass FROM login WHERE user = :user');
	/* search db for username, get username and hash */
	$req->execute(array(
		'user' => $user
		))or die(print_r($req->errorInfo()));

	$rows = $req->fetchAll();

	$req->closeCursor();

	foreach($rows as $row){
		$hash = $row['pass']; // hashed password

		if(password_verify($pass, $hash)){ 
			return true; // return true if password matches hashed password
		}
		else{
			return false;
		}
	}
}

if(!empty($_POST['login']) && !empty($_POST['pass'])){
	$login = $_POST['login'];
	$pass = $_POST['pass'];
	if(verification($login, $pass)){ // if password is correct...
		$_SESSION['login'] = $login; // set session variable 'login' to username
		header('Location: index.php'); // redirect to index page
	}
	else{
		// incorrect username/password combination
	}
}
else{
	// username/password not entered
}
?>
{% endhighlight %}
<br />
The `verification()` function does most of the heavy lifting here; it takes a username and goes into the database (MySQL in my case) to see if it finds any matches (for more information about using MysSQL with PHP, check out [the manual](https://php.net/manual/en/mysql.php) or [my previous post](/2014/02/02/intro-to-pdo/) on using PDO). Then it grabs the hash associated with that username and compares it with the password submitted by the user. If it's a match, the function returns true, and a session variable is set. This variable, again, will be accessible to all the pages in the application, as long as they call the `session_start()` function. After the session variable is set, the page redirects the user back to the index. If the password isn't a match, you can send the user back to the login page with a message indicating as much.

The last thing to have a look at is the logout page, `kill.php`. This page is really simple:

{% highlight php %}
<?php
session_start();
session_destroy();
unset($_SESSION['login']);
header('Location: auth.php')
?>
{% endhighlight %}
<br />
The function `session_destroy()` will destroy all of the data associated with the session. Then `unset()` will empty `$_SESSION['login']` (this is a precaution that should only apply to older versions of PHP). Again, we redirect to the login page. The user will now have to log in again in order to do any of the restricted actions.

One thing missing from this write-up is a registration page; it wasn't really necessary to my project, as I wanted to be the only person making changes to the database via the interface. But if you did want to start registering users, you have everything you need to implement it right here. You would get the user to enter a username and password, checking the database to make sure that the username wasn't already taken. Then, you would run the password through `password_hash()` before storing the resulting hash in the database. You could also store password hints or something like that if you wanted, because if the user forgets his or her password, _you have no way of looking it up_. Although this might seem like an inconvenience, your users will certainly be pleased if your database ever gets hacked.

Please let me know in the comments if this was helpful, or (especially) if I'm missing anything. Thanks for reading!