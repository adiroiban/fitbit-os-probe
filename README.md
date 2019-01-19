# fitbit-os-probe

A simple app to ping the companion and show communication status.

This app will send a message to the companion and will wait for the response,
measuring the round-trip time.

It also shows the followings:

* state of the peer socket
* the time since last message was received from companion (-1 when not yet received)
* onopen/onclose state
* the time since socket state was changed (open or close, -1 when not yet opened)


## Development

* npx fibit

MIT Licence


## Credits

* Icon from https://dryicons.com/icon/space-probe-icon-5223
