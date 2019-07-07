import ScalarOverlap from './ScalarOverlapDiagram'
import PropTypes from 'prop-types'
import simplehtm from 'simplehtm'

const CategoryEncoder = simplehtm.encoders.CategoryEncoder

class DiscreteEncodingDiagram extends ScalarOverlap {

	// resetEncoder() {
	// 	const {
	// 		categoryLength, w
	// 	} = this.props
	// 	this.encoder = new CategoryEncoder({
	// 		w: w, categories: [...Array(categoryLength).keys()]
	// 	})
	// 	this.encodingA = this.encoder.encode(this.valueA)
	// 	this.encodingB = this.encoder.encode(this.valueB)
	// }

	resetEncoder() {
		const {
			categoryLength, w, valueA, valueB
		} = this.props

		const encoder = new CategoryEncoder({
			w: w, categories: [...Array(categoryLength).keys()]
		})
		const aValueDisplay = valueA.toFixed(0)
		const bValueDisplay = valueB.toFixed(0)

		const encodingA = encoder.encode(parseInt(aValueDisplay))
		const encodingB = encoder.encode(parseInt(bValueDisplay))

		return {
			aValueDisplay,
			encodingA,
			bValueDisplay,
			encodingB
		}
	}

}

DiscreteEncodingDiagram.propTypes = {
	w: PropTypes.number.isRequired,
	categoryLength: PropTypes.number.isRequired,
}

export default DiscreteEncodingDiagram
