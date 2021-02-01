const empty = (value) => (value && value.trim()) ? false : true;
const serealizeData = (data) => {
	const FD = new FormData();
	const {
		promoId,
		asientos,
		eventoId,
		subtotal,
		sectorId,
		direccion,
		clienteId,
		funcionId,
		tipoEnvio,
		zonaEnvio,
		puntoVenta,
		claseEnvio,
		cargoEnvio,
		numberCard,
		holderName,
		subtipoEnvio,
		securityCode,
		cargoServicio,
		sucursalCorreo,
		expirationDate,
		guardarTarjeta,
		ordenDeCompraId,
		estacionamiento,
		mediosDePagoValidos,
		tarjetaCargadaValue,
	} = data;

	FD.append('promoId', promoId);
	FD.append('eventoId', eventoId);
	FD.append('sectorId', sectorId);
	FD.append('clienteId', clienteId);
	FD.append('funcionId', funcionId);
	FD.append('tipoEnvio', tipoEnvio);
	FD.append('zonaEnvio', zonaEnvio);
	FD.append('puntoVenta', puntoVenta);
	FD.append('octId', ordenDeCompraId);
	FD.append('claseEnvio', claseEnvio);
	FD.append('valorNetoTotal', subtotal);
	FD.append('cargoTTDE', cargoServicio);
	FD.append('subtipoEnvio', subtipoEnvio);
	FD.append('cargoEnvio', cargoEnvio.value);
	FD.append('valorNeto', asientos.valorNeto);
	FD.append('sucursalCorreo', sucursalCorreo);
	FD.append('direccion', (empty(direccion)) ? '' : direccion);
	FD.append('mediosDePagoValidos', JSON.stringify(mediosDePagoValidos));


	const asientosIds = (asientos.dataAsientos[0].hasOwnProperty('numerado')) ?
						asientos.dataAsientos.length :
						JSON.stringify(asientos.dataAsientos.map(elem => elem.id.split('-')[0]));

	FD.append('asientosIds', asientosIds);

	let cargoEstacionar = (estacionamiento.active) ? estacionamiento.value : 0;
	FD.append('cargoEstacionar', cargoEstacionar);

	let valorTotal = parseInt(subtotal) + parseInt(cargoServicio);
	valorTotal += parseInt(cargoEnvio.value) + parseInt(cargoEstacionar);
	FD.append('valorTotal', valorTotal);

	if(tarjetaCargadaValue) {
		let tarjeta = JSON.parse(tarjetaCargadaValue);
		FD.append('psp_Product', tarjeta.medioPagoCod);
		FD.append('paymentMethodId', tarjeta.paymentMethodId);
	} else {
		FD.append('numberCard', numberCard);
		FD.append('holderName', holderName);
		FD.append('securityCode', securityCode);
		FD.append('expirationDate', expirationDate);
		FD.append('guardarTarjeta', guardarTarjeta);
	}
	return FD;
}

export default serealizeData;