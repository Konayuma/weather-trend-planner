import React from 'react';

const chartWidth = 640;
const chartHeight = 230;

function WeatherChart({ forecastData = [] }) {
	const points = forecastData.length > 0 ? forecastData : [];
	const minTemp = -10;
	const maxTemp = 30;
	const paddingX = 28;
	const paddingTop = 24;
	const paddingBottom = 36;
	const plotHeight = chartHeight - paddingTop - paddingBottom;
	const plotWidth = chartWidth - paddingX * 2;
	const clampTemp = (temp) => Math.min(maxTemp, Math.max(minTemp, temp));

	const xForIndex = (index) => paddingX + (plotWidth / Math.max(points.length - 1, 1)) * index;
	const yForTemp = (temp) => {
		const normalized = (clampTemp(temp) - minTemp) / (maxTemp - minTemp);
		return paddingTop + (1 - normalized) * plotHeight;
	};

	const path = points
		.map((point, index) => `${index === 0 ? 'M' : 'L'} ${xForIndex(index)} ${yForTemp(point.temp)}`)
		.join(' ');

	const gridLines = [-10, 0, 10, 20, 30];

	return (
		<section className="weather-chart" aria-label="Temperature trend">
			<h2>Temperature Trend</h2>
			<div className="weather-chart__rule" />
			<div className="weather-chart__wrap">
				<div className="weather-chart__axis-label">Temperature (°C)</div>
				<svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="weather-chart__svg" role="img" aria-label="Temperature trend chart">
					{gridLines.map((tick) => {
						const y = yForTemp(tick);
						return <line key={tick} x1="28" x2={chartWidth - 28} y1={y} y2={y} className="weather-chart__grid" />;
					})}

					<line x1="28" x2="28" y1="24" y2={chartHeight - 36} className="weather-chart__axis" />
					<line x1="28" x2={chartWidth - 28} y1={chartHeight - 36} y2={chartHeight - 36} className="weather-chart__axis" />

					{gridLines.map((tick) => (
						<text key={`label-${tick}`} x="18" y={yForTemp(tick) + 4} className="weather-chart__tick-label">
							{tick}
						</text>
					))}

					{points.map((point, index) => {
						const x = xForIndex(index);
						return (
							<g key={`${point.day}-${index}`}>
								<line x1={x} x2={x} y1={chartHeight - 36} y2={chartHeight - 28} className="weather-chart__tick" />
								<text x={x} y={chartHeight - 12} textAnchor="middle" className="weather-chart__day-label">
									{point.day || point.date}
								</text>
								<circle cx={x} cy={yForTemp(point.temp)} r="5.5" className="weather-chart__dot" />
							</g>
						);
					})}

					<path d={path} className="weather-chart__line" />
				</svg>
			</div>
		</section>
	);
}

export default WeatherChart;
