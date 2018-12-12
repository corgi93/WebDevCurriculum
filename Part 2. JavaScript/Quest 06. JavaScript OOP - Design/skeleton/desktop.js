class Desktop {
	constructor(width = '100%', height = '100%') {
		this.element = document.getElementsByClassName('desktop')[0];
		this.element.style.width = width;
		this.element.style.height = height;

		this.element.addEventListener('resize', this.onResize);
	}

	onResize() {}
};

class Icon {
	constructor(parent, label) {
		this.parent = parent;
		this.label = label;
	}

	createNode() {}

	onMouseDown() {}

	onDrag() {}

	onMouseUp() {}
};

class Folder extends Icon {
	constructor(parent, label) {
		super(parent, label);
	}

	onDoubleClick() {}
};

class Window {
	constructor(title, width = '80%', height = '80%') {
		this.title = title;
		this.width = width;
		this.height = height;
	}

	open() {}

	close() {}

	onMouseDown() {}

	onDrag() {}

	onMouseUp() {}
};
