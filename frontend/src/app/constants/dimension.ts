export const USER_HAND = {
    X: 162, 
    Y: 520,
    WIDTH: 700,
    HEIGHT: 200
}
export const CARD = {
    NORMAL_SCALE: 0.6, 
    NORMAL_Y: 120, 
    NORMAL2_SCALE: 0.5, 
    NORMAL2_VERTICAL_GAP: 60, 
    SMALL_SCALE: 0.35, 
    TINY_SCALE: 0.3,
    NORMAL_GAP: 30, 
    SMALL_GAP: 18, 
    TINY_GAP: 18, 
    HEIGHT : 240,
    WIDTH : 160,
    POP_DISTANCE : 30,
    HOVER_DISTANCE: 5
}
export const PLAYER_AREA_DIMENSION = {
    TWOLINE_GAP: 50,
    WIDTH : 341,
    HEIGHT: 200
}
export const HUD_DIMENSION = {
    //height for user HUD
    USER_X: 880,
    USER_Y: 520,
    WIDTH: 130, 
    HEIGHT: 200
}
export const OPTIONS = {
    X : 820,
    Y: 0,
    OFFSET_X: 30,
    OFFSET_Y: 10,
    GAP: 35
}
export const ACTIONS = {
    X : 342,
    Y: 343,
    WIDTH : 341,
    HEIGHT: 200
}
export const USER_PLAY = {
    X : 342,
    Y: 210,
    WIDTH : 341,
    HEIGHT: 153
}
export const HAND = {
    SMALL_RIGHT_END: PLAYER_AREA_DIMENSION.WIDTH-HUD_DIMENSION.WIDTH - CARD.WIDTH*CARD.SMALL_SCALE/2
}
export const PLAYER_AREA_POSITION = [
    {
        X: 683,
        Y:343, 
        SIDE: 1
    },
    {
        X: 683,
        Y:163, 
        SIDE: 1
    },
    {
        X: 342,
        Y:0, 
        SIDE: 0
    },
    {
        X: 0,
        Y:163, 
        SIDE: 0
    },
    {
        X: 0,
        Y:343, 
        SIDE: 0
    }
]
export const TEST_CARDS = ["h03", "d04", "s12"]