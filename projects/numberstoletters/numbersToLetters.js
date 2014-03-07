function parseText(userInput){
	var userInputArray = userInput.split(' '); // take user input and create array 
	for (var i = 0; i < userInputArray.length; i++) {
		var pattern = new RegExp("^['\"]?[0-9]+[,;:!?./'\"\n\-]?$"); // numbers only, no other characters (update for decimal numbers later?)
		if(pattern.test(userInputArray[i])){
			// alert("matched " + userInputArray[i] + " !"); // filler code to make sure regex works
			userInputArray[i] = numbersToLetters(userInputArray[i]); // call numbers to letters conversion function and store its return in array
		}
	}

	var userOut = userInputArray.join(' '); // convert array back to string with space between each element

	if(document.getElementById('output') !== null){
		output.innerHTML = ''; // if there is content in the p#output element, empty it
	}
	else{
		var outPut = document.createElement('p'); // if there is no content, then create the element and add to the body
		outPut.id = "output";
		document.getElementById('outdiv').appendChild(outPut);
	}
	
	var textOut = document.createTextNode(userOut); // create text to output
	output.appendChild(textOut); // add output text to document at p#output
}

function numbersToLetters(numb){

	var punctAfter = null, // punctuation is null by default
	punctBefore = null;

	var numbArray = numb.split(''); // split number into array

	if(isNaN(numbArray[numbArray.length - 1])){
		punctAfter = numbArray[numbArray.length - 1]; // if the last element in the array is not a number, store in punctuation
		numbArray.pop(); // delete last element from array
	}

	if(isNaN(numbArray[0])){
		punctBefore = numbArray[0];
		numbArray.shift();
	}

	numb = numbArray.join('');

	var onesToLetters = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],
	tensToLetters = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];

	var ones = numbArray[numbArray.length - 1], // numb % 10,
	tens = numbArray[numbArray.length - 2], // (numb % 100 - numb % 10) / 10,
	hundreds = numbArray[numbArray.length - 3]; // (numb % 1000 - numb % 100) / 100;

	var numbToLet;

	numb = parseInt(numb, 10); // verify number is base ten, remove unwanted 0's (???) and punctuation
	
	if(numb < 999 && numb > 0){
		if(hundreds > 0){
			numbToLet = onesToLetters[hundreds] + ' hundred'; // if the hundreds column has more than 0, print number and hundred
		}
		else{
			numbToLet = ''; // otherwise variable stays empty
		}

		if(tens > 1){
			numbToLet += (hundreds > 0 ? ' ' : '') + tensToLetters[tens] + (ones > 0 ? '-' + onesToLetters[ones] : ''); // if the tens column has value of 2 or more, print corresponding word ('twenty' - 'ninety') and if ones column is greater than 0, print hyphen + word ('one' - 'nine')
		}
		else if(tens > 0){
			numbToLet += (hundreds > 0 ? ' ' : '') + onesToLetters[tens + '' + ones]; // if the tens column is 1, print words 'ten' - 'nineteen'
		}
		else{
			numbToLet += (hundreds > 0 ? ' ' : '') + onesToLetters[ones]; // if the tens column is 0, print just word 'one' - 'nine' (this line added to avoid undefined 'tens')
		}
	}
	else if(numb == 0){
		numbToLet = "zero"; // if the number is 0, return "zero"
	}
	else{
		numbToLet = numb; // if the number is outside of 0-999 range, return as is
	}

	if(punctAfter !== null){
		numbToLet += punctAfter;
	}

	if(punctBefore !== null){
		numbToLet = punctBefore + numbToLet;
	}
	return numbToLet;
}

inputButton.addEventListener('click', function(){
	parseText(document.getElementById("myTextarea").value); // call parsing function with user input as value
});