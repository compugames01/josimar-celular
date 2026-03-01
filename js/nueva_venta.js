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

    const ventaForm = document.getElementById('venta-form');
    const ventaCliente = document.getElementById('ventaCliente');
    const ventaProducto = document.getElementById('ventaProducto');
    const ventaCantidad = document.getElementById('ventaCantidad');
    const successMsg = document.getElementById('success-msg');
    const btnCancel = document.getElementById('btn-cancel');
    const btnSubmit = document.querySelector('.btn-submit');
    const titleText = document.querySelector('.modal-title');
    const submitText = btnSubmit.querySelector('span');

    // Extraer parámetro de edición si existe
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');

    const ventasData = JSON.parse(localStorage.getItem('luxury_ventas')) || [];
    const inventoryData = JSON.parse(localStorage.getItem('luxury_inventory')) || [];
    let ventaToEdit = null;

    if (editId) {
        ventaToEdit = ventasData.find(v => v.id === editId);
        if (ventaToEdit) {
            titleText.textContent = "Editar Venta";
            submitText.textContent = "Actualizar Venta";
            ventaCliente.value = ventaToEdit.cliente;
            ventaCantidad.value = ventaToEdit.cantidad;
        }
    }

    // Populate products
    ventaProducto.innerHTML = '<option value="" disabled selected>Selecciona un producto disponible...</option>';
    let hasStock = false;
    const categorias = {};

    inventoryData.forEach(item => {
        // En modo edición, permitir seleccionar el producto original incluso si su stock es 0
        const isEditingThisProduct = (ventaToEdit && ventaToEdit.productoId === item.id);

        if (item.stock > 0 || isEditingThisProduct) {
            hasStock = true;

            const categoryName = item.category || 'Sin Categoría';
            if (!categorias[categoryName]) {
                categorias[categoryName] = [];
            }

            // Si es el producto original editado, su stock real "disponible" es su stock actual + la cantidad vendida
            let currentAvailableStock = item.stock;
            if (isEditingThisProduct) {
                currentAvailableStock += ventaToEdit.cantidad;
            }

            categorias[categoryName].push({
                ...item,
                currentAvailableStock: currentAvailableStock
            });
        }
    });

    // Renderizar optgroups
    for (const categoryName in categorias) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = categoryName;

        categorias[categoryName].forEach(prod => {
            const option = document.createElement('option');
            option.value = prod.id;
            option.textContent = `${prod.name} (${prod.currentAvailableStock} uds. máximo) - ${prod.price}`;
            option.dataset.stock = prod.currentAvailableStock;
            option.dataset.name = prod.name;
            optgroup.appendChild(option);
        });

        ventaProducto.appendChild(optgroup);
    }

    if (!hasStock) {
        ventaProducto.innerHTML = '<option value="" disabled selected>No hay productos en stock.</option>';
    }

    // Preseleccionar producto si estamos editando
    if (ventaToEdit) {
        ventaProducto.value = ventaToEdit.productoId;
    }

    btnCancel.addEventListener('click', () => {
        window.close();
    });

    ventaForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const cliente = ventaCliente.value;
        const cantidad = parseInt(ventaCantidad.value);
        const productoDropdown = ventaProducto.options[ventaProducto.selectedIndex];

        if (!productoDropdown || productoDropdown.value === "") {
            alert("Debes seleccionar un producto válido.");
            return;
        }

        const productId = productoDropdown.value;
        const productStock = parseInt(productoDropdown.dataset.stock);
        const productName = productoDropdown.dataset.name;

        if (cantidad > productStock) {
            alert(`No hay suficiente stock. (Máximo: ${productStock})`);
            return;
        }

        if (editId && ventaToEdit) {
            // LÓGICA DE ACTUALIZACIÓN

            // 1. Restaurar stock del producto ORIGINAL al inventario
            const oldItemIndex = inventoryData.findIndex(item => item.id === ventaToEdit.productoId);
            if (oldItemIndex !== -1) {
                inventoryData[oldItemIndex].stock += ventaToEdit.cantidad;
            }

            // 2. Descontar stock del producto NUEVO/ACTUALIZADO del inventario
            const newItemIndex = inventoryData.findIndex(item => item.id === productId);
            if (newItemIndex !== -1) {
                inventoryData[newItemIndex].stock -= cantidad;
                recalcStatus(inventoryData[newItemIndex]);
            }

            if (oldItemIndex !== -1 && oldItemIndex !== newItemIndex) {
                recalcStatus(inventoryData[oldItemIndex]);
            }

            // 3. Actualizar la venta
            const index = ventasData.findIndex(v => v.id === editId);
            ventasData[index].cliente = cliente;
            ventasData[index].productoId = productId;
            ventasData[index].productoNombre = productName;
            ventasData[index].cantidad = cantidad;

        } else {
            // LÓGICA DE NUEVA VENTA
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;

            const nuevaVenta = {
                id: 'VNT-' + Math.floor(1000 + Math.random() * 9000),
                cliente: cliente,
                productoId: productId,
                productoNombre: productName,
                cantidad: cantidad,
                fecha: formattedDate
            };
            ventasData.unshift(nuevaVenta);

            // Disminuir stock
            const itemIndex = inventoryData.findIndex(item => item.id === productId);
            if (itemIndex !== -1) {
                inventoryData[itemIndex].stock -= cantidad;
                recalcStatus(inventoryData[itemIndex]);
            }
        }

        // Guardar todo
        localStorage.setItem('luxury_ventas', JSON.stringify(ventasData));
        localStorage.setItem('luxury_inventory', JSON.stringify(inventoryData));
        window.localStorage.setItem('_update_trigger', Date.now());

        // Show success UI
        successMsg.classList.remove('hidden');
        if (editId) {
            successMsg.querySelector('p').textContent = "La venta ha sido actualizada exitosamente. Puedes cerrar esta pestaña.";
            successMsg.querySelector('.success-title').textContent = "¡Actualización Exitosa!";
        }

        ventaCliente.disabled = true;
        ventaProducto.disabled = true;
        ventaCantidad.disabled = true;
        btnSubmit.disabled = true;
        btnSubmit.style.opacity = '0.5';

        // Cierra la pestaña después de un par de segundos automáticamente
        setTimeout(() => {
            window.close();
        }, 1500);
    });

    function recalcStatus(item) {
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
    }
});
