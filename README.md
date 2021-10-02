# Pokedex

Pokedex is a REST API that provides basic information about Pokemon, with the
option to request fun translations of the description into Shakespeare or Yoda,
depending on the Pokemon species.

## Starting the server

### Docker

The server is available as a Docker container. The following instructions assume
that Docker is already installed. To use this method, the image needs to be
built first.

```shell
docker build . -t pokedex
```

The `-t` option specifies the imagine name.

This installs all the required dependencies and creates an image that can now be
run.

```shell
docker run -p 5000:5000 -d pokedex
```

The `-d` option must match the image name specified during the previous build
command, in this case `pokedex`.

The server should now be listening for requests. To access the server logs, the
container ID must be obtained first.

```shell
docker ps
```

Using the container ID of the `pokedex` image, the logs can now be accessed.

```shell
docker logs [container_id]
```

The `[container_id]` is the container ID obtained in the previous command.

### Local environment

Alternatively, the server can be started on the local environment, assuming that
Node.js and `npm` are both installed.

To use this method, the application must first be installed and built.

```shell
npm install
npm run build
```

On success, the server can then be started.

```shell
npm start
```

The console should now log that the server is listening:
`Server listening on 5000`.

## Checking the server status

To check that the server is up and running, a `GET` request can be made to
`http://localhost:5000/status`. If the server is running, it should respond with
`OK`.

## API endpoints

- `GET /pokemon/[name]`

Responds with basic information about the Pokemon.

Exemple of response for Pikachu:

```shell
curl http://localhost:5000/pokemon/pikachu

{
    "description": "When several of these POKéMON gather, their electricity could build and cause lightning storms.",
    "habitat": "forest",
    "isLegendary": false,
    "name": "pikachu"
}
```

If a Pokemon cannot be found, the server will respond with a `404 Not Found`
status code.

- `GET /pokemon/translated/[name]`

Responds with the same information as `GET /pokemon/[name]`, only the
description is fun-translated to Shakespeare or Yoda, depending on the Pokemon
species. If the Pokemon's habitat is 'cave' or it is a legendary Pokemon, the
description is translated to Yoda; for all other Pokemon, the description is
translated to Shakespeare. In case a description cannot be translated, the
original description is kept.

Example of response for Mewtwo:

```shell
curl http://localhost:5000/pokemon/translated/mewtwo

{
    "description": "Created by a scientist after years of horrific gene splicing and dna engineering experiments, it was.",
    "habitat": "rare",
    "isLegendary": true,
    "name": "mewtwo"
}
```

## Tests

Tests were written in Jest and can be run using `npm`.

```shell
npm test
```

## Production

Before deploying the server to production, I would make a few changes to the
existing codebase:

- Use environment variables to change the server configuration, for instance the
  port. At the moment, this is hardcoded in `src/config/properties.ts`. The
  advantage of using environment variables is that no changes need to be made to
  the codebase in order to change the server configuration – the server could
  just be restarted with the new property values.
- Abstract `got` into a requests library. This way, the library used to make
  requests could easily be replaced without making any changes to the services.
- Complete the Logger utility to use other outputs apart from `console.log` and
  provide more methods for error and warning logs.
- Use environment variables to control production and development staging, which
  could be use to configure logging and other aspects of the server.
- Class and method documentation (comments).
- Provide more extensive tests for the middleware and server.
- Result caching, to help with the limited number of requests to external APIs.

## Observations

The server was programmed in TypeScript using Node.js LTS (14.17.6) in a
UNIX-like environment.
