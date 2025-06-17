document.addEventListener('alpine:init', () => {
    Alpine.store('timelineSelect', {
        selection: null
    });
});

const vm_timelineSelect = {
    open: false,
    options: dataSets,
    optionSelected: undefined,

    buttonText: function() { return this.optionSelected ? this.optionSelected.text : 'Select...'; },

    toggle() {
        if (this.open) return this.close();
        this.$refs.button.focus();
        this.open = true;
    },
    close(focusAfter) {
        if (!this.open) return;
        this.open = false;
        focusAfter && focusAfter.focus();
    },    choose(opt) {
        // Explicitly set to null when clearing
        this.optionSelected = opt || null;
        // Update the global store, ensuring null when clearing
        Alpine.store('timelineSelect').selection = opt || null;
        
        if(!this.optionSelected) {
            resizeCanvasAndRender();
            this.close(this.$refs.button);
            return;
        }
        resizeCanvasAndRender();
        this.close(this.$refs.button);
    }
};