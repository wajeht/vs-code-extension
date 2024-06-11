import * as vscode from "vscode";

type Tags = Tag[];

interface Tag {
    class?: string;
    functions?: string[];
    classDefinition?: string;
    functionDefinition?: string;
    classExtends?: string;
    classImplements?: string;
}

interface CompletionItemFunction {
    fqn: string | null;
    function: string | null;
    parameters: string[];
    classDefinition: string | null;
    functionDefinition: string | null;
    classExtends: string | null;
    classImplements: string[];
    param: {
        index: number;
        isArray: boolean;
        isKey: boolean;
        key: string | null;
        keys: string[];
    };
}

interface Model {
    fqn: string;
    attributes: {
        default: string;
        camel: string;
        snake: string;
    }[];
    accessors: string[];
    relations: string[];
    camelCase: string;
    snakeCase: string;
    pluralCamelCase: string;
    pluralSnakeCase: string;
}

interface Config {
    [key: string]: any;
}

interface ConfigItem {
    name: string;
    value: string;
    uri?: vscode.Uri;
}

interface CompletionProvider {
    tags(): Tags;
    customCheck?(func: CompletionItemFunction): boolean;
    provideCompletionItems(
        func: CompletionItemFunction,
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext,
    ): vscode.CompletionItem[];
}

interface View {
    name: string;
    relativePath: string;
    uri: vscode.Uri;
}

type HoverProvider = (
    doc: vscode.TextDocument,
    pos: vscode.Position,
) => vscode.ProviderResult<vscode.Hover>;

type LinkProvider = (doc: vscode.TextDocument) => vscode.DocumentLink[];
