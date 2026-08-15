const gradients = [
	'bg-gradient-to-br from-violet/50 via-pink/25 to-transparent',
	'bg-gradient-to-tr from-cyan/40 via-violet/30 to-transparent',
	'bg-gradient-to-bl from-pink/45 via-amber/20 to-transparent',
	'bg-gradient-to-r from-amber/35 via-cyan/25 to-transparent',
	'bg-gradient-to-t from-violet/40 via-cyan/30 to-pink/15'
];

export function getProjectGradient(id: string): string {
	let hash = 0;
	for (let i = 0; i < id.length; i++) {
		hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
	}
	return gradients[hash % gradients.length];
}
