import React, { useEffect, useState } from 'react';

export default function LocationShow() {
	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);

	useEffect(() => {
		// Get user's location
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setLatitude(position.coords.latitude);
				setLongitude(position.coords.longitude);
			},
			(error) => {
				console.error('Error getting location:', error);
			}
		);
	}, []);

	return (
		<div className='p-4'>
			Latitude: {latitude}
			<br />
			Longitude: {longitude}
		</div>
	);
}