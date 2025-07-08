// Calendar functionality
class ConcertCalendar {
    constructor() {
        this.currentDate = new Date();
        this.events = [];
        this.calendarGrid = document.querySelector('.calendar-grid');
        this.monthDisplay = document.querySelector('.current-month');
        this.prevButton = document.querySelector('.prev-month');
        this.nextButton = document.querySelector('.next-month');
        
        this.init();
    }
    
    init() {
        // Add event listeners
        this.prevButton.addEventListener('click', () => this.previousMonth());
        this.nextButton.addEventListener('click', () => this.nextMonth());
        
        // Load initial events (in a real application, this would come from a server)
        this.loadEvents();
        
        // Render initial calendar
        this.renderCalendar();
    }
    
    loadEvents() {
        // This is mock data - in a real application, this would come from a server
        this.events = [
            {
                date: '2024-03-15',
                title: 'Весенний концерт',
                location: 'Большой зал филармонии, Минск',
                time: '19:00'
            },
            {
                date: '2024-03-22',
                title: 'Концерт в Гомеле',
                location: 'Гомельская филармония',
                time: '19:00'
            },
            // Add more events as needed
        ];
    }
    
    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month display
        this.monthDisplay.textContent = new Date(year, month).toLocaleString('ru', {
            month: 'long',
            year: 'numeric'
        });
        
        // Clear previous calendar
        this.calendarGrid.innerHTML = '';
        
        // Add day headers
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            this.calendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month and total days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();
        const startingDay = firstDay.getDay() || 7; // Convert Sunday (0) to 7
        
        // Add empty cells for days before the first day of the month
        for (let i = 1; i < startingDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            this.calendarGrid.appendChild(emptyCell);
        }
        
        // Add days of the month
        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            
            // Create date string for comparison
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // Check if there are events on this day
            const dayEvents = this.events.filter(event => event.date === dateString);
            
            // Add day number
            const dayNumber = document.createElement('span');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            dayCell.appendChild(dayNumber);
            
            // Add events if any
            if (dayEvents.length > 0) {
                const eventsContainer = document.createElement('div');
                eventsContainer.className = 'day-events';
                
                dayEvents.forEach(event => {
                    const eventDot = document.createElement('div');
                    eventDot.className = 'event-dot';
                    eventDot.title = `${event.title} - ${event.time}`;
                    eventsContainer.appendChild(eventDot);
                });
                
                dayCell.appendChild(eventsContainer);
                dayCell.classList.add('has-events');
            }
            
            // Add click handler for event details
            dayCell.addEventListener('click', () => this.showEventDetails(dateString));
            
            this.calendarGrid.appendChild(dayCell);
        }
    }
    
    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }
    
    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }
    
    showEventDetails(dateString) {
        const dayEvents = this.events.filter(event => event.date === dateString);
        
        if (dayEvents.length > 0) {
            // Create modal for event details
            const modal = document.createElement('div');
            modal.className = 'event-modal';
            
            const modalContent = document.createElement('div');
            modalContent.className = 'event-modal-content';
            
            const closeButton = document.createElement('button');
            closeButton.className = 'event-modal-close';
            closeButton.textContent = '×';
            closeButton.addEventListener('click', () => modal.remove());
            
            const eventsList = document.createElement('div');
            eventsList.className = 'events-list';
            
            dayEvents.forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = 'event-item';
                eventItem.innerHTML = `
                    <h3>${event.title}</h3>
                    <p class="event-time">${event.time}</p>
                    <p class="event-location">${event.location}</p>
                    <a href="#" class="btn-tickets">Купить билеты</a>
                `;
                eventsList.appendChild(eventItem);
            });
            
            modalContent.appendChild(closeButton);
            modalContent.appendChild(eventsList);
            modal.appendChild(modalContent);
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
            
            document.body.appendChild(modal);
        }
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ConcertCalendar();
    
    // Initialize concert filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    const concertCards = document.querySelectorAll('.concert-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            // Filter concerts
            concertCards.forEach(card => {
                if (filter === 'all' || card.dataset.city === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Initialize "Add to Calendar" buttons
    const calendarButtons = document.querySelectorAll('.btn-calendar');
    calendarButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const concertId = button.dataset.concertId;
            // Here you would typically integrate with a calendar service
            // For now, we'll just show a notification
            showNotification('Концерт добавлен в ваш календарь');
        });
    });
}); 