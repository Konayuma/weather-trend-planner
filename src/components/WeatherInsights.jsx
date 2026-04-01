import React from 'react';

function WeatherInsights({ insights = [] }) {
	return (
		<section className="weather-insights" aria-label="Insight">
			<div className="weather-insights__title">Insight:</div>
			<div className="weather-insights__rule" />
			{insights.map((insight, index) => (
				<p key={`${insight}-${index}`}>{insight}</p>
			))}
		</section>
	);
}

export default WeatherInsights;
