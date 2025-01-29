// Global Variables – aka the brain of the game
let guessCounter = 0;
let pattern = [2, 2, 4, 3, 2, 1, 2, 4]; // The secret code! Shh, don’t tell anyone.
let progress = 0; // Keeps track of how far the player has gotten
let gamePlaying = false; // Is the game on or off?

// Buttons on the page – we’ll swap them around to show/hide
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

// Variables for sound magic
let tonePlaying = false; // Is a sound currently playing?
let volume = 0.5; // Volume for our sound
const clueHoldTime = 1000; // How long each clue stays lit
const cluePauseTime = 333; // Pause between clues
const nextClueWaitTime = 1000; // Wait time before playback starts

// Start the game – let the chaos begin!
function startGame() {
  context.resume().then(() => {
    console.log("Audio context resumed – we’re ready to make noise!");

    // Reset progress and show the Stop button
    progress = 0;
    gamePlaying = true;
    startBtn.classList.add("hidden");
    stopBtn.classList.remove("hidden");

    playClueSequence(); // Play the first clue sequence
  });
}

// Stop the game – party’s over, folks
function stopGame() {
  gamePlaying = false;
  startBtn.classList.remove("hidden");
  stopBtn.classList.add("hidden");
}

// Sound settings – frequencies for each button
const freqMap = {
  1: 261.6, // Button 1 = Middle C
  2: 329.6, // Button 2 = E
  3: 392,   // Button 3 = G
  4: 466.2  // Button 4 = A#
};

// Function to play a tone
function playTone(btn, len) { 
  console.log(`Playing tone for button ${btn} for ${len}ms`);
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  tonePlaying = true;
  setTimeout(stopTone, len);
}

// Start playing a tone
function startTone(btn) {
  if (!tonePlaying) {
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    tonePlaying = true;
  }
}

// Stop playing the tone
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Initialize the audio – this is some sound wizardry!
let AudioContext = window.AudioContext || window.webkitAudioContext; 
let context = new AudioContext();
let o = context.createOscillator();
let g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

// Light up a button
function lightButton(btn) {
  const element = document.getElementById("button" + btn);
  if (!element) {
    console.error(`Element with id "button${btn}" not found – check your HTML.`);
    return;
  }
  element.classList.add("lit");
}

// Turn off the light
function clearButton(btn) {
  const element = document.getElementById("button" + btn);
  if (!element) {
    console.error(`Element with id "button${btn}" not found – check your HTML.`);
    return;
  }
  element.classList.remove("lit");
}

// Play a single clue
function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn); // Light it up!
    playTone(btn, clueHoldTime); // Make some noise!
    setTimeout(clearButton, clueHoldTime, btn); // Turn off after a bit
  }
}

// Play the full clue sequence
function playClueSequence() {
  context.resume(); // Ensure audio context is good to go
  let delay = nextClueWaitTime; // How long before we start the sequence?
  let guessCounter = 0; // How many guesses have been made?
  for (let i = 0; i <= progress; i++) {
    console.log(`Playing clue ${pattern[i]} after ${delay}ms`);
    setTimeout(playSingleClue, delay, pattern[i]); // Schedule the clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}
function loseGame() {
  stopGame();
  alert("Game Over! You lost Buddy!");
}
function winGame(){
  stopGame();
  alert("Game Over! You won Buddy!");
}

function guess(btn) {
  console.log("Player clicked button: " + btn);

  // If the game isn't active, ignore the guess
  if (!gamePlaying) {
    return;
  }

  // Check if the player's guess matches the current pattern
  if (pattern[guessCounter] === btn) {
    // Correct guess!
    if (guessCounter === progress) {
      if (progress === pattern.length - 1) {
        // The player matched the whole pattern – they win!
        winGame();
      } else {
        // Good job so far! Moving to the next part of the pattern
        progress++;
        playClueSequence();
      }
    } else {
      // Guess was right, keep checking the next part
      guessCounter++;
    }
  } else {
    // Oops! The guess was wrong – game over
    loseGame();
  }
}
