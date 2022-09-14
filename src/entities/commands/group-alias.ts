import { ContactId } from "@open-wa/wa-automate";
import { Mention } from "src/types";
import { saveJSON, loadJSON, isMention, toMention } from "src/utils";
import { AllowBotArgumentRule, ArgumentFormat, ArgumentFormatterRule, BotAdminRule, GroupOnlyRule, IsFromBotRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
export class GroupAliasCommand extends ZapCommand {
    
    public getPatterns(){
        return ['groupalias' ];
    }

    protected getRules(){
        return [ 
            new IsFromBotRule(),
            new GroupOnlyRule().override('Só pode ser usado em grupo.'), 
        ];
    }

    protected async runSpecificLogic() {
        const { args, groupId, sender } = this.context;
        const [ member, chosenAlias ] = args;
        if (chosenAlias.length >= 30 || Array.from(chosenAlias)[0] == '@') {
          return await this.context.reply([
            `Apelido inválido:`,
            `  - Tamanho máximo: 30 caracteres;`,
            `  - Não pode ser uma menção.`,
          ].join('\n'));
        }
        const filename = `groupaliases-group-${groupId}`;

        const aliasesHashmap = loadJSON<Record<string, string>>(filename) ?? {};
        const normalizedAliases = Object.values( aliasesHashmap ).map(a => a.toLowerCase());
        if ( member === 'list' ) {
          return await this.context.reply(
            Object.entries( aliasesHashmap ).map(([ member, alias ]: [ Mention, string ]) => `${member}: ${alias}`).join('\n')
          );
        }
        
        if ( normalizedAliases.includes( chosenAlias.toLowerCase() ) ) {
            return await this.context.reply(`${chosenAlias} já foi definido como apelido para outro membro. Escolha outro apelido.`);
        }

        if ( ['reset', 'delete', 'remove'].includes( chosenAlias.toLowerCase() ) ) {
            delete aliasesHashmap[ member ];
            saveJSON(filename, aliasesHashmap);

            return await this.context.reply(
              `O apelido do membro foi removido.`
            );
        }

        aliasesHashmap[ member ] = chosenAlias;
        saveJSON( filename, aliasesHashmap );

        return await this.context.reply(`O apelido do membro no grupo foi definido como "${chosenAlias}".`);
    }
}