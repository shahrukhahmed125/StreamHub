import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Settings,
  AlertTriangle,
  Subtitles,
  Tv,
  Gauge,
  Check,
} from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  poster: string;
  title: string;
  onEnded?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  poster,
  title,
  onEnded,
  onNext,
  hasNext,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);

  const controlsTimeoutRef = useRef<number | null>(null);

  // Time formatting helper
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay policy or error
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setHasError(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    videoRef.current.muted = newMuted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  const togglePictureInPicture = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch {
      // not supported
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleMouseMove = () => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 3500);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyM') {
        toggleMute();
      } else if (e.code === 'KeyF') {
        toggleFullscreen();
      } else if (e.code === 'ArrowLeft') {
        if (videoRef.current) videoRef.current.currentTime -= 10;
      } else if (e.code === 'ArrowRight') {
        if (videoRef.current) videoRef.current.currentTime += 10;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, isMuted]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setControlsVisible(false)}
      className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black border border-[#2A3040] shadow-2xl group select-none flex items-center justify-center"
    >
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#12151D] z-20">
          <AlertTriangle className="w-12 h-12 text-[#F06464] mb-3" />
          <h4 className="text-base font-bold text-[#F5F7FA]">Demo media stream unavailable</h4>
          <p className="text-xs text-[#A3AABD] max-w-md mt-1 mb-4">
            Could not stream external media source. You can reload or preview the cinematic poster.
          </p>
          <button
            onClick={() => {
              setHasError(false);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            Retry playback
          </button>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          playsInline
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={() => setHasError(true)}
          onEnded={() => {
            setIsPlaying(false);
            if (onEnded) onEnded();
            else if (onNext && hasNext) onNext();
          }}
          className="w-full h-full object-contain cursor-pointer"
        />
      )}

      {/* Simulated Subtitles overlay */}
      {subtitlesEnabled && isPlaying && currentTime > 2 && (
        <div className="absolute bottom-16 inset-x-0 flex justify-center pointer-events-none z-10 px-8">
          <span className="px-3 py-1 rounded-md bg-black/80 text-white font-medium text-xs sm:text-sm drop-shadow-md text-center max-w-lg">
            [Soundtrack: Atmospheric Cinematic Score Playing]
          </span>
        </div>
      )}

      {/* Center Play Button Overlay when paused */}
      {!isPlaying && !hasError && (
        <button
          onClick={togglePlay}
          className="absolute z-10 w-20 h-20 rounded-full bg-[#7C5CFC]/90 hover:bg-[#7C5CFC] text-white flex items-center justify-center shadow-2xl shadow-black/80 transition-transform hover:scale-110 active:scale-95"
          aria-label="Play video"
        >
          <Play className="w-9 h-9 fill-current ml-1" />
        </button>
      )}

      {/* Video Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-6 py-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 ${
          controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrubber Progress Slider */}
        <div className="relative flex items-center mb-3 group/seek">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 sm:h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#7C5CFC] focus:outline-hidden group-hover/seek:h-3 transition-all"
          />
        </div>

        {/* Control Actions Row */}
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={togglePlay}
              className="p-1 rounded-md hover:text-[#9278FF] transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="p-1 rounded-md hover:text-[#9278FF] transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-[#F06464]" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#7C5CFC]"
              />
            </div>

            {/* Time Stamp */}
            <span className="font-mono text-[11px] sm:text-xs text-[#F5F7FA]/90">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Subtitles / CC Toggle */}
            <button
              onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
              className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1 ${
                subtitlesEnabled
                  ? 'border-[#7C5CFC] text-[#9278FF] bg-[#7C5CFC]/10'
                  : 'border-white/20 text-[#A3AABD] hover:text-white'
              }`}
              title={subtitlesEnabled ? 'Captions On' : 'Captions Off'}
            >
              <Subtitles className="w-4 h-4" />
              <span className="hidden sm:inline text-[10px]">CC</span>
            </button>

            {/* Picture in Picture */}
            <button
              onClick={togglePictureInPicture}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#A3AABD] hover:text-white transition-colors hidden sm:block"
              title="Picture in Picture"
            >
              <Tv className="w-4 h-4" />
            </button>

            {/* Settings & Quality Menu */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
                title="Playback Settings"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{selectedQuality}</span>
              </button>

              {showSettings && (
                <div className="absolute right-0 bottom-full mb-3 w-48 rounded-2xl bg-[#181C26] border border-[#2A3040] shadow-2xl p-2 z-30 divide-y divide-[#2A3040]">
                  <div className="pb-2">
                    <span className="px-2 text-[10px] font-bold text-[#A3AABD] uppercase tracking-wider block mb-1">
                      Resolution
                    </span>
                    {['4K Ultra HD', '1080p HD', '720p', 'Auto'].map(q => {
                      const clean = q.replace(' HD', '').replace(' Ultra HD', '');
                      return (
                        <button
                          key={q}
                          onClick={() => {
                            setSelectedQuality(clean);
                            setShowSettings(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded-lg text-xs flex items-center justify-between transition-colors hover:bg-[#202635] ${
                            selectedQuality === clean ? 'text-[#7C5CFC] font-bold' : 'text-[#F5F7FA]'
                          }`}
                        >
                          <span>{q}</span>
                          {selectedQuality === clean && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    <span className="px-2 text-[10px] font-bold text-[#A3AABD] uppercase tracking-wider block mb-1">
                      Playback Speed
                    </span>
                    {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                      <button
                        key={speed}
                        onClick={() => {
                          handleSpeedChange(speed);
                          setShowSettings(false);
                        }}
                        className={`w-full text-left px-2 py-1 rounded-lg text-xs flex items-center justify-between transition-colors hover:bg-[#202635] ${
                          playbackSpeed === speed ? 'text-[#7C5CFC] font-bold' : 'text-[#F5F7FA]'
                        }`}
                      >
                        <span>{speed === 1 ? 'Normal (1.0x)' : `${speed}x`}</span>
                        {playbackSpeed === speed && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1 rounded-md hover:text-[#9278FF] transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
