document.addEventListener('DOMContentLoaded', () => {
    // Validar autorización
    if (sessionStorage.getItem('inventario_auth') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Mostrar usuario y rol en el Topbar
    const userRole = sessionStorage.getItem('user_role') || 'Invitado';
    const userName = sessionStorage.getItem('user_name') || 'Usuario';
    const topBarName = document.querySelector('.user-info .user-name');
    const topBarRole = document.querySelector('.user-info .user-role');
    if (topBarName && topBarRole) {
        topBarName.textContent = userName;
        topBarRole.textContent = userRole;
    }

    // Funcionalidad Cerrar Sesión desde el Topbar
    const logoutBtn = document.querySelector('.btn-logout-topbar');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('inventario_auth');
            sessionStorage.removeItem('user_role');
            sessionStorage.removeItem('user_name');
            window.location.href = 'index.html';
        });
    }

    // --- Declaración de Variables de Navegación y Vistas ---
    const navResumen = document.getElementById('nav-resumen');
    const navProductos = document.getElementById('nav-productos');
    const navOrdenes = document.getElementById('nav-ordenes');
    const navVentas = document.getElementById('nav-ventas');
    const navCompras = document.getElementById('nav-compras');
    const navCierre = document.getElementById('nav-cierre');
    const navUsuarios = document.getElementById('nav-usuarios');

    const viewResumen = document.getElementById('view-resumen');
    const viewProductos = document.getElementById('view-productos');
    const viewVentas = document.getElementById('view-ventas');
    const viewCompras = document.getElementById('view-compras');
    const viewCierre = document.getElementById('view-cierre');
    const viewUsuarios = document.getElementById('view-usuarios');

    const pageTitle = document.getElementById('page-title-text');
    const pageSubtitle = document.getElementById('page-subtitle-text');

    // RBAC: Función para restringir acciones según el rol
    function applyRBAC() {
        if (userRole === 'Invitado') {
            document.body.classList.add('guest-mode');

            // 1. Ocultar botones de añadir principales y genéricos
            const actionBtnIds = [
                'btn-nuevo-usuario', 'btn-nueva-venta',
                'btn-nueva-compra', 'btn-nuevo-registro'
            ];
            actionBtnIds.forEach(id => {
                const btn = document.getElementById(id);
                if (btn) btn.style.display = 'none';
            });

            document.querySelectorAll('.btn-premium').forEach(btn => {
                const text = btn.innerText.toLowerCase();
                if (text.includes('nuevo') || text.includes('agregar') || text.includes('añadir')) {
                    btn.style.display = 'none';
                }
            });

            // 2. Ocultar la columna de "Acciones" en todas las tablas
            document.querySelectorAll('table').forEach(table => {
                const headers = table.querySelectorAll('thead th');
                let actionColumnIndex = -1;
                headers.forEach((th, index) => {
                    const text = th.textContent.trim().toLowerCase();
                    if (text === 'acciones' || text === 'opciones') {
                        th.style.display = 'none';
                        actionColumnIndex = index;
                    }
                });

                if (actionColumnIndex !== -1) {
                    const rows = table.querySelectorAll('tr'); // th y td
                    rows.forEach(row => {
                        const cells = row.children;
                        if (cells[actionColumnIndex]) {
                            cells[actionColumnIndex].style.display = 'none';
                        }
                    });
                }
            });

            // 3. Asegurar visibilidad de secciones pero sin controles
            if (navUsuarios) navUsuarios.style.display = 'flex';

            // 4. Mostrar indicador de Modo Lectura mejorado
            if (!document.getElementById('read-only-badge')) {
                const badge = document.createElement('div');
                badge.id = 'read-only-badge';
                badge.innerHTML = `
                    <div style="width: 8px; height: 8px; background: #60a5fa; border-radius: 50%; margin-right: 10px; box-shadow: 0 0 10px #60a5fa;"></div>
                    <span>Modo Lectura (Sin Permisos de Edición)</span>
                `;
                badge.style.cssText = `
                    position: fixed; bottom: 25px; left: 285px; 
                    background: rgba(15, 23, 42, 0.8); color: #94a3b8; 
                    padding: 10px 20px; border-radius: 12px; 
                    font-size: 11px; font-weight: 600; 
                    display: flex; align-items: center; 
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(15px); z-index: 9999;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                `;
                document.body.appendChild(badge);
            }
        }
    }

    // Iniciar con inventario vacío
    const initialData = [];

    // Lista maestra de marcas para visibilidad constante
    const masterBrands = ['Apple', 'Samsung', 'ZTE', 'Xiaomi', 'Motorola', 'Nokia', 'Huawei', 'Oppo'];

    if (!localStorage.getItem('luxury_inventory')) {
        localStorage.setItem('luxury_inventory', JSON.stringify(initialData));
    }

    // Migración de datos: asegurar que 'brand' exista
    function migrateInventoryData() {
        let inventory = JSON.parse(localStorage.getItem('luxury_inventory')) || [];
        let changed = false;
        inventory = inventory.map(item => {
            if (!item.brand) {
                // Si no tiene marca, la categoría antigua probablemente sea la marca
                item.brand = item.category || "Genérico";
                item.category = "Producto"; // Categoría por defecto
                changed = true;
            }
            return item;
        });
        if (changed) {
            localStorage.setItem('luxury_inventory', JSON.stringify(inventory));
        }
    }
    migrateInventoryData();

    let globalSearchTerm = '';
    const globalSearchInput = document.getElementById('global-search-input');
    if (globalSearchInput) {
        globalSearchInput.addEventListener('input', (e) => {
            globalSearchTerm = e.target.value.toLowerCase().trim();
            // Try to re-render visible tables
            if (typeof renderTable === 'function') renderTable();
            if (typeof renderVentasTable === 'function') renderVentasTable();
            if (typeof renderCierreTable === 'function') renderCierreTable();
        });
    }


    function renderTable() {
        let inventoryData = JSON.parse(localStorage.getItem('luxury_inventory')) || [];
        const tbody = document.getElementById('inventory-body');

        if (!tbody) return;
        tbody.innerHTML = ''; // Limpiar previo

        if (inventoryData.length === 0) {
            const colSpan = (userRole === 'Invitado') ? 7 : 8;
            tbody.innerHTML = `<tr><td colspan="${colSpan}" style="text-align: center; padding: 40px; color: var(--text-sec);">No hay productos registrados.</td></tr>`;
            return;
        }

        // Obtener valor del filtro
        const filtroMarcaEl = document.getElementById('filtro-marca-inventario');
        const filterVal = filtroMarcaEl ? filtroMarcaEl.value : 'all';

        // Filtrar si es necesario
        let displayData = [...inventoryData];
        if (filterVal !== 'all') {
            displayData = displayData.filter(item => item.brand === filterVal);
        }

        // Aplicar búsqueda global
        if (globalSearchTerm) {
            const searchTerms = globalSearchTerm.split(' ').filter(t => t);
            displayData = displayData.filter(item => {
                const combinedString = `${item.name || ''} ${item.id || ''} ${item.brand || ''} ${item.category || ''}`.toLowerCase();
                return searchTerms.every(term => combinedString.includes(term));
            });
        }

        // Renderizado directo sin grupos
        displayData.forEach(item => renderRow(item, tbody));

        // Re-vincular event listeners
        attachInventoryListeners(inventoryData);
    }


    function renderRow(item, tbody) {
        const tr = document.createElement('tr');

        // Formatear precio
        const priceMatch = item.price.match(/(\D+)?([\d,.]+)/);
        const currency = priceMatch ? (priceMatch[1] || 'S/') : 'S/';
        const amount = priceMatch ? priceMatch[2] : item.price;

        // Definir Icono de Estado
        let statusIcon = '';
        if (item.status === 'in-stock') {
            statusIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        } else if (item.status === 'low-stock') {
            statusIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
        } else {
            statusIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        }

        tr.innerHTML = `
            <td><strong>${item.id}</strong></td>
            <td style="color: #f1f5f9; font-weight: 500;">${item.name}</td>
            <td><span style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">${item.brand}</span></td>
            <td><span class="category-tag">${item.category}</span></td>
            <td style="color: #cbd5e1; font-weight: 600;">${item.stock} <span style="font-size: 11px; opacity: 0.6; font-weight: 400;">uds.</span></td>
            <td class="price-cell"><span class="price-currency">${currency}</span> ${amount}</td>
            <td>
                <span class="status ${item.status}">
                    ${statusIcon}
                    ${item.statusLabel}
                </span>
            </td>
            <td style="display: flex; gap: 8px;">
                <button class="action-btn edit-btn" title="Editar" data-id="${item.id}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="action-btn delete-btn" title="Eliminar" data-id="${item.id}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    }

    function attachInventoryListeners(inventoryData) {
        // Event listeners para eliminar
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToRemove = e.currentTarget.getAttribute('data-id');
                if (confirm('¿Estás seguro de que deseas eliminar este producto permanentemente?')) {
                    const currentData = JSON.parse(localStorage.getItem('luxury_inventory')) || [];
                    const filteredData = currentData.filter(item => item.id !== idToRemove);
                    localStorage.setItem('luxury_inventory', JSON.stringify(filteredData));
                    renderTable(); // Recargar tabla
                    updateDashboardMetrics();
                }
            });
        });

        // Event listeners para editar
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToEdit = e.currentTarget.getAttribute('data-id');
                window.open('nuevo_registro.html?edit=' + encodeURIComponent(idToEdit), '_blank');
            });
        });
        applyRBAC();
    }

    // Render original
    renderTable();
    updateDashboardMetrics();

    // Re-renderizar automáticamente cuando se añade algo en la otra pestaña
    window.addEventListener('storage', (e) => {
        if (e.key === 'luxury_inventory' || e.key === '_update_trigger' || e.key === 'luxury_ventas') {
            renderTable();
            updateDashboardMetrics();
            if (typeof renderVentasTable === 'function') {
                renderVentasTable();
            }
            if (typeof renderCierreTable === 'function') {
                renderCierreTable();
            }
        }
    });

    const brandGrid = document.getElementById('brand-grid');

    function resetViews() {
        if (viewResumen) viewResumen.style.display = 'none';
        if (viewProductos) viewProductos.style.display = 'none';
        if (viewVentas) viewVentas.style.display = 'none';
        if (viewCompras) viewCompras.style.display = 'none';
        if (viewCierre) viewCierre.style.display = 'none';
        if (viewUsuarios) viewUsuarios.style.display = 'none';

        navResumen.classList.remove('active');
        navProductos.classList.remove('active');
        navOrdenes.classList.remove('active');
        navCierre.classList.remove('active');
        if (navUsuarios) navUsuarios.classList.remove('active');
        navVentas.style.color = '#94a3b8';
        navCompras.style.color = '#94a3b8';
    }

    function updateDashboardMetrics() {
        const inventoryData = JSON.parse(localStorage.getItem('luxury_inventory')) || [];
        const ventasData = JSON.parse(localStorage.getItem('luxury_ventas')) || [];

        // 1. Total de Activos (Suma de todo el stock)
        const totalStock = inventoryData.reduce((acc, item) => acc + (item.stock || 0), 0);
        const stockEl = document.getElementById('metric-total-activos');
        if (stockEl) stockEl.textContent = totalStock.toLocaleString();

        // 2. Alertas de Stock (Bajo o Agotado)
        const lowStockItems = inventoryData.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock').length;
        const alertEl = document.getElementById('metric-alertas-stock');
        if (alertEl) alertEl.textContent = lowStockItems;

        const totalValue = inventoryData.reduce((acc, item) => {
            const priceStr = item.price || "$ 0";
            const price = parseFloat(priceStr.replace(/[^0-9.-]+/g, "")) || 0;
            return acc + (price * (item.stock || 0));
        }, 0);

        const valueEl = document.getElementById('metric-valor-total');
        if (valueEl) {
            // Si hay mezcla de monedas, mostramos el número con un indicador genérico o el símbolo principal
            // Por ahora mantenemos el formato limpio
            valueEl.textContent = totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // --- NUEVO: Distribución por Marcas ---
        const brandGrid = document.getElementById('brand-grid');
        if (brandGrid) {
            brandGrid.innerHTML = '';

            // Contar por marca
            const counts = {};
            masterBrands.forEach(b => counts[b] = 0);
            inventoryData.forEach(item => {
                if (item.brand && masterBrands.includes(item.brand)) {
                    counts[item.brand] += (item.stock || 0);
                } else if (item.brand) {
                    counts[item.brand] = (counts[item.brand] || 0) + (item.stock || 0);
                }
            });

            // Mostrar todas las marcas maestras + otras que tengan stock
            const allVisibleBrands = [...new Set([...masterBrands, ...Object.keys(counts)])].sort();

            allVisibleBrands.forEach(brand => {
                const stock = counts[brand] || 0;
                if (stock === 0 && !masterBrands.includes(brand)) return; // No mostrar marcas "extra" sin stock

                const card = document.createElement('div');
                card.style.cssText = `
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    padding: 12px;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                `;
                card.onclick = () => { switchTab('productos'); document.getElementById('filtro-marca-inventario').value = brand; renderTable(); };
                card.onmouseover = () => { card.style.background = 'rgba(255,255,255,0.06)'; card.style.borderColor = 'var(--gold-main)'; };
                card.onmouseout = () => { card.style.background = 'rgba(255,255,255,0.03)'; card.style.borderColor = 'rgba(255,255,255,0.05)'; };

                card.innerHTML = `
                    <span style="font-size: 11px; color: var(--text-sec); text-transform: uppercase; letter-spacing: 1px;">${brand}</span>
                    <span style="font-size: 18px; font-weight: 700; color: ${stock > 0 ? 'var(--text-main)' : '#64748b'};">${stock} <small style="font-size: 10px; font-weight: 400; opacity: 0.6;">uds.</span></span>
                `;
                brandGrid.appendChild(card);
            });
        }
    }

    function switchTab(tabName) {
        resetViews();

        if (tabName === 'resumen') {
            navResumen.classList.add('active');
            viewResumen.style.display = 'block';
            pageTitle.textContent = 'Resumen Ejecutivo';
            pageSubtitle.textContent = 'Vista general de todos los módulos y alertas activas.';
            updateDashboardMetrics();
        } else if (tabName === 'productos') {
            navProductos.classList.add('active');
            viewProductos.style.display = 'block';
            pageTitle.textContent = 'Menú de Productos';
            pageSubtitle.textContent = 'Gestión completa de los activos de la organización.';
            renderTable();
        } else if (tabName === 'ventas') {
            navOrdenes.classList.add('active');
            navVentas.style.color = '#3b82f6';
            viewVentas.style.display = 'block';
            pageTitle.textContent = 'Órdenes de Venta';
            pageSubtitle.textContent = 'Historial y registro de transacciones de salida.';
            renderVentasTable();
        } else if (tabName === 'compras') {
            navOrdenes.classList.add('active');
            navCompras.style.color = '#3b82f6';
            viewCompras.style.display = 'block';
            pageTitle.textContent = 'Órdenes de Compra';
            pageSubtitle.textContent = 'Gestión de proveedores y abastecimiento.';
        } else if (tabName === 'cierre') {
            navCierre.classList.add('active');
            viewCierre.style.display = 'block';
            pageTitle.textContent = 'Cierre del Día';
            pageSubtitle.textContent = 'Resumen financiero y consolidación de ingresos.';
            renderCierreTable();
        } else if (tabName === 'usuarios') {
            const navAjustes = document.getElementById('nav-ajustes');
            if (navAjustes) navAjustes.classList.add('active');
            if (navUsuarios) navUsuarios.style.color = '#3b82f6';
            if (viewUsuarios) viewUsuarios.style.display = 'block';
            pageTitle.textContent = 'Gestión de Usuarios';
            pageSubtitle.textContent = 'Administra los accesos y roles del sistema.';
            renderUsuariosTable();
        }
    }

    // Toggle Submenus (Órdenes y Ajustes)
    function attachSubmenuToggle(navId, submenuId) {
        const navElem = document.getElementById(navId);
        const submenuElem = document.getElementById(submenuId);
        if (navElem && submenuElem) {
            navElem.addEventListener('click', (e) => {
                e.preventDefault();
                const chevron = navElem.querySelector('.chevron');
                if (submenuElem.style.display === 'none') {
                    submenuElem.style.display = 'flex';
                    if (chevron) chevron.style.transform = 'rotate(180deg)';

                    // Comportamiento por defecto al abrir
                    if (navId === 'nav-ordenes' && !navElem.classList.contains('active')) {
                        switchTab('ventas');
                    } else if (navId === 'nav-ajustes' && !navElem.classList.contains('active')) {
                        switchTab('usuarios');
                    }
                } else {
                    submenuElem.style.display = 'none';
                    if (chevron) chevron.style.transform = 'rotate(0deg)';
                }
            });
        }
    }

    attachSubmenuToggle('nav-ordenes', 'submenu-ordenes');
    attachSubmenuToggle('nav-ajustes', 'submenu-ajustes');


    if (navResumen) navResumen.addEventListener('click', (e) => { e.preventDefault(); switchTab('resumen'); });
    if (navProductos) navProductos.addEventListener('click', (e) => { e.preventDefault(); switchTab('productos'); });
    if (navVentas) navVentas.addEventListener('click', (e) => { e.preventDefault(); switchTab('ventas'); });
    if (navCompras) navCompras.addEventListener('click', (e) => { e.preventDefault(); switchTab('compras'); });
    if (navCierre) navCierre.addEventListener('click', (e) => { e.preventDefault(); switchTab('cierre'); });
    if (navUsuarios) navUsuarios.addEventListener('click', (e) => { e.preventDefault(); switchTab('usuarios'); });

    // --- Lógica Nueva Venta ---
    const btnNuevaVenta = document.getElementById('btn-nueva-venta');
    const modalVenta = document.getElementById('modal-venta');
    const formVenta = document.getElementById('form-venta');
    const btnCloseVenta = document.getElementById('close-modal-venta');
    const btnCancelVenta = document.getElementById('btn-cancel-venta');
    const selectProductoVenta = document.getElementById('venta-producto');
    const ventasBody = document.getElementById('ventas-body');

    // Inicializar ventas en LocalStorage si no existe
    if (!localStorage.getItem('luxury_ventas')) {
        localStorage.setItem('luxury_ventas', JSON.stringify([]));
    }

    // --- Lógica de Cierre del Día ---
    function normalizeDate(dateStr) {
        if (!dateStr) return "";
        // Convert DD/MM/YYYY or D/M/YYYY to padded DD/MM/YYYY
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            const d = parts[0].padStart(2, '0');
            const m = parts[1].padStart(2, '0');
            const y = parts[2];
            return `${d}/${m}/${y}`;
        }
        return dateStr;
    }

    // Migración automática de fechas antiguas
    function migrateVentasDates() {
        let ventas = JSON.parse(localStorage.getItem('luxury_ventas')) || [];
        let changed = false;
        ventas = ventas.map(v => {
            const normalized = normalizeDate(v.fecha);
            if (v.fecha !== normalized) {
                v.fecha = normalized;
                changed = true;
            }
            return v;
        });
        if (changed) {
            localStorage.setItem('luxury_ventas', JSON.stringify(ventas));
        }
    }
    migrateVentasDates();

    function renderCierreTable() {
        const ventasData = JSON.parse(localStorage.getItem('luxury_ventas')) || [];
        const inventoryData = JSON.parse(localStorage.getItem('luxury_inventory')) || [];
        const cierreBody = document.getElementById('cierre-body');
        const hoyText = document.getElementById('fecha-cierre-hoy');
        const labelText = hoyText ? hoyText.parentElement : null;
        const countText = document.getElementById('cierre-total-ventas-count');
        const montoText = document.getElementById('cierre-total-monto');
        const datePicker = document.getElementById('cierre-fecha-filtro');

        if (!cierreBody) return;

        function getFormattedDate(dateObj) {
            const d = String(dateObj.getDate()).padStart(2, '0');
            const m = String(dateObj.getMonth() + 1).padStart(2, '0');
            const y = dateObj.getFullYear();
            return `${d}/${m}/${y}`;
        }

        const todayFormatted = getFormattedDate(new Date());
        let dateToFilter = todayFormatted;

        if (datePicker && datePicker.value) {
            const [y, m, d] = datePicker.value.split('-');
            dateToFilter = `${d}/${m}/${y}`;
        } else if (datePicker) {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            datePicker.value = `${year}-${month}-${day}`;
        }

        if (hoyText) hoyText.textContent = dateToFilter;
        if (labelText) {
            labelText.innerHTML = dateToFilter === todayFormatted ?
                `Total Recaudado Hoy (<span id="fecha-cierre-hoy">${dateToFilter}</span>)` :
                `Total Recaudado el día (<span id="fecha-cierre-hoy">${dateToFilter}</span>)`;
        }

        let ventasHoy = ventasData.filter(v => normalizeDate(v.fecha) === dateToFilter);

        if (globalSearchTerm) {
            const searchTerms = globalSearchTerm.split(' ').filter(t => t);
            ventasHoy = ventasHoy.filter(v => {
                const combinedString = `${v.id || ''} ${v.cliente || ''} ${v.productoNombre || ''}`.toLowerCase();
                return searchTerms.every(term => combinedString.includes(term));
            });
        }

        cierreBody.innerHTML = '';
        let totalMonto = 0;

        if (ventasHoy.length === 0) {
            const colSpan = (userRole === 'Invitado') ? 6 : 7;
            cierreBody.innerHTML = `<tr><td colspan="${colSpan}" style="text-align: center; padding: 40px; color: var(--text-sec);">No se encontraron ventas para los criterios seleccionados.</td></tr>`;
            if (countText) countText.textContent = '0';
            if (montoText) montoText.textContent = '$0.00';
            return;
        }

        ventasHoy.forEach(venta => {
            const productInfo = inventoryData.find(item => item.id === venta.productoId);
            let unitPrice = 0;
            let unitPriceString = "N/D";

            if (productInfo && productInfo.price) {
                unitPriceString = productInfo.price;
                unitPrice = parseFloat(productInfo.price.replace(/[^0-9.-]+/g, ""));
            }

            const subtotal = unitPrice * venta.cantidad;
            totalMonto += subtotal;

            // Detectar símbolo original
            const symbol = unitPriceString.includes('S/') ? 'S/' : '$';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${venta.id}</strong></td>
                <td>${venta.cliente}</td>
                <td>${venta.productoNombre}</td>
                <td>${venta.cantidad} uds.</td>
                <td style="font-family: 'Space Grotesk', sans-serif;">${unitPriceString}</td>
                <td style="font-family: 'Space Grotesk', sans-serif; color: #10b981;">
                    ${symbol} ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td>
                    <button class="action-btn delete-cierre-btn" title="Eliminar y Anular" 
                        data-id="${venta.id}" 
                        data-prod="${venta.productoId}" 
                        data-qty="${venta.cantidad}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </td>
            `;
            cierreBody.appendChild(tr);
        });

        // Event listeners para eliminar desde el Cierre
        document.querySelectorAll('.delete-cierre-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToRemove = e.currentTarget.getAttribute('data-id');
                const prodId = e.currentTarget.getAttribute('data-prod');
                const qtyToRestore = parseInt(e.currentTarget.getAttribute('data-qty'));

                if (confirm('¿Deseas eliminar esta venta del Cierre del Día? El stock se restaurará en el inventario.')) {
                    // 1. Eliminar de luxury_ventas
                    const ventasTotal = JSON.parse(localStorage.getItem('luxury_ventas')) || [];
                    const filteredData = ventasTotal.filter(v => v.id !== idToRemove);
                    localStorage.setItem('luxury_ventas', JSON.stringify(filteredData));

                    // 2. Restaurar Stock
                    const inventory = JSON.parse(localStorage.getItem('luxury_inventory')) || [];
                    const itemIdx = inventory.findIndex(item => item.id === prodId);
                    if (itemIdx !== -1) {
                        inventory[itemIdx].stock += qtyToRestore;
                        // Forzar refresco de estado (Óptimo/Advertencia/Crítico)
                        const stock = inventory[itemIdx].stock;
                        if (stock === 0) {
                            inventory[itemIdx].status = 'out-of-stock';
                            inventory[itemIdx].statusLabel = 'Crítico';
                        } else if (stock <= 5) {
                            inventory[itemIdx].status = 'low-stock';
                            inventory[itemIdx].statusLabel = 'Advertencia';
                        } else {
                            inventory[itemIdx].status = 'in-stock';
                            inventory[itemIdx].statusLabel = 'Óptimo';
                        }
                        localStorage.setItem('luxury_inventory', JSON.stringify(inventory));
                    }

                    // 3. Notificar y Actualizar Todo
                    localStorage.setItem('_update_trigger', Date.now());
                    renderCierreTable();
                    renderTable();
                    updateDashboardMetrics();
                    if (typeof renderVentasTable === 'function') renderVentasTable();
                }
            });
        });

        if (countText) countText.textContent = ventasHoy.length;
        if (montoText) montoText.textContent = '$' + totalMonto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        applyRBAC();
    }

    function renderVentasTable() {
        let localVentasData = JSON.parse(localStorage.getItem('luxury_ventas')) || [];

        if (globalSearchTerm) {
            const searchTerms = globalSearchTerm.split(' ').filter(t => t);
            localVentasData = localVentasData.filter(v => {
                const combinedString = `${v.id || ''} ${v.cliente || ''} ${v.productoNombre || ''}`.toLowerCase();
                return searchTerms.every(term => combinedString.includes(term));
            });
        }

        if (!ventasBody) return;
        ventasBody.innerHTML = '';

        if (localVentasData.length === 0) {
            const colSpan = (userRole === 'Invitado') ? 5 : 6;
            ventasBody.innerHTML = `<tr><td colspan="${colSpan}" style="text-align: center; padding: 40px; color: var(--text-sec);">No hay ventas registradas actualmente.</td></tr>`;
            return;
        }

        localVentasData.forEach(venta => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${venta.id}</strong></td>
                <td>${venta.cliente}</td>
                <td>${venta.productoNombre}</td>
                <td>${venta.cantidad} uds.</td>
                <td style="font-family: 'Space Grotesk', sans-serif;">${venta.fecha}</td>
                <td style="display: flex; gap: 8px;">
                    <button class="action-btn edit-venta-btn" title="Editar" data-id="${venta.id}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="action-btn delete-venta-btn" title="Eliminar" data-id="${venta.id}" data-prod="${venta.productoId}" data-qty="${venta.cantidad}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </td>
            `;
            ventasBody.appendChild(tr);
        });

        // Event listeners para eliminar ventas y restaurar stock
        document.querySelectorAll('.delete-venta-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToRemove = e.currentTarget.getAttribute('data-id');
                const prodId = e.currentTarget.getAttribute('data-prod');
                const qtyToRestore = parseInt(e.currentTarget.getAttribute('data-qty'));

                if (confirm('¿Estás seguro de que deseas eliminar y anular esta venta? El stock será devuelto al inventario.')) {
                    // 1. Eliminar la venta
                    const allVentas = JSON.parse(localStorage.getItem('luxury_ventas')) || [];
                    const filteredData = allVentas.filter(item => item.id !== idToRemove);
                    localStorage.setItem('luxury_ventas', JSON.stringify(filteredData));

                    // 2. Restaurar Stock
                    const inventoryData = JSON.parse(localStorage.getItem('luxury_inventory')) || [];
                    const itemIndex = inventoryData.findIndex(item => item.id === prodId);

                    if (itemIndex !== -1) {
                        inventoryData[itemIndex].stock += qtyToRestore;

                        // Recalcular estado
                        const stock = inventoryData[itemIndex].stock;
                        if (stock === 0) {
                            inventoryData[itemIndex].status = 'out-of-stock';
                            inventoryData[itemIndex].statusLabel = 'Crítico';
                        } else if (stock < 5) {
                            inventoryData[itemIndex].status = 'low-stock';
                            inventoryData[itemIndex].statusLabel = 'Advertencia';
                        } else {
                            inventoryData[itemIndex].status = 'in-stock';
                            inventoryData[itemIndex].statusLabel = 'Óptimo';
                        }

                        localStorage.setItem('luxury_inventory', JSON.stringify(inventoryData));
                        renderTable(); // Recargar tabla de inventario principal
                    }

                    renderVentasTable(); // Recargar tabla de ventas
                    renderCierreTable(); // Recargar cierre
                    updateDashboardMetrics(); // Recargar métricas del dashboard
                    alert('Venta eliminada y stock restaurado exitosamente.');
                }
            });
        });

        // Event listeners para editar ventas
        document.querySelectorAll('.edit-venta-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToEdit = e.currentTarget.getAttribute('data-id');
                window.open('nueva_venta.html?edit=' + encodeURIComponent(idToEdit), '_blank');
            });
        });
        applyRBAC();
    }

    function openVentaModal() {
        window.open('nueva_venta.html', '_blank');
    }

    // Usar event delegation para el botón de Nueva Venta
    document.addEventListener('click', (e) => {
        const btnVenta = e.target.closest('#btn-nueva-venta');
        if (btnVenta) {
            e.preventDefault();
            openVentaModal();
        }
    });

    // Event listener para el filtro de marca en Inventario
    const filtroMarca = document.getElementById('filtro-marca-inventario');
    if (filtroMarca) {
        filtroMarca.addEventListener('change', () => {
            renderTable();
        });
    }

    if (navResumen) {
        navResumen.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('resumen');
        });
    }

    if (navProductos) {
        navProductos.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('productos');
        });
    }

    if (navVentas) {
        navVentas.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('ventas');
        });
    }

    if (navCompras) {
        navCompras.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('compras');
        });
    }

    if (navCierre) {
        navCierre.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('cierre');
        });
    }

    // Event listener para el filtro de fecha en Cierre
    const datePickerCierre = document.getElementById('cierre-fecha-filtro');
    if (datePickerCierre) {
        datePickerCierre.addEventListener('change', () => {
            renderCierreTable();
        });
    }

    if (navUsuarios) {
        navUsuarios.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('usuarios');
        });
    }

    // --- Lógica de Gestión de Usuarios ---
    function renderUsuariosTable() {
        // Inicializar con contraseña si no existe o usar la actual
        const defaultUsers = [
            { id: 'U-001', name: 'carlos', email: 'carlos@admin.com', role: 'Administrador', status: 'Activo', pass: 'Compugames1@' }
        ];

        const users = JSON.parse(localStorage.getItem('luxury_users')) || defaultUsers;

        // Asegurarse de que el usuario 'carlos' tenga su contraseña si venimos de version anterior
        if (users.length > 0 && users[0].name === 'Carlos' && !users[0].pass) {
            users[0].pass = 'Compugames1@';
            users[0].name = 'carlos'; // Normalizar a minúsculas como pidió el usuario anteriormente
        }

        // Guardar si no existe
        if (!localStorage.getItem('luxury_users')) {
            localStorage.setItem('luxury_users', JSON.stringify(users));
        }

        const tbody = document.getElementById('usuarios-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${user.name}</strong></td>
                <td>${user.email}</td>
                <td><span style="background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 6px; font-size: 12px; border: 1px solid rgba(255,255,255,0.1);">${user.role}</span></td>
                <td><span class="status in-stock">${user.status}</span></td>
                <td style="display: flex; gap: 8px;">
                    <button class="action-btn edit-user-btn" title="Cambiar Contraseña" data-id="${user.id}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="action-btn delete-user-btn" title="Eliminar" data-id="${user.id}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Edit user password
        document.querySelectorAll('.edit-user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const user = users.find(u => u.id === id);
                if (user) {
                    const modalPassword = document.getElementById('modal-password');
                    const userNameDisplay = document.getElementById('password-modal-user-name');
                    const userIdInput = document.getElementById('passwordUserId');
                    const newPasswordInput = document.getElementById('newPasswordInput');

                    if (modalPassword && userNameDisplay && userIdInput && newPasswordInput) {
                        userNameDisplay.textContent = user.name;
                        userIdInput.value = user.id;
                        newPasswordInput.value = user.pass; // Pre-fill current password
                        modalPassword.style.display = 'flex';
                    }
                }
            });
        });

        // Delete user
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                if (id === 'U-001') {
                    alert('No puedes eliminar al administrador principal.');
                    return;
                }
                if (confirm('¿Estás seguro de eliminar a este usuario?')) {
                    const filtered = users.filter(u => u.id !== id);
                    localStorage.setItem('luxury_users', JSON.stringify(filtered));
                    renderUsuariosTable();
                }
            });
        });
        applyRBAC();
    }

    const btnNuevoUsuario = document.getElementById('btn-nuevo-usuario');
    const modalUsuario = document.getElementById('modal-usuario');
    const btnCancelUser = document.getElementById('btn-cancel-user');
    const userForm = document.getElementById('user-form');

    if (btnNuevoUsuario) {
        btnNuevoUsuario.onclick = () => modalUsuario.style.display = 'flex';
    }

    if (btnCancelUser) {
        btnCancelUser.onclick = () => {
            modalUsuario.style.display = 'none';
            userForm.reset();
        };
    }

    if (userForm) {
        userForm.onsubmit = (e) => {
            e.preventDefault();
            const users = JSON.parse(localStorage.getItem('luxury_users')) || [];
            const newUser = {
                id: 'U-' + Date.now().toString().slice(-4),
                name: document.getElementById('userName').value.trim(),
                email: document.getElementById('userEmail').value.trim(),
                role: document.getElementById('userRole').value,
                pass: document.getElementById('userPass').value.trim(),
                status: 'Activo'
            };
            users.push(newUser);
            localStorage.setItem('luxury_users', JSON.stringify(users));
            renderUsuariosTable();
            modalUsuario.style.display = 'none';
            userForm.reset();
        };
    }

    // --- Lógica del Modal de Contraseña ---
    const modalPassword = document.getElementById('modal-password');
    const btnCancelPassword = document.getElementById('btn-cancel-password');
    const passwordForm = document.getElementById('password-form');

    if (btnCancelPassword) {
        btnCancelPassword.onclick = () => {
            modalPassword.style.display = 'none';
            passwordForm.reset();
        };
    }

    if (passwordForm) {
        passwordForm.onsubmit = (e) => {
            e.preventDefault();
            const users = JSON.parse(localStorage.getItem('luxury_users')) || [];
            const userId = document.getElementById('passwordUserId').value;
            const newPass = document.getElementById('newPasswordInput').value.trim();

            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex !== -1 && newPass !== "") {
                users[userIndex].pass = newPass;
                localStorage.setItem('luxury_users', JSON.stringify(users));
                renderUsuariosTable();
                modalPassword.style.display = 'none';
                passwordForm.reset();

                // Mostrar feedback de confirmación
                const successMsg = document.createElement('div');
                successMsg.textContent = 'Contraseña actualizada correctamente.';
                successMsg.style.cssText = `
                    position: fixed; top: 20px; right: 20px; 
                    background: #10b981; color: white; 
                    padding: 16px 24px; border-radius: 8px; 
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    z-index: 10000; font-weight: 500;
                    opacity: 0; transition: opacity 0.3s ease;
                `;
                document.body.appendChild(successMsg);
                setTimeout(() => successMsg.style.opacity = '1', 10);
                setTimeout(() => {
                    successMsg.style.opacity = '0';
                    setTimeout(() => successMsg.remove(), 300);
                }, 3000);
            }
        };
    }

    // --- Lógica Ocultar/Mostrar Contraseña ---
    const togglePasswordBtn = document.getElementById('togglePasswordVisibility');
    const passInput = document.getElementById('newPasswordInput');
    const eyeIconOff = document.getElementById('eyeIconOff');
    const eyeIconOn = document.getElementById('eyeIconOn');

    if (togglePasswordBtn && passInput) {
        togglePasswordBtn.addEventListener('click', () => {
            if (passInput.type === 'password') {
                passInput.type = 'text';
                if (eyeIconOff) eyeIconOff.style.display = 'none';
                if (eyeIconOn) eyeIconOn.style.display = 'block';
            } else {
                passInput.type = 'password';
                if (eyeIconOff) eyeIconOff.style.display = 'block';
                if (eyeIconOn) eyeIconOn.style.display = 'none';
            }
        });
    }

    renderUsuariosTable();
    renderVentasTable();
    renderCierreTable();
    applyRBAC();
});
