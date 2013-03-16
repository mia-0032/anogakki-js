var __slice = [].slice,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

$(function() {
  var CircleEffect, EffectAbstract, ano, canvas, cos, deg, echo, effects, processing, sin, _i;
  echo = function() {
    var value;
    value = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log(value);
  };
  sin = function(degrees) {
    return Math.sin(degrees / 180 * Math.PI);
  };
  cos = function(degrees) {
    return Math.cos(degrees / 180 * Math.PI);
  };
  sin = _.memoize(sin);
  cos = _.memoize(cos);
  for (deg = _i = 0; _i < 360; deg = ++_i) {
    sin(deg);
    cos(deg);
    echo(deg, sin(deg), cos(deg));
  }
  EffectAbstract = (function() {

    EffectAbstract.prototype.x = null;

    EffectAbstract.prototype.y = null;

    EffectAbstract.prototype.color = null;

    EffectAbstract.DELTA_COLOR = 2;

    EffectAbstract.FINISHED_COLOR = 30;

    EffectAbstract.prototype.outer_r = null;

    EffectAbstract.prototype.inner_r = null;

    EffectAbstract.DELTA_OUTER_R = 10;

    EffectAbstract.DELTA_INNER_R = 9;

    EffectAbstract.LINE_WIDTH = 15;

    function EffectAbstract(x, y) {
      this.x = x;
      this.y = y;
      this.getInnerY = __bind(this.getInnerY, this);

      this.getInnerX = __bind(this.getInnerX, this);

      this.getOuterY = __bind(this.getOuterY, this);

      this.getOuterX = __bind(this.getOuterX, this);

      this.isFinished = __bind(this.isFinished, this);

      this.displayEffect = __bind(this.displayEffect, this);

      this.display = __bind(this.display, this);

      this.color = 255;
      this.outer_r = 60;
      this.inner_r = 30;
    }

    EffectAbstract.prototype.display = function(p) {
      p.fill(0, this.color, 0);
      this.displayEffect(p);
      this.outer_r += EffectAbstract.DELTA_OUTER_R;
      this.inner_r += EffectAbstract.DELTA_INNER_R;
      return this.color -= EffectAbstract.DELTA_COLOR;
    };

    EffectAbstract.prototype.displayEffect = function(p) {};

    EffectAbstract.prototype.isFinished = function() {
      return this.color < EffectAbstract.FINISHED_COLOR;
    };

    EffectAbstract.prototype.getOuterX = function(deg) {
      return this.x - this.outer_r * cos(deg);
    };

    EffectAbstract.prototype.getOuterY = function(deg) {
      return this.y - this.outer_r * sin(deg);
    };

    EffectAbstract.prototype.getInnerX = function(deg) {
      return this.x - this.inner_r * cos(deg);
    };

    EffectAbstract.prototype.getInnerY = function(deg) {
      return this.y - this.inner_r * sin(deg);
    };

    return EffectAbstract;

  })();
  CircleEffect = (function(_super) {

    __extends(CircleEffect, _super);

    function CircleEffect() {
      this.displayEffect = __bind(this.displayEffect, this);
      return CircleEffect.__super__.constructor.apply(this, arguments);
    }

    CircleEffect.prototype.displayEffect = function(p) {
      var _j;
      p.beginShape(p.QUADS);
      p.vertex(this.getOuterX(0), this.getOuterY(0));
      p.vertex(this.getInnerX(0), this.getInnerY(0));
      for (deg = _j = 10; _j < 360; deg = _j += 10) {
        p.vertex(this.getInnerX(deg), this.getInnerY(deg));
        p.vertex(this.getOuterX(deg), this.getOuterY(deg));
        p.vertex(this.getOuterX(deg), this.getOuterY(deg));
        p.vertex(this.getInnerX(deg), this.getInnerY(deg));
      }
      p.vertex(this.getInnerX(0), this.getInnerY(0));
      p.vertex(this.getOuterX(0), this.getOuterY(0));
      return p.endShape();
    };

    return CircleEffect;

  })(EffectAbstract);
  canvas = $("#processing")[0];
  effects = [];
  ano = function(p) {
    p.setup = function() {
      return p.size(1366 * 2, 700, p.P2D);
    };
    p.draw = function() {
      var effect, i, next_effects, _j, _len;
      p.background(0);
      next_effects = [];
      for (i = _j = 0, _len = effects.length; _j < _len; i = ++_j) {
        effect = effects[i];
        effect.display(p);
        if (!effect.isFinished()) {
          next_effects.push(effect);
        }
      }
      return effects = next_effects;
    };
    return p.mousePressed = function() {
      return effects.push(new CircleEffect(p.mouseX, p.mouseY));
    };
  };
  return processing = new Processing(canvas, ano);
});
