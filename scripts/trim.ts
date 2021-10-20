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

(async() => {
    // Read and parse the files
    const zoweFile = join(__dirname, "..", "zowe.json");
    const zoweFileJSON = JSON.parse(readFileSync(zoweFile).toString());
    const zoweTreeFile = join(__dirname, "..", "commandTree.json");
    const zoweTreeFileJSON = JSON.parse(readFileSync(zoweTreeFile).toString());
    const commandTree = zoweTreeFileJSON.data;
    const commandGroups = zoweFileJSON.commandGroups;
    const profiles = zoweFileJSON.profiles;

    let commandGroupsFound = 0;
    let profilesFound = 0;

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
                const commandGroupFilePath = join(__dirname, "..", "commandGroups", commandGroupSearching + ".json");
                writeFileSync(commandGroupFilePath, JSON.stringify(commandGroup, (key, value) => (key !== "handler") ? value : "", 2));
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
                                const profilesCreateFilePath = join(profilesCreateDirectory, profileSearching + ".json");
                                writeFileSync(profilesCreateFilePath, JSON.stringify(
                                    profileType,
                                    (key, value) => (key !== "handler") ? value : "",
                                    2
                                ));
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
                                const profilesDeleteFilePath = join(profilesDeleteDirectory, profileSearching + ".json");
                                writeFileSync(profilesDeleteFilePath, JSON.stringify(
                                    profileType,
                                    (key, value) => (key !== "handler") ? value : "",
                                    2
                                ));
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
                                const profilesListFilePath = join(profilesListDirectory, profileSearching + ".json");
                                writeFileSync(profilesListFilePath, JSON.stringify(
                                    profileType,
                                    (key, value) => (key !== "handler") ? value : "",
                                    2
                                ));
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
                                const profilesSetDefaultFilePath = join(profilesSetDefaultDirectory, profileSearching + ".json");
                                writeFileSync(profilesSetDefaultFilePath, JSON.stringify(
                                    profileType,
                                    (key, value) => (key !== "handler") ? value : "",
                                    2
                                ));
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
                                const profilesUpdateFilePath = join(profilesUpdateDirectory, profileSearching + ".json");
                                writeFileSync(profilesUpdateFilePath, JSON.stringify(
                                    profileType,
                                    (key, value) => (key !== "handler") ? value : "",
                                    2
                                ));
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