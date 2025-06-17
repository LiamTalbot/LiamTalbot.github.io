document.addEventListener('alpine:init', () => {
    // Initialize the store
    window.formStore = {
        isOpen: false,
        isEditing: false,
        reset() {
            this.isEditing = false;
        },
        toggle() {
            if (!this.isOpen) {
                // Check if there's a selected timeline to edit
                const selectedTimeline = Alpine.store('timelineSelect').selection;
                this.isEditing = selectedTimeline !== null;
                
                if (this.isEditing) {
                    // Broadcast event to populate form
                    window.dispatchEvent(new CustomEvent('populateTimelineForm', {
                        detail: selectedTimeline
                    }));
                } else {
                    // Reset form data if not editing
                    window.dispatchEvent(new CustomEvent('resetTimelineForm'));
                }
            }
            this.isOpen = !this.isOpen;
        }
    };
    Alpine.store('timelineForm', window.formStore);

    // Initialize the component
    Alpine.data('vm_timelineForm', () => ({
        init() {
            console.log('Form component initialized');
            this.store = window.formStore;
            
            // Listen for populate event
            window.addEventListener('populateTimelineForm', (event) => {
                const timeline = event.detail;
                if (timeline) {
                    this.formData = {
                        text: timeline.text || '',
                        xAxis: {
                            text: timeline.xAxis?.text || '',
                            scaleJump: timeline.xAxis?.scaleJump || 1,
                            scales: timeline.xAxis?.scales || null,
                            elements: [...(timeline.xAxis?.elements || [])]
                        },
                        yAxis: {
                            text: timeline.yAxis?.text || '',
                            elements: [...(timeline.yAxis?.elements || [])]
                        },
                        categories: [...(timeline.categories || [])]
                    };
                }
            });

            // Listen for reset event
            window.addEventListener('resetTimelineForm', () => {
                this.formData = {
                    text: '',
                    xAxis: {
                        text: '',
                        scaleJump: 1,
                        scales: null,
                        elements: []
                    },
                    yAxis: {
                        text: '',
                        elements: []
                    },
                    categories: []
                };
            });
        },

        showAdvanced: false,
        // Section visibility states
        sections: {
            xAxis: true,
            yAxis: true,
            categories: true
        },
        toggleSection(section) {
            this.sections[section] = !this.sections[section];
        },
        formData: {
            text: '',
            xAxis: {
                text: '',
                scaleJump: 1,
                scales: null,
                elements: []
            },
            yAxis: {
                text: '',
                elements: []
            },
            categories: []
        },

        // Convert between date input value and data format
        formatDateForDisplay(date) {
            if (!date) return '';
            if (typeof date === 'number' || /^\d{4}$/.test(date)) {
                return date.toString() + '-01-01'; // Convert YYYY to YYYY-MM-DD for input
            }
            return date;
        },

        formatDateForData(date) {
            if (!date) return null;
            if (date.endsWith('-01-01')) {
                return parseInt(date.substring(0, 4)); // Convert YYYY-01-01 back to YYYY
            }
            return date;
        },

        // Handle form submission
        onSubmit() {
            // Validate the form data
            const validationResult = validateTimeline(this.formData);
            if (!validationResult.valid) {
                console.error('Validation errors:', validationResult.errors);
                return;
            }

            // If we're editing, update the existing timeline
            if (this.store.isEditing) {
                const currentSelection = Alpine.store('timelineSelect').selection;
                if (currentSelection) {
                    Object.assign(currentSelection, this.formData);
                }
            } else {
                // Add new timeline to dataSets
                dataSets.push(this.formData);
            }

            // Close the form and reset
            this.store.isOpen = false;
            this.store.isEditing = false;
            
            // Trigger a re-render
            resizeCanvasAndRender();
        },

        addElement(axis = 'x') {
            const target = axis === 'x' ? this.formData.xAxis : this.formData.yAxis;
            target.elements.push({
                text: '',
                year: null,
                spans: []
            });
        },

        removeElement(index, axis = 'x') {
            const target = axis === 'x' ? this.formData.xAxis : this.formData.yAxis;
            if (index >= 0 && index < target.elements.length) {
                target.elements.splice(index, 1);
            }
        },

        addSpan(elementIndex, axis = 'x') {
            const target = axis === 'x' ? this.formData.xAxis : this.formData.yAxis;
            if (elementIndex >= 0 && elementIndex < target.elements.length) {
                target.elements[elementIndex].spans.push({
                    text: '',
                    startYear: null,
                    endYear: null,
                    categories: []
                });
            }
        },

        removeSpan(elementIndex, spanIndex, axis = 'x') {
            const target = axis === 'x' ? this.formData.xAxis : this.formData.yAxis;
            if (elementIndex >= 0 && elementIndex < target.elements.length) {
                const element = target.elements[elementIndex];
                if (spanIndex >= 0 && spanIndex < element.spans.length) {
                    element.spans.splice(spanIndex, 1);
                }
            }
        },

        addCategory() {
            this.formData.categories.push({
                text: '',
                color: '#000000'
            });
        },

        removeCategory(index) {
            if (index >= 0 && index < this.formData.categories.length) {
                this.formData.categories.splice(index, 1);
            }
        }
    }));
});
