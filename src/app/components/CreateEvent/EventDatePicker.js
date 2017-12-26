import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default class EventDatePicker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      startDate: null,
      endDate: null
    }
  }

  handleChange = ({ startDate, endDate }) => {
    startDate = startDate || this.state.startDate
    endDate = endDate || this.state.endDate
    if (startDate.isAfter(endDate)) {
      var temp = startDate
      startDate = endDate
      endDate = temp
    }
    this.setState({ startDate, endDate }, function() {
      this.props.onChange(this.state);
    });
  }

  handleChangeStart = (startDate) => this.handleChange({ startDate })

  handleChangeEnd = (endDate) => this.handleChange({ endDate })

  render () {
    return (
      <div className="row">
        <div className="col-sm-12">
          <DatePicker
            className="form-control input-group"
            selected={this.state.startDate}
            selectsStart
            placeholderText="Event start date and time"
            minDate={moment().add(7, "days")}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeStart}
            shouldCloseOnSelect={false}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            showTimeSelect
            fixedHeight
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="YYYY-MM-DD HH:mm:ss" />
          <br />
          <DatePicker
            className="form-control input-group"
            selected={this.state.endDate}
            selectsEnd
            placeholderText="Event end date and time"
            minDate={moment().add(7, "days")}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeEnd}
            shouldCloseOnSelect={false}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            showTimeSelect
            fixedHeight
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="YYYY-MM-DD HH:mm:ss" />
        </div>
      </div>
    );
  }
}
