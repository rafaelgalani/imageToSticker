import { isMention, resolvePath, toContactId, toMention } from "src/utils";
import { Message, Client, GroupChatId, ContactId, FilePath } from '@open-wa/wa-automate';
import { Mention, Title } from "src/types";

type PartialMessage = Partial<Message>;
export interface ZapContext extends PartialMessage { }

export class ZapContext {
    
    public static readonly COMMAND_PREFIX = '/';

    client: Client;

    name: string;
    pushname: string;
    formattedTitle: string;
    
    botNumber: ContactId;
    
    mentionedJidList: ContactId[];
    groupId: GroupChatId;
    groupAdmins: ContactId[];
    groupMembers: Array<ContactId>;
    isSenderGroupAdmin: boolean;
    isBotGroupAdmin: boolean;
    isSuperAdmin: boolean;

    command: string;
    arg: string;
    args: string[];
    isCmd: boolean;
    isQuotedImage: boolean;
    url: string;
    uaOverride: string;
    
    target: ContactId | GroupChatId;

    private constructor(client: Client, message: Message){
        Object.assign(this, message);
        this.client = client;
        let { pushname, formattedName } = (this.sender ?? {});
        this.pushname = pushname || formattedName // verifiedName is the name of someone who uses a business account
    }

    private tryGet = async(fn: Function, ...args) : Promise<any> => {
        try {
            return await fn(...args);
        } catch (e) {
            return null;
        }
    }

    private async setup(){
        this.botNumber = (await this.client.getHostNumber() + '@c.us') as ContactId;
        this.groupId = this.chat?.groupMetadata?.id;
        this.groupAdmins = this.isGroupMsg && this.groupId?  ( await this.tryGet(this.client.getGroupAdmins.bind(this.client), this.groupId)    || [] ) : [];
        this.groupMembers = this.isGroupMsg && this.groupId? ( await this.tryGet(this.client.getGroupMembersId.bind(this.client), this.groupId) || [] ) : [];
        this.isSenderGroupAdmin = this.groupAdmins.includes(this.sender?.id)
        this.isBotGroupAdmin = this.groupAdmins.includes(this.botNumber)
        
        this.isSuperAdmin = this.isGroupMsg && this.groupId && (this.chat?.groupMetadata?.owner?._serialized === this.from);

        const prefix = ZapContext.COMMAND_PREFIX;
        
        this.body = (this.type === 'chat' && this.body.startsWith(prefix)) ? this.body : (((this.type === 'image' || this.type === 'video') && this.caption) && this.caption.startsWith(prefix)) ? this.caption : ''
        this.command = this.body.slice(1).trim().split(/ +/).shift().toLowerCase()
        this.arg = this.body.substring(this.body.indexOf(' ') + 1)
        this.args = this.body.trim().split(/ +/).slice(1)
        this.isCmd = this.body.startsWith(prefix)
        this.isQuotedImage = this.quotedMsg && this.quotedMsg.type === 'image'
        this.url = this.args.length !== 0 ? this.args[0] : ''
        this.uaOverride = process.env.UserAgent
        
        this.uaOverride = process.env.UserAgent

        this.target = this.fromMe? this.chatId : this.from;
    }

    public static async getContext(client, message: Message) : Promise<ZapContext>{
        let instance = new ZapContext(client, message);
        await instance.setup();
        return instance;
    }

    public async reply(content: string){
        return await this.client.sendReplyWithMentions(this.isGroupMsg? this.groupId : this.from, content, this.id);
    }

    public async send(content: string){
        return await this.client.sendReplyWithMentions(this.isGroupMsg? this.groupId : this.from, content, this.id);
    }
    
    public async sendFile(filePath: `${string}/${string}.${string}`){
        const [ folder, fileName ] = filePath.split('/');
        return await this.client.sendFile(this.target, resolvePath('src', 'assets', folder, fileName), fileName, fileName, this.id, false, true);
    }

    public async getAllMembersMentioned() {
        return this.groupMembers.map(toMention);
    }

    public isAdmin(id: ContactId) {
        return this.groupAdmins.includes(id);
    }

    public getTitle(id: ContactId): Title  {
        return this.isAdmin(id)? 'admin' : 'membro(a) comum';
    }

    public getTitleAndMention(id: ContactId | Mention): `${Title} ${Mention}` {
        if (isMention(id)) return `${this.getTitle( toContactId(id as Mention) )} ${id as Mention}`;
        else return `${this.getTitle(id as ContactId)} ${toMention(id as ContactId)}`
    }

    public getSenderMention() {
        return toMention(this.sender.id);
    }

    public getSenderTitle() {
        return this.getTitle(this.sender.id);
    }
    
    public getSenderTitleAndMention(): `${Title} ${Mention}` {
        return `${this.getSenderTitle()} ${this.getSenderMention()}`
    }

    public getMentions(){
        return this.mentionedJidList.map(toMention)
    }

    public async removeSender(){
        return await this.client.removeParticipant(this.groupId, this.sender.id);
    }
    
    public async promote(id: ContactId){
        return await this.client.promoteParticipant(this.groupId, id);
    }
    
    public async demote(id: ContactId){
        return await this.client.demoteParticipant(this.groupId, id);
    }
}