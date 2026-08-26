// ============================================================
// Portal CBTA 15 - Componente de paginacion
// ============================================================
// Uso: Pagination.render(containerId, currentPage, totalPages, callbackFn)
// ============================================================

var Pagination = {
    render: function(containerId, page, totalPages, onPageChange) {
        var container = document.getElementById(containerId);
        if (!container || totalPages <= 1) {
            if (container) container.innerHTML = '';
            return;
        }

        var html = '<div class="pagination-controls">';

        // Previous
        html += '<button class="page-btn" data-page="' + (page - 1) + '" ' + (page <= 1 ? 'disabled' : '') + '>&laquo;</button>';

        // Page numbers with ellipsis
        var pages = Pagination.getPageNumbers(page, totalPages);
        pages.forEach(function(p) {
            if (p === '...') {
                html += '<span class="page-ellipsis">...</span>';
            } else {
                html += '<button class="page-btn ' + (p === page ? 'active' : '') + '" data-page="' + p + '">' + p + '</button>';
            }
        });

        // Next
        html += '<button class="page-btn" data-page="' + (page + 1) + '" ' + (page >= totalPages ? 'disabled' : '') + '>&raquo;</button>';

        html += '<span class="page-info">Pagina ' + page + ' de ' + totalPages + '</span>';
        html += '</div>';

        container.innerHTML = html;

        // Bind click events
        container.querySelectorAll('.page-btn:not([disabled])').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var p = parseInt(this.dataset.page);
                if (p >= 1 && p <= totalPages && p !== page) {
                    onPageChange(p);
                }
            });
        });
    },

    getPageNumbers: function(current, total) {
        if (total <= 7) {
            var arr = [];
            for (var i = 1; i <= total; i++) arr.push(i);
            return arr;
        }

        var pages = [];
        if (current <= 4) {
            for (var i = 1; i <= 5; i++) pages.push(i);
            pages.push('...');
            pages.push(total);
        } else if (current >= total - 3) {
            pages.push(1);
            pages.push('...');
            for (var i = total - 4; i <= total; i++) pages.push(i);
        } else {
            pages.push(1);
            pages.push('...');
            for (var i = current - 1; i <= current + 1; i++) pages.push(i);
            pages.push('...');
            pages.push(total);
        }
        return pages;
    },

    PAGE_SIZE: 10
};
