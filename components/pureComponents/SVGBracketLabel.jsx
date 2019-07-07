import React from 'react'
import PropTypes from 'prop-types'

/**
 * Creates a bracket-style label typically used to show ranges of data
 */
function SVGBracketLabel(props) {
	const {
		text = '',
		leftPct = 0.1,
		rightPct = 0.9,
		stroke = 'black',
		width = '100%',
		height = '100%',
		x = '0%',
		y = '0%',
	} = props

	let targetPointX = (leftPct + rightPct) / 2
	if (targetPointX < 0.1) {
		targetPointX = 0.1
	} else if (targetPointX > 0.9) {
		targetPointX = 0.9
	}
	const targetPointY = 0.6

	const targetPointXStr = `${100 * targetPointX}%`
	const targetPointYStr = `${100 * targetPointY}%`

	const leftXStr = `${100 * leftPct}%`
	const rightXStr = `${100 * rightPct}%`

	return (
		<g>
			<svg width={width} height={height} x={x} y={y} preserveAspectRatio="none" viewBox="0 0 1 1">
				<polygon points={`${leftPct} 0 ${targetPointX * 0.99} 1 ${targetPointX / 0.99} 1 ${rightPct} 0`} fill="black" opacity="0.0" />
			</svg >
			<svg width={width} height={height} x={x} y={y} pointerEvents="none">
				<text x={targetPointXStr} y={targetPointYStr} textAnchor='middle' alignmentBaseline='text-before-edge' pointerEvents="none">{text}</text>
				<line x1={leftXStr} y1='0%' x2={targetPointXStr} y2={targetPointYStr} stroke={stroke} />
				<line x1={rightXStr} y1='0%' x2={targetPointXStr} y2={targetPointYStr} stroke={stroke} />
			</svg >
		</g>
	)
}

SVGBracketLabel.propTypes = {
	text: PropTypes.string,
	leftPct: PropTypes.number,
	rightPct: PropTypes.number,
	stroke: PropTypes.string,
	width: PropTypes.string,
	height: PropTypes.string,
	x: PropTypes.string,
	y: PropTypes.string,
}

export default SVGBracketLabel