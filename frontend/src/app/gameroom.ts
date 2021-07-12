import * as PIXI from "pixi.js";
import { Hand } from "./components/hand";
import { Hud } from "./components/hud";
import { IUserData } from "./interfaces/userdata";
import EventEmitter = require("eventemitter3");
import { PlayerArea } from "./components/playerarea";
import { Player, IRoom, Ticket } from "./interfaces/ISocket";
import { ACTIONS, HUD_DIMENSION, OPTIONS, PLAYER_AREA_POSITION, USER_HAND, USER_PLAY } from "./constants/dimension";
import { Options } from "./components/options";
import { actionButtons, actionStates, handTypes } from "./enums/enums";
import { Action } from "./components/actions";
import { GameApp } from "./app";
import { Play } from "./components/play";
import { getCallableTrumps, getPopCardIndex, renderContainer, sortHand } from "./helpers/helper";
import { TicketRegister } from "./components/ticketregister";
import { TicketBoard } from "./components/ticketboard";
import { canPlay } from "./helpers/validation";

export class GameRoom extends PIXI.Container {
  app: GameApp;

  handData: string[] = [];
  pickedIndex: number[] = [];
  roomData: IRoom;
  userIndex: number;

  userHud: Hud;
  action: Action;
  playerAreas: PlayerArea[];
  hand: Hand;
  userPlay: Play;
  ticketRegister: TicketRegister;
  ticketBoard: TicketBoard;
  option: Options;
  constructor(app: GameApp, roomData: IRoom) {
    super();
    this.app = app;
    this.roomData = roomData;
    this.userIndex = roomData.players.findIndex((p) => p && p.id === app.userData.id);
    const user = roomData.players[this.userIndex];

    this.playerAreas = this.arrangePlayer(roomData.players).map((p, id) => {
      return new PlayerArea(this, p, PLAYER_AREA_POSITION[id].X, PLAYER_AREA_POSITION[id].Y, PLAYER_AREA_POSITION[id].SIDE);
    });
    this.userHud = new Hud(this, user);
    this.hand = new Hand(this);
    this.userPlay = new Play(this, USER_PLAY.X, USER_PLAY.Y, user.cards, handTypes.PLAYER_CARD);
    this.ticketBoard = new TicketBoard(this, []);
    this.option = new Options(this);
    this.action = new Action(this);
    this.ticketRegister = new TicketRegister(this.app, this);
    renderContainer(this, this.app.stage);
  }

  arrangePlayer(players: Player[]): Player[] {
    return [...players.slice(this.userIndex + 1), ...players.slice(0, this.userIndex)];
  }
  arrangeUser(players: Player[]): Player {
    return players[this.userIndex];
  }
  updatePlayers(room: IRoom): void {
    this.roomData = room;
    const players = this.arrangePlayer(room.players);
    this.playerAreas.map((ph, id) => {
      ph.updatePlayer(players[id]);
    });
  }
  updateTicket(room: IRoom): void {
    this.ticketBoard.updateTickets(room.tickets);
  }
  updatePlayerCards(room: IRoom): void {
    this.roomData = room;
    const players = this.arrangePlayer(room.players);
    const user = this.arrangeUser(room.players);
    this.playerAreas.map((ph, id) => {
      ph.updateCards(players[id]?.cards);
    });
    this.userPlay.update(user.cards);
  }
  updateTrump(room: IRoom): void {
    this.roomData = { ...this.roomData, trump: room.trump };
    this.updatePlayerCards(room);
    this.handData = sortHand(this.handData, this.roomData.trump);
    this.hand.update(this.handData);
    this.action.displayCallButton(getCallableTrumps(this.roomData.trump, this.handData, this.roomData.players[this.userIndex].id));
  }
  dealHands(cards: string[]) {
    this.handData = sortHand([...this.handData, ...cards], this.roomData.trump);
    this.hand.update(this.handData);
    if (this.roomData.trump && cards.length > 0 && (this.roomData.trump.number === cards[0].slice(1) || cards[0].slice(0, 1) === "j")) {
      this.action.displayCallButton(getCallableTrumps(this.roomData.trump, this.handData, this.roomData.players[this.userIndex].id));
    }
  }
  dealKittys(cards: string[]) {
    this.handData = sortHand([...this.handData, ...cards], this.roomData.trump);
    this.hand.update(this.handData);
    this.action.switchState(actionStates.KITTY);
  }
  dropKittys() {
    const kitty = this.pickedIndex.map((id) => this.handData[id]);
    this.handData = sortHand(
      this.handData.filter((c, id) => !(this.pickedIndex.indexOf(id) > -1)),
      this.roomData.trump
    );
    this.pickedIndex = [];
    this.hand.update(this.handData);
    this.app.eventHandler.emit("room:kitty", kitty);
    this.ticketRegister.show((tickets: Ticket[]) => {
      this.app.eventHandler.emit("room:ticket", tickets);
      this.ticketRegister.hide();
    });
  }
  selectHand(card: string, index: number) {
    this.pickedIndex = getPopCardIndex(this.handData, this.pickedIndex, card, index, this.roomData.trump);
    this.hand.popCard(this.pickedIndex);
    this.action.toggleDisable(
      {
        kitty: this.pickedIndex.length === 6,
        play: canPlay(this.handData, this.pickedIndex, this.roomData, this.roomData.initiatorIndex === this.userIndex),
      }
    );
  }
  playCard() {
    const cards = this.pickedIndex.map((id) => this.handData[id]);
    this.handData = sortHand(
      this.handData.filter((c, id) => !(this.pickedIndex.indexOf(id) > -1)),
      this.roomData.trump
    );
    this.pickedIndex = [];
    this.hand.update(this.handData);
    this.app.eventHandler.emit("room:play", cards);
  }
  cancelCard(){
    this.pickedIndex = [];
    this.hand.update(this.handData);
    this.action.toggleDisable(
      {
        kitty: this.pickedIndex.length === 6,
        play: canPlay(this.handData, this.pickedIndex, this.roomData, this.roomData.initiatorIndex === this.userIndex),
      }
    );
  }
  switchState(roomData:IRoom) {
    this.action.switchState(roomData.players[this.userIndex].actionState)
  }
}
