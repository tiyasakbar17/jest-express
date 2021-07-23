# Tiyas Login App

This project was created for the test from Slash.

## How To Run This Project


### `npm run local-build`

This command will install depencencies, clients, and make sure you can use this app.\

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\


go to browser, localhost:3000
this app accept "next" params to redirect after login

example localhost:3000?next=https://google.com

after user login, user will be redirected to next params and will save the token (jwt) to localstorage

it's the same as register.
