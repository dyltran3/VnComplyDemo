"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function D3SystemMetrics({ data, color = "#adc6ff" }: { data: number[], color?: string }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // Clear old chart
    d3.select(chartRef.current).selectAll("*").remove();

    const width = chartRef.current.clientWidth;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line<number>()
      .x((d, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveMonotoneX);

    // Add axes
    const xAxis = d3.axisBottom(x).ticks(5).tickFormat(() => "");
    const yAxis = d3.axisLeft(y).ticks(5);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .attr("color", "rgba(255,255,255,0.2)");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .attr("color", "rgba(255,255,255,0.2)");

    // Add grid lines
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right).tickFormat(() => ""))
      .attr("color", "rgba(255,255,255,0.05)");

    // Add glowing line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 3)
      .attr("d", line)
      .style("filter", "drop-shadow(0px 4px 6px rgba(0,0,0,0.5))");

    // Add area fill
    const area = d3.area<number>()
      .x((d, i) => x(i))
      .y0(height - margin.bottom)
      .y1(d => y(d))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("fill", color)
      .attr("opacity", 0.1)
      .attr("d", area);

  }, [data, color]);

  return <div ref={chartRef} className="w-full h-[200px]" />;
}
