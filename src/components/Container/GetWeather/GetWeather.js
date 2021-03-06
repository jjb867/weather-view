import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './GetWeather.scss';
import { connect } from 'react-redux';
import Switch from 'react-toggle-switch';
import {
    getCurrentWeatherByZip,
    getCurrentWeatherByCity,
    clearWeather,
    getForecastByCity,
    getForecastByZip,
    setError,
    clearError,
} from '../../../store/actions/weatherActions';
import { zipRegex, cityRegex } from '../../../utils/regex';
import { charPoses, GetWeatherAnimation, Input } from '../../../utils/poseAnimations';
import SplitText from 'react-pose-text';
import GetWeatherButton from '../../GetWeatherButton/GetWeatherButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class GetWeather extends Component {
    constructor() {
        super();
        this.state = {
            searchTerm: '',
            invalidSearch: '',
            invalidMinLength: '',
            invalidMaxLength: '',
            selectedSearchParameter: '',
            poweredByUrl: 'https://openweathermap.org',
            invalidSearchText: 'Enter a valid City or Zip',
            isSearchFadedIn: false,
            isSearchFocused: false,
            isForecastToggled: false,
            isProcessing: false,
        };
    }

    componentDidMount() {
        this.setState({ isSearchFadedIn: true });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.error.message) {
            this.setState({ isProcessing: false });
        }
    }

    onSearchTermChange = e => {
        this.setState({
            searchTerm: e.target.value,
        });
    };

    checkForValidSearchCity = searchTerm => {
        return cityRegex.test(searchTerm);
    };

    checkForValidSearchZip = searchTerm => {
        return zipRegex.test(searchTerm);
    };

    onKeyPress = e => {
        if (e.key === 'Enter') {
            this.setState({ isProcessing: true });
            this.getWeather();
        }
    };

    getWeather = () => {
        const { searchTerm, isForecastToggled, invalidSearchText } = this.state;
        const {
            getCurrentWeatherByCity,
            getForecastByCity,
            getCurrentWeatherByZip,
            getForecastByZip,
            clearError,
            setError,
            history,
        } = this.props;

        if (this.checkForValidSearchCity(searchTerm)) {
            !isForecastToggled ? getCurrentWeatherByCity(searchTerm, history) : getForecastByCity(searchTerm, history);
            clearError();
        } else if (this.checkForValidSearchZip(searchTerm)) {
            !isForecastToggled ? getCurrentWeatherByZip(searchTerm, history) : getForecastByZip(searchTerm, history);
            clearError();
        } else {
            setError(invalidSearchText);
        }
    };

    handleOnClick = () => {
        this.setState({ isProcessing: true });
        const { length } = this.state.searchTerm;
        const { setError } = this.props;
        length > 2 && length < 50 ? this.getWeather() : setError(this.state.invalidSearchText);
    };

    onSearchBarFocus = () => {
        this.setState({ isSearchFocused: true });
    };

    onToggleSwitchClick = () => {
        this.props.clearError();
        this.setState(prevState => {
            return {
                isForecastToggled: !prevState.isForecastToggled,
            };
        });
    };

    render() {
        const { message } = this.props.error;
        const { isForecastToggled, searchTerm, poweredByUrl, isProcessing } = this.state;

        return (
            <React.Fragment>
                <GetWeatherAnimation key="search" className="search" initialPose="hidden" pose="visible">
                    <div className="container" onKeyPress={this.onKeyPress}>
                        <section className="section">
                            {/* All Sizes */}
                            <div className="columns">
                                <div className="column">
                                    <h1 className="is-size-2 is-size-3-mobile">
                                        <FontAwesomeIcon icon="search-location" />
                                        &nbsp; WeatherView
                                    </h1>
                                    <p className="attribution">
                                        Powered by <a href={poweredByUrl}>{poweredByUrl}</a>
                                    </p>
                                </div>
                            </div>
                            <div className="search-type-label is-hidden-mobile">
                                <h3 className="is-size-6-mobile">
                                    Search Type:&nbsp;&nbsp;
                                    <strong>
                                        <SplitText initialPose="exit" pose="enter" charPoses={charPoses}>
                                            {!isForecastToggled ? 'Current Weather' : '24 Hour Forecast'}
                                        </SplitText>
                                    </strong>
                                </h3>
                            </div>
                            {/* Mobile */}
                            <div className="is-hidden-tablet box">
                                <div className="field has-addons">
                                    <div className="control is-expanded">
                                        <Input
                                            name="searchTerm"
                                            className="input has-text-left search-bar"
                                            type="search"
                                            placeholder="Enter a City or Zip"
                                            value={searchTerm}
                                            onChange={this.onSearchTermChange}
                                            onFocus={this.onSearchBarFocus}
                                        />
                                        {message && <span className="error has-text-info">{message}</span>}
                                    </div>
                                    <div className="control">
                                        <GetWeatherButton
                                            isMobile={true}
                                            handleOnClick={this.handleOnClick}
                                            isProcessing={isProcessing}
                                        />
                                    </div>
                                </div>
                                <div className="search-type-label">
                                    <h3 className="is-size-6-mobile">
                                        Search Type:&nbsp;&nbsp;
                                        <strong>
                                            <SplitText initialPose="exit" pose="enter" charPoses={charPoses}>
                                                {!isForecastToggled ? 'Current Weather' : '24 Hour Forecast'}
                                            </SplitText>
                                        </strong>
                                    </h3>
                                    <div className="control mobile-switch">
                                        <Switch
                                            className="has-background-link"
                                            onClick={this.onToggleSwitchClick}
                                            on={isForecastToggled}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Tablet/Desktop */}
                            <div className="box is-hidden-mobile">
                                <div className="field has-addons">
                                    <div className="control">
                                        <Switch
                                            className="has-background-link desktop-switch"
                                            onClick={this.onToggleSwitchClick}
                                            on={isForecastToggled}
                                        />
                                    </div>
                                    <div className="control is-expanded">
                                        <Input
                                            name="searchTerm"
                                            className="input has-text-centered search-bar"
                                            type="search"
                                            placeholder="Enter a City or Zip"
                                            value={searchTerm}
                                            onChange={this.onSearchTermChange}
                                            onFocus={this.onSearchBarFocus}
                                        />
                                        {message && <span className="error has-text-info">{message}</span>}
                                    </div>
                                    <div className="control">
                                        <GetWeatherButton
                                            isMobile={false}
                                            handleOnClick={this.handleOnClick}
                                            isProcessing={isProcessing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </GetWeatherAnimation>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    searchTerm: state.searchTerm,
    weather: state.weather,
    error: state.error,
});

GetWeather.propTypes = {
    getCurrentWeatherByZip: PropTypes.func.isRequired,
    getCurrentWeatherByCity: PropTypes.func.isRequired,
    clearWeather: PropTypes.func.isRequired,
    getForecastByZip: PropTypes.func.isRequired,
    getForecastByCity: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    clearError: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    {
        getCurrentWeatherByZip,
        getCurrentWeatherByCity,
        clearWeather,
        getForecastByCity,
        getForecastByZip,
        setError,
        clearError,
    },
)(GetWeather);
