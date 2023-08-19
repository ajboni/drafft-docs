# API Documentation

Drafft comes with an optional REST API for querying on a loaded project.
It is an App Setting and can be enabled in options.

> For now, this will only work if Drafft is running and a project is loaded. 

## APP Options

- `Enable API`: If true a REST API will be started when opening a project.
- `API Key`: This API key will need to be present in the request header as `x-api-key`
- `API Port`: The port where the server will listen to connections. Default 9001

![Api Options](/img/api-options-01.png)
## API Reference

### Get Game Export

Gets a game-ready JSON object. Same as clicking "Export Game Content" in the app.

```rest
GET /game-export
```

The exported collections will be as defined in the project settings althought they can be specified for further filtering with a `collections` field with comma separated values:

Accepted Values: `ProjectSettings` `GDD` `Scripts` `Actors` `Quests` `Items` `Misc` `Grids` `Kanban`

```
GET /game-export?collections=Scripts,Items,Actors
```

### Get Database Dump

Gets a database dump directly from the PouchDB instance. It accepts any [PouchDB allDocs options](https://pouchdb.com/api.html#batch_fetch).
Default options are `include_docs: true` and `options.attachments: true`

```rest
GET /db-dump
GET /db-dump
GET /db-dump?include_docs=false&attachments=false&descending=true
```

![Database Dump](/img/api-db-dump.png)
