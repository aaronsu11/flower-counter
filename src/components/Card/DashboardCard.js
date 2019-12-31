import React from "react";

export default function DashboardCard() {
  return (
    <div class="card card-tabs">
      <div class="card-divider">
        <h6 class="float-left">Title</h6>
        <ul
          class="tabs menu align-right"
          data-active-collapse="true"
          data-tabs
          id="collapsing-tabs"
        >
          <li class="tabs-title">
            <a href="#panel3c">
              <i class="fa fa-cog" aria-hidden="true"></i> Settings
            </a>
          </li>
          <li class="tabs-title">
            <a href="#panel2c">
              <i class="fa fa-area-chart" aria-hidden="true"></i>
              Stats
            </a>
          </li>
          <li class="tabs-title is-active">
            <a href="#panel1c">
              <i class="fa fa-home" aria-hidden="true"></i>
              Home
            </a>
          </li>
        </ul>
      </div>

      <div class="tabs-content" data-tabs-content="collapsing-tabs">
        <div class="tabs-panel is-active" id="panel1c">
          <img src="http://lorempixel.com/485/248/cats/7/" alt="cat" />
          <div class="card-section">
            <h4>This is a card.</h4>
            <p>
              It has an easy to override visual style, and is appropriately
              subdued.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
