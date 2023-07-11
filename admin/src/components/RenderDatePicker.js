import React from 'react';
import PropTypes from 'prop-types';
import moment from 'jalali-moment';
import {DatePicker} from "react-advance-jalaali-datepicker";

export default class renderDatePicker extends React.Component {

  static propTypes = {
    input: PropTypes.shape({
      onChange: PropTypes.func,
      value: PropTypes.string,
    }).isRequired,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }).isRequired,
    inputValueFormat: PropTypes.string,
  };

  static defaultProps = {
    inputValueFormat: null,
  };

  state = {
    selectedDate: null,
  };

  componentWillMount() {
    if (this.props.input && this.props.input.value) {
      this.setState({
        // selectedDate: moment(this.props.input.value, this.props.inputValueFormat),
        selectedDate: moment(this.props.input.value).format("YYYY-MM-DD")
      });
    }
  }

  handleChange = (date) => {
    console.log("in handle change");
    console.log(date);
    this.setState({
      selectedDate: date,
    });
    console.log(this.props)
    this.props.input.onChange(date);
  }

  render() {

    const {
      meta: {touched, error},
      ...rest
    } = this.props;
    // moment.loadPersian();
    console.log(this.props);
    if (this.props.input.value) {
      var dateMoment = moment(this.props.input.value).format("YYYY-MM-DD");
      var preSelected = moment(dateMoment, 'YYYY-MM-DD').locale('fa').format('YYYY-MM-DD');
      return (
        <div>
          <DatePicker
            {...rest}
            // format="jYYYY/jMM/jDD"
            monthTitleEnable
            preSelected={preSelected}
            placeholder={this.props.placeholderText}
            selected={this.state.selectedDate}
            onChange={this.handleChange}
          />
          {touched &&
          error &&
          <span className="datepicker__error">
            {error}
          </span>}
        </div>
      );
    }
    else {
      return (
        <div>
          <DatePicker
            {...rest}
            // format="jYYYY/jMM/jDD"
            monthTitleEnable
            placeholder={this.props.placeholderText}
            selected={this.state.selectedDate}
            onChange={this.handleChange}
          />
          {touched &&
          error &&
          <span className="datepicker__error">
            {error}
          </span>}
        </div>
      );
    }

  }
}