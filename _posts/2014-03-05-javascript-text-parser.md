---
title: A Javascript Text Parser That Converts Numbers To Letters
layout: post
---

Inspired by a project assigned by [this tutorial](http://fr.openclassrooms.com/informatique/cours/dynamisez-vos-sites-web-avec-javascript/tp-convertir-un-nombre-en-toutes-lettres), I decided to build a little Javascript app that would take Arabic numberals like 1, 34, 973, etc. and convert them into their English written forms. Check out the completed project [here!](/projects/numberstoletters/) This was a cool project because it allowed me to learn a lot about Javascript, DOM functions, and general programming. The project as outlined in the tutorial would take only numeral input, one number at a time, but I decided that it would be cooler if a user could input an entire text with a mix of numbers and other characters, and then have the app parse that text, look for the numerals, convert them, and then reintegrate them into the output text while leaving the rest of it alone. Over the course of writing the program different problems popped up and as I fixed them, I found other things that I wanted it to be able to do. Here's what I did and why.

The first thing that I had to create was an interface that would allow the user to enter some text to be parsed. The tutorial that got me start on the project suggested the JS function `prompt()`, but since I wanted to be able to handle lots of text, I thought an HTML text area would be better. That way, the user can copy and paste text, or edit directly on the page. So I started with a basic HTML framework that looked like this:

{% highlight html %}
<html>
	<head>
		<title>Numbers To Letters</title>
	</head>
	<body>
		<h1>Transform your numbers to letters!</h1>
		<p>Enter some text below:</p>
		<div id="indiv">
			<h4>Original Text:</h4>
			<textarea id="myTextarea"  rows="5" ></textarea>
			<p><input type="button" id="inputButton" value="Enter"></input></p>
		</div>
		<div id="outdiv">
			<h4>Transformed Text:</h4>
		</div>
		<script src="numbersToLetters.js"></script>
	</body>
</html>
{% endhighlight %}
<br />
This is pretty straightforward. I made two different `div` elements, `indiv` and `outdiv`, so that I would be able to style the input and output sections separately later, and so that I would be able to use JS to add the output text in the right place. All the elements that are going to be used by Javascript are given ID's, and the script is imported at the bottom of the body element. Now that the HTML was ready, I got to get into the actual programming.

The basic idea of the app really contained two different functionalities: the first would parse the input text, looking for numerals to convert to letters. The second would handle the actual conversion itself. So I broke the program up into two functions, `parseText` and `numbersToLetters()`. The `parseText()` function would have to separate the user input text and identify numerals, which would be sent to the `numbersToLetters()` function. The `return` of this function would then replace the input value in the output. If a particular string was only partly composed of numerals, or didn't contain any at all, `parseText()` would just hang on to its value and output it the same way it came in, without calling the `numbersToLetters` function.

When I started writing `parseText`, I knew I was going to have to make use of [regular expressions](http://en.wikipedia.org/wiki/Regular_expression). This would allow the app to define a pattern to look for in each character string. Strings made exclusively of numerals would be treated differently from others. This turned out to be pretty easy; Javascript has a `RegExp` object that can be used to create new patterns. Initially I used the pattern `/^[0-9]+$/`: the carat and dollar sign demarcate the beginning and the end of the regex, the `0-9` denotes the range of possible characters, and the plus sign means there just have to be one or more of these characters. Ultimately, I decided that this regex was inadequate, as it didn't allow for any punctuation that might be adjacent to the numeral string. But more on that later.

In order for the regex to check for numeral strings, the app had to first separate the user input into manageable chunks of text. For this I used the Javascript function `split()`, which takes a character string and separates it into an array, using whatever character or regular expression you want as a separator. Once the user input has been transformed into an array, the program just has to go through the array looking for all-numeral elements. Here's what the first part of the function looks like:

{% highlight javascript %}
function parseText(userInput){

	var userInputArray = userInput.split(' ');
	var pattern = new RegExp("^[0-9]+$");

	for (var i = 0; i < userInputArray.length; i++) { 
		if(pattern.test(userInputArray[i])){ 
			userInputArray[i] = numbersToLetters(userInputArray[i]); 
		}
	}
	// ...
}
{% endhighlight %}
<br />
So `parseText()` takes as its only argument `userInput` (the character string that the user will have entered in the text area), and then immediately `split()`s it by space, so as to separate each word. Then, for each element in the newly formed array, it runs the regex test. If the element fits the pattern, the second function, `numbersToLetters()`, is called, with the element as its argument. The element in the array is then reset to the output of `numbersToLetters()`. For example, a user input of "foo bar" would be split into the array `["foo", "bar"]`. Each one will then be tested against the regular expression `pattern` via the Javascript RegExp method `test`. Since neither of these consists exclusively of numerals, they will fail the test and `numbersToLetters()` will not be called. However, in the case of a user input of "foo bar 123", the third element in the array, `userInput[2]`, will pass the test, and therefore `numbersToLetters()` will be called with "123" as its argument. Finally, the output of this function will be stored in `userInputArray[2]`, replacing the original "123" input.

At this point, assuming that the `numbersToLetters` function has done it's job correctly, the only thing left to do is to take the modified array, convert it back into a character string, and add it to the document. Fortunately, Javascript has an easy solution for this in the form of the `join()` function, which does the exact opposite of `split()`: it takes an array and turns it into a character string, taking as an argument whatever character you want to demarcate the former array elements. In this case, I just used a space again, to replace the space that was used when the user input was split. Finally, the new character string has to be displayed. I wanted to have the output be updated each time the user hits enter, so I run a quick if/else statement: if there is already an element with the ID of `'output'`, the program empties its content by setting `output.innerHTML = ''`. If there isn't yet such an element (i.e. the first time the user enters some input), the program creates a new paragraph element with `document.createElement`, gives it the ID 'output', and appends it to the 'outdiv' element in the document. Then the script takes the output character string (`userOut`) and appends it to the 'output' element. All together, it looks like this:

{% highlight javascript %}
function parseText(userInput){
	var userInputArray = userInput.split(' ');
	var pattern = new RegExp("^[0-9]+$");
	for (var i = 0; i < userInputArray.length; i++) {
		if(pattern.test(userInputArray[i])){
			userInputArray[i] = numbersToLetters(userInputArray[i]);
		}
	}

	var userOut = userInputArray.join(' ');

	if(document.getElementById('output') !== null){
		output.innerHTML = ''; 
	}
	else{
		var outPut = document.createElement('p'); 
		outPut.id = "output"; 
		document.getElementById('outdiv').appendChild(outPut); 
	}
	
	var textOut = document.createTextNode(userOut); 
	output.appendChild(textOut); 
}
{% endhighlight %}
<br />
That's all well and good, but of course the bulk of the code is going to be devoted to the `numbersToLetters()` function, which will actually convert the numerals. This was a pretty big hurdle for me, and I'll admit that I got some help on it. But in principle, it's going to depend on the same sort of operation as `parseText()`. The main thing was to split each number into ones, tens, and hundreds columns (for this exercise I limited myself to numbers 0-999). If that verb "split" seems like a clue, then you know your Javascript! Each array element from the first function is going to get broken down into an array again in the second function. But this time instead of passing in a blank space as the argument, I'm going to use a totally empty character: `split("")`. This will cause each character to occupy a single element of the array, so the number "123" will be broken down into the array `[1,2,3]`. At this point, each element in the array can be assigned to a variable which will then later be used for the conversion:

{% highlight javascript %}
function numbersToLetters(numb){

	var numbArray = numb.split("");

	var ones = numbArray[numbArray.length - 1],
		tens = numbArray[numbArray.length - 2],
		hundreds = numbArray[numbArray.length - 3];
// ...
}
{% endhighlight %}
<br />
The `length` method used here returns the length of an array; since the position of an element in an array is counted starting from 0, the snippet `array[array.length - 1]` will be equal to the last element of the array. 

The next part of the script is to me one of the most elegant, and unfortunately something that I didn't come up with on my own. In order to make the conversion from numbers to letters, the program will store the English equivalents of each numerical value in two arrays, `onesToLetters` and `tensToLetters`:

{% highlight javascript %}
var onesToLetters = ['', 'one', 'two', 'three', 'four', 'five', 'six','seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen' , 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
	tensToLetters = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
{% endhighlight %}
<br />
Each word is stored in such a way that it's numerical meaning corresponds to its position in the array. This way, in order to access, say, 'fourteen', all you need to do is write `onesToLetters[14]`, which will come in very handy.

Finally, I'll get to the conversion itself. Here I am just going to present a series of conditional statements that will test the value of the number and give different outputs according to the rules of number-writing in English. Ultimately, the character string to be output will be stored in the variable `numbToLet`. Have a look:

{% highlight javascript %}
var numbToLet;
	
	if(numb < 999 && numb > 0){
		if(hundreds > 0){
			numbToLet = onesToLetters[hundreds] + ' hundred'; 
		}
		else{
			numbToLet = '';
		}

		if(tens > 1){
			numbToLet += (hundreds > 0 ? ' ' : '') + tensToLetters[tens] + (ones > 0 ? '-' + onesToLetters[ones] : ''); 
		}
		else if(tens > 0){
			numbToLet += (hundreds > 0 ? ' ' : '') + onesToLetters[tens + '' + ones]; 
		}
		else{
			numbToLet += (hundreds > 0 ? ' ' : '') + onesToLetters[ones]; 
		}
	}
	else if(numb == 0){
		numbToLet = "zero";
	}
	else{
		numbToLet = numb;
	}

	return numbToLet;
{% endhighlight %}
<br />
I start by declaring the variable `numbToLet`, then move to some if/else statements. The first of these determines whether the input number is between 1 and 999, is 0, or falls outside of the range, in which case it will simply be returned as it was passed into the function. If the number is between 1 and 999, the program applies some more if/else logic: first it determines whether the hundreds column has a value greater than 0, and if it does, it prints the value and then concatenates the word "hundred" to it. For our "123" example, the variable `hundreds` will have a value of 1, so `numbToLet` will be set to "one hundred." The next column to be transformed is the tens column. However, in English numbers from 1-20 are irregular, so the test will be `if(tens > 1)` in order to capture values from twenty on up. This statement will concatenate a space after "hundred" if there is one, and then the tens column, and then a hyphen and the ones column if the latter is greater than 0. In our example, the hundreds column is greater than 0, so the statement will add a space after "one hundred." The ones column is also greater than 0, causing the statement to add a hyphen between the tens and the ones column: "one hundred twenty-three." 

A second test, `if(tens > 0)` will handle numbers whose tens column has a value of 1. To print the English equivalent, we access the `onesToLetters` array at the appropriate position, which is found by concatenating the tens value (1) and the ones value (say 4), giving us "fourteen" (`onesToLetters[14]`). The rather unelegant empty character in between the two variables (`onesToLetters[tens + '' + ones]`) is just there to force a concatenation; otherwise Javascript would try to perform an arithmetic operation and add the two. 

Finally, the third test handles the case in which the tens column has a value of 0, and simply concatenates the ones column directly to the hundreds column if it is there. The function then returns `numbToLet`, where it is printed back out in place of the numeral which had been input by the user. The final piece of code will just bind the `parseText()` function to the Enter button, so that the function is called when the user clicks it.

{% highlight javascript %}
inputButton.addEventListener('click', function(){
	parseText(document.getElementById("myTextarea").value);
});
{% endhighlight %}
<br />
This is the whole program as I had initially envisioned it. However, there are still some major limitations. Most notably the app can't handle anything other than pure numerals: any punctuation will prevent them from matching the regex pattern and being treated. In order to solve this, ultimately I moved to this more complex regex pattern: `/^['"]?[0-9]+[,;:!?./'"\n\-]?$/`. This allows the program to handle a wide variety of punctuation characters following the number, as well as single and double quotation marks preceding the number. But in order to deal with these, I had to modify `numbersToLetters()` in order to preserve the punctuation. This task came down, essentially, to three very useful Javascript functions: `isNaN()`, `shift()`, and `pop()`. `isNaN()` tests a given argument and returns `true` if the argument is not a number. This is the function that is used to detect punctuation. The other two are array methods; `shift()` deletes the first element of an array, and `pop()` deletes the last element of an array.

After it splits its argument into an array, `numbersToLetters()` needs to test whether the first and last elements are numbers or punctuation. If they turn out to be punctuation, it needs to store that character in a variable, delete that element from the array, and then concatenate the element back after having converted the numerals. Here's how it does that:

{% highlight javascript %}
var punctAfter = null,
	punctBefore = null;

var numbArray = numb.split('');

if(isNaN(numbArray[numbArray.length - 1])){
	punctAfter = numbArray[numbArray.length - 1];
	numbArray.pop();
}

if(isNaN(numbArray[0])){
	punctBefore = numbArray[0];
	numbArray.shift();
}

numb = numbArray.join('');
{% endhighlight %}
<br />
Two variables are initialized that will contain the punctuation characters if necessary, `punctAfter` and `punctBefore`. Later, once the conversion is finished but before returning the converted character string, a test will see if either of these variables contains anything, and if they do, their contents will be concatenated to `numbToLet`:

{% highlight javascript %}
if(punctAfter !== null){
	numbToLet += punctAfter;
}

if(punctBefore !== null){
	numbToLet = punctBefore + numbToLet;
}
return numbToLet;
{% endhighlight %}
<br />
Now the app is capable of handling numbers with basic punctuation around them. There are still a lot of things it can't deal with, but I think that it covers the most likely user input scenarios, and anyway, thanks to the regex, nothing that it can't handle will ever even be touched by the conversion function; it will simply be passed over and returned to the user as is. So, if you haven't already, give the [demo](/projects/numberstoletters/) a shot, and let me know what you think!