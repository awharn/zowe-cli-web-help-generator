import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { WebHelpGenerator, Imperative, ImperativeConfig, IHandlerResponseApi, HandlerResponse, CommandResponse } from "@zowe/imperative";
import { getImperativeConfig } from "@zowe/cli";

(async() => {
    // Set up the environment and build the command tree
    const zoweVer = "1.25.0"
    const filePath = join(__dirname, "../", "commandTree.json");
    const localWebHelpDir = join(__dirname, "../", "generatedWebHelp");
    const fullCommandTree = readFileSync(filePath).toString();
    const fullCommandTreeJson = JSON.parse(fullCommandTree).data;
    const CLIImperativeConfig = getImperativeConfig();
    const fakeHandlerResponse: IHandlerResponseApi = new HandlerResponse(new CommandResponse({silent: true, responseFormat: "default"}));

    // Initialize Imperative and build the web help generator
    delete CLIImperativeConfig.commandModuleGlobs;
    await Imperative.init(CLIImperativeConfig);
    const loadedImperativeConfig = ImperativeConfig.instance;
    const webHelpGenerator = new WebHelpGenerator(fullCommandTreeJson, loadedImperativeConfig, localWebHelpDir)
    
    // Generate the web-help
    webHelpGenerator.sanitizeHomeDir = true;
    webHelpGenerator.buildHelp(fakeHandlerResponse);

    // Update the tree data to have our release information
    const treeDataPath = join(__dirname, "..", "generatedWebHelp", "tree-data.js")
    const treeData = readFileSync(treeDataPath).toString();
    const modifiedTreeData = treeData.replace("zowe 0.0.1", `Zowe v${zoweVer}`);
    writeFileSync(treeDataPath, modifiedTreeData);

    console.log("Output located in " + localWebHelpDir);
})().catch((error) => {
    console.log(error);
    process.exit(1);
});