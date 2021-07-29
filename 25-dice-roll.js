let DiceRoller = (function () {

  "use strict";

  /**
   * Randomly shuffle an array
   * https://stackoverflow.com/a/2450976/1293256
   * @param  {Array} array The array to shuffle
   * @return {String}      The first item in the shuffled array
   */
  function shuffle(array) {

    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  /*  Toggles the die class to activate the animation */
  function toggleClasses(die) {
    die.classList.toggle("odd-roll");
    die.classList.toggle("even-roll");
  }

  function createDice(numDice) {
    let divElement = document.createElement('div');

    divElement.classList.add('dice');

    for (let i=0; i < numDice; i++) {

      let olElement = document.createElement('ol');

      olElement.classList.add('die-list');
      olElement.classList.add('even-roll');
      olElement.setAttribute('id',`die-${i+1}`);
      olElement.setAttribute('data-roll', 1);

      for (let side=1; side < 7; side++) {
        let liElement = document.createElement('li');
        liElement.classList.add('die-item');
        liElement.setAttribute('data-side', side);
        for (let dot=0; dot < side; dot++) {
          let spanElement = document.createElement('span');
          spanElement.classList.add('dot');
          liElement.append(spanElement);
        }
        olElement.appendChild(liElement);
      }
      divElement.appendChild(olElement);
    }
    return divElement;
  }


  /**
  * Inject the button into the DOM
  * @param  {Node} elem The element to render the button into
  * @return {Node}      The button
  */
  function createBtn (elem, numDice) {

    let dice = createDice(numDice);

    // Inject into the DOM
    elem.append(dice);

    // Create a button
    let rollBtn = document.createElement('button');

    rollBtn.innerHTML = 'Roll the Dice';
    rollBtn.setAttribute('aria-label', `Roll the Dice`);
    rollBtn.style.transition = 'transform 300ms ease-in';

    // Inject into the DOM
    elem.append(rollBtn);

    return rollBtn;
  }

  /**
   * Create an event listener
   * @param  {Node}        btn      The button to attach the listener to
   * @param  {Constructor} instance The current instantiation
   */
  function createEventListener (btn, instance) {

    /*  Shuffles the dice array and use the first value */
    function rollDice() {
      const dice = [...document.querySelectorAll(".die-list")];

      dice.forEach(die => {
        instance._result.textContent = 'Rolling...';
        toggleClasses(die);
        shuffle(instance._sides);
        die.dataset.roll = instance._sides[0];
        window.setTimeout(() => {
          instance._result.textContent = `You rolled a ${instance._sides[0]}`;
        }, 1300);

      });
    }
    // Listen for clicks on the button
    btn.addEventListener('click', rollDice);
  }

  /**
   * The Constructor object
   * @param {btnSelector} String  a css selector for the Button 
   * @param {resultSelector} String  a css selector for the Result Annoucment
  */
  function Constructor(btnSelector='#dice', resultSelector='#result', qty) {

      let numDice = !qty || qty == NaN ? 1 : qty;
      let sides = [1, 2, 3, 4, 5, 6];

      // Get the elementa
      let btn = document.querySelector(btnSelector);
      let result = document.querySelector(resultSelector);
      
      result.setAttribute('aria-live', `polite`);
      
      // Make sure elements exist
	    if (!btn || !result) throw 'Dice and result elements must be provided.';
      
      // Inject a button into the DOM
      let rollButton = createBtn(btn, numDice);

      // Create the event listener
      createEventListener(rollButton, this);

      // Set properties
      Object.defineProperties(this, {
        _btn: {value: btn},
        _result: {value: result},
        _sides: {value: sides}
      });  
  }

  return Constructor;

})();
