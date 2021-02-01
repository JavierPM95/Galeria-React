import combineReducers from './combineReducers';
import menu from './menu';
import login from './login';
import evento from './evento';

const reducer = combineReducers({
	menu,
	login,
	evento
});

export default reducer;
