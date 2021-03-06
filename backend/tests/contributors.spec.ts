import { expect } from "chai";
import * as sinon from "sinon";
import * as _ from "lodash";
import { mockVscode } from "./mockUtil";

const testVscode = {
    extensions: {
        all: new Array()
    }
};

mockVscode(testVscode, "src/contributors.ts");
import { Contributors } from "../src/contributors";

describe('Contributors unit test', () => {
    let sandbox: any;
    let extensionsMock: any;
    let contributorsMock: any;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    after(() => {
        sandbox.restore();
    });

    beforeEach(() => {
        extensionsMock = sandbox.mock(testVscode.extensions);
        contributorsMock = sandbox.mock(Contributors);
    });

    afterEach(() => {
        extensionsMock.verify();
        contributorsMock.verify();
    });

    describe('init', () => {
        it("No Contributors", () => {
            contributorsMock.expects("add").never();
            Contributors.init();
        });
    });

    describe('getSnippet', () => {
        function createCodeSnippetQuestions(): any[] {
            const questions: any[] = [];
        
            questions.push(
                {
                  guiOptions: {
                    hint: "hint actionTemplate"
                  },
                  type: "list",
                  name: "actionTemplate",
                  message: "Action Template",
                  choices: [
                    'OData action',
                    'Offline action',
                    'Message acion',
                    'Change user password'
                  ]
                }
              );
          
            return questions;
        }
        function getSnippet(context: any): any {
            return {
                getMessages() {
                    return messageValue;
                },
                async getQuestions() {
                    return createCodeSnippetQuestions();
                },
                async getWorkspaceEdit(answers: any) {
                }
            };
        }
        const messageValue = {title: "Create a new action", 
                              description: "Select the action, target, service and the entity set you want to connect to."};

        const snippetName = "snippet_1";
        const api = {
            getCodeSnippets(context: any) {
                const snippets = new Map<string, any>();
                const snippet: any = getSnippet(context);
                snippets.set(snippetName, snippet);
                return snippets;
            },
        };
        const extensionId = "SAPOSS.vscode-snippet-contrib";
        Contributors.add(extensionId, api);
        
        it("receives valid contributorId and snippetName ---> returns valid snippet", () => {
            const uiOptions = {
                "contributorId": extensionId,
                "snippetName": snippetName
              };
              const snippet = Contributors.getSnippet(uiOptions);
              expect(snippet.getMessages()).to.deep.equal(messageValue);
        });

        it("receives no contributorId and no snippetName ---> returns undefined snippet", () => {
            const uiOptions = {};
            const snippet = Contributors.getSnippet(uiOptions);
                expect(snippet).to.be.undefined;
        });
    });

});

