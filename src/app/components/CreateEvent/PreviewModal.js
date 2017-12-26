import React, {Component} from "react";

export class PreviewModal extends Component {
  render() {
    return (
      <div>
        <div
          id="preview_popup"
          className="modal fade popup"
          role="dialog"
          data-backdrop="static"
          data-keyboard="false">
          <div className="modal-dialog" style={{width: "80%"}}>
            <div className="modal-content">
              <div className="modal-header" style={{background: "#23231f"}}>
                <button type="button" className="close" data-dismiss="modal" style={{color: "#ffffff"}}>
                  &times;
                </button>
                <h3 className="text-center"><b style={{color: "#16aac4"}}>Preview Event</b></h3>
              </div>
              <div className="modal-body">
                <div className="panel-body form-horizontal">
                <div className="form-group">
                  <label className="col-sm-3 control-label"><b>Bucket Name :</b></label>
                  <div className="col-sm-9"><div className="well">{this.props.eventBucket}</div></div>
                </div>
                  <div className="form-group">
                    <label className="col-sm-3 control-label"><b>Event Name :</b></label>
                    <div className="col-sm-9"><div className="well">{this.props.eventName}</div></div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-3 control-label"><b>Event Description :</b></label>
                    <div className="col-sm-9"><div className="well">{this.props.eventDescription}</div></div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-3 control-label"><b>Event Website :</b></label>
                    <div className="col-sm-9"><div className="well">{this.props.eventURL}</div></div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-3 control-label"><b>Event Start Date :</b></label>
                    <div className="col-sm-9"><div className="well">{this.props.eventStartDate}</div></div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-3 control-label"><b>Event End Date :</b></label>
                    <div className="col-sm-9"><div className="well">{this.props.eventEndDate}</div></div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-3 control-label"><b>Event Location :</b></label>
                    <div className="col-sm-9">
                      {this.props.eventMultipleLocation ?
                        <ul className="no-bullet well">
                        {this.props.eventMultipleLocation.split("\n").map(function(item, key) {
                          return (
                            <li key={key}>({key+1}) {item}</li>
                          )
                        })}
                      </ul>
                      :
                      <div className="well"></div>
                    }
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-3 control-label"><b>Event Type :</b></label>
                    <div className="col-sm-9">
                      <div className="well">{this.props.eventType=="true" ? "Public" : "Private"}</div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-3 control-label"><b>Event Tag :</b></label>
                    <div className="col-sm-9">
                      <ul className="no-bullet well">
                        {this.props.eventTag.split(",").map(function(item, key) {
                          return (
                            <li key={key}>{item}</li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{background: "#23231f"}}>
                <div className="text-center">
                  <button type="button" className="btn btn-info" data-dismiss="modal">OK</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
