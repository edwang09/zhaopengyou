import EventEmitter = require("eventemitter3");
import * as PIXI from "pixi.js";
import { ACTIONS, CARD } from "../constants/dimension";
import { actionButtons, actionStates, buttonColor, handTypes } from "../enums/enums";
import { GameRoom } from "../gameroom";
import { adjustToCenterOfContainer, getCallableTrumps, renderContainer } from "../helpers/helper";
import { PlayerID, Trump } from "../interfaces/ISocket";
import { Button } from "./button";
import { Hand } from "./hand";
import { Play } from "./play";

export class Action extends PIXI.Container {
  prepared: boolean;
  prepareButton: Button;
  callButtons: Play[] = [];
  KittyButton: Button;
  state: actionStates;
  room: GameRoom;
  PlayButton: Button;
  CancelButton: Button;
  constructor(room: GameRoom) {
    super();
    this.room = room;
    this.displayPrepareButton();
    this.displayKittyButton();
    this.displaPlayButton()
    this.displaCancelButton()
    renderContainer(this, this.room, ACTIONS.X, ACTIONS.Y)
    this.switchState(actionStates.PREPARE);
  }
  displayPrepareButton() {
    this.prepared = false;
    this.prepareButton = new Button(buttonColor.GREEN, "Prepare", () => {
      this.prepareButton.setColor(this.prepared ? buttonColor.GREEN : buttonColor.RED);
      this.prepareButton.setText(this.prepared ? "prepare" : "ready");
      this.prepared = !this.prepared;
      this.room.app.eventHandler.emit("room:prepare", this.prepared);
    });
    adjustToCenterOfContainer(this.prepareButton, 0, 150);
    this.addChild(this.prepareButton);
  }

  displayCallButton(trumps: Trump[]) {
    this.callButtons.map((c) => this.removeChild(c));
    let x = 0;
    this.callButtons = trumps.map((t, id) => {
      const butt = new Play(this, x, 150, t.lastCall, handTypes.USER_CALL, 0, () => {
        this.room.app.eventHandler.emit("room:call", t);
      });
      x += t.count * CARD.TINY_GAP + 40;
      return butt;
    });
  }

  displayKittyButton() {
    this.KittyButton = new Button(buttonColor.GREEN, "Kitty", () => {
      this.room.dropKittys()
    });
    adjustToCenterOfContainer(this.KittyButton, 0, 150);
    this.addChild(this.KittyButton);
  }

  displaPlayButton() {
    this.PlayButton = new Button(buttonColor.GREEN, "Play", () => {
      this.room.playCard()
      this.PlayButton.toggleDisable(false)
    });
    adjustToCenterOfContainer(this.PlayButton, 0, 150);
    this.addChild(this.PlayButton);
  }
  displaCancelButton() {
    this.CancelButton = new Button(buttonColor.RED, "Cancel", () => {
      this.room.cancelCard()
    });
    adjustToCenterOfContainer(this.CancelButton, 200, 150);
    this.addChild(this.CancelButton);
  }
  switchState(state: actionStates) {
    switch (state) {
      case actionStates.PREPARE:
        this.prepareButton.visible = true;
        this.callButtons.map((cb) => (cb.visible = false));
        this.KittyButton.visible = false;
        this.PlayButton.visible = false;

        break;

      case actionStates.CALL:
        this.prepareButton.visible = false;
        this.callButtons.map((cb) => (cb.visible = true));
        this.KittyButton.visible = false;
        this.PlayButton.visible = false;

        break;
      case actionStates.CLEAR:
        this.prepareButton.visible = false;
        this.callButtons.map((cb) => (cb.visible = false));
        this.KittyButton.visible = false;
        this.PlayButton.visible = false;

        break;
      case actionStates.KITTY:
        this.prepareButton.visible = false;
        this.callButtons.map((cb) => (cb.visible = false));
        this.KittyButton.visible = true;
        this.PlayButton.visible = false;

        break;
        case actionStates.PLAY:
          this.prepareButton.visible = false;
          this.callButtons.map((cb) => (cb.visible = false));
          this.KittyButton.visible = false;
          this.PlayButton.visible = true;
  
          break;
    }
  }
  toggleDisable(config: any) {
    this.KittyButton.toggleDisable(config.kitty);
    this.PlayButton.toggleDisable(config.play.canPlay);
    if (config.play.canPlay && config.play.isDump){
      this.PlayButton.setText("Dump")
    }else{
      this.PlayButton.setText("Play")
    }
  }
}
