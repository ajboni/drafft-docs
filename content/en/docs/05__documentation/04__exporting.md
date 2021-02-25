# Exporting

In order to use drafft database in a game engine, an export needs to be done. It will generate a plain JSON file with all the necessary data.

> Psst! using Godot? Check out the [drafft importer for godot](https://github.com/ajboni/godot-drafft-import/)


## Export Mappings
When an __game export__ is performed, the Export Mappings kicks in and modify, if necessary, each recognized line. 

> A recognized line is one of the following:   
>   
> [#audiotag]::Actor::Speech text [?expression]  
> ::Actor::Speech text [?expression]  
> <Command(?param1, ?param2, ?etc)>  
>
> *expression*  and *param* are optional.

To generate the mappings, create the desired output using the following variables: `%tag - %actor - %speech - %expression - %command - %params or %params(separator)`. 
For example, you could set up the speech export mapping to rewrite the output as a dict inside JSON so its easily parseable:

![Export Mapping](/img/export-mappings-02.png)

> It is best to use single quotes to avoid escaped double quotes (\\")


Drafft support different exporting rules for different languages, so be sure to match the source language with the target language mapping.
![Export Mapping](/img/export-mappings-03.png)

The result will be something like this: 

![Export Mapping](/img/export-mappings-04.png)

Note how the 'content' property was rewritten according to our needs.