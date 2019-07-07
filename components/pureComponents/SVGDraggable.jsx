import React from 'react'
import PropTypes from 'prop-types'

class SVGDraggable extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			dragging: false,
			amount: 0,
			currentTimeout: false,
		}

		this.onMouseDown = this.onMouseDown.bind(this)
		this.onMouseUp = this.onMouseUp.bind(this)
		this.onMouseMove = this.onMouseMove.bind(this)
		this.sendUpdate = this.sendUpdate.bind(this)
		this.queueUpdate = this.queueUpdate.bind(this)
	}

	componentDidMount() {
		document.body.addEventListener('mouseup', this.onMouseUp)
		document.body.addEventListener('mousemove', this.onMouseMove)
	}

	componentWillUnmount() {
		document.body.removeEventListener('mouseup', this.onMouseUp)
		document.body.removeEventListener('mousemove', this.onMouseMove)
	}

	sendUpdate() {
		this.props.onUpdate(this.state.amount)
		this.setState({
			currentTimeout: null,
			amount: 0,
		})
	}

	queueUpdate(value) {
		const newAmount = this.state.amount + value
		if (!this.state.currentTimeout) {
			this.setState({
				amount: newAmount,
				currentTimeout: setTimeout(this.sendUpdate, 50),
			})
		} else {
			this.setState({ amount: newAmount })
		}

	}

	onMouseDown(e) {
		this.setState({
			dragging: true
		})
	}

	onMouseMove(e) {
		if (this.state.dragging) {
			this.queueUpdate(e.movementX)
		}
	}

	onMouseUp(e) {
		this.setState({
			dragging: false
		})
	}

	render() {
		const {
			children
		} = this.props

		return (
			<svg onMouseDown={this.onMouseDown} pointerEvents={this.props.pointerEvents || 'fill'}>
				{children}
			</svg>
		)
	}
}

SVGDraggable.propTypes = {
	onUpdate: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
	pointerEvents: PropTypes.oneOf([
		'auto',
		'none',
		'visiblePainted',
		'visibleFill',
		'visibleStroke',
		'visible',
		'painted',
		'fill',
		'stroke',
		'all'
	]),
}

export default SVGDraggable