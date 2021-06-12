
import * as PIXI from "pixi.js";

export class Background{
    app: PIXI.Application;
    constructor(app: PIXI.Application){
       this.app = app;
       this.init();
    }
    init():void{
        this.displayBackground();
    }
    displayBackground():void{
        const background : PIXI.Sprite = PIXI.Sprite.from(PIXI.Loader.shared.resources["background"].texture);
        background.x = this.app.view.width / 2;
        background.y = this.app.view.height / 2;
        background.height = this.app.view.height;
        background.width = this.app.view.width;
        background.anchor.set(0.5)
        this.app.stage.addChild(background);
    }


}