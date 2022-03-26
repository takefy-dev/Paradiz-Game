module.exports = class Vilan {
    constructor(vilain) {
        this.name = vilain.name;
        this.id = vilain.id;
        this.guide = vilain.pageGuide;
        this.attack = vilain.attack;
        this.health = vilain.health;
        this.totalHealth = vilain.health;
        this.img = this.attack[0].img
    }


    set updateHealth (newHealth) {
        this.health = newHealth;
    }


}