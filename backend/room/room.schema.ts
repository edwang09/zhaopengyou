import Joi = require("joi");
export const idSchema = Joi.string().guid({
  version: "uuidv4",
});
export const MAX_PLAYER = 6;
export const playerSchema = Joi.object({
  id: Joi.string(),
  name: Joi.string().max(256).required(),
  avatarIndex: Joi.number(),
});
export const roomSchema = Joi.object({
  id: idSchema.alter({
    create: (schema) => schema.forbidden(),
    update: (schema) => schema.required(),
  }),
  name: Joi.string().max(256).required(),
  players: Joi.array().max(MAX_PLAYER).items(playerSchema),
});

export type RoomID = string;
export type PlayerID = string;

export interface Player {
  id: PlayerID;
  name: string;
  avatarIndex: number;
  socketid: string;
  level?: number;
  camp?: string;
  prepared?: boolean;
  cards?: string[];
  actionState?:number
}
export interface Ticket {
  card: string
  sequence : number
}
export interface Trump {
  number: string
  suit?: string
  count: number
  callerId?: string
  lastCall?: string[]
}
export interface ILobbyRoom {
  id: RoomID;
  name: string;
  playernumber: number;
}

export interface IRoom {
  id: RoomID;
  name: string;
  startLevel: number
  players: (Player | null)[];
  dealerIndex?:number
  trump:Trump
  kitty?:string[]
  tickets?:Ticket[]
}
