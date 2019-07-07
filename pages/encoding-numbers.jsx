import React from 'react'
import Layout from '../components/Layout'
import NumberValue from '../components/input/NumberInput'
import ToggleButton from '../components/input/ToggleButton'
import SimpleScalarEncoder from '../components/diagrams/SimpleScalarEncoder'
import CyclicScalarEncoder from '../components/diagrams/CyclicScalarEncoder'
import DiscreteEncodingDiagram from '../components/diagrams/DiscreteEncodingDiagram'
import CodeSyntax from '../components/CodeSyntax'
import examples from '../examples/encoding-numbers'
import ScalarOverlap from '../components/diagrams/ScalarOverlapDiagram';


class EncodingNumbers extends React.Component {

	cyclicEncoderStates = ['line', 'circle']

	state = {
		value: 50,
		max: 100,
		min: 0,
		resolution: 1,
		n: 100,
		w: 30,
		cyclicEncoderState: this.cyclicEncoderStates[0],
		valueA: 4,
		valueB: 5,
		valueC: 6,
		categoryLength: 10,
	}

	animationHandle = undefined

	/**
	 * This allows triggers in the page to animate page state value while 
	 * children update.
	 */
	animateValue(fromValue, toValue) {
		return () => {
			clearInterval(this.animationHandle)
			let cut = 0
			let diff = toValue - fromValue
			const cuts = 16
			const speed = 100
			this.animationHandle = setInterval(() => {
				const ratio = cut / cuts
				const current = Math.round(fromValue + (diff * ratio))
				this.setState({ value: current })
				if (cut++ >= cuts) {
					clearInterval(this.animationHandle)
				}
			}, speed)
		}
	}

	render() {
		const ParameterMax = <NumberValue
			name="param-max" low={30} high={200}
			value={this.state.max}
			onUpdate={value => this.setState({ max: Number(value) })}
		/>
		const ParameterMin = <NumberValue
			name="param-min" low={-50} high={50}
			value={this.state.min}
			onUpdate={value => this.setState({ min: Number(value) })}
		/>
		const ParameterN = <NumberValue
			name="param-n" low={30} high={200}
			value={this.state.n}
			onUpdate={value => this.setState({ n: Number(value) })}
		/>
		const ParameterW = <NumberValue
			name="param-w" low={1} high={60}
			value={this.state.w}
			onUpdate={value => this.setState({ w: Number(value) })}
		/>
		const ParameterRes = <NumberValue
			name="param-res" low={0.1} high={3.0} step={0.1}
			value={this.state.resolution}
			onUpdate={value => this.setState({ resolution: Number(value) })}
		/>
		const ParameterCategoryLength = <NumberValue
			name="param-categories" low={5} high={50}
			value={this.state.categoryLength}
			onUpdate={value => this.setState({ categoryLength: Number(value) })}
		/>
		const ToggleCyclicEncoder = <ToggleButton
			options={this.cyclicEncoderStates}
			value={this.state.cyclicEncoderState}
			onChange={(newValue) => this.setState({ cyclicEncoderState: newValue })}
		/>

		return (
			<div>

				<Layout>

					<p>One of the most common data types to encode is <em>numbers</em>. This could be a numeric value of any kind – <em>82 degrees</em>, <em>$145.00</em> in sales, <em>34%</em> of capacity, etc. The sections below describe encoders for a single numeric value. In the sections below, we will introduce several strategies for encoding scalar values into binary arrays.</p>

					<h2 id="a-simple-encoder-for-numbers">
						A Simple Encoder for Numbers<a href="#a-simple-encoder-for-numbers">¶</a>
					</h2>

					<p>In the simplest approach, we can mimic how the cochlea encodes frequency. The cochlea has hair cells that respond to different but overlapping frequency ranges. A specific frequency will stimulate some set of these cells. We can mimic this process by encoding overlapping ranges of real values as active bits. Let's say we need to represent a range of values from <code>0 - 55</code>, and we have <code>100</code> bits to represent this space.</p>

					<p>This is like mapping a continuous value range of 0-55 onto a binary domain of <code>0-100</code> bits. Each scalar value has a corresponding bit associated with it, which we can find by scaling from one domain to another. Once we know the index of the bit array, we can expand the representation by adding more bits on either side of the current index. For simplicity, we're going to offset the actual linear scaling operation to a <a href="https://github.com/d3/d3-scale/blob/master/README.md#continuous-scales">third party library called "d3"</a>.</p>

					<p>So, given constant values for <code>w</code>, <code>n</code>, <code>min</code>, and <code>max</code>, we can write the JavaScript code for this encoder like this:</p>

					<div id="code-example-1">
						<CodeSyntax>{examples.code[0]}</CodeSyntax>
					</div>

					<span>
						<a href="#code-example-1">¶</a>Code Example 1:
					</span>
					Given constant values for the input value range and output parameters, a complete scalar encoder.

					<p>So, given that <code>value</code>  is a scalar number between <code>0</code> and <code>55</code>, the <code>encode()</code> function above will create an encoding <code>100</code> bits long with <code>18</code> bits on (the <em>bitmask</em>) to represent that specific value. Calling <code>encode(27.5)</code> would return a 100-element array, with a bitmask, or block of <code>1</code>s, in the middle:</p>

					<div id="encoding-example-1">
						<CodeSyntax>{examples.encodings[0]}</CodeSyntax>
					</div>
					<span><a href="#encoding-example-1">¶</a>Encoding Example 1:</span> The encoding for the scalar value <code>27.5</code>. Shows an 18-bit long bitmask.

					<p>Using only the code shown above, we can create an interactive visualization of this encoder. If you hover over the "scalar value" axis in the <strong><a href="#simpleScalarEncoder">Figure 1</a></strong> below, the red line moves and the current value being encoded changes. As the value changes, the encoding beneath it also changes, showing which bits are <em>on</em> (the blue ones) vs <em>off</em>. Also hover your mouse over the rectangles representing bits in the output encoding and see the range within the scalar input domain that activates that bit.</p>

					<figure className="figure">
						<SimpleScalarEncoder
							id="simpleScalarEncoder"
							diagramWidth={500}
							value={this.state.value}
							max={this.state.max}
							min={this.state.min}
							n={this.state.n}
							w={this.state.w}
							onUpdate={value => this.setState({ value })}
						/>
						<figcaption class="figure-caption">
							<span><a href="#simpleScalarEncoder">¶</a>Figure 1:</span> A value between <code>{this.state.min}</code> and <code>{this.state.max}</code> is encoded into bits above. Move your mouse over the number line to see the encoding update. Hover over the bits in the encoding to see the value range each bit can represent.
						</figcaption>
					</figure>

					<p>Notice how the range of the on bits in the encoding always encompass the currently selected value. As you move towards the min and max values, you might notice there is a problem with this representation. If you increase the resolution and move the value, you can clearly see the number of bits in the representation decreasing by half as you approach the min and max values (watch the figure above as you <a className='interactive'
						onClick={this.animateValue(this.state.value, this.state.min)}>click here</a>
						). Did you notice anything? <a className='interactive'
							onClick={this.animateValue(this.state.value, this.state.max)}>Click again</a>
						and pay attention to the size of the encoding. It changes as the value moves toward the edge, and that breaks one of our <a href="/encoders"> established earlier</a>. Principle #4 of encoders states:</p>
					<blockquote>The output should have similar sparsity for all inputs and have enough one-bits to handle noise and subsampling.</blockquote>
					<p>Our super simple encoder detailed above is going to need a little more logic to handle the literal "edge cases" of minimum and maximum representations. We can do this by overriding the <code>applyBitmaskAtIndex()</code> function above with another one that accounts for this new behavior we want:</p>

					<div id="code-example-2">
						<CodeSyntax highlightedLines={[21, 22, 23, 24, 25, 26, 27, 28]}>{examples.code[1]}</CodeSyntax>
					</div>
					<span><a href="#code-example-2">¶</a>Code Example 2:</span> The only difference between the two encoders is highlighted above. We simply prevent the bitmask from getting smaller with some custom handling at the min and max.

					<p>Now when you hover near the min and max values, you'll see that the size of the representation remains consistent. You might also notice that some bits will now <a>represent more values than others</a>.</p>

					<figure className="figure">
						<SimpleScalarEncoder
							id="boundedScalarEncoder"
							bounded
							diagramWidth={500}
							value={this.state.value}
							max={this.state.max}
							min={this.state.min}
							n={this.state.n}
							w={this.state.w}
							onUpdate={value => this.setState({ value })}
						/>

						<figcaption class="figure-caption">
							<span><a href="#boundedScalarEncoder">¶</a>Figure 2:</span> Unlike the encodings in <em>Figure 1</em>, the size of all output encodings in this example will be the same because we have manually bounded the edges to force the representation to have a constant sparsity.
						</figcaption>
					</figure>

					<h3 id="complete-code-reference">Complete Code Reference <a href="#complete-code-reference">¶</a></h3>
					<p>See the complete <code><a href="https://github.com/htm-community/simplehtm/blob/master/src/encoders/scalar.js" rel="noopener" target="_blank">ScalarEncoder</a></code> and <code><a href="https://github.com/htm-community/simplehtm/blob/master/src/encoders/boundedScalar.js" rel="noopener" target="_blank">BoundedScalarEncoder</a></code> JavaScript classes used in these examples. As an example, the following configuration produces the behavior visualized below.</p>

					<div id="code-example-3">
						<CodeSyntax>{examples.code[2]}</CodeSyntax>
					</div>
					<div>
						<span><a href="#code-example-3">¶</a>Code Example 3:</span>An example of the creation of an encoder and its usage.
					</div>

					<figure className="figure">
						<SimpleScalarEncoder
							id="exampleBoundedScalarEncoder"
							bounded
							diagramWidth={500}
							value={25}
							min={0}
							max={50}
							n={100}
							w={10}
						/>

						<figcaption class="figure-caption">
							<span><a href="#exampleBoundedScalarEncoder">¶</a>Figure 3:</span> The behavior of a bounded encoder with a continuous input range of <code>0</code>-<code>50</code> into a bit range of <code>10</code> on bits in a <code>100</code>-bit array.
						</figcaption>
					</figure>

					<h3 id="output-parameters">Output Parameters<a href="#output-parameters">¶</a></h3>
					<p>Encoders should give users control over the size and sparsity of encoders they create. Given constant values for the input range of 0-100, change the <code>w</code>{ParameterW} and <code>n</code>{ParameterN} values in the visualization below and observe how the output encoding changes. </p>

					<figure className="figure">
						<SimpleScalarEncoder
							id="outputRange"
							bounded
							diagramWidth={500}
							value={this.state.value}
							max={this.state.max}
							min={this.state.min}
							n={this.state.n}
							w={this.state.w}
							onUpdate={value => this.setState({ value })}
						/>
						<figcaption class="figure-caption">
							<span><a href="#outputRange">¶</a>Figure 4:</span> This visual allows you to change the number of bits in the entire encoding {ParameterN} and the number of bits on {ParameterW} .
						</figcaption>
					</figure>

					<h3 id="encoding-by-min-max">Encoding by min / max<a href="#encoding-by-min-max">¶</a></h3>
					<p>If you know the input domain for an encoder will remain constant, the easiest way to create an encoder is by defining a minimum and maximum input range. Once an encoder is created, these values cannot be changed or else encodings will be inconsistent. To see what an encoder configuration by min/max values might be like, change the <code>min</code>{ParameterMin} and <code>max</code>{ParameterMax}.</p>

					<figure className="figure">
						<SimpleScalarEncoder
							id="byMinMaxScalarEncoder"
							bounded
							diagramWidth={500}
							value={this.state.value}
							max={this.state.max}
							min={this.state.min}
							n={this.state.n}
							w={this.state.w}
							onUpdate={value => this.setState({ value })}
						/>
						<figcaption class="figure-caption">
							<span><a href="#byMinMaxScalarEncoder">¶</a>Figure 5:</span> Define the input range with <code>min</code>: {ParameterMin} and <code>max</code>: {ParameterMax}.
						</figcaption>
					</figure>

					<h3 id="encoding-by-bit-resolution">Encoding by bit resolution<a href="#encoding-by-bit-resolution">¶</a></h3>
					<p>It might make more sense to create an encoder based upon the range of values each bit in the output array can represent. That is what we mean by <code>resolution</code>, the range of input values one bit represents in the output space.</p>

					<figure className="figure">
						<SimpleScalarEncoder
							id="byResolutionScalarEncoder"
							bounded
							diagramWidth={500}
							value={25}
							resolution={this.state.resolution}
							n={100}
							w={10}
						/>
						<figcaption class="figure-caption">
							<span><a href="#byResolutionScalarEncoder">¶</a>Figure 6:</span> The <code>resolution</code> is the range of values that one output bit represents.
						</figcaption>
					</figure>

					<p>The higher the <code>resolution</code> {ParameterRes}, the larger the input range. This makes sense when you think about each bit containing a larger range of values. For this example, I simply hard-coded the <code>min</code> value to be zero and updated the encoder's <code>max</code> based upon the <code>resolution</code> value.</p>

					<h2 id="cyclic-encoding">Cyclic Encoding<a href="#cyclic-encoding">¶</a></h2>
					<p>Remember above when we had to deal with the special cases of values being encoded at the beginning and end of the value range so all representations were the same size in the output array? Another way to deal with that is by assuming the entire output array is a continuous space -- that it wraps around from the end back to the beginning. We can do this simply by changing how the bitmask around the target index is created:</p>

					<div id="code-example-4">
						<CodeSyntax>{examples.code[3]}</CodeSyntax>
					</div>
					<span><a href="#code-example-4">¶</a>Code Example 4:</span> The only code we need to override is the code that applies the bitmask at the specified index.

					<p>Wow, our <code><a href="https://github.com/htm-community/simplehtm/blob/master/src/encoders/cyclicScalar.js" target="_blank">CyclicScalarEncoder</a></code> is the simplest one so far! As a value starts to approach the end of the encoding space, bits in the beginning of the array will activate and the value will <a>loop through the array as a value changes</a>. In the figure below, mouse over the line towards the max value and watch as the bits wrap to the beginning of the array.</p>

					<figure className="figure">
						<CyclicScalarEncoder
							id="cyclicEncoder"
							diagramWidth={500}
							value={this.state.value}
							max={this.state.max}
							min={this.state.min}
							n={40}
							w={10}
							displayState={this.state.cyclicEncoderState}
							onUpdate={value => this.setState({ value })}
						/>
						<figcaption class="figure-caption">
							<span><a href="#cyclicEncoder">¶</a>Figure 7:</span> Because the block of on bits wraps as you approach the end of this array, it is natural to view this as a circle by choosing the `circle` display option above.
						</figcaption>
					</figure>

					{ToggleCyclicEncoder}

					<p>Change the display option in the visualization above to <code>circle</code>. When viewed in this way, the wrapping of the output bit makes more sense. Change the value being encoded by mousing over the value line above and observe the encoding. </p>

					<p>We'll be taking strong advantage of the simplicity of cyclic encoding when we talk about <a href="/encoding-time">encoding periods of time</a>, as well as in the next section, when we talk about <a href="/encoding-categories">category encoding</a>.</p>

					<h2 id="discrete-vs-continuous">Discrete Vs Continuous<a href="#discrete-vs-continuous">¶</a></h2>

					<p>All the examples shown so far have been of continuous encodings, because all our input ranges have been a continuous scale of numeric values. This also means that numbers near one another on the number line have been represented similarly. For example, in <strong>Figure 8</strong> below you can see encodings for two numbers: <code>4</code> and <code>5</code>. Given the encoding parameters defined below, you can see the overlapping bits in green.</p>

					<figure className="figure">
						<ScalarOverlap
							id="continuousOverlap"
							diagramWidth={500}
							maxValue={10}
							minValue={0}
							w={this.state.w}
							n={this.state.n}
							valueA={this.state.valueA}
							valueB={this.state.valueB}
							onUpdate={value => this.setState(value)}
						/>
						<figcaption class="figure-caption">
							<span><a href="#continuousOverlap">¶</a>Figure 8:</span> The encoding of <code>{this.state.valueA}</code> is in blue and <code>{this.state.valueB}</code> is in yellow. The overlapping bits are green.
						</figcaption>
					</figure>

					<p>This overlap means that these to values are semantically similar. They are represented similarly because their values are close on the number line. Compare the overlap of <a>two close values</a> vs two values farther from each other. <a>These two values</a> are far enough away from each other on the number line that they have no semantic similarity. Try changing the values of <code>w</code>{ParameterW} and <code>n</code>{ParameterN} while noticing how it affects the overlap between <a>close</a> and <a>far</a> values.</p>

					<p>Continuous encoding is great for ranges of input values, but sometimes we don't want encodings to overlap. You might want to separate an encoding space into equal sections that encode different categories of data, like this:</p>

					<div className="alert alert-danger" role="alert">
						<h3>
							This diagram is broken, see <a href="https://github.com/htm-community/building-htm-systems/issues/25">#25</a>
							<br />
							▼
            </h3>
					</div>

					<figure className="figure">
						<DiscreteEncodingDiagram
							id="discreteEncoding"
							diagramWidth={500}
							w={this.state.w}
							n={this.state.categoryLength * this.state.w}
							maxValue={this.state.categoryLength - 1}
							minValue={0}
							categoryLength={this.state.categoryLength}
							valueA={this.state.valueA}
							valueB={this.state.valueB}
							onUpdate={value => this.setState(value)}
						/>
						<figcaption class="figure-caption">
							<span><a href="#discreteEncoding">¶</a>Figure 9:</span> By limiting the input to discrete values and making <code>n</code> an even multiple of <code>w</code>, it is easy to encode discrete scalar values with a <code>CyclicScalarEncoder</code>.
						</figcaption>
					</figure>

					{ParameterCategoryLength}

					<p>Accomplishing this is really quite simple if we use logic we've already defined for the <code><a href="https://github.com/htm-community/simplehtm/blob/master/src/encoders/cyclicScalar.js" target="_blank">CyclicScalarEncoder</a></code>. If we know how many different discrete values we need to encode and the number of bits to use for each, we can do this:</p>

					<div id="code-example-5">
						<CodeSyntax>{examples.code[4]}</CodeSyntax>
					</div>
					<span><a href="#code-example-5">¶</a>Code Example 5:</span>Use the <code>CyclicScalarEncoder</code>.

					<p>This <code><a href="https://github.com/htm-community/simplehtm/blob/master/src/encoders/cyclicScalar.js" target="_blank">CyclicScalarEncoder</a></code> is now configured to return discrete encodings for the discrete input values <code>[0,1,2,3,4]</code>, but remember we have to send it integers, not decimal values in order to get back non-continuous encodings. Watch us turn this little code snippet into a <code>CategoryEncoder</code> in the <a href="/encoding-categories">next section</a>.</p>

					<hr />
					<strong>Next: <a href="/encoding-categories">Encoding Categories</a></strong>

				</Layout>
			</div>
		)
	}
}

export default EncodingNumbers
