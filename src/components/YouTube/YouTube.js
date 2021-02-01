import React, {
	useEffect,
	useState,
	useRef
} from 'react';
import PropTypes from 'prop-types';

/* CustomHooks */
import { useScript } from '../customHooks';

/* Style */
import style from './youTube.css';

const YouTube = (props) => {

	const [loaded, error] = useScript(
		'https://www.youtube.com/iframe_api'
	);
	const [player, setPlayer] = useState(null);
	const [loadedApi, setLoadedApi] = useState(false);
	const _containerPlayer = useRef(null);
	const [eventNames, setEventNames] =  useState ([
			'onReady',
			'onStateChange',
			'onPlaybackQualityChange',
			'onPlaybackRateChange',
			'onError',
			'onApiChange',
	]);

	useEffect(() => {
		if(loaded) {
			window.YT.ready(() => {
	      setLoadedApi(true);
	    });
		}
	}, [loaded])

	useEffect(() => {
		loadedApi && !player && createPlayer();
	}, [loadedApi])

	// La API llamará a esta función cuando el reproductor de video esté listo.
	const onPlayerReady = (event) => {
		const {
			volume,
			muted,
			suggestedQuality,
			playbackRate,
		} = props;

		if (typeof volume !== 'undefined') {
			event.target.setVolume(volume * 100);
		}
		if (typeof muted !== 'undefined') {
			if (muted) {
				event.target.mute();
			} else {
				event.target.unMute();
			}
		}
		if (typeof suggestedQuality !== 'undefined') {
			event.target.setPlaybackQuality(suggestedQuality);
		}
		if (typeof playbackRate !== 'undefined') {
			event.target.setPlaybackRate(playbackRate);
		}
	}

	const onPlayerStateChange = (event) => {
		const {
			onCued,
			onBuffering,
			onPause,
			onPlaying,
			onEnd,
		} = props;

		const State = YT.PlayerState;
		switch (event.data) {
			case State.CUED:
				onCued(event);
				break;
			case State.BUFFERING:
				onBuffering(event);
				break;
			case State.PAUSED:
				onPause(event);
				break;
			case State.PLAYING:
				onPlaying(event);
				break;
			case State.ENDED:
				onEnd(event);
				break;
			default:
				// Nothing
		}
	}

	const getPlayerParameters = () => {
		return {
			autoplay: props.autoplay,
			cc_load_policy: props.showCaptions ? 1 : 0,
			controls: props.controls ? 1 : 0,
			disablekb: props.disableKeyboard ? 1 : 0,
			fs: props.allowFullscreen ? 1 : 0,
			hl: props.lang,
			iv_load_policy: props.annotations ? 1 : 3,
			start: props.startSeconds,
			end: props.endSeconds,
			modestbranding: props.modestBranding ? 1 : 0,
			playsinline: props.playsInline ? 1 : 0,
			rel: props.showRelatedVideos ? 1 : 0,
			showinfo: props.showInfo ? 1 : 0,
		};
	}

	const getInitialOptions = () => {
		return {
			videoId: props.videoId,
			width: props.width || '100%',
			height: props.height || props.content.current.offsetWidth / 16 * 9,
			playerVars: getPlayerParameters(),
			events: {
				onReady: onPlayerReady,
				onStateChange: onPlayerStateChange,
			},
		};
	}

	/*
	 * Esta función crea un <iframe> (y un reproductor de YouTube)
	 * después de que se descargue el código API.
	*/
	const createPlayer = () => {
		if(loadedApi) {
			let newPlayer = new YT.Player(_containerPlayer.current, getInitialOptions());
			setPlayer(newPlayer);

			eventNames.forEach((name) => {
				newPlayer.addEventListener(name, (event) => {
					const handler = props[name];
					if (handler) {
						handler(event);
					}
				});
			});
		}
	}

	return(
		<div
			id={props.id}
			className={props.className}
			ref={_containerPlayer}
		/>
	)
};

YouTube.propTypes = {
	/**
	 * An 11-character string representing a YouTube video ID..
	 */
	video: PropTypes.string,
	/**
	 * DOM ID for the player element.
	 */
	id: PropTypes.string,
	/**
	 * CSS className for the player element.
	 */
	className: PropTypes.string,
	/**
	 * Width of the player element.
	 */
	width: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
	/**
	 * Height of the player element.
	 */
	height: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),

	/**
	 * Pause the video.
	 */
	paused: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types

	// Player parameters

	/**
	 * Whether the video should start playing automatically.
	 *
	 * https://developers.google.com/youtube/player_parameters#autoplay
	 */
	autoplay: PropTypes.bool,
	/**
	 * Whether to show captions below the video.
	 *
	 * https://developers.google.com/youtube/player_parameters#cc_load_policy
	 */
	showCaptions: PropTypes.bool,
	/**
	 * Whether to show video controls.
	 *
	 * https://developers.google.com/youtube/player_parameters#controls
	 */
	controls: PropTypes.bool,
	/**
	 * Ignore keyboard controls.
	 *
	 * https://developers.google.com/youtube/player_parameters#disablekb
	 */
	disableKeyboard: PropTypes.bool,
	/**
	 * Whether to display the fullscreen button.
	 *
	 * https://developers.google.com/youtube/player_parameters#fs
	 */
	allowFullscreen: PropTypes.bool,
	/**
	 * The player's interface language. The parameter value is an ISO 639-1
	 * two-letter language code or a fully specified locale.
	 *
	 * https://developers.google.com/youtube/player_parameters#hl
	 */
	lang: PropTypes.string,
	/**
	 * Whether to show annotations on top of the video.
	 *
	 * https://developers.google.com/youtube/player_parameters#iv_load_policy
	 */
	annotations: PropTypes.bool,
	/**
	 * Time in seconds at which to start playing the video.
	 *
	 * https://developers.google.com/youtube/player_parameters#start
	 */
	startSeconds: PropTypes.number,
	/**
	 * Time in seconds at which to stop playing the video.
	 *
	 * https://developers.google.com/youtube/player_parameters#end
	 */
	endSeconds: PropTypes.number,
	/**
	 * Remove most YouTube logos from the player.
	 *
	 * https://developers.google.com/youtube/player_parameters#modestbranding
	 */
	modestBranding: PropTypes.bool,
	/**
	 * Whether to play the video inline on iOS, instead of fullscreen.
	 *
	 * https://developers.google.com/youtube/player_parameters#playsinline
	 */
	playsInline: PropTypes.bool,
	/**
	 * Whether to show related videos after the video is over.
	 *
	 * https://developers.google.com/youtube/player_parameters#rel
	 */
	showRelatedVideos: PropTypes.bool,
	/**
	 * Whether to show video information (uploader, title, etc) before the video
	 * starts.
	 *
	 * https://developers.google.com/youtube/player_parameters#showinfo
	 */
	showInfo: PropTypes.bool,

	/**
	 * The playback volume, **as a number between 0 and 1**.
	 */
	volume: PropTypes.number,

	/**
	 * Whether the video's sound should be muted.
	 */
	muted: PropTypes.bool,

	/**
	 * The suggested playback quality.
	 *
	 * https://developers.google.com/youtube/iframe_api_reference#Playback_quality
	 */
	suggestedQuality: PropTypes.string,
	/**
	 * Playback speed.
	 *
	 * https://developers.google.com/youtube/iframe_api_reference#setPlaybackRate
	 */
	playbackRate: PropTypes.number,

	// Events
	/* eslint-disable react/no-unused-prop-types */

	/**
	 * Sent when the YouTube player API has loaded.
	 */
	onReady: PropTypes.func,
	/**
	 * Sent when the player triggers an error.
	 */
	onError: PropTypes.func,
	/**
	 * Sent when the video is cued and ready to play.
	 */
	onCued: PropTypes.func,
	/**
	 * Sent when the video is buffering.
	 */
	onBuffering: PropTypes.func,
	/**
	 * Sent when playback has been started or resumed.
	 */
	onPlaying: PropTypes.func,
	/**
	 * Sent when playback has been paused.
	 */
	onPause: PropTypes.func,
	/**
	 * Sent when playback has stopped.
	 */
	onEnd: PropTypes.func,
	onStateChange: PropTypes.func,
	onPlaybackRateChange: PropTypes.func,
	onPlaybackQualityChange: PropTypes.func,

	/* eslint-enable react/no-unused-prop-types */
};

YouTube.defaultProps = {
	autoplay: false,
	showCaptions: false,
	controls: true,
	disableKeyboard: false,
	allowFullscreen: true,
	annotations: true,
	modestBranding: false,
	playsInline: false,
	showRelatedVideos: true,
	showInfo: true,
	onCued: () => {},
	onBuffering: () => {},
	onPlaying: () => {},
	onPause: () => {},
	onEnd: () => {},
};

export default YouTube;