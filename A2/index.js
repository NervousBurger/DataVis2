d3.json("custom.geo.json").then((data) => {
  console.log(data);
});

//state map

const state = {
  config: {
    background: "#f4f4f2",
  },
  width: 800,
  height: 400,
  title: {
    text: "Number of terrorist attacks by city, 1970-2017",
    fontSize: 20,
  },
  projection: {
    type: "mercator",
    clipExtent: [
      [0, 0],
      [800, 400],
    ],
    translate: [-10, 220],
    scale: 200,
  },
  layer: [
    {
      data: {
        url: "custom.geo.json",
        format: { type: "topojson", feature: "custom" },
      },
      mark: { type: "geoshape", stroke: "white", tooltip: true },
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
        color:{value:'#bbbfca'},
       
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
            size: {
              aggregate: "count",
              scale: {
                range: [5, 1200],
              },
            },
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
  width: 700,
  height: 400,

  config: {
    background: "#f4f4f2",
  },
  title: {
    text:
      "Death from terrorism, 1970-2017",
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
        // tooltip: true,
      },
      encoding:{
        color:{
          value:"#495464"
        }
      }
    },
    {
      mark: { type: "circle", tooltip: true },
      encoding: {
        y: {
          aggregate: "sum",
          field: "Casualties",
          title: "Casualties",
        },
        color: {
          value:'#495464'
        },
        stroke:{value:'#f4f4f2'},
        size: {
          aggregate: "sum",
          field: "Casualties",
          scale: {
            range: [8, 800],
          },
        },
      },
    },
   
    
  ],
};
vegaEmbed("#time", line);

const attackType = {
  config: {
    background: "#f4f4f2",
  },
  title: {
    text: "Analysis of types of attacks, targets and weapons",
    fontSize: 20,
    subtitle:
      "Select an area of the left chart to interact with other charts.",
    subtitleFontSize: 15,
    subtitlePadding: 10,
  },
  data: {
    url: "auterrois.csv",
  },
  transform: [{ calculate: "datum.nkill*1+datum.nwound*1", as: "Casualties" }],
  hconcat: [
    {
      width: 400,
      height: 400,
      mark: {
        type: "circle",
        opacity: 0.8,
        stroke: "black",
        strokeWidth: 1,
        tooltip: true,
      },
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
        y: { field: "attacktype1_txt", type: "nominal", axis: { title: "" } },
        detail: { field: "eventid" },

        size: {
          field: "Casualties",
          type: "quantitative",
          title: "Annual  Casualties",
          legend: { clipHeight: 30 },
          scale: { rangeMax: 2000 },
        },
        color: { field: "attacktype1_txt", type: "nominal", legend: null },
        tooltip: [
          { field: "addnotes", title: "addnotes" },
          { field: "Casualties", title: "Casualties" },
          { field: "iyear",timeUnit: "year", title: "Year" },
          { field: "attacktype1_txt", title: "Attack type" },
          { field: "weapsubtype1_txt", title: "Weapon Subtype" },
          { field: "nkill", title: "kill" },
          { field: "nwound", title: "Wound" },
        ],
      },
    },
    {
      width: 300,
      height: 400,
      transform: [{ filter: { selection: "brush" } }],

      encoding: {
        y: {
          field: "targtype1_txt",
          title: "Targt type",
          sort: { op: "count", field: "targtype1_txt", order: "descending" },
        },
        x: { aggregate: "count" },
        color: {
          field: "weaptype1_txt",
          type:'nominal',
          legend:{
            orient:'right'
          },
        },
        

        tooltip: [{field:'weaptype1_txt',title:'Weapon type'},{ aggregate: "sum", field: "Casualties" }],
      },
      mark: { type: "bar" },
    },
    //weaptype1_txt
    {
      width: 300,
      height: 400,
      transform: [{ filter: { selection: "brush" } }],

      encoding: {
        y: {
          field: "weaptype1_txt",
          title: "Weapon type",
          sort: { op: "count", field: "weaptype1_txt", order: "descending" },
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
