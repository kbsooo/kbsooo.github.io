/**
 * Spotlight Card Effect
 * Tracks mouse movement on cards and creates a spotlight effect
 */

(function() {
    'use strict';

    class SpotlightCard {
        constructor() {
            this.cards = [];
            this.init();
        }

        init() {
            // Select all post entry cards
            this.cards = document.querySelectorAll('.post-entry, .first-entry');

            if (this.cards.length === 0) return;

            // Add mouse move event to each card
            this.cards.forEach(card => {
                card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            });
        }

        handleMouseMove(e, card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Update CSS variables for spotlight position
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }
    }

    // Initialize on DOM load
    function init() {
        new SpotlightCard();
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
