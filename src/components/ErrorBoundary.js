import React, { Component } from 'react';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		// Actualiza el estado para que el siguiente renderizado muestre la interfaz de repuesto
		console.log('error', error);
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		// También puedes registrar el error en un servicio de reporte de errores
		// logErrorToMyService(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			// Puedes renderizar cualquier interfaz de repuesto
			return <h3>Error - los datos recibidos de la DB son incorrectos</h3>;
		}

		return this.props.children; 
	}
}

export default ErrorBoundary;