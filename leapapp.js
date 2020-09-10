var audio = new maximJs.maxiAudio();
audio.init();
var myOsc = new maximJs.maxiOsc();
var myCounter = new maximJs.maxiOsc();
var myOscOutput, myAmpOut, myFiltOut;

var ampEnv = new maximJs.maxiEnv();
var filtEnv = new maximJs.maxiEnv();
var myFilt = new maximJs.maxiFilter();
var context1;
var handMap = 0;
var handDist; // global hand distance (original range 190 - 10,000)
var noteEvent; // bool for detecting change of state (note on/off)
var prevEvent = 0; // stores previous state (initial state is off)
var stateCount = 0; // stores count of each time the note on/off event occurs
var noteTrigger; // to store the trigger state

//Timing is in ms

filtEnv.setAttack(2000);
filtEnv.setDecay(1); // Needs to be at least 1
filtEnv.setSustain(1.0);
filtEnv.setRelease(5000);

ampEnv.setAttack(100);
ampEnv.setDecay(1); // Needs to be at least 1
ampEnv.setSustain(1.0);
ampEnv.setRelease(5000);
var o1;
//---------------- SYNTHESIS -----------------

var controller = new Leap.Controller();
var handData = controller.frame.hands;
controller.connect();

window.onload = function() { //loads the audio context
  var context = new AudioContext();

  // Setup all nodes
}
var sequencer = [
    [261.6, 329.6, 392.0, 293.7, 493.9, 440.0, 392.0,261.6,329.6,293.7,246.9,293.7,392.0,349.2,329.6,261.6],
    [164.8,784.0, 932.3, 622.3,784.0,698.5,622.3,493.9,659.3,784.0,880.0,587.3,698.3,587.3,523.3,698.5], //frequencies coded in order to represent melodies created myself on Ableton
    [164.8, 185.0,164.8, 174.6, 0.0, 174.8, 138.6,146.8, 138.6, 0.0, 0.0, 146.8,138.6, 155.6, 138.6,185.0]];

controller.on('connect', onConnect);
function onConnect()
  {
    console.log("Connect event umffar ");
}

var btnOpen = document.getElementById("btnOpen");
var btnClose = document.getElementById("btnClose");

var controller = Leap.loop({enableGestures: true}, function(frame)
{
  if(frame.valid && frame.gestures.length > 0)
  {
    frame.gestures.forEach(function(gesture){
        switch (gesture.type){
          case "circle":
              console.log("Circle Gesture 1:23");
              //audio.context.resume();
              console.log("my play function");
              context1 = new AudioContext()
              o1 = context1.createOscillator()
              o1.type="sine";
              o1.frequency.value=1000;
              o1.connect(context1.destination);
              o1.start();
              stoppit();
              
              break;
          case "keyTap":
              console.log("Key Tap Gesture");
              break;
          case "screenTap":
              console.log("Screen Tap Gesture");
              break;
          case "swipe":
              console.log("Swipe Gesture");
              break;
        }
        
    });
  }
    //console.log(frame.gesture)
    noteTrigger = false; // always set to off, until hand is over
    ampEnv.trigger = 0; //amplitude envelope
    filtEnv.trigger = 0; //filter envelope
   
    if(frame.hands.length > 0)
    {
        var hand =      frame.hands[0];
        var position = hand.palmPosition;


        var maxRange = 10000; // maximum range
        var minRange = 190; // minimum range
        handDist = distanceCal(position); // return value representing 3d pos of hand array (distance from leap)

        if(handDist > maxRange){ // check the maximum range against the current hand position (high boundary)

            handDist = maxRange; // delimit the upper range

        } else if (handDist < minRange){ // now check the low boundary

            handDist = minRange; // delimit the low boundary
        }       
         handMap = mapDist(handDist, minRange, maxRange, 0, sequencer[0].length - 1);

         handMap = Math.round(handMap);
          if (handMap == NaN) {
                handMap = 0;
              }


        //console.log(handMap);

        // var direction = hand.direction;
        btnOpen;enableGestures: true    

        //console.log("Note On");
        noteEvent = true;


      }else{

        btnClose;
        //audio.context.suspend();
        console.log("Note Off");
        noteEvent = false;
      }


      if(noteEvent != prevEvent){ // if there is a change of state

        stateCount++; // always increase counter when state changes

        console.log("State Change, " + stateCount);

        prevEvent = noteEvent; // overwrite previous state


        if(stateCount%2 == 1){ // only when hand is over (odd number count)

            console.log("Note On");

            noteTrigger = true;
            ampEnv.trigger = 1;
            filtEnv.trigger = 1;
        }
      }

});
function stoppit()
{
  o1.stop();
}

function distanceCal(hand){
    var sum = 0;
    var exp = hand.length;

    for(i=0; i < hand.length; i++){
        sum += Math.pow(hand[i], exp);


    }
        return Math.abs(Math.sqrt(sum));
}

function mapDist(num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function play ()
{

  console.log("my play function");
  var context1 = new AudioContext()
  var o1 = context1.createOscillator()
  o1.type="sine";
  o1.frequency=1000;
  o1.connect(context1.destination);
  o1.start();
}

audio.play = function () {
  // console.log("circle function from");
  
  //   //notice that we feed in a value of 1. to create an envelope shape we can apply later.
  //   myAmpOut = ampEnv.adsr(1., ampEnv.trigger);

  //   myFiltOut = filtEnv.adsr(1., filtEnv.trigger);


  //   frequency = sequencer[0][handMap];
  //   myOscOutput = myFilt.lopass(myOsc.saw(frequency), myFiltOut);
  //   this.output = myOscOutput * myAmpOut;

}

