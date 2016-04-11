'use sctrict';
(function(){
    var datePickers = document.getElementsByClassName('VdatePicker');

    function ObjMonth(date){
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        this.months = months;
        var daysInMonth;
        var endDay;
        this.year = date.getFullYear();
        this.month = date.getMonth();
        this.monthName = months[this.month];
        var now = new Date(this.year, this.month, 1);
        this.weeks = [];

        getDaysInMonth = function (month,year) {
            return new Date(year, month + 1, 0).getDate();
        };

        addWeek = function(start, day, limit){
            var week = new ObjWeek();
            week.generateWeek(start, day, limit);
            return week;
        };

        generateWeeks = function() {
            var start = 1;
            var startWeekDay = now.getDay();
            var limit = daysInMonth;
            while(start <= endDay) {
                if(start > endDay) break;
                var week = addWeek(startWeekDay, start, limit);
                this.weeks.push(week);
                startWeekDay = 0;
                start = week.days[6] + 1;
            }
        };

        daysInMonth = getDaysInMonth(this.month, this.year);
        endDay = daysInMonth;
        generateWeeks.apply(this);
    }

    ObjMonth.prototype.getMonth = function() {
            return this.weeks;
        };

    function ObjWeek(){
        this.days = {};
    }

    ObjWeek.prototype.generateWeek = function(startDay, day, limit) {
            var i = startDay;
            var top = 7;
            if (limit - day < 7){
                top = limit - day + 1;
            }
            for(i; i < top; i++){
                this.setDay(i, day);
                day++;
            }
        };
    ObjWeek.prototype.getWeek = function() {
            return this.days;
        };
    ObjWeek.prototype.setDay = function(key, day) {
            this.days[key] = day;
        };

    function Calendar (el) {
        var now = new Date();
        var that = this;
        this.el = el;
        this.visible = false
        this.now = now;
        this.triggerBtn = document.createElement('button');
        this.triggerBtn.className = 'calendarIcon';
        this.month = now.getMonth();
        this.year = now.getFullYear();
        this.container = document.createElement('div');
        this.container.className = 'viajaladatePicker';
        this.selectorContainer = document.createElement('div');
        this.selectorContainer.className = 'selectorContainer';
        this.inputContainer = document.createElement('div');
        this.inputContainer.className = 'inputContainer';
        this.table = document.createElement('table');
        this.thead = document.createElement('thead');
        this.tbody = document.createElement('tbody');

        this.prevBtn = document.createElement('button');
        this.nextBtn = document.createElement('button');
        this.prevBtn.innerHTML = '&lt;';
        this.nextBtn.innerHTML = '&gt;';

        this.fullDatecontainer = document.createElement('div');
        this.dayContainer = document.createElement('span');
        this.monthContainer = document.createElement('span');
        this.yearContainer = document.createElement('span');
        this.dayContainer.className = 'day';
        this.monthContainer.className = 'month';
        this.yearContainer.className = 'year';
        this.fullDatecontainer.className = 'fullDatecontainer';
        this.fullDatecontainer.appendChild(this.dayContainer);
        this.fullDatecontainer.appendChild(this.monthContainer);
        this.fullDatecontainer.appendChild(this.yearContainer);
        this.selectDay(this.now.getDate());

        this.triggerBtn.onclick = function(){
            that.toggleCalendar();
        };

        this.nextBtn.onclick = function(){
            that.fowardMonths()
        };

        this.prevBtn.onclick = function(){
            that.backMonths()
        };

        this.setMonths.apply(this);
        this.renderCalendar();
        this.renderMonth();
        this.renderPicker();
    };

    Calendar.prototype.toggleCalendar = function(){
        if(this.visible){
            this.selectorContainer.style.display = 'none';
            this.visible = false;
        } else {
            this.selectorContainer.style.display = 'flex';
            this.visible = true;
        }
    };

    Calendar.prototype.setMonths = function () {
        var now = this.now;
        this.currentMonth = new ObjMonth(now);
        this.nextMonth = new ObjMonth(new Date(now.getFullYear(), now.getMonth() + 1, 1));
        this.prevMonth = new ObjMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
        this.year = this.now.getFullYear();
        this.month = this.now.getMonth();
        this.dayContainer.innerHTML = this.day;
        this.yearContainer.innerHTML = this.year;
        this.monthContainer.innerHTML = this.currentMonth.months[this.month];
    };

    Calendar.prototype.backMonths = function() {
        var now = this.now;
        now.setMonth(now.getMonth() - 1);
        this.selectDay(now.getDate());
        this.setMonths();
        this.renderMonth();
    };
    Calendar.prototype.fowardMonths = function() {
        var now = this.now;
        now.setMonth(now.getMonth() + 1);
        this.selectDay(now.getDate());
        this.setMonths();
        this.renderMonth();
    };
    Calendar.prototype.renderCalendar = function() {
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'];
        var selectorHeader = document.createElement('div');
        selectorHeader.className = 'selectorHeader';
        var thr = document.createElement('tr');
        days.forEach(function(el){
            var th = document.createElement('th');
            th.innerHTML = el;
            thr.appendChild(th);
        });
        this.thead.appendChild(thr);
        this.table.appendChild(this.thead);

        selectorHeader.appendChild(this.prevBtn);
        selectorHeader.appendChild(this.fullDatecontainer);
        selectorHeader.appendChild(this.nextBtn);

        this.selectorContainer.appendChild(selectorHeader);
    };

    Calendar.prototype.renderMonth = function(){
        var that = this;
        this.tbody.innerHTML = '';
        this.currentMonth.weeks.forEach(function(el){
            var tr = document.createElement('tr');
            for(var i = 0; i < 7; i++){
                var a = document.createElement('td');
                if(typeof el.days[i] !== 'undefined'){
                    a.innerHTML = el.days[i];
                    a.className = 'calendarDay';
                    a.onclick = function(){
                        that.selectDay(Math.floor(this.innerHTML));
                    };
                }
                tr.appendChild(a);
            }

            that.tbody.appendChild(tr);
            that.table.appendChild(that.tbody);
        });
        this.selectorContainer.appendChild(this.table);
    };

    Calendar.prototype.selectDay = function(day){
        this.day = day;
        this.setMonths();
        this.el.value = this.day + '/' + this.month + '/' + this.year;;
    };

    Calendar.prototype.renderPicker = function (){
        this.container.appendChild(this.inputContainer);
        this.container.appendChild(this.selectorContainer);
        el.setAttribute('READONLY', '');
        document.body.insertBefore(this.container, this.el);
        this.inputContainer.appendChild(this.el);
        this.inputContainer.appendChild(this.triggerBtn);
    };

    for(var i = 0; i < datePickers.length; i++) {

        var el = datePickers[i];
        var calendars = [];
        calendars.push(new Calendar(el));
    }

})();
