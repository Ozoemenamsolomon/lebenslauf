/**
 *
 * @param {string} tagName
 * @param {string[]} classNames
 * @param {string|undefined} text
 * @param {Element | null|undefined} parentNode
 * @param {object | undefined} attributes
 * @returns {HTMLElement}
 */

const myCreateElement = (
	tagName,
	classNames,
	text = '',
	parentNode,
	attributes
) => {
	let element = document.createElement(tagName);
	element.innerText = text;
	classNames && element.classList.add(...classNames);
	attributes &&
		Object.keys(attributes).forEach((key) => {
			element.setAttribute(key, attributes[key]);
		});
	if (parentNode) {
		element = parentNode.appendChild(element);
	}
	return element;
};

export default myCreateElement;
