d3.json("custom.geo.json").then((data) => {
  console.log(data);
});

//state map

const state = {
  config: {
    // background: "#f4f4f2",
  },
  width: 800,
  height: 500,
  title: {
    text: "Number of terrorist attacks by city, 1970-2017",
    fontSize: 20,
  },
  projection: {
    type: "mercator",
    clipExtent: [
      [0, 0],
      [800, 500],
    ],
    translate: [-10, 280],
    scale: 250,
  },
  layer: [
    {
      data: {
        url: "custom.geo.json",
        format: { type: "topojson", feature: "custom" },
      },
      mark: { type: "geoshape", stroke: "#95e1d3", tooltip: true },
      transform: [
        {
          lookup: "properties.admin",
          from: {
            data: { url: "count.csv" },
            key: "country",
            fields: ["country", "count"],
          },
        },
      ],
      encoding: {
        color: { value: "white" },
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
        size: {
          aggregate: "count",
          scale: {
            domain: [0, 2500],
            range: [5, 1200],
          },
        },
      },
      layer: [
        {
          mark: { type: "circle" },
          selection: {
            select: {
              type: "single",
              fields: ["year"],
              bind: {
                year: { input: "range", min: 1970, max: 2017, step: 1 },
              },
            },
          },
          transform: [
            {
              filter: { selection: "select" },
            },
          ],
          encoding: {
            stroke: { value: "lightgray" },
            strokeOpacity: { value: 0.2 },
            fill: { value: "#495464" },
            tooltip: [
              {
                aggregate: "count",
                field: "city",
                title: "Record",
              },
              {
                field: "city",
                title: "City",
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
  width: 800,
  height: 400,

  config: {
    // background: "#f4f4f2",
  },
  title: {
    text: "Death from terrorism, 1970-2017",
    fontSize: 20,
  },
  data: {
    url: "auterrois.csv",
  },
  transform: [{ calculate: "datum.nkill*1+datum.nwound*1", as: "Casualties" }],
  encoding: {
    x: {
      field: "iyear",
      timeUnit: "year",
      title: "Year",
    },
    y: { aggregate: "count", axis: { labels: false, grid: false } },
    color: { value: "#00adb5" },
  },
  layer: [
    {
      mark: {
        type: "line",
        point: true,
        interpolate: "monotone",
      },
      encoding: {
        y: { aggregate: "count", axis: { labels: true, grid: false } },
        color: {
          value: "#495464",
        },
        tooltip: [
          {
            field: "iyear",
            timeUnit: "year",
            title: "Year",
          },
          {
            aggregate: "count",
            title: "Count of Terrorism ",
          },
        ],
      },
    },
    {
      mark: { type: "text", dy: -10, fontSize: 8 },
      encoding: {
        y: { aggregate: "count" },
        text: {
          aggregate: "count",
        },
        color: {
          value: "gray",
        },
      },
    },
    {
      mark: { type: "circle" },
      encoding: {
        y: {
          aggregate: "sum",
          field: "Casualties",
          title: "Casualties",
        },
        fill: {
          aggregate: "sum",
          field: "Casualties",
          scale: {
            domain:[20000,0],
            scheme: "viridis",
          },
        },
        stroke: {
          value: "white",
        },
        size: {
          aggregate: "sum",
          field: "Casualties",
          scale: {
            range: [8, 800],
          },
        },
        tooltip: [
          {
            field: "iyear",
            timeUnit: "year",
            title: "Year",
          },
          {
            aggregate: "sum",
            field: "Casualties",
            title: "Casualties",
          },
        ],
      },
    },
  ],
};
vegaEmbed("#time", line);

const attackType = {
  config: {
    // background: "#f4f4f2",
  },
  title: {
    text: "The most common Types, Targets and Weapons of Terrorist Attacks",
    fontSize: 20,
    subtitle: "Select an area of the left chart to interact with other charts.",
    subtitleFontSize: 15,
    subtitlePadding: 10,
  },
  data: {
    url: "auterrois.csv",
  },
  transform: [{ calculate: "datum.nkill*1+datum.nwound*1", as: "Casualties" }],
  hconcat: [
    // {
    //   width: 400,
    //   height: 400,
    //   mark: {
    //     type: "circle",
    //     opacity: 0.8,
    //     stroke: "black",
    //     strokeWidth: 1,
    //     tooltip: true,
    //   },
    //   selection: {
    //     brush: {
    //       type: "interval",
    //     },
    //   },
    //   encoding: {
    //     x: {
    //       field: "iyear",
    //       timeUnit: "year",
    //       title: "Year",
    //     },
    //     y: { field: "attacktype1_txt", type: "nominal", axis: { title: "" } },
    //     detail: { field: "eventid" },

    //     size: {
    //       field: "Casualties",
    //       type: "quantitative",
    //       title: "Annual  Casualties",
    //       legend: { clipHeight: 30 },
    //       scale: { rangeMax: 2000 },
    //     },
    //     color: {
    //       field: "attacktype1_txt",
    //       type: "nominal",
    //       legend: null,
    //       scale: {
    //         scheme: "category20c",
    //       },
    //     },
    //     tooltip: [
    //       { field: "addnotes", title: "addnotes" },
    //       { field: "Casualties", title: "Casualties" },
    //       { field: "iyear", timeUnit: "year", title: "Year" },
    //       { field: "attacktype1_txt", title: "Attack type" },
    //       { field: "weapsubtype1_txt", title: "Weapon Subtype" },
    //       { field: "nkill", title: "kill" },
    //       { field: "nwound", title: "Wound" },
    //     ],
    //   },
    // },
    {
      width: 300,
      height: 400,
      mark: "area",
      selection: {
        brush: {
          type: "interval",
        },
      },
      encoding: {
        x: {
          field: "iyear",
          timeUnit: "year",
          title: "Year",
        },
        y: {
          aggregate: "sum",
          field: "Casualties",
          axis: null,
          stack: "center",
        },
        // detail: { field: "attacktype1_txt" },
        color: {
          field: "attacktype1_txt",
          type: "nominal",
          scale: { scheme: "category20b" },
        },
        tooltip: [
          {
            field: "iyear",
            timeUnit: "year",
            title: "Year",
          },
          {
            field: "attacktype1_txt",
            title: "Attack Type",
          },
          {
            aggregate: "sum",
            field: "Casualties",
          },
        ],
      },
    },
    {
      width: 200,
      height: 400,
      transform: [{ filter: { selection: "brush" } }],

      encoding: {
        y: {
          field: "targtype1_txt",
          title: "Targt type",
          sort: { op: "count", field: "targtype1_txt", order: "descending" },
          axis: {
            titleFontSize: 17,
          },
        },
        x: { aggregate: "count" },
        color: {
          field: "weaptype1_txt",
          type: "nominal",
          legend: {
            orient: "right",
            title:"Legend"
          },
          scale: {
            scheme: "category20b",
          },
        },

        tooltip: [
          { field: "weaptype1_txt", title: "Weapon type" },
          { aggregate: "sum", field: "Casualties" },
        ],
      },
      mark: { type: "bar" },
    },
    //weaptype1_txt
    {
      width: 200,
      height: 400,
      transform: [{ filter: { selection: "brush" } }],

      encoding: {
        y: {
          field: "weaptype1_txt",
          title: "Weapon type",
          sort: { op: "count", field: "weaptype1_txt", order: "descending" },
          axis: {
            titleFontSize: 17,
          },
        },
        x: { aggregate: "count" },
        color: {
          value: "#495464",
        },

        tooltip: [{ aggregate: "sum", field: "Casualties" }],
      },
      mark: { type: "bar" },
    },
  ],
};

vegaEmbed("#attackType", attackType);
