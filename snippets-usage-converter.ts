// script usage: ts-node snippets-usage-converter.ts

import fs = require('fs');

const rootPath = "snippets/";

class Main {
    public static run() {
        let files: Array<string> = getSnippetFiles(rootPath);
        let snippets: Array<Snippet> = [];

        files.forEach(file => {
            let raw = getSnippetRaw(rootPath + file);
            let obj = JSON.parse(raw);
            let lines = raw.split('\r\n');
            Object.keys(obj).forEach(key => {
                let str = lines.filter((value) => {
                    return value.indexOf(`"${key}"`) != -1;
                })[0];
                snippets.push(Snippet.parse(key, obj[key], file, lines.indexOf(str) + 1));
            });

        });

        let readme = fs.readFileSync('README.md', 'utf8');
        let lines = readme.split('\n');
        let start = lines.indexOf('--- | --- | ---') + 1;
        let end = lines.indexOf('## License');
        if (start < end - 1) {
            lines.splice(start, end - start, null);
        }
        snippets.forEach(snippet => {
            lines.splice(start, 0, snippet.buildUsageString());
            lines.push(snippet.buildSourceLink());
            start++;
        })
        fs.writeFileSync('README.md', lines.join('\n'));
    }
}

class Snippet {
    private _name: string;
    private _prefix: string;
    private _desc: string;
    private _file: string;
    private _line: number;

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

    get file(): string {
        return this._file;
    }

    set file(_file: string) {
        this._file = _file;
    }

    get line(): number {
        return this._line;
    }

    set line(_line: number) {
        this._line = _line;
    }

    buildUsageString(): string {
        return `[${this.name}][${this.name}-src] | \`${this.prefix}\` | ${this.description}`;
    }

    buildSourceLink(): string {
        return `[${this.name}-src]: https://github.com/alyyasser/vscode-PolymerSnippets/tree/master/${rootPath}${this.file}#L${this.line}`;
    }

    static parse(key: string, body: any, file: string, line: number): Snippet {
        let snippet = new Snippet(key);
        snippet.prefix = body['prefix'];
        snippet.description = body['description'];
        snippet.file = file;
        snippet.line = line;
        return snippet;
    }
}

function getSnippetFiles(path: string): Array<string> {
    return fs.readdirSync(path);
}

function getSnippetRaw(path: string): string {
    return fs.readFileSync(path, 'utf8');
}

Main.run();