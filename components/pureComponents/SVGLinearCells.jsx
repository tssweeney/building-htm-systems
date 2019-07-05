import React from 'react'
import PropTypes from 'prop-types'

import { linearColors } from '../diagrams/helpers'

/**
 * Creates a horizontal stack of "cells". The CellTypes array denotes groups - 
 * indexes with the same value will have the same color.
 */
function SVGLinearCells(props) {
	const {
		cellTypes = [0, 0, 2, 3, 4],
		fillColors = null,
		stroke = 'black',
		fillOpacity = 1.0,
		width = '100%',
		height = '100%',
		...restRectProps
	} = props

	const cellWidth = 1 / cellTypes.length

	let colors = fillColors
	if (!colors) {
		colors = linearColors(Math.max(...cellTypes))
	}

	return (
		<svg width={width} height={height}>
			{cellTypes.map((cellType, ndx) => {
				return (
					<rect
						key={ndx}
						width={`${100 * cellWidth}%`}
						height="100%"
						y={0}
						x={`${100 * cellWidth * ndx}%`}
						fill={colors[cellType]}
						stroke={stroke}
						fillOpacity={fillOpacity}
						{...restRectProps}
					/>
				)
			})}
		</svg>
	)
}


SVGLinearCells.propTypes = {
	cellTypes: PropTypes.arrayOf(PropTypes.number),
	fillColors: PropTypes.arrayOf(PropTypes.string),
	stroke: PropTypes.string,
	fillOpacity: PropTypes.number,
	width: PropTypes.string,
	height: PropTypes.string,
}

export default SVGLinearCells