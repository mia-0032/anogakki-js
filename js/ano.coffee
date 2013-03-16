$ ->
		#値をダンプする
		echo = (value...) ->
				console.log(value)
		
		#sinとcosの値をキャッシュしておくため
		sin = (degrees) ->
				return Math.sin(degrees / 180 * Math.PI)
		cos = (degrees) ->
				return Math.cos(degrees / 180 * Math.PI)
		sin = _.memoize(sin)
		cos = _.memoize(cos)
		
		for deg in [0...360]
				sin(deg)
				cos(deg)
				echo(deg, sin(deg), cos(deg))
		
		class EffectAbstract
				x: null
				y: null
				color: null
				@DELTA_COLOR: 2
				@FINISHED_COLOR: 30
				outer_r: null
				inner_r: null
				@DELTA_OUTER_R: 10
				@DELTA_INNER_R: 9
				@LINE_WIDTH: 15
				constructor: (@x, @y) ->
						@color = 255
						@outer_r = 60
						@inner_r = 30
				display: (p) =>
						p.fill(0, @color, 0);
						@displayEffect(p);
						@outer_r += EffectAbstract.DELTA_OUTER_R;
						@inner_r += EffectAbstract.DELTA_INNER_R;
						@color -= EffectAbstract.DELTA_COLOR;
				displayEffect: (p) =>
						#abstract function
				isFinished: () =>
						return @color < EffectAbstract.FINISHED_COLOR;
				getOuterX: (deg) =>
						return @x - @outer_r * cos(deg)
				getOuterY: (deg) =>
						return @y - @outer_r * sin(deg)
				getInnerX: (deg) =>
						return @x - @inner_r * cos(deg)
				getInnerY: (deg) =>
						return @y - @inner_r * sin(deg)
						
		class CircleEffect extends EffectAbstract
				displayEffect: (p) =>
						p.beginShape(p.QUADS);
						p.vertex(@getOuterX(0), @getOuterY(0));
						p.vertex(@getInnerX(0), @getInnerY(0));
						
						for deg in [10...360] by 10
								p.vertex(@getInnerX(deg), @getInnerY(deg));
								p.vertex(@getOuterX(deg), @getOuterY(deg));
								p.vertex(@getOuterX(deg), @getOuterY(deg));
								p.vertex(@getInnerX(deg), @getInnerY(deg));
								
						p.vertex(@getInnerX(0), @getInnerY(0));
						p.vertex(@getOuterX(0), @getOuterY(0));
						p.endShape();
				
		canvas = $("#processing")[0]
		effects = []
		ano = (p) ->
				p.setup = () ->
						p.size(1366*2, 700, p.P2D)
				p.draw = () ->
						p.background(0)
						next_effects = []
						for effect, i in effects
								effect.display(p)
								unless effect.isFinished() then next_effects.push(effect)
						effects = next_effects
				p.mousePressed = () ->
						effects.push(new CircleEffect(p.mouseX, p.mouseY))
		processing = new Processing(canvas, ano)