import React, { Component } from "react";

import StatsCard from "../components/Card/StatsCard";
// import DashboardCard from "../components/Card/DashboardCard";
// import { Link, Button, Colors } from "react-foundation";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebar: false,
      type: "vineyardls",
      content: "",
      content_extra: "",
      itemPage: 1,
      records: [],
      summary: {
        size: 0,
        mean: 0,
        stdev: 0
      }
    };
    this.handleSearch("vineyardls", "");
  }

  handleSearch = (type, content) => {
    const { id } = this.props.user;
    // const { records } = this.state;
    this.setState({ type, content });

    if (type) {
      fetch(this.props.apiURL + "list", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: id,
          type: type,
          content: content,
          content_extra: ""
        })
      })
        .then(response => response.json())
        .then(res => {
          console.log(res);
          const { records, summary } = res;
          this.setState({ records, summary });
        });
    }
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  };

  handleClick = (e, type) => {
    e.preventDefault();
    this.setState({ type });
    this.handleSearch(type, this.state.content);
    console.log(this.state);
  };

  toggleSidebar = () => {
    const { sidebar } = this.state;
    this.setState({ sidebar: !sidebar });
  };

  renderRecord = () => {
    const { records, type } = this.state;
    const list_items = records.map((record, index) => {
      return (
        <li
          key={index}
          className="list-group-item"
          onClick={() => {
            if (type === "vineyardls") {
              this.setState({ content: record });
            } else {
              this.handleSearch(type, record);
            }
          }}
        >
          <b>Name: </b>
          {record}
          {/* {record.name} <b>Path: </b>
          {record.path} <b>Count: </b>
          {record.estimate} */}
        </li>
      );
    });
    return list_items;
  };

  render() {
    const { sidebar, summary } = this.state;
    return (
      <div
        className={
          "app-dashboard" + (sidebar ? " shrink-medium" : " shrink-large")
        }
      >
        {/* Search Bar */}
        <div className="row expanded app-dashboard-top-nav-bar">
          {/* <div className="columns medium-2">
            <button
              data-toggle="app-dashboard-sidebar"
              className="menu-icon hide-for-medium"
            ></button>
            <a className="app-dashboard-logo">Foundation</a>
          </div> */}
          <div className="columns show-for-medium">
            <div className="app-dashboard-search-bar-container">
              <input
                className="app-dashboard-search"
                type="search"
                placeholder="Search"
                onChange={this.handleChange}
              />
              <button
                className="app-dashboard-search-icon"
                type="button"
                onClick={this.handleSearch}
              >
                <i className="fa fa-search"></i>
              </button>
            </div>
          </div>
          {/* <div className="columns shrink app-dashboard-top-bar-actions">
            <button href="#" className="button hollow">
              Logout
            </button>
            <a href="#" height="30" width="30" alt="">
              <i className="fa fa-info-circle"></i>
            </a>
          </div> */}
        </div>

        <div className="app-dashboard-body off-canvas-wrapper">
          {/* Side Bar */}
          <div
            id="app-dashboard-sidebar"
            className="app-dashboard-sidebar position-left off-canvas off-canvas-absolute reveal-for-medium"
            data-off-canvas
          >
            <div className="app-dashboard-sidebar-title-area">
              <div className="app-dashboard-close-sidebar">
                <h3 className="app-dashboard-sidebar-block-title">Filter</h3>
                {/* <!-- Close button --> */}
                <button
                  id="close-sidebar"
                  className="app-dashboard-sidebar-close-button show-for-medium"
                  aria-label="Close menu"
                  type="button"
                  onClick={this.toggleSidebar}
                >
                  <span aria-hidden="true">
                    <i className="large fa fa-angle-double-left"></i>
                  </span>
                </button>
              </div>
              <div className="app-dashboard-open-sidebar">
                <button
                  id="open-sidebar"
                  className="app-dashboard-open-sidebar-button show-for-medium"
                  aria-label="open menu"
                  type="button"
                  onClick={this.toggleSidebar}
                >
                  <span aria-hidden="true">
                    <i className="large fa fa-angle-double-right"></i>
                  </span>
                </button>
              </div>
            </div>
            <div className="app-dashboard-sidebar-inner">
              <ul className="menu vertical">
                <li>
                  <a
                    href="/"
                    className="is-active"
                    onClick={e => this.handleClick(e, "blockls")}
                  >
                    <i className="large fa fa-institution"></i>
                    <span className="app-dashboard-sidebar-text">By Block</span>
                  </a>
                </li>
                <li>
                  <a href="/" onClick={e => this.handleClick(e, "datels")}>
                    <i className="large fa fa-hourglass"></i>
                    <span className="app-dashboard-sidebar-text">By Time</span>
                  </a>
                </li>
                {/* <li>
                  <a href="/">
                    <i className="large fa fa-industry"></i>
                    <span className="app-dashboard-sidebar-text">Industry</span>
                  </a>
                </li> */}
              </ul>
            </div>
          </div>
          {/* Content */}
          <div
            className="app-dashboard-body-content off-canvas-content"
            data-off-canvas-content
          >
            <h2 className="text-center">Search Records</h2>
            <p className="text-center">
              Please type in the keywords in the search bar. A list of records
              and their statistical summary will be generated
            </p>

            <div className="row align-spaced">
              <div className="column small-4">
                {/* <StatsCard stats={summary} /> */}
              </div>
              <div className="column small-8">
                <ul className="list-group">
                  {/* <li className="list-group-item active">
                    List Group Item 1 (Active)
                  </li> */}
                  {this.renderRecord()}
                  {/* <li className="list-group-item disabled">
                    List Group Item 4 (Disabled)
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
