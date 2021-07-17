import { InMemoryHandRepository } from "../room/hand.repository";

describe("hand repository tests", () => {
    let testHandRepository: InMemoryHandRepository
    beforeAll(() => {
        testHandRepository = new InMemoryHandRepository()
    });
    test("should init hand", (done) => {
        testHandRepository.init("test").then(()=>{
            done()
        })
    });
  
    test("should add hand", (done) => {
        testHandRepository.add("test", ["s02", "s03"]).then(()=>{
            done()
        })
        expect(testHandRepository.add("fake", ["s02"])).rejects.toBe("entity not found")
    });
    
    test("should remove hand", (done) => {
        testHandRepository.remove("test", ["s02"]).then(()=>{
            done()
        })
        expect(testHandRepository.remove("fake", ["s02"])).rejects.toBe("entity not found")
    });
    test("should get hand", (done) => {
        testHandRepository.getById("test").then((cards)=>{
            expect(cards).toEqual(["s03"])
            done()
        })
    });
  });