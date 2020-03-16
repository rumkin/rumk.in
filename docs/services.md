#  Services

To specify a service you should create a file into `services` folder. This file
should export a factory function which receives a configuration and returns
service instance.

Basic service example:

```js
import mondodb from 'mongodb'

export default function (config, app) {
  return mondgo.connect(config)
}
```

## Configuration

To configure a service you should add record into `config.json`:

```json
{
  "services": {
    "mongodb": {}
  }
}
```

## Disable service

To disable service prepend service name with exclamation mark into configuration:

```json
{
  "services": {
    "!mongodb": {}
  }
}
```

Now service would not be initialized on a system startup.
