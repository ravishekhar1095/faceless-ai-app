import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SampleLibrary.css';

const SAMPLE_VIDEOS = [
  { url: '/GIF_Generation_Request_Fulfilled.mp4', label: 'AI Demo Loop' },
  { url: '/GIF_Generation_Request_Fulfilled_1.mp4', label: 'Storyboard Loop' },
  { url: '/HD_Video_Generation_Complete.mp4', label: 'Render Complete' },
];

const TEMPLATES = [
  {
    id: 'product-launch',
    title: 'Product Launch (60s)',
    mode: 'script',
    text:
      'Hook: Meet Atlas — your new AI assistant for content teams.\n\nProblem: Planning, drafting, and publishing across channels takes hours.\n\nSolution: Atlas helps you outline, narrate, and package content in minutes.\n\nCTA: Try Atlas today and convert ideas into finished videos without a studio.',
    preview: SAMPLE_VIDEOS[2].url,
  },
  {
    id: 'news-summary',
    title: 'News Summary (45s)',
    mode: 'article',
    text:
      'AI usage grew 4x this quarter across SMBs. The surprise? Teams rely on AI to repurpose content faster than they produce it. The takeaway: focus on workflows that turn one idea into many formats.',
    preview: SAMPLE_VIDEOS[0].url,
  },
  {
    id: 'listicle-tiktok',
    title: 'TikTok Listicle (30s)',
    mode: 'idea',
    text: 'Top 3 productivity hacks for creators when filming without a camera.',
    preview: SAMPLE_VIDEOS[1].url,
  },
  {
    id: 'tutorial',
    title: 'How-To Tutorial (60-90s)',
    mode: 'script',
    text:
      'Hook: In this tutorial, you will create a faceless video from a script.\n\nStep 1: Paste your script.\nStep 2: Pick a voice preset.\nStep 3: Choose an aspect ratio.\n\nCTA: Generate now and publish to YouTube or TikTok in one click.',
    preview: SAMPLE_VIDEOS[0].url,
  },
];

function useSpeechVoices() {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const load = () => setVoices(synth.getVoices() || []);
    load();
    if (typeof synth.onvoiceschanged !== 'undefined') {
      synth.onvoiceschanged = load;
    }
  }, []);

  return voices;
}

function SampleLibrary() {
  const navigate = useNavigate();
  const voices = useSpeechVoices();
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const utterRef = useRef(null);
  const [generatedClips, setGeneratedClips] = useState([]);

  const defaultVoiceName = useMemo(() => {
    if (voices.length === 0) return '';
    const en = voices.find(v => /en-/i.test(v.lang)) || voices[0];
    return en.name;
  }, [voices]);

  useEffect(() => {
    if (!selectedVoice && defaultVoiceName) setSelectedVoice(defaultVoiceName);
  }, [defaultVoiceName, selectedVoice]);

  const speak = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    try {
      if (synth.speaking) synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) u.voice = voice;
      u.rate = rate;
      u.pitch = pitch;
      utterRef.current = u;
      synth.speak(u);
    } catch (e) {
      console.warn('SpeechSynthesis not available:', e);
    }
  };

  const useTemplate = (tpl) => {
    try {
      localStorage.setItem('faceless:composerPreset', JSON.stringify({ mode: tpl.mode, text: tpl.text }));
    } catch {}
    navigate('/welcome/dashboard');
  };

  // Procedural sample video generator using Canvas + MediaRecorder (WebM)
  const generateProceduralClips = async () => {
    // Clean up previous clips
    generatedClips.forEach((clip) => URL.revokeObjectURL(clip.url));
    setGeneratedClips([]);

    const configs = [
      { seed: 2, label: 'Neon Orbits', type: 'orbits', duration: 4800 },
      { seed: 9, label: 'Aurora Waves', type: 'waves', duration: 5200 },
      { seed: 15, label: 'Gradient Panels', type: 'panels', duration: 4600 },
    ];

    if (typeof window.MediaRecorder === 'undefined') {
      console.warn('MediaRecorder not available in this browser.');
      setGeneratedClips([]);
      return;
    }

    const makeClip = async ({ seed, label, type, duration }) => {
      const width = 640;
      const height = 360;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!canvas.captureStream) {
        throw new Error('Canvas captureStream is not supported in this environment.');
      }
      const stream = canvas.captureStream(30);
      const chunks = [];
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      recorder.ondataavailable = (e) => e.data && chunks.push(e.data);

      let start = null;
      const hueBase = 60 * seed;
      const draw = (ts) => {
        if (!start) start = ts;
        const t = (ts - start) / 1000;
        ctx.clearRect(0, 0, width, height);

        if (type === 'orbits') {
          const grd = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 360);
          grd.addColorStop(0, `hsla(${(hueBase + t * 30) % 360} 85% 60% / 0.85)`);
          grd.addColorStop(1, `hsla(${(hueBase + 180 + t * 20) % 360} 65% 35% / 0.9)`);
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, width, height);

          for (let i = 0; i < 9; i++) {
            const r = 18 + (i * 5);
            const x = width / 2 + Math.cos(t * (0.4 + i * 0.08) + i + seed) * (70 + i * 18);
            const y = height / 2 + Math.sin(t * (0.5 + i * 0.06) + i + seed) * (40 + i * 14);
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${(hueBase + i * 28 + t * 25) % 360} 85% 65% / 0.55)`;
            ctx.fill();
          }
        } else if (type === 'waves') {
          const grd = ctx.createLinearGradient(0, 0, 0, height);
          grd.addColorStop(0, `hsla(${(hueBase + 20) % 360} 75% 55% / 0.85)`);
          grd.addColorStop(1, `hsla(${(hueBase + 200) % 360} 90% 40% / 0.9)`);
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, width, height);

          for (let layer = 0; layer < 4; layer++) {
            ctx.beginPath();
            const amplitude = 20 + layer * 12;
            const frequency = 0.6 + layer * 0.15;
            ctx.moveTo(0, height);
            for (let x = 0; x <= width; x += 4) {
              const y =
                height - 60 - layer * 35 +
                Math.sin((x / width) * Math.PI * 2 * frequency + t * (0.8 + layer * 0.3) + seed) * amplitude;
              ctx.lineTo(x, y);
            }
            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fillStyle = `hsla(${(hueBase + layer * 40 + t * 15) % 360} 80% 70% / 0.25)`;
            ctx.fill();
          }
        } else if (type === 'panels') {
          ctx.fillStyle = `hsla(${(hueBase + t * 22) % 360} 70% 92%)`;
          ctx.fillRect(0, 0, width, height);

          const panelCount = 6;
          for (let i = 0; i < panelCount; i++) {
            const panelWidth = width / panelCount + 20;
            const offset = ((t * 70 + i * 50) % (width + panelWidth)) - panelWidth;
            ctx.fillStyle = `hsla(${(hueBase + i * 35 + t * 40) % 360} 80% 50% / 0.35)`;
            ctx.fillRect(offset - 20, -40, panelWidth, height + 80);

            ctx.save();
            ctx.translate(offset + panelWidth / 2, height / 2);
            ctx.rotate(((t * 0.3 + i) % (Math.PI * 2)) / 2);
            ctx.strokeStyle = `hsla(${(hueBase + i * 50 + 120) % 360} 80% 30% / 0.35)`;
            ctx.lineWidth = 6;
            ctx.strokeRect(-60, -45, 120, 90);
            ctx.restore();
          }
        }

        // overlay text
        const textColor = type === 'panels' ? 'rgba(15,23,42,0.82)' : 'rgba(255,255,255,0.92)';
        const subColor = type === 'panels' ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.8)';
        ctx.fillStyle = textColor;
        ctx.font = '600 22px Inter, system-ui, sans-serif';
        ctx.fillText(`Faceless AI · ${label}`, 18, height - 36);
        ctx.font = '500 14px Inter, system-ui, sans-serif';
        ctx.fillStyle = subColor;
        ctx.fillText(`Mode ${type.toUpperCase()} · ${(Math.min((ts - start) / 1000, duration / 1000)).toFixed(1)}s`, 18, height - 16);

        if (ts - start < duration) {
          requestAnimationFrame(draw);
        } else {
          recorder.stop();
        }
      };

      const blobPromise = new Promise((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          resolve({ url, label });
        };
      });
      recorder.start();
      requestAnimationFrame(draw);
      return blobPromise;
    };

    const clips = [];
    try {
      for (const cfg of configs) {
        clips.push(await makeClip(cfg));
      }
      setGeneratedClips(clips);
    } catch (error) {
      console.warn('Failed to generate sample clips:', error);
      clips.forEach((clip) => clip?.url && URL.revokeObjectURL(clip.url));
      setGeneratedClips([]);
    }
  };

  return (
    <div className="samples-shell">
      <header className="samples-header">
        <div>
          <h1>Sample Templates and Voices</h1>
          <p>Kickstart your next render with ready-made scripts and preview voices in-browser.</p>
        </div>
        <div className="voice-controls">
          <label>
            <span>Voice</span>
            <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)}>
              {voices.map(v => (
                <option key={`${v.name}-${v.lang}`} value={v.name}>{v.name} ({v.lang})</option>
              ))}
            </select>
          </label>
          <label>
            <span>Rate</span>
            <input type="range" min="0.6" max="1.4" step="0.05" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
          </label>
          <label>
            <span>Pitch</span>
            <input type="range" min="0.7" max="1.3" step="0.05" value={pitch} onChange={(e) => setPitch(Number(e.target.value))} />
          </label>
        </div>
      </header>

      <section className="generated-samples">
        <div className="generated-header">
          <h2>Generated Sample Videos</h2>
          <button className="primary" onClick={generateProceduralClips}>Generate new samples</button>
        </div>
        {generatedClips.length === 0 ? (
          <p className="generated-hint">Click “Generate new samples” to create three unique demo clips (WebM).</p>
        ) : (
          <div className="generated-grid">
            {generatedClips.map((clip) => (
              <figure key={clip.url} className="generated-item">
                <video src={clip.url} controls playsInline />
                <figcaption>{clip.label}</figcaption>
                <a className="ghost" href={clip.url} download>Download</a>
              </figure>
            ))}
          </div>
        )}
      </section>

      <section className="templates-grid">
        {TEMPLATES.map((tpl) => (
          <article className="template-card" key={tpl.id}>
            <div className="media">
              {tpl.preview ? (
                <video src={tpl.preview} autoPlay loop muted playsInline />
              ) : (
                <div className="placeholder" />
              )}
            </div>
            <div className="template-body">
              <h3>{tpl.title}</h3>
              <pre className="template-script">{tpl.text}</pre>
              <div className="template-actions">
                <button className="ghost" onClick={() => speak(tpl.text)}>Preview voice</button>
                <button className="primary" onClick={() => useTemplate(tpl)}>Use this template</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default SampleLibrary;
