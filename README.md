# Notes Chat App

Most of this app is adapted from the [TodoMVC Modern Example](https://github.com/relayjs/relay-examples/tree/master/todo-modern) from the Relay team.

This project uses a simple in memory GraphQL datastore, as such data will not be presisted between server restarts.

## Installation

Use Yarn if you want to instead.

```
npm install 
```

## Running

Set up generated files:

```
npm run update-schema
npm run build
```

Start a local server:

```
npm start
```

## Developing

Any changes you make to files in the `js/` directory will cause the server to
automatically rebuild the app and refresh your browser.

If at any time you make changes to `data/schema.js`, stop the server,
regenerate `data/schema.graphql`, and restart the server:

```
npm run update-schema
npm run build
npm start
```

## Testing

That's something for tomorrow, ain't it. 

## License

All code used here is potentially covered and encumbered by the terms of the [Facebook RelayJS Example license](https://github.com/relayjs/relay-examples/blob/master/LICENSE.md). And as such should not be used for commercial purposes. 
