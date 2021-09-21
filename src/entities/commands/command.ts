import { ChatId } from "@open-wa/wa-automate";
import { CooldownOptions } from "src/types";
import { fullTrim, loadJSON, saveJSON } from "src/utils";
import { Rule } from "..";
import { ZapContext, ZapError } from "../core";

export abstract class ZapCommand {
    private eligible: boolean;
    protected context: ZapContext;
    protected cooldownOptions: CooldownOptions;

    constructor(context?: ZapContext, cooldownOptions?: CooldownOptions){
        this.context = context;
        this.cooldownOptions = cooldownOptions;
        this.checkEligibility(context?.command);
    }

    private checkEligibility(userPattern?: string) : boolean{
        if (!userPattern) return this.eligible = false;
        this.eligible = false;
        for (let pattern of this.getPatterns()){
            if (userPattern.toLowerCase().trim() === pattern){
                this.eligible = true;
                break;
            }
        }
        return this.eligible;
    }

    public async run(){
        if (!this.eligible) return;

        for (let rule of this.getRules()){
            let isValid = rule.validate(this.context);
            isValid = (rule.reversed? !isValid : isValid)
            if (!isValid){
                rule.raiseError();
            }
        }

        if (this.cooldownOptions) {
            const [ isCooldownPeriod, seconds ] = this.checkForCooldown();
            if ( !isCooldownPeriod ) return await this.runSpecificLogic();
            else return await this.sendCooldownMessage( seconds );
        } else {
            return await this.runSpecificLogic();
        }
    }

    protected abstract getPatterns(): string[];
    
    protected getCooldownMessage(seconds: number): string {
        return `Aguarde ${seconds} segundos para poder executar o comando novamente.`;
    };

    // Returns [true, cooldownTimeInSeconds] if the sender is in cooldown state. 
    // Otherwise, adds cooldown to the sender and returns [ false, 1 ].
    protected checkForCooldown(): [boolean, number] {
        let cooldownHashMap: Record<ChatId, number> = loadJSON( this.getCooldownHashmapName() );
        if ( !cooldownHashMap ) cooldownHashMap = {};

        const member = this.context.sender.id;

        const isMemberInCooldown = member in cooldownHashMap;
        const cooldownTime       = Math.ceil( Math.abs( (new Date().getTime() - new Date(cooldownHashMap[member]).getTime()) / 1000 ) ) ;
        const resetCooldown      = () => cooldownHashMap[member] = new Date().getTime();

        let isCoolingDown;
        // adds/resets cooldown if member never used the command.
        if ( !isMemberInCooldown ) {
            resetCooldown();
            isCoolingDown = false;

        // otherwise...
        } else {

            // Checks whether enough time has passed. If so, then reset the cooldown...
            if ( cooldownTime >= this.cooldownOptions.seconds ) {
                resetCooldown();
                isCoolingDown = false;

            // Otherwise, just return that the member is *still* cooling down.
            } else {
                isCoolingDown = true;
            }
            
        }

        saveJSON( this.getCooldownHashmapName(), cooldownHashMap );
        return [ isCoolingDown, Math.max(Math.abs(cooldownTime - this.cooldownOptions.seconds), 1) ];
    }

    protected async removeCooldown(member: ChatId){
        let cooldownHashMap: Record<ChatId, number> = loadJSON( this.getCooldownHashmapName() );
        if ( !cooldownHashMap ) cooldownHashMap = {};

        delete cooldownHashMap[member];
        saveJSON( this.getCooldownHashmapName(), cooldownHashMap );
    }
    
    protected async addCooldown(member: ChatId){
        let cooldownHashMap: Record<ChatId, number> = loadJSON( this.getCooldownHashmapName() );
        if ( !cooldownHashMap ) cooldownHashMap = {};

        cooldownHashMap[member] = new Date().getTime();
        
        saveJSON( this.getCooldownHashmapName(), cooldownHashMap );
    }

    protected async sendCooldownMessage(seconds: number) {
        return await this.context.reply( this.getCooldownMessage( seconds ) );
    }

    public getPatternsAsString(): string {
        return this.getPatterns().map(a => `${ZapContext.COMMAND_PREFIX}${a}`).join(' - ');
    }

    protected getCooldownHashmapName() {
        return this.constructor.name + (this.cooldownOptions.groupCooldown? this.context.groupId : '') + '-cooldown-hashmap';
    }

    protected getRules(): Rule[] {
        return []
    };

    protected abstract runSpecificLogic();
}