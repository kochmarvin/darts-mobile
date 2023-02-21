const plugin = require('tailwindcss/plugin');

// Rotate X utilities
const rotateX = plugin(function ({ addUtilities }) {
	addUtilities({
		'.rotate-x-0': {
			transform: 'rotateX(0deg)'
		},
		'.rotate-x-20': {
			transform: 'rotateX(20deg)'
		},
		'.rotate-x-40': {
			transform: 'rotateX(40deg)'
		},
		'.rotate-x-60': {
			transform: 'rotateX(60deg)'
		},
		'.rotate-x-80': {
			transform: 'rotateX(80deg)'
		},
		'.rotate-x-180': {
			transform: 'rotateX(180deg)'
		},
		'.rotate-x-heads': {
			transform: 'rotateX(2160deg)'
		},
		'.rotate-x-tails': {
			transform: 'rotateX(1980deg)'
		}
	});
});

const backfaceVisibility = plugin(function ({ addUtilities }) {
	addUtilities({
		'.backface-visible': {
			'backface-visibility': 'visible',
			'-moz-backface-visibility': 'visible',
			'-webkit-backface-visibility': 'visible',
			'-ms-backface-visibility': 'visible'
		},
		'.backface-hidden': {
			'backface-visibility': 'hidden',
			'-moz-backface-visibility': 'hidden',
			'-webkit-backface-visibility': 'hidden',
			'-ms-backface-visibility': 'hidden'
		}
	});
});

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,ts}'],
	theme: {
		extend: {
			fontFamily: {
				code: ['Roboto Mono']
			},
			dropShadow: {
				DEFAULT: '0px 10px 20px rgba(0, 0, 0, 0.25)'
			},
			boxShadow: {
				'input-field': '0px 0px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08)'
			},
			colors: {
				primary: {
					lighter: '#8253D7',
					light: '#6A3CBC',
					tint: '#333333',
					DEFAULT: '#0085FF'
				},
				secondary: {
					lighter: '#F8B063',
					light: '#FFA352',
					tint: '#DDDDDD',
					DEFAULT: '#F78F1E'
				},
				white: '#ffffff',
				black: '#333333',
				grey: '#787878'
			},

			fontSize: {
				'body-lg': '1.2rem',
				'body-sm': '0.833rem',
				body: '1rem',
				'heading-1': '3.583rem',
				'heading-2': '2.986rem',
				'heading-3': '2.488rem',
				'heading-4': '2.074rem',
				'heading-5': '1.728rem',
				'heading-6': '1.44rem'
			}
		}
	},
	plugins: [rotateX, backfaceVisibility],
	safelist: [
		'text-red-500',
		'text-cyan-500',
		'text-green-500',
		'fill-black',
		'fill-white',
		'fill-primary',
		'fill-secondary',
		'bg-black',
		'bg-primary',
		'bg-secondary',
		'border-black',
		'border-primary',
		'border-secondary',
		'col-span-1',
		'col-span-10',
		'col-span-11',
		'col-span-12',
		'col-span-2',
		'col-span-3',
		'col-span-4',
		'col-span-5',
		'col-span-6',
		'col-span-7',
		'col-span-8',
		'col-span-9',
		'col-start-1',
		'col-start-10',
		'col-start-11',
		'col-start-12',
		'col-start-2',
		'col-start-3',
		'col-start-4',
		'col-start-5',
		'col-start-6',
		'col-start-7',
		'col-start-8',
		'col-start-9',
		'font-bold',
		'font-light',
		'font-medium',
		'font-normal',
		'font-semibold',
		'md:font-bold',
		'md:font-light',
		'md:font-medium',
		'md:font-normal',
		'md:font-semibold',
		'lg:font-bold',
		'lg:font-light',
		'lg:font-medium',
		'lg:font-normal',
		'lg:font-semibold',
		'hover:bg-black',
		'hover:bg-primary',
		'hover:bg-primary-tint',
		'hover:bg-secondary',
		'hover:bg-secondary-tint',
		'hover:border-0',
		'hover:border-primary-tint',
		'hover:border-secondary-tint',
		'leading-10',
		'leading-4',
		'leading-6',
		'leading-8',
		'md:leading-10',
		'md:leading-4',
		'md:leading-6',
		'md:leading-8',
		'mlg:leading-10',
		'mlg:leading-4',
		'mlg:leading-6',
		'mlg:leading-8',
		'lg:col-span-1',
		'lg:col-span-10',
		'lg:col-span-11',
		'lg:col-span-12',
		'lg:col-span-2',
		'lg:col-span-3',
		'lg:col-span-4',
		'lg:col-span-5',
		'lg:col-span-6',
		'lg:col-span-7',
		'lg:col-span-8',
		'lg:col-span-9',
		'lg:col-start-1',
		'lg:col-start-10',
		'lg:col-start-11',
		'lg:col-start-12',
		'lg:col-start-2',
		'lg:col-start-3',
		'lg:col-start-4',
		'lg:col-start-5',
		'lg:col-start-6',
		'lg:col-start-7',
		'lg:col-start-8',
		'lg:col-start-9',
		'md:col-span-1',
		'md:col-span-10',
		'md:col-span-11',
		'md:col-span-12',
		'md:col-span-2',
		'md:col-span-3',
		'md:col-span-4',
		'md:col-span-5',
		'md:col-span-6',
		'md:col-span-7',
		'md:col-span-8',
		'md:col-span-9',
		'md:col-start-1',
		'md:col-start-10',
		'md:col-start-11',
		'md:col-start-12',
		'md:col-start-2',
		'md:col-start-3',
		'md:col-start-4',
		'md:col-start-5',
		'md:col-start-6',
		'md:col-start-7',
		'md:col-start-8',
		'md:col-start-9',
		'sm:col-span-1',
		'sm:col-span-10',
		'sm:col-span-11',
		'sm:col-span-12',
		'sm:col-span-2',
		'sm:col-span-3',
		'sm:col-span-4',
		'sm:col-span-5',
		'sm:col-span-6',
		'sm:col-span-7',
		'sm:col-span-8',
		'sm:col-span-9',
		'sm:col-start-1',
		'sm:col-start-10',
		'sm:col-start-11',
		'sm:col-start-12',
		'sm:col-start-2',
		'sm:col-start-3',
		'sm:col-start-4',
		'sm:col-start-5',
		'sm:col-start-6',
		'sm:col-start-7',
		'sm:col-start-8',
		'sm:col-start-9',
		'text-black',
		'text-body',
		'text-body-lg',
		'text-body-sm',
		'text-heading-1',
		'text-heading-2',
		'text-heading-3',
		'text-heading-4',
		'text-heading-5',
		'text-heading-6',
		'md:text-body',
		'md:text-body-lg',
		'md:text-body-sm',
		'md:text-heading-1',
		'md:text-heading-2',
		'md:text-heading-3',
		'md:text-heading-4',
		'md:text-heading-5',
		'md:text-heading-6',
		'lg:text-body',
		'lg:text-body-lg',
		'lg:text-body-sm',
		'lg:text-heading-1',
		'lg:text-heading-2',
		'lg:text-heading-3',
		'lg:text-heading-4',
		'lg:text-heading-5',
		'lg:text-heading-6',
		'text-primary',
		'text-secondary',
		'text-white',
		'xl:col-span-1',
		'xl:col-span-10',
		'xl:col-span-11',
		'xl:col-span-12',
		'xl:col-span-2',
		'xl:col-span-3',
		'xl:col-span-4',
		'xl:col-span-5',
		'xl:col-span-6',
		'xl:col-span-7',
		'xl:col-span-8',
		'xl:col-span-9',
		'xl:col-start-1',
		'xl:col-start-10',
		'xl:col-start-11',
		'xl:col-start-12',
		'xl:col-start-2',
		'xl:col-start-3',
		'xl:col-start-4',
		'xl:col-start-5',
		'xl:col-start-6',
		'xl:col-start-7',
		'xl:col-start-8',
		'xl:col-start-9'
	]
};
