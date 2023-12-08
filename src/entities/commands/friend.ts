import { isMention } from "src/utils";
import { ArgumentFormat, ArgumentFormatterRule, GroupOnlyRule, SelfReferenceRule } from "../rules";
import { ZapCommand } from "./command";

export class FriendCommand extends ZapCommand {
  public getPatterns() {
    return ["friend", "amigo", "parça", "parca"];
  }

  protected getRules() {
    return [
      new GroupOnlyRule(),
      new SelfReferenceRule(),
      new ArgumentFormatterRule([
        new ArgumentFormat(isMention).override(
          "Os parâmetros do comando só podem ser menções à outros membros."
        ),
      ]),
    ];
  }

  private buildFriendSentence(members: string[]) {
    const lastMember = members.pop();
    const membersSentence = members.length
      ? `${members.join(", ")} e o(a) ${lastMember}`
      : lastMember;

    return `${membersSentence} SÃO AMIGOS(AS) DO ${this.context.getSenderMention()}!`;
  }

  protected async runSpecificLogic() {
    const members = this.context.getMentionsWithTitle(true);
    return await this.context.reply(
        this.buildFriendSentence(members)
    );
  }
}