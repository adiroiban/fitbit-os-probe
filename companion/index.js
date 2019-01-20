/*
 It just received the message from device and send it back, while loging the
 one way time.

It send the messages in an object with 2 members:
* type - type of the message
* payload - payload of the message

The following types are supported:
* response - response to a ping request
* settings - send configuration changes.

*/

import { settingsStorage } from 'settings'
import * as messaging from 'messaging';

/*
Initialized the settings.
*/
let resolution = settingsStorage.getItem('resolution')
if (!resolution) {
    settingsStorage.setItem('resolution', 4)
}


/*
Called when connection was started with the device.
*/
messaging.peerSocket.onopen = function() {

    let message = {
        'type': 'settings',
        'payload': {
            'key': 'resolution',
            'newValue': settingsStorage.getItem('resolution'),
            'oldValue': 0,
        }
    }
    messaging.peerSocket.send(message)

}

messaging.peerSocket.onmessage = function(event) {
  let duration = new Date().getTime() - event.data[1]
  console.log('Received ' + event.data[0] + ': ' + duration + 'ms')
  try {
    messaging.peerSocket.send({'type': 'response', 'payload': event.data})
  } catch (error) {
    consol.log('Failed to send: ' + error)
  }
}


settingsStorage.onchange = function(event) {
    console.log(`Settings changed: ${JSON.stringify(event)}`)
    messaging.peerSocket.send({'type': 'settings', 'payload': event})
}
