import { create, Client } from '@open-wa/wa-automate';
import { color, messageLog } from './utils';
import msgHandler from './handler/message';
import * as puppeteer from 'puppeteer';

import { freeze, sendReplyWithMentions, newReply } from './lib/additional-content.js';

const start = async (client = new Client(void 0, void 0, void 0)) => {
    
    console.log('[DEV]', color('Red Emperor', 'yellow'))
    console.log('[CLIENT] CLIENT Started!')

    await client.getPage().evaluate( ({
        newReply, 
        sendReplyWithMentions,
    }) => {
        eval(newReply)
        eval(sendReplyWithMentions)

        eval('window.WAPI.reply = newReply')
        eval('window.WAPI.sendReplyWithMentions = sendReplyWithMentions')
    }, {
        newReply: newReply.toString() , 
        sendReplyWithMentions: sendReplyWithMentions.toString() ,
    }); 
    
    console.log('[CLIENT] INJECTED EXTERNAL LIB XDDDDDDDDDDDDDDDDDDDDDDDDDDD!')

    // Message log for analytic
    //client.onAnyMessage((fn) => messageLog(fn.fromMe, fn.type))

    // Force it to keep the current session
    client.onStateChanged((state) => {
        //console.log('[Client State]', state)
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
                // conditions if the group members are less than 10 then the bot will leave the group
/*                 if (ids.length <= 10) {
                    client.sendText(id, 'Sorry, the minimum group member is 10 user to use this bot. Bye~').then(() => client.leaveGroup(id))
                } else {
                    client.sendText(id, `Hello group members *${name}*, thank you for inviting this bot, to see the bot menu send *#menu*`)
                } */
            }))

    // listen paricipant event on group (wellcome message)
    client.onGlobalParticipantsChanged(async (event) => {
        // const host = await client.getHostNumber() + '@c.us'
        // if (event.action === 'add' && event.who !== host) client.sendTextWithMentions(event.chat, `Hello, Welcome to the group @${event.who.replace('@c.us', '')} \n\nHave fun with us✨`)
    })

    client.onIncomingCall((callData) => {
        // client.contactBlock(callData.peerJid)
    })
}

let endpoint;
let a = (async _ => {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: require('chrome-launcher').Launcher.getInstallations()[0]
    });

    let injector = setInterval(async _ => {
        let pages = await browser.pages();
        let whatsAppPage = pages[0];

        if (whatsAppPage.url().includes('whatsapp')){
            whatsAppPage.evaluate( _ => {
                window.Object.freeze = o => o;
            })
            clearInterval(injector);
        }

    }, 50);

    const options = {
        sessionId: 'Imperial',
        headless: false,
        qrTimeout: 0,
        authTimeout: 0,
        restartOnCrash: start,
        cacheEnabled: false,
        useChrome: true,
        browserWSEndpoint: browser.wsEndpoint(),
        devtools: true,
        killProcessOnBrowserClose: true,
        throwErrorOnTosBlock: false,
        chromiumArgs: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--aggressive-cache-discard',
            '--disable-cache',
            '--disable-application-cache',
            '--disable-offline-load-stale-cache',
            '--disk-cache-size=0'
        ]
    }
    
    create(options)
        .then((client) => start(client))
        .catch((err) => new Error(err))
})()
