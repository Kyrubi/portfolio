import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function heroIntro(container: HTMLElement) {
	const targets = container.querySelectorAll<HTMLElement>('[data-reveal]');
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReducedMotion) {
		gsap.set(targets, { opacity: 1, y: 0 });
		return;
	}

	gsap.set(targets, { opacity: 0, y: 24 });
	gsap.to(targets, {
		opacity: 1,
		y: 0,
		duration: 0.8,
		ease: 'power3.out',
		stagger: 0.1,
		delay: 0.2
	});
}

export function scrollReveal(root: ParentNode = document) {
	const targets = root.querySelectorAll<HTMLElement>('[data-scroll-reveal]');
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReducedMotion) {
		gsap.set(targets, { opacity: 1, y: 0 });
		return;
	}

	targets.forEach((target, index) => {
		gsap.fromTo(
			target,
			{ opacity: 0, y: 32 },
			{
				opacity: 1,
				y: 0,
				duration: 0.7,
				ease: 'power3.out',
				delay: (index % 3) * 0.06,
				scrollTrigger: {
					trigger: target,
					start: 'top 85%',
					toggleActions: 'play none none reverse'
				}
			}
		);
	});
}
