(function () {
  'use strict';

  // Configuración de PDF.js Worker
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

  /* ============================ ESTADO DE ACCESIBILIDAD Y PDF ============================ */
  let pdfDoc = null;
  let pageNum = 1;
  let pageRendering = false;
  let pageNumPending = null;
  let currentScale = 1.2;
  let fontSizeOffset = 0; // en px
  let isSpeaking = false;
  let currentPageText = '';

  /* ============================ ELEMENTOS DOM ============================ */
  const canvas = document.getElementById('pdf-canvas');
  const ctx = canvas.getContext('2d');
  const textLayerDiv = document.getElementById('pdf-text-layer');
  const pageWrapper = document.getElementById('page-wrapper');
  const pageDisplay = document.getElementById('page-num-display');
  const announcer = document.getElementById('screen-reader-announcer');

  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnFontInc = document.getElementById('btn-font-increase');
  const btnFontDec = document.getElementById('btn-font-decrease');
  const btnRead = document.getElementById('btn-read-aloud');

  /* ============================ LECTOR DE PANTALLA ============================ */
  function announce(text) {
    if (announcer) {
      announcer.textContent = text;
    }
  }

  /* ============================ EFECTOS DE SONIDO (AUDIO CONTEXT) ============================ */
  let audioCtx = null;

  function playPageFlipSound() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = audioCtx || new Ctx();

      // Ruido sintético tipo hojear página
      const bufferSize = audioCtx.sampleRate * 0.12;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.12);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start();
    } catch (e) {
      /* Audio no permitido o no soportado */
    }
  }

  /* ============================ RENDERING DE PÁGINAS PDF ============================ */
  function renderPage(num) {
    pageRendering = true;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    isSpeaking = false;
    updateReadButtonUI();

    // Animación de transición visual de página
    pageWrapper.classList.remove('page-turn-animation');
    void pageWrapper.offsetWidth; // Trigger reflow
    pageWrapper.classList.add('page-turn-animation');

    playPageFlipSound();

    pdfDoc.getPage(num).then(function (page) {
      const viewport = page.getViewport({ scale: currentScale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };

      const renderTask = page.render(renderContext);

      renderTask.promise
        .then(function () {
          pageRendering = false;
          if (pageNumPending !== null) {
            renderPage(pageNumPending);
            pageNumPending = null;
          }
        })
        .then(function () {
          return page.getTextContent();
        })
        .then(function (textContent) {
          // Extraer texto plano para la lectura en voz alta
          currentPageText = textContent.items.map((item) => item.str).join(' ');

          // Anuncio para el Lector de Pantalla
          announce('Página ' + num + ' de ' + pdfDoc.numPages + '. ' + currentPageText);
        });
    });

    pageDisplay.textContent = 'Página ' + num + ' / ' + pdfDoc.numPages;
    btnPrev.disabled = num <= 1;
    btnNext.disabled = num >= pdfDoc.numPages;
  }

  function queueRenderPage(num) {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  function onPrevPage() {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
  }

  function onNextPage() {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
  }

  /* ============================ CARTA Y CONSUMO DE PDF ============================ */
  // Consume el archivo `juego.pdf` alojado en la raíz del repositorio
  pdfjsLib
    .getDocument('juego.pdf')
    .promise.then(function (pdfDoc_) {
      pdfDoc = pdfDoc_;
      pageDisplay.textContent = 'Página ' + pageNum + ' / ' + pdfDoc.numPages;
      renderPage(pageNum);
    })
    .catch(function (error) {
      console.error('Error al cargar el archivo juego.pdf:', error);
      pageDisplay.textContent = 'Error al cargar juego.pdf';
      announce('Error al cargar el archivo de juego en PDF.');
    });

  /* ============================ LECTURA EN VOZ ALTA (TTS) ============================ */
  function toggleReadAloud() {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta lectura en voz alta.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      announce('Lectura pausada.');
    } else {
      if (!currentPageText.trim()) {
        announce('No hay texto legible en esta página.');
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentPageText);
      utterance.lang = 'es-ES';
      utterance.rate = 0.95; // Un poco más pausado para alumnos con baja visión

      utterance.onend = function () {
        isSpeaking = false;
        updateReadButtonUI();
      };

      utterance.onerror = function () {
        isSpeaking = false;
        updateReadButtonUI();
      };

      window.speechSynthesis.speak(utterance);
      isSpeaking = true;
      announce('Iniciando lectura en voz alta.');
    }
    updateReadButtonUI();
  }

  function updateReadButtonUI() {
    if (isSpeaking) {
      btnRead.classList.add('speaking');
      btnRead.querySelector('.btn-text').textContent = 'Detener Lectura';
    } else {
      btnRead.classList.remove('speaking');
      btnRead.querySelector('.btn-text').textContent = 'Leer en voz alta';
    }
  }

  /* ============================ TAMAÑO DE TEXTO (AGRANDAR / ACHICAR) ============================ */
  function changeFontSize(delta) {
    fontSizeOffset += delta;
    if (fontSizeOffset < -4) fontSizeOffset = -4;
    if (fontSizeOffset > 12) fontSizeOffset = 12;

    document.body.style.fontSize = 16 + fontSizeOffset + 'px';
    announce(
      delta > 0
        ? 'Tamaño de texto aumentado'
        : 'Tamaño de texto disminuido'
    );
  }

  /* ============================ LISTENERS DE EVENTOS ============================ */
  btnPrev.addEventListener('click', onPrevPage);
  btnNext.addEventListener('click', onNextPage);
  btnRead.addEventListener('click', toggleReadAloud);
  btnFontInc.addEventListener('click', function () {
    changeFontSize(2);
  });
  btnFontDec.addEventListener('click', function () {
    changeFontSize(-2);
  });

  // Atajos de teclado para accesibilidad
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') onNextPage();
    if (e.key === 'ArrowLeft') onPrevPage();
  });
})();