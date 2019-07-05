import React from 'react'
import PropTypes from 'prop-types'
import simplehtm from 'simplehtm'
import SVGBracketLabel from '../pureComponents/SVGBracketLabel'
import SVGLinearCells from '../pureComponents/SVGLinearCells'
import SVGDraggable from '../pureComponents/SVGDraggable'

const ScalarEncoder = simplehtm.encoders.ScalarEncoder
const offColor = 'white'
const aColor = 'blue'
const bColor = 'red'
const bothColor = 'purple'
const debugStyle = {
	border: 'solid red 1px'
}

class ScalarOverlap extends React.Component {
	svgRef = React.createRef()

	render() {
		const selfRef = React.createRef()
		const {
			minValue, maxValue, n, w, id, valueA, valueB, onUpdate
		} = this.props

		const valueADisplay = valueA.toFixed(1)
		const valueBDisplay = valueB.toFixed(1)

		const encoder = new ScalarEncoder({ min: minValue, max: maxValue, w, n })
		const encodingA = encoder.encode(valueADisplay)
		const encodingB = encoder.encode(valueBDisplay)

		const aLeftPct = encodingA.indexOf(1) / n
		const bLeftPct = encodingB.indexOf(1) / n
		const aPadPct = encodingA.filter(item => item == 1).length / n
		const bPadPct = encodingB.filter(item => item == 1).length / n

		const cells = []
		for (let i = 0; i < n; i++) {
			cells.push(encodingA[i] + encodingB[i] * 2)
		}

		const width = this.svgRef && this.svgRef.current && this.svgRef.current.width.baseVal.value
		const scalar = 10 / (width ? width : 500)

		return (
			<svg id={id}
				ref={this.svgRef}
				height={100}
				width="100%"
				ref={this.svgRef}
				style={debugStyle}
			>
				<SVGLinearCells
					height='50%'
					cellTypes={cells}
					fillColors={[offColor, aColor, bColor, bothColor]}
				/>

				<SVGDraggable onUpdate={(amount) => {
					onUpdate({
						valueA: Math.max(Math.min(valueA + amount * scalar, maxValue), minValue)
					})
				}}>
					<SVGBracketLabel
						text={`${valueADisplay}`}
						leftPct={aLeftPct}
						rightPct={aLeftPct + aPadPct}
						y='50%'
						height='50%'
						stroke={aColor}
					/>
				</SVGDraggable>
				<SVGDraggable onUpdate={(amount) => {
					onUpdate({
						valueB: Math.max(Math.min(valueB + amount * scalar, maxValue), minValue)
					})
				}}>
					<SVGBracketLabel
						text={`${valueBDisplay}`}
						leftPct={bLeftPct}
						rightPct={bLeftPct + bPadPct}
						y='50%'
						height='50%'
						stroke={bColor}
					/>
				</SVGDraggable>
			</svg >
		)
	}
}

ScalarOverlap.propTypes = {
	diagramWidth: PropTypes.number.isRequired,
	id: PropTypes.string.isRequired,
	maxValue: PropTypes.number.isRequired,
	minValue: PropTypes.number.isRequired,
	n: PropTypes.number.isRequired,
	onUpdate: PropTypes.func,
	valueA: PropTypes.number.isRequired,
	valueB: PropTypes.number.isRequired,
	w: PropTypes.number.isRequired,
}

export default ScalarOverlap
