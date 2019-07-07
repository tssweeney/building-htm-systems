import React from 'react'
import PropTypes from 'prop-types'

import { linearColors } from '../diagrams/helpers'
import SVGDraggable from './SVGDraggable';

/**
 * Creates a horizontal stack of "cells". The CellTypes array denotes groups - 
 * indexes with the same value will have the same color.
 */
class SVGLinearCells extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			activeDragNdx: -1,
			activeDragType: -1
		}

		this.onDragHandler = this.onDragHandler.bind(this)
	}

	onDragHandler({ cellType, ndx, amount }) {
		if (this.props.onDrag) {
			let targetNdx = ndx
			let targetType = cellType
			if (this.state.activeDragNdx == ndx) {
				targetNdx = this.state.activeDragNdx
				targetType = this.state.activeDragType
			}
			this.setState({
				activeDragNdx: targetNdx,
				activeDragType: targetType
			})
			this.props.onDrag({ cellType: targetType, ndx: targetNdx, amount })
		}
	}

	render() {
		const self = this
		const {
			cellTypes = [0, 0, 2, 3, 4],
			fillColors = null,
			stroke = 'black',
			fillOpacity = 1.0,
			width = '100%',
			height = '100%',
			onDrag = null,
			...restRectProps
		} = this.props

		const cellWidth = 1 / cellTypes.length

		let colors = fillColors
		if (!colors) {
			colors = linearColors(Math.max(...cellTypes))
		}

		return (
			<svg width={width} height={height}>
				{cellTypes.map((cellType, ndx) => {
					const innerRect = <rect
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

					if (onDrag) {
						return (
							<SVGDraggable key={ndx} onUpdate={(amount) => {
								self.onDragHandler({ cellType, ndx, amount })
							}}>
								{innerRect}
							</SVGDraggable>
						)
					}
					return innerRect
				})}
			</svg>
		)
	}
}


SVGLinearCells.propTypes = {
	cellTypes: PropTypes.arrayOf(PropTypes.number),
	fillColors: PropTypes.arrayOf(PropTypes.string),
	stroke: PropTypes.string,
	fillOpacity: PropTypes.number,
	width: PropTypes.string,
	height: PropTypes.string,
	onDrag: PropTypes.func,
}

export default SVGLinearCells