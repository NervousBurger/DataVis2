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

vegaEmbed("#vis", config);
