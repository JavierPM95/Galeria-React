const baseUrl = 'img/develop/';
const dummyApi = {
	data: {
		banners: [
			{
				id: 1,
				date: '15 al 25 de Marzo',
				title: 'Dave Matthews Band 1',
				location: 'Estadio único La Plata 1',
				imgUrl: `${baseUrl}dummyRemote/dave-matthews-band-1.jpg`
			},
			{
				id: 2,
				date: '16 al 26 de Marzo',
				title: 'Dave Matthews Band 2',
				location: 'Estadio único La Plata 2',
				imgUrl: `${baseUrl}dummyRemote/dave-matthews-band-2.jpg`
			},
			{
				id: 3,
				date: '17 al 27 de Marzo',
				title: 'Dave Matthews Band 3',
				location: 'Estadio único La Plata 4',
				imgUrl: `${baseUrl}dummyRemote/dave-matthews-band-3.jpg`
			}
		],
		destacadoChico: [
			{
				id: 1,
				date: '22 de abril',
				title: 'Paul McCartney',
				location: 'estadio river plate',
				imgUrl: `${baseUrl}dummyRemote/paul-mccartney.jpg`,
				link: '#'
			},
			{
				id: 2,
				date: '22 de abril',
				title: 'Red Hot Chili Peppers',
				location: 'estadio river plate',
				imgUrl: `${baseUrl}dummyRemote/red-hot-chilli-peppers.jpg`,
				link: '#'
			},
			{
				id: 3,
				date: '22 de abril',
				title: 'Alice in Chains',
				location: 'estadio river plate',
				imgUrl: `${baseUrl}dummyRemote/alice-in-chains.jpg`,
				link: '#'
			},
			{
				id: 4,
				date: '22 de abril',
				title: 'Paul McCartney 4',
				location: 'estadio river plate',
				imgUrl: `${baseUrl}dummyRemote/paul-mccartney.jpg`,
				link: '#'
			},
			{
				id: 5,
				date: '22 de abril',
				title: 'Red Hot Chili Peppers 5',
				location: 'estadio river plate',
				imgUrl: `${baseUrl}dummyRemote/red-hot-chilli-peppers.jpg`,
				link: '#'
			},
			{
				id: 6,
				date: '22 de abril',
				title: 'Alice in Chains 6',
				location: 'estadio river plate',
				imgUrl: `${baseUrl}dummyRemote/alice-in-chains.jpg`,
				link: '#'
			}
		],
		destacadosGrandes: [
			{
				id: 1,
				title: 'Alice in Chains 1',
				imgUrl: `${baseUrl}dummyRemote/080619_ER.jpg`,
				link: '#'
			},
			{
				id: 2,
				title: 'Alice in Chains 2',
				imgUrl: `${baseUrl}dummyRemote/180519_DiegoTorres4.jpg`,
				link: '#'
			},
			{
				id: 3,
				title: 'Alice in Chains 3',
				imgUrl: `${baseUrl}dummyRemote/240519_IlDivo.jpg`,
				link: '#'
			},
			{
				id: 4,
				title: 'Alice in Chains 4',
				imgUrl: `${baseUrl}dummyRemote/09082019_Redimi2_2.jpg`,
				link: '#'
			},
			{
				id: 5,
				title: 'Alice in Chains 9',
				imgUrl: `${baseUrl}dummyRemote/180519_DiegoTorres4.jpg`,
				link: '#'
			},
			{
				id: 6,
				title: 'Alice in Chains 7',
				imgUrl: `${baseUrl}dummyRemote/14092019_Natiruts.jpg`,
				link: '#'
			},
			{
				id: 7,
				title: 'Alice in Chains 8',
				imgUrl: `${baseUrl}dummyRemote/17052019_DiosSalvealaReina.jpg`,
				link: '#'
			},
			{
				id: 8,
				title: 'Alice in Chains 6',
				imgUrl: `${baseUrl}dummyRemote/06062019_DaryllHallandJohnOates.jpg`,
				link: '#'
			},
			{
				id: 9,
				title: 'Alice in Chains 5',
				imgUrl: `${baseUrl}dummyRemote/08082019_UlisesBueno.jpg`,
				link: '#'
			},
			{
				id: 10,
				title: 'Alice in Chains 10',
				imgUrl: `${baseUrl}dummyRemote/17052019_DiosSalvealaReina.jpg`,
				link: '#'
			},
			{
				id: 11,
				title: 'Alice in Chains 11',
				imgUrl: `${baseUrl}dummyRemote/14092019_Natiruts.jpg`,
				link: '#'
			},
			{
				id: 12,
				title: 'Alice in Chains 12',
				imgUrl: `${baseUrl}dummyRemote/06062019_DaryllHallandJohnOates.jpg`,
				link: '#'
			},
			{
				id: 13,
				title: 'Alice in Chains 13',
				imgUrl: `${baseUrl}dummyRemote/08082019_UlisesBueno.jpg`,
				link: '#'
			},
			{
				id: 14,
				title: 'Alice in Chains 14',
				imgUrl: `${baseUrl}dummyRemote/09082019_Redimi2_2.jpg`,
				link: '#'
			},
			{
				id: 15,
				title: 'Alice in Chains 15',
				imgUrl: `${baseUrl}dummyRemote/240519_IlDivo.jpg`,
				link: '#'
			},
			{
				id: 16,
				title: 'Alice in Chains 16',
				imgUrl: `${baseUrl}dummyRemote/080619_ER.jpg`,
				link: '#'
			}
		],
		proximamente: [
			{
				id: 1,
				title: 'Ariana Grande',
				imgUrl: `${baseUrl}dummyRemote/ariana-grande.jpg`,
				link: '#'
			},
			{
				id: 2,
				title: 'Color Festival',
				imgUrl: `${baseUrl}dummyRemote/color-festival.jpg`,
				link: '#'
			},
			{
				id: 3,
				title: 'Jazz Festival',
				imgUrl: `${baseUrl}dummyRemote/jazz-festival.jpg`,
				link: '#'
			},
			{
				id: 4,
				title: 'Rock Party',
				imgUrl: `${baseUrl}dummyRemote/rock-party.jpg`,
				link: '#'
			},
			{
				id: 5,
				title: 'Shakira',
				imgUrl: `${baseUrl}dummyRemote/shakira.jpg`,
				link: '#'
			},
			{
				id: 6,
				title: 'Ariana Grande',
				imgUrl: `${baseUrl}dummyRemote/ariana-grande.jpg`,
				link: '#'
			},
			{
				id: 7,
				title: 'Color Festival',
				imgUrl: `${baseUrl}dummyRemote/color-festival.jpg`,
				link: '#'
			},
			{
				id: 8,
				title: 'Jazz Festival',
				imgUrl: `${baseUrl}dummyRemote/jazz-festival.jpg`,
				link: '#'
			},
			{
				id: 9,
				title: 'Rock Party',
				imgUrl: `${baseUrl}dummyRemote/rock-party.jpg`,
				link: '#'
			},
			{
				id: 10,
				title: 'Shakira',
				imgUrl: `${baseUrl}dummyRemote/shakira.jpg`,
				link: '#'
			}
		],
		shows : {
			1: {
				fechasDisponibles: [
					{
						fecha: null,
						hora: null,
						linkBoton: null,
						nombreRecinto: null,
						btnColorText: null,
						btnBgColorDisponible: null,
						btnBgColorOcupado: null,
						factorOcupacion: null
					},
					{
						fecha: null,
						hora: null,
						linkBoton: null,
						nombreRecinto: null,
						btnColorText: null,
						btnBgColorDisponible: null,
						btnBgColorOcupado: null,
						factorOcupacion: null
					},
					{
						fecha: null,
						hora: null,
						linkBoton: null,
						nombreRecinto: null,
						btnColorText: null,
						btnBgColorDisponible: null,
						btnBgColorOcupado: null,
						factorOcupacion: null
					},
					{
						fecha: null,
						hora: null,
						linkBoton: null,
						nombreRecinto: null,
						btnColorText: null,
						btnBgColorDisponible: null,
						btnBgColorOcupado: null,
						factorOcupacion: null
					},
					{
						fecha: null,
						hora: null,
						linkBoton: null,
						nombreRecinto: null,
						btnColorText: null,
						btnBgColorDisponible: null,
						btnBgColorOcupado: null,
						factorOcupacion: null
					},
					{
						fecha: null,
						hora: null,
						linkBoton: null,
						nombreRecinto: null,
						btnColorText: null,
						btnBgColorDisponible: null,
						btnBgColorOcupado: null,
						factorOcupacion: null
					},
					{
						fecha: null,
						hora: null,
						linkBoton: null,
						nombreRecinto: null,
						btnColorText: null,
						btnBgColorDisponible: null,
						btnBgColorOcupado: null,
						factorOcupacion: null
					}
				]
			}
		}
	},
	getBanners: function() {
		return this.data.banners
	},
	getDestacadosChicos: function() {
		return this.data.destacadoChico
	},
	getDestacadosGrandes: function() {
		return this.data.destacadosGrandes
	},
	getProximamente: function() {
		return this.data.proximamente
	},
	getShow: function(id) {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(this.data.shows[id]), 1000)
		})
	}
}

export default dummyApi;