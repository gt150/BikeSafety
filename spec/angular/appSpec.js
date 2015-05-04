describe("app.js", function() {
    beforeEach(module("BikeSafety"));

    describe("makeMapColoredLinearly()", function() {
        it("doesn't interpolate for two values", function() {
            var result = makeMapColoredLinearly(['one','two'],['#000000','#ffffff']);
            expect(result).toEqual({
                'one': '#000000',
                'two': '#ffffff'
            });
        });

        it("interpolates with three values", function() {
            var result = makeMapColoredLinearly([1,2,3],['#000000','#ffffff']);
            expect(result).toEqual({
                1: '#000000',
                2: '#808080',
                3: '#ffffff'
            });
        });

        it("doesn't interpolate for three colors & values", function() {
            var result = makeMapColoredLinearly([1,2,3],['#000000','#0066ff','#ffffff']);
            expect(result).toEqual({
                1: '#000000',
                2: '#0066ff',
                3: '#ffffff'
            });
        });

        it("interpolateo for three colors & four values", function() {
            var result = makeMapColoredLinearly([1,2,3,4],['#000000','#0066ff','#ffffff']);
            expect(result).toEqual({
                1: '#000000',
                2: '#0044aa',
                3: '#5599ff',
                4: '#ffffff'
            });
        });
    });
});
