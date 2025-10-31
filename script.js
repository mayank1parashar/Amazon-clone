document.addEventListener('DOMContentLoaded', () => {
    // Quantity adjustment functionality
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const container = e.target.closest('div');
            const quantityElement = container.querySelector('span');
            let quantity = parseInt(quantityElement.textContent);
            
            if (e.target.textContent === '+') {
                quantity += 1;
            } else if (e.target.textContent === '-' && quantity > 1) {
                quantity -= 1;
            }
            
            quantityElement.textContent = quantity;
            // Here you would typically update the cart total
        });
    });

    // Delete item functionality
    document.querySelectorAll('[data-delete-item]').forEach(button => {
        button.addEventListener('click', (e) => {
            const item = e.target.closest('.cart-item');
            item.classList.add('opacity-0', 'h-0', 'overflow-hidden', 'transition-all', 'duration-300');
            setTimeout(() => item.remove(), 300);
            // Here you would typically update the cart total
        });
    });

    // Select/deselect all items
    document.querySelector('[data-select-all]').addEventListener('click', (e) => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const isChecked = e.target.textContent.includes('Select');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
        
        e.target.textContent = isChecked ? 'Deselect all items' : 'Select all items';
    });
});