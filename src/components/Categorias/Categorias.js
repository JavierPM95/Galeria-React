import React from 'react';
import { useParams } from "react-router-dom";

const Categorias = (props) => {
	let { categoria } = useParams();
	
	return(
	<div>
		<h1>{ categoria }</h1>
	</div>
	)
}

export default Categorias;