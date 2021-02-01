import {
	TOGGLE_CATEGORIES
} from '../constants';
const init = {
  mostrarCategorias: true
};

const menu = (state = init, action) => {
	switch(action.type) {
		case TOGGLE_CATEGORIES:
			return { ...state, ...action.payload };
		default:
			return state;
	}
};

export default menu;
