import React, { Fragment } from 'react';
import Parse from 'html-react-parser';

/* style */
import cx from 'classnames';
import style from './puntosDeVenta.css';
import stylePages from '../stylePages.css';

/* data */
import {
	puntoRetiroAcordeonLeft,
	puntoRetiroAcordeonRight,
} from './sucursales';

/* components */
import Collapsible from '../../Collapsible/Collapsible';
import CollapsibleItem from '../../Collapsible/CollapsibleItem';

const PuntosDeVenta = () => {
	return(
		<div className={stylePages.mainContent}>
			<section>
				<p className="red-text">
				{
					'IMPORTANTE: Los Tickets podrán ser recibidos o retirados'+' '+
					'únicamente por la persona que figura en la tarjeta de'+' '+
					'crédito utilizada contra presentación de DNI y tarjeta.'
				}
				</p>
				<h5>PUNTOS DE VENTA Y/O RETIRO DE ENTRADAS</h5>
				<p><i>
				{
					'Aquí podrás adquirir tus entradas de forma personal'+' '+
					'y/ó retirar compras vía Web o Call Center.'
				}
				</i></p>
			</section>
			<section className={style.gridC2C4C1C4} >
				<div>
					<img src="/img/pages/puntos-de-venta/logo_oca.jpg" alt=""/>
					<p>
						<strong>Ventas</strong><br/>
						Efectivo/tarjetas de crédito y Visa Débito.
					</p>

					<p>
						<strong>Retiro Compras Web/Call</strong><br/>
						Hasta tres días hábiles anteriores a la función.
					</p>
				</div>
				<div>
					<dl className={style.dl} >
							<dt><strong>OBELISCO - Cerrito 404</strong></dt>
							<dd>
									<p>Lunes a viernes 09:00 a 18:30 hs<br/>
									Sábado y domingos CERRADO.</p>
							<p>Costo de Entrega $105.-</p>
							<p className='red-text'>Cerrado.</p>
							</dd>
							<dt><strong>MICROCENTRO - Avda. Pte Roque Sáenz Peña 625</strong></dt>
							<dd>
									<p>Lunes a viernes 09:00 a 18:30 hs<br/>
									Sábado y domingos CERRADO.</p>
							<p>Costo de Entrega $105.-</p>
							<p className='red-text'>Cerrado.</p>
							</dd>
							<dt><strong>FLORES - Fray Cayetano Rodriguez 27</strong></dt>
							<dd>
									<p>Lunes a viernes 09:00 a 18:00 hs<br/>
									Sábado y domingos CERRADO.</p>
							<p>Costo de Entrega $105.-</p>
							<p className='red-text'>Cerrado.</p>
							</dd>
							<dt><strong>BELGRANO - José Hernández 2379</strong></dt>
							<dd>
									<p>Lunes a viernes 09:00 a 18:00 hs<br/>
									Sábado y domingos CERRADO.</p>
							<p>Costo de Entrega $105.-</p>
							<p className='red-text'>Cerrado.</p>
							</dd>
					</dl>
				</div>
			<div>{/*relleno*/}</div>
				<div>
					<dl className={style.dl}>
						<dt><strong>MORÓN - 9 de Julio 234</strong></dt>
						<dd>
								<p>Lunes a viernes 09:00 a 18:00 hs<br/>
								Sábado y domingos CERRADO.</p>
						<p>Costo de Entrega $105.-</p>
						<p className='red-text'>Cerrado.</p>
						</dd>
						<dt><strong>SAN ISIDRO - Belgrano 301</strong></dt>
						<dd>
								<p>Lunes a viernes 09:00 a 18:00 hs<br/>
								Sábado y domingos CERRADO.</p>
						<p>Costo de Entrega $105.-</p>
						<p className='red-text'>Cerrado.</p>
						</dd>
						<dt><strong>LOMAS DE ZAMORA - Hipólito Yrigoyen 8562</strong></dt>
						<dd>
								<p>Lunes a viernes 09:00 a 18:00 hs<br/>
								Sábado y domingos CERRADO.</p>
						<p>Costo de Entrega $105.-</p>
						<p className='red-text'>Cerrado.</p>
						</dd>
					</dl>
				</div>
			</section>
			<section className={style.gridC2C4C1C4} >
				<div>
					<img src="/img/pages/puntos-de-venta/ticketportal.jpg" alt=""/>
					<p>
						<strong>Ventas</strong><br/>
						Tarjetas de crédito y Visa Débito.
					</p>
					<p>
						<strong>Retiro Compras Web/Call</strong><br/>
						Hasta tres días hábiles anteriores a la función.
					</p>
				</div>
				<div>
					<dl className={style.dl} >
						<dt>PALERMO - Vidt 2084</dt>
						<dd>
							<p>Lunes a viernes 10:00 a 13:30 hs y 15:00 a 19:00 hs<br/>
							Sábado y domingos CERRADO.</p>
							<p>Sin Costo de Entrega -Con Cargo por Servicio-</p>
							<p className="red-text">Cerrado.</p>
						</dd>
					</dl>
				</div>
				<div>
					<img src="/img/pages/puntos-de-venta/efacil.jpg" alt=""/>
					<p>
						<strong>Ventas</strong><br/>
						Efectivo/tarjetas de crédito y Visa Débito.
					</p>
					<p>
						<strong>Retiro Compras Web/Call</strong><br/>
						Hasta tres días hábiles anteriores a la función.
					</p>
				</div>
				<div>
					<dl className={style.dl} >
						<dt>SAN MARTÍN - Intendente Campos 1901</dt>
						<dd>
								<p>Lunes a sábado 08:00 a 20:00 hs<br/>
								Domingos CERRADO.</p>
						<p>Costo de Entrega $105.-</p>
						<p className="red-text">Cerrado.</p>
						</dd>
					</dl>
				</div>
			</section>
			<section>
				<h5>PUNTOS DE RETIRO DE ENTRADAS</h5>
				<p><i>Aquí también podrás seleccionar para retirar tus entradas.</i></p>
			</section>
			<section className={style.gridC2C4C1C4} >
				<div>
					<img src="/img/pages/puntos-de-venta/lunpark.jpg" alt=""/>
					<p>
						<strong>Entrega</strong><br/>
						A partir de 24 hs hábiles.
					</p>
					<p>
						<strong>Retiro Compras Web/Call</strong><br/>
						Retiro hasta 01:00 hs antes del horario de la función.
					</p>
				</div>
				<div>
					<dl className={style.dl} >
						<dt>LUNA PARK - Retiro en Boletería - BOUCHARD 499</dt>
						<dd>
							<p>
								Lunes a viernes 14:00 a 19:00 hs<br/>
								Sábado y domingo con función desde las 16 hs.
							</p>
							<p></p>
							<p className="red-text">Cerrado.</p>
						</dd>
					</dl>
				</div>
			</section>
			<section>
				<h5>PUNTOS DE RETIRO DE ENTRADAS -SUCURSALES OCA-</h5>
				<p><i>
				{
					'Aquí encuentra la sucursal OCA habilitada más cercana'+' '+
					'a tu domicilio para el retiro de tus entradas.'
				}
				</i></p>
			</section>
			<section className={style.gridC2C4C4} >
				<div>
					<img src="/img/pages/puntos-de-venta/logo_oca.jpg" alt=""/>
					<p>
						<strong>Entrega</strong><br/>
						A partir de los 7 (siete) días hábiles.
					</p>
					<p>
						<strong>Retiro</strong><br/>
						Hasta tres días hábiles anteriores a la función.
					</p>
					<p>
					{
						'Costo de Entrega $105.- En Ciudad Autónoma de'+' '+
						'Buenos Aires, Buenos Aires e interior del país.'
					}
					</p>
					<p className="red-text">
					{
						'Los Tickets podrán ser recibidos o retirados únicamente por la persona'+' '+
						'que figura en la tarjeta de crédito utilizada para la compra.'+' '+
						'Recuerde que deberá presentar dicha tarjeta y una identificación (DNI-CI-PASAPORTE).'
					}
					</p>
				</div>
				<div>
					<Collapsible accordion className={style.collapsible}>
					{
						puntoRetiroAcordeonLeft.map((el, key) => {
							return(
								<CollapsibleItem
									key={key}
									node="div"
									expanded={false}
									header={Parse(el.header)}
									className={style.collapsibleItem}
									classNameBody={style.collapsibleItemBody}
									classNameHeader={style.collapsibleItemHeader}
								>
									<ul>
									{
										el.body.map((el, key) => {
											let child;
											if(typeof el == 'object') {
												child = (
													<p>
														<strong>{Parse(el.nombre)}</strong>{' ' + el.direccion}<br/>
														{el.horario}
													</p>
												)
											} else {
												child = el;
											}
											return(
												<li key={key} >
													{child}
												</li>
											)
										})
									}
									</ul>
								</CollapsibleItem>
							)
						})
					}
					</Collapsible>
				</div>
				<div>
					<Collapsible accordion className={style.collapsible}>
					{
						puntoRetiroAcordeonRight.map((el, key) => {
							return(
								<CollapsibleItem
									key={key}
									node="div"
									expanded={false}
									header={Parse(el.header)}
									className={style.collapsibleItem}
									classNameBody={style.collapsibleItemBody}
									classNameHeader={style.collapsibleItemHeader}
								>
									<ul>
									{
										el.body.map((el, key) => {
											let child;
											if(typeof el == 'object') {
												child = (
													<p>
														<strong>{Parse(el.nombre)}</strong>{' ' + el.direccion}<br/>
														{el.horario}
													</p>
												)
											} else {
												child = el;
											}
											return(
												<li key={key} >
													{child}
												</li>
											)
										})
									}
									</ul>
								</CollapsibleItem>
							)
						})
					}
					</Collapsible>
				</div>
			</section>
		</div>
	)
}

export default PuntosDeVenta;