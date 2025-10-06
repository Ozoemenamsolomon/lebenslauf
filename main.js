// @ts-check
import myCreateElement from './src/myCreateElement.js';
import { renderData } from './src/render.js';
import {
	clearSections,
	jsonPathForLang,
	setActiveLangButton,
} from './src/utils.js';

const sectionsContainer = document.querySelector('#sections');
const profilePicturePath = './profile-picture.jpg';
const signaturePath = './signature.png';

/** @type {'de'|'en'} */
let currentLang = 'de'; // default to German

const langPathDict = {
	en: 'eng/lebenslauf.json',
	de: 'lebenslauf.json',
};

const controls = {
	/** @type {HTMLButtonElement | null} */
	langDeBtn: document.querySelector('#lang-de'),
	/** @type {HTMLButtonElement | null} */
	langEnBtn: document.querySelector('#lang-en'),
};

/** @param {'de'|'en'} lang */
function fetchAndRender(lang) {
	clearSections(sectionsContainer);
	setActiveLangButton(controls, currentLang);
	const path = jsonPathForLang(lang, langPathDict, currentLang);
	fetch(path)
		.then((response) => response.json())
		.then((data) => {
			renderData(data, lang, {
				sectionsContainer,
				profilePicturePath,
				signaturePath,
			});
			// apply any saved order for this language after render
			try {
				applySavedOrder(lang);
			} catch (e) {
				// ignore
			}
		})
		.catch((err) => {
			console.error('Failed to load JSON:', err);
			if (sectionsContainer) {
				myCreateElement(
					'p',
					[],
					'Failed to load resume data.',
					sectionsContainer,
					undefined
				);
			}
		});
}

controls.langDeBtn?.addEventListener('click', () => {
	if (currentLang === 'de') {
		console.log('Language is already German');
		return;
	}
	currentLang = 'de';
	fetchAndRender(currentLang);
});

controls.langEnBtn?.addEventListener('click', () => {
	if (currentLang === 'en') {
		console.log('Language is already English');
		return;
	}
	currentLang = 'en';
	fetchAndRender(currentLang);
});

// initial load
fetchAndRender(currentLang);

// -----------------------
// Reorder panel behavior
// -----------------------
const REORDER_STORAGE_PREFIX = 'lebenslauf-sections-order-';

/** @param {'de'|'en'} lang */
function getStorageKeyForLang(lang) {
	return `${REORDER_STORAGE_PREFIX}${lang}`;
}

/** Build the reorder list UI from the current #sections DOM */
function buildReorderList() {
	const list = /** @type {HTMLElement | null} */ (
		document.getElementById('reorder-list')
	);
	const sectionsContainer = /** @type {HTMLElement | null} */ (
		document.getElementById('sections')
	);
	if (!list || !sectionsContainer) return;
	list.innerHTML = '';
	Array.from(sectionsContainer.children).forEach((secRaw, idx) => {
		const sec = /** @type {HTMLElement} */ (secRaw);
		const heading = /** @type {HTMLElement | null} */ (sec.querySelector('h2'));
		const title =
			sec.dataset.title ||
			(heading && heading.textContent) ||
			`Section ${idx + 1}`;
		// give each section a stable dataset.sid if not present
		if (!sec.dataset.sid) sec.dataset.sid = sec.id || `section-${idx}`;
		// use myCreateElement to create list item
		const li = myCreateElement(
			'li',
			['py-1', 'px-2', 'border-b', 'cursor-move'],
			String(title).trim(),
			list,
			undefined
		);
		li.dataset.sid = sec.dataset.sid;

		addDnD(li);
	});
}

/** @param {string[]} order */
function applyOrderToDOM(order) {
	const container = /** @type {HTMLElement | null} */ (
		document.getElementById('sections')
	);
	if (!container) return;
	const map = new Map();
	Array.from(container.children).forEach((childRaw, i) => {
		const child = /** @type {HTMLElement} */ (childRaw);
		if (!child.dataset.sid) child.dataset.sid = child.id || `section-${i}`;
		map.set(child.dataset.sid, child);
	});
	order.forEach((sid) => {
		const node = map.get(sid);
		if (node) container.appendChild(node);
	});
}

/** @param {'de'|'en'} lang */
function applySavedOrder(lang) {
	try {
		const raw = localStorage.getItem(getStorageKeyForLang(lang));
		if (!raw) return;
		const order = JSON.parse(raw);
		if (!Array.isArray(order)) return;
		applyOrderToDOM(order);
	} catch (e) {
		console.warn('Could not apply saved order', e);
	}
}

// Drag & drop helpers for list items
/** @param {HTMLElement} item */
function addDnD(item) {
	let dragSrc = /** @type {HTMLElement | null} */ (null);
	item.setAttribute('draggable', 'true');
	item.addEventListener(
		'dragstart',
		/** @param {DragEvent} e */ function (e) {
			dragSrc = /** @type {HTMLElement} */ (this);
			if (!e.dataTransfer) return;
			e.dataTransfer.effectAllowed = 'move';
			const sid = this.dataset.sid ?? '';
			e.dataTransfer.setData('text/plain', sid);
			this.classList.add('opacity-50');
		}
	);
	item.addEventListener(
		'dragend',
		/** @this {HTMLElement} */ function () {
			this.classList.remove('opacity-50');
		}
	);
	item.addEventListener(
		'dragover',
		/** @param {DragEvent} e */ function (e) {
			e.preventDefault();
		}
	);
	item.addEventListener(
		'drop',
		/** @param {DragEvent} e */ function (e) {
			e.stopPropagation();
			if (!e.dataTransfer) return;
			const srcSid = e.dataTransfer.getData('text/plain');
			if (!srcSid) return;
			const list = /** @type {HTMLElement} */ (this.parentElement);
			const srcEl = /** @type {HTMLElement | null} */ (
				list.querySelector(`[data-sid="${srcSid}"]`)
			);
			if (!srcEl || srcEl === this) return;
			list.insertBefore(srcEl, this);
		}
	);
}

// Wire reorder controls once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	const toggle = document.getElementById('reorder-toggle');
	const panel = document.getElementById('reorder-panel');
	const saveBtn = document.getElementById('save-order');
	const cancelBtn = document.getElementById('cancel-order');
	const list = document.getElementById('reorder-list');
	if (!toggle || !panel || !list) return;

	toggle.addEventListener('click', () => {
		if (panel.classList.contains('hidden')) {
			buildReorderList();
			panel.classList.remove('hidden');
		} else {
			panel.classList.add('hidden');
		}
	});

	saveBtn?.addEventListener('click', () => {
		const order = /** @type {string[]} */ (
			Array.from(list.children)
				.map((li) => /** @type {HTMLElement} */ (li).dataset.sid)
				.filter(Boolean)
		);
		localStorage.setItem(
			getStorageKeyForLang(currentLang),
			JSON.stringify(order)
		);
		applyOrderToDOM(order);
		panel.classList.add('hidden');
	});

	cancelBtn?.addEventListener('click', () => {
		buildReorderList();
		panel.classList.add('hidden');
	});
});

// No reassignment of fetchAndRender. applySavedOrder is already called inside fetchAndRender
