# iframe-tabs

Simple tool to merge multiple iframes into a tabbed view of them

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Usage

To create a new tabed URL navigate to `/new`

**Example:**

http://localhost:3000/view?title=Low-Care&url=%2F%2Fdatawrapper.dwcdn.net%2F0QpVD%2F3%2F&frameTitle=Verf%C3%BCgbare+Intensivbetten+ohne+Beatmungsm%C3%B6glichkeit&ariaLabel=NRW-Karte+von+verf%C3%BCgbaren+Intensivbetten+ohne+Beatmungsm%C3%B6glichkeit&title=High-Care&url=%2F%2Fdatawrapper.dwcdn.net%2FQkVNF%2F1%2F&frameTitle=Verf%C3%BCgbare+Intensivbetten+mit+Beatmungsm%C3%B6glichkeit&ariaLabel=NRW-Karte+von+verf%C3%BCgbaren+Intensivbetten+mit+Beatmungsm%C3%B6glichkeit&title=ECMO&url=%2F%2Fdatawrapper.dwcdn.net%2FbiK9v%2F1%2F&frameTitle=Verf%C3%BCgbare+Intensivbetten+mit+Beatmungsmaschine&ariaLabel=NRW-Karte+von+verf%C3%BCgbaren+Intensivbetten+mit+Beatmungsmaschine

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

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
