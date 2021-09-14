import * as allCommands from 'src/entities/commands';
import { fullTrim } from 'src/utils';
import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";


export class HelpCommand extends ZapCommand {
    
    protected getPatterns(){
        return [ 'help', 'h', '?', 'ajuda', 'comando', 'comandos' ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule()
        ];
    }

    protected async runSpecificLogic() {
        let commands: ZapCommand[] = Object.keys(allCommands).map(a => new allCommands[a](null));        
        let commandsPatterns = commands.map(a => a.getPatternsAsString());

        const message = fullTrim(`
            Comandos disponíveis:
            
            ${commandsPatterns.join('\n\n')}
        `);

        await this.context.reply(message);
    }
}