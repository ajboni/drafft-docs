---
title: Quick Start
description: Getting familiar with the app with some sample projects.
caption: Quick Start
---

# Quick Start

A good way to start experimenting with the app is to load a sample project and play around.  
Currently there are two very basic projects:

1. [The goddess of fate](https://github.com/ajboni/drafft-examples/blob/main/projects/The%20goddess%20of%20fate..json): A Dialogue based visual novel about the zodiac.
2. [One Bullet](https://github.com/ajboni/drafft-examples/blob/main/projects/One%20Bullet.json): A Mockup for a point and click game about a heist. Work in progress.

> If you want to contribute your project to this section, please make a pull request on the [examples repo](https://github.com/ajboni/drafft-examples)

# Importing a project.

1. Download the example project json file: for this document we will use [The goddess of fate](https://github.com/ajboni/drafft-examples/blob/main/projects/The%20goddess%20of%20fate..json): A Dialogue based visual novel about the zodiac.
2. Launch the app.
3. Go to **Project Manager** and click on **Restore Database from file in a new project**
4. Enter a name and click ok.
5. Select the json file. The project will load.

# Sections

The left sidebar content will change with all available modules of the app, we will quickly visit each one to get a general overview of the features.

## Options

You should setup your username here if you are planning to use it in a team. Other options are self explanatory.

## Project Manager

This is where you can create, load, delete and restore projects. Not much to do here now.

## Project Settings

This is where you can set up project options and metadata and certain default behaviours.  
A very important section here is the **Export Options** page where you can set up different mappings that will be applied when generating the game export as well as what sections will be exported.

## Design Documents

Here is the place where to add documents, notes, story bits, etc.
You will notice the loaded project has a "summary" document, if you try to edit it you will not be able to do so. That's because the document is not "locked for editing".

## Editing documents

Drafft supports realtime collaboration, with the condition that each user "locks" the document that they are working on to avoid concurrency issues.  
Even when using the app as a single user, each document will need to be locked before it being able to be modified.

Go ahead and click the edit button on the toolbar. Some actions on the toolbar like delete or rename will be available now. Also notice that there should be a padlock icon with your username simbolizing the status of the document.

> You can double-click on the doc text to unlock the document (works also on scripts).

Make some changes to the file and click the save button. The file icon should disappear and the file will be available to other user.

You can have a play exploring the file creation or editing processes, also take a look at the timeline feature if you want. Once ready lets move to the script section.

## Scripts

This is one of the main sections of the app, a script is data that you will provide to your game and it can be written in any language.  
A script could be a standalone document or be part of a dialogue tree. Instead of relying on writing int each dialogue tree node, each node will have its own script attached, but more on that later.  
You will notice two items in the file tree: `goToLibrary` is a really simple script executing a **command** and a special read-only "Dialogues" folder which contains all scripts that are part of a dialogue Documents, lets ignore that for now.

- Select `goToLibrary` and double-click on the text area. Press the `Toggle editor hotkeys panel` button. This will open a sidebar on the right with some shortcuts, these will be really useful for repetitive tasks like adding speech actions.
- Modify `ctrl+4` shortcut and add the following: `::Narrator:: % deals % damage.`
- Focus the text area and press `ctrl+4`. Each time a `%` appears in the shortcut it will ask the user for a value. Put `Max` and `66` or whatever you want there.

You will also notice that `<PlayDialogueByAlias(area)>` and `::Narrator::` are highlighted differently and that is because they are part of the really small [Drafft Scripting Syntax](scripting.html). Go have a read on that page document for a quick overview. I'll wait...

TO BE CONTINUED...
