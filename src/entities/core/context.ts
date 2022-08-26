import { isMention, resolvePath, toContactId, toMention, toAliasOrMention } from "src/utils";
import { Message, Client, GroupChatId, ContactId, FilePath } from '@open-wa/wa-automate';
import { Alias, Mention, Title } from "src/types";
import { loadJSON } from "src/utils";

type PartialMessage = Partial<Message>;
export interface ZapContext extends PartialMessage { }

export class ZapContext {
    
    public static readonly COMMAND_PREFIX = '/';

    client: Client;
    message: Message;

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

    disabledCommands: string[];

    private constructor(client: Client, message: Message){
        Object.assign(this, message);
        this.message = message;
        this.client = client;
        let { pushname, formattedName } = (this.sender ?? {});
        this.pushname = pushname || formattedName // verifiedName is the name of someone who uses a business account

        this.disabledCommands = loadJSON< string[] >(`${this.chat?.groupMetadata?.id}-disabled-commands`) ?? [];
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
        return await this.client.sendReplyWithMentions(this.isGroupMsg? this.groupId : this.chat.id, content, this.id);
    }

    public async dm( message: string ){
        if ( this.sender ) {
            return await this.client.sendText( this.sender.id, message );
        }

        return null;
    }

    public async send(content: string){
        return await this.client.sendReplyWithMentions(this.isGroupMsg? this.groupId : this.chat.id, content, this.id);
    }
    
    public async sendFile(filePath: `${string}/${string}.${string}`){
        const [ folder, fileName ] = filePath.split('/');
        return await this.client.sendFile(this.target, resolvePath('src', 'assets', folder, fileName), fileName, fileName, this.id, false, true);
    }

    public async getAllGroupMembersMentions() {
        return this.groupMembers.map(member => toAliasOrMention(member, this.groupId));
    }

    public isAdmin(id: ContactId) {
        return this.groupAdmins.includes(id);
    }

    public getTitle(id: ContactId): Title  {
        return this.isAdmin(id)? 'admin' : 'membro(a) comum';
    }

    public getAlias(id: ContactId): Alias | Mention  {
        return toAliasOrMention(id, this.groupId);
    }

    public getTitleAndMention(id: ContactId | Mention): `${Title} ${Alias|Mention}` {
        if (isMention(id)) return `${this.getTitle( toContactId(id as Mention) )} ${id as Mention}`;
        else return `${this.getTitle(id as ContactId)} ${toAliasOrMention(id as ContactId, this.groupId)}`
    }

    public getSenderMention() {
        return toAliasOrMention(this.sender.id, this.groupId);
    }

    public getSenderTitle() {
        return this.getTitle(this.sender.id);
    }
    
    public getSenderTitleAndMention(): `${Title} ${Alias|Mention}` {
        return `${this.getSenderTitle()} ${this.getSenderMention()}`
    }

    public getMentions(unique?: boolean){
        const list = unique? [ ...new Set(this.mentionedJidList) ] : this.mentionedJidList;
        return list.map(a => toAliasOrMention(a, this.groupId))
    }

    public getMentionsWithTitle(unique?: boolean){
        const list = unique? [ ...new Set(this.mentionedJidList) ] : this.mentionedJidList;
        return list.map(a => `${this.getTitle(a)} ${toAliasOrMention(a, this.groupId)}`)
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