/*
	jMarquee - jquery plugin can select polygon marquee in canvas

	Any License You Want. dexbolg@gmail.com <dexbol>

	Usage:

		Method:
			$(canvas element).marquee([shapes])
			[shapes] is optional parameter that is object contain shape's coordinate.
			e.g.  $('canvas').marquee({
				'shape1': 'x1,y1,x2,y2,x3,y3'
			})
			The code above will draw a rectangle in canvas.


		Events:
			drawComplete(event, newShape_id, newShape_coords, allShapes)
			When a user draw some valid polygon drawComplete will invoke.

			drawError

 */

;(function($) {
	var NAMESPACE = 'jMarquee';

	var timer;

	var drawShape = function(canvas, coords) {
		var ctx = canvas.getContext('2d');
		var start;
		var point;
		coords = normalizeCoords(coords);

		ctx.save();
		ctx.fillStyle = 'rgba(0, 0, 255, .2)';
		ctx.strokeStyle = 'rgba(0, 0, 255, .9)';
		ctx.beginPath();
		start = coords.shift();
		ctx.moveTo(start[0], start[1]);
		while (coords.length > 0) {
			point = coords.shift();
			ctx.lineTo(point[0], point[1]);
		}
		ctx.lineTo(start[0], start[1]);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	};

	var drawLine = function(canvas, coords) {
		var ctx = canvas.getContext('2d');
		var start = coords[0];
		var point;
		var i = 1

		ctx.save();
		ctx.strokeStyle = 'rgba(255, 0, 0, .9)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(start[0], start[1]);

		for (; i < coords.length; i++) {
			point = coords[i];
			ctx.lineTo(point[0], point[1])
		}

		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	};

	var serializeCoords = function(coords) {
		var result = [];

		$.each(coords, function(index, item) {
			result.push(item.join());
		});
		return result.join();
	};

	var normalizeCoords = function(coords) {
		var result = [];

		coords = coords.split(',');
		while (coords.length > 0) {
			result.push([parseFloat(coords.shift()), parseFloat(coords.shift())]);
		}
		return result;
	}

	var draw = function(jcanvas) {
		var canvas = jcanvas[0];
		var shapes = jcanvas.data(NAMESPACE + '.shape');
		var point = jcanvas.data(NAMESPACE + '.point');
		var free = jcanvas.data(NAMESPACE + '.free');
		var ctx = canvas.getContext('2d');
		var p;
		var shape;
		var clone;

		ctx.clearRect(0, 0, jcanvas.width(), jcanvas.height());

		for (p in shapes) {
			shape = shapes[p];
			drawShape(canvas, shape);
		}

		if (point.length > 0) {
			if (free.length == 2) {
				clone = [];
				point.forEach(function(item, index) {
					clone.push(item);
				});
				clone.push(free);
				drawLine(canvas, clone);

			} else {
				drawLine(canvas, point)
			}
		}
	};

	var checkPointInPolygon = function(point, polygon) {
		var result = false;
		var i = 0;
		var j = polygon.length - 1;
		
		for (; i < polygon.length; j = i++) {
			if ((point[1] > polygon[i][1]) != (point[1] > polygon[j][1]) && 
				(point[0] < (point[1] - polygon[i][1]) * (polygon[j][0] - polygon[i][0]) / 
				(polygon[j][1] - polygon[i][1]) + polygon[i][0])) {

				result = !result;
			}
		}

		return result;
	};

	var validateShape = function(jcanvas, newShapeCoord) {
		var shape = jcanvas.data(NAMESPACE + '.shape');
		var result;

		if (newShapeCoord.length < 3) {
			return false;
		}
		result = newShapeCoord.every(function(point, index) {
			var coords;
			var p;

			for (p in shape) {
				coords = normalizeCoords(shape[p])
				if (checkPointInPolygon(point, coords)) {
					return false;
				}
			}
			return true;
		});
		return result;
	};

	var guid = function() {
		return Date.now().toString(36);
	}

	var startSelect = function(jcanvas) {
		jcanvas.data(NAMESPACE + '.startSelect', true);
		jcanvas.data(NAMESPACE + '.point', []);
	};

	var endSelect = function(jcanvas) {
		var point = jcanvas.data(NAMESPACE + '.point');
		var shape = jcanvas.data(NAMESPACE + '.shape');
		var uid;
		var result;

		jcanvas.data(NAMESPACE + '.startSelect', false);
		jcanvas.data(NAMESPACE + '.point', []);

		if (validateShape(jcanvas, point)) {
			uid = guid();
			shape[uid] = serializeCoords(point);
			draw(jcanvas);
			jcanvas.triggerHandler('drawComplete', [uid, shape[uid], shape]);

		} else {
			draw(jcanvas);
			jcanvas.triggerHandler('drawError');
		}
	};

	var getPosition = function(jcanvas, event) {
		var canvasPosition = jcanvas.data(NAMESPACE + '.pos');
		canvasPosition = canvasPosition || jcanvas.offset();
		jcanvas.data(NAMESPACE + '.pos', canvasPosition);
		return [Math.round(event.pageX - canvasPosition.left), 
			Math.round(event.pageY - canvasPosition.top)];
	};

	var clickHandler = function(event) {
		var canvas = event.currentTarget;
		var jcanvas = $(canvas);
		var coords = getPosition(jcanvas, event);

		if (!jcanvas.data(NAMESPACE + '.startSelect')) {
			startSelect(jcanvas)
		}
		jcanvas.data(NAMESPACE + '.point').push(coords);
		event.preventDefault();
		event.stopPropagation();
		draw(jcanvas)
	};

	var dblclickHandler = function(event) {
		var canvas = event.currentTarget;
		var jcanvas = $(canvas);
		var point = jcanvas.data(NAMESPACE + '.point');
		
		point.pop();
		endSelect(jcanvas);
	}

	var mousemoveHandler = function(event) {
		var handler;

		if (timer || !$(event.currentTarget).data(NAMESPACE + '.startSelect')) {
			return;
		}

		handler = function () {
			var canvas = event.currentTarget;
			var jcanvas = $(canvas);
			var coord = getPosition(jcanvas, event);

			jcanvas.data(NAMESPACE + '.free', coord);
			draw(jcanvas);
			timer = handler = event = null;
		};
		timer = setTimeout(handler, 50)
	};

	$.fn.marquee = function(shapes) {
		if (! this.data(NAMESPACE + '.shape')) {
			this.on('click.' + NAMESPACE, clickHandler);
			this.on('dblclick.' + NAMESPACE, dblclickHandler);
			this.on('mousemove.' + NAMESPACE, mousemoveHandler);
		}

		shapes = shapes || {};
		this.data(NAMESPACE + '.shape' , shapes)
		this.data(NAMESPACE + '.point', []);
		this.data(NAMESPACE + '.free', []);
		draw(this);
	};

	$.fn.marquee_del = function(marqueeid) {
		delete this.data(NAMESPACE + '.shape')[marqueeid];
		draw(this);
	};


})(jQuery);