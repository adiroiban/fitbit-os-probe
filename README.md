# fitbit-os-probe

A simple app to ping the companion and show communication status.

[Link to private App Gallery](https://gam.fitbit.com/gallery/app/b875eae0-27ae-4895-9b2a-6158712ff1cd)

This app will send a message to the companion and will wait for the response,
measuring the round-trip time.

There is a settings page, with the purpose to observe how the companion
is launched.

It shows the followings:

* state of the peer socket
* the time since socket state was changed (open or close, -1 when not yet opened)
* Each line shows the round-trip for a message... or if waiting for response.
* For ping sends while socket is closed, time since socket was closed.

Available vibrations:

* `confirmation` - single vibration - on connection open.
* `nudge` - double vibration - on connection closed.
* `bump` - short vibration - on app exit.


## Screenshot

Main app page with tasks list for a section.

![screenshot](screenshot.png?raw=true "App screenshot")


## Development

* npx fibit

MIT Licence


## Credits

* Icon from https://dryicons.com/icon/space-probe-icon-5223
