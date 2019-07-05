import * as d3 from 'd3'

export const precisionRound = (number, precision) => {
	const factor = Math.pow(10, precision)
	return Math.round(number * factor) / factor
}

export const lineFunction = d3.line()
	.x(function (d) { return d.x })
	.y(function (d) { return d.y })
	.curve(d3.curveCatmullRom.alpha(0.5))

/**
 * This function generates and array of hex color codes which are evenly spaced
 * apart. This is useful if we need to color a lot of items but don't want to
 * hand-craft the colors. Currently, this is consumed ny the SVGLinearCells
 * React Component in order to color different cells.
 * @param {number} colorCount The total number of colors to support
 */
export function linearColors(colorCount) {
	const max = 16 * 16 * 16 - 1
	const min = 0
	const unit = Math.floor((max - min) / (colorCount + 50))
	const values = []
	for (var i = 0; i < colorCount + 1; i++) {
		const val = max - i * unit
		let hexString = val.toString(16)
		if (val < 16) {
			hexString = '00' + hexString
		} else if (val < 16 * 16) {
			hexString = '0' + hexString
		}

		values.push(`#${hexString}`)
	}

	return values
}