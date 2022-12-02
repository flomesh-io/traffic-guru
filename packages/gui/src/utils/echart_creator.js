function renderDataChart(resArray, echarts) {
  let series = [];
  let legend = [];
  let xAxisLength = 0;
  if (resArray) {
    resArray.forEach((res) => {
      if (res.DurationHistogram && res.DurationHistogram.Data) {
        let _data = [];
        res.DurationHistogram.Data.forEach((_d) => {
          let start = Math.ceil(1000.0 * _d.Start);
          let end = Math.ceil(1000.0 * _d.End);
          _data.push({
            type: "start",
            value: [start, _d.Count],
            start,
            end,
            lantency: end - start,
            count: _d.Count,
            percent: Math.ceil(_d.Percent),
          });
          _data.push({
            type: "end",
            value: [end, _d.Count],
            start,
            end,
            lantency: end - start,
            count: _d.Count,
            percent: Math.ceil(_d.Percent),
          });
          if (xAxisLength < end) {
            xAxisLength = end;
          }
        });
        let _name = `pipy-${res.StartTime.split(".")[0]}`;
        legend.push(_name);
        series.push({
          name: _name,
          type: "line",
          symbol: "none",
          areaStyle: {},
          smooth: false,
          data: _data,
        });
      }
    });
  }
  createChart(
    {
      id: "DataChart",
      title: "TPS",
      hasZoom: true,
      legend: legend,
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          let _str = "";
          params.forEach((item) => {
            if (item.data.type == "end") {
              _str += `<span style="background:${item.color};width:10px;height:10px;display:inline-block;margin-right:10px"></span>${item.data.start}ms ~ ${item.data.end}ms (${item.data.lantency}ms) / ${item.data.count} (${item.data.percent}%)<br/>`;
            }
          });
          return _str;
        },
      },
      xAxisLength,
      xAxis: {
        name: "(ms)",
        max: xAxisLength,
        type: "value",
      },
      yAxis: {},
      series,
    },
    echarts,
  );
}

function renderPercentilesChart(resArray, echarts) {
  let series = [];
  let legend = [];
  let xAxis = [];
  if (resArray) {
    resArray.forEach((res) => {
      if (res.DurationHistogram && res.DurationHistogram.Percentiles) {
        xAxis = [];
        let _data = [];
        _data.push({ value: 0 });
        xAxis.push(0);
        res.DurationHistogram.Percentiles.forEach((_d) => {
          _data.push({ value: 1000.0 * _d.Value });
          xAxis.push(_d.Percentile);
        });
        let _name = `pipy-${res.StartTime.split(".")[0]}`;
        legend.push(_name);
        series.push({
          name: _name,
          type: "line",
          areaStyle: {},
          // stack: 'Total',
          smooth: true,
          data: _data,
        });
      }
    });
  }
  createChart(
    {
      id: "PercentilesChart",
      title: "Latency P99",
      legend: legend,
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        data: xAxis,
        name: "(%)",
        boundaryGap: false,
        type: "category",
      },
      yAxis: {
        name: "(ms)",
      },
      series,
    },
    echarts,
  );
}

function createChart(props, echarts) {
  let dom = document.getElementById(props.id);
  if (dom) {
    echarts.dispose(dom);
  }
  let myChart = echarts.init(dom);
  let option;
  option = {
    title: {
      text: props.title,
    },
    tooltip: props.tooltip,
    legend: {
      data: props.legend,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: props.hasZoom ? "60px" : "10px",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    dataZoom: props.hasZoom
      ? [
          {
            type: "slider",
            start: 0,
            end: 100,
            labelFormatter: function (value) {
              return "" + Math.ceil((value * 100) / props.xAxisLength) + "%";
            },
          },
        ]
      : null,
    xAxis: props.xAxis,
    yAxis: {
      boundaryGap: true,
      name: props.yAxis.name,
      type: "value",
    },
    series: props.series,
  };

  if (option && typeof option === "object") {
    myChart.setOption(option);
  }
}

export { renderPercentilesChart, renderDataChart };
