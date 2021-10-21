/*
* This program and the accompanying materials are made available under the terms of the *
* Eclipse Public License v2.0 which accompanies this distribution, and is available at  *
* https://www.eclipse.org/legal/epl-v20.html                                            *
*                                                                                       *
* SPDX-License-Identifier: EPL-2.0                                                      *
*                                                                                       *
* Copyright Contributors to the Zowe Project.                                           *
*                                                                                       *
*/

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { jsonc as JSONC } from 'jsonc';
const wrap = require("word-wrap");

(async() => {
    // Read and parse the files
    const zoweFile = join(__dirname, "..", "zowe.json");
    const zoweFileJSON = JSONC.parse(readFileSync(zoweFile).toString());
    const zoweTreeFile = join(__dirname, "..", "commandTree.json");
    const zoweTreeFileJSON = JSONC.parse(readFileSync(zoweTreeFile).toString());
    const commandTree = zoweTreeFileJSON.data;
    const commandGroups = zoweFileJSON.commandGroups;
    const profiles = zoweFileJSON.profiles;

    let commandGroupsFound = 0;
    let profilesFound = 0;

    // Prepare to add copyrights to files
    let copyright: string;
    const copyrightPath = join(__dirname, "../", ".copyright");
    const wrapOptions = {indent: "// ", width: 77, trim: true};
    if (existsSync(copyrightPath)) {
        console.log("A copyright was found and will be used on all created files.");
        copyright = wrap(readFileSync(copyrightPath).toString(), wrapOptions);
    } else {
        const zoweCopyright = "Copyright Contributors to the Zowe Project.";
        console.log("No copyright file found, using default Zowe Copyright.");
        copyright = wrap(zoweCopyright, wrapOptions);
    }

    // Set up the directories, make sure they exist.
    const commandGroupsDirectory = join(__dirname, "..", "commandGroups");
    const profilesDirectory = join(__dirname, "..", "profiles");
    const profilesCreateDirectory = join(profilesDirectory, "create");
    const profilesDeleteDirectory = join(profilesDirectory, "delete");
    const profilesListDirectory = join(profilesDirectory, "list");
    const profilesSetDefaultDirectory = join(profilesDirectory, "set-default");
    const profilesUpdateDirectory = join(profilesDirectory, "update");
    if (!existsSync(commandGroupsDirectory)) { mkdirSync(commandGroupsDirectory); }
    if (!existsSync(profilesDirectory)) { mkdirSync(profilesDirectory); }
    if (!existsSync(profilesCreateDirectory)) { mkdirSync(profilesCreateDirectory); }
    if (!existsSync(profilesDeleteDirectory)) { mkdirSync(profilesDeleteDirectory); }
    if (!existsSync(profilesListDirectory)) { mkdirSync(profilesListDirectory); }
    if (!existsSync(profilesSetDefaultDirectory)) { mkdirSync(profilesSetDefaultDirectory); }
    if (!existsSync(profilesUpdateDirectory)) { mkdirSync(profilesUpdateDirectory); }

    // Save the command groups
    for (const commandGroupSearching of commandGroups) {
        for (const commandGroup of commandTree.children) {
            if (commandGroup.name === commandGroupSearching) {
                // We found the command group. Save it, and break out of the inner for loop.
                const commandGroupFilePath = join(__dirname, "..", "commandGroups", commandGroupSearching + ".jsonc");
                commonWriteFileSync(commandGroupFilePath, commandGroup, copyright);
                console.log("Command Group " + commandGroupSearching + " was found and saved to: " + resolve(commandGroupFilePath));
                commandGroupsFound++;
                break;
            }
        }
    }

    // Save the profiles
    for (const profileSearching of profiles) {
        let found = 0;
        for (const commandGroup of commandTree.children) {
            if (commandGroup.name === "profiles") {
                // We found the profiles command group - find create, list, delete, set-default, update
                for (const child of commandGroup.children) {
                    if (child.name === "create") {
                        // Profiles create
                        for (const profileType of child.children) {
                            if (profileType.name === profileSearching) {
                                // We found the requested profile. Save it and break out of the inner loop.
                                const profilesCreateFilePath = join(profilesCreateDirectory, profileSearching + ".jsonc");
                                commonWriteFileSync(profilesCreateFilePath, profileType, copyright);
                                console.log("Profile " + profileSearching + " was found and saved to: " + resolve(profilesCreateFilePath));
                                found++;
                                break;
                            }
                        }
                    } else if (child.name === "delete") {
                        // Profiles delete
                        for (const profileType of child.children) {
                            if (profileType.name === profileSearching) {
                                // We found the requested profile. Save it and break out of the inner loop.
                                const profilesDeleteFilePath = join(profilesDeleteDirectory, profileSearching + ".jsonc");
                                commonWriteFileSync(profilesDeleteFilePath, profileType, copyright);
                                console.log("Profile " + profileSearching + " was found and saved to: " + resolve(profilesDeleteFilePath));
                                found++;
                                break;
                            }
                        }
                    } else if (child.name === "list") {
                        // Profiles list
                        for (const profileType of child.children) {
                            if (profileType.name === profileSearching + "s") {
                                // We found the requested profile. Save it and break out of the inner loop.
                                // Yes, we add s, and that is intended.
                                const profilesListFilePath = join(profilesListDirectory, profileSearching + ".jsonc");
                                commonWriteFileSync(profilesListFilePath, profileType, copyright);
                                console.log("Profile " + profileSearching + " was found and saved to: " + resolve(profilesListFilePath));
                                found++;
                                break;
                            }
                        }
                    } else if (child.name === "set-default") {
                        // Profiles set-default
                        for (const profileType of child.children) {
                            if (profileType.name === profileSearching) {
                                // We found the requested profile. Save it and break out of the inner loop.
                                const profilesSetDefaultFilePath = join(profilesSetDefaultDirectory, profileSearching + ".jsonc");
                                commonWriteFileSync(profilesSetDefaultFilePath, profileType, copyright);
                                console.log("Profile " + profileSearching + " was found and saved to: " + resolve(profilesSetDefaultFilePath));
                                found++;
                                break;
                            }
                        }
                    } else if (child.name === "update") {
                        // Profiles update
                        for (const profileType of child.children) {
                            if (profileType.name === profileSearching) {
                                // We found the requested profile. Save it and break out of the inner loop.
                                const profilesUpdateFilePath = join(profilesUpdateDirectory, profileSearching + ".jsonc");
                                commonWriteFileSync(profilesUpdateFilePath, profileType, copyright);
                                console.log("Profile " + profileSearching + " was found and saved to: " + resolve(profilesUpdateFilePath));
                                found++;
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (found === 5) { profilesFound++; }
    }

    console.log("Script completed.");
    if (commandGroupsFound !== commandGroups.length) { console.log("Not all requested command groups were found. Please review script output."); }
    if (profilesFound !== profiles.length) { console.log("Not all requested profile commands were found. Please review script output."); }
})().catch((error) => {
    console.log(error);
    process.exit(1);
});

function commonWriteFileSync(path: string, json: any, copyright: string) {
    const data = copyright + "\n" + JSONC.stringify(
        json,
        (key, value) => (key !== "handler") ? value : "",
        2
    );
    writeFileSync(path, data);
}