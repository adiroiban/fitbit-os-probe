/*
 * Send ping to companion.
 */
import document from "document"
import * as messaging from "messaging"
import { vibration } from "haptics"
import { me } from "appbit"

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
let is_open = false
// Sending state.
let status = 'Initializing...'
// Index of the current ping sent.
let current = 0
// List of past pings.
let past = []
// Element where to show the messages.
let demotext = document.getElementById('output')

setInterval(showResults, REFRESH)
// Send a first ping and schedule future pings.
sendPing()
let ping_call = setInterval(sendPing, RESOLUTION)

me.onunload = () => {
  vibration.start('bump')
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  is_open = true
  vibration.start('confirmation')
  state_changed = new Date().getTime()
}

messaging.peerSocket.onclose = function() {
  is_open = false
  vibration.start('nudge')
  state_changed = new Date().getTime()
}

messaging.peerSocket.onerror = function(err) {
  is_open = false
  state_changed = new Date().getTime()
  // Handle any errors
  status = 'E' + err.code + "-" + err.message
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



/*
 Send a message to the companion.
*/
function sendPing() {
  let now = new Date().getTime()
  // record new ping
  current = current + 1
  let last_message = [current, now, -1]

  // Try to send new ping.
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send the data to peer as a message
    try {
      messaging.peerSocket.send(last_message)
      status = ''
    } catch (error) {
      status = error
      last_message[2] = '-2'
    }
    // Record the event.
    past.push(last_message)
  } else {
    // Peer is not open. Don't sent anything.
    status = ''
    last_message[2] = '-3'
    last_message[1] = 0
    let previous_message = past[past.length - 1]
    if (previous_message && previous_message[2] == '-3') {
      // Last message was also for a closed.
      // Don't add a new event, just update the last one.
      previous_message[0] = current
      previous_message[1] = Math.round((now - state_changed) / 1000)
    } else {
      // Record the new event type.
      past.push(last_message)
    }
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
  let state_duration = Math.round((now - state_changed) / 1000)
  let state = is_open ? 'Open' : 'Closed'

  let output = [
    state + ' ' + state_duration + 's ' + status
    ]

  past.forEach(function(request) {
    let duration
    if (request[2] == -1) {
        duration = 'waiting for reply'
    } else if (request[2] == -2) {
        duration = 'not-sent-error'
    } else if (request[2] == -3) {
        let close_duration = request[1]

        if (!is_open && request == past[past.length - 1]) {
          // Update the time since this is closed.
          // If this is the last request.
          let close_duration = Math.round((now - state_changed) / 1000)
          request[1] = close_duration
        }

        duration = 'C ' + close_duration + 's'
    } else {
        duration = request[2] + 'ms'
    }
    output.push(request[0] + " " + duration)
  })
  demotext.text = output.join('\n')

}

