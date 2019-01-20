/*
 * Entry point for the watch app
 */
import document from "document";
import * as messaging from "messaging";

// Number of lines to display
const LINES = 9
// How often to display the results.
const REFRESH = 1 * 1000
// Number of seconds at which to send pings.
const RESOLUTION = 4 * 1000
// Time when socket state was changed.
let state_changed = 0
// Open or Close state of the socket.
let state = 'C'
// Time when last message was received.
let last_received = 0
// Sending state.
let status = 'Initializing...'
// Index of the current ping sent.
let current = 0
// List of past pings.
let past = []
// Element where to show the messages.
let demotext = document.getElementById('output');


setInterval(showResults, REFRESH);
setInterval(sendPing, RESOLUTION);

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  state = 'ps:0'
  state_changed = new Date().getTime()
}

messaging.peerSocket.onclose = function() {
  state = 'ps:C'
  state_changed = new Date().getTime()
}

messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  let response = evt.data
  let now = new Date().getTime()
  last_received = now
  past.forEach(function(request) {
   if (response[0] == request[0]) {
     request[2] = now - request[1]
   }
  })
}

messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  state = err.code + "-" + err.message
}

// Send a message to the peer
function sendPing() {

  let now = new Date().getTime()
  // record new ping
  current = current + 1
  let last_message = [current, now, -1]
  past.push(last_message)

  // Try to send new ping.
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send the data to peer as a message
    try {
      messaging.peerSocket.send(last_message)
      status = 'rs:O'
    } catch (error) {
      status = error
      last_message[2] = 'error'
    }
  } else {
    status = "rs:C"
    last_message[2] = 'not sent'
  }

  // Remove old entries.
  if (past.length > LINES) {
    past = past.slice((past.length - LINES), past.length)
  }
}

function showResults() {
  // Show output.
  let now = new Date().getTime()
  let state_duration
  if (state_changed > 0) {
    state_duration = Math.round((now - state_changed) / 1000)
  } else {
    state_duration = -1
  }
  let message_duration
  if (last_received > 0) {
    message_duration = Math.round((now - last_received) / 1000)
  } else {
    message_duration = -1
  }
  let output = [status + ' ' + message_duration + 's | ' + state + ' ' + state_duration +'s']
  past.forEach(function(request) {
    output.push('R ' + request[0] + " " + request[2] + 'ms')
  })
  demotext.text = output.join('\n')

}


