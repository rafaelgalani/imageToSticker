import { randomInt } from "src/utils";
import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
export class GhælPokemonCommand extends ZapCommand {
    
    public getPatterns(){
        return ['ghael', 'ghæl', 'g'];
    }

    protected getRules(){
        return [ new GroupOnlyRule() ];
    }

    protected async runSpecificLogic() {
        let randomFuck = randomInt(3, 1);
        return await this.context.sendFile(`audios/ghael${randomFuck}.mp3`);
    }
}