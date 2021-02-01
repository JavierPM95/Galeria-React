import {
	BUYING,
	GET_EVENTO,
	SET_EVENTO,
	RESET_EVENTO,
	STARTING_PURCHASE,
} from '../constants';

const init = {
	isEmpty: true,
	startingPurchase: false,
	isFetching: false,
};

const evento = (state = init, action) => {
	switch(action.type) {
		case SET_EVENTO:
		case GET_EVENTO:
		case STARTING_PURCHASE:
			return { ...state, ...action.payload };
			break;
		case RESET_EVENTO:
			/*
			 * Si se inicio el proceso de compra (startingPurchase = true)
			 * se conserva el state (evento) para la representación del mapa
			 * estando ya en el <ProcesoDeCompra/>  startingPurchase debe pasar a false
			 */
			return (state.startingPurchase) ? state : init;
			break;
		case BUYING:
			return { ...state, startingPurchase: false }
			break;
		default:
			return state;
	}
};

export default evento;
