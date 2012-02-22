var crypto = require('crypto');
var test = require('tap').test;
var UInt64 = require('../uint64');
// Unfortunately JS doesn't support numbers these large. I used a calculator
// to get the constants I am testing against. Please double check if failing
// tests cause doubts
test('toBits', function(t) {
    var toBits = new UInt64(0)._toBits;
    t.plan(3);
    t.equals(toBits(4), [1, 0, 0]);
    t.equals(toBits(15), [1, 1, 1, 1]);
    t.equals(toBits(1231451), [1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0,
        1, 1, 0, 1, 1]);
    t.end();
  })
test('addition', function(t) {
    t.test('basic addition', function (t) {
        var big = new UInt64(0x554, 0x234);
        var expected_result = new UInt64(0x555, 0x235);
        var result = big.add(new UInt64(1, 1));
        t.ok(result.equals(expected_result));
        expected_result = new UInt64(0x12345, 0x12345);
        result = new UInt64(0x12340, 0x12344).add(new UInt64(5, 1));
        t.ok(result.equals(expected_result));
        t.end();
      });
    t.test('modulo', function (t) {
        var max = new UInt64(0xFFFFFFFF, 0xFFFFFFFF);
        var result = max.add(new UInt64(1));
        t.ok(result.equals(new UInt64(0)));
        result = max.add(new UInt64(2));
        t.ok(result.equals(new UInt64(1)));
        result = max.add(new UInt64(Math.pow(2, 35)));
        t.ok(result.equals(new UInt64(Math.pow(2, 35) - 1)))
        t.end();
      });
    t.end();
  });
