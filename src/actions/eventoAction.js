import httpClient from '../utils/axios';
import {
	BUYING,
	GET_EVENTO,
	SET_EVENTO,
	RESET_EVENTO,
	STARTING_PURCHASE,
} from '../constants';

/*
 * @param {Object} payload | evento id 
 * @param {Function} dispatch
*/
export const setEvento = async ({ id, history }, dispatch) => {

	dispatch({
		type: GET_EVENTO,
		payload: {
			isFetching: true
		}
	})

	// let { data } = await httpClient.apiGet(`evento/9000`);
	let { data } = await httpClient.apiGet(`evento/${id}`);

	if(!data) return history.replace('/404');

	dispatch({
		type: SET_EVENTO,
		payload: {
			isEmpty: false,
			isFetching: false,
			...data
		}
	})
}

export const resetEvento =  () => {
	return {
		type: RESET_EVENTO
	}
}

/*
 * Guardar los datos de la función que se quiere comprar en el store
 * @param object $data Información de la fecha seleccionada
 * @param object $session Información guardada en sessionStorage
 * del último evento y función al que accedio el usuario
*/
export const buyTicket = (data, session = null) => ({
	type: STARTING_PURCHASE,
	payload: (session) ? {
		...session,
		startingPurchase: false,
	} :
	{
		startingPurchase: true,
		fechaSeleccionada: data
	}
});