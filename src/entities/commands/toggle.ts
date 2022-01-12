import * as allCommands from ".";
import { GroupOnlyRule, IsFromBotRule } from "../rules";
import { ZapCommand } from "./command";
import { loadJSON, saveJSON } from "src/utils";

export class ToggleCommand extends ZapCommand {
    
    public getPatterns(){
        return ['toggle', ];
    }

    protected getRules(){
        return [ 
            new IsFromBotRule(), 
            new GroupOnlyRule(), 
        ];
    }

    protected async runSpecificLogic() {
        let disabledCommands = loadJSON(`${ this.context.groupId }-disabled-commands`) as string[] || [];

        const [ commandToToggle ] = this.context.args;

        let targetCommand: ZapCommand | null = null;
        const commands: ZapCommand[] = Object.keys(allCommands).map(a => new allCommands[a](this.context, allCommands[a].cooldownOptions));

        for(let command of commands){
            if (command.getPatternsAsString().includes( commandToToggle )) {
                targetCommand = command;
                break;
            }
        }

        if (targetCommand === null) return await this.context.reply(`Command not found.`);

        // if command was disabled, then re-enable it. otherwise, disable it.
        if ( disabledCommands.includes( commandToToggle ) ) {
            disabledCommands = disabledCommands.filter( command => !targetCommand.getPatterns().includes( command ) )
        } else {
            disabledCommands = [...disabledCommands].concat( targetCommand.getPatterns() );
        }

        saveJSON(`${this.context.groupId}-disabled-commands`, disabledCommands);
    
        return await this.context.reply(`👍`)
    }
}