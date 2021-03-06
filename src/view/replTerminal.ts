import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Controller } from '../controller';
import { createTable } from '../repl/util';
import processor from '../repl/processor';

const TERMINAL_ELEMENT_ID = "console";
const CARRIAGE_RETURN = "\n\r";
const TERMINAL_ADDR = "\x1b[33mconsole$ \x1b[37m";
const CURR_LINE_REFRESH = "\x1b[2K\x1b[37m\r";
const XTERM_PARAMS = {
    rows: 40,
    theme: {
        background: '#222'
    },
    scrollback: 2000
};

const HELP_DESC = [
    ["help", "more detailed help, more commands available"],
    ["reg", "regenerate map (and reset sim)"],
    ["run 10", "run 10 years"],
    ["sim", "describe current simulation"],
    ["mode", "change display mode"],
    ["market", "describe current market"],
    ["click", "map is interactive"],
    ["repo", "go to source (github)"],
];
const HELP_TABLE = createTable("HELP", ["COMMAND", "EFFECT"], HELP_DESC);

// A terminal to control the simulation
export class ReplTerminal {

    terminal: Terminal;
    command: string;
    history: string[];
    pointer: number;
    controller: Controller;
    paste: string;
    memcmds: string[];

    constructor(controller: Controller) {
        this.command = "";
        this.controller = controller;
        this.terminal = new Terminal(XTERM_PARAMS);
        let fitAddon = new FitAddon();
        this.terminal.loadAddon(fitAddon);
        this.terminal.open(document.getElementById(TERMINAL_ELEMENT_ID));
        fitAddon.fit();
        this.setupTerminal();
        this.paste = "";
        this.memcmds = [];
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

    processCommand(nested: boolean = false): void {
        let command = this.command.trim();
        let result: string[] = processor(this.controller, command);
        result.forEach(str => {
            this.terminal.write(CARRIAGE_RETURN + str);
        })
        if (!nested) {
            this.terminal.write(CARRIAGE_RETURN + TERMINAL_ADDR);
        }
    }

    setupTerminal(): void {
        this.pointer = 0;
        this.history = [];
        let term = this.terminal;
        term.write("Welcome to prehistoric simulation");
        HELP_TABLE.forEach(str => {
            term.write(CARRIAGE_RETURN + str);
        })
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
            } else if (ev.keyCode == 37 || ev.keyCode == 39) {
                // Disable.
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
            } else if (ev.keyCode == 67 && ev.ctrlKey) {
                this.paste = term.getSelection();
            } else if (ev.keyCode == 86 && ev.ctrlKey) {
                this.command += this.paste;
                term.write(CURR_LINE_REFRESH + TERMINAL_ADDR + this.command);
            } else {
                this.command += key;
                term.write(key);
            }
        });
    }

    writeCommand(command: string): void {
        this.command = command;
        this.terminal.write(CURR_LINE_REFRESH + TERMINAL_ADDR + this.command);
    }

    identifyMobile(): void {
        let mobileWarn = "\x1b[36mWARN: It seems that you're viewing from mobile, "
            + "simulation is in headless mode"
        this.terminal.write(CURR_LINE_REFRESH + mobileWarn);
        this.terminal.write(CARRIAGE_RETURN + TERMINAL_ADDR);
    }
}
