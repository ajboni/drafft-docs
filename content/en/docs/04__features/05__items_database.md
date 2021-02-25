---
title: Items database.
description: Organize your game's item database.
---

# ITEMS

Items will let you have an Item database with custom properties to inject in your game.

For example, this object.

![Items](/img/items-01.png)

Will be exported as: 

```json
"items": [
  {
    "name": "Sword",
    "content": "<p>Created on : Sun Dec 06 2020 21:32:13 GMT-0300 (Argentina Standard Time)</p>",
    "type": "Item",
    "parent": null,
    "icon": "file",
    "color": "#cec4d1",
    "path": "Sword",
    "isClonable": true,
    "isRemovable": true,
    "isReadOnly": false,
    "created": "Sun Dec 06 2020 21:32:13 GMT-0300 (Argentina Standard Time)",
    "modified": "Sun Dec 06 2020 21:38:21 GMT-0300 (Argentina Standard Time)",
    "comments": "",
    "collection": "Item",
    "locked": false,
    "lockedBy": "baj",
    "alias": "hawk",
    "properties": {
      "damage": 100,
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "required_level": 5,
      "bonus": {
        "water": 10,
        "fire": 5,
        "air": -3
      }
    },
    "editorLanguage": "hjson",
    "prefix": "hawk",
    "_id": "75b1e7ad-7474-46bb-8217-1ebbc6475168",
    "_rev": "25-a0fa83ec9a6357ba12764630d19e63af"
  }
],
```