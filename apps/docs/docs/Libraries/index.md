# Libraries

## Creating a library

There are a couple of options for creating a library:

1. You could use the NX Console plugin for vs code which provides a friendly GUI
2. You could use the CLI

After creating your new library:

1. Delete the `src/lib` folder and place all of your new files directly in the `src` folder.
2. Run the default tests for your folder: `nx test <lib-name>`
3. Start building!

### Using the NX Console plugin

1. Make sure you have the [NX Console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console) plugin installed.
2. Open the NX Console
3. Click "generate"
4. Click on the generator you'll probably want to use (`@nrwl/js - library`)[https://nx.dev/js/overview] OR [`@nrwl/react - library`](https://nx.dev/js/overview) to create a new library but any of them should work.

### Using the CLI

1. Open your terminal and navigate to the root of Ultra Sound Music repo
2. Configure your NX [generator](https://nx.dev/generators/using-schematics) of choice.
3. Here is an example generator I often use for new libraries:

```
nx g @nrwl/js:lib <lib-name> --buildable=true --importPath=@usm/<lib-name> --pascalCaseFiles=true --publishable=true
```

[Here](https://nx.dev/js/library) is a full list of options for the `@nrwl/js:lib` generator.
