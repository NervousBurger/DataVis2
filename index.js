var config = {
  $schema: "https://vega.github.io/schema/vega-lite/v4.json",
  width: window.innerWidth * 0.9,
  height: window.innerHeight * 0.9,
  autosize: {
    type: "fit",
    contains: "content",
  },
  title: {
    text: "More than 180,000 terrorist attacks worldwide, 1970-2017",
    fontSize: 25,
    fontWeight: "bold",
  },
  data: {
    url: "terroris.json",
    format: { type: "topojson", feature: "custom" },
  },
  transform: [
    {
      lookup: "properties.name",
      from: {
        data: { url: "countries.csv" },
        key: "country",
        fields: ["count"],
      },
    },
  ],
  projection: { type: "mercator" },
  mark: { type: "geoshape", stroke: "#3a4750", tooltip: true },
  encoding: {
    color: {
      field: "count",
      type: "quantitative",
      title: "Number of Terroist attacks",
      scale: {
        type: "threshold",
        domain: [100, 1000, 10000],
        range: ["#fdbe85", "#fd8d3c", "#e6550d", "#a63603"],
      },
    },
    tooltip: [
      { field: "properties.name", title: "Country" },
      { field: "count" },
    ],
  },
};

const state = {
  width: 1100,
  height: 400,
  title: {
    text: "Attack count by state from 1970 to 2017",
    fontSize: 20,
    color: "#393e46",
  },
  projection: { type: "mercator" },
  layer: [
    {
      data: {
        url: "AU.json",
        format: { type: "topojson", feature: "states" },
      },
      mark: { type: "geoshape", stroke: "white", tooltip: true },
      transform: [
        {
          lookup: "properties.STATE_NAME",
          from: {
            data: { url: "count.csv" },
            key: "state",
            fields: ["state", "count"],
          },
        },
      ],
      encoding: {
        color: {
          field: "count",
          scale: {
            type: "threshold",
            domain: [0, 20, 50, 100],
            range: ["#fdbe85", "#fd8d3c", "#e6550d", "#a63603"],
          },
        },
        tooltip: [
          { field: "state" },
          { field: "count", title: "Number of Attacks " },
        ],
      },
    },
    {
      data: {
        url: "auterrois.csv",
      },
      transform: [{ calculate: "datum.iyear*1", as: "year" }],
      encoding: {
        longitude: { field: "longitude", type: "quantitative" },
        latitude: { field: "latitude", type: "quantitative" },
      },
      layer: [
        {
          mark: { type: "circle" },
          selection: {
            year_select: {
              type: "single",
              fields: ["year"],
              bind: {
                year: { input: "range", min: 1970, max: 2017, step: 1 },
              },
            },
          },
          transform: [
            {
              filter: { selection: "year_select" },
            },
          ],
          encoding: {
            size: {
              aggregate: "count",
              scale: {
                range: [5, 1200],
              },
            },
            stroke: { value: "white" },
            strokeOpacity: { value: 0.5 },
            fill: { value: "#00adb5" },
            tooltip: [
              {
                aggregate: "count",
                field: "city",
              },
              {
                field: "city",
              },
            ],
          },
        },
      ],
    },
  ],
};

vegaEmbed("#state", state);

//line

const line = {
  width: 1000,
  height: 400,
  title:{text: "There have been three large-scale terrorist attacks in Australian history ",fontSize:25},
  data: {
    url: "auterrois.csv",
  },
  transform: [{ calculate: "datum.nkill*1+datum.nwound*1", as: "Casualties" }],
  encoding: {
    x: { field: "iyear" },
    y: { aggregate: "count" },
    color: { value: "#00adb5" },
  },
  layer: [
    {
      mark: {
        type: "line",
        point: true,
        interpolate: "monotone",
        tooltip: true,
      },
    },
    {
      mark: { type: "circle", tooltip: true },
      encoding: {
        y: {
          aggregate: "sum",
          field: "Casualties",
        },
        color: {
          aggregate: "sum",
          field: "Casualties",
          scale: {
            scheme: "oranges",
          },
        },
        size: {
          aggregate: "sum",
          field: "Casualties",
          scale: {
            range: [8, 800],
          },
        },
      },
    },
    {
      mark: { type: "text", baseline: "bottom", align: "center" },
      encoding: {
        text: { aggregate: "count" },
        color: { value: "#393e46" },
      },
    },
  ],
};
vegaEmbed("#time", line);

