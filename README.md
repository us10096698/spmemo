Boilerplate
===

A minimum-viable Node.js(Express) + Angular webapp template with tests

## Prerequisites
+ `node` installed
+ `gulp` installed
  - `$ npm i -g gulp`
+ `eslint` installed
  - `$ npm i -g eslint`
+ (Optional) A Bluemix account created

## Quickstart
```
$ git clone https://github.com/us10096698/boilerplate.git
$ cd path/to/boilerplate
$ npm update && bower update
$ gulp start_server
```

Then you can access [the site](http://localhost:3000).

## Testing
All test specs are at `test` directory and will be executed by corresponded `gulp` tasks.
I prefer [Jasmine](http://jasmine.github.io/2.0/introduction.html) for Javascript testing.

```
# server-side unit testing
$ gulp jasmine

# client-side unit testing
$ gulp karma

# e2e testing
$ gulp protractor
```

## Linting
This repository uses `eslint` for linting Javascript codes.
+ `$ gulp lint` will execute ESLint check.
+ It also uses [ESlint plugin for Angular](https://github.com/Gillespie59/eslint-plugin-angular) for Angular codes.
  - This plugin is based on [Angular Style Guide](https://github.com/johnpapa/angular-styleguide).

## Deploy to Bluemix
`$ cf push <appname> -m 512m -c 'gulp_start_server'`

