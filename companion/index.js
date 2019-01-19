/*
 * It just received the message from device and send it back, while loging the
 * one way time.
 */

import * as messaging from 'messaging';

messaging.peerSocket.onmessage = function(evt) {
  let duration = new Date().getTime() - evt.data[1]
  console.log('C ' + evt.data[0] + ': ' + duration + 'ms')
  try {
    messaging.peerSocket.send(evt.data)
  } catch (error) {
    consol.log('CE ' + error)
  }
}
