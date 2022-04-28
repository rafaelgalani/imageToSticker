import { loadJSON } from "src/utils";
import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
import axios from "axios";

export class PokedolarCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['pokedolar'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Só pode ser usado em grupo.'), 
        ];
    }

    protected async runSpecificLogic() {
        const { groupId } = this.context;
        const filename = 'pokedex_data';
        const conversionAPI = 'https://economia.awesomeapi.com.br/json/last/USD-BRL';
        const { data: { USDBRL: { ask: dollar } } } = await axios.get(conversionAPI);
        const parsedDollar = dollar.replace('.', ',').substring(0, 4);
        const pokeID = parseInt(dollar.replace('.', '').substring(0, 3));
        const pokeHashmap = loadJSON(filename);
        const { name: { english: pokeDolar } } = pokeHashmap.find(pkm => pkm.id === pokeID);
        const caption = `O dólar está valendo *R$${parsedDollar}*.\nO PokeDólar do momento é: *#${pokeID} - ${pokeDolar}*`
        const imageFile = `${pokeID}${pokeDolar}`;
        const imageURL = `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${pokeID}.svg`;
        return await this.context.client.sendImage(groupId, imageURL, imageFile, caption);
    }
}