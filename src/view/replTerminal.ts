import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Controller } from '../controller';
import processor from '../repl/processor';

const TERMINAL_ELEMENT_ID = "console";
const CARRIAGE_RETURN = "\n\r";
const TERMINAL_ADDR = "\x1b[33mconsole$ \x1b[37m";
const CURR_LINE_REFRESH = "\x1b[2K\r";
const XTERM_PARAMS = {
    rows: 40,
    theme: {
        background: '#222'
    }
};

// A terminal to control the simulation
export class ReplTerminal {

    terminal: Terminal;
    command: string;
    history: string[];
    pointer: number;
    controller: Controller;

    constructor(controller: Controller) {
        this.command = "";
        this.controller = controller;
        this.terminal = new Terminal(XTERM_PARAMS);
        let fitAddon = new FitAddon();
        this.terminal.loadAddon(fitAddon);
        this.terminal.open(document.getElementById(TERMINAL_ELEMENT_ID));
        fitAddon.fit();
        this.setupTerminal();
    }

    execute(): void {
        if (this.command == "clear") {
            this.terminal.clear();
            this.terminal.write(CARRIAGE_RETURN + TERMINAL_ADDR);
        } else if (this.command) {
            this.processCommand();
            this.history.push(this.command);
            if (this.history.length > 20) {
                this.history.shift();
            }
        } else {
            this.terminal.write(CARRIAGE_RETURN + TERMINAL_ADDR);
        }
    }

    processCommand(): void {
        let result: string[] = processor(this.controller, this.command);
        result.forEach(str => {
            this.terminal.write(CARRIAGE_RETURN + str);
        })
        this.terminal.write(CARRIAGE_RETURN + TERMINAL_ADDR);
    }

    setupTerminal(): void {
        this.pointer = 0;
        this.history = [];
        let term = this.terminal;
        term.write("Welcome to prehistoric-involution!");
        this.execute();
        term.onKey((event) => {
            let key = event.key;
            let ev = event.domEvent;
            if (ev.keyCode === 13) {
                this.execute();
                this.command = "";
                this.pointer = 0;
            } else if (ev.keyCode == 8) {
                if (this.command) {
                    this.command = this.command.slice(0, this.command.length - 1);
                    term.write("\b \b");
                }
            } else if (ev.keyCode == 38) {
                if (this.pointer < this.history.length) {
                    this.pointer++;
                    this.command = this.history[this.history.length - this.pointer];
                    term.write(CURR_LINE_REFRESH + TERMINAL_ADDR + this.command);
                }
            } else if (ev.keyCode == 40) {
                if (this.pointer > 1) {
                    this.pointer--;
                    this.command = this.history[this.history.length - this.pointer];
                    term.write(CURR_LINE_REFRESH + TERMINAL_ADDR + this.command);
                }
            } else {
                this.command += key;
                term.write(key);
            }
        });
    }
}
