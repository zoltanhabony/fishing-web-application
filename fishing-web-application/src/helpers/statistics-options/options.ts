export let verticalOption = {
  chart: {
    id: "apexchart-example",

    toolbar: {
      show: true,
    },
  },
  xaxis: {
    categories: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    labels: {
      style: {
        colors: "#fff",
        fontSize: "12px",
      },
    },
  },

  colors: ["#0284c7"],

  tooltip: {
    theme: "dark",
  },

  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 10,
      borderRadiusApplication: "end",
    },
  },

  legend: {
    labels: {
      colors: "#fff",
    },
    position: "bottom" as "bottom",
  },
  noData: {
    text:"No data",
    align: 'center',
    verticalAlign: 'middle',
    offsetX: 0,
    offsetY: 0,
    style: {
      color: undefined,
      fontSize: '14px',
      fontFamily: undefined
    }
  }
};

export let horizontalOption = {
  chart: {
    id: "apexchart-example",
    toolbar: {
      show: true,
    },
  },

  xaxis: {
    categories: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    labels: {
        style: {
          colors: "#fff",
          fontSize: "12px",
        },
      },
  },
  colors: ["#0284c7"],

  tooltip: {
    theme: "dark",
  },

  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 5,
      borderRadiusApplication: 'end' as any,
    },
  },
};

export let pieOptions = {
  chart: {
    id: "apexchart-example",
  },

  stroke: {
    colors: ["#18181b"],
  },

  tooltip: {
    fillSeriesColor: true,
    theme: "dark",
    colors: [
      "#1abc9c",
      "#2ecc71",
      "#3498db",
      "#9b59b6",
      "#34495e",
      "#16a085",
      "#27ae60",
      "#2980b9",
      "#8e44ad",
      "#2c3e50",
      "#f1c40f",
      "#e67e22",
      "#e74c3c",
      "#ecf0f1",
      "#95a5a6",
      "#f39c12",
      "#d35400",
      "#c0392b",
      "#bdc3c7",
      "#7f8c8d",
    ],
  },

  fill: {
    colors: [
      "#1abc9c",
      "#2ecc71",
      "#3498db",
      "#9b59b6",
      "#34495e",
      "#16a085",
      "#27ae60",
      "#2980b9",
      "#8e44ad",
      "#2c3e50",
      "#f1c40f",
      "#e67e22",
      "#e74c3c",
      "#ecf0f1",
      "#95a5a6",
      "#f39c12",
      "#d35400",
      "#c0392b",
      "#bdc3c7",
      "#7f8c8d",
    ],
  },

  labels: [""],
  legend: {
    labels: {
      colors: "#fff",
    },
    position: "bottom" as "bottom",
    markers: {
      fillColors: [
        "#1abc9c",
        "#2ecc71",
        "#3498db",
        "#9b59b6",
        "#34495e",
        "#16a085",
        "#27ae60",
        "#2980b9",
        "#8e44ad",
        "#2c3e50",
        "#f1c40f",
        "#e67e22",
        "#e74c3c",
        "#ecf0f1",
        "#95a5a6",
        "#f39c12",
        "#d35400",
        "#c0392b",
        "#bdc3c7",
        "#7f8c8d",
      ],
    },
  },

  
};
export let lineOptions = {
  chart: {
    id: "apexchart-example",
    foreColor: '#373d3f',
    toolbar: {
      show: true,
    },
  },
  xaxis: {
    categories: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    labels: {
      style: {
        colors: "#fff",
        fontSize: "12px",
      },
    },
  },

  tooltip: {
    theme: "dark",
  },
};
