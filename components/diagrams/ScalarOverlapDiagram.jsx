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

	constructor(props) {
		super(props)
		this.state = {
			lastDraggedType: 1
		}

		this.dragged = this.dragged.bind(this)
		this.resetEncoder = this.resetEncoder.bind(this)
	}

	dragged(key, amount) {
		const {
			valueA, valueB, minValue, maxValue, onUpdate
		} = this.props

		const currVal = key === 'valueA' ? valueA : valueB
		const width = this.svgRef && this.svgRef.current && this.svgRef.current.width.baseVal.value
		const scalar = 10 / (width ? width : 500)

		this.setState({
			lastDraggedType: key === 'valueA' ? 1 : 2
		})

		if (onUpdate) {
			onUpdate({
				[key]: Math.max(Math.min(currVal + amount * scalar, maxValue), minValue)
			})
		}
	}

	resetEncoder() {
		const {
			minValue, maxValue, n, w, valueA, valueB
		} = this.props
		const encoder = new ScalarEncoder({ min: minValue, max: maxValue, w, n })
		const aValueDisplay = valueA.toFixed(1)
		const bValueDisplay = valueB.toFixed(1)

		const encodingA = encoder.encode(aValueDisplay)
		const encodingB = encoder.encode(bValueDisplay)

		return {
			aValueDisplay,
			encodingA,
			bValueDisplay,
			encodingB
		}
	}

	render() {
		const self = this
		const {
			n, id, valueA, valueB
		} = this.props

		const {
			aValueDisplay,
			encodingA,
			bValueDisplay,
			encodingB
		} = this.resetEncoder()

		const aLeftPct = encodingA.indexOf(1) / n
		const bLeftPct = encodingB.indexOf(1) / n
		const aPadPct = encodingA.filter(item => item == 1).length / n
		const bPadPct = encodingB.filter(item => item == 1).length / n

		// console.log(encodingA)
		// console.log(encodingA.indexOf(1), encodingA.filter(item => item == 1).length, n, aLeftPct, bLeftPct, aPadPct, bPadPct)

		const cells = []
		for (let i = 0; i < n; i++) {
			cells.push(encodingA[i] + encodingB[i] * 2)
		}

		const aConfig = {
			stateKey: 'valueA',
			value: valueA,
			valueDisplay: aValueDisplay,
			leftPct: aLeftPct,
			padPct: aPadPct,
			color: aColor
		}

		const bConfig = {
			stateKey: 'valueB',
			value: valueB,
			valueDisplay: bValueDisplay,
			leftPct: bLeftPct,
			padPct: bPadPct,
			color: bColor
		}

		const aBracket = (
			<SVGDraggable key="aBracket" onUpdate={(amount) => {
				this.dragged('valueA', amount)
			}}>
				<SVGBracketLabel
					text={`${aConfig.valueDisplay}`}
					leftPct={aConfig.leftPct}
					rightPct={aConfig.leftPct + aConfig.padPct}
					y='50%'
					height='50%'
					stroke={aConfig.color}
				/>
			</SVGDraggable>
		)

		const bBracket = (
			<SVGDraggable key="bBracket" onUpdate={(amount) => {
				this.dragged('valueB', amount)
			}}>
				<SVGBracketLabel
					text={`${bConfig.valueDisplay}`}
					leftPct={bConfig.leftPct}
					rightPct={bConfig.leftPct + bConfig.padPct}
					y='50%'
					height='50%'
					stroke={bConfig.color}
				/>
			</SVGDraggable>
		)

		return (
			<svg id={id}
				ref={this.svgRef}
				height={100}
				width="100%"
				style={debugStyle}
			>
				<SVGLinearCells
					height='50%'
					cellTypes={cells}
					fillColors={[offColor, aColor, bColor, bothColor]}
					onDrag={({ cellType, ndx, amount }) => {
						if (cellType == 1) {
							this.dragged('valueA', amount)
						} else if (cellType == 2) {
							this.dragged('valueB', amount)
						} else if (cellType == 3) {
							if (self.state.lastDraggedType == 1) {
								this.dragged('valueA', amount)
							} else if (self.state.lastDraggedType == 2) {
								this.dragged('valueB', amount)
							}
						}
					}}
				/>
				{this.state.lastDraggedType == 1 ? (
					<React.Fragment>
						{bBracket}
						{aBracket}
					</React.Fragment>
				) : (
						<React.Fragment>
							{aBracket}
							{bBracket}
						</React.Fragment>
					)}

			</svg >
		)
	}
}

ScalarOverlap.propTypes = {
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
