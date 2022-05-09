import { ZapCommand } from "./command";
import * as puppeteer from "puppeteer";
import { GroupOnlyRule } from "../rules";

export class UsdBrlCommand extends ZapCommand {
    
    public getPatterns(){
        return ['usdbrl', ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
        ];
    }

    protected async runSpecificLogic() {
        const browser = await puppeteer.launch({
            userDataDir: "./chromium/chromium-user-data",
            executablePath: "/opt/homebrew/bin/chromium",
        });

        const page = await browser.newPage();
        await page.goto("https://www.google.com/search?q=usdbrl");
        await page.waitForSelector(".obcontainer");
        const usdBrlContainerElement = await page.$(".obcontainer");

        const imageBase64 = await usdBrlContainerElement.screenshot({ encoding: "base64" })

        const imageDataURI = `data:image/png;base64,${imageBase64}`;

        await this.context.client.sendImage( this.context.groupId, imageDataURI, 'usdbrl', 'kk' );
        await browser.close()
    }
}