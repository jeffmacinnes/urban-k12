/*
This action triggers a custom tooltip component to appear when a given element is hovered. You supply
the component (and any number of props) as input parameters to the action. 

This code will place a tooltip in a fixed location next to the hovered element. If you want
the tooltip to follow the cursor, please see tooltip_followCursor.js

Usage:

<div
  use:tooltip={{
    component: MyTooltip,
    props: {
      title: 'My Custom Tooltip'
    }
  }}
> Hover me </div>

The action will handle the positioning of the tooltip using Popper.js. Set the popper 
options in here to change where and how the tooltip gets positioned. 

At minimum, the custom tooltip component MUST have the following features (note the id attribute of wrapper):

<div id="tooltip"">
	TOOL TIP CONTENT
</div>

*/

import { createPopper } from '@popperjs/core';

export function tooltip(element, params = {}) {
	let tooltipRef;
	let popperRef;
	let tooltipComponent = params.component;
	let tooltipProps = params.props;

	element.addEventListener('mouseover', mouseOver);
	element.addEventListener('mouseleave', mouseLeave);

	function mouseOver(event) {
		tooltipRef = new tooltipComponent({
			props: {
				...tooltipProps
			},
			target: document.body
		});

		let tooltip = document.querySelector('#tooltip');
		tooltip.setAttribute('data-show', '');

		popperRef = createPopper(element, tooltip, {
			placement: tooltipProps.placement || 'top',
			strategy: 'fixed',
			modifiers: [
				{
					name: 'offset',
					options: {
						offset: [0, 8]
					}
				}
			]
		});
	}

	function mouseLeave() {
		let tooltip = document.querySelector('#tooltip');
		tooltip.removeAttribute('data-show');

		if (popperRef) {
			popperRef.destroy();
			popperRef = null;
		}

		tooltipRef.$destroy();
	}

	return {
		update(params) {
			// will run any time any of the input params change. Make it reactive
			tooltipProps = params.props;

			// clear old event listeners
			element.removeEventListener('mouseover', mouseOver);
			element.removeEventListener('mouseleave', mouseLeave);

			// add updated ones
			element.addEventListener('mouseover', mouseOver);
			element.addEventListener('mouseleave', mouseLeave);
		},

		destroy() {
			element.removeEventListener('mouseover', mouseOver);
			element.removeEventListener('mouseleave', mouseLeave);
		}
	};
}
