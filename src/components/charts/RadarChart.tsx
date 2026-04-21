"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface RadarData {
  axis: string;
  value: number;
}

export default function RadarChart({ data, color = "#2563eb" }: { data: RadarData[], color?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const size = 300;
  const margin = 40;
  const radius = (size / 2) - margin;

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", `translate(${size / 2}, ${size / 2})`);

    const angleSlice = (Math.PI * 2) / data.length;
    const rScale = d3.scaleLinear().range([0, radius]).domain([0, 100]);

    // Draw circular grid lines
    const levels = 5;
    for (let i = 0; i < levels; i++) {
        const r = (radius / levels) * (i + 1);
        g.append("circle")
         .attr("r", r)
         .attr("fill", "none")
         .attr("stroke", "#e2e8f0")
         .attr("stroke-dasharray", "4,4");
    }

    // Draw axes
    const axis = g.selectAll(".axis")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => rScale(100) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => rScale(100) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", "1px");

    axis.append("text")
      .attr("class", "legend")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d, i) => rScale(115) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (d, i) => rScale(115) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d.axis)
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .style("fill", "#64748b");

    // Draw radar polygon
    const radarLine = d3.lineRadial<RadarData>()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    g.append("path")
      .datum(data)
      .attr("d", radarLine)
      .attr("fill", color)
      .attr("fill-opacity", 0.1)
      .attr("stroke", color)
      .attr("stroke-width", 3)
      .style("filter", "drop-shadow(0 0 4px rgba(0,0,0,0.1))");

    // Add dots
    g.selectAll(".radarCircle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 4)
      .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("fill", color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

  }, [data, color]);

  return (
    <div className="flex justify-center">
      <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`} />
    </div>
  );
}
