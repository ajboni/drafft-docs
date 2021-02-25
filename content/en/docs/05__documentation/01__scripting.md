---
title: Drafft Scripting Syntax
description: Drafft's powerful script editor uses simple plain text to tell your game's characters exactly what to do and how to do it.
caption: Drafft Scripting Syntax
---

# Scripting Syntax

The idea behind drafft is that it should be engine and language agnostic. So you are allowed to use whatever language you prefer for your scripts.
However, there are certain features that, due to its nature, need to be able to identify the purpose of the line.
For this purpose the drafft syntax (UAF) was created. It is used for very specific purposes and can be ignored if not needed:

## Commands

Commands are just functions. The benefit of using drafft syntax is that they will appear in the resulting [screenplay](screenplay_generation.html)

`<Commands(param, param)>`

### Special Cases

Fade commands `<FadeOut(?params)>` and `<FadeIn(?params)>` also get some special treatment in the screenplay output.

### Examples:

```
<Wait(5)>
<Focus(actor)>
<FadeOut()>
<WalkTo(x,y,z)>
```

Commands can also be renamed at export to a syntax more useful for the target engine. See [Export Mappings](exporting.html)

## Actor Line (with speech tag)

`::Actor::Actor Line [expression]` or `[#speechTag] ::Actor::Actor Line [expression]`

This is the most important concept in drafft, this line represent a line of speech an actor says. It has several uses:

- Identifying actors to make the actor database.
- Identifying speech lines to auto generate tags for voice-overs.
- Include this line on the resulting screenplay.
- Include expressions in screenplay.

Actor lines can also be renamed at export to a syntax more useful for the target engine. See [Export Mappings](exporting.html)

### Examples:

```
::Tyler::The first rule of Fight Club is: You do not talk about Fight Club.[serious]
[#line001]::Travis::You talkin' to me?

```

## Comments

`// Comment`

Comments are lines that are commonly ignored in the target engine.
Drafft will include comments in the [screenplay](screenplay_generation.html).

### Example

```
// INT. SUBURBAN HOME - KITCHEN - NIGHT
// FILBERT (9), wiry, lost in his own imaginary world. Dressed as a Knight. A toy sword in his other hand.
```
