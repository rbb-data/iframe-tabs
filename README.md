# Datawrapper Switcher

Simple tool to merge multiple iframes into a tabbed view of them

There is also an [image switcher](https://github.com/rbb-data/image-switcher) which does the same for images.

## Usage

To create a new switcher navigate to https://dj1.app.rbb-cloud.de/datawrapper-switcher/#/new

**Example:**

https://dj1.app.rbb-cloud.de/datawrapper-switcher/#/view?uuid=e5a734ab-2c7a-42b1-b297-d1643d7497db&title=tt&url=%2F%2Fdatawrapper.dwcdn.net%2FbiK9v%2F1%2F&frameTitle=Verf%C3%BCgbare+Intensivbetten+mit+Beatmungsmaschine&ariaLabel=NRW-Karte+von+verf%C3%BCgbaren+Intensivbetten+mit+Beatmungsmaschine%23%2F&title=tt&url=%2F%2Fdatawrapper.dwcdn.net%2FbiK9v%2F1%2F&frameTitle=Verf%C3%BCgbare+Intensivbetten+mit+Beatmungsmaschine&ariaLabel=NRW-Karte+von+verf%C3%BCgbaren+Intensivbetten+mit+Beatmungsmaschine%23%2F&height=500

## Available Scripts

In the project directory, you can run:

### `npm start`

> **Note**
> Node 16 required

Runs the app in the development mode.<br />
Open [http://localhost:3000/#/new](http://localhost:3000/#/new) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

Please note that there are two routes:

- http://localhost:3000/#/new
- http://localhost:3000/#/view

The default route opened after running `npm start` will show a blank screen.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

### Homepage

By default, Create React App produces a build assuming your app is hosted at the server root.
To override this, specify the homepage in your `package.json`, for example:

    "homepage": "http://rbb24.de/static/rbb/rbb-data/project-name",

### Analytics

This App can track "pageviews" and e.g. map interactions.
To enable this you need to replace everything in `{}` in the ANALYTICS variables in the `.env` file
and set `REACT_APP_ANALYTICS_ENABLED` to true.
