# Exporting

In order to use drafft database in a game engine, an export needs to be done. It will generate a plain JSON file with all the necessary data.

> Psst! using Godot? Check out the [drafft importer for godot](https://github.com/ajboni/godot-drafft-import/)


## Export Mappings
When an __game export__ is performed, the Export Mappings kicks in and modify, if necessary, each recognized line. 

A recognized line is one of the following:   
``` 
[#audiotag]::Actor::Speech text [?expression]  
::Actor::Speech text [?expression]  
<Command(?param1, ?param2, ?etc)>  
*expression*  and *param* are optional.
```

To generate the mappings, create the desired output using the following variables: `%tag - %actor - %speech - %expression - %json - %command - %params or %params(separator)`. 
For example, you could set up the speech export mapping to rewrite the output as a dict inside JSON so its easily parseable:

![Export Mapping](/img/export-mappings-02.png)

Drafft support different exporting rules for different languages, so be sure to match the source language with the target language mapping.  

![Export Mapping](/img/export-mappings-03.png)

The result will be something like this: 

![Export Mapping](/img/export-mappings-04.png)

Note how the 'content' property was rewritten according to our needs.

## Inline JSON
Since v1.0.13 it is possible to inline standard JSON in both speech and commands lines. `%json` variable will contain parsed content.

Consider this example: 

```
::Reporter:: Now let's take a look at the weather for today. 
<CutTo(Location1)> {"weather":"rainy"} 
::FieldReporter:: Not looking very good here. {"props":["umbrella","raincoat", "microphone"]}
<CutTo(Studio)>
::Reporter:: What's the traffic on your side Mike? 
<CutTo(Location2)> {"traffic": {"cars": "low", "trucks":"none"}}
::Mike:: Low traffic in this area. 
```

And this export mappings:  
__SPEECH__: `{"speech":"%speech", "json":"%json"}`  
__COMMAND__: `{"command":"%command(%params)", "json":"%json"}`

The result will be something like this:
```
{"speech":"Now let's take a look at the weather for today.", "json":"{}"}
{"command":"CutTo(Location1)", "json":"{"weather":"rainy"}"} 
{"speech":"Not looking very good here.", "json":"{"props":["umbrella","raincoat","microphone"]}"}
{"command":"CutTo(Studio)", "json":"{}"}
::Reporter:: What's the traffic on your side Mike? 
{"command":"CutTo(Location2)", "json":"{"traffic":{"cars":"low","trucks":"none"}}"}
::Mike:: Low traffic in this area.
```

#### Error Handling

If JSON fails to parse, the JSON part will be added as regular speech in speech lines and completely omitted in command lines:

```
{"description":"This JSON will be exported as is"}
<CutTo(Location2)>{bad:json}
::Narrator::This is a {Bad JSON}, but this is a {"Json":true} good one!
::Narrator::This is another {"bad":"JSON".
```

With the same export mappings as above, this will output:

```
{"description":"This JSON will be exported as is"}
{"command":"CutTo(Location2)", "json" :"{}"}
{"speech":"This is a {Bad JSON}, but this is a good one!", "json":"{"Json":true}"}
{"speech":"This is another {"bad":"JSON".", "json":"{}"}
```




> JSON objects __WILL NOT__ be shown in Director/Tagged Scripts, Screenplays or Dialogue Simulator.  