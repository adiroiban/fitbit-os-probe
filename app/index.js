/*
 * Entry point for the watch app
 */
import document from "document";
import * as messaging from "messaging";

// Status codes
// * -1 reply not yet received
// * -2 failure during send
// * -3 request never sent

// Number of lines to display
const LINES = 9
// How often to display the results.
const REFRESH = 1 * 1000
// Number of seconds at which to send pings.
// This can be changed at run-time via settings.
const RESOLUTION = 4 * 1000
// Time when socket state was changed.
let state_changed = new Date().getTime()
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
let demotext = document.getElementById('output')

setInterval(showResults, REFRESH)
let ping_call = setInterval(sendPing, RESOLUTION)

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  state = 'ps:0'
  state_changed = new Date().getTime()
}

messaging.peerSocket.onclose = function() {
  state = 'ps:C'
  state_changed = new Date().getTime()
}

/*
Called when a message was received from companion.

Check companion docs for available message types.
*/
messaging.peerSocket.onmessage = function(evt) {
    let message = evt.data
    if (message.type == 'response') {
        let response = message.payload
        let now = new Date().getTime()
        last_received = now
        past.forEach(function(request) {
            if (response[0] == request[0]) {
                request[2] = now - request[1]
            }
        })
        return
    }

    if (message.type == 'settings') {
        let settings = message.payload
        if (settings.key == 'resolution') {
            clearInterval(ping_call)
            ping_call = setInterval(sendPing, settings.newValue * 1000)
        }
    }

}

messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  state = err.code + "-" + err.message
}

/*
 Send a message to the companion.
*/
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
      last_message[2] = '-2'
    }
  } else {
    status = "rs:C"
    last_message[2] = '-3'
  }

  // Remove old entries.
  if (past.length > LINES) {
    past = past.slice((past.length - LINES), past.length)
  }
}


/*
Display status on the screen.
*/
function showResults() {
  let now = new Date().getTime()
  let state_duration
  let state_duration = Math.round((now - state_changed) / 1000)
  let message_duration
  if (last_received > 0) {
    message_duration = Math.round((now - last_received) / 1000)
  } else {
    message_duration = -1
  }

  let output = [
    status + ' ' + message_duration + 's | ' +
    state + ' ' + state_duration +'s'
    ]

  past.forEach(function(request) {
    let duration
    if (request[2] == -1) {
        duration = 'waiting for reply'
    } else if (request[2] == -2) {
        duration = 'not-sent-error'
    } else if (request[2] == -3) {
        let close_duration = request[3]
        if (!close_duration) {
            close_duration = Math.round((now - state_changed) / 1000)
            request[3] = close_duration
        }

        duration = 'C ' + close_duration + 's'
    } else {
        duration = request[2] + 'ms'
    }
    output.push(request[0] + " " + duration)
  })
  demotext.text = output.join('\n')

}

