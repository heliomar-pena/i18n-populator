const { has } = require('./objectUtils');

describe("Object utils tests", () => {
    describe("has", () => {
        it("should return true if object has the property", () => {
            const obj = { test: "test" };
            expect(has(obj, "test")).toBe(true);
        })

        it("should return false if object doesn't have the property", () => {
            const obj = { test: "test" };
            expect(has(obj, "test2")).toBe(false);
        })

        it("should return true if object has the nested property", () => {
            const obj = { test: { test2: "test2" } };
            expect(has(obj, "test.test2")).toBe(true);
        })

        it("should return false if object doesn't have the nested property", () => {
            const obj = { test: { test2: "test2" } };
            expect(has(obj, "test.test3")).toBe(false);
        })

        it("should return true if object has the nested property with array notation", () => {
            const obj = { test: { test2: "test2" } };
            expect(has(obj, "test[test2]")).toBe(true);
        })

        it("should return false if object doesn't have the nested property with array notation", () => {
            const obj = { test: { test2: "test2" } };
            expect(has(obj, "test[test3]")).toBe(false);
        })

        it("should return true if object has the nested property with array notation and array index", () => {
            const obj = { test: { test2: ["test2"] } };
            expect(has(obj, "test[test2][0]")).toBe(true);
        })

        it("should return false if object doesn't have the nested property with array notation and array index", () => {
            const obj = { test: { test2: ["test2"] } };
            expect(has(obj, "test[test2][1]")).toBe(false);
        })

        it("should return true if object has the nested property with array notation and array index and nested property", () => {
            const obj = { test: { test2: [{test2: "test2"}] } };
            expect(has(obj, "test[test2][0].test2")).toBe(true);
        })

        it("should return false if object doesn't have the nested property with array notation and array index and nested property", () => {
            const obj = { test: { test2: [{test2: "test2"}] } };
            expect(has(obj, "test[test2][0].test3")).toBe(false);
        })

        it("should return true if object exist in ultra nested property", () => {
            const obj = { test: { test2: { test3: { test4: { test5: { test6: "Test 6" } } } } } };
            expect(has(obj, "test.test2.test3.test4.test5.test6")).toBe(true);
        })

        it("should return false if object doesn't exist in ultra nested property", () => {
            const obj = { test: { test2: { test3: { test4: { test5: { test6: "Test 6" } } } } } };
            expect(has(obj, "test.test2.test3.test4.test5.test7")).toBe(false);
        })
    })
})
