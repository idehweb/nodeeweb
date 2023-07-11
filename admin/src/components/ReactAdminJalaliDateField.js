import PropTypes from 'prop-types';
import moment from 'jalali-moment'
import React, {Component} from 'react';

class ReactAdminJalaliDateField extends Component {
  render() {
    var dateMoment = moment(this.props.record[this.props.source]).format("YYYY-MM-DD")
    return <span>{
      moment(dateMoment, 'YYYY-MM-DD').locale('fa').format('YYYY/MM/DD')
    }
        </span>;
  }
}

ReactAdminJalaliDateField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
};

export default ReactAdminJalaliDateField;