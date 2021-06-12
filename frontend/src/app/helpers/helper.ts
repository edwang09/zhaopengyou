import * as PIXI from "pixi.js";

export const addText = (
  sprite: PIXI.Sprite,
  textMessage: string,
  style: PIXI.TextStyle
): void => {
  const text = new PIXI.Text(textMessage, style);
  text.anchor.set(0.5);
  text.x = 0;
  text.y = 0;
  sprite.addChild(text);
};

export const adjustToCenterOfContainer = (
  sprite: PIXI.Sprite,
  horizontalDrift = 0,
  verticalDrift = 0
): void => {
  sprite.x = horizontalDrift;
  sprite.y = verticalDrift;
  sprite.anchor.set(0.5);
};

export const makeInteractive = (sprite: PIXI.Sprite, fn: () => void): void => {
  sprite.interactive = true;
  sprite.buttonMode = true;
  sprite
    .on("pointerdown", () => {
      onButtonDown(sprite);
    })
    .on("pointerup", () => {
      onButtonUp(sprite);
    })
    .on("pointerupoutside", () => {
      onButtonUp(sprite);
    })
    .on("pointerover", () => {
      onButtonOver(sprite);
    })
    .on("pointerout", () => {
      onButtonOut(sprite);
    })
    .on("click", () => {
      fn();
    });
};
const onButtonDown = (sprite: PIXI.Sprite): void => {
  sprite.tint = 0x666666;
};

const onButtonUp = (sprite: PIXI.Sprite): void => {
  sprite.tint = 0xffffff;
};

const onButtonOver = (sprite: PIXI.Sprite): void => {
  sprite.scale.set(sprite.scale.x*1.1 );
};

const onButtonOut = (sprite: PIXI.Sprite): void => {
  sprite.scale.set(sprite.scale.x/1.1);
};
