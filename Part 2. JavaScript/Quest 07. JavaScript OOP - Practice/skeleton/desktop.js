const ICON_SIZE = { // in pixels
	default: 90,
	min: 90,
	max: 210,
	interval: 30,
}

const convertIndexToCoords = (index, columnsCount) => {
	const x = index % columnsCount;
	const y = Math.floor(index / columnsCount);

	return [ x, y ];
}

const calibrateIconSize = size => {
	if (size < ICON_SIZE.min) return ICON_SIZE.min;
	if (size > ICON_SIZE.max) return ICON_SIZE.max;
	return size;
}

const setTransformOrigin = object => {
	const originX = object.originalPosition.left - parseInt(object.containerElement.style.left);
	const originY = object.originalPosition.top - parseInt(object.containerElement.style.top);

	object.containerElement.style.transformOrigin = `${originX}px ${originY}px`;
}

const calibratePosition = element => {
	const desktopBody = document.getElementsByClassName('desktop__body')[0];
	const availableWidth = desktopBody.getBoundingClientRect().width;
	const availableHeight = desktopBody.getBoundingClientRect().height;
	const elementWidth = element.clientWidth;
	const elementHeight = element.clientHeight;
	const elementOffsetLeft = element.offsetLeft;
	const elementOffsetTop = element.offsetTop;

	if (availableWidth < elementWidth + elementOffsetLeft) {
		element.style.left = `${availableWidth - elementWidth}px`;
	} else if (elementOffsetLeft < 0) {
		element.style.left = 0;
	}

	if (availableHeight < elementHeight + elementOffsetTop) {
		element.style.top = `${availableHeight - elementHeight}px`;
	} else if (elementOffsetTop < 0) {
		element.style.top = 0;
	}
}

const moveElement = (movableElement, clientX, clientY) => {
	// to correctly position target element
	const shiftX = clientX - movableElement.getBoundingClientRect().left;
	const shiftY = clientY - movableElement.getBoundingClientRect().top;
	
	const move = (pageX, pageY) => {
		movableElement.style.left = `${pageX - shiftX}px`;
		movableElement.style.top = `${pageY - shiftY}px`;
		calibratePosition(movableElement);
	}

	/** mousemove event handler */
	const onMouseMove = e => move(e.pageX, e.pageY);

	/**
	 * mouseup event handler
	 * - removes unnecessory event handlers
	 */
	const onMouseUp = () => {
		document.removeEventListener('mousemove', onMouseMove);
		movableElement.removeEventListener('mouseup', onMouseUp);
	}

	/** add mousemove event listener to document */
	document.addEventListener('mousemove', onMouseMove);

	/** add mouseup event listener to element */
	movableElement.addEventListener('mouseup', onMouseUp);
}

class Desktop {
	constructor(
		icons,
		iconSize = ICON_SIZE.default,
	) {
		// assign variables
		this.icons = icons;
		this.iconSize = iconSize;

		// assign functions
		this.renderIcons = this.renderIcons.bind(this);
		this.onIconSizeDownClick = this.onIconSizeDownClick.bind(this);
		this.onIconSizeUpClick = this.onIconSizeUpClick.bind(this);
		this.onSortButtonClick = this.onSortButtonClick.bind(this);
		
		this.renderDesktop();
		window.addEventListener('resize', this.renderIcons);
	}
	
	renderDesktop() {
		// create elements
		this.containerElement = document.createElement('section');
		this.footerElement = this.createFooterElement();
		this.bodyElement = document.createElement('div');
		
		// add style
		this.containerElement.classList.add('desktop');
		this.footerElement.classList.add('desktop__footer');
		this.bodyElement.classList.add('desktop__body');
		
		// combine elements
		this.containerElement.appendChild(this.bodyElement);
		this.containerElement.appendChild(this.footerElement);

		// render container element
		document.body.appendChild(this.containerElement);
		this.renderIcons();
	}

	createFooterElement() {
		const footer = document.createElement('footer');
		const footerTitle = document.createElement('h1');
		const footerControls = document.createElement('div');
		const buttonGroupLabel = document.createElement('span');
		const buttonGroup = document.createElement('div');
		const iconSizeDown = document.createElement('button');
		const iconSizeUp = document.createElement('button');
		const sortButton = document.createElement('button');

		footerControls.classList.add('desktop__footer__controls');
		buttonGroupLabel.classList.add('desktop__footer__controls__button-group-label');
		buttonGroup.classList.add('desktop__footer__controls__button-group');
		iconSizeDown.classList.add('desktop__footer__controls__button');
		iconSizeUp.classList.add('desktop__footer__controls__button');
		sortButton.classList.add('desktop__footer__controls__button');

		footerTitle.textContent = 'Fake Desktop';
		buttonGroupLabel.textContent = '아이콘 사이즈';
		iconSizeDown.textContent = '작게';
		iconSizeUp.textContent = '크게';
		sortButton.textContent = '정렬';

		iconSizeDown.addEventListener('click', this.onIconSizeDownClick);
		iconSizeUp.addEventListener('click', this.onIconSizeUpClick);
		sortButton.addEventListener('click', this.onSortButtonClick);

		buttonGroup.appendChild(iconSizeDown);
		buttonGroup.appendChild(iconSizeUp);
		footerControls.appendChild(buttonGroupLabel);
		footerControls.appendChild(buttonGroup);
		footerControls.appendChild(sortButton);

		footer.appendChild(footerTitle);
		footer.appendChild(footerControls);

		return footer;
	}

	renderIcons() {
		this.icons.forEach((icon, index) => {
			// max counts for column and row
			const columnsCount = Math.floor(this.bodyElement.clientWidth / this.iconSize);
			const rowsCount = Math.floor(this.bodyElement.clientHeight / (this.iconSize * 1.3));
			
			// set icon size
			const iconWidth = this.bodyElement.clientWidth / columnsCount;
			const iconHeight = this.bodyElement.clientHeight / rowsCount;
			icon.containerElement.style.width = `${iconWidth}px`;
			icon.containerElement.style.height = `${iconHeight}px`;

			// set icon position
			const [ x, y ] = convertIndexToCoords(index, columnsCount);
			icon.containerElement.style.top = `${iconHeight * y}px`;
			icon.containerElement.style.left = `${iconWidth * x}px`;

			// set svg path
			if (icon.containerElement.classList.value === 'icon') {
				icon.iconElement.setAttributeNS(null, "width", 12);
				icon.iconElement.setAttributeNS(null, "height", 16);
				icon.iconElement.setAttributeNS(null, "viewBox", "0 0 12 16");
				
				const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
				path.setAttributeNS(null, "d", "M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z");
		
				icon.iconElement.appendChild(path);
			} else if (icon.containerElement.classList.value === 'icon folder') {
				icon.iconElement.setAttributeNS(null, "width", 14);
				icon.iconElement.setAttributeNS(null, "height", 16);
				icon.iconElement.setAttributeNS(null, "viewBox", "0 0 14 16");

				const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
				path.setAttributeNS(null, "d", "M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z");
		
				icon.iconElement.appendChild(path);
			}

			this.bodyElement.appendChild(icon.containerElement);
			if (icon.containerElement.classList.value === 'icon folder') {
				this.bodyElement.appendChild(icon.window.containerElement);
			}
		});
	}

	onIconSizeDownClick() {
		this.iconSize = calibrateIconSize(this.iconSize - ICON_SIZE.interval);
		this.renderIcons();
	}

	onIconSizeUpClick() {
		this.iconSize = calibrateIconSize(this.iconSize + ICON_SIZE.interval);
		this.renderIcons();
	}

	onSortButtonClick() {
		this.renderIcons();
	}
};

class Icon {
	constructor(label) {
		// assign variables
		this.label = label;

		// assign functions
		this.onMouseDown = this.onMouseDown.bind(this);

		this.createElement();
	}

	createElement() {
		// create elements
		this.containerElement = document.createElement('div');
		this.iconElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.labelElement = document.createElement('label');

		// add style
		this.containerElement.classList.add('icon');
		this.iconElement.classList.add('icon__svg');
		this.labelElement.classList.add('icon__label');

		// add text content
		this.labelElement.textContent = this.label;

		// add event listener
		this.containerElement.addEventListener('mousedown', this.onMouseDown);

		// combine elements
		this.containerElement.appendChild(this.iconElement);
		this.containerElement.appendChild(this.labelElement);
	}

	onMouseDown(e) {
		e.preventDefault();
		moveElement(this.containerElement, e.clientX, e.clientY);
	}
};

class Folder extends Icon {
	constructor(label) {
		super(label);

		// assign functions
		this.onFolderDblClick = this.onFolderDblClick.bind(this);

		// add style
		this.containerElement.classList.add('folder');
		this.iconElement.addEventListener('dblclick', this.onFolderDblClick);

		// add window
		this.window = new Window(label);
	}

	onFolderDblClick(e) {
		this.window.originalPosition = { top: e.clientY, left: e.clientX };
		this.window.containerElement.style.top = `${e.clientY}px`;
		this.window.containerElement.style.left = `${e.clientX}px`;
		this.window.containerElement.style.transformOrigin = '0 0';
		this.window.open();
	}
};

class Window {
	constructor(label) {
		// assign variables
		this.label = label;
		
		// assign functions
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onBrowserResize = this.onBrowserResize.bind(this);
		
		this.element = this.createElement();

		window.addEventListener('resize', this.onBrowserResize);
	}

	createElement() {
		// create elements
		this.containerElement = document.createElement('div');
		this.headerElement = this.createHeaderElement();
		this.bodyElement = document.createElement('div');

		// add style
		this.containerElement.classList.add('window');
		this.headerElement.classList.add('window__header');
		this.bodyElement.classList.add('window__body');

		// combine elements
		this.containerElement.appendChild(this.headerElement);
		this.containerElement.appendChild(this.bodyElement);
	}

	createHeaderElement() {
		const header = document.createElement('header');
		const headerTitle = document.createElement('h3');
		const closeButton = document.createElement('button');

		headerTitle.textContent = this.label;
		closeButton.innerHTML = '&#10005;';

		header.addEventListener('mousedown', this.onMouseDown);
		closeButton.addEventListener('click', this.close);

		header.appendChild(headerTitle);
		header.appendChild(closeButton);

		return header;
	}

	open() {
		calibratePosition(this.containerElement);
		setTransformOrigin(this);
		this.containerElement.classList.add('open');
	}

	close() {
		setTransformOrigin(this);
		this.containerElement.classList.remove('open');
	}

	onMouseDown(e) {
		e.preventDefault();
		moveElement(this.containerElement, e.clientX, e.clientY);
	}

	onBrowserResize() {
		calibratePosition(this.containerElement);
	}
};
