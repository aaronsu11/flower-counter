import React, { Component } from "react";

export class DatasetReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailSent: false,
      report: {
        bss: "",
        size: "",
        mean: "",
        stdev: "",
        max: "",
        min: ""
      }
    };
    // props.setStage(2);
    this.report(false);
  }

  report = sendEmail => {
    const {
      name,
      email,
      date,
      variety,
      EL_stage,
      vineyard,
      block_id
    } = this.props.formFields;
    const { id } = this.props.user;

    fetch(this.props.apiURL + "report", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sendEmail: sendEmail,
        userid: id,
        batchid: this.props.batchID,
        email: email,
        name: name,
        date: date,
        variety: variety,
        el_stage: EL_stage,
        vineyard: vineyard,
        block_id: block_id
      })
    })
      .then(response => response.json())
      .then(res => {
        console.log(res);
        const { batch_info, ...report } = res.summary;
        // console.log(report);
        this.setState({ report });
      });
    // console.log(this.state);
  };

  render() {
    const { bss, size, mean, stdev, max, min } = this.state.report;
    return (
      <div>
        <section className="product-feature-section">
          <div className="product-feature-section-outer">
            <h4 className="product-feature-section-headline">Dataset Report</h4>

            <div className="product-feature-section-inner">
              <div className="product-feature-section-feature top-left">
                <i className="fa fa-shield" aria-hidden="true"></i>
                <div>
                  <p className="feature-title">Current Sample Size</p>
                  <p className="feature-desc">{size}</p>
                </div>
              </div>

              <div className="product-feature-section-feature top-right">
                <i className="fa fa-heart" aria-hidden="true"></i>
                <div>
                  <p className="feature-title">Best Sample Size*</p>
                  <p className="feature-desc">{bss}</p>
                </div>
              </div>

              <div className="product-feature-section-feature middle-left">
                <i className="fa fa-coffee" aria-hidden="true"></i>
                <div>
                  <p className="feature-title">Mean</p>
                  <p className="feature-desc">{parseFloat(mean).toFixed(2)}</p>
                </div>
              </div>

              <div className="product-feature-section-feature middle-right">
                <i className="fa fa-map-marker" aria-hidden="true"></i>
                <div>
                  <p className="feature-title">Standard Deviation</p>
                  <p className="feature-desc">{parseFloat(stdev).toFixed(2)}</p>
                </div>
              </div>

              <div className="product-feature-section-feature bottom-left">
                <i className="fa fa-coffee" aria-hidden="true"></i>
                <div>
                  <p className="feature-title">Maximum Value</p>
                  <p className="feature-desc">{parseFloat(max).toFixed(2)}</p>
                </div>
              </div>

              <div className="product-feature-section-feature bottom-right">
                <i className="fa fa-map-marker" aria-hidden="true"></i>
                <div>
                  <p className="feature-title">Minimum Value</p>
                  <p className="feature-desc">{parseFloat(min).toFixed(2)}</p>
                </div>
              </div>
            </div>
            <p>
              *Your sample size is
              <b>{size >= bss ? " sufficient" : " insufficient"} </b>for this
              dataset
            </p>
          </div>

          <div className="row align-center">
            <button
              type="button"
              className="button radius bordered shadow success margin-top-1 margin-right-1"
              onClick={this.props.reset}
            >
              Reset
            </button>
            <button
              type="button"
              className="button radius bordered shadow success margin-top-1"
              onClick={() => {
                this.setState({ emailSent: true });
                this.report(true);
              }}
              disabled={this.state.emailSent}
            >
              Email Report
            </button>
          </div>
        </section>
        {this.state.emailSent ? (
          <div className="callout alert-callout-border success">
            <strong>Sent!</strong> - The report has been sent to your email!
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default DatasetReport;
