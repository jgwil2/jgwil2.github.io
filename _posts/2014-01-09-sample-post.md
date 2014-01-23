---
title: Sample Post
layout: post
---

Welcome to my new blog built with Jekyll and Foundation 5. This is just an example page that I created to familiarize myself with the technologies. I hope to get the real thing up and running soon!

{% highlight php linenos %}
<?php
try{
	$bdd = new PDO('mysql:host=localhost;dbname=test','root','');
}
catch(Exception $e){
	die('Error: '.$e->getMessage());
}
$req = $bdd->prepare('INSERT INTO minichat(username, message) VALUES(:username, :message)');
$req->execute(array(
	'username' => htmlentities($_POST['username']),
	'message'  => htmlentities($_POST['message'])
	));
header('Location: minichat.php#bottom');
?>
{% endhighlight%}
<br />
Proin eleifend libero accumsan felis luctus nec consectetur purus commodo. 
Phasellus sodales est nec massa imperdiet commodo. Maecenas risus nulla, pl
acerat vel vestibulum vel, dapibus quis libero.

{% highlight ruby %}
def foo
  puts 'foo'
end
{% endhighlight %}
<br />
Donec libero libero, bibendum non condimentum ac, ullamcorper at sapien. Du
is feugiat urna vel justo cursus facilisis. Vivamus ligula dui, convallis a
 varius vitae, facilisis eget magna.