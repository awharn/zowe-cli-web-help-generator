# Zowe Web Help Proof of Concept

This proof of concept introduces some utilities that can be used to extract the command tree from the CLI and Plug-ins, store the relevant command groups for proprietary conformant plugins in a legal-approved way (without exposing proprietary code), and generate a web help with those plug-ins included on demand.

## Installing

To install the necessary components, run `npm install`.

## Using - Contributing to the Web Help

To add your conformant plug-in's commands, please perform the following steps:

1. Ensure the plug-in that you would like to include is installed in Zowe CLI.
2. Copy the template file `zowe.template.json` to `zowe.json`. This file is ignored by git. Customize this file to include the command group(s) of your plugin(s), and the name(s) of your profiles, like the following:

        {
          "commandGroups": ["zos-files", "zos-jobs"],
          "profiles": ["zosmf-profile", "base-profile"]
        }
    *Note: No @zowe scoped plug-ins should be included in this repository, and the above is merely for demonstration purposes.*

3. Run the `npm run generate:commandTree` command. This will generate the CLI command tree.
4. Run the `npm run trim` command. This will extract the above command group(s) and profile(s) to the commandGroups and profiles directories.
5. Commit the newly created files. Ensure the commit is signed off.

## Using - Generating the Web Help

1. Install the CLI, and all @zowe scoped plug-ins. The CLI can also be accessed in this repository with `npx zowe`. 
2. Run the `npm run generate:commandTree` command. This will generate the CLI command tree from the CLI and @zowe packages.
3. Run the `npm run merge` command. This will merge all of the command groups in the defined folders.
4. Run the `npm run generate:webHelp` command. This will generate the web help in the generatedWebHelp directory.