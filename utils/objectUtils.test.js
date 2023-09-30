const { hasProperty } = require('./objectUtils');

describe("Object utils tests", () => {
    describe("hasProperty", () => {
        it("should return true if object has the property", () => {
            const obj = { test: "test" };
            expect(hasProperty(obj, "test")).toBe(true);
        })

        it("should return false if object doesn't have the property", () => {
            const obj = { test: "test" };
            expect(hasProperty(obj, "test2")).toBe(false);
        })
        
        it("should work using a array of strings as path", () => {
            const obj = { test: { test2: "test" } };
            expect(hasProperty(obj, ["test", "test2"])).toBe(true);
        })

        it("should return true if object has the nested property", () => {
            const obj = { test: { test2: "test2" } };
            expect(hasProperty(obj, "test.test2")).toBe(true);
        })

        it("should return false if object doesn't have the nested property", () => {
            const obj = { test: { test2: "test2" } };
            expect(hasProperty(obj, "test.test3")).toBe(false);
        })

        it("should return true if object has the nested property with array notation", () => {
            const obj = { test: { test2: "test2" } };
            expect(hasProperty(obj, "test[test2]")).toBe(true);
        })

        it("should return false if object doesn't have the nested property with array notation", () => {
            const obj = { test: { test2: "test2" } };
            expect(hasProperty(obj, "test[test3]")).toBe(false);
        })

        it("should return true if object has the nested property with array notation and array index", () => {
            const obj = { test: { test2: ["test2"] } };
            expect(hasProperty(obj, "test[test2][0]")).toBe(true);
        })

        it("should return false if object doesn't have the nested property with array notation and array index", () => {
            const obj = { test: { test2: ["test2"] } };
            expect(hasProperty(obj, "test[test2][1]")).toBe(false);
        })

        it("should return true if object has the nested property with array notation and array index and nested property", () => {
            const obj = { test: { test2: [{test2: "test2"}] } };
            expect(hasProperty(obj, "test[test2][0].test2")).toBe(true);
        })

        it("should return false if object doesn't have the nested property with array notation and array index and nested property", () => {
            const obj = { test: { test2: [{test2: "test2"}] } };
            expect(hasProperty(obj, "test[test2][0].test3")).toBe(false);
        })

        it("should return true if object exist in ultra nested property", () => {
            const obj = { test: { test2: { test3: { test4: { test5: { test6: "Test 6" } } } } } };
            expect(hasProperty(obj, "test.test2.test3.test4.test5.test6")).toBe(true);
        })

        it("should return false if object doesn't exist in ultra nested property", () => {
            const obj = { test: { test2: { test3: { test4: { test5: { test6: "Test 6" } } } } } };
            expect(hasProperty(obj, "test.test2.test3.test4.test5.test7")).toBe(false);
        })

        it("should return true if property is a empty string", () => {
            const obj = { test: "" };
            expect(hasProperty(obj, "test")).toBe(true);
        })

        it("should return true if property is a 0 number", () => {
            const obj = { test: 0 };
            expect(hasProperty(obj, "test")).toBe(true);  
        })

        it("should return true if property is a false boolean", () => {
            const obj = { test: false };
            expect(hasProperty(obj, "test")).toBe(true);  
        })

        it("should return true if property is a string with 0", () => {
            const obj = { test: "0" };
            expect(hasProperty(obj, "test")).toBe(true);  
        })

        it("If path string doesn't match with the regexp, should return false", () => {
            const obj = { test: "test" };
            expect(hasProperty(obj, ".")).toBe(false);
        })
    })
})
