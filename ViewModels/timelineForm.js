document.addEventListener('alpine:init', () => {
    // Initialize the store
    window.formStore = {
        isOpen: false,
        toggle() {
            console.log('Toggling form, current state:', this.isOpen);
            this.isOpen = !this.isOpen;
            console.log('New state:', this.isOpen);
        }
    };
    Alpine.store('timelineForm', window.formStore);

    // Initialize the component
    Alpine.data('vm_timelineForm', () => ({
        init() {
            console.log('Form component initialized');
            this.store = window.formStore;
        },
        showAdvanced: false,
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
            categories: [] // Start with empty categories array
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

        // Methods for handling elements and spans
        addElement(axis = 'x') {
            const element = {
                text: '',
                spans: []
            };
            
            if (axis === 'y') {
                element.position = this.formData.yAxis.elements.length + 1;
                this.formData.yAxis.elements.push(element);
            } else {
                this.formData.xAxis.elements.push(element);
            }
        },

        removeElement(index, axis = 'x') {
            if (axis === 'y') {
                this.formData.yAxis.elements.splice(index, 1);
                // Reorder positions
                this.formData.yAxis.elements.forEach((el, i) => el.position = i + 1);
            } else {
                this.formData.xAxis.elements.splice(index, 1);
            }
        },

        addSpan(elementIndex, axis = 'x') {
            const element = axis === 'y' 
                ? this.formData.yAxis.elements[elementIndex]
                : this.formData.xAxis.elements[elementIndex];
            
            element.spans.push({
                text: '',
                category: '',
                start: '',
                end: '',
                priority: 1
            });
        },

        removeSpan(elementIndex, spanIndex, axis = 'x') {
            const element = axis === 'y' 
                ? this.formData.yAxis.elements[elementIndex]
                : this.formData.xAxis.elements[elementIndex];
            
            element.spans.splice(spanIndex, 1);
        },

        async submitNewTimeline(event) {
            // Format dates
            const processSpans = (spans) => {
                return spans.map(span => ({
                    ...span,
                    start: this.formatDateForData(span.start),
                    end: this.formatDateForData(span.end)
                }));
            };

            const timelineData = {
                ...this.formData,
                xAxis: {
                    ...this.formData.xAxis,
                    elements: this.formData.xAxis.elements.map(el => ({
                        ...el,
                        spans: processSpans(el.spans)
                    }))
                },
                yAxis: {
                    ...this.formData.yAxis,
                    elements: this.formData.yAxis.elements.map(el => ({
                        ...el,
                        spans: processSpans(el.spans)
                    }))
                }
            };

            try {
                const validationResult = validateDataSet(timelineData);
                if (!validationResult.valid) {
                    this.showValidationError('Invalid timeline data', validationResult.errors);
                    return;
                }

                // Add the timeline to the dataset
                dataSets.push(timelineData);
                console.log('Timeline added:', timelineData);

                // Close the form and reset it
                this.store.isOpen = false;
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
            } catch (error) {
                console.error('Error submitting timeline:', error);
                this.showValidationError('Error submitting timeline', error.message);
            }
        },

        showValidationError(message, details = null) {
            let errorMessage = message;
            if (details) {
                errorMessage += '\n\n' + JSON.stringify(details, null, 2);
            }
            alert(errorMessage);
        }
    }));
});
