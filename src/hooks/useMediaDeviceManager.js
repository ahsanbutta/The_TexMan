import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * useMediaDeviceManager
 * Coordinated MediaStream manager for video and audio hardware.
 * Ensures a single, synchronized getUserMedia request, eliminates device collisions,
 * and provides instant track enable/disable controls without re-prompting.
 */
export function useMediaDeviceManager({ enableCamera = true } = {}) {
  const [stream, setStream] = useState(null);
  const [cameraStatus, setCameraStatus] = useState('WAITING'); // 'WAITING' | 'INITIALIZING' | 'READY' | 'OFF' | 'DENIED' | 'UNAVAILABLE'
  const [micStatus, setMicStatus] = useState('WAITING'); // 'WAITING' | 'INITIALIZING' | 'READY' | 'MUTED' | 'DENIED' | 'UNAVAILABLE'
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [deviceError, setDeviceError] = useState(null);

  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  // Initialize both Camera & Microphone in a single coordinated request
  const requestMediaDevices = useCallback(async (opts = {}) => {
    const wantCamera = opts.enableCamera !== undefined ? opts.enableCamera : enableCamera;

    setCameraStatus('INITIALIZING');
    setMicStatus('INITIALIZING');
    setDeviceError(null);

    // Stop any existing streams first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    try {
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: wantCamera
          ? {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: 'user'
            }
          : false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;
      setStream(mediaStream);

      // Verify video tracks
      const videoTracks = mediaStream.getVideoTracks();
      if (videoTracks.length > 0 && wantCamera) {
        setCameraStatus('READY');
        setIsCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }
      } else {
        setCameraStatus(wantCamera ? 'UNAVAILABLE' : 'OFF');
        setIsCameraActive(false);
      }

      // Verify audio tracks
      const audioTracks = mediaStream.getAudioTracks();
      if (audioTracks.length > 0) {
        setMicStatus('READY');
        setIsMicActive(true);
        setupAudioAnalyser(mediaStream);
      } else {
        setMicStatus('UNAVAILABLE');
        setIsMicActive(false);
      }

      return {
        success: true,
        stream: mediaStream,
        cameraReady: videoTracks.length > 0 && wantCamera,
        micReady: audioTracks.length > 0
      };
    } catch (err) {
      console.warn('[MediaDeviceManager] getUserMedia error:', err.name, err.message);

      // Handle specific camera/mic permission denial
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        // Try fallback: Request audio only if camera was denied
        if (wantCamera) {
          try {
            console.log('[MediaDeviceManager] Camera denied, attempting audio-only fallback...');
            const audioOnlyStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = audioOnlyStream;
            setStream(audioOnlyStream);
            setCameraStatus('DENIED');
            setIsCameraActive(false);
            setMicStatus('READY');
            setIsMicActive(true);
            setupAudioAnalyser(audioOnlyStream);
            setDeviceError('Camera access was denied. Continuing in Voice-Only mode.');
            return {
              success: true,
              stream: audioOnlyStream,
              cameraReady: false,
              micReady: true,
              fallbackVoiceOnly: true
            };
          } catch (audioErr) {
            setCameraStatus('DENIED');
            setMicStatus('DENIED');
            setIsCameraActive(false);
            setIsMicActive(false);
            setDeviceError('Camera and Microphone permissions were denied. You can still type answers.');
            return { success: false, cameraReady: false, micReady: false, error: 'PERMISSIONS_DENIED' };
          }
        } else {
          setMicStatus('DENIED');
          setIsMicActive(false);
          setDeviceError('Microphone permission was denied. You can still type answers.');
          return { success: false, cameraReady: false, micReady: false, error: 'MIC_DENIED' };
        }
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraStatus('UNAVAILABLE');
        setMicStatus('UNAVAILABLE');
        setDeviceError('No camera or microphone hardware found.');
        return { success: false, cameraReady: false, micReady: false, error: 'HARDWARE_NOT_FOUND' };
      } else {
        setCameraStatus('UNAVAILABLE');
        setMicStatus('UNAVAILABLE');
        setDeviceError('Device initialization failed: ' + err.message);
        return { success: false, cameraReady: false, micReady: false, error: err.name };
      }
    }
  }, [enableCamera]);

  // Setup Web Audio Analyser node for frequency visualizer
  const setupAudioAnalyser = (mediaStream) => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioCtx();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 32;
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }
      const source = audioContextRef.current.createMediaStreamSource(mediaStream);
      source.connect(analyserRef.current);
    } catch (e) {
      console.warn('[MediaDeviceManager] Web Audio Analyser setup warning:', e.message);
    }
  };

  // Toggle Camera Track
  const toggleCamera = useCallback(() => {
    if (!streamRef.current) return;
    const videoTracks = streamRef.current.getVideoTracks();
    if (videoTracks.length === 0) return;

    const nextState = !videoTracks[0].enabled;
    videoTracks.forEach((track) => {
      track.enabled = nextState;
    });

    setIsCameraActive(nextState);
    setCameraStatus(nextState ? 'READY' : 'OFF');
  }, []);

  // Toggle Microphone Track
  const toggleMicrophone = useCallback(() => {
    if (!streamRef.current) return;
    const audioTracks = streamRef.current.getAudioTracks();
    if (audioTracks.length === 0) return;

    const nextState = !audioTracks[0].enabled;
    audioTracks.forEach((track) => {
      track.enabled = nextState;
    });

    setIsMicActive(nextState);
    setMicStatus(nextState ? 'READY' : 'MUTED');
  }, []);

  // Centralized Cleanup: Stop all tracks & close audio context
  const cleanupAllStreams = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close().catch(() => {});
      } catch (e) {}
    }
    setStream(null);
    setIsCameraActive(false);
    setIsMicActive(false);
    setCameraStatus('WAITING');
    setMicStatus('WAITING');
    setDeviceError(null);
  }, []);

  // Auto attach stream to video element when ref changes or stream updates
  useEffect(() => {
    if (videoRef.current && stream && isCameraActive) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream, isCameraActive]);

  // Unmount cleanup
  useEffect(() => {
    return () => {
      cleanupAllStreams();
    };
  }, [cleanupAllStreams]);

  return {
    stream,
    videoRef,
    cameraStatus,
    micStatus,
    isCameraActive,
    isMicActive,
    deviceError,
    requestMediaDevices,
    toggleCamera,
    toggleMicrophone,
    cleanupAllStreams
  };
}
