---
title: Drafft Multiuser Feature
description: Realtime multi user scripting and dialogue trees, with replication to a remote database.
caption: Multi user feature
---

# Multi-user (Remote replication)

With the power of couchdb, drafft supports realtime multiuser sync to a remote database.

Every time a user make a change it will sync the changes to the remote server. Now each client will poll this server for changes in “Remote sync interval” seconds, merging the changes on their local database.

That’s why the lock/unlock mechanism was added. We can replicate in real-time, but with the condition that no 2 users are modifying the same item.

## Requirements

- A [couchdb](https://couchdb.apache.org/) server, with admin permissions. A dedicated server for drafft is recommended. The easiest way to get it running is using the [official docker image](https://hub.docker.com/_/couchdb/)
- Connectivity of each computer to the server.
- Each user should have a distinctive username
- Each user should init a project with the same name.

## Enabling remote sync

1. First a user set up a project and give it a name. eg: 'multiuser'
2. In options section, they setup a unique username.
3. In project settings => remote replication section, they enable the feature and input the database url (must include http(s)://)
4. Every other user repeats the same procedure.
5. profit.

## Sync issues

Although the process is simple and it's quite tested, certain networking conditions, or a user working offline, could potentially overwrite another user's work if they work on the same item. It is recommended that the modifications are done when online or that the team organize the workflow to avoid such issues.

Remember that making backups is always a good practice.

## Notes

- Couchdb doesn’t allow capital letters so drafft doesnt allow it either (when you create it uppercase the databse name will be renamed to lowercase).
- All table names will appear as `drafft_project_name_lowercase`
- CORS must be enabled in couchdb: https://docs.couchdb.org/en/1.3.0/cors.html
- Database url MUST start with http:// or https://

## Video

<iframe width="560" height="615" src="https://www.youtube.com/embed/_ObaeBRChCQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
