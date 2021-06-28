import * as PIXI from "pixi.js";
import { defaultStyle } from "./textstyle";
import { TextInput } from "./components/textinput";
import { Button } from "./components/button";
import { buttonColor } from "./enums/enums";
import { IUserData } from "./interfaces/userdata";
import { makeInteractive, adjustToCenterOfContainer, renderContainer, renderSprite } from "./helpers/helper";
import { v4 as uuidv4 } from "uuid";
import { IPlayerData } from "./interfaces/playerData";
import { GameApp } from "./app";
import { ImageButton } from "./components/imageButton";
import { Player } from "./interfaces/ISocket";

export class Register extends PIXI.Container {
  app: GameApp;
  input: TextInput;
  avatarIndex: number;
  callback;
  background: PIXI.Sprite;
  arrowleft: ImageButton;
  arrowright: ImageButton;
  avatar: PIXI.AnimatedSprite;
  label: PIXI.Text;
  button: any;
  constructor(app: GameApp) {
    super();
    this.app = app;
    this.avatarIndex = 0;
    renderContainer(this, this.app.stage, this.app.view.width / 2, this.app.view.height / 2);
    this.visible = false;
    this.interactive = true;
    this.displayBackground();
    this.displayAvatarSelector();
    this.displayInputBox();
    this.displayButton();
  }

  show(cb: (user: Player) => void): void {
    this.callback = cb;
    this.visible = true;
  }
  hide(): void {
    this.visible = false;
  }
  displayBackground(): void {
    this.background = PIXI.Sprite.from(PIXI.Loader.shared.resources["modal-tall"].texture);
    renderSprite(this.background, this);
  }

  displayAvatarSelector(): void {
    const avatarsheet: PIXI.Spritesheet = PIXI.Loader.shared.resources["avatar"].spritesheet;
    const avatarFrames = [
      avatarsheet.textures[`y0.png`],
      avatarsheet.textures[`y1.png`],
      avatarsheet.textures[`y2.png`],
      avatarsheet.textures[`y3.png`],
      avatarsheet.textures[`y4.png`],
      avatarsheet.textures[`y5.png`],
      avatarsheet.textures[`y6.png`],
      avatarsheet.textures[`y7.png`],
      avatarsheet.textures[`y8.png`],
      avatarsheet.textures[`y9.png`],
    ];
    this.avatar = new PIXI.AnimatedSprite(avatarFrames);

    const arrowsheet: PIXI.Spritesheet = PIXI.Loader.shared.resources["arrow"].spritesheet;
    this.arrowleft = new ImageButton(arrowsheet.textures["left.png"], () => {
      this.avatar.gotoAndStop(this.modifyAvatarIndex(-1));
    });
    this.arrowright = new ImageButton(arrowsheet.textures["right.png"], () => {
      this.avatar.gotoAndStop(this.modifyAvatarIndex(1));
    });
    renderSprite(this.avatar, this, 0, -150);
    renderSprite(this.arrowleft, this, -100, -150);
    renderSprite(this.arrowright, this, 100, -150);
  }

  displayInputBox(): void {
    this.input = new TextInput();
    this.label = new PIXI.Text("Name :", defaultStyle);
    renderContainer(this.input, this, -110, 0);
    renderSprite(this.label, this, -55, -30);
  }

  displayButton(): void {
    this.button = new Button(buttonColor.GREEN, "Accept", () => {
      const userData: IPlayerData = {
        name: this.input.text,
        avatarIndex: this.avatarIndex,
        id: this.randomString(),
      };
      this.callback(userData);
    });
    renderSprite(this.button, this, 0, 150);
  }

  modifyAvatarIndex(increment: number): number {
    this.avatarIndex = (this.avatarIndex + increment + 10) % 10;
    return this.avatarIndex;
  }
  randomString(length = 10): string {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
