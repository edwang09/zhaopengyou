import * as PIXI from "pixi.js";
import { defaultStyle } from "./textstyle";
import TextInput = require("pixi-text-input");
import { Button } from "./components/button";
import { buttonColor } from "./enums/enums";
import { IUserData } from "./interfaces/userdata";
import { makeInteractive, adjustToCenterOfContainer } from "./helpers/helper";
import { v4 as uuidv4 } from 'uuid';

export class Register {
  container: PIXI.Container;
  app: PIXI.Application;
  input: TextInput;
  avatarIndex: number;
  callback;
  constructor(app: PIXI.Application) {
    this.app = app;
    this.avatarIndex = 0;
    this.container = new PIXI.Container();
    this.container.height = this.app.view.height;
    this.container.width = this.app.view.width;
    this.container.x = this.app.view.width / 2;
    this.container.y = this.app.view.height / 2;
    this.container.visible = false;
    this.container.interactive = true;
    this.app.stage.addChild(this.container);
    this.init();
  }

  init(): void {
    this.displayBackground();
    this.displayAvatarSelector();
    this.displayInputBox();
    this.displayButton();
  }
  show(cb:(user:IUserData)=>void): void {
    this.callback = cb
    this.container.visible = true;
  }
  hide(): void {
    this.container.visible = false;
  }
  displayBackground(): void {
    const modalTexture = PIXI.Loader.shared.resources["modal-tall"].texture;
    const modal = PIXI.Sprite.from(modalTexture);
    adjustToCenterOfContainer(modal, 0, 0);
    console.log(modal.x);
    console.log(modal.y);
    modal.height = modalTexture.height;
    modal.width = modalTexture.width;
    this.container.addChild(modal);
  }

  displayAvatarSelector(): void {
    const avatarsheet: PIXI.Spritesheet =
    PIXI.Loader.shared.resources["avatar"].spritesheet;
    const avatarFrames = [
      avatarsheet.textures[`a0.png`],
      avatarsheet.textures[`a1.png`],
      avatarsheet.textures[`a2.png`],
      avatarsheet.textures[`a3.png`],
      avatarsheet.textures[`a4.png`],
      avatarsheet.textures[`a5.png`],
      avatarsheet.textures[`a6.png`],
      avatarsheet.textures[`a7.png`],
      avatarsheet.textures[`a8.png`],
      avatarsheet.textures[`a9.png`],
    ];
    const avatar: PIXI.AnimatedSprite = new PIXI.AnimatedSprite(avatarFrames);

    const arrowsheet: PIXI.Spritesheet =
      PIXI.Loader.shared.resources["arrow"].spritesheet;
    const arrowleft: PIXI.Sprite = new PIXI.Sprite(
      arrowsheet.textures["left.png"]
    );
    const arrowright: PIXI.Sprite = new PIXI.Sprite(
      arrowsheet.textures["right.png"]
    );
    makeInteractive(arrowleft, () => {
      avatar.gotoAndStop(this.modifyAvatarIndex(-1));
    });
    makeInteractive(arrowright, () => {
      avatar.gotoAndStop(this.modifyAvatarIndex(1));
    });
    adjustToCenterOfContainer(avatar, 0, -150);
    adjustToCenterOfContainer(arrowleft, -100, -150);
    adjustToCenterOfContainer(arrowright, 100, -150);
    this.container.addChild(avatar);
    this.container.addChild(arrowleft);
    this.container.addChild(arrowright);
  }

  displayInputBox(): void {
    this.input = new TextInput({
      input: {
        fontSize: "25px",
        padding: "10px",
        width: "200px",
        color: "#26272E",
      },
      box: {
        default: {
          fill: 0xe8e9f3,
          rounded: 12,
          stroke: { color: 0xcbcee0, width: 3 },
        },
        focused: {
          fill: 0xe1e3ee,
          rounded: 12,
          stroke: { color: 0xabafc6, width: 3 },
        },
        disabled: { fill: 0xdbdbdb, rounded: 12 },
      },
    });
    const label = new PIXI.Text("Name :", defaultStyle);
    this.input.x = -110;
    this.input.y = 0;
    adjustToCenterOfContainer(label, -55, -30);
    this.container.addChild(this.input);
    this.container.addChild(label);
  }

  displayButton(): void {

    const button: PIXI.Sprite = new Button(buttonColor.GREEN,"Accept", ()=>{
      const userData : IUserData = {
        name: this.input.text,
        avatarIndex: this.avatarIndex,
        id: this.randomString()
      }
      this.callback(userData)
    });
    adjustToCenterOfContainer(button, 0, 150);
    this.container.addChild(button);
  }


  modifyAvatarIndex(increment: number): number {
    this.avatarIndex = (this.avatarIndex + increment + 10) % 10;
    return this.avatarIndex;
  }
  randomString(length = 10):string{
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
  }

}
