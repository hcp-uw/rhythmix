/**
 * Define Slider record type to keep track of current slider
 * set being shown.
 * App state:
 * - sliderSet: string
 * - result: boolean
 * - basicSlider: Map
 * - advancedSlider: Map
 * 
 * Functions:
 * - constructor
 * - componentDidMount (pretty much automatic function that rerenders when app state changes)
 * - render
 *      - if result = "true": return a JSX.Element from CustomPlaylistResult
 *      - if sliderSet = "basic"
 *      - if sliderSet = "advanced"
 * - onClick for each button (more options, create playlist)
 * - onChange? for sliders
 * - fetch from Spotify API
 */