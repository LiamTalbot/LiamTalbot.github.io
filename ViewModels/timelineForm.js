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
            // Make store available to component
            this.store = window.formStore;
        },
        showAdvanced: false,
        includeYAxis: false,
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
            }
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

        priorityOptions: [1, 2, 3, 4, 5],

        // Combined categories from both datasets
        categories: [
            'Album',
            'EP',
            'Painting',
            'Drawing',
            'Lifetime',
            'Period',
            'Renaissance',
            'Baroque',
            'Other'
        ],

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

        submitNewTimeline() {
            // Format dates to match the expected format
            const formattedData = {
                ...this.formData,
                xAxis: {
                    ...this.formData.xAxis,
                    elements: this.formData.xAxis.elements.map(element => ({
                        ...element,
                        spans: element.spans.map(span => ({
                            ...span,
                            start: this.formatDateForData(span.start),
                            end: this.formatDateForData(span.end),
                            // Only include optional fields if they have values
                            ...(span.text ? { text: span.text } : {}),
                        }))
                    }))
                }
            };

            // Only include yAxis if it's enabled and has elements
            if (this.includeYAxis && this.formData.yAxis.elements.length > 0) {
                formattedData.yAxis = {
                    ...this.formData.yAxis,
                    elements: this.formData.yAxis.elements.map(element => ({
                        ...element,
                        spans: element.spans.map(span => ({
                            ...span,
                            start: this.formatDateForData(span.start),
                            end: this.formatDateForData(span.end),
                            ...(span.text ? { text: span.text } : {}),
                        }))
                    }))
                };
            } else {
                delete formattedData.yAxis;
            }

            // Add the new timeline to the datasets
            dataSets.push(formattedData);
            
            // Reset the form
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
                }
            };
            this.showAdvanced = false;
            this.includeYAxis = false;
            this.$store.timelineForm.isOpen = false;
        }
    }));
});
