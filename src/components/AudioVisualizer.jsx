import { useEffect, useRef } from 'react';

/**
 * AudioVisualizer Component
 * Renders an animated live audio waveform using HTML5 Canvas & Web Audio API
 */
export default function AudioVisualizer({ isListening, isSpeaking, stream }) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 300;
    const height = canvas.clientHeight || 60;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let dataArray = null;
    let bufferLength = 0;

    if (stream && (isListening || isSpeaking)) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const audioCtx = new AudioContext();
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          audioContextRef.current = audioCtx;
          analyserRef.current = analyser;
          sourceRef.current = source;

          bufferLength = analyser.frequencyBinCount;
          dataArray = new Uint8Array(bufferLength);
        }
      } catch (e) {
        // Fallback to synthetic waveform animation
      }
    }

    let phase = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const numBars = 28;
      const barWidth = 4;
      const gap = (width - numBars * barWidth) / (numBars + 1);

      if (analyserRef.current && dataArray && isListening) {
        analyserRef.current.getByteFrequencyData(dataArray);
      }

      for (let i = 0; i < numBars; i++) {
        let barHeight = 4;

        if (isListening) {
          if (dataArray && dataArray[i % dataArray.length] > 0) {
            const freq = dataArray[i % dataArray.length] / 255;
            barHeight = Math.max(4, freq * (height - 10));
          } else {
            // Dynamic wave simulation
            const wave = Math.sin(phase + i * 0.35) * 0.5 + 0.5;
            barHeight = 6 + wave * (height * 0.45);
          }
        } else if (isSpeaking) {
          // AI speaking wave
          const wave = Math.sin(phase * 1.5 + i * 0.5) * 0.5 + 0.5;
          barHeight = 8 + wave * (height * 0.55);
        } else {
          barHeight = 4;
        }

        const x = gap + i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isListening) {
          gradient.addColorStop(0, '#34d399'); // emerald-400
          gradient.addColorStop(1, '#00C853'); // brandGreen
        } else if (isSpeaking) {
          gradient.addColorStop(0, '#60a5fa'); // blue-400
          gradient.addColorStop(1, '#3b82f6'); // blue-500
        } else {
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      phase += 0.12;
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch (e) {}
      }
    };
  }, [isListening, isSpeaking, stream]);

  return (
    <div className="w-full flex items-center justify-center py-1">
      <canvas
        ref={canvasRef}
        className="w-full h-12 rounded-xl"
        style={{ width: '100%', height: '48px' }}
      />
    </div>
  );
}
