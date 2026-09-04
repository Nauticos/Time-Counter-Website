const { useState, useRef, useEffect } = React;

const WEBSITE_START_TIME = new Date().toLocaleTimeString([], {
  hour:'2-digit',
  minute: '2-digit',
  second: '2-digit',
});

document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.width = '100vw';
document.body.style.height = '100vh';
document.body.style.overflow = 'hidden';

function addTimer(ctx, time, width, height) {
  const BG_COLOURS = [
    '#ff0000',
    '#ff8000',
    '#ffd500',
    '#00ff11',
    '#00ffff',
    '#002fff',
    '#9000ff',
    '#fd01e4',
  ];

  const colourIndex = Math.floor(time / 10) % BG_COLOURS.length;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = BG_COLOURS[colourIndex];
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;

  if (time > 0 && time % 10 === 0) {
    const particleCount = 16;
    const burstRadius = Math.min(width, height) * 0.28;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i * (2 * Math.PI)) / particleCount;
      const px = centerX + Math.cos(angle) * burstRadius;
      const py = centerY + Math.sin(angle) * burstRadius;

      ctx.beginPath();
      ctx.arc(px, py, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.fill();
    }
  }

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 6;
  ctx.font = 'bold 40px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Time spent on website', centerX, centerY - 300);

  const radius = Math.min(width, height) * 0.18;
  const startAngle = -Math.PI / 2;
  const currentSeconds = time % 10;
  const progressFraction = currentSeconds / 10;
  const endAngle = startAngle + progressFraction * (2 *Math.PI);

  ctx.shadowColor = 'transparent';

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#2d2d2d';
  ctx.stroke();

  if (currentSeconds > 0) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#ffffff';
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  ctx.font = 'bold 40px "Courier New", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 6;
  ctx.fillText(`${time}s`, centerX, centerY);

  ctx.font = '16px "Courier New", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.shadowBlur = 4;
  ctx.fillText(`Website opened at ${WEBSITE_START_TIME}`, centerX, height - 40);

  ctx.shadowColor = 'transparent';
}

function App() {
  const canvasRef = useRef(null);
  const [count, setCount] = useState(0);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      addTimer(ctx, count, dimensions.width, dimensions.height);
    }
  }, [count]);

  return React.createElement('canvas', {
    ref: canvasRef,
    width: dimensions.width,
    height: dimensions.height,
  });
}

ReactDOM.createRoot(document.body).render(React.createElement(App));