import React from 'react';

/* style */
import cx from 'classnames';
import stylePages from '../stylePages.css';

const Ayuda = () => {
	return(
		<div className={stylePages.mainContent} >
			<h3>GUÍA DE COMPRA</h3>
			<section>
				<h6><b>
					Cómo comprar entradas.
				</b></h6>
				<ul className='browser-default'>
						<li>
						{
							'Para adquirir entradas deberá registrarse en nuestro sitio ingresando'+' '+
							'en "Mi Cuenta", generando un usuario con sus datos personales e indicando'+' '+
							'una cuenta de email la cual será validada. Le recomendamos no prestar su'+' '+
							'cuenta a terceras personas. Le recordamos que solamente la persona que'+' '+
							'figura en el frente de la tarjeta de crédito utilizada para la compra'+' '+
							'podrá retirar o recibir las entradas.'
						}
						</li>
						<li>
						{
							'Seleccione el evento de su interés. A continuación, se mostrará los valores'+' '+
							'de referencia, mapa del recinto, funciones disponibles, gacetilla del'+' '+
							'espectáculo, tarjeta habilitadas, promociones bancarias si las hubiese,'+' '+
							'e información general. Haga clic en "COMPRAR" la función de su preferencia.'
						}
						</li>
						<li>
						{
							'Complete el "Captcha". Ingrese su email y contraseña. En caso de haber olvidado'+' '+
							'su clave de acceso haga clic en "Recuperar clave" e ingrese el email con el que'+' '+
							'se registró en nuestro sitio. En caso de no poseer usuario deberá crearlo en'+' '+
							'"Registrarse" a fin de poder continuar navegando.'
						}
						</li>
						<li>Selección de sus entradas. A continuación, se mostrará los valores de referencia, mapa del recinto, funciones disponibles y sectores habilitados a la venta. Usted podrá hacer clic directamente sobre el mapa ingresando el sector de su preferencia, o bien por el desplegable seleccionando el sector. Se mostrará el mapa de asientos, donde podrá elegir los asientos simplemente haciendo clic. Recuerde que puede navegar entre las funciones disponibles y/o diferentes sectores habilitados.</li>
						<li>Método de pago y retiro. Seleccione el tipo de tarjeta y cuotas si las hubiese. Ingrese DNI, nombre y apellido. Seleccione el método de retiro o envío de sus tickets. Las opciones pueden variar dependiendo la fecha de compra.</li>
						<li>Confirmación. Aquí podrá visualizar un resumen de su operación de compra. Acepté las políticas de privacidad y términos de uso y haga clic "Continuar", donde será redirigido al "Sitio de pago". En caso de aprobar la compra, el sistema le indicará el "número de orden" de su compra. Automáticamente se enviará un email de confirmación con todos los datos de la operación realizada. Recuerde que para retirar o recibir las entradas la persona que figura en el frente de la tarjeta de crédito utilizada deberá presentar DNI y tarjeta de crédito.</li>
						<li>Para una mejor experiencia recomendamos utilizar las últimas versiones de los siguientes navegadores: Chrome, Opera, Firefox, Safari.</li>
					</ul>

					<h6><b>
						Métodos de Entrega
					</b></h6>
					<p>
						Los Tickets podrán ser recibidos o retirados únicamente por la persona que figura en la tarjeta de crédito utilizada para la compra. Recuerde que deberá presentar dicha tarjeta y una identificación (DNI-CI-PASAPORTE).
					</p>

					<h6><b>
						ENVÍO EXPRESS. $200
					</b></h6>
					<p>
						Solo Ciudad Autónoma de Buenos Aires, desde el CPA 1001 al 1440 1 (una) sola visita, dentro de las 72 hs hábiles posteriores a la compra de 09 a 18 hs.
					</p>

					<h6><b>
						ENVÍO SIMPLE. $195
					</b></h6>
					<p>Solo Ciudad Autónoma de Buenos Aires y Gran Buenos Aires. 2 (dos) visitas, dentro de los 10 días hábiles posteriores a la compra de 09 a 18 hs.</p>

					<h6><b>
						ENVÍO INTERIOR. $235
					</b></h6>
					<p>Desde el CPA 1981 en adelante, dentro de los 13 días hábiles posteriores a la compra de 09 a 18 hs.</p>

					<h6><b>
						RETIRO EN SUCURSALES OCA PUNTO DE VENTA. $105
					</b></h6>
					<p>
						A partir de las 24 hs. Retiro hasta tres días hábiles anteriores a la función.
					</p>

					<h6><b>
						RETIRO EN SUCURSALES OCA (CABA, GBA e INTERIOR). $105
					</b></h6>
					<p>
						A partir de los 7 (siete) días hábiles. Retiro hasta tres días hábiles anteriores a la función.
					</p>

					<h6><b>
						RETIRO EN SUCURSAL SAN MARTÍN. $105
					</b></h6>
					<p>
						A partir de las 72 hs hábiles. Retiro hasta tres días hábiles anteriores a la función.
					</p>

					<h6><b>
						RETIRO EN LUNA PARK. $170
					</b></h6>
					<p>
						A partir de las 24 hs, o hasta el día del evento hasta 1 hs antes del horario de la función.
					</p>

					<h6><b>
						Call Center.
					</b></h6>
					<p>
						Venta Telefónica. De lunes a viernes 09 a 21 hs, sábado y domingos y feriados 10 a 18 hs. <br/>
						Atención al Cliente. De lunes a sábado 12 a 18 hs. <br/>
						Costo adicional por venta telefónica por entrada: <b>$45.-</b>
					</p>

					<h6>
						<b>E TICKET</b> Consulte los eventos disponibles.
					</h6>
					<p>
						Para imprimir su e-ticket, se necesita un programa que pueda abrir documentos PDF (por ejemplo Adobe Acrobat Reader). El servicio de e-ticket solo estará disponible para los eventos señalados, lo que puede ser comprobado al momento de la compra de las entradas. Ticketportal S.A. no es ni será responsable por problemas o dificultades que se originen por la impresión, copia, adulteración o mal estado de los e-tickets. El cliente no deberá pagar ningún cargo adicional por el envío del e-ticket.
					</p>
					<p>
						Condiciones del servicio: El comprador de la entrada asume toda responsabilidad en caso de que dicha entrada se presente por duplicado, fotocopiada o falsificada, perdiendo todos los derechos que ésta le otorga para poder acceder al evento. Cualquier entrada arrugada, rota o que presente indicios de falsificación autorizará al organizador a privar a su portador del acceso al evento. Solo se considerará válida la primera entrada presentada, y en ningún caso se permitirá entrar a quienes posteriormente lo intenten con la misma entrada. Diríjase a la entrada del evento donde validarán sus entradas con el scanner del control de accesos. Recuerde que al entrar en el evento pueden pedirle que se identifique facilitando algún dato de la compra (tarjeta de crédito, documento de identidad, e-mail, etc.). El e-ticket es intransferible. Puede imprimir su entrada tanto en una impresora color o blanco y negro, en cualquier momento desde que reciba el mail correspondiente. No se admitirán cambios o devoluciones de los e-tickets, excepto en caso de cancelación del evento. En este supuesto, el reembolso del importe se efectuará en la misma tarjeta de crédito utilizada para la compra. La posesión de este e-ticket no da derecho a utilizar la misma con fines publicitarios, de marketing o de promoción. Ticketportal S.A. no es la organizadora, productora y/o promotora de los eventos o espectáculos cuyas entradas comercializa. Ticketportal S.A. se limita a vender entradas por cuenta y orden de los organizadores, empresarios, realizadores, productores y/o promotores (en adelante los “Promotores”) de los respectivos eventos cuyos datos se encuentran impresos en el anverso de las entradas. Ticketportal S.A. pone a disposición de los clientes la venta de entradas para determinados eventos organizados y/o producidos por los Promotores a través del sitio www.ticketportal.com.ar. El cliente declara conocer que la realización de cualquier evento, del que compre sus entradas a través del sistema Ticketportal S.A. no depende de Ticketportal S.A. y que toda responsabilidad es de los promotores, cuyo nombre e identificación aparecen en la Entrada y de él dependen los horarios, condiciones de seguridad, ubicaciones, realización, organización o contenido del Evento.
					</p>
			</section>
		</div>
	);
}

export default Ayuda;