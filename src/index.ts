import { Client, create } from '@open-wa/wa-automate';
import msgHandler from 'src/handler/message';
import { newReply, sendReplyWithMentions } from 'src/lib/additional-content';
import * as puppeteer from 'puppeteer';
import { color, randomInt } from 'src/utils';


const start = async (client = new Client(void 0, void 0, void 0)) => {
    
    console.log('[DEV]', color('Red Emperor', 'yellow'))
    console.log('[CLIENT] CLIENT Started!')

    // Force it to keep the current session
    client.onStateChanged((state) => {
        //console.log('[Client State]', state)``
        if (state === 'CONFLICT' || state === 'DISCONNECTED') client.forceRefocus()
    })

    // listening on message
    client.onAnyMessage((message) => {
        // Cut message Cache if cache more than 3K
        client.getAmountOfLoadedMessages().then((msg) => (msg >= 3000) && client.cutMsgCache())
        // Message Handler
        msgHandler(client, message)
    })

    // listen group invitation
    client.onAddedToGroup(({ groupMetadata: { id }, contact: { name } }) =>
        client.getGroupMembersId(id)
            .then((ids) => {
                console.log('[CLIENT]', color(`Invited to Group. [ ${name} => ${ids.length}]`, 'yellow'))
            }))
}

(async () => {
    const options = {
        sessionId: 'botzim',
        headless: false,
        qrTimeout: 0,
        authTimeout: 0,
        devtools: false,
        useChrome: true, 
        killProcessOnBrowserClose: true,
        multiDevice: true,
    }
    
    create(options)
        .then((client) => start(client)  )
        .catch((err) => console.error(err))
})()
