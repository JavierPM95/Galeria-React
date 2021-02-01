/* Dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Provider from './context/Provider';
import reducers from './reducers/';

/* Components */
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const Main = (
	<ErrorBoundary>
		<BrowserRouter basename='/'>
			<Provider reducer={reducers}>
				<App/>
			</Provider>
		</BrowserRouter>
	</ErrorBoundary>
);

ReactDOM.render(Main, document.getElementById('app'));