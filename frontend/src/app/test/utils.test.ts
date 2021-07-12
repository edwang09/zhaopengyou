
import { Judge } from "../helpers/judge";
import { Trump } from "../interfaces/ISocket";
const trumpTest : Trump = {
    number: "02",
    suit: "h",
    count: 2,
}
const judge = new Judge(trumpTest, [])
describe('Decompose Test', () => {

    const TestCases = [
        ["d12","d12","d13","d13"],
        ["d10","d10","d13","d13"],
        ["d10"],
        ["d12","d12","d13","d13", "d10", "d10", "d10"],
        ["d12","d13","d13","d13", "d10", "d10", "d10"],
        ["h12","h12","h13","h13"],
        ["h14","h14","s02","s02"],
        ["h02","h02","s02","s02"],
        ["j0","j0","h02","h02"],
        ["j0","j0","j1","j1"],
        ["d02","d02","s02","s02"],
    ]
    const TestResults = [
        [{width: 2, height:2, card:"d12"}],
        [{width: 2, height:1, card:"d10"},{width: 2, height:1, card:"d13"}],
        [{width: 1, height:1, card:"d10"}],
        [{width: 3, height:1, card:"d10"}, {width: 2, height:2, card:"d12"}],
        [{width: 3, height:1, card:"d10"},{width: 3, height:1, card:"d13"},{width: 1, height:1, card:"d12"}],
        [{width: 2, height:2, card:"h12"}],
        [{width: 2, height:2, card:"h14"}],
        [{width: 2, height:2, card:"f02"}],
        [{width: 2, height:2, card:"h02"}],
        [{width: 2, height:2, card:"j0"}],
        [{width: 2, height:1, card:"f02"},{width: 2, height:1, card:"f02"}],
    ]

    test('Test if decompose works', () => {
        for (let index = 0; index < TestCases.length; index++) {
            expect(judge.decompose(TestCases[index])).toEqual(TestResults[index])
        }
    })
});

describe('Fullfill as Follower Test', () => {
    const trumpTest : Trump = {
        number: "02",
        suit: "h",
        count: 2,
    }
    const decomposedCards = [
        [{width: 2, height:2, card:"s03"}],
    ]
    
    const decomposedHands = [
        [{width: 2, height:3, card:"s03"}, {width: 3, height:1, card:"s09"}, {width: 1, height:1, card:"s14"} ],
    ]
    
    const decomposedInitiators = [
        [{width: 2, height:2, card:"s07"}],
    ]

    test('Test if pair fullfill works', () => {
        for (let index = 0; index < decomposedCards.length; index++) {
            expect(judge.checkPairFullfillmentAsFollower(decomposedCards[0], decomposedHands[0],decomposedInitiators[0])).toBe(true);
        }
    })
    test('Test if tolaji fullfill works', () => {
        for (let index = 0; index < decomposedCards.length; index++) {
            expect(judge.checkTolajiFullfillmentAsFollower(decomposedCards[0], decomposedHands[0],decomposedInitiators[0])).toBe(true);
        }
    })
});
