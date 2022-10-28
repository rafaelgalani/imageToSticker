import { ContactId } from "@open-wa/wa-automate";
import { isMention, loadJSON, saveJSON, toContactId, toGroupAliasOrMention } from "src/utils";
import { GroupOnlyRule, IsFromBotRule } from "../rules";
import { ZapCommand } from "./command";
export class FoiDeBaseCommand extends ZapCommand {
	public getPatterns() {
		return ["base"];
	}

	protected getRules() {
		return [
			new IsFromBotRule(),
			new GroupOnlyRule()
		];
	}

	protected async runSpecificLogic() {
		const { args, groupId } = this.context;
		const [ member ] = args;
		const filename = `purged-members-group-${groupId}`;

		let members = loadJSON< Array<ContactId> >(filename) ?? [];

		if ( ! isMention( member ) ) {
			if ( member === 'list' ) {
				return await this.context.reply(
					members.length? 
					`Membros que foram de base:

					${members.map( member => `${ toGroupAliasOrMention( member, groupId ) }` )}` : 

					`Não há membros que foram de base.`
				);
			}
			if ( member === 'remove' ) {
				const targetMember = args[1];
				if ( ! isMention( targetMember ) ) {
					return await this.context.reply( 'Mencione o membro corretamente.' );
				}

				members = members.filter( member => member !== targetMember );
				saveJSON( filename, members );
				return await this.context.reply( 'O membro foi removido da base.' );
			}
		} else {
			const memberContactId = toContactId( member );
			if ( members.includes( memberContactId ) ) {
				return await this.context.reply(
					`Este membro já foi de base.`
					);
				}

				members.push( memberContactId );
				saveJSON( filename, members );
				return await this.context.reply(
					`Membro foi diretamente de base.`
				);
		}
	}
}