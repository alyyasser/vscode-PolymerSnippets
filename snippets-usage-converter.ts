import fs = require('fs');

const rootPath = "snippets/";

class Main {
    public static run() {
        let files: Array<string> = getSnippetFiles(rootPath);
        // console.log(files);

        files.forEach(file => {
            // console.log(rootPath + file);
            // console.log(getSnippetRaw(rootPath + file));
            let obj = JSON.parse(getSnippetRaw(rootPath + file));
            let snippets = getSnippets(obj);
            console.log(snippets);
        });
    }
}

class Snippet {
    private _name: string;
    private _prefix: string;
    private _desc: string;

    constructor(name: string) {
        this.name = name;
    }

    get name(): string {
        return this._name;
    }

    set name(_name: string) {
        this._name = _name;
    }

    get prefix(): string {
        return this._prefix;
    }

    set prefix(_prefix: string) {
        this._prefix = _prefix;
    }

    get description(): string {
        return this._desc;
    }

    set description(_desc: string) {
        this._desc = _desc;
    }
}

function getSnippetFiles(path: string): Array<string> {
    return fs.readdirSync(path);
}

function getSnippetRaw(path: string): string {
    return fs.readFileSync(path, 'utf8');
}

function getSnippets(obj: any): Array<Snippet> {
    let snippets: Array<Snippet> = [];
    Object.keys(obj).forEach(key => {
        // console.log(key)
        let snippet = new Snippet(key);
        let body = obj[key];
        snippet.prefix = body['prefix'];
        snippet.description = body['description'];
        snippets.push(snippet);
    });
    return snippets;
}

Main.run();