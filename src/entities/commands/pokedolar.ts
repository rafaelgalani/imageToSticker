import { loadJSON } from "src/utils";
import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
import axios from "axios";

type Pokemon = { id: number, name: { english: string } };
export class PokedolarCommand extends ZapCommand {
    
    public getPatterns(){
        return ['pokedolar'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Só pode ser usado em grupo.'), 
        ];
    }

    protected async runSpecificLogic() {
        const { groupId } = this.context;
        const conversionAPI = 'https://economia.awesomeapi.com.br/json/last/USD-BRL';
        const { data: { USDBRL: { ask: dollar } } } = await axios.get(conversionAPI);
        const parsedDollar = dollar.replace('.', ',').substring(0, 4);
        let pokeID = dollar.replace('.', '').substring(0, 3);

        if ( pokeID <= 9 ) {
            pokeID = "00" + pokeID;
        } else if (pokeID <= 99) {
            pokeID = "0" + pokeID;
        }

        const pokeHashmap = loadJSON< Record< string, Pokemon > >( 'pokedex', true );
        const { name: { english: pokeDolar } } = pokeHashmap[ pokeID ];
        const caption = `O dólar está valendo *R$${parsedDollar}*.\nO PokeDólar do momento é: *#${pokeID} - ${pokeDolar}*`
        const imageFile = `${pokeID}${pokeDolar}`;
        const imageURL = `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${pokeID}.svg`;
        return await this.context.client.sendImage(groupId, imageURL, imageFile, caption);
    }
}