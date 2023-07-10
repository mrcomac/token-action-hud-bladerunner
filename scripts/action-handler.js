import { SKILLS } from "./constants.js";

//import {  } from './constants.js'
export let BRActionHandler = null

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}


Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    BRActionHandler = class BRActionHandler extends coreModule.api.ActionHandler {

        /** @override */
        async buildSystemActions(groupIds) {

            this.GROUP = {
                skills: { id: 'skills', type: 'system' },
                stats: { id: 'stats', type: 'system' },
                strength: { id: 'strength', type: 'system' },
                agility: { id: 'agility', type: 'system' },
                intelligence: { id: 'intelligence', type: 'system' },
                empathy: { id: 'empathy', type: 'system' },
                maneuverability: { id: 'maneuverability', type: 'system' },
                combatactions: {id: 'combatactions', type: 'system' },
                weaponitems: {id: 'weapons',  type: 'system' },
                genericitems: {id: 'generic',  type: 'system' },
                upgradeitems: {id: 'upgrade',  type: 'system' },
                armoritems: {id: 'armor',  type: 'system' },
                explosiveitems: {id: 'explosive',  type: 'system' },
                specialtyitems: {id: 'special',  type: 'system' },
                injuryitems: {id: 'injury',  type: 'system' },
                driver: {id: 'driver', type: 'system' },
                passengers: {id: 'crew', type: 'system' }
            };

            const token = this.token;
            if (!token) return;
            const tokenId = token.id;
            const actor = this.actor;
            if (!actor) return;

            this._loadAttributes()
            this._loadSkills()
            this._loadCombat()
            this._loadInventory()
            this._loadCrew()

        }

        async _loadCombat() {
            //this._loadWeapons()
            //actions
            //weapows
        }
        async _loadCrew() {
            if(this.actor.type === 'vehicle') {
                let crew = Array.from(this.actor.system.crew)
                let driver = false
                crew.forEach(at => {
                    let group = this.GROUP.passengers
                    if(!driver) {
                        driver = true
                        group = this.GROUP.driver
                    }
                    let _actor = game.actors.get(at.id)
                    this.addActions([{
                        id: _actor.id,
                        name: _actor.name,
                        img: _actor.img,
                        //cssClass: eff.disabled ? "toggle" : "togle active",
                        description: _actor.name,
                        encodedValue: ['crew','vehicle', _actor.id].join(this.delimiter),
                        //info2: { text: "(" + item.system.qty + ")" }
                    }], group)
                })
            }
        }
        _loadInventory() {
            const generic = Array.from(this.actor.items)

            generic.forEach( item => {
                console.log("ITEM: "+item.name+", "+item.type)
                let group = this.GROUP.genericitems
                if(item.type === 'weapon') group = this.GROUP.weaponitems
                else if(item.type === 'upgrade') group = this.GROUP.upgradeitems
                else if(item.type === 'armor') group = this.GROUP.armoritems
                else if(item.type === 'explosive') group = this.GROUP.explosiveitems
                else if(item.type === 'speciality') group = this.GROUP.specialtyitems
                else if(item.type === 'injury') group = this.GROUP.injuryitems
                console.log(group)
                this.addActions([{
                    id:item.id,
                    name: item.name,
                    img: item.img,
                    //cssClass: eff.disabled ? "toggle" : "togle active",
                    description: item.name,
                    encodedValue: ['item','character',item.type, item.id].join(this.delimiter),
                    info2: { text: "(" + item.system.qty + ")" }
                }], group)
            })
        }
        _loadWeapons() {
            const weapons = Array.from(this.actor.items.filter(e => e.type ==='weapon'))

            weapons.forEach( weapon => {
                this.addActions([{
                    id:weapon.id,
                    name: weapon.name,
                    img: weapon.img,
                    //cssClass: eff.disabled ? "toggle" : "togle active",
                    description: weapon.name,
                    encodedValue: ['weapon','character', weapon.id].join(this.delimiter),
                    info2: { text: 'Attacks: ' + weapon.attacks.length }
                }], this.GROUP.weaponitems)
            })
        }

        /*async _loadCombatActions() {
            if(this.actor.type === 'character') {

            }
        }*/

        async _loadAttributes() {
            if(this.actor.type === 'character') {
                Object.keys(this.actor.system.attributes).forEach( el => {
                    this.addActions([{
                        id:el,
                        name: coreModule.api.Utils.i18n('FLBR.ATTRIBUTE.'+el.toUpperCase()),
                        //img: eff.icon,
                        //cssClass: eff.disabled ? "toggle" : "togle active",
                        description: coreModule.api.Utils.i18n('FLBR.ATTRIBUTE.'+el.toUpperCase()),
                        encodedValue: ['stats','character', el].join(this.delimiter),
                        info2: { text: 'd'+this.actor.system.attributes[el].value }
                    }], this.GROUP.stats)
                })
            } else if(this.actor.type === 'vehicle') {
                this.addActions([{
                    id: 'maneuverability',
                    name: coreModule.api.Utils.i18n('FLBR.SHEET_CONFIG.Maneuverability'),
                    //img: eff.icon,
                    //cssClass: eff.disabled ? "toggle" : "togle active",
                    description: coreModule.api.Utils.i18n('FLBR.SHEET_CONFIG.Maneuverability'),
                    encodedValue: ['stats', 'vehicle', 'maneuverability'].join(this.delimiter),
                    info2: { text: 'd'+this.actor.system.maneuverability }
                }], this.GROUP.stats)

                this.addActions([{
                    id: 'armor',
                    name: coreModule.api.Utils.i18n('FLBR.ItemArmor'),
                    //img: eff.icon,
                    //cssClass: eff.disabled ? "toggle" : "togle active",
                    description: coreModule.api.Utils.i18n('FLBR.ItemArmor'),
                    encodedValue: ['stats', 'vehicle', 'armor'].join(this.delimiter),
                    info2: { text: 'd'+this.actor.system.armor }
                }], this.GROUP.stats)

            }
        }
        async _loadSkills() {
            //await  this.addGroup ({ id: 'agility', name: coreModule.api.Utils.i18n('FLBR.ATTRIBUTE.AGI'), type: 'system' }, { id: 'skills'})
            if(this.actor.type === 'character') {
                //console.log()
                Object.keys(this.actor.system.skills).forEach( el => {
                    let group = this.GROUP.skills
                    let attr = ''
                    if(SKILLS.STR.includes(el))  { group = this.GROUP.strength, attr='str' }
                    if(SKILLS.INT.includes(el))  { group = this.GROUP.intelligence, attr='int' }
                    if(SKILLS.AGI.includes(el))  { group = this.GROUP.agility, attr='agi' }
                    if(SKILLS.MAN.includes(el))  { group = this.GROUP.maneuverability, attr='man' }
                    if(SKILLS.EMP.includes(el))  { group = this.GROUP.empathy, attr='emp' }
                    this.addActions([{
                        id:el,
                        name: coreModule.api.Utils.i18n('FLBR.SKILL.'+capitalizeFirstLetter(el)),
                        //img: eff.icon,
                        //cssClass: eff.disabled ? "toggle" : "togle active",
                        description: coreModule.api.Utils.i18n('FLBR.SKILL.'+capitalizeFirstLetter(el)),
                        encodedValue: ['stats', 'character',attr, el].join(this.delimiter),
                        info2: { text: 'd'+this.actor.system.skills[el].value }
                    }], group)
                })
            }
        }
    }
})