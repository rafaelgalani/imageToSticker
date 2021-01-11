export function freeze (o) { return o };

export async function sendReplyWithMentions (chatId, body, quotedMsg) {
    return await window.WAPI.reply(chatId, body, quotedMsg, true)
}

export async function newReply (chatId, body, quotedMsg, tag = false) {
    if (typeof quotedMsg !== 'object') quotedMsg = Store.Msg.get(quotedMsg)
    const chat = Store.Chat.get(chatId)
    if (!chat) return false
    let extras = {}
    if (quotedMsg) {
        extras = {
            quotedParticipant: quotedMsg.author || quotedMsg.from,
            quotedStanzaID: quotedMsg.id.id
        }
    }
    const tempMsg = Object.create(Store.Msg.models.filter(msg => msg.__x_isSentByMe && !msg.quotedMsg)[0])
    const newId = window.WAPI.getNewMessageId(chatId)

    const extend = {
        ack: 0,
        id: newId,
        local: !0,
        self: 'out',
        t: parseInt(new Date().getTime() / 1000),
        to: new Store.WidFactory.createWid(chatId),
        isNewMsg: !0,
        type: 'chat',
        quotedMsg,
        body,
        ...extras
    }

    if (tag) {
        const mentionedJidList = body.match(/@(\d*)/g).filter(x => x.length > 5).map(x => Store.Contact.get(x.replace('@', '') + '@c.us') ? new Store.WidFactory.createUserWid(x.replace('@', '')) : '') || undefined
        extend.mentionedJidList = mentionedJidList
    }

    Object.assign(tempMsg, extend)
    const res = await Promise.all(await Store.addAndSendMsgToChat(chat, tempMsg))
    if (res[1] != 'success') return false
    return res[0].id._serialized
}
