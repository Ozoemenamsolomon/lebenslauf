// @ts-check
/**
 * Small helper utilities extracted from main.js
 */

/**
 * Resolve the JSON path for a language with a fallback to currentLang.
 * @param {'de'|'en'|undefined} lang
 * @param {{[k:string]:string}} langPathDict
 * @param {'de'|'en'} currentLang
 */
export function jsonPathForLang(lang, langPathDict, currentLang) {
	const effective = lang || currentLang;
	return langPathDict[effective];
}

/**
 * Clear the main sections container.
 * Accept a generic Element or null (querySelector returns Element | null).
 * @param {Element | null} container
 */
export function clearSections(container) {
	if (!container) return;
	container.innerHTML = '';
}

/**
 * Update the visual active state of the language buttons.
 * @param {{langDeBtn: HTMLButtonElement | null, langEnBtn: HTMLButtonElement | null}} controls
 * @param {'de'|'en'} currentLang
 */
export function setActiveLangButton(controls, currentLang) {
	if (!controls?.langDeBtn || !controls?.langEnBtn) return;
	controls.langDeBtn.classList.toggle('bg-gray-200', currentLang === 'de');
	controls.langDeBtn.classList.toggle('bg-white', currentLang !== 'de');
	controls.langEnBtn.classList.toggle('bg-gray-200', currentLang === 'en');
	controls.langEnBtn.classList.toggle('bg-white', currentLang !== 'en');
}
