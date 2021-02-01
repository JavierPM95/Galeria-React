import React from 'react';

function NotFoundPage(props) {
	return (
		<div>
			<h1>404 - Página <code>'{props.location.pathname}'</code> no encontrada!!!</h1>
			<p>¡Inténtalo de nuevo!</p>
		</div>
	);
};

export default NotFoundPage;
