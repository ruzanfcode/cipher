import { useEffect, useState } from 'react';

function ImageSlot({ id, src, credit, creditHref, placeholder = 'Drop an image', shape = 'rect' }) {
  const storageKey = `cipher-image-slot:${id}`;
  const [droppedSrc, setDroppedSrc] = useState('');

  useEffect(() => {
    try {
      setDroppedSrc(localStorage.getItem(storageKey) || '');
    } catch {
      setDroppedSrc('');
    }
  }, [storageKey]);

  const displaySrc = droppedSrc || src;

  function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result || '');
      setDroppedSrc(value);
      try {
        localStorage.setItem(storageKey, value);
      } catch {
        // The original component persisted drops best-effort as well.
      }
    };
    reader.readAsDataURL(file);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function clearImage(event) {
    event.stopPropagation();
    setDroppedSrc('');
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage failures.
    }
  }

  return (
    <div className={`image-slot image-slot--${shape}`} onDrop={handleDrop} onDragOver={handleDragOver}>
      {displaySrc ? <img src={displaySrc} alt="" /> : <div className="image-slot__placeholder">{placeholder}</div>}
      {droppedSrc ? (
        <button className="image-slot__clear" type="button" onClick={clearImage} aria-label="Clear dropped image">
          x
        </button>
      ) : null}
      {!droppedSrc && displaySrc && credit ? (
        <a className="image-slot__credit" href={creditHref || undefined} target="_blank" rel="noreferrer">
          {credit}
        </a>
      ) : null}
    </div>
  );
}

export default ImageSlot;
