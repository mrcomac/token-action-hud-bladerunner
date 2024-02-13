export let BRRollHandler = null
//https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt/blob/main/src/actor/actor-document.js
Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    BRRollHandler = class BRRollHandler extends coreModule.api.RollHandler {
        
        async handleActionClick(event, encodedValue) {
            const decoded = encodedValue.split("|");
            let typeAction = decoded[0]
            let typeActor = decoded[1]
            let macroType = decoded[2]
            let macroSubType = ''
            if(decoded.length > 3) {
                macroSubType = decoded[3]

            }
            switch(typeAction) {
                case 'stats':
                    this._rollStats(typeActor, macroType, macroSubType)
                    break;
                case 'item':
                    this._rollItem(typeActor,macroType, macroSubType)
            }
        }

        _rollItem(typeActor, itemType, itemId) {
            if(typeActor === 'character') {
                const item = (this.actor.items.filter(e => e.id === itemId))[0]
                if(itemType === 'explosive') {
                    item._rollExplosive()
                } else {
                    item.roll()
                }
                
            }
        }

        _rollStats(typeActor, attr, skill) {
            if(typeActor === 'character') {
                this.actor.rollStat(attr,skill)
            }
        }

        _applyDamege(damage) {
            this.actor.applyDamage(damage)
        }

        _addHealth(typeActor) {
            if(typeActor === 'character') {
                let field = 'system.health.value'
                let count = this.actor.system.health.value +1
                this.actor.update({ [field]: count });
            }
        }
    }
})