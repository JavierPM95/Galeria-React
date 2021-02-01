import React from 'react';
import Parse from 'html-react-parser';

/* Style */
import style from './valoresDeReferencia.css';
import cx from 'classnames';

const ValoresDeReferencia = ({
	titulo,
	valores,
	mapaSVG
}) => {
	return(
		<div className={style.contentValoresDeReferencia} >
			<div className="row">
				<div className="col s12">
					<h2 className={style.titulo} >{titulo}</h2>
					<h3 className={style.subtitulo} >Valores de referencia</h3>
					<div className='linea-titulo' ></div>
				</div>
			</div>
			<div className="row">
				<div className="col s12 l7 xl5">
					<div className={style.tablaDeReferencias} >
						<table>
							<thead>
								<tr>
										<th colSpan="2">&nbsp;</th>
										<th className={style.headValor} >Valor en un pago</th>
										<th className={style.headCargo} >Cargo de servicio</th>
								</tr>
							</thead>

							<tbody>
								{
									valores.map((valor, index) => {
										return(
											<tr key={index} className={style.rowTable} >
												<td style={{background: valor.colorReferencia}} className={style.color} ></td>
												<td className={style.texto} >
													<p>{valor.nombreSector}</p>
													<span>{valor.subtituloNumeracion}</span>
												</td>
												<td className={style.valor}>{valor.valorNeto}</td>
												<td className={style.cargo}>{valor.cargoTTDE}</td>
											</tr>
										)
									})
								}
							</tbody>
						</table>
					</div>
				</div>
				<div className="col s12 l5 xl7">
					{ Parse(mapaSVG) }
				</div>
			</div>
		</div>
	)
};

export default ValoresDeReferencia;