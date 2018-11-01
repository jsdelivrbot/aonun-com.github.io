const E = new EventTarget();
// E.key = { "0": "Digit0", "1": "Digit1", "2": "Digit2", "3": "Digit3", "4": "Digit4", "5": "Digit5", "6": "Digit6", "7": "Digit7", "8": "Digit8", "9": "Digit9", "a": "KeyA", "Shift": "ShiftLeft", "A": "KeyA", "Control": "ControlRight", "Alt": "AltRight", "Meta": "MetaLeft", "`": "Backquote", "~": "Backquote", "F1": "F1", "F2": "F2", "F3": "F3", "F4": "F4", "F5": "F5", "F6": "F6", "F7": "F7", "F8": "F8", "F9": "F9", "F10": "F10", "F11": "F11", "F12": "F12", "ScrollLock": "ScrollLock", "Pause": "Pause", "PrintScreen": "PrintScreen", "Insert": "Insert", "Home": "Home", "PageUp": "PageUp", "Delete": "Delete", "End": "End", "PageDown": "PageDown", "ArrowLeft": "ArrowLeft", "ArrowRight": "ArrowRight", "ArrowUp": "ArrowUp", "Z": "KeyZ", "X": "KeyX", "C": "KeyC", "V": "KeyV", "B": "KeyB", "N": "KeyN", "M": "KeyM", "<": "Comma", ">": "Period", "?": "Slash", "\"": "Quote", ":": "Semicolon", "L": "KeyL", "Enter": "Enter", "|": "Backslash", "Backspace": "Backspace", "+": "Equal", "_": "Minus", ")": "Digit0", "(": "Digit9", "*": "Digit8", "&": "Digit7", "^": "Digit6", "$": "Digit4", "%": "Digit5", "#": "Digit3", "@": "Digit2", "!": "Digit1", "Tab": "Tab", "Q": "KeyQ", "W": "KeyW", "E": "KeyE", "R": "KeyR", "T": "KeyT", "Y": "KeyY", "U": "KeyU", "I": "KeyI", "O": "KeyO", "P": "KeyP", "{": "BracketLeft", "K": "KeyK", "J": "KeyJ", "F": "KeyF", "G": "KeyG", "H": "KeyH", "D": "KeyD", "S": "KeyS", "ContextMenu": "ContextMenu", "HangulMode": "AltRight", "Escape": "Escape", "-": "Minus", "=": "Equal", "\\": "Backslash", "]": "BracketRight", "[": "BracketLeft", "p": "KeyP", "o": "KeyO", "i": "KeyI", "u": "KeyU", "y": "KeyY", "t": "KeyT", "r": "KeyR", "e": "KeyE", "q": "KeyQ", "w": "KeyW", "CapsLock": "CapsLock", "s": "KeyS", "d": "KeyD", "f": "KeyF", "g": "KeyG", "h": "KeyH", "j": "KeyJ", "k": "KeyK", "l": "KeyL", ";": "Semicolon", "'": "Quote", "/": "Slash", ".": "Period", ",": "Comma", "m": "KeyM", "n": "KeyN", "b": "KeyB", "v": "KeyV", "z": "KeyZ", "x": "KeyX", "c": "KeyC", " ": "Space" };
// E.keyCode = {"8":"Backspace","9":"Tab","13":"Enter","16":"ShiftLeft","17":"ControlRight","18":"AltRight","19":"Pause","20":"CapsLock","21":"AltRight","27":"Escape","32":"Space","33":"PageUp","34":"PageDown","35":"End","36":"Home","37":"ArrowLeft","38":"ArrowUp","39":"ArrowRight","44":"PrintScreen","45":"Insert","46":"Delete","48":"Digit0","49":"Digit1","50":"Digit2","51":"Digit3","52":"Digit4","53":"Digit5","54":"Digit6","55":"Digit7","56":"Digit8","57":"Digit9","65":"KeyA","66":"KeyB","67":"KeyC","68":"KeyD","69":"KeyE","70":"KeyF","71":"KeyG","72":"KeyH","73":"KeyI","74":"KeyJ","75":"KeyK","76":"KeyL","77":"KeyM","78":"KeyN","79":"KeyO","80":"KeyP","81":"KeyQ","82":"KeyR","83":"KeyS","84":"KeyT","85":"KeyU","86":"KeyV","87":"KeyW","88":"KeyX","89":"KeyY","90":"KeyZ","91":"MetaLeft","93":"ContextMenu","112":"F1","113":"F2","114":"F3","115":"F4","116":"F5","117":"F6","118":"F7","119":"F8","120":"F9","121":"F10","122":"F11","123":"F12","145":"ScrollLock","186":"Semicolon","187":"Equal","188":"Comma","189":"Minus","190":"Period","191":"Slash","192":"Backquote","219":"BracketLeft","220":"Backslash","221":"BracketRight","222":"Quote"};
E.regExpKey = /^Key.$/;
E.mouseTypes = new Set(['mousedown', 'mouseup', 'click', 'dblclick', 'mouseenter', 'mouseover', 'mouseout', 'mouseleave', 'mousemove', 'mousewheel']);
E.keyboardTypes = new Set(['keydown', 'keypress', 'keyup', 'input', 'change']);
E.onKeyboardEvent = function (e) {
	let keyMap = new Set();
	if (e.ctrlKey) keyMap.add('Ctrl');
	if (e.shiftKey) keyMap.add('Shift');
	if (e.altKey) keyMap.add('Alt');
	let code = e.code;
	switch (code) {
		case 'ControlLeft':
		case 'ControlRight':
			code = 'Ctrl';
			break;
		case 'ShiftLeft':
		case 'AltLeft':
			code = code.slice(0, -4);
			break;
		case 'ShiftRight':
		case 'AltRight':
			code = code.slice(0, -5);
			break;
		case 'ArrowUp':
		case 'ArrowDown':
		case 'ArrowLeft':
		case 'ArrowRight':
		case 'Digit0':
		case 'Digit1':
		case 'Digit2':
		case 'Digit3':
		case 'Digit4':
		case 'Digit5':
		case 'Digit6':
		case 'Digit7':
		case 'Digit8':
		case 'Digit9':
			code = code.slice(5);
			break;
		case 'Numpad0':
		case 'Numpad1':
		case 'Numpad2':
		case 'Numpad3':
		case 'Numpad4':
		case 'Numpad5':
		case 'Numpad6':
		case 'Numpad7':
		case 'Numpad8':
		case 'Numpad9':
		case 'NumpadAdd':
		case 'NumpadSubtract':
		case 'NumpadMultiply':
		case 'NumpadDivide':
		case 'NumpadEnter':
		case 'NumpadDecimal':
			code = code.slice(6);
			break;
		default:
			if (E.regExpKey.test(code)) code = code.slice(3);
	}
	keyMap.add(code);

	let event = new Event(e.type);
	event.keyMap = Array.from(keyMap).join('+');
	event.originalEvent = e;
	event.data = e.data || event.keyMap;
	E.dispatchEvent(event);
};

E.onMouseEvent = function (e) {
	let event = new Event(e.type);
	event.originalEvent = e;
	event.detail = e.detail;
	event.detailX = e.detailX;
	event.detailY = e.detailY;
	E.dispatchEvent(event);
};

E.started = false;

E.start = function () {
	if (!E.started) {
		E.mouseTypes.forEach(type => {
			window.addEventListener(type, E.onMouseEvent);
		});
		E.keyboardTypes.forEach(type => {
			window.addEventListener(type, E.onKeyboardEvent);
		});
		E.started = true;
	}
};

E.stop = function () {
	if (E.started) {
		E.mouseTypes.forEach(type => {
			window.removeEventListener(type, E.onMouseEvent);
		});
		E.keyboardTypes.forEach(type => {
			window.removeEventListener(type, E.onKeyboardEvent);
		});
		E.started = false;
	}
};

E.test = {
	keyboardTypes: new Set(['keydown']),
	keyboardHandles: [function (e) {
		let o={};
		o.type=e.type;
		o.keyMap = e.keyMap;
		o.data = e.data;
		console.log(JSON.stringify(o,null,2), e.target);
	}],
	keyboardHandle: function (e) {
		E.test.keyboardHandles.forEach(f => f.call(e.target,e));
	},
	keyboardTesting: false,
	keyboard(on = true) {
		if (E.test.keyboardTesting === false && on) {
			E.test.keyboardTypes.forEach(type => {
				E.addEventListener(type, E.test.keyboardHandle);
			});
			E.test.keyboardTesting = true;
		} else if (on === false && E.test.keyboardTesting) {
			E.test.keyboardTypes.forEach(type => {
				E.removeEventListener(type, E.test.keyboardHandle);
			});
		}
		E.test.keyboardTesting = on;
	},

	mouseTypes: new Set(E.mouseTypes),
	mouseHandles: [function (e) {
		const oe = e.originalEvent;
		const {
			type,
			movementX, offsetX, screenX, clientX, layerX, pageX,
			movementY, offsetY, screenY, clientY, layerY, pageY,
			detail,
			deltaX, deltaY, deltaZ, delta, deltaMode,
			ctrlKey, shiftKey, altKey,
		} = oe;
		console.log(JSON.stringify({
			type,
			movementX, offsetX, screenX, clientX, layerX, pageX,
			movementY, offsetY, screenY, clientY, layerY, pageY,
			detail,
			deltaX, deltaY, deltaZ, delta, deltaMode,
			ctrlKey, shiftKey, altKey,
		}, null, 2), oe.target);
	}],
	mouseHandle: function (e) {
		E.test.mouseHandles.forEach(f => f(e));
	},
	mouseTesting: false,
	mouse(on = true) {
		if (E.test.mouseTesting === false && on) {
			E.test.mouseTypes.forEach(type => {
				E.addEventListener(type, E.test.mouseHandle);
			});
			E.test.mouseTesting = true;
		} else if (on === false && E.test.mouseTesting) {
			E.test.mouseTypes.forEach(type => {
				E.removeEventListener(type, E.test.mouseHandle);
			});
		}
		E.test.mouseTesting = on;
	},
	start(){
		console.log(this.keyboardTypes);
		console.log(this.mouseTypes);
		E.test.keyboard(true);
		E.test.mouse(true);
	},
	stop() {
		E.test.keyboard(false);
		E.test.mouse(false);
	}
}
