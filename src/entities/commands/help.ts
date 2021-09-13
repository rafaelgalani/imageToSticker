import * as allCommands from 'entities/commands';
import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";


export class HelpCommand extends ZapCommand {
    
    protected getPatterns(){
        return [ 'help', 'h', '?', 'ajuda', 'comando', 'comandos' ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Só funciona no grupo.'), 
        ];
    }

    protected async runSpecificLogic() {
        const { client, target } = this.context;

        let commands: ZapCommand[] = Object.keys(allCommands).map(a => new allCommands[a](null));        
        let commandsPatterns = commands.map(a => a.getPatternsAsString());

        const message = [
            'Comandos disponíveis:',
            '',
            commandsPatterns.join('\n\n')
        ];

        await client.sendReplyWithMentions(target, message.join('\n'), this.context.id)
    }
}