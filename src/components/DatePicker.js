import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import TextInput from './TextInput';

const DatePicker = ({ options, onChange, refInput = {}, ...optionsInput }) => {
	const dateEl = useRef(null);

	useEffect(() => {
		const defaultOptions = { ...DatePicker.defaultProps.options };
		const _options = { ...defaultOptions , ...options };
		_options.onSelect = onChange ? onChange : null;

		if(options.hasOwnProperty('i18n')) {
			if(!options.i18n.hasOwnProperty('cancel')) _options.i18n.cancel = defaultOptions.i18n.cancel;
			if(!options.i18n.hasOwnProperty('clear')) _options.i18n.clear = defaultOptions.i18n.clear;
			if(!options.i18n.hasOwnProperty('done')) _options.i18n.done = defaultOptions.i18n.done;
			if(!options.i18n.hasOwnProperty('previousMonth')) _options.i18n.previousMonth = defaultOptions.i18n.previousMonth;
			if(!options.i18n.hasOwnProperty('nextMonth')) _options.i18n.nextMonth = defaultOptions.i18n.nextMonth;
			if(!options.i18n.hasOwnProperty('months')) _options.i18n.months = defaultOptions.i18n.months;
			if(!options.i18n.hasOwnProperty('monthsShort')) _options.i18n.monthsShort = defaultOptions.i18n.monthsShort;
			if(!options.i18n.hasOwnProperty('weekdays')) _options.i18n.weekdays = defaultOptions.i18n.weekdays;
			if(!options.i18n.hasOwnProperty('weekdaysShort')) _options.i18n.weekdaysShort = defaultOptions.i18n.weekdaysShort;
			if(!options.i18n.hasOwnProperty('weekdaysAbbrev')) _options.i18n.weekdaysAbbrev = defaultOptions.i18n.weekdaysAbbrev;
		}

		const instance = M.Datepicker.init(dateEl.current.inputRef, _options);

		return () => {
			instance && instance.destroy();
		};
	}, [options, onChange, dateEl]);

	useEffect(() => {
		refInput.current = dateEl.current;
	}, [dateEl])

	return <TextInput ref={dateEl} inputClassName="datepicker" {...optionsInput} />;
};

DatePicker.propTypes = {
	/**
	 * Event called when Time has been selected
	 */
	onChange: PropTypes.func,
	/**
	 * options passed to init method
	 * more info: https://materializecss.com/pickers.html#date-picker
	 */
	options: PropTypes.shape({
		/**
		 * Automatically close picker when date is selected.
		 */
		autoClose: PropTypes.bool,
		/**
		 * The date output format for the input field value.
		 * @default 'mmm dd, yyyy'
		 */
		format: PropTypes.string,
		/**
		 * Used to create date object from current input string.
		 * @default null
		 */
		parse: PropTypes.func,
		/**
		 * The initial date to view when first opened.
		 * @default null
		 */
		defaultDate: PropTypes.any,
		/**
		 * Make the defaultDate the initial selected value.
		 * @default false
		 */
		setDefaultDate: PropTypes.bool,
		/**
		 * Prevent selection of any date on the weekend.
		 * @default false
		 */
		disableWeekends: PropTypes.bool,
		/**
		 * Custom function to disable certain days.
		 * @default null
		 */
		disableDayFn: PropTypes.func,
		/**
		 * First day of week (0: Sunday, 1: Monday etc).
		 * @default 0
		 */
		firstDay: PropTypes.number,
		/**
		 * The earliest date that can be selected.
		 * @default null
		 */
		minDate: PropTypes.any,
		/**
		 * The latest date that can be selected.
		 * @default null
		 */
		maxDate: PropTypes.any,
		/**
		 * Number of years either side, or array of upper/lower range.
		 * @default 10
		 */
		yearRange: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
		/**
		 * Changes Datepicker to RTL.
		 * @default false
		 */
		isRTL: PropTypes.bool,
		/**
		 * Show month after year in Datepicker title.
		 * @default false
		 */
		showMonthAfterYear: PropTypes.bool,
		/**
		 * Render days of the calendar grid that fall in the next or previous month.
		 * @default false
		 */
		showDaysInNextAndPreviousMonths: PropTypes.bool,
		/**
		 * Specify a DOM element to render the calendar in, by default it will be placed before the input.
		 * @default null
		 */
		container: PropTypes.any,
		/**
		 * Show the clear button in the datepicker.
		 * @default false
		 */
		showClearBtn: PropTypes.bool,
		/**
		 * Internationalization options.
		 * @default See i18n documentation.
		 */
		i18n: PropTypes.shape({
			cancel: PropTypes.string,
			clear: PropTypes.string,
			done: PropTypes.string,
			previousMonth: PropTypes.string,
			nextMonth: PropTypes.string,
			months: PropTypes.arrayOf(PropTypes.string),
			monthsShort: PropTypes.arrayOf(PropTypes.string),
			weekdays: PropTypes.arrayOf(PropTypes.string),
			weekdaysShort: PropTypes.arrayOf(PropTypes.string),
			weekdaysAbbrev: PropTypes.arrayOf(PropTypes.string)
		}),
		/**
		 * An array of string returned by `Date.toDateString()`, indicating there are events in the specified days.
		 * @default []
		 */
		events: PropTypes.arrayOf(PropTypes.string),
		/**
		 * Callback function when date is selected, first parameter is the newly selected date.
		 * @default null
		 */
		onSelect: PropTypes.func,
		/**
		 * Callback function when Datepicker is opened.
		 * @default null
		 */
		onOpen: PropTypes.func,
		/**
		 * Callback function when Datepicker is closed.
		 * @default null
		 */
		onClose: PropTypes.func,
		/**
		 * Callback function when Datepicker HTML is refreshed.
		 * @default null
		 */
		onDraw: PropTypes.func
	})
};

DatePicker.defaultProps = {
	options: {
		autoClose: false,
		format: 'mmm dd, yyyy',
		parse: null,
		defaultDate: null,
		setDefaultDate: false,
		disableWeekends: false,
		disableDayFn: null,
		firstDay: 0,
		minDate: null,
		maxDate: null,
		yearRange: 10,
		isRTL: false,
		showMonthAfterYear: false,
		showDaysInNextAndPreviousMonths: false,
		container: null,
		showClearBtn: false,
		i18n: {
			cancel: 'Cancelar',
			clear: 'Clear',
			done: 'Ok',
			previousMonth: '‹',
			nextMonth: '›',
			months: [
				'Enero',
				'Febrero',
				'Marzo',
				'Abril',
				'Mayo',
				'Junio',
				'Julio',
				'Agosto',
				'Septiembre',
				'Octubre',
				'Noviembre',
				'Diciembre'
			],
			monthsShort: [
				'Ene',
				'Feb',
				'Mar',
				'Abr',
				'May',
				'Jun',
				'Jul',
				'Ago',
				'Sep',
				'Oct',
				'Nov',
				'Dic'
			],
			weekdays: [
				'Lunes',
				'Martes',
				'Miércoles',
				'Jueves',
				'Viernes',
				'Sábado',
				'Domingo'
			],
			weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
			weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S']
		},
		events: [],
		onSelect: null,
		onOpen: null,
		onClose: null,
		onDraw: null
	},
};

export default DatePicker;
