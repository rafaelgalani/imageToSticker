import { Message, Client, GroupChatId, ContactId } from '@open-wa/wa-automate';

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
    
    private message: Message;

    private constructor(client: Client, message: Message){
        this.message = message;
        Object.assign(this, message);
        // let  type, id, from, fromMe, to, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message;
        // let { body } = message
        // const { name, formattedTitle } = chat;
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

        this.target = this.fromMe? this.chatId : this.from;
    }

    public static async getContext(client, message: Message) : Promise<ZapContext>{
        let instance = new ZapContext(client, message);
        await instance.setup();
        return instance;
    }
}