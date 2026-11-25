/**
 * AZ VALUACIONES - INTERACTIVIDAD Y LÓGICA
 * Manejo de cotizador interactivo, modal, navegación y WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  // Constantes del negocio (según capturas del usuario)
  const WHATSAPP_PHONE = '525582261987';
  const CONTACT_EMAIL = 'contacto@azvaluaciones.com';

  /* ---------------- 1. HEADER & MENÚ SCROLL ---------------- */
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
      });
    });
  }

  /* ---------------- 2. MODAL SOLICITAR AVALÚO ---------------- */
  const modalOverlay = document.getElementById('modal-solicitar');
  const modalOpenBtns = document.querySelectorAll('.open-modal-btn');
  const modalCloseBtn = document.querySelector('.modal-close-btn');

  function openModal(defaultService = '') {
    if (modalOverlay) {
      if (defaultService) {
        const select = document.getElementById('modal-servicio');
        if (select) select.value = defaultService;
      }
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  modalOpenBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      openModal(service);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  /* ---------------- 3. TABS DE DOCUMENTACIÓN ---------------- */
  const tabBtns = document.querySelectorAll('.docs-tab-btn');
  const tabPanes = document.querySelectorAll('.docs-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  /* ---------------- 4. COTIZADOR INTERACTIVO (CALCULADORA DE AVALÚO) ---------------- */
  const propertyRadios = document.querySelectorAll('input[name="calc-property"]');
  const purposeSelect = document.getElementById('calc-purpose');
  const areaInput = document.getElementById('calc-area');
  const locationInput = document.getElementById('calc-location');

  const summaryProperty = document.getElementById('summary-property');
  const summaryPurpose = document.getElementById('summary-purpose');
  const summaryTime = document.getElementById('summary-time');
  const summaryType = document.getElementById('summary-type');
  const btnCalcWhatsapp = document.getElementById('btn-calc-whatsapp');

  function updateCalculator() {
    let selectedProp = 'Casa / Departamento';
    propertyRadios.forEach(r => {
      if (r.checked) {
        const label = r.parentElement.querySelector('.calc-radio-label');
        if (label) selectedProp = label.textContent.trim();
      }
    });

    const purposeText = purposeSelect ? purposeSelect.options[purposeSelect.selectedIndex].text : 'Crédito Hipotecario';
    const area = areaInput && areaInput.value ? `${areaInput.value} m²` : 'Por definir';
    const location = locationInput && locationInput.value ? locationInput.value.trim() : 'Estado de México / CDMX';

    // Estimación de tiempos de entrega según tipo de inmueble
    let time = '48 a 72 hrs hábiles';
    let docType = 'Dictamen Oficial Certificado';

    if (selectedProp.includes('Comercial') || selectedProp.includes('Industrial')) {
      time = '3 a 5 días hábiles';
      docType = 'Avalúo Comercial con Enfoque de Ingresos';
    } else if (selectedProp.includes('Terreno')) {
      time = '48 a 72 hrs hábiles';
      docType = 'Avalúo Técnico Catastral y Comercial';
    }

    if (summaryProperty) summaryProperty.textContent = selectedProp;
    if (summaryPurpose) summaryPurpose.textContent = purposeText;
    if (summaryTime) summaryTime.textContent = time;
    if (summaryType) summaryType.textContent = docType;

    // Generar enlace dinámico de WhatsApp prellenado
    if (btnCalcWhatsapp) {
      const msg = `Hola AZ Valuaciones, me gustaría solicitar una cotización formal para un avalúo con las siguientes características:\n\n` +
                  `• Tipo de inmueble: ${selectedProp}\n` +
                  `• Propósito: ${purposeText}\n` +
                  `• Superficie estimada: ${area}\n` +
                  `• Ubicación: ${location}\n\n` +
                  `¿Podrían indicarme costos, requisitos y disponibilidad de visita técnica? Gracias.`;
      btnCalcWhatsapp.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    }
  }

  propertyRadios.forEach(r => r.addEventListener('change', updateCalculator));
  if (purposeSelect) purposeSelect.addEventListener('change', updateCalculator));
  if (areaInput) areaInput.addEventListener('input', updateCalculator);
  if (locationInput) locationInput.addEventListener('input', updateCalculator);

  // Inicializar estado del cotizador
  updateCalculator();

  /* ---------------- 5. FORMULARIO MODAL (ENVÍO POR WHATSAPP O FORM) ---------------- */
  const modalForm = document.getElementById('modal-solicitar-form');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('modal-nombre')?.value || '';
      const tel = document.getElementById('modal-telefono')?.value || '';
      const servicio = document.getElementById('modal-servicio')?.value || '';
      const ubicacion = document.getElementById('modal-ubicacion')?.value || '';
      const mensaje = document.getElementById('modal-mensaje')?.value || '';

      const text = `Hola AZ Valuaciones, solicito asesoría para un avalúo:\n\n` +
                   `• Nombre: ${nombre}\n` +
                   `• Teléfono: ${tel}\n` +
                   `• Servicio: ${servicio}\n` +
                   `• Ubicación: ${ubicacion}\n` +
                   `• Comentarios: ${mensaje}`;

      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
      closeModal();
    });
  }

  /* ---------------- 6. FORMULARIO PRINCIPAL DE CONTACTO ---------------- */
  const mainContactForm = document.getElementById('main-contact-form');
  if (mainContactForm) {
    mainContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('contact-name')?.value || '';
      const tel = document.getElementById('contact-phone')?.value || '';
      const servicio = document.getElementById('contact-service')?.value || '';
      const msg = document.getElementById('contact-message')?.value || '';

      const text = `Hola AZ Valuaciones, envío mi solicitud de avalúo desde su sitio web:\n\n` +
                   `• Nombre: ${nombre}\n` +
                   `• Teléfono: ${tel}\n` +
                   `• Servicio: ${servicio}\n` +
                   `• Mensaje: ${msg}`;

      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
    });
  }
});
