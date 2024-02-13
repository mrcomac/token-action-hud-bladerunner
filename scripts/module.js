import { BRActionHandler } from './action-handler.js'
import { BRRollHandler as CoreRoll } from './core-rollhandler.js'
//import { GROUP } from './constants.js'

export let BRSystemManager = null

export let DEFAULTS = null

function chatItem(message,actor) {
    //crates chatmessage
    ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({token: actor}),
        content: message
        });
}


Hooks.on('tokenActionHudCoreApiReady', async (coreModule) => {
    BRSystemManager = class BRSystemManager extends coreModule.api.SystemManager {
        /** @override */
        getActionHandler() {
            return new BRActionHandler()
        }

        getAvailableRollHandlers() {
            let coreTitle = "Blade Runner"      
            let choices = { core: coreTitle }
            BRSystemManager.addHandler(choices, 'blade runner')
            return choices
        }

        /** @override */
        getRollHandler(handlerId) {
            let rollHandler
            rollHandler = new CoreRoll()
            return rollHandler
        }

        /** @override */
        /*doRegisterSettings (updateFunc) {
            systemSettings.register(updateFunc)
        }*/

        async registerDefaults() {
            const GROUP = {
                stats: { id: 'stats', name: coreModule.api.Utils.i18n('FLBR.TAB.Stats'), type: 'system' },
                skills: { id: 'skills', name: coreModule.api.Utils.i18n('FLBR.Skills'), type: 'system' },
                strength: { id: 'strength', name: coreModule.api.Utils.i18n('FLBR.ATTRIBUTE.STR'), type: 'system' },
                agility: { id: 'agility', name: coreModule.api.Utils.i18n('FLBR.ATTRIBUTE.AGI'), type: 'system' },
                intelligence: { id: 'intelligence', name: coreModule.api.Utils.i18n('FLBR.ATTRIBUTE.INT'), type: 'system' },
                empathy: { id: 'empathy', name: coreModule.api.Utils.i18n('FLBR.ATTRIBUTE.EMP'), type: 'system' },
                maneuverability: { id: 'maneuverability', name: coreModule.api.Utils.i18n('FLBR.ATTRIBUTE.MVR'), type: 'system' },
                combatactions: {id: 'combatactions', name: coreModule.api.Utils.i18n('FLBR.TAB.Actions'), type: 'system' },
                weaponitems: {id: 'weapons', name: coreModule.api.Utils.i18n('TYPES.Item.weapon'), type: 'system' },
                genericitems: {id: 'generic', name: coreModule.api.Utils.i18n('TYPES.Item.generic'), type: 'system' },
                upgradeitems: {id: 'upgrade', name: coreModule.api.Utils.i18n('TYPES.Item.upgrade'), type: 'system' },
                armoritems: {id: 'armor', name: coreModule.api.Utils.i18n('TYPES.Item.armor'), type: 'system' },
                explosiveitems: {id: 'explosive', name: coreModule.api.Utils.i18n('TYPES.Item.explosive'), type: 'system' },
                specialtyitems: {id: 'special', name: coreModule.api.Utils.i18n('TYPES.Item.specialty'), type: 'system' },
                injuryitems: {id: 'injury', name: coreModule.api.Utils.i18n('TYPES.Item.injury'), type: 'system' },
                driver: {id: 'driver', name:"Driver", type: 'system' },
                passengers: {id: 'crew', name: "Passengers", type: 'system' }

                //{ id: '', name: coreModule.api.Utils.i18n(''), type: 'system' },
            };
            const groups = GROUP
            Object.values(groups).forEach(group => {
                group.name = group.name
                group.listName = `Group: ${group.name}`
                console.log(`Group: ${group.name}`)
            })
            const groupsArray = Object.values(groups)
            DEFAULTS = {
                layout: [
                    {
                        nestId: 'stats',
                        id: 'stats',
                        name: coreModule.api.Utils.i18n('FLBR.TAB.Stats'),
                        groups: [
                            { ...groups.stats, nestId: 'stats_stats' }
                        ]

                    },
                    {
                        nestId: 'skills',
                        id: 'skills',
                        name: coreModule.api.Utils.i18n('FLBR.Skills'),
                        groups: [
                            { ...groups.skills, nestId: 'skills' },
                            { ...groups.strength, nestId: 'skills_strength' },
                            { ...groups.agility, nestId: 'skills_agility' },
                            { ...groups.intelligence, nestId: 'skills_intelligence' },
                            { ...groups.empathy, nestId: 'skills_empathy' },
                            { ...groups.maneuverability, nestId: 'skills_maneuverability' }
                        ]

                    },
                    {
                        nestId: 'health',
                        id: 'health',
                        name: coreModule.api.Utils.i18n('FLBR.HEADER.Health'),
                        groups: [
                        ]
                    },
                    {
                        nestId: 'mods',
                        id: 'mods',
                        name: coreModule.api.Utils.i18n('FLBR.TAB.Mods'),
                        groups: [
                        ]
                    },
                    {
                        nestId: 'combat',
                        id: 'combat',
                        name: coreModule.api.Utils.i18n('FLBR.TAB.Combat'),
                        groups: [
                            { ...groups.combatactions, nestId: 'combat_actions' },
                            { ...groups.weaponitems, nestId: 'combat_weapons' },
                            { ...groups.explosiveitems, nestId: 'combat_explosives' }
                        ]
                    },
                    {
                        nestId: 'inventory',
                        id: 'inventory',
                        name: coreModule.api.Utils.i18n('FLBR.TAB.Inventory'),
                        groups: [
                            { ...groups.genericitems, nestId: 'inventory_generic' },
                            { ...groups.upgradeitems, nestId: 'inventory_upgrade' },
                            { ...groups.armoritems, nestId: 'inventory_armor' },
                            { ...groups.injuryitems, nestId: 'inventory_injury' }
                        ]
                    },
                    {
                        nestId: 'crew',
                        id: 'crew',
                        name: coreModule.api.Utils.i18n('FLBR.VEHICLE.Crew'),
                        groups: [
                            { ...groups.driver, nestId: 'crew_driver' },
                            { ...groups.passengers, nestId: 'crew_passengers' }
                        ]
                    }
                ],
                groups: groupsArray
            }
            game.tokenActionHud.defaults = DEFAULTS
            return DEFAULTS
        }
    }

    /* STARTING POINT */

    const module = game.modules.get('token-action-hud-blade-runner');
    module.api = {
        requiredCoreModuleVersion: '1.5',
        SystemManager: BRSystemManager
    }
    Hooks.call('tokenActionHudSystemReady', module)
});

