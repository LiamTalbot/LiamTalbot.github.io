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
    },
    choose(opt) {
        this.optionSelected = opt;
        if(!this.optionSelected) {
            resizeCanvasAndRender();
            this.close(this.$refs.button);
            return;
        }
        resizeCanvasAndRender();
        this.close(this.$refs.button);
    }
};