---
title: Screen Play Generation
description: Auto generate standard screenplays from game scripts and dialogue trees.
---

# Screen Play Generation

If the scripts are written in [Drafft Scripting Syntax](scripting.html) drafft can automatically detect speech lines and generate a standard screenplay.

This is useful to hand over to voice actors as the format is commonly used in the industry.

![Screenplay](/img/scripting-02.png)

## Special Commands
Some commands, if used, will have an impact in the screenplay generation:

- Comments `// Comment` will be used as __Action__.
- `<FadeIn(time)>` and `<FadeOut(time)` will be used as __transitions__
- `<CutTo(location)>` will be used as __Scene Heading__.
- `[Expression]` will be used as __Parenthetical__.

Example:

```
<FadeIn()>
<CutTo(INT, STUDIO)>   
// Early in the morning the team delivers the news with participation of many field reporters across the country.
[#net_SqCu]::Reporter:: Now let's take a look at the weather for today.
<CutTo(EXT, LOCATION 1 - DAY)> {"weather":"rainy"} 
[#net_JZbb]::FieldReporter:: Not looking very good here. [worried] {"props":["umbrella","raincoat", "microphone"]}
<CutTo(INT, STUDIO)>   
[#net_Oa8v]::Reporter:: What's the traffic on your side Mike?
<CutTo(EXT, MIKE LOCATION)> {"traffic": {"cars": "low", "trucks":"none"}}
[#net_8Swf]::Mike:: Low traffic in this area.   
```

Will produce the following screenplay:

![Screenplay](/img/screenplay-01.jpg)