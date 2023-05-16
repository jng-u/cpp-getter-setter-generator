// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Activate cpp getter and setter generator');
	
	const get_highlighted_text = function() {
		const editor = vscode.window.activeTextEditor;
        const selection = editor?.selection;
        if (selection && !selection.isEmpty) {
            const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
            const highlighted = editor.document.getText(selectionRange);
			return highlighted;
		}
		return '';
	}

    const gen_getter_func = function(highlighted) {
        const lines = highlighted.split('\n');
        let getter_string = '';
        // check validate line			
        for (let line of lines) {
            line = line.trim();
            if (line.length == 0)
                continue;
            let split_index = line.indexOf(' ');
            let vartype = line.substring(0, split_index);
            let vars = line.substring(split_index + 1, line.length - 1).split(',');
            for (let _var of vars) {
                _var = _var.replaceAll(' ', '');
                let prefix = '';
                let pointer_prefix_pos = _var.lastIndexOf('*');
                let reference_prefix_pos = _var.lastIndexOf('&');
                if (pointer_prefix_pos >= 0 || reference_prefix_pos >= 0) {
                    let prefix_pos = (pointer_prefix_pos >= reference_prefix_pos)? pointer_prefix_pos : reference_prefix_pos;
                    prefix = _var.substring(0, prefix_pos+1);
                    _var = _var.substring(prefix_pos+1, _var.length);
                }
                if (_var.endsWith(')'))
                    _var = _var.substring(0, _var.indexOf('('));
                getter_string += 'inline ' + vartype + prefix + ' get_' + _var + '() const { return ' + _var + '; }\n';
            }
        }
        return getter_string;
    }

    const gen_setter_func = function(highlighted) {
        const lines = highlighted.split('\n');
        let setter_string = '';
        // check validate line			
        for (let line of lines) {
            line = line.trim();
            if (line.length == 0)
                continue;
            let split_index = line.indexOf(' ');
            let vartype = line.substring(0, split_index);
            let vars = line.substring(split_index + 1, line.length - 1).split(',');
            for (let _var of vars) {
                _var = _var.replaceAll(' ', '');
                let prefix = '';
                let pointer_prefix_pos = _var.lastIndexOf('*');
                let reference_prefix_pos = _var.lastIndexOf('&');
                if (pointer_prefix_pos >= 0 || reference_prefix_pos >= 0) {
                    let prefix_pos = (pointer_prefix_pos >= reference_prefix_pos)? pointer_prefix_pos : reference_prefix_pos;
                    prefix = _var.substring(0, prefix_pos+1);
                    _var = _var.substring(prefix_pos+1, _var.length);
                }
                if (_var.endsWith(')'))
                    _var = _var.substring(0, _var.indexOf('('));
                setter_string += 'void set_' + _var + '(const ' + vartype + prefix + ' &' + _var + ') {\n this->' + _var + ' = ' + _var + '; \n}\n';
            }
        }
        return setter_string;
    }

    const gen_getter = vscode.commands.registerCommand('extension.generate_getter', () => {
        // The code you place here will be executed every time your command is executed	
        let highlighted = get_highlighted_text();
        if (highlighted.length != 0) {
            const getter_string = gen_getter_func(highlighted);
            vscode.env.clipboard.writeText(getter_string);
            // Display a message box to the user
            vscode.window.showInformationMessage('paste your getter code!');
        }
    });

	const gen_setter = vscode.commands.registerCommand('extension.generate_setter', () => {
        // The code you place here will be executed every time your command is executed	
        let highlighted = get_highlighted_text();
        if (highlighted.length != 0) {
            const setter_string = gen_setter_func(highlighted);
            vscode.env.clipboard.writeText(setter_string);
            // Display a message box to the user
            vscode.window.showInformationMessage('paste your setter code!');
        }
    });

	const gen_getter_setter = vscode.commands.registerCommand('extension.generate_getter_setter', () => {
        // The code you place here will be executed every time your command is executed	
        let highlighted = get_highlighted_text();
        if (highlighted.length != 0) {
            const getter_string = gen_getter_func(highlighted);
            const setter_string = gen_setter_func(highlighted);
            vscode.env.clipboard.writeText(getter_string+'\n'+setter_string);
            // Display a message box to the user
            vscode.window.showInformationMessage('paste your getter and setter code!');
        }
    });

	context.subscriptions.push(gen_getter);
	context.subscriptions.push(gen_setter);
	context.subscriptions.push(gen_getter_setter);
}

// this method is called when your extension is deactivated
function deactivate() {}

// eslint-disable-next-line no-undef
module.exports = {
	activate,
	deactivate
}
