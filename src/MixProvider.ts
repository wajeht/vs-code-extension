"use strict";

import * as vscode from "vscode";
import * as fs from "fs";
import Helpers from "./helpers";
import { CompletionItemFunction, Provider, Tags } from ".";

export default class MixProvider implements Provider {
    private mixes: any[] = [];

    constructor() {
        this.load();
        // TODO: wat
        // setInterval(() => this.load(), 60000);
    }

    tags(): Tags {
        return { classes: [], functions: ["mix"] };
    }

    provideCompletionItems(
        func: CompletionItemFunction,
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext,
    ): vscode.CompletionItem[] {
        return this.mixes.map((mix) => {
            let completeItem = new vscode.CompletionItem(
                mix,
                vscode.CompletionItemKind.Value,
            );

            completeItem.range = document.getWordRangeAtPosition(
                position,
                Helpers.wordMatchRegex,
            );

            return completeItem;
        });
    }

    load() {
        try {
            const path = Helpers.projectPath("public/mix-manifest.json");

            if (!fs.existsSync(path)) {
                return;
            }

            let mixes = JSON.parse(fs.readFileSync(path, "utf8"));

            this.mixes = Object.keys(mixes).map((mixFile) =>
                mixFile.replace(/^\//g, ""),
            );
        } catch (exception) {
            console.error(exception);
        }
    }
}