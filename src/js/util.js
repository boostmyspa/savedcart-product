export function generateUID() {
	return Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
}

export function isMobile() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function filterPrice(value) {
	return value.toFixed(2);
}
