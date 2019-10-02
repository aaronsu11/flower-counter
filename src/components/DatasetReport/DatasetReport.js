import React, { Component } from "react";

export class DatasetReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sendEmail: false,
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
        // console.log(res);
        const { batch_info, ...report } = res.summary;
        // console.log(report);
        this.setState({ report });
      });
    // console.log(this.state);
  };

  render() {
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
                  <p className="feature-desc">{this.state.report.size}</p>
                </div>
              </div>

              <div className="product-feature-section-feature top-right">
                <i className="fa fa-heart" aria-hidden="true"></i>
                <div>
                  <p className="feature-title">Best Sample Size</p>
                  <p className="feature-desc">{this.state.report.bss}</p>
                </div>
              </div>

              <div className="product-feature-section-feature middle-left">
                <i className="fa fa-coffee" aria-hidden="true"></i>
                <div>
                  <p className="feature-title">Mean</p>
                  <p className="feature-desc">{this.state.report.mean}</p>
                </div>
              </div>

              <div className="product-feature-section-feature middle-right">
                <i className="fa fa-map-marker" aria-hidden="true"></i>
                <div>
                  <p className="feature-title">Standard Deviation</p>
                  <p className="feature-desc">{this.state.report.stdev}</p>
                </div>
              </div>

              <div className="product-feature-section-feature bottom-left">
                <i className="fa fa-coffee" aria-hidden="true"></i>
                <div>
                  <p className="feature-title">Maximum Value</p>
                  <p className="feature-desc">{this.state.report.max}</p>
                </div>
              </div>

              <div className="product-feature-section-feature bottom-right">
                <i className="fa fa-map-marker" aria-hidden="true"></i>
                <div>
                  <p className="feature-title">Minimum Value</p>
                  <p className="feature-desc">{this.state.report.min}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <button
          type="button"
          className="button radius bordered shadow success margin-top-1"
          onClick={this.props.reset}
        >
          Reset
        </button>
        <button
          type="button"
          className="button radius bordered shadow success margin-top-1"
          onClick={() => this.report(true)}
        >
          Email Report
        </button>
      </div>
    );
  }
}

export default DatasetReport;
