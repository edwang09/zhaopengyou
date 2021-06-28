export interface IPlayerData{
    name: string,
    avatarIndex: number,
    id: string,
    level?: number,
    camp?: string
    prepared?: boolean;
    cards?: string[];
}
export interface IRoomData{
    name: string,
    id?: string,
    players: IPlayerData[]
    dealerIndex?:number
}