'use sctrict';
//(function(){
    var datePickers = document.getElementsByClassName('VdatePicker');

    for(var i = 0; i < datePickers.length; i++) {
    //datePickers.forEach(function(el){

        var el = datePickers[i];
        //var selectorContainer = el.getElementsByClassName('selectorContainer')[0];
        //var now = new Date();
        //var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        //var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        //var day = days[ now.getDay() ];
        //var month = months[ now.getMonth() ];
        //
        //var year = now.getFullYear();
        //var fullDatecontainer = el.getElementsByClassName('fullDatecontainer')[0];
        //var dayContainer = fullDatecontainer.getElementsByClassName('day')[0];
        //var monthContainer = fullDatecontainer.getElementsByClassName('month')[0];
        //var yearContainer = fullDatecontainer.getElementsByClassName('year')[0];
        //var totalMonthDays = daysInMonth(now.getMonth(), year);

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

        function Calendar () {
            var now = new Date();
            var that = this;
            this.now = now;
            this.month = now.getMonth();
            this.year = now.getFullYear();
            this.container = document.getElementsByClassName('VdatePicker')[0];
            this.selectorContainer = document.createElement('div');
            this.selectorContainer.className = 'selectorContainer';
            this.inputContainer = document.createElement('inputContainer');
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
                    a.innerHTML = (typeof el.days[i] === 'undefined') ? '' : el.days[i];
                    a.onclick = function(){
                        that.selectDay(Math.floor(this.innerHTML));
                    };
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
        };

        Calendar.prototype.renderPicker = function (){
            this.container.appendChild(this.inputContainer);
            this.container.appendChild(this.selectorContainer);
        };
        var cal = new Calendar();
    }
//})();
