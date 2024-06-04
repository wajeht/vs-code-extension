import * as fs from "fs";
import * as vscode from "vscode";
import { Config, ConfigItem } from "..";
import { runInLaravel } from "./../PHP";
import { createFileWatcher } from "./../support/fileWatcher";
import { projectPath } from "./../support/project";

class ConfigRepository {
    items: ConfigItem[] = [];
    cachedFilePaths = new Map<string, vscode.Uri | undefined>();

    constructor() {
        this.load();

        createFileWatcher("config/{,*,**/*}.php", this.load.bind(this));
    }

    private load() {
        runInLaravel<Config>("echo json_encode(config()->all());", "Configs")
            .then((result) => {
                this.items = this.getConfigs(result, true);
            })
            .catch(function (exception) {
                console.error(exception);
            });
    }

    getConfigs(conf: Config, topLevel = false): ConfigItem[] {
        // TODO: Boo?
        let result: any[] = [];

        let uri = undefined;

        for (let key in conf) {
            if (topLevel) {
                let path = projectPath(`config/${key}.php`);
                uri = fs.existsSync(path) ? vscode.Uri.file(path) : undefined;

                this.cachedFilePaths.set(key, uri);
            }

            result.push(this.getConfigValue(conf, key, uri));
        }

        return result.flat();
    }

    getConfigValue(
        conf: Config,
        key: string,
        uri: vscode.Uri | undefined,
    ): ConfigItem | ConfigItem[] {
        if (conf[key] instanceof Object) {
            return [{ name: key, value: "array(...)", uri }].concat(
                this.getConfigs(conf[key]).map((c) => ({
                    ...c,
                    uri: uri || this.cachedFilePaths.get(key),
                    name: `${key}.${c.name}`,
                })),
            );
        }

        return {
            name: key,
            value: conf[key] instanceof Array ? "array(...)" : conf[key],
            uri: uri || this.cachedFilePaths.get(key),
        };
    }
}

export default new ConfigRepository();