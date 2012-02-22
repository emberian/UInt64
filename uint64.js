var UInt64 = (function () {
  /* Create little endian bit array from number XXX  */
  var toBits = function (n) {
    var n_orig = n;
    var numBits = Math.ceil(Math.log(n) / Math.log(2));
    var result = [];
    for (var i = numBits - 1; i > 0; i--) {
      var pow = Math.pow(2, i);
      if (Math.floor(n / pow) === 1) {
        n -= pow;
        result[i] = 1;
      } else {
        result[i] = 0;
      }
    }
    return result;
  };
  /* Return (num & 0xFFFFFFFF) but without the signed behavior that ECMAScript
   * defines should happen for & (page 83, ECMA-262).
   * XXX
   */
  var uint32max = toBits(0xFFFFFFFF);
  var and32 = function(num) {
    var bits = toBits(num);
    var result = [];
    for (var i = bits.length; i > 0; i--) {
      result[i] = bits[i] & uint32max[i];
    }
    return result;
  };
  var UInt64 = function(hi, lo) {
    if (lo) {
      console.log('New UInt64(%s, %s) being created', hi.toString(16), lo.toString(16));
      this.hi = and32(hi);
      this.lo = and32(lo);
      console.log("%s %s created", this.hi.toString(16), this.lo.toString(16));
    } else {
      if (hi > Math.pow(2, 53)) {
        throw new Error('Cannot represent number > 2^53');
      } else {
        this.hi = 0;
        this.lo = and32(lo);
      }
    }
  };
  UInt64.prototype = {
    _uint32max: uint32max,
    _toBits: toBits,
    _and32: and32,
    rightShift: function(n) {
      if (n >= 64) {
        console.trace();
        console.warning('Shouldn\'t shift by huge numbers...');
        return new UInt64(0);
      } else if (n < 0) {
        throw new Error('Cannot shift negative direction');
      } else if (n < 32) {
        return new UInt64(this.hi >>> n, (this.hi << (32-n)) | (this.lo >>> n));
      } else if (n >= 32) {
        return new UInt64(0, this.hi >>> (n % 32));
      } else {
        throw new Error('Sanity check, code shouldn\'t reach here');
      }
    },
    leftShift: function(n) {
      if (n >= 64) {
        console.trace();
        console.warning('Shouldn\'t shift by huge numbers...');
        return new UInt64(0);
      } else if (n < 0) {
        throw new Error('Cannot shift negative direction');
      } else if (n < 32) {
        return new UInt64((this.hi << n) | (this.lo >>> (32 - n)), this.lo << n);
      } else if (n >= 32) {
        return new UInt64(this.lo << (n % 32), 0);
      } else {
        throw new Error('Sanity check, code shouldn\'t reach here');
      }
    },
    xor: function(other) {
      if (!other instanceof UInt64) {
        console.warning('Should always pass in a UInt64');
        other = UInt64(other);
      }
      return new UInt64(this.hi ^ other.hi, this.lo ^ other.lo);
    },
    and: function(other) {
      if (!other instanceof UInt64) {
        console.warning('Should always pass in a UInt64');
        other = UInt64(other);
      }
      return new UInt64(this.hi & other.hi, this.lo & other.lo);
    },
    or: function(other) {
      if (!other instanceof UInt64) {
        console.warning('Should always pass in a UInt64');
        other = UInt64(other);
      }
      return new UInt64(this.hi | other.hi, this.lo | other.lo);
    },
    not: function() {
      return new UInt64(~this.hi, ~this.lo);
    },
    add: function(other) {
      if(!other instanceof UInt64) {
        console.warning('Should always pass in a UInt64');
        other = UInt64(other);
      }
      var result = new UInt64(0);
      result.lo = (this.lo + other.lo); /* MIGHT be 33 bits! Make sure to & it later */
      result.hi = and32(((this.hi + other.hi) | (result.lo >>> 31)));
      result.lo = and32(result.lo);
      return result;
    },
    equals: function(other) {
      console.log("%s = %s", this.toString(), other.toString());
      return (this.hi === other.hi && this.lo === other.lo) ? true : false;
    },
    toString: function() {
      var ret = '0x';
      ret += this.hi.toString(16)
      for (var i = 8 - this.lo.toString(16).length; i > 0; i--) {
        ret += '0';
      }
      ret += this.lo.toString(16);
      return ret;
    }
  };
  return UInt64;
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = UInt64;
}
