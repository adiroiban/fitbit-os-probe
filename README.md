# fitbit-os-probe

A simple app to ping the companion and show communication status.

[Link to private App Gallery](https://gam.fitbit.com/gallery/app/b875eae0-27ae-4895-9b2a-6158712ff1cd)

This app will send a message to the companion and will wait for the response,
measuring the round-trip time.

There is a settings page, with the purpose to observe how the companion
is launched.

It shows the followings:

* state of the peer socket
* the time since last message was received from companion (-1 when not yet received)
* onopen/onclose state
* the time since socket state was changed (open or close, -1 when not yet opened)


## Screenshot

Main app page with tasks list for a section.

Legend:

* rs:O - peerSocket.readyState.OPEN
* rs:C - peerSocket.readyState.CLOSED

* Time since last message was received

* ps:O - peerSocket.onopen
* ps:C - peerSocket.onclose

* Time since last onopne/onclose event was received.

Each line shows the round-trip for a message.
If the connection was closed when a message was sent,
it shows for how long the connection was closed when
the message was closed.

![screenshot](screenshot.png?raw=true "App screenshot")


## Development

* npx fibit

MIT Licence


## Credits

* Icon from https://dryicons.com/icon/space-probe-icon-5223
