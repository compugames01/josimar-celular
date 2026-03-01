document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('inventario_auth') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    if (sessionStorage.getItem('user_role') === 'Invitado') {
        alert('Acceso denegado. Estás en modo Invitado (Solo Lectura).');
        window.close();
        window.location.href = 'dashboard.html';
        return;
    }

    const form = document.getElementById('add-form');
    const successMsg = document.getElementById('success-msg');
    const btnCancel = document.getElementById('btn-cancel');
    const pageTitle = document.querySelector('.modal-title');
    const submitBtn = document.querySelector('.btn-submit');

    // Check for edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    let isEditing = false;
    let currentData = JSON.parse(localStorage.getItem('luxury_inventory')) || [];

    if (editId) {
        const itemToEdit = currentData.find(item => item.id === editId);
        if (itemToEdit) {
            isEditing = true;
            pageTitle.textContent = 'Editar Producto';
            submitBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Guardar Cambios';

            // Populate form
            document.getElementById('itemId').value = itemToEdit.id;
            document.getElementById('itemId').readOnly = true; // No allow changing ID on edit
            document.getElementById('itemName').value = itemToEdit.name;
            const isCable = itemToEdit.category === 'Cable de Carga';
            if (isCable) {
                if (document.getElementById('itemType')) document.getElementById('itemType').value = itemToEdit.brand || "";
            } else {
                if (document.getElementById('itemBrand')) document.getElementById('itemBrand').value = itemToEdit.brand || "";
            }
            document.getElementById('itemCategory').value = itemToEdit.category;
            document.getElementById('itemStock').value = itemToEdit.stock;

            // Manejar precio y moneda
            const fullPrice = itemToEdit.price || "$0.00";
            if (fullPrice.startsWith('S/')) {
                document.getElementById('itemCurrency').value = 'S/';
                document.getElementById('itemPrice').value = fullPrice.replace('S/', '').trim();
            } else {
                document.getElementById('itemCurrency').value = '$';
                document.getElementById('itemPrice').value = fullPrice.replace('$', '').trim();
            }
        }
    }

    // Lógica de visibilidad condicional
    const itemCategorySelect = document.getElementById('itemCategory');
    const containerId = document.getElementById('container-itemId');
    const containerName = document.getElementById('container-itemName');
    const inputId = document.getElementById('itemId');
    const inputName = document.getElementById('itemName');

    const technicalCategories = [
        'Cámara Frontal',
        'Cámara Trasera',
        'Parlantes',
        'Flex de Pantalla',
        'Flex de Carga',
        'Placa Madre',
        'Módulo de Carga',
        'Pantalla',
        'Batería',
        'Bandeja de Chip'
    ];

    const containerBrand = document.getElementById('container-itemBrand');
    const containerType = document.getElementById('container-itemType');
    const inputBrand = document.getElementById('itemBrand');
    const inputType = document.getElementById('itemType');

    function updateVisibility() {
        const selectedCategory = itemCategorySelect.value;
        const isTechnical = technicalCategories.includes(selectedCategory);
        const isCable = selectedCategory === 'Cable de Carga';

        // Visibility for Technical categories
        if (isTechnical) {
            containerId.style.display = 'none';
            containerName.style.display = 'none';
            inputId.required = false;
            inputName.required = false;
        } else {
            containerId.style.display = 'block';
            containerName.style.display = 'block';
            inputId.required = true;
            inputName.required = true;
        }

        // Visibility for Cable logic
        if (isCable) {
            containerBrand.style.display = 'none';
            containerType.style.display = 'block';
            inputBrand.required = false;
            inputType.required = true;
        } else {
            containerBrand.style.display = 'block';
            containerType.style.display = 'none';
            inputBrand.required = true;
            inputType.required = false;
        }
    }

    itemCategorySelect.addEventListener('change', updateVisibility);
    // Ejecutar al cargar por si es edición
    if (isEditing) {
        setTimeout(updateVisibility, 100);
    }

    // Cerrar pestaña en cancelar
    btnCancel.addEventListener('click', () => {
        window.close();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Format price before save
        // Format price before save
        const rawPriceStr = document.getElementById('itemPrice').value.replace(/,/g, '');
        const numericPrice = parseFloat(rawPriceStr);
        const currencySymbol = document.getElementById('itemCurrency').value;
        const formattedPrice = currencySymbol + ' ' + (isNaN(numericPrice) ? "0.00" : numericPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

        // Obtener valores
        const categoryValue = document.getElementById('itemCategory').value;
        const isCable = categoryValue === 'Cable de Carga';
        const brandValue = isCable
            ? document.getElementById('itemType').value
            : (document.getElementById('itemBrand') ? document.getElementById('itemBrand').value : "");

        const isTechnical = technicalCategories.includes(categoryValue);

        const item = {
            id: isTechnical ? `${brandValue}-${categoryValue}-${Date.now().toString().slice(-4)}` : document.getElementById('itemId').value,
            name: isTechnical ? `${categoryValue} ${brandValue}` : document.getElementById('itemName').value,
            brand: brandValue,
            category: categoryValue,
            stock: parseInt(document.getElementById('itemStock').value),
            price: formattedPrice,
        };

        // Asignar estado dinámico
        if (item.stock === 0) {
            item.status = 'out-of-stock';
            item.statusLabel = 'Crítico';
        } else if (item.stock < 5) {
            item.status = 'low-stock';
            item.statusLabel = 'Advertencia';
        } else {
            item.status = 'in-stock';
            item.statusLabel = 'Óptimo';
        }

        // Guardar o Actualizar
        if (isEditing) {
            const index = currentData.findIndex(i => i.id === editId);
            if (index !== -1) {
                currentData[index] = item;
            }
            successMsg.querySelector('.success-title').textContent = '¡Ojo Clínico!';
            successMsg.querySelector('p').textContent = 'El registro ha sido actualizado con éxito.';
        } else {
            currentData.unshift(item); // Agregamos al principio
        }

        localStorage.setItem('luxury_inventory', JSON.stringify(currentData));

        // Mostrar msj de éxito y limpiar form
        successMsg.classList.remove('hidden');
        if (!isEditing) form.reset();

        // Cerrar pestaña después de 2s
        setTimeout(() => {
            window.close();
        }, 2000);
    });
});
