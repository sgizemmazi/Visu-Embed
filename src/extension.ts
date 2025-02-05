import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "visu-embed.pasteImagePath",
    async () => {
      const clipboardText = await vscode.env.clipboard.readText();

      if (!clipboardText.startsWith("file://")) {
        vscode.window.showErrorMessage(
          "Clipboard does not contain a file path."
        );
        return;
      }

      // Dosya yolunu normalize et
      const filePath = clipboardText
        .replace("file://", "")
        .replace(/%20/g, " ");

      if (!fs.existsSync(filePath)) {
        vscode.window.showErrorMessage("File not found: " + filePath);
        return;
      }

      // Açık editördeki aktif konuma dosya yolunu yapıştır
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        editor.edit((editBuilder) => {
          editBuilder.insert(editor.selection.active, filePath);
        });
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
