import React, { Component } from "react";

export default class StatsCard extends Component {
  render() {
    return (
      <div className="column text-center bordered shadow">
        <h2>Summary</h2>
        <ul className="stats-list">
          <li>
            {this.props.stats.size}
            <span className="stats-list-label">No.Records</span>
          </li>
          <li className="stats-list-positive">
            {this.props.stats.mean}
            <span className="stats-list-label">Sample Mean</span>
          </li>
          <li className="stats-list-negative">
            {this.props.stats.stdev}
            <span className="stats-list-label">Sample Stdev</span>
          </li>
        </ul>
      </div>
    );
  }
}
