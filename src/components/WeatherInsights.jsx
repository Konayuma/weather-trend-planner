import React from 'react';

function WeatherInsights({ insightText }) {
	return (
		<section className="weather-insights" aria-label="Insight">
			<div className="weather-insights__title">Insight:</div>
			<div className="weather-insights__rule" />
			<p>{insightText}</p>
		</section>
	);
}

export default WeatherInsights;
