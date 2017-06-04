/*
InfCloud - the open source CalDAV/CardDAV Web Client
Copyright (C) 2011-2015
    Jan Mate <jan.mate@inf-it.com>
    Andrej Lezo <andrej.lezo@inf-it.com>
    Matej Mihalik <matej.mihalik@inf-it.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

String.prototype.parseComnpactISO8601=function(uid)
{
	if(this.length>=15)
		var formattedString=this.substring(0, 4)+'/'+this.substring(4, 6)+'/'+this.substring(6, 8)+' '+this.substring(9, 11)+':'+this.substring(11, 13)+':'+this.substring(13, 15);
	else
		var formattedString=this.substring(0, 4)+'/'+this.substring(4, 6)+'/'+this.substring(6, 8)+' '+'00:00:00';

	var value=Date.parse(formattedString);
	if(isNaN(value))
		return false
	else
		return new Date(value);
}

function repeatStartCompare(objA,objB)
{
	var startA='',startB='';
	if(objA.rec_id!='')
		startA=objA.rec_id.parseComnpactISO8601();
	else if(objA.start)
		startA=new Date(objA.start.getTime());
	else if(objA.end)
		startA=new Date(objA.end.getTime());
	else
		startA=Infinity;

	if(objB.rec_id!='')
		startB=objB.rec_id.parseComnpactISO8601();
	else if(objB.start)
		startB=new Date(objB.start.getTime());
	else if(objB.end)
		startB=new Date(objB.end.getTime());
	else
		startB=Infinity;

	if(startA<startB)
		return -1;
	if(startA>startB)
		return 1;

	return 0;
}

function findWeek(weekNo,inDate,day)
{
	var distance = (day + 7 - inDate.getDay()) % 7;
	var date = new Date(inDate.getTime());
	date.setDate(date.getDate() + distance);
	if(date.getWeekNo() <= weekNo)
		date.setDate(date.getDate() + 7*(weekNo-date.getWeekNo()));
	else
	{
		var actualYearWeeks = new Date(date.getFullYear(),11,31,1,1,1).getWeekNo();
		date.setDate(date.getDate() + 7*(actualYearWeeks-date.getWeekNo()));
	}

}
String.prototype.getSecondsFromOffset=function()
{
	if(this.length>=5)
	{
		var hours=this.substring(1,3);
		var minutes=this.substring(3,5);
		var seconds='00';
		if(this.length>=7)
			seconds=this.substring(5,7);

		var value=parseInt(hours,10)*60*60+parseInt(minutes,10)*60+parseInt(seconds,10);
		if(this.charAt(0)=='-')
			value=value*-1;

		if(!isNaN(value))
			return value
		else
			return 0;
	}
	else
		return 0;
}
Array.prototype.indexElementOf=function(value)
{
	for(var i=0;i<this.length;i++)
		if(this[i].indexOf(value)!=-1)
			return i;
return -1;
}

function setAlertTimeouts(isTodo, alertTime, dateStart, dateEnd, params, firstInstance, uid)
{
	var alertTimeOut=new Array();
	if(isTodo && dateEnd!='')
	{
		if(typeof dateEnd=='string')
			dateStart = dateEnd;
		else
			dateStart=new Date(dateEnd.getTime());
	}
	else if(isTodo && dateStart!='')
	{
		if(typeof dateStart=='string')
			dateEnd=dateStart;
		else
			dateEnd=new Date(dateStart.getTime());
	}

	if(alertTime.length>0)
	{
		for(var v=0;v<alertTime.length;v++)
		{
			if((alertTime[v].charAt(0)=='-') || (alertTime[v].charAt(0)=='+') || firstInstance)
			{
				var startTime;
				var aTime='';
				if((dateStart!='' || dateEnd!='') && alertTime[v].charAt(0)=='-')
				{
					if(typeof dateStart=='string')
						startTime = $.fullCalendar.parseDate(dateStart);
					else
						startTime=new Date(dateStart.getTime());
					aTime=startTime.getTime() - parseInt(alertTime[v].substring(1, alertTime[v].length-1));
				}
				else if((dateStart!='' || dateEnd!='') && alertTime[v].charAt(0)=='+')
				{
					if(typeof dateEnd=='string')
						startTime = $.fullCalendar.parseDate(dateEnd);
					else
						startTime=new Date(dateEnd.getTime());
					aTime=startTime.getTime() + parseInt(alertTime[v].substring(1, alertTime[v].length-1));
				}
				else if(firstInstance)
				{
					aTime=$.fullCalendar.parseDate(alertTime[v]);
					if(isTodo)
						var displayDate=(dateEnd=='' ? dateStart : dateEnd);
					else
						var displayDate=dateStart;
					if(displayDate!='')
						startTime = new Date(displayDate.getTime());
					else
						startTime='';
				}
				var now=new Date();

				if(aTime!==''&&aTime>now)
				{
					var delay=aTime-now;
					if(maxAlarmValue<delay)
						delay=maxAlarmValue;
					if(isTodo)
						alertTimeOut[alertTimeOut.length]=setTimeout(function(startTime){
							showAlertTODO(uid, (aTime-now), {start:(startTime!='' ? new Date(startTime.getTime()) : ''), status:params.status, title:params.title});
						}, delay,startTime);
					else
						alertTimeOut[alertTimeOut.length]=setTimeout(function(startTime){
							showAlertEvents(uid, (aTime-now), {start:new Date(startTime.getTime()), allDay:params.allDay, title:params.title});
						}, delay,startTime);
				}
			}
		}
	}
	return alertTimeOut;
}


function isInRecurrenceArray(varDate,stringUID,recurrence_id_array, tzName)
{
	var checkRec=false;
	var checkDate='';
	if(typeof varDate=='string')
		checkDate=$.fullCalendar.parseDate(varDate);
	else
		checkDate=new Date(varDate.getTime());

	if(recurrence_id_array.length>0)
	{
		for(var ir=0;ir<recurrence_id_array.length;ir++)
		{
			var recString = recurrence_id_array[ir].split(';')[0];
			if(recString.charAt(recString.length-1)=='Z')
			{
				if(globalSettings.timezonesupport.value && tzName in timezones)
				{
					var recValOffsetFrom=getOffsetByTZ(tzName, varDate);
					var recTime = new Date(recString.parseComnpactISO8601().getTime());
					if(recValOffsetFrom)
					{
						var rintOffset=recValOffsetFrom.getSecondsFromOffset()*1000;
						recTime.setTime(recTime.getTime()+rintOffset);
					}
					if(recTime.toString()+recurrence_id_array[ir].split(';')[1] == varDate+stringUID)
						checkRec=true;
				}
			}
			else
			{
				if(recString.parseComnpactISO8601().toString()+recurrence_id_array[ir].split(';')[1] == varDate+stringUID)
					checkRec=true;
			}
		}
	}
	return checkRec;
}



function applyTimezone(previousTimezone,isEventLocal)
{
	updateMainLoaderTextTimezone();
	$('#MainLoader').show();

	var eventsDone=false;
	var todosDone=false;
	var collections=globalResourceCalDAVList.collections;
	var todoCollections=globalResourceCalDAVList.TodoCollections;
	var calendarCount=0, calendarCounter=0;
	var todoCount=0, todoCounter=0;

	for(var i=0;i<collections.length;i++)
		if(collections[i].uid!=undefined)
			calendarCount++;
	for(var i=0;i<todoCollections.length;i++)
		if(todoCollections[i].uid!=undefined)
			todoCount++;

	var eventsArray=globalEventList.displayEventsArray;
	var todosArray=globalEventList.displayTodosArray;

	for(var i=0;i<collections.length;i++)
		if(collections[i].uid!=undefined)
		{
			setTimeout(function(i){
				for(var j=0;j<eventsArray[collections[i].uid].length;j++)
				{
					if(eventsArray[collections[i].uid][j].timeZone=='local' || eventsArray[collections[i].uid][j].allDay)
						continue;
					var dateStart=eventsArray[collections[i].uid][j].start;
					var previousOffset=getOffsetByTZ(previousTimezone, dateStart).getSecondsFromOffset();
					var actualOffset='';
					if(typeof globalSessionTimeZone!='undefined' && globalSessionTimeZone!=null && globalSessionTimeZone!='')
						actualOffset=getOffsetByTZ(globalSessionTimeZone, dateStart).getSecondsFromOffset();
					else
						actualOffset=dateStart.getTimezoneOffset()*60*-1;
//if timezonesupport is turned off go to local
					if(typeof isEventLocal!='undefined')
						actualOffset=getOffsetByTZ(eventsArray[collections[i].uid][j].timeZone, dateStart).getSecondsFromOffset();

					if(typeof isEventLocal!='undefined' && !isEventLocal)
						var intOffset=(previousOffset-actualOffset)*1000;
					else
						var intOffset=(actualOffset-previousOffset)*1000;
					eventsArray[collections[i].uid][j].start.setTime(eventsArray[collections[i].uid][j].start.getTime()+intOffset);

					if(eventsArray[collections[i].uid][j].end)
						eventsArray[collections[i].uid][j].end.setTime(eventsArray[collections[i].uid][j].end.getTime()+intOffset);

					var calEvent=eventsArray[collections[i].uid][j];
					if(j==0 || j>0 && eventsArray[collections[i].uid][j].id!=eventsArray[collections[i].uid][j-1].id)
						if(calEvent.alertTime.length>0)
						{
							for(var k=0; k<calEvent.alertTimeOut.length; k++)
								clearTimeout(calEvent.alertTimeOut[k]);

							var aTime='', now=new Date();
							for(var alarmIterator=0;alarmIterator<calEvent.alertTime.length;alarmIterator++)
								{
									if(eventsArray[collections[i].uid][j].start!=null && calEvent.alertTime[alarmIterator].charAt(0)=='-')
										aTime=eventsArray[collections[i].uid][j].start.getTime() - parseInt(calEvent.alertTime[alarmIterator].substring(1, calEvent.alertTime[alarmIterator].length-1));
									else if(eventsArray[collections[i].uid][j].end!=null && calEvent.alertTime[alarmIterator].charAt(0)=='+')
										aTime=eventsArray[collections[i].uid][j].end.getTime() + parseInt(calEvent.alertTime[alarmIterator].substring(1, calEvent.alertTime[alarmIterator].length-1));
									else
									{
										var previousOffset=getOffsetByTZ(previousTimezone, $.fullCalendar.parseDate(calEvent.alertTime[alarmIterator])).getSecondsFromOffset();
										var actualOffset='';
										if(typeof globalSessionTimeZone!='undefined' && globalSessionTimeZone!=null && globalSessionTimeZone!='')
											actualOffset=getOffsetByTZ(globalSessionTimeZone, $.fullCalendar.parseDate(calEvent.alertTime[alarmIterator])).getSecondsFromOffset();
										else
											actualOffset=$.fullCalendar.parseDate(calEvent.alertTime[alarmIterator]).getTimezoneOffset()*60*-1;

										if(typeof isEventLocal!='undefined')
											actualOffset=getOffsetByTZ(eventsArray[collections[i].uid][j].timeZone, $.fullCalendar.parseDate(calEvent.alertTime[alarmIterator])).getSecondsFromOffset();

										if(typeof isEventLocal!='undefined' && !isEventLocal)
											var intOffset=(previousOffset-actualOffset)*1000;
										else
											var intOffset=(actualOffset-previousOffset)*1000;

										aTime=new Date($.fullCalendar.parseDate(calEvent.alertTime[alarmIterator]).getTime()+intOffset);
										eventsArray[collections[i].uid][j].alertTime[alarmIterator]=$.fullCalendar.formatDate(aTime, "yyyy-MM-dd HH:mm:ss");
									}

									if(aTime>now)
									{
										var delay=aTime-now;
										if(maxAlarmValue<delay)
											delay=maxAlarmValue;
										eventsArray[collections[i].uid][j].alertTimeOut[alarmIterator]=setTimeout(function(){
												showAlertEvents(calEvent.id, (aTime-now), {start:calEvent.start, allDay:calEvent.allDay, title:calEvent.title});
										}, delay);
									}
								}
						}
				}
				calendarCounter++;
				if(calendarCounter==calendarCount)
				{
					refetchCalendarEvents();
					eventsDone=true;
					if(todosDone)
						$('#MainLoader').hide();
				}
			},10,i);
		}

		for(var i=0;i<todoCollections.length;i++)
		if(todoCollections[i].uid!=undefined)
		{
			setTimeout(function(i){
				for(var j=0;j<todosArray[todoCollections[i].uid].length;j++)
				{
					if(todosArray[todoCollections[i].uid][j].start)
					{
						if(typeof todosArray[todoCollections[i].uid][j].start =='string')
							todosArray[todoCollections[i].uid][j].start = $.fullCalendar.parseDate(todosArray[todoCollections[i].uid][j].start);
						var dateStart = todosArray[todoCollections[i].uid][j].start;
						var previousOffset=getOffsetByTZ(previousTimezone, dateStart).getSecondsFromOffset();
						var actualOffset='';
						if(typeof globalSessionTimeZone!='undefined' && globalSessionTimeZone!=null && globalSessionTimeZone!='')
							actualOffset=getOffsetByTZ(globalSessionTimeZone, dateStart).getSecondsFromOffset();
						else
							actualOffset=dateStart.getTimezoneOffset()*60*-1;
						var intOffset=(actualOffset-previousOffset)*1000;
						todosArray[todoCollections[i].uid][j].start.setTime(todosArray[todoCollections[i].uid][j].start.getTime()+intOffset);
					}
					if(todosArray[todoCollections[i].uid][j].end)
					{
						if(typeof todosArray[todoCollections[i].uid][j].end =='string')
							todosArray[todoCollections[i].uid][j].end=$.fullCalendar.parseDate(todosArray[todoCollections[i].uid][j].end);
						var dateEnd = todosArray[todoCollections[i].uid][j].end;
						var previousOffset=getOffsetByTZ(previousTimezone, dateEnd).getSecondsFromOffset();
						var actualOffset='';
						if(typeof globalSessionTimeZone!='undefined' && globalSessionTimeZone!=null && globalSessionTimeZone!='')
							actualOffset=getOffsetByTZ(globalSessionTimeZone, dateEnd).getSecondsFromOffset();
						else
							actualOffset=dateEnd.getTimezoneOffset()*60*-1;

						if(typeof isEventLocal!='undefined')
							actualOffset=getOffsetByTZ(todosArray[todoCollections[i].uid][j].timeZone, dateStart).getSecondsFromOffset();

						if(typeof isEventLocal!='undefined' && !isEventLocal)
							var intOffset=(previousOffset-actualOffset)*1000;
						else
							var intOffset=(actualOffset-previousOffset)*1000;
						todosArray[todoCollections[i].uid][j].end.setTime(todosArray[todoCollections[i].uid][j].end.getTime()+intOffset);
					}

					var todoEvent=todosArray[todoCollections[i].uid][j];
					if(j==0 || j>0 && todosArray[todoCollections[i].uid][j].id!=todosArray[todoCollections[i].uid][j-1].id)
						if(todoEvent.alertTime.length>0)
						{
							if(todoEvent.end)
								var showDate= new Date(todoEvent.end.getTime());
							else if(todoEvent.start)
								var showDate= new Date(todoEvent.start.getTime());
							else
								var showDate=new Date();
							for(var k=0; k<todoEvent.alertTimeOut.length; k++)
								clearTimeout(todoEvent.alertTimeOut[k]);

							var aTime='', now='';
							for(var alarmIterator=0;alarmIterator<todoEvent.alertTime.length;alarmIterator++)
								{
									if(todoEvent.alertTime[alarmIterator].charAt(0)=='-' || todoEvent.alertTime[alarmIterator].charAt(0)=='+')
									{
										aTime=showDate.getTime();
										var dur=parseInt(todoEvent.alertTime[alarmIterator].substring(1, todoEvent.alertTime[alarmIterator].length-1));

										if(todoEvent.alertTime[alarmIterator].charAt(0)=='-')
											aTime=aTime-dur;
										else
											aTime=aTime+dur;

										now=new Date();
									}
									else
									{
										var previousOffset=getOffsetByTZ(previousTimezone, $.fullCalendar.parseDate(todoEvent.alertTime[alarmIterator])).getSecondsFromOffset();
										var actualOffset='';
										if(typeof globalSessionTimeZone!='undefined' && globalSessionTimeZone!=null && globalSessionTimeZone!='')
											actualOffset=getOffsetByTZ(globalSessionTimeZone, $.fullCalendar.parseDate(todoEvent.alertTime[alarmIterator])).getSecondsFromOffset();
										else
											actualOffset=$.fullCalendar.parseDate(todoEvent.alertTime[alarmIterator]).getTimezoneOffset()*60*-1;

										if(typeof isEventLocal!='undefined')
											actualOffset=getOffsetByTZ(todosArray[todoCollections[i].uid][j].timeZone, $.fullCalendar.parseDate(todoEvent.alertTime[alarmIterator])).getSecondsFromOffset();

										if(typeof isEventLocal!='undefined' && !isEventLocal)
											var intOffset=(previousOffset-actualOffset)*1000;
										else
											var intOffset=(actualOffset-previousOffset)*1000;

										aTime=new Date($.fullCalendar.parseDate(todoEvent.alertTime[alarmIterator]).getTime()+intOffset);
										todosArray[todoCollections[i].uid][j].alertTime[alarmIterator]=$.fullCalendar.formatDate(aTime, "yyyy-MM-dd HH:mm:ss");
										now=new Date();
									}

									if(aTime>now)
									{
										var delay=aTime-now;
										if(maxAlarmValue<delay)
											delay=maxAlarmValue;
										todosArray[todoCollections[i].uid][j].alertTimeOut[alarmIterator]=setTimeout(function(){
												showAlertEvents(todoEvent.id, (aTime-now), {start:showDate, allDay:todoEvent.allDay, title:todoEvent.title});
										}, delay);
									}
								}
						}
				}
				todoCounter++;
				if(todoCounter==todoCount)
				{
					refetchTodoEvents();
					todosDone=true;
					if(eventsDone)
						$('#MainLoader').hide();
				}
			},10,i);
		}
}

function getLocalOffset(date)
{
	if(typeof globalSessionTimeZone!='undefined' && globalSessionTimeZone!=null && globalSessionTimeZone!='')
		return getOffsetByTZ(globalSessionTimeZone, date).getSecondsFromOffset()*-1;
	else
		date.getTimezoneOffset()*60;
}

function changeRuleForFuture(inputEvent, repeatCount)
{
	var vcalendar=inputEvent.vcalendar;
	var vcalendar_element=vcalendar.match(vCalendar.pre['contentline_RRULE2']);
	if(vcalendar_element!=null)
	{
		parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
		var ruleParts=parsed[4].split(';');
		var foundUntil=false;
		var parsedLine=parsed[0];
		for(var i=0; i<ruleParts.length;i++)
		{
			if(ruleParts[i].indexOf('UNTIL')!=-1 || ruleParts[i].indexOf('COUNT')!=-1)
			{
				parsedLine=parsedLine.replace(ruleParts[i],'COUNT='+(repeatCount-1));
				foundUntil=true;
			}
		}

		if(!foundUntil)
		{
			var tmp=parsed[4]+';COUNT='+(repeatCount-1);
			parsedLine=parsedLine.replace(parsed[4], tmp);
		}
		vcalendar=vcalendar.replace(parsed[0], parsedLine);
	}
	return vcalendar;
}

function buildTimezoneComponent(tzName)
{
	var component='';
	var dayNames=['SU','MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
	if(!tzName || tzName=='local' || tzName=='UTC')
		return component;
	if(tzName in timezones)
	{
		component+='BEGIN:VTIMEZONE\r\nTZID:'+tzName+'\r\n';
		for(comp in timezones[tzName])
		{
			if(comp=='daylightComponents')
			{
				var daylightC=timezones[tzName].daylightComponents;
				var compName='DAYLIGHT';
			}
			else if(comp=='standardComponents')
			{
				var daylightC=timezones[tzName].standardComponents;
				var compName='STANDARD';
			}

			for(var i in daylightC)
			{
				if(isNaN(i))
					continue;

				component+='BEGIN:'+compName+'\r\n';
				for(key in daylightC[i])
				{
					switch(key)
					{
						case 'dtStart':
							component+='DTSTART:'+daylightC[i][key]+'\r\n';
							break;
						case 'tzName':
							component+='TZNAME:'+daylightC[i][key]+'\r\n';
							break;
						case 'tzOffsetFROM':
							component+='TZOFFSETFROM:'+daylightC[i][key]+'\r\n';
							break;
						case 'tzOffsetTO':
							component+='TZOFFSETTO:'+daylightC[i][key]+'\r\n';
							break;
						case 'startMonth':
							component+='RRULE:FREQ=YEARLY';
							if(daylightC[i]['startMonth'])
								component+=';BYMONTH='+daylightC[i]['startMonth'];

							if(typeof daylightC[i]['startDay']!='undefined' && typeof dayNames[daylightC[i]['startDay']]!='undefined')
							{
								if(!daylightC[i]['startCount'])
									component+=';BYDAY='+dayNames[daylightC[i]['startDay']];
								else
									component+=';BYDAY='+daylightC[i]['startCount']+dayNames[daylightC[i]['startDay']];
							}
							component+='\r\n';
							break;
						case 'rDates':
							if(daylightC[i]['rDates'])
								for(var j=0;j<daylightC[i]['rDates'].length;j++)
									component+='RDATE:'+daylightC[i]['rDates'][j]+'\r\n';
							break;
						default:
							break;
					}
				}
				component+='END:'+compName+'\r\n';
			}
		}
		component+='END:VTIMEZONE\r\n';
	}
	return component;
}

function getOffsetByTZ(tZone, date,uid)
{
	var offset='+0000';
	if(tZone in timezones && tZone!='UTC')
	{
		var objDayLight='', objStandard='';
		var checkRule=true;

		var daylightComponents=timezones[tZone].daylightComponents;
		var actualDaylightComponent;
		if(daylightComponents)
		{
			for(var i=0;i<daylightComponents.length;i++)
			{
				if(daylightComponents[i].dtStart.parseComnpactISO8601()>date)
					continue;

				if(checkRule && daylightComponents[i].startMonth) // is RRULE SET
				{
					objDayLight=daylightComponents[i];
					actualDaylightComponent=getDateFromDay(objDayLight, date,false,uid);
					break;
				}
				else
				{
					for(var j=0;j<daylightComponents[i].rDates.length; j++)
					{
						if(daylightComponents[i].rDates[j].parseComnpactISO8601()<date && (actualDaylightComponent==null || (date-daylightComponents[i].rDates[j].parseComnpactISO8601())<(date-actualDaylightComponent.startDate)))
						{
							objDayLight=daylightComponents[i];
							actualDaylightComponent={offsetFrom:objDayLight.tzOffsetFROM, offsetTo: objDayLight.tzOffsetTO,startDate: daylightComponents[i].rDates[j].parseComnpactISO8601()};
						}
					}
				}
				checkRule=false;
			}
		}

		var standardComponents=timezones[tZone].standardComponents;
		var actualStandardComponent;
		checkRule=true;
		if(standardComponents)
		{
			for(var i=0;i<standardComponents.length;i++)
			{
				if(standardComponents[i].dtStart.parseComnpactISO8601()>date)
					continue;

				if(checkRule && standardComponents[i].startMonth) // is RRULE SET
				{
					objDayLight=standardComponents[i];
					actualStandardComponent=getDateFromDay(objDayLight, date);
					break;
				}
				else
				{
					for(var j=0;j<standardComponents[i].rDates.length; j++)
					{
						if(standardComponents[i].rDates[j].parseComnpactISO8601()<date && (actualStandardComponent==null || (date-standardComponents[i].rDates[j].parseComnpactISO8601())<(date-actualStandardComponent.startDate)))
						{
							objStandard=standardComponents[i];
							actualStandardComponent={offsetFrom:objStandard.tzOffsetFROM, offsetTo: objStandard.tzOffsetTO,startDate: standardComponents[i].rDates[j].parseComnpactISO8601()};
						}
					}
				}
				checkRule=false;
			}
		}

		if(actualDaylightComponent && actualStandardComponent)
		{
			if(actualDaylightComponent.startDate>actualStandardComponent.startDate)
				offset=actualDaylightComponent.offsetTo;
			else
				offset=actualStandardComponent.offsetTo;
		}
		else if(actualDaylightComponent)
			offset=actualDaylightComponent.offsetTo;
		else if(actualStandardComponent)
			offset=actualStandardComponent.offsetTo;
	}
	else if(tZone == 'local')
		offset = getStringLocalOffset(date);
	return offset;
}

function getStringLocalOffset(date)
{
	var offset = '+0000';
	var localOffset = date.getTimezoneOffset();
	if(localOffset>0)
	{
		var hours = Math.floor(localOffset/60);
		var minutes = localOffset - hours*60;
		offset = '-' + (hours<10 ? '0'+hours : hours);
		offset += (minutes<10 ? '0'+minutes : minutes);
	}
	else if(localOffset<0)
	{
		localOffset = localOffset*-1;
		var hours = Math.floor(localOffset/60);
		var minutes = localOffset - hours*60;
		offset = '+' + (hours<10 ? '0'+hours : hours);
		offset += (minutes<10 ? '0'+minutes : minutes);
	}

	return offset;
}

function getDayLightObject(tzObject,t)
{
	var dayLightStartDate, dayLightEndDate, myDate=t;
	dayLightStartDate=getDateFromDay(tzObject, t);
	dayLightEndDate=getDateFromDay(tzObject, t);

	for(var i=0;i<tzObject.rDatesDT.length;i++)
	{
		var dateDT=tzObject.rDatesDT[i].parseComnpactISO8601();
		if(dateDT)
			if(dateDT.getFullYear()==t.getFullYear())
			{
				dayLightStartDate=dateDT;
				break;
			}
	}

	for(var i=0;i<tzObject.rDatesST.length;i++)
	{
		var dateST=tzObject.rDatesST[i].parseComnpactISO8601();
		if(dateST && dateST.getFullYear()==t.getFullYear())
		{
			dayLightEndDate=dateST;
			break;
		}
	}

	if(dayLightStartDate>dayLightEndDate)
	{
		if(myDate>dayLightStartDate)
			dayLightEndDate.setFullYear(dayLightEndDate.getFullYear()+1);
		else
			dayLightStartDate.setFullYear(dayLightStartDate.getFullYear()-1);
	}

	return {dayLightStartDate : dayLightStartDate, dayLightEndDate: dayLightEndDate};
}

function deleteEventFromArray(uid)
{
	var rid=uid.substring(0, uid.lastIndexOf('/')+1);
	var count=0;
	if(globalEventList.displayEventsArray[rid]!=null && typeof globalEventList.displayEventsArray[rid] != 'undefined')
		for(var i=globalEventList.displayEventsArray[rid].length-1;i>=0;i--)
			if(globalEventList.displayEventsArray[rid][i].id==uid)
			{
				count++;
				for(var o=0;o<globalEventList.displayEventsArray[rid][i].alertTimeOut.length;o++)
					clearTimeout(globalEventList.displayEventsArray[rid][i].alertTimeOut[o]);
				globalEventList.displayEventsArray[rid].splice(i, 1);
			}
	if(count==0)
		if(globalEventList.displayTodosArray[rid]!=null && typeof globalEventList.displayTodosArray[rid] != 'undefined')
			for(var i=globalEventList.displayTodosArray[rid].length-1;i>=0;i--)
				if(globalEventList.displayTodosArray[rid][i].id==uid)
				{
					for(var o=0;o<globalEventList.displayTodosArray[rid][i].alertTimeOut.length;o++)
						clearTimeout(globalEventList.displayTodosArray[rid][i].alertTimeOut[o]);
					globalEventList.displayTodosArray[rid].splice(i, 1);
				}
}

function findEventInArray(uid, isEvent,repeatHash)
{
	var rid=uid.substring(0, uid.lastIndexOf('/')+1);
	var firstItem=null;
	if(isEvent)
	{
		for(var i=0; i<globalEventList.displayEventsArray[rid].length;i++)
			if(globalEventList.displayEventsArray[rid][i].id==uid)
				return globalEventList.displayEventsArray[rid][i];
	}
	else
	{
		for(var i=0; i<globalEventList.displayTodosArray[rid].length;i++)
			if(globalEventList.displayTodosArray[rid][i].id==uid)
			{
				if(typeof repeatHash=='undefined' || repeatHash==null)
					return globalEventList.displayTodosArray[rid][i];
				else if(globalEventList.displayTodosArray[rid][i].repeatHash==repeatHash)
					return globalEventList.displayTodosArray[rid][i];
				else if(firstItem==null)
					firstItem=globalEventList.displayTodosArray[rid][i];
			}
	}
	return firstItem || '';
}

function getvCalendarstart(inputEvent)
{
	var vcalendar_element='',
	itsOK=false;
	var vEvent=inputEvent.vcalendar;
	if(vEvent.match(vCalendar.pre['vcalendar']))
	{
		vcalendar_element=vEvent.match(vCalendar.pre['beginVTODO']);
		if(vcalendar_element!=null)
		{
			var endVT=vEvent.match(vCalendar.pre['endVTODO']);
			if(endVT!=null)
				return '1970-01-01T01:01:01Z';
			return false;
		}

		vcalendar_element=vEvent.match(vCalendar.pre['beginVEVENT']);
		if(vcalendar_element==null)
			itsOK=false;
		else
			itsOK=true;

		if(!itsOK)
			return false;

		vcalendar_element=vEvent.match(vCalendar.pre['endVEVENT']);

		if(vcalendar_element==null)
			itsOK=false;
		else
			itsOK=true;

		if(!itsOK)
			return false;

		var oo='',
		start='',
		help1;

		/*
		vcalendar_element=vEvent.match(vCalendar.pre['tzone']);

		if(vcalendar_element!=null)
		vEvent=vEvent.replace(vcalendar_element[0],'');
		*/

		//FIX
		// var beginTimeZone=vEvent.indexOf('BEGIN:VTIMEZONE');
		// var startEndTimeZone=vEvent.lastIndexOf('END:VTIMEZONE');
		// var endTimeZone=0;

		// if(beginTimeZone!=-1 && startEndTimeZone!=-1)
		// {
		// 	for(i=(startEndTimeZone+2);i<vEvent.length;i++)
		// 	{
		// 		if(vEvent.charAt(i)=='\n')
		// 		{
		// 			endTimeZone=i+1;
		// 			break;
		// 		}
		// 	}
		// 	vTimeZone=vEvent.substring(beginTimeZone, endTimeZone);
		// 	vEvent=vEvent.substring(0, beginTimeZone)+vEvent.substring(endTimeZone, vEvent.length);
		// }

		vEvent = vEvent.replace(/BEGIN:VTIMEZONE((\s|.)*?)END:VTIMEZONE\r\n/g, '');

		vcalendar_element=vEvent.match(vCalendar.pre['contentline_DTSTART']);
		if(vcalendar_element!=null)
		{
			parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
			start=parsed[4];
			help1=start;

			if(help1.indexOf("T")==-1)
				help1=help1.substring(0, 4)+'-'+help1.substring(4, 6)+'-'+help1.substring(6, 8)+'T00:00:00Z';
			else
				help1=help1.substring(0, 4)+'-'+help1.substring(4, 6)+'-'+help1.substring(6, 8)+'T'+help1.substring(9, 11)+':'+help1.substring(11, 13)+':'+help1.substring(13, 15)+'Z';

			start=help1;
		}

		if(start!='')
		{
			var t=$.fullCalendar.parseDate(help1);

			if((t.toString())=='Invalid Date')
				return false;
		}
		return help1;
	}
	else
		return -1;
}
function giveMeUntilDate(start, count, frequency, interval, allDay)
{
	var varDate=$.fullCalendar.parseDate(start);
	var monthPlus=0,
	dayPlus=0;
	if(frequency=="DAILY")
	{
		monthPlus=0,
		dayPlus=1;
	}
	else if(frequency=="WEEKLY")
	{
		monthPlus=0,
		dayPlus=7;
	}
	else if(frequency=="MONTHLY")
	{
		monthPlus=1,
		dayPlus=0;
	}
	else if(frequency=="YEARLY")
	{
		monthPlus=12,
		dayPlus=0;
	}
	var iterator=1, counter=1;
	while(iterator<count)
	{
		if(counter%interval==0)
			iterator++;

		if(allDay)
			var td=new Date(varDate.getFullYear(), varDate.getMonth()+monthPlus, varDate.getDate()+dayPlus);
		else
			var td=new Date(varDate.getFullYear(), varDate.getMonth()+monthPlus, varDate.getDate()+dayPlus, varDate.getHours(), varDate.getMinutes(), varDate.getSeconds());

		varDate=td;
		counter++;
	}
	return varDate;
}

function checkAndFixMultipleUID(vcalendar, isEvent)
{
	var vcalendarOrig = vcalendar;
	var uidArray={};
	var uidC=0;
	var eventStringArray=new Array();
	var componentS = 'VEVENT';
	if(!isEvent)
		componentS='VTODO';
	var checkVcalendar = vcalendarOrig;
	var valarm=checkVcalendar.match(vCalendar.pre['valarm']);
	if(valarm!=null)
		checkVcalendar=checkVcalendar.replace(valarm[0], '');
	while(checkVcalendar.match(vCalendar.pre['contentline_UID'])!= null)
	{
		vcalendar_element=checkVcalendar.match(vCalendar.pre['contentline_UID']);
		if(vcalendar_element[0]!=null)
		{
			if(typeof uidArray[vcalendar_element[0]]=='undefined')
			{
				uidArray[vcalendar_element[0]]={isTimezone:false, string:''};
				uidC++;
			}
		}
		checkVcalendar=checkVcalendar.replace(vcalendar_element[0], '\r\n');
	}
	if(uidC==1)
		return [vcalendar];
	var beginTimeZone=vcalendarOrig.indexOf('BEGIN:VTIMEZONE');
	var startEndTimeZone=vcalendarOrig.lastIndexOf('END:VTIMEZONE');
	var endTimeZone=0;
	var vTimeZone='';
	if(beginTimeZone!=-1 && startEndTimeZone!=-1)
	{
		for(i=(startEndTimeZone+2);i<vcalendarOrig.length;i++)
		{
			if(vcalendarOrig.charAt(i)=='\n')
			{
				endTimeZone=i+1;
				break;
			}
		}
		vTimeZone=vcalendarOrig.substring(beginTimeZone, endTimeZone);
		vcalendarOrig=vcalendarOrig.substring(0, beginTimeZone)+vcalendarOrig.substring(endTimeZone, vcalendarOrig.length);
	}
	while(vcalendarOrig.match(vCalendar.pre[componentS.toLowerCase()])!=null)
	{
		if(vcalendarOrig.substring(vcalendarOrig.indexOf('BEGIN:'+componentS)-2, vcalendarOrig.indexOf('BEGIN:'+componentS))=='\r\n')
		{
			var partEvent=vcalendarOrig.substring(vcalendarOrig.indexOf('BEGIN:'+componentS)-2,vcalendarOrig.indexOf('END:'+componentS)+('END:'+componentS).length);
			vcalendarOrig=vcalendarOrig.replace(partEvent, '');
		}
		else
		{
			var partEvent=vcalendarOrig.substring(vcalendarOrig.indexOf('BEGIN:'+componentS),vcalendarOrig.indexOf('END:'+componentS)+('END:'+componentS).length);
			vcalendarOrig=vcalendarOrig.replace(partEvent, '');
			partEvent+='\r\n';
		}
		var tmpEvent = partEvent;
		var valarm=tmpEvent.match(vCalendar.pre['valarm']);
		if(valarm!=null)
			tmpEvent=tmpEvent.replace(valarm[0], '');
		vcalendar_element=tmpEvent.match(vCalendar.pre['contentline_UID']);
		if(vcalendar_element[0]!=null)
		{
			var vcalendar_element_start=tmpEvent.match(vCalendar.pre['contentline_DTSTART']);
			if(vcalendar_element_start!=null)
			{
				var parsed=vcalendar_element_start[0].match(vCalendar.pre['contentline_parse']);

				var pars=vcalendarSplitParam(parsed[3]);
				if(pars.indexElementOf('TZID=')!=-1)
					uidArray[vcalendar_element[0]].isTimezone=true;
			}
			if(!isEvent && !uidArray[vcalendar_element[0]].isTimezone)
			{
				var vcalendar_element_start=tmpEvent.match(vCalendar.pre['contentline_DUE']);
				if(vcalendar_element_start!=null)
				{
					var parsed=vcalendar_element_start[0].match(vCalendar.pre['contentline_parse']);

					var pars=vcalendarSplitParam(parsed[3]);
					if(pars.indexElementOf('TZID=')!=-1)
						uidArray[vcalendar_element[0]].isTimezone=true;
				}
			}
			uidArray[vcalendar_element[0]].string+=partEvent;
		}
	}
	for(var uid in uidArray)
	{
		var vcalendarS = '';
		// vEvent BEGIN (required by RFC)
		if(vCalendar.tplM['begin']!=null && (process_elem=vCalendar.tplM['begin'][0])!=undefined)
			vcalendarS+=vCalendar.tplM['begin'][0];
		else
		{
			process_elem=vCalendar.tplC['begin'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			vcalendarS+=process_elem;
		}

		// VERSION (required by RFC)
		if(vCalendar.tplM['contentline_VERSION']!=null && (process_elem=vCalendar.tplM['contentline_VERSION'][0])!=undefined)
		{
			// replace the object and related objects' group names (+ append the related objects after the processed)
			parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
			if(parsed[1]!='') // if group is present, replace the object and related objects' group names
				process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
		}
		else
		{
			process_elem=vCalendar.tplC['contentline_VERSION'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		}
		process_elem=process_elem.replace('##:::##version##:::##', '2.0');
		vcalendarS+=process_elem;

		// CALSCALE
		if(vCalendar.tplM['contentline_CALSCALE']!=null && (process_elem=vCalendar.tplM['contentline_CALSCALE'][0])!=undefined)
		{
			// replace the object and related objects' group names (+ append the related objects after the processed)
			parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
			if(parsed[1]!='') // if group is present, replace the object and related objects' group names
				process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
		}
		else
		{
			process_elem=vCalendar.tplC['contentline_CALSCALE'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		}
		process_elem=process_elem.replace('##:::##calscale##:::##', 'GREGORIAN');
		vcalendarS+=process_elem;
		if(uidArray[uid].isTimezone)
			vcalendarS+=vTimeZone;
		vcalendarS=vcalendarS.substring(0, vcalendarS.length-2);
		vcalendarS+=uidArray[uid].string;
		if(vcalendarS.lastIndexOf('\r\n')!=(vcalendarS.length-2))
			vcalendarS+='\r\n';
		// PRODID
		if(vCalendar.tplM['contentline_PRODID']!=null && (process_elem=vCalendar.tplM['contentline_PRODID'][0])!=undefined)
		{
			// replace the object and related objects' group names (+ append the related objects after the processed)
			parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
			if(parsed[1]!='') // if group is present, replace the object and related objects' group names
				process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
		}
		else
		{
			process_elem=vCalendar.tplC['contentline_PRODID'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
		}
		process_elem=process_elem.replace('##:::##value##:::##', '-//Inf-IT//'+globalAppName+' '+globalVersion+'//EN');
		vcalendarS+=process_elem;

		if(typeof vCalendar.tplM['unprocessed']!='undefined' && vCalendar.tplM['unprocessed']!='' && vCalendar.tplM['unprocessed']!=null)
			vcalendarS+=vCalendar.tplM['unprocessed'].replace(RegExp('^\r\n'), '');

		vCalendar.tplM['unprocessed']=new Array();
		// vCalendar END (required by RFC)

		if(vCalendar.tplM['end']!=null && (process_elem=vCalendar.tplM['end'][0])!=undefined)
			vcalendarS+=vCalendar.tplM['end'][0];
		else
		{
			process_elem=vCalendar.tplC['end'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			vcalendarS+=process_elem;
		}
		eventStringArray.push(vcalendarS);
	}
	return eventStringArray;
}
function dataToVcalendar(operation, accountUID, inputUID, inputEtag, delUID,isFormHidden, deleteMode)
{
	var vevent=false,
	vCalendarText='',
	groupCounter=0;
	var sel_option='local';

	// vEvent BEGIN (required by RFC)
	if(vCalendar.tplM['begin']!=null && (process_elem=vCalendar.tplM['begin'][0])!=undefined)
		vCalendarText+=vCalendar.tplM['begin'][0];
	else
	{
		process_elem=vCalendar.tplC['begin'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		vCalendarText+=process_elem;
	}

	// VERSION (required by RFC)
	if(vCalendar.tplM['contentline_VERSION']!=null && (process_elem=vCalendar.tplM['contentline_VERSION'][0])!=undefined)
	{
		// replace the object and related objects' group names (+ append the related objects after the processed)
		parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
		if(parsed[1]!='') // if group is present, replace the object and related objects' group names
			process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
	}
	else
	{
		process_elem=vCalendar.tplC['contentline_VERSION'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
	}
	process_elem=process_elem.replace('##:::##version##:::##', '2.0');
	vCalendarText+=process_elem;

	// CALSCALE
	if(vCalendar.tplM['contentline_CALSCALE']!=null && (process_elem=vCalendar.tplM['contentline_CALSCALE'][0])!=undefined)
	{
		// replace the object and related objects' group names (+ append the related objects after the processed)
		parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
		if(parsed[1]!='') // if group is present, replace the object and related objects' group names
			process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
	}
	else
	{
		process_elem=vCalendar.tplC['contentline_CALSCALE'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
	}
	process_elem=process_elem.replace('##:::##calscale##:::##', 'GREGORIAN');
	vCalendarText+=process_elem;

	if(delUID!='')
		var rid=delUID.substring(0, delUID.lastIndexOf('/')+1);
	else
		var rid=inputUID.substring(0, inputUID.lastIndexOf('/')+1);
	var inputEvents=jQuery.grep(globalEventList.displayEventsArray[rid],function(e){if(e.id==$('#uid').val() && (e.repeatCount<2 || !e.repeatCount))return true});

	var tzArray=new Array();
	var tzString='';
	var isTimeZone=false;

	var origVcalendarString='';
	var eventStringArray=new Array();
	if(inputEvents.length>0)
	{
		var rid=$('#uid').val().substring(0, $('#uid').val().lastIndexOf('/')+1);
		if(rid)
			if(globalEventList.events[rid][$('#uid').val()].uid!=undefined)
				origVcalendarString=globalEventList.events[rid][$('#uid').val()].vcalendar;
		while(origVcalendarString.match(vCalendar.pre['vevent'])!=null)
		{
			if(origVcalendarString.substring(origVcalendarString.indexOf('BEGIN:VEVENT')-2, origVcalendarString.indexOf('BEGIN:VEVENT'))=='\r\n')
			{
				var partEvent=origVcalendarString.substring(origVcalendarString.indexOf('BEGIN:VEVENT')-2,origVcalendarString.indexOf('END:VEVENT')+'END:VEVENT'.length);
				origVcalendarString=origVcalendarString.replace(partEvent, '');
			}
			else
			{
				var partEvent=origVcalendarString.substring(origVcalendarString.indexOf('BEGIN:VEVENT'),origVcalendarString.indexOf('END:VEVENT')+'END:VEVENT'.length);
				origVcalendarString=origVcalendarString.replace(partEvent, '');
				partEvent+='\r\n';
			}
			eventStringArray[eventStringArray.length]=partEvent;
		}
	}
	var origTimezone = '';
	for(var iE=0;iE<inputEvents.length;iE++)
	{
		if(tzArray.indexOf(inputEvents[iE].timeZone)==-1)
		{
			if(inputEvents[iE].allDay ||(deleteMode && ($('#vcalendarHash').val()==String(CryptoJS.SHA256(inputEvents[iE].vcalendar)))))
				continue;
			var component=buildTimezoneComponent(inputEvents[iE].timeZone);
			if(component!='' && ($('#vcalendarHash').val()!=String(CryptoJS.SHA256(inputEvents[iE].vcalendar))))
			{
				tzArray[tzArray.length]=inputEvents[iE].timeZone;
				tzString+=component;
				if(tzString.lastIndexOf('\r\n')!=(tzString.length-2))
					tzString+='\r\n';
				isTimeZone=true;
			}
			else if(component!='' && $('#vcalendarHash').val()==String(CryptoJS.SHA256(inputEvents[iE].vcalendar)))
				origTimezone+=component;
		}
	}
	if(isTimeZone)
	{
		if(vCalendarText.lastIndexOf('\r\n')!=(vCalendarText.length-2))
			vCalendarText+='\r\n';
		vCalendarText+=tzString;
	}
	var beginVcalendar = vCalendarText;
	var realEvent='';
	var futureMode = false;
	for(var j=0;j<inputEvents.length;j++)
	{
		eventStringArray.splice(eventStringArray.indexOf(inputEvents[j].vcalendar),1);
		if(($('#futureStart').val()== '' &&  $('#vcalendarHash').val()!=String(CryptoJS.SHA256(inputEvents[j].vcalendar))) || inputEvents[j].rec_id!=$('#recurrenceID').val())
		{
			var stringUIDcurrent=inputEvents[j].vcalendar.match(vCalendar.pre['contentline_UID']);
			if(stringUIDcurrent!=null)
				stringUIDcurrent=stringUIDcurrent[0].match(vCalendar.pre['contentline_parse'])[4];

			if((deleteMode && $('#vcalendarHash').val()==String(CryptoJS.SHA256(inputEvents[j].vcalendar))) || (deleteMode && !inputEvents[j].rec_id && $('#vcalendarUID').val()==stringUIDcurrent))
			{
				var ruleString=inputEvents[j].vcalendar.match(vCalendar.pre['contentline_RRULE2']);
				var origRuleString=ruleString;
				var exDate=inputEvents[j].start;
				var process_elem=vCalendar.tplC['contentline_EXDATE'];
				process_elem=process_elem.replace('##:::##group_wd##:::##', '');
				process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
				if(inputEvents[j].allDay)
				{
					exDate=$('#recurrenceID').val();
					process_elem=process_elem.replace('##:::##AllDay##:::##', ';'+vcalendarEscapeValue('VALUE=DATE'));
					process_elem=process_elem.replace('##:::##TZID##:::##', vcalendarEscapeValue(''));
					process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(exDate));
				}
				else
				{
					exDate=$('#recurrenceID').val().parseComnpactISO8601();
					if(!$('#allday').prop('checked'))
						if(globalSettings.timezonesupport.value)
							sel_option=$('#timezone').val();

					if(sel_option!='local')
					{
						var valOffsetFrom=getOffsetByTZ(sel_option, exDate);
						var intOffset = valOffsetFrom.getSecondsFromOffset()*-1;
						exDate = new Date(exDate.setSeconds(intOffset));
					}
					else
						exDate=new Date(exDate.setSeconds(getLocalOffset(exDate)));

					exDate=$.fullCalendar.formatDate(exDate, "yyyyMMdd'T'HHmmss'Z'");
					process_elem=process_elem.replace('##:::##AllDay##:::##', vcalendarEscapeValue(''));
					process_elem=process_elem.replace('##:::##TZID##:::##','');
					process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(exDate));
				}
				inputEvents[j].vcalendar=inputEvents[j].vcalendar.replace(ruleString,ruleString+process_elem);
			}
			if(inputEvents[j].vcalendar.indexOf('\r\n')==0 && vCalendarText.lastIndexOf('\r\n')==(vCalendarText.length-2))
				vCalendarText+=inputEvents[j].vcalendar.substring(2,inputEvents[j].vcalendar.length);
			else if((inputEvents[j].vcalendar.indexOf('\r\n')==0 && vCalendarText.lastIndexOf('\r\n')!=(vCalendarText.length-2)) || (inputEvents[j].vcalendar.indexOf('\r\n')!=0 && vCalendarText.lastIndexOf('\r\n')==(vCalendarText.length-2)) )
				vCalendarText+=inputEvents[j].vcalendar;
			else
				vCalendarText+='\r\n'+inputEvents[j].vcalendar;
		}
		else if($('#futureStart').val().split(';')[0]!='' && $('#futureStart').val().split(';')[1]!=inputEvents[j].start)
		{
			if($('#futureStart').val().split(';')[0]>1 && $('#vcalendarHash').val()==String(CryptoJS.SHA256(inputEvents[j].vcalendar)))
				inputEvents[j].vcalendar=changeRuleForFuture(inputEvents[j], $('#futureStart').val().split(';')[0]);

			if(inputEvents[j].vcalendar.indexOf('\r\n')==0 && vCalendarText.lastIndexOf('\r\n')==(vCalendarText.length-2))
				vCalendarText+=inputEvents[j].vcalendar.substring(2,inputEvents[j].vcalendar.length);
			else if((inputEvents[j].vcalendar.indexOf('\r\n')==0 && vCalendarText.lastIndexOf('\r\n')!=(vCalendarText.length-2)) || (inputEvents[j].vcalendar.indexOf('\r\n')!=0 && vCalendarText.lastIndexOf('\r\n')==(vCalendarText.length-2)) )
				vCalendarText+=inputEvents[j].vcalendar;
			else
				vCalendarText+='\r\n'+inputEvents[j].vcalendar;
			futureMode=true;
		}
		else if(deleteMode && $('#futureStart').val().split(';')[0]!='' && $('#futureStart').val().split(';')[1]==inputEvents[j].start)
		{
			if($('#vcalendarHash').val()==String(CryptoJS.SHA256(inputEvents[j].vcalendar)))
			{
				inputEvents[j].vcalendar=changeRuleForFuture(inputEvents[j], 2);
			}

			if(inputEvents[j].vcalendar.indexOf('\r\n')==0 && vCalendarText.lastIndexOf('\r\n')==(vCalendarText.length-2))
				vCalendarText+=inputEvents[j].vcalendar.substring(2,inputEvents[j].vcalendar.length);
			else if((inputEvents[j].vcalendar.indexOf('\r\n')==0 && vCalendarText.lastIndexOf('\r\n')!=(vCalendarText.length-2)) || (inputEvents[j].vcalendar.indexOf('\r\n')!=0 && vCalendarText.lastIndexOf('\r\n')==(vCalendarText.length-2)) )
				vCalendarText+=inputEvents[j].vcalendar;
			else
				vCalendarText+='\r\n'+inputEvents[j].vcalendar;
		}
		else
		{
			realEvent=inputEvents[j];
		}
	}
	vCalendarText=vCalendarText.replace(realEvent.vcalendar,'');
	for(var ip=0; ip<eventStringArray.length;ip++)
	{
		if(eventStringArray[ip].indexOf('\r\n')==0 && vCalendarText.lastIndexOf('\r\n')==(vCalendarText.length-2))
			vCalendarText+=eventStringArray[ip].substring(2,eventStringArray[ip].length);
		else if((eventStringArray[ip].indexOf('\r\n')==0 && vCalendarText.lastIndexOf('\r\n')!=(vCalendarText.length-2)) || (eventStringArray[ip].indexOf('\r\n')!=0 && vCalendarText.lastIndexOf('\r\n')==(vCalendarText.length-2)) )
			vCalendarText+=eventStringArray[ip];
		else
			vCalendarText+='\r\n'+eventStringArray[ip];
	}
	var origEvent = '';
	if(deleteMode || futureMode)
	{
		if(vCalendarText.lastIndexOf('\r\n')!=(vCalendarText.length-2))
			vCalendarText+='\r\n';
		if(!isTimeZone && futureMode && origTimezone!='')
		{
			vCalendarText+=origTimezone;
			if(vCalendarText.lastIndexOf('\r\n')!=(vCalendarText.length-2))
				vCalendarText+='\r\n';
		}

		// PRODID
		if(vCalendar.tplM['contentline_PRODID']!=null && (process_elem=vCalendar.tplM['contentline_PRODID'][0])!=undefined)
		{
			// replace the object and related objects' group names (+ append the related objects after the processed)
			parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
			if(parsed[1]!='') // if group is present, replace the object and related objects' group names
				process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
		}
		else
		{
			process_elem=vCalendar.tplC['contentline_PRODID'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
		}
		process_elem=process_elem.replace('##:::##value##:::##', '-//Inf-IT//'+globalAppName+' '+globalVersion+'//EN');
		vCalendarText+=process_elem;

		if((typeof vCalendar.tplM['unprocessed']!='undefined') && (vCalendar.tplM['unprocessed']!='') && (vCalendar.tplM['unprocessed']!=null))
			vCalendarText+=vCalendar.tplM['unprocessed'].replace(RegExp('^\r\n'), '');

		vCalendar.tplM['unprocessed']=new Array();
		// vCalendar END (required by RFC)

		if(vCalendar.tplM['end']!=null && (process_elem=vCalendar.tplM['end'][0])!=undefined)
			vCalendarText+=vCalendar.tplM['end'][0];
		else
		{
			process_elem=vCalendar.tplC['end'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			vCalendarText+=process_elem;
		}
		if(deleteMode)
		{
			var fixedArr = checkAndFixMultipleUID(vCalendarText,true);
			var inputS = fixedArr[0];
			fixedArr.splice(0,1);
			return putVcalendarToCollection(accountUID, inputUID, inputEtag, inputS, delUID,'vevent',isFormHidden,deleteMode,fixedArr);
		}
		else if(futureMode)
		{
			origEvent = vCalendarText;
			vCalendarText = beginVcalendar;
		}
	}

	var timeZoneAttr='';
	if(typeof globalSessionTimeZone!='undefined' && globalSessionTimeZone)
		sel_option=globalSessionTimeZone;
	var isUTC=false;

	if(!$('#allday').prop('checked'))
	{
		if(globalSettings.timezonesupport.value)
			sel_option=$('#timezone').val();
		//else
		//{
		//	if(inputEvents.length>0)
		//		sel_option=inputEvents[0].timeZone;
		//}

		if(sel_option=='UTC')
		{
			isUTC=true;
			timeZoneAttr='';
		}
		else if(sel_option=='local')
			timeZoneAttr='';
		else if(sel_option=='custom')
			timeZoneAttr=';'+vcalendarEscapeValue('TZID='+realEvent.timeZone);
		else
			timeZoneAttr=';'+vcalendarEscapeValue('TZID='+sel_option);

		var timezoneComponent='';
		if(globalSettings.rewritetimezonecomponent.value || !vCalendar.tplM['unprocessedVTIMEZONE'])
		{
			if(tzArray.indexOf(sel_option)==-1)
				timezoneComponent=buildTimezoneComponent(sel_option);
		}
		else
			timezoneComponent=vCalendar.tplM['unprocessedVTIMEZONE'];

		if(vCalendarText.lastIndexOf('\r\n')!=(vCalendarText.length-2))
			vCalendarText+='\r\n';

		vCalendarText+=timezoneComponent;
	}
	// ---------------------------------- EVENT ---------------------------------- //
	if(vCalendar.tplM['beginVEVENT']!=null && (process_elem=vCalendar.tplM['beginVEVENT'][0])!=undefined)
	{
		if(vCalendarText.lastIndexOf('\r\n')==(vCalendarText.length-2))
			vCalendarText+=vCalendar.tplM['beginVEVENT'][0];
		else
			vCalendarText+='\r\n'+vCalendar.tplM['beginVEVENT'][0];
		vevent=true;
	}
	else
	{
		process_elem=vCalendar.tplC['beginVEVENT'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');

		if(vCalendarText.lastIndexOf('\r\n')==(vCalendarText.length-2))
			vCalendarText+=process_elem;
		else
			vCalendarText+='\r\n'+process_elem;
		vevent=true;
	}

	var d,
	utc,
	d=new Date();

	utc=d.getUTCFullYear()+(d.getUTCMonth()+1<10 ? '0' : '')+(d.getUTCMonth()+1)+(d.getUTCDate()<10 ? '0' : '')+d.getUTCDate()+'T'+(d.getUTCHours()<10 ? '0' : '')+d.getUTCHours()+(d.getUTCMinutes()<10 ? '0' : '')+d.getUTCMinutes()+(d.getUTCSeconds()<10 ? '0' : '')+d.getUTCSeconds()+'Z';
	var create=true;

	if($('#recurrenceID').val()=='')
		var checkVal='orig';
	else
		var checkVal=$('#recurrenceID').val();

	var created='';
	for(vev in vCalendar.tplM['contentline_CREATED'])
	{
		if(vev==checkVal)
			created=vCalendar.tplM['contentline_CREATED'][vev];
	}
	if(created!='')
	{
		process_elem=created;
		// replace the object and related objects' group names (+ append the related objects after the processed)
		parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
		if(parsed[1]!='') // if group is present, replace the object and related objects' group names
			process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
	}
	else
	{
		process_elem=vCalendar.tplC['contentline_CREATED'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
		process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(utc));
	}
	vCalendarText+=process_elem;

	if(vCalendar.tplM['contentline_LM']!=null && (process_elem=vCalendar.tplM['contentline_LM'][0])!=undefined)
	{
		// replace the object and related objects' group names (+ append the related objects after the processed)
		parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
		if(parsed[1]!='') // if group is present, replace the object and related objects' group names
			process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
	}
	else
	{
		process_elem=vCalendar.tplC['contentline_LM'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
	}
	process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(utc));
	vCalendarText+=process_elem;

	if(vCalendar.tplM['contentline_DTSTAMP']!=null && (process_elem=vCalendar.tplM['contentline_DTSTAMP'][0])!=undefined)
	{
		// replace the object and related objects' group names (+ append the related objects after the processed)
		parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
		if(parsed[1]!='') // if group is present, replace the object and related objects' group names
			process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
	}
	else
	{
		process_elem=vCalendar.tplC['contentline_DTSTAMP'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
	}
	process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(utc));
	vCalendarText+=process_elem;

	// UID (required by RFC)
	if($('#futureStart').val()=='' && (operation!='MOVE_IN'&& operation!='MOVE_OTHER') && (vCalendar.tplM['contentline_UID']!=null && (process_elem=vCalendar.tplM['contentline_UID'][0])!=undefined))
	{
		// replace the object and related objects' group names (+ append the related objects after the processed)
		parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
		if(parsed[1]!='') // if group is present, replace the object and related objects' group names
			process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
	}
	else
	{
		process_elem=vCalendar.tplC['contentline_UID'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
		// it is VERY small probability, that for 2 newly created vevents/vtodos the same UID is generated (but not impossible :( ...)
		var newUID=globalEventList.getNewUID();
		process_elem=process_elem.replace('##:::##uid##:::##', newUID);
	}
	vCalendarText+=process_elem;

	if(vCalendar.tplM['contentline_SUMMARY']!=null && (process_elem=vCalendar.tplM['contentline_SUMMARY'][0])!=undefined)
	{
		// replace the object and related objects' group names (+ append the related objects after the processed)
		parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
		if(parsed[1]!='') // if group is present, replace the object and related objects' group names
			process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
	}
	else
	{
		process_elem=vCalendar.tplC['contentline_SUMMARY'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
	}
	process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue($('#name').val()));
	//process_elem=process_elem.replace('##:::##value##:::##',vcalendarEscapeValue('zmena'));
	vCalendarText+=process_elem;

	if($('#priority').val()!='0')
	{
		if(vCalendar.tplM['contentline_PRIORITY']!=null && (process_elem=vCalendar.tplM['contentline_PRIORITY'][0])!=undefined)
		{
			// replace the object and related objects' group names (+ append the related objects after the processed)
			parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
			if(parsed[1]!='') // if group is present, replace the object and related objects' group names
				process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
		}
		else
		{
			process_elem=vCalendar.tplC['contentline_PRIORITY'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
		}
		process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue($('#priority').val()));
		vCalendarText+=process_elem;
	}

	if(vevent)
	{
		if($('#repeat').val()!='no-repeat')
		{
			var interval=$("#repeat_interval_detail").val();
			var byDay='';
			var monthDay='';
			var bymonth='';
			var wkst='';
			var isCustom=false;
			if(interval==1 || interval=='')
				interval='';
			else interval=";INTERVAL="+$("#repeat_interval_detail").val();

			var frequency=$('#repeat').val();
			if(frequency=='TWO_WEEKLY')
			{
				frequency='WEEKLY';
				interval=";INTERVAL="+2;
			}
			else if(frequency=='BUSINESS')
			{
				frequency='WEEKLY';
				byDay=';BYDAY=';
				if(globalSettings.weekenddays.value.length>0)
				{
					for(var i=0;i<7;i++)
						if(globalSettings.weekenddays.value.indexOf(i)==-1)
							byDay+=i+',';
					byDay=byDay.substring(0,byDay.length-1);
					byDay=byDay.replace(1,'MO').replace(2,'TU').replace(3,'WE').replace(4,'TH').replace(5,'FR').replace(6,'SA').replace(0,'SU');
				}
				else
				{
					byDay='SA,SU';
				}
				interval='';
			}
			else if(frequency=='WEEKEND')
			{
				frequency='WEEKLY';
				byDay=';BYDAY=';
				if(globalSettings.weekenddays.value.length>0)
				{
					for(var i=0;i<globalSettings.weekenddays.value.length;i++)
						byDay+=globalSettings.weekenddays.value[i]+',';
					byDay=byDay.substring(0,byDay.length-1);
					byDay=byDay.replace(1,'MO').replace(2,'TU').replace(3,'WE').replace(4,'TH').replace(5,'FR').replace(6,'SA').replace(0,'SU');
				}
				else
				{
					byDay='SA,SU';
				}
				interval='';
			}
			else if(frequency=='CUSTOM_WEEKLY')
			{
				frequency='WEEKLY';
				var byDayArray=$('#week_custom .customTable td.selected');
				if(byDayArray.length>0)
				{
					byDay=';BYDAY=';
					for(var ri=0;ri<byDayArray.length;ri++)
						byDay+=$(byDayArray[ri]).attr('data-type')+',';
					byDay=byDay.substring(0,byDay.length-1);

					byDay=byDay.replace(1,'MO').replace(2,'TU').replace(3,'WE').replace(4,'TH').replace(5,'FR').replace(6,'SA').replace(0,'SU');
					if(globalSettings.mozillasupport.value==null || !globalSettings.mozillasupport.value)
						if(realEvent!='')
						{
							if(realEvent.wkst!='')
								wkst=';WKST='+realEvent.wkst.replace(1,'MO').replace(2,'TU').replace(3,'WE').replace(4,'TH').replace(5,'FR').replace(6,'SA').replace(0,'SU');
						}
						else
							wkst=';WKST='+globalSettings.datepickerfirstdayofweek.value.toString().replace(1,'MO').replace(2,'TU').replace(3,'WE').replace(4,'TH').replace(5,'FR').replace(6,'SA').replace(0,'SU');
				}
			}
			else if(frequency=='CUSTOM_MONTHLY')
			{
				frequency='MONTHLY';
				var byDayFirstPart='';
				var monthCustomOption = $('#repeat_month_custom_select').val();
				if(monthCustomOption!='custom' && $('#repeat_month_custom_select2').val()!='DAY')
				{
					if(monthCustomOption!='')
						byDay=';BYDAY=';
					switch(monthCustomOption)
					{
						case 'every':
							byDayFirstPart='';
							break;
						case 'first':
							byDayFirstPart='1';
							break;
						case 'second':
							byDayFirstPart='2';
							break;
						case 'third':
							byDayFirstPart='3';
							break;
						case 'fourth':
							byDayFirstPart='4';
							break;
						case 'fifth':
							byDayFirstPart='5';
							break;
						case 'last':
							byDayFirstPart='-1';
							break;
						default:
							byDayFirstPart='';
							break;
					}
					byDay+= byDayFirstPart+$('#repeat_month_custom_select2').val();
				}
				else if(monthCustomOption!='custom' && $('#repeat_month_custom_select2').val()=='DAY')
				{
					byDay='';
					switch(monthCustomOption)
					{
						case 'every':
							monthDay=';BYMONTHDAY=';
							for(var p=1;p<32;p++)
								monthDay+=p+',';
							monthDay=monthDay.substring(0,monthDay.length-1);
							break;
						case 'first':
							monthDay=';BYMONTHDAY=1';
							break;
						case 'second':
							monthDay=';BYMONTHDAY=2';
							break;
						case 'third':
							monthDay=';BYMONTHDAY=3';
							break;
						case 'fourth':
							monthDay=';BYMONTHDAY=4';
							break;
						case 'fifth':
							monthDay=';BYMONTHDAY=5';
							break;
						case 'last':
							monthDay=';BYMONTHDAY=-1';
							break;
						default:
							byDayFirstPart='';
							monthDay='';
							break;
					}
				}
				else
				{
					var monthDayArray = $('#month_custom2 .selected');
					if(monthDayArray.length>0)
					{
						monthDay=';BYMONTHDAY=';
						for(var ri=0;ri<monthDayArray.length;ri++)
							monthDay+=$(monthDayArray[ri]).attr('data-type')+',';
						monthDay=monthDay.substring(0,monthDay.length-1);
					}
				}
			}
			else if(frequency=='CUSTOM_YEARLY')
			{
				frequency='YEARLY';
				var byDayFirstPart='';
				var monthCustomOption = $('#repeat_year_custom_select1').val();

				var monthArray = $('#year_custom3 .selected');
				if(monthArray.length>0)
				{
					bymonth=';BYMONTH=';
					for(var ri=0;ri<monthArray.length;ri++)
					{
						var val = parseInt($(monthArray[ri]).attr('data-type'),10);
						if(!isNaN(val))
							bymonth+=(val+1)+',';
					}
					bymonth=bymonth.substring(0,bymonth.length-1);
				}

				if(monthCustomOption!='custom' && $('#repeat_year_custom_select2').val()!='DAY')
				{
					if(monthCustomOption!='')
						byDay=';BYDAY=';
					switch(monthCustomOption)
					{
						case 'every':
							byDayFirstPart='';
							break;
						case 'first':
							byDayFirstPart='1';
							break;
						case 'second':
							byDayFirstPart='2';
							break;
						case 'third':
							byDayFirstPart='3';
							break;
						case 'fourth':
							byDayFirstPart='4';
							break;
						case 'fifth':
							byDayFirstPart='5';
							break;
						case 'last':
							byDayFirstPart='-1';
							break;
						default:
							byDayFirstPart='';
							break;
					}
					byDay+= byDayFirstPart+$('#repeat_year_custom_select2').val();
				}
				else if(monthCustomOption!='custom' && $('#repeat_year_custom_select2').val()=='DAY')
				{
					byDay='';
					switch(monthCustomOption)
					{
						case 'every':
							monthDay=';BYMONTHDAY=';
							for(var p=1;p<32;p++)
								monthDay+=p+',';
							monthDay=monthDay.substring(0,monthDay.length-1);
							break;
						case 'first':
							monthDay=';BYMONTHDAY=1';
							break;
						case 'second':
							monthDay=';BYMONTHDAY=2';
							break;
						case 'third':
							monthDay=';BYMONTHDAY=3';
							break;
						case 'fourth':
							monthDay=';BYMONTHDAY=4';
							break;
						case 'fifth':
							monthDay=';BYMONTHDAY=5';
							break;
						case 'last':
							monthDay=';BYMONTHDAY=-1';
							break;
						default:
							byDayFirstPart='';
							monthDay='';
							break;
					}
				}
				else
				{
					var monthDayArray = $('#year_custom1 .selected');
					if(monthDayArray.length>0)
					{
						monthDay=';BYMONTHDAY=';
						for(var ri=0;ri<monthDayArray.length;ri++)
							monthDay+=$(monthDayArray[ri]).attr('data-type')+',';
						monthDay=monthDay.substring(0,monthDay.length-1);
					}
				}
			}
			else if($('#repeat option:selected').attr('data-type')=="custom_repeat")
				isCustom=true;

			if(vCalendar.tplM['contentline_RRULE']!=null && (process_elem=vCalendar.tplM['contentline_RRULE'][0])!=undefined)
			{
				// replace the object and related objects' group names (+ append the related objects after the processed)
				parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
				if(parsed[1]!='') // if group is present, replace the object and related objects' group names
					process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
			}
			else
			{
				process_elem=vCalendar.tplC['contentline_RRULE'];
				process_elem=process_elem.replace('##:::##group_wd##:::##', '');
				process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
			}

			if(!isCustom)
			{
				if($('#repeat_end_details').val()=="on_date")
				{
					var dateUntil=$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#repeat_end_date').val());
					var datetime_until='';
					if(!$('#allday').prop('checked'))
					{
						var tForR=new Date(Date.parse("01/02/1990, "+$('#time_from').val() ));
						dateUntil.setHours(tForR.getHours());
						dateUntil.setMinutes(tForR.getMinutes());
						dateUntil.setSeconds(tForR.getSeconds());
						if(globalSettings.timezonesupport.value && sel_option in timezones)
							var valOffsetFrom=getOffsetByTZ(sel_option, dateUntil);
						if(valOffsetFrom)
						{
							var intOffset=valOffsetFrom.getSecondsFromOffset()*1000*-1;
							dateUntil.setTime(dateUntil.getTime()+intOffset);
						}
						datetime_until=$.fullCalendar.formatDate(dateUntil, "yyyyMMdd'T'HHmmss'Z'");
					}
					else
						datetime_until=$.fullCalendar.formatDate(dateUntil, 'yyyyMMdd')+'T000000Z';

					process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue("FREQ="+frequency)+interval+";UNTIL="+datetime_until+bymonth+monthDay+byDay+wkst);
				}
				else if($('#repeat_end_details').val()=="after")
					process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue("FREQ="+frequency)+interval+";COUNT="+(parseInt($('#repeat_end_after').val()))+bymonth+monthDay+byDay+wkst);
				else
					process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue("FREQ="+frequency)+interval+bymonth+monthDay+byDay+wkst);
			}
			else
				process_elem=process_elem.replace('##:::##value##:::##',$('#repeat').val());

			vCalendarText+=process_elem;

			if(realEvent.repeatStart)
			{
				var a=$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_from').val());
				var repeatStart=realEvent.repeatStart;
				var b=new Date(1970,1,1,0,0,0);
				if(!$('#allday').prop('checked'))
				{
					b=new Date(Date.parse("01/02/1990, "+$('#time_from').val() ));
					a.setHours(b.getHours());
					a.setMinutes(b.getMinutes());
					a.setSeconds(b.getSeconds());
				}
				var offsetDate=a-repeatStart;

				for(var iter in vCalendar.tplM['contentline_EXDATE'])
				{
					if(isNaN(iter))
						continue;

					var exStr=('\r\n'+vCalendar.tplM['contentline_EXDATE'][iter]).match(vCalendar.pre['contentline_parse']);
					var exVal=exStr[4].parseComnpactISO8601();
					if(exVal)
					{
						if(exStr[4].indexOf('T')==-1 && !$('#allday').prop('checked'))
						{
							//HERE
							var timePart = new Date(Date.parse("01/02/1990, "+$('#time_from').val() ));
							var time_from = $.fullCalendar.formatDate(b, 'HHmmss');
							exVal = (exStr[4] + 'T' + time_from).parseComnpactISO8601();
							if(sel_option!='local')
							{
								var valOffsetFrom=getOffsetByTZ(sel_option, exVal);
								var intOffset = valOffsetFrom.getSecondsFromOffset()*-1;
								exVal = new Date(exVal.setSeconds(intOffset));
							}
						}
						else if(exStr[4].indexOf('T')!=-1 && !$('#allday').prop('checked'))
						{
							if(sel_option!='local')
							{
								var valOffsetFrom=getOffsetByTZ(sel_option, exVal);
								var origValOffset = getOffsetByTZ(realEvent.timeZone, exVal);
								var intOffset = (valOffsetFrom.getSecondsFromOffset() - origValOffset.getSecondsFromOffset())*-1;
								exVal = new Date(exVal.setSeconds(intOffset));
							}
							else
							{
								var origValOffset = getOffsetByTZ(realEvent.timeZone, exVal);
								exVal = new Date(exVal.setSeconds(origValOffset.getSecondsFromOffset()));
							}
						}


						var value=new Date(exVal.getTime()+offsetDate);
						process_elem=vCalendar.tplC['contentline_EXDATE'];
						process_elem=process_elem.replace('##:::##group_wd##:::##', '');
						process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
						if(!$('#allday').prop('checked'))
						{
							//if(exStr[4].indexOf('T')==-1)
							//	var newValue=new Date(value.setMinutes(new Date().getTimezoneOffset()));

							newValue=$.fullCalendar.formatDate(value, "yyyyMMdd'T'HHmmss")+(sel_option!='local' ? 'Z' : '');
							process_elem=process_elem.replace('##:::##AllDay##:::##', vcalendarEscapeValue(''));
							process_elem=process_elem.replace('##:::##TZID##:::##', vcalendarEscapeValue(''));
							process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(newValue));
						}
						else
						{
							var newValue=$.fullCalendar.formatDate(value, "yyyyMMdd");
							process_elem=process_elem.replace('##:::##AllDay##:::##', ';'+vcalendarEscapeValue('VALUE=DATE'));
							process_elem=process_elem.replace('##:::##TZID##:::##', vcalendarEscapeValue(''));
							process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(newValue));
						}
						vCalendarText+=process_elem;
					}
				}
			}
		}
		var a=$('#eventDetailsTable').find("tr[data-id]");
		var lastDataId=0;
		for(var i=0;i<a[a.length-1].attributes.length;i++)
			if(a[a.length-1].attributes[i].nodeName=="data-id")
			{
				lastDataId=a[a.length-1].attributes[i].value;
				break;
			}
		var alarmIterator=0;
		var alarmUniqueArray = new Array();
		for(var t=0;t<lastDataId;t++)
		{
			if($(".alert[data-id="+(t+1)+"]").length>0)
			{
				var alarmText = '';
				if($(".alert[data-id="+(t+1)+"]").val()!='none')
				{
					if(vCalendar.tplM['beginVALARM']!=null && (process_elem=vCalendar.tplM['beginVALARM'][0])!=undefined)
						alarmText+=vCalendar.tplM['beginVALARM'][0];
					else
					{
						process_elem=vCalendar.tplC['beginVALARM'];
						process_elem=process_elem.replace('##:::##group_wd##:::##', '');
						alarmText+=process_elem;
						vevent=true;
					}

					if($(".alert[data-id="+(t+1)+"]").val()=='message')
					{
						if($(".alert_message_details[data-id="+(t+1)+"]").val()=='on_date')
						{
							if(vCalendar.tplM['contentline_TRIGGER']!=null && (process_elem=vCalendar.tplM['contentline_TRIGGER'][0])!=undefined)
							{
								parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
								if(parsed[1]!='') // if group is present, replace the object and related objects' group names
									process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
							}
							else
							{
								process_elem=vCalendar.tplC['contentline_TRIGGER'];
								process_elem=process_elem.replace('##:::##group_wd##:::##', '');
								process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
							}

							var dateTo=$.datepicker.parseDate(globalSettings.datepickerformat.value, $(".message_date_input[data-id="+(t+1)+"]").val());
							var datetime_to=$.fullCalendar.formatDate(dateTo, 'yyyy-MM-dd');
							var aDate=new Date(Date.parse("01/02/1990, "+$(".message_time_input[data-id="+(t+1)+"]").val() ));
							var time_to=$.fullCalendar.formatDate(aDate, 'HH:mm:ss');

							var alarmDT=$.fullCalendar.parseDate(datetime_to+'T'+time_to);

							if(globalSettings.timezonesupport.value)
								sel_option=$('#timezone').val();

							if($('.timezone_row').css('display')=='none')
								sel_option='local';

							if(sel_option!='local')
							{
								var origValOffset=getOffsetByTZ(sel_option, alarmDT);
								var origIntOffset = origValOffset.getSecondsFromOffset()*-1;
								alarmDT = new Date(alarmDT.setSeconds(origIntOffset));
							}

							var newValue=$.fullCalendar.formatDate(alarmDT, "yyyyMMdd'T'HHmmss")+(sel_option!='local' ? 'Z' : '');

							process_elem=process_elem.replace('##:::##VALUE=DATE-TIME##:::##', ';VALUE=DATE-TIME');
							process_elem=process_elem.replace('##:::##VALUE=DURATION##:::##', '');
							process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(newValue));
							alarmText+=process_elem;
						}
						else
						{
							var duration='';
							var before_after=$(".before_after_input[data-id="+(t+1)+"]").val();
							if($(".alert_message_details[data-id="+(t+1)+"]").val()=='minutes_before')
								duration="-PT"+before_after+"M";
							if($(".alert_message_details[data-id="+(t+1)+"]").val()=='hours_before')
								duration="-PT"+before_after+"H";
							if($(".alert_message_details[data-id="+(t+1)+"]").val()=='days_before')
								duration="-P"+before_after+"D";
							if($(".alert_message_details[data-id="+(t+1)+"]").val()=='weeks_before')
								duration="-P"+before_after+"W";
							if($(".alert_message_details[data-id="+(t+1)+"]").val()=='seconds_before')
								duration="-PT"+before_after+"S";
							if($(".alert_message_details[data-id="+(t+1)+"]").val()=='minutes_after')
								duration="PT"+before_after+"M";
							if($(".alert_message_details[data-id="+(t+1)+"]").val()=='hours_after')
								duration="PT"+before_after+"H";
							if($(".alert_message_details[data-id="+(t+1)+"]").val()=='days_after')
								duration="P"+before_after+"D";
							if($(".alert_message_details[data-id="+(t+1)+"]").val()=='weeks_after')
								duration="P"+before_after+"W";
							if($(".alert_message_details[data-id="+(t+1)+"]").val()=='seconds_after')
								duration="PT"+before_after+"S";
							if(vCalendar.tplM['contentline_TRIGGER']!=null && (process_elem=vCalendar.tplM['contentline_TRIGGER'][0])!=undefined)
							{
								parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
								if(parsed[1]!='') // if group is present, replace the object and related objects' group names
									process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
							}
							else
							{
								process_elem=vCalendar.tplC['contentline_TRIGGER'];
								process_elem=process_elem.replace('##:::##group_wd##:::##', '');
								process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
							}
							process_elem=process_elem.replace('##:::##VALUE=DATE-TIME##:::##', '');
							process_elem=process_elem.replace('##:::##VALUE=DURATION##:::##', ';VALUE=DURATION');
							process_elem=process_elem.replace('##:::##value##:::##', duration);
							alarmText+=process_elem;
						}

						if(vCalendar.tplM['contentline_ACTION']!=null && (process_elem=vCalendar.tplM['contentline_ACTION'][0])!=undefined)
						{
							parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
							if(parsed[1]!='') // if group is present, replace the object and related objects' group names
								process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
						}
						else
						{
							process_elem=vCalendar.tplC['contentline_ACTION'];
							process_elem=process_elem.replace('##:::##group_wd##:::##', '');
							process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
						}
						process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue('DISPLAY'));
						alarmText+=process_elem;
						var a=new Date();

						if(vCalendar.tplM['contentline_DESCRIPTION']!=null && (process_elem=vCalendar.tplM['contentline_DESCRIPTION'][0])!=undefined)
						{
							parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
							if(parsed[1]!='') // if group is present, replace the object and related objects' group names
								process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
						}
						else
						{
							process_elem=vCalendar.tplC['contentline_DESCRIPTION'];
							process_elem=process_elem.replace('##:::##group_wd##:::##', '');
							process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
						}
						process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue('Reminder'));
						alarmText+=process_elem;

					}
					if((typeof vCalendar.tplM['unprocessedVALARM']!='undefined' && typeof vCalendar.tplM['unprocessedVALARM'][t]!='undefined') && (vCalendar.tplM['unprocessedVALARM'][t]!='') && (vCalendar.tplM['unprocessedVALARM'][t]!=null))
					{
						tmp=vCalendar.tplM['unprocessedVALARM'][t].replace(RegExp('^\r\n'), '').replace(RegExp('\r\n$'), '');
						if(tmp.indexOf('\r\n')==0)
							tmp=tmp.substring(2, tmp.length);
						if(tmp.lastIndexOf('\r\n')!=(tmp.length-2))
							tmp+='\r\n';
						alarmText+=tmp;
					}
					if(vCalendar.tplM['endVALARM']!=null && (process_elem=vCalendar.tplM['endVALARM'][0])!=undefined)
						alarmText+=vCalendar.tplM['endVALARM'][0];
					else
					{
						process_elem=vCalendar.tplC['endVALARM'];
						process_elem=process_elem.replace('##:::##group_wd##:::##', '');
						alarmText+=process_elem;
					}
					if(alarmUniqueArray.indexOf(alarmText)==-1)
					{
						alarmUniqueArray.push(alarmText);
						vCalendarText+=alarmText;
					}
				}
			}
		}
		vCalendar.tplM['unprocessedVALARM']=new Array();

		if($('#avail').val()!='none')
		{
			if(vCalendar.tplM['contentline_TRANSP']!=null && (process_elem=vCalendar.tplM['contentline_TRANSP'][0])!=undefined)
			{
				// replace the object and related objects' group names (+ append the related objects after the processed)
				parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
				if(parsed[1]!='') // if group is present, replace the object and related objects' group names
					process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
			}
			else
			{
				process_elem=vCalendar.tplC['contentline_TRANSP'];
				process_elem=process_elem.replace('##:::##group_wd##:::##', '');
				process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
			}
			if($('#avail').val()=='busy')
				process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue('OPAQUE'));
			else
				process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue('TRANSPARENT'));
			vCalendarText+=process_elem;
		}

		if($('#url_EVENT').val()!='')
		{
			if(vCalendar.tplM['contentline_URL']!=null && (process_elem=vCalendar.tplM['contentline_URL'][0])!=undefined)
			{
				// replace the object and related objects' group names (+ append the related objects after the processed)
				parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
				if(parsed[1]!='') // if group is present, replace the object and related objects' group names
					process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
			}
			else
			{
				process_elem=vCalendar.tplC['contentline_URL'];
				process_elem=process_elem.replace('##:::##group_wd##:::##', '');
				process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
			}
			process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue($('#url_EVENT').val()));
			vCalendarText+=process_elem;
		}



	}
	//DESCRIPTION
	if($('#note').val()!='')
	{
		// NOTE
		if(vCalendar.tplM['contentline_NOTE']!=null && (process_elem=vCalendar.tplM['contentline_NOTE'][0])!=undefined)
		{
			// replace the object and related objects' group names (+ append the related objects after the processed)
			parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
			if(parsed[1]!='') // if group is present, replace the object and related objects' group names
				process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
		}
		else
		{
			process_elem=vCalendar.tplC['contentline_NOTE'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
		}
		process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue($('#note').val()));
		vCalendarText+=process_elem;
	}

	if($('#status').val()!='NONE')
	{

		//if((value=$('[id="vcalendar_editor"] [data-type="\\%note"]').find('textarea').val())!='')
		//{
		if(vCalendar.tplM['contentline_STATUS']!=null && (process_elem=vCalendar.tplM['contentline_STATUS'][0])!=undefined)
		{
			// replace the object and related objects' group names (+ append the related objects after the processed)
			parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
			if(parsed[1]!='') // if group is present, replace the object and related objects' group names
				process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
		}
		else
		{
			process_elem=vCalendar.tplC['contentline_STATUS'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
		}
		process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue($('#status').val()));
		vCalendarText+=process_elem;
	}

	//CLASS
	if($('#type').val()!='')
	{
		// CLASS
		if(vCalendar.tplM['contentline_CLASS']!=null && (process_elem=vCalendar.tplM['contentline_CLASS'][0])!=undefined)
		{
			// replace the object and related objects' group names (+ append the related objects after the processed)
			parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
			if(parsed[1]!='') // if group is present, replace the object and related objects' group names
				process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
		}
		else
		{
			process_elem=vCalendar.tplC['contentline_CLASS'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
			if(typeof vCalendar.tplM['contentline_CLASS'] =='undefined' || vCalendar.tplM['contentline_CLASS']==null || vCalendar.tplM['contentline_CLASS'].length==0)
				process_elem='';
		}

		if($('.row_type').css('display')!='none')
		{
			process_elem=vCalendar.tplC['contentline_CLASS'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
			process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue($('#type').val().toUpperCase()));
		}
		vCalendarText+=process_elem;
	}

	//RECURRENCE-ID
	if($('#recurrenceID').val())
	{
		if(vCalendar.tplM['contentline_REC_ID']!=null && (process_elem=vCalendar.tplM['contentline_REC_ID'][0])!=undefined)
		{
			// replace the object and related objects' group names (+ append the related objects after the processed)
			parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
			if(parsed[1]!='') // if group is present, replace the object and related objects' group names
				process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
		}
		else
		{
			process_elem=vCalendar.tplC['contentline_REC_ID'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
		}

		var rec_id=$('#recurrenceID').val()
		if(rec_id.indexOf('T')==-1)
		{
			process_elem=process_elem.replace('##:::##AllDay##:::##', ';'+vcalendarEscapeValue('VALUE=DATE'));
			process_elem=process_elem.replace('##:::##TZID##:::##', vcalendarEscapeValue(''));
			process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(rec_id));
		}
		else
		{
			process_elem=process_elem.replace('##:::##AllDay##:::##', vcalendarEscapeValue(''));

			/*if((typeof vCalendar.tplM['unprocessed']!='undefined') && (vCalendar.tplM['unprocessed']!='') && (vCalendar.tplM['unprocessed']!=null))
			{
				var checkTZID=vCalendar.tplM['unprocessed'].match(vCalendar.pre['contentline_TZID']);
				if(checkTZID!=null)
				{
					parsed=checkTZID[0].match(vCalendar.pre['contentline_parse']);
					process_elem=process_elem.replace('##:::##TZID##:::##', ';'+vcalendarEscapeValue("TZID="+parsed[4]));
				}
				else
					process_elem=process_elem.replace('##:::##TZID##:::##', ';'+vcalendarEscapeValue("TZID="+ sel_option));
			}
			else*/

			process_elem=process_elem.replace('##:::##TZID##:::##',timeZoneAttr);
			if(isUTC && rec_id.charAt(rec_id.length-1)!='Z')
				rec_id+='Z';
			process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(rec_id));
		}
		vCalendarText+=process_elem;
	}

	if(vCalendar.tplM['contentline_E_DTSTART']!=null && (process_elem=vCalendar.tplM['contentline_E_DTSTART'][0])!=undefined)
	{
		// replace the object and related objects' group names (+ append the related objects after the processed)
		parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
		if(parsed[1]!='') // if group is present, replace the object and related objects' group names
			process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
	}
	else
	{
		process_elem=vCalendar.tplC['contentline_E_DTSTART'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
	}

	var datetime_from='', datetime_to='';
	var a=$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_from').val());
	var a2=$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_to').val());
	var b=new Date(1970, 1, 1, 0, 0, 0);
	if(datetime_from=='')
		datetime_from=$.fullCalendar.formatDate(a, 'yyyyMMdd');

	if(datetime_to=='')
		datetime_to=$.fullCalendar.formatDate(a2, 'yyyyMMdd');

	var dateTo=$.datepicker.parseDate('yymmdd',datetime_to);

	if($('#allday').prop('checked'))
	{
		process_elem=process_elem.replace('##:::##AllDay##:::##', ';'+vcalendarEscapeValue('VALUE=DATE'));
		process_elem=process_elem.replace('##:::##TZID##:::##', vcalendarEscapeValue(''));
		process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(datetime_from));
	}
	else
	{
		b=new Date(Date.parse("01/02/1990, "+$('#time_from').val() ));
		var time_from=$.fullCalendar.formatDate(b, 'HHmmss');
		process_elem=process_elem.replace('##:::##AllDay##:::##', vcalendarEscapeValue(''));

		/*if((typeof vCalendar.tplM['unprocessed']!='undefined') && (vCalendar.tplM['unprocessed']!='') && (vCalendar.tplM['unprocessed']!=null))
		{
			var checkTZID=vCalendar.tplM['unprocessed'].match(vCalendar.pre['contentline_TZID']);
			if(checkTZID!=null)
			{
				parsed=checkTZID[0].match(vCalendar.pre['contentline_parse']);
				process_elem=process_elem.replace('##:::##TZID##:::##', ';'+vcalendarEscapeValue("TZID="+parsed[4]));
			}
			else
				process_elem=process_elem.replace('##:::##TZID##:::##', ';'+vcalendarEscapeValue("TZID="+ sel_option));
		}
		else*/
		process_elem=process_elem.replace('##:::##TZID##:::##', timeZoneAttr);
		process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(datetime_from+'T'+time_from+(isUTC ? 'Z' : '')));
	}

	vCalendarText+=process_elem;

	if(realEvent!='')
	{
		if(realEvent.type!='')
		{
			var repeatStart=realEvent.repeatStart;
			a.setHours(b.getHours());
			a.setMinutes(b.getMinutes());
			a.setSeconds(b.getSeconds());
			var changeDate=a;
			var offsetDate=changeDate-repeatStart;
			var realEventUID=realEvent.vcalendar.match(vCalendar.pre['contentline_UID']);

			if(realEventUID!=null)
				realEventUID=realEventUID[0].match(vCalendar.pre['contentline_parse'])[4];

			if(offsetDate!=0)
			{
				var vcalendarOrig=vCalendarText;
				var eventArray=new Array(),backupEventArray= new Array();
				while(vcalendarOrig.match(vCalendar.pre['vevent'])!=null)
				{
					if(vcalendarOrig.substring(vcalendarOrig.indexOf('BEGIN:VEVENT')-2, vcalendarOrig.indexOf('BEGIN:VEVENT'))=='\r\n')
					{
						var partEvent=vcalendarOrig.substring(vcalendarOrig.indexOf('BEGIN:VEVENT')-2,vcalendarOrig.indexOf('END:VEVENT')+'END:VEVENT'.length);
						vcalendarOrig=vcalendarOrig.replace(partEvent, '');
					}
					else
					{
						var partEvent=vcalendarOrig.substring(vcalendarOrig.indexOf('BEGIN:VEVENT'),vcalendarOrig.indexOf('END:VEVENT')+'END:VEVENT'.length);
						vcalendarOrig=vcalendarOrig.replace(partEvent, '');
						partEvent+='\r\n';
					}
					eventArray[eventArray.length]=partEvent;
					backupEventArray[backupEventArray.length]=partEvent;
				}
				if(eventArray.length==0)
					console.log("Error: '"+inputUID+"': unable to parse vEvent");

				for(var it=0;it<eventArray.length;it++)
				{
					var findUid=eventArray[it].match(vCalendar.pre['contentline_UID']);
					if(findUid!=null)
					{
						if(findUid[0].match(vCalendar.pre['contentline_parse'])[4]!=realEventUID)
						continue;
					}
					var findRec=eventArray[it].match(vCalendar.pre['contentline_RECURRENCE_ID']);
					if(findRec!=null)
					{
						var parsed=findRec[0].match(vCalendar.pre['contentline_parse']);

						process_elem=vCalendar.tplC['contentline_REC_ID'];
						process_elem=process_elem.replace('##:::##group_wd##:::##', parsed[1]);
						process_elem=process_elem.replace('##:::##params_wsc##:::##', '');

						var value=parsed[4].parseComnpactISO8601();
						if(value)
						{
							value=new Date(value.getTime()+offsetDate)

							var newValue=$.fullCalendar.formatDate(value, "yyyyMMdd'T'HHmmss");
							if(isUTC)
								newValue+='Z';

							if($('#allday').prop('checked'))
							{
								newValue=$.fullCalendar.formatDate(value, "yyyyMMdd");
								process_elem=process_elem.replace('##:::##AllDay##:::##', ';'+vcalendarEscapeValue('VALUE=DATE'));
								process_elem=process_elem.replace('##:::##TZID##:::##', vcalendarEscapeValue(''));
								process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(newValue));
							}
							else
							{
								process_elem=process_elem.replace('##:::##AllDay##:::##', vcalendarEscapeValue(''));

								/*if((typeof vCalendar.tplM['unprocessed']!='undefined') && (vCalendar.tplM['unprocessed']!='') && (vCalendar.tplM['unprocessed']!=null))
								{
									var checkTZID=vCalendar.tplM['unprocessed'].match(vCalendar.pre['contentline_TZID']);
									if(checkTZID!=null)
									{
										parsed=checkTZID[0].match(vCalendar.pre['contentline_parse']);
										process_elem=process_elem.replace('##:::##TZID##:::##', ';'+vcalendarEscapeValue("TZID="+parsed[4]));
									}
									else
										process_elem=process_elem.replace('##:::##TZID##:::##', ';'+vcalendarEscapeValue("TZID="+ sel_option));
								}
								else*/
								process_elem=process_elem.replace('##:::##TZID##:::##', timeZoneAttr);
								process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(newValue));
							}
							eventArray[it]=eventArray[it].replace(findRec[0],'\r\n'+process_elem);
						}
					}
					vCalendarText=vCalendarText.replace(backupEventArray[it],eventArray[it]);
				}
			}
		}
	}

	if(vCalendar.tplM['contentline_E_DTEND']!=null && (process_elem=vCalendar.tplM['contentline_E_DTEND'][0])!=undefined)
	{
		// replace the object and related objects' group names (+ append the related objects after the processed)
		parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
		if(parsed[1]!='') // if group is present, replace the object and related objects' group names
			process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
	}
	else
	{
		process_elem=vCalendar.tplC['contentline_E_DTEND'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
	}

	if($('#allday').prop('checked'))
	{
		var dateAfter=new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate()+1);
		dateAfter=dateAfter.getFullYear()+''+((dateAfter.getMonth()+1)<10 ? '0'+(dateAfter.getMonth()+1) : (dateAfter.getMonth()+1))+''+			((dateAfter.getDate())<10 ? '0'+(dateAfter.getDate()) : (dateAfter.getDate()));
		process_elem=process_elem.replace('##:::##AllDay##:::##', ';'+vcalendarEscapeValue('VALUE=DATE'));
		process_elem=process_elem.replace('##:::##TZID##:::##', vcalendarEscapeValue(""));
		process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(dateAfter));
	}
	else
	{
		var b2=new Date(Date.parse("01/02/1990, "+$('#time_to').val() ));
		var time_to=$.fullCalendar.formatDate(b2, 'HHmmss');
		process_elem=process_elem.replace('##:::##AllDay##:::##', vcalendarEscapeValue(''));

		/*if((typeof vCalendar.tplM['unprocessed']!='undefined') && (vCalendar.tplM['unprocessed']!='') && (vCalendar.tplM['unprocessed']!=null))
		{
			var checkTZID=vCalendar.tplM['unprocessed'].match(vCalendar.pre['contentline_TZID']);
			if(checkTZID!=null)
			{
				parsed=checkTZID[0].match(vCalendar.pre['contentline_parse']);
				process_elem=process_elem.replace('##:::##TZID##:::##', ';'+vcalendarEscapeValue("TZID="+parsed[4]));
			}
			else
				process_elem=process_elem.replace('##:::##TZID##:::##', ';'+vcalendarEscapeValue("TZID="+sel_option));
		}
		else*/
		process_elem=process_elem.replace('##:::##TZID##:::##', timeZoneAttr);
		process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(datetime_to+'T'+time_to+(isUTC ? 'Z' : '')));
	}
	vCalendarText+=process_elem;

	//RFC OPTIONAL
	if(vCalendar.tplM['contentline_LOCATION']!=null && (process_elem=vCalendar.tplM['contentline_LOCATION'][0])!=undefined)
	{
		// replace the object and related objects' group names (+ append the related objects after the processed)
		parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)','m'));
		if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
			process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+(groupCounter++)+'.').substring(2);
	}
	else
	{
		process_elem=vCalendar.tplC['contentline_LOCATION'];
		process_elem=process_elem.replace('##:::##group_wd##:::##','');
		process_elem=process_elem.replace('##:::##params_wsc##:::##','');
	}

	if($('#location').val()!='')
	{
		process_elem=process_elem.replace('##:::##value##:::##',vcalendarEscapeValue($('#location').val()));
		vCalendarText+=process_elem;
	}

	if($('#recurrenceID').val()=='')
		var checkVal='orig';
	else
		var checkVal=$('#recurrenceID').val();

	if(typeof vCalendar.tplM['unprocessedVEVENT']!='undefined' && vCalendar.tplM['unprocessedVEVENT']!=null)
	{
		for(vev in vCalendar.tplM['unprocessedVEVENT'])
			if(vev==checkVal)
				vCalendarText+=vCalendar.tplM['unprocessedVEVENT'][vev].replace(RegExp('^\r\n'), '');
	}

	//vCalendar.tplM['unprocessedVEVENT']=new Array();

	if(vCalendar.tplM['endVEVENT']!=null && (process_elem=vCalendar.tplM['endVEVENT'][0])!=undefined)
		vCalendarText+=vCalendar.tplM['endVEVENT'][0];
	else
	{
		process_elem=vCalendar.tplC['endVEVENT'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		vCalendarText+=process_elem;
	}

	// PRODID
	if(vCalendar.tplM['contentline_PRODID']!=null && (process_elem=vCalendar.tplM['contentline_PRODID'][0])!=undefined)
	{
		// replace the object and related objects' group names (+ append the related objects after the processed)
		parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
		if(parsed[1]!='') // if group is present, replace the object and related objects' group names
			process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
	}
	else
	{
		process_elem=vCalendar.tplC['contentline_PRODID'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
	}
	process_elem=process_elem.replace('##:::##value##:::##', '-//Inf-IT//'+globalAppName+' '+globalVersion+'//EN');
	vCalendarText+=process_elem;

	if(typeof vCalendar.tplM['unprocessed']!='undefined' && vCalendar.tplM['unprocessed']!='' && vCalendar.tplM['unprocessed']!=null)
		vCalendarText+=vCalendar.tplM['unprocessed'].replace(RegExp('^\r\n'), '');

	vCalendar.tplM['unprocessed']=new Array();

	// vCalendar END (required by RFC)
	if(vCalendar.tplM['end']!=null && (process_elem=vCalendar.tplM['end'][0])!=undefined)
		vCalendarText+=vCalendar.tplM['end'][0];
	else
	{
		process_elem=vCalendar.tplC['end'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		vCalendarText+=process_elem;
	}

	var nextVcalendars = new Array();
	if(futureMode && origEvent!='')
	{
		var fixed = checkAndFixMultipleUID(origEvent,true);
		if(fixed.length==1)
			nextVcalendars[nextVcalendars.length]=origEvent;
		else
			nextVcalendars=fixed;
	}

	// replace unsupported XML characters
	vCalendarText=vCalendarText.replace(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]/g, ' ');

	var fixedArr = checkAndFixMultipleUID(vCalendarText,true);
	fixedArr = $.merge(nextVcalendars,fixedArr);
	var inputS = fixedArr[0];
	fixedArr.splice(0,1);
	if(operation=='MOVE_IN')
		return moveVcalendarToCollection(accountUID, inputUID, inputEtag, inputS, delUID, 'vevent', isFormHidden, deleteMode, fixedArr);
	else
		return putVcalendarToCollection(accountUID, inputUID, inputEtag, inputS, delUID, 'vevent', isFormHidden, deleteMode, fixedArr);
}

function fullVcalendarToData(inputEvent)
{
	CalDAVeditor_cleanup();
	var vcalendar='';
	var rid=inputEvent.id.substring(0, inputEvent.id.lastIndexOf('/')+1);
	if(globalEventList.events[rid][inputEvent.id].uid!=undefined)
		vcalendar=globalEventList.events[rid][inputEvent.id].vcalendar;
	if(!vcalendar)
		return false;

	var vcalendar_full=vcalendar.split('\r\n');

	if((parsed=('\r\n'+vcalendar_full[0]+'\r\n').match(vCalendar.pre['contentline_parse']))==null)
		return false;

	//BEGIN, END VCALENDAR
	vCalendar.tplM['begin'][0]=vCalendar.tplC['begin'].replace(/##:::##group_wd##:::##/g, vcalendar_begin_group=parsed[1]);
	// parsed (contentline_parse)=[1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
	if((parsed=('\r\n'+vcalendar_full[vcalendar_full.length-2]+'\r\n').match(vCalendar.pre['contentline_parse']))==null)
		return false;
	// values not directly supported by the editor (old values are kept intact)
	vCalendar.tplM['end'][0]=vCalendar.tplC['end'].replace(/##:::##group_wd##:::##/g, vcalendar_end_group=parsed[1]);

	if(vcalendar_begin_group!=vcalendar_end_group)
		return false;// the vCalendar BEGIN and END "group" are different
	// remove the vCalendar BEGIN and END

	vcalendar='\r\n'+vcalendar_full.slice(1, vcalendar_full.length-2).join('\r\n')+'\r\n';

	/*
	vcalendar_element=vcalendar.match(vCalendar.pre['tzone']);
	if(vcalendar_element!=null)
		vcalendar=vcalendar.replace(vcalendar_element[0],'');
	*/

	//FIX TIMEZONE
	var beginTimeZone=vcalendar.indexOf('BEGIN:VTIMEZONE');
	var startEndTimeZone=vcalendar.lastIndexOf('END:VTIMEZONE');
	var endTimeZone=0;
	var vTimeZone='';

	if(beginTimeZone!=-1 && startEndTimeZone!=-1)
	{
		for(i=(startEndTimeZone+2);i<vcalendar.length;i++)
		{
			if(vcalendar.charAt(i)=='\n')
			{
				endTimeZone=i+1;
				break;
			}
		}
		vTimeZone=vcalendar.substring(beginTimeZone, endTimeZone);
		vcalendar=vcalendar.substring(0, beginTimeZone)+vcalendar.substring(endTimeZone, vcalendar.length);
	}

	vcalendar_element=vcalendar.match(RegExp('\r\n'+vCalendar.re['contentline_CALSCALE'], 'mi'));

	if(vcalendar_element!=null)
	{
		parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
		//note=String(vcalendar_element).split(':')[1];
		version=vcalendarUnescapeValue(parsed[4]);
		vCalendar.tplM['contentline_CALSCALE'][0]=vCalendar.tplC['contentline_CALSCALE'];
		vCalendar.tplM['contentline_CALSCALE'][0]=vCalendar.tplM['contentline_CALSCALE'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
		vCalendar.tplM['contentline_CALSCALE'][0]=vCalendar.tplM['contentline_CALSCALE'][0].replace(/##:::##params_wsc##:::##/g, parsed[3]);
		vcalendar=vcalendar.replace(vcalendar_element[0], '\r\n');

		if(parsed[1]!='')
		{
			var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
			while ((vcalendar_element_related=vcalendar.match(re))!=null)
			{
				// append the parameter to its parent
				vCalendar.tplM['contentline_CALSCALE'][0]+=vcalendar_element_related[0].substr(2);
				// remove the processed parameter
				vcalendar=vcalendar.replace(vcalendar_element_related[0], '\r\n');
			}
		}
	}

	vcalendar_element=vcalendar.match(RegExp('\r\n'+vCalendar.re['contentline_VERSION'], 'mi'));

	if(vcalendar_element!=null)
	{
		parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
		//note=String(vcalendar_element).split(':')[1];
		version=vcalendarUnescapeValue(parsed[4]);
		vCalendar.tplM['contentline_VERSION'][0]=vCalendar.tplC['contentline_VERSION'];
		vCalendar.tplM['contentline_VERSION'][0]=vCalendar.tplM['contentline_VERSION'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
		vCalendar.tplM['contentline_VERSION'][0]=vCalendar.tplM['contentline_VERSION'][0].replace(/##:::##params_wsc##:::##/g, parsed[3]);
		vcalendar=vcalendar.replace(vcalendar_element[0], '\r\n');

		if(parsed[1]!='')
		{
			var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
			while ((vcalendar_element_related=vcalendar.match(re))!=null)
			{
				// append the parameter to its parent
				vCalendar.tplM['contentline_VERSION'][0]+=vcalendar_element_related[0].substr(2);
				// remove the processed parameter
				vcalendar=vcalendar.replace(vcalendar_element_related[0], '\r\n');
			}
		}
	}

	//PRODID
	vcalendar_element=vcalendar.match(RegExp('\r\n'+vCalendar.re['contentline_PRODID'], 'mi'));
	if(vcalendar_element!=null)
	{
		parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);

		vCalendar.tplM['contentline_PRODID'][0]=vCalendar.tplC['contentline_PRODID'];
		vCalendar.tplM['contentline_PRODID'][0]=vCalendar.tplM['contentline_PRODID'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
		vCalendar.tplM['contentline_PRODID'][0]=vCalendar.tplM['contentline_PRODID'][0].replace(/##:::##params_wsc##:::##/g, parsed[3]);
		vcalendar=vcalendar.replace(vcalendar_element[0], '\r\n');
		if(parsed[1]!='')
		{
			var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
			while ((vcalendar_element_related=vcalendar.match(re))!=null)
			{
				// append the parameter to its parent
				vCalendar.tplM['contentline_PRODID'][0]+=vcalendar_element_related[0].substr(2);
				// remove the processed parameter
				vcalendar=vcalendar.replace(vcalendar_element_related[0], '\r\n');
			}
		}
	}

	var eventArray=new Array();
	while(vcalendar.match(vCalendar.pre['vevent'])!=null)
	{
		var partEvent=vcalendar.substring(vcalendar.indexOf('BEGIN:VEVENT')-2,vcalendar.indexOf('END:VEVENT')+'END:VEVENT'.length);
		eventArray[eventArray.length]=partEvent;
		vcalendar=vcalendar.replace(partEvent, '');
	}
	if(eventArray.length==0)
		console.log("Error: '"+inputEvent.id+"': unable to parse vEvent");

	for(var it=0;it<eventArray.length;it++)
	{
		// ------------------------------ VEVENT ------------------------------ //
		var vevent=eventArray[it];
		var vevent_full=vevent.split('\r\n');

		if(vevent==null)
			return false;

		//vcalendar=vcalendar.replace(vevent[0], '\r\n');

		//BEGIN
		if((parsed=('\r\nBEGIN:VEVENT\r\n').match(vCalendar.pre['contentline_parse']))==null)
			return false;
		//BEGIN, END VCALENDAR
		vCalendar.tplM['beginVEVENT'][0]=vCalendar.tplC['beginVEVENT'].replace(/##:::##group_wd##:::##/g, vcalendar_begin_group=parsed[1]);
		// parsed (contentline_parse)=[1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
		if((parsed=('\r\n'+vcalendar_full[vevent_full.length-2]+'\r\n').match(vCalendar.pre['contentline_parse']))==null)
			return false;
		// values not directly supported by the editor (old values are kept intact)
		vCalendar.tplM['endVEVENT'][0]=vCalendar.tplC['endVEVENT'].replace(/##:::##group_wd##:::##/g, vcalendar_end_group=parsed[1]);

		if(vcalendar_begin_group!=vcalendar_end_group)
			return false;// the vCalendar BEGIN and END "group" are different

		// remove the vCalendar BEGIN and END

		vevent='\r\n'+vevent_full.slice(2, vevent_full.length-1).join('\r\n')+'\r\n';
		//SUMMARY
		vcalendar_element=vevent.match(RegExp('\r\n'+vCalendar.re['contentline_SUMMARY'], 'mi'));
		if(vcalendar_element!=null)
		{
			parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
			//note=String(vcalendar_element).split(':')[1];
			title=vcalendarUnescapeValue(parsed[4]);
			vCalendar.tplM['contentline_SUMMARY'][0]=vCalendar.tplC['contentline_SUMMARY'];
			vCalendar.tplM['contentline_SUMMARY'][0]=vCalendar.tplM['contentline_SUMMARY'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
			vCalendar.tplM['contentline_SUMMARY'][0]=vCalendar.tplM['contentline_SUMMARY'][0].replace(/##:::##params_wsc##:::##/g, parsed[3]);
			vevent=vevent.replace(vcalendar_element[0], '\r\n');

			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while ((vcalendar_element_related=vevent.match(re))!=null)
				{
					// append the parameter to its parent
					vCalendar.tplM['contentline_SUMMARY'][0]+=vcalendar_element_related[0].substr(2);
					// remove the processed parameter
					vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
				}
			}
		}

		vcalendar_element=vevent.match(RegExp('\r\n'+vCalendar.re['contentline_TRANSP'], 'mi'));
		if(vcalendar_element!=null)
		{
			parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
			//note=String(vcalendar_element).split(':')[1];
			title=vcalendarUnescapeValue(parsed[4]);
			vCalendar.tplM['contentline_TRANSP'][0]=vCalendar.tplC['contentline_TRANSP'];
			vCalendar.tplM['contentline_TRANSP'][0]=vCalendar.tplM['contentline_TRANSP'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
			vCalendar.tplM['contentline_TRANSP'][0]=vCalendar.tplM['contentline_TRANSP'][0].replace(/##:::##params_wsc##:::##/g, parsed[3]);
			vevent=vevent.replace(vcalendar_element[0], '\r\n');

			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while ((vcalendar_element_related=vevent.match(re))!=null)
				{
					// append the parameter to its parent
					vCalendar.tplM['contentline_TRANSP'][0]+=vcalendar_element_related[0].substr(2);
					// remove the processed parameter
					vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
				}
			}
		}

		vcalendar_element=vevent.match(RegExp('\r\n'+vCalendar.re['contentline_PRIORITY'], 'mi'));
		if(vcalendar_element!=null)
		{
			parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);

			//note=String(vcalendar_element).split(':')[1];
			title=vcalendarUnescapeValue(parsed[4]);

			vCalendar.tplM['contentline_PRIORITY'][0]=vCalendar.tplC['contentline_PRIORITY'];
			vCalendar.tplM['contentline_PRIORITY'][0]=vCalendar.tplM['contentline_PRIORITY'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
			vCalendar.tplM['contentline_PRIORITY'][0]=vCalendar.tplM['contentline_PRIORITY'][0].replace(/##:::##params_wsc##:::##/g, parsed[3]);

			vevent=vevent.replace(vcalendar_element[0], '\r\n');

			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while ((vcalendar_element_related=vevent.match(re))!=null)
				{
					// append the parameter to its parent
					vCalendar.tplM['contentline_PRIORITY'][0]+=vcalendar_element_related[0].substr(2);
					// remove the processed parameter
					vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
				}
			}
		}

		//LOCATION
		vcalendar_element=vevent.match(RegExp('\r\n'+vCalendar.re['contentline_LOCATION'], 'mi'));
		if(vcalendar_element!=null)
		{
			parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
			//note=String(vcalendar_element).split(':')[1];
			title=vcalendarUnescapeValue(parsed[4]);
			vCalendar.tplM['contentline_LOCATION'][0]=vCalendar.tplC['contentline_LOCATION'];
			vCalendar.tplM['contentline_LOCATION'][0]=vCalendar.tplM['contentline_LOCATION'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
			vCalendar.tplM['contentline_LOCATION'][0]=vCalendar.tplM['contentline_LOCATION'][0].replace(/##:::##params_wsc##:::##/g, parsed[3]);
			vevent=vevent.replace(vcalendar_element[0], '\r\n');

			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while ((vcalendar_element_related=vevent.match(re))!=null)
				{
					// append the parameter to its parent
					vCalendar.tplM['contentline_LOCATION'][0]+=vcalendar_element_related[0].substr(2);
					// remove the processed parameter
					vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
				}
			}
		}

		//URL
		vcalendar_element=vevent.match(RegExp('\r\n'+vCalendar.re['contentline_URL'], 'mi'));
		if(vcalendar_element!=null)
		{
			parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
			//note=String(vcalendar_element).split(':')[1];
			title=vcalendarUnescapeValue(parsed[4]);
			vCalendar.tplM['contentline_URL'][0]=vCalendar.tplC['contentline_URL'];
			vCalendar.tplM['contentline_URL'][0]=vCalendar.tplM['contentline_URL'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
			vCalendar.tplM['contentline_URL'][0]=vCalendar.tplM['contentline_URL'][0].replace(/##:::##params_wsc##:::##/g, parsed[3]);
			vevent=vevent.replace(vcalendar_element[0], '\r\n');

			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while ((vcalendar_element_related=vevent.match(re))!=null)
				{
					// append the parameter to its parent
					vCalendar.tplM['contentline_URL'][0]+=vcalendar_element_related[0].substr(2);
					// remove the processed parameter
					vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
				}
			}
		}

		// ------------------------------ VALARM ------------------------------ //
		var valarm=vevent.match(vCalendar.pre['valarm']);
		if(valarm!=null)
		{
			vevent=vevent.replace(valarm[0], '');
			var alarmString='';
			var alarmArray=new Array();

			for(var i=0;i<valarm[0].length;i++)
			{
				if(valarm[0].substring(i-'END:VALARM'.length, i)=='END:VALARM')
				{
					alarmArray[alarmArray.length]=alarmString+'\r\n';
					alarmString='';
				}
				alarmString+=valarm[0][i];
			}

			for(var j=0;j<alarmArray.length;j++)
			{
				checkA=alarmArray[j].match(vCalendar.re['valarm']);
				if(checkA!=null)
				{
					var valarm_full=checkA[0].split('\r\n');

					//BEGIN
					if((parsed=('\r\n'+valarm_full[0]+'\r\n').match(vCalendar.pre['contentline_parse']))==null)
						return false;

					//BEGIN, END VCALENDAR
					vCalendar.tplM['beginVALARM'][j]=vCalendar.tplC['beginVALARM'].replace(/##:::##group_wd##:::##/g, vcalendar_begin_group=parsed[1]);

					// parsed (contentline_parse)=[1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
					if((parsed=('\r\n'+valarm_full[valarm_full.length-2]+'\r\n').match(vCalendar.pre['contentline_parse']))==null)
						return false;

					// values not directly supported by the editor (old values are kept intact)
					vCalendar.tplM['endVALARM'][j]=vCalendar.tplC['endVALARM'].replace(/##:::##group_wd##:::##/g, vcalendar_end_group=parsed[1]);

					if(vcalendar_begin_group!=vcalendar_end_group)
						return false;// the vCalendar BEGIN and END "group" are different

					// remove the vCalendar BEGIN and END
					alarmArray[j]='\r\n'+valarm_full.slice(1, valarm_full.length-2).join('\r\n')+'\r\n';

					trigger=alarmArray[j].match(vCalendar.pre['contentline_TRIGGER']);

					if(trigger!=null)
					{
						parsed=(trigger[0]+'\r\n').match(vCalendar.pre['contentline_parse']);

						vCalendar.tplM['contentline_TRIGGER'][j]=vCalendar.tplC['contentline_TRIGGER'];
						vCalendar.tplM['contentline_TRIGGER'][j]=vCalendar.tplM['contentline_TRIGGER'][j].replace(/##:::##group_wd##:::##/g, parsed[1]);
						var pars=vcalendarSplitParam(parsed[3]);
						var parString='';
						for(var i=0;i<pars.length;i++)
						{
							if((pars[i]!='VALUE=DATE-TIME') && (pars[i]!='VALUE=DURATION') && (pars[i]!=''))
								parString+=';'+pars[i];
						}
						vCalendar.tplM['contentline_TRIGGER'][j]=vCalendar.tplM['contentline_TRIGGER'][j].replace(/##:::##params_wsc##:::##/g, parString);
						alarmArray[j]=alarmArray[j].replace(trigger[0], '');
						if(parsed[1]!='')
						{
							var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
							while ((vcalendar_element_related=vevent.match(re))!=null)
							{
								// append the parameter to its parent
								vCalendar.tplM['contentline_TRIGGER'][j]+=vcalendar_element_related[0].substr(2);
								// remove the processed parameter
								vevent=vevent.replace(vcalendar_element_related[0], '');
							}
						}
					}
					note=alarmArray[j].match(vCalendar.pre['contentline_NOTE']);
					if(note!=null)
					{
						parsed=note[0].match(vCalendar.pre['contentline_parse']);
						vCalendar.tplM['contentline_VANOTE'][j]=vCalendar.tplC['contentline_VANOTE'];
						vCalendar.tplM['contentline_VANOTE'][j]=vCalendar.tplM['contentline_VANOTE'][j].replace(/##:::##group_wd##:::##/g, parsed[1]);
						vCalendar.tplM['contentline_VANOTE'][j]=vCalendar.tplM['contentline_VANOTE'][j].replace(/##:::##params_wsc##:::##/g, parsed[3]);
						alarmArray[j]=alarmArray[j].replace(note[0], '\r\n');
						if(parsed[1]!='')
						{
							var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
							while ((vcalendar_element_related=vevent.match(re))!=null)
							{
								// append the parameter to its parent
								vCalendar.tplM['contentline_VANOTE'][0]+=vcalendar_element_related[0].substr(2);
								// remove the processed parameter
								vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
							}
						}
					}
					action=(alarmArray[j]).match(vCalendar.pre['contentline_ACTION']);

					if(action!=null)
					{
						parsed=action[0].match(vCalendar.pre['contentline_parse']);
						vCalendar.tplM['contentline_ACTION'][j]=vCalendar.tplC['contentline_ACTION'];
						vCalendar.tplM['contentline_ACTION'][j]=vCalendar.tplM['contentline_ACTION'][j].replace(/##:::##group_wd##:::##/g, parsed[1]);
						vCalendar.tplM['contentline_ACTION'][j]=vCalendar.tplM['contentline_ACTION'][j].replace(/##:::##params_wsc##:::##/g, parsed[3]);
						alarmArray[j]=alarmArray[j].replace(action[0], '\r\n');

						if(parsed[1]!='')
						{
							var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
							while ((vcalendar_element_related=vevent.match(re))!=null)
							{
								// append the parameter to its parent
								vCalendar.tplM['contentline_ACTION'][0]+=vcalendar_element_related[0].substr(2);
								// remove the processed parameter
								vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
							}
						}
					}
					var checkUnprocess=$.trim(alarmArray[j]);

					if(checkUnprocess!='')
						vCalendar.tplM['unprocessedVALARM'][j]=alarmArray[j];
				}
			}
		}

		// NOTE
		vcalendar_element=vevent.match(vCalendar.pre['contentline_NOTE']);
		if(vcalendar_element!=null)
		{
			parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);

			vCalendar.tplM['contentline_NOTE'][0]=vCalendar.tplC['contentline_NOTE'];
			vCalendar.tplM['contentline_NOTE'][0]=vCalendar.tplM['contentline_NOTE'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
			vCalendar.tplM['contentline_NOTE'][0]=vCalendar.tplM['contentline_NOTE'][0].replace(/##:::##params_wsc##:::##/g, parsed[3]);

			vevent=vevent.replace(vcalendar_element[0], '\r\n');

			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while ((vcalendar_element_related=vevent.match(re))!=null)
				{
					// append the parameter to its parent
					vCalendar.tplM['contentline_NOTE'][0]+=vcalendar_element_related[0].substr(2);
					// remove the processed parameter
					vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
				}
			}
		}

		//CLASS
		vcalendar_element=vevent.match(vCalendar.pre['contentline_CLASS']);
		if(vcalendar_element!=null)
		{
			parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);

			vCalendar.tplM['contentline_CLASS'][0]=vCalendar.tplC['contentline_CLASS'];
			vCalendar.tplM['contentline_CLASS'][0]=vCalendar.tplM['contentline_CLASS'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
			vCalendar.tplM['contentline_CLASS'][0]=vCalendar.tplM['contentline_CLASS'][0].replace(/##:::##params_wsc##:::##/g, parsed[3]);
			vCalendar.tplM['contentline_CLASS'][0]=vCalendar.tplM['contentline_CLASS'][0].replace(/##:::##value##:::##/g, parsed[4]);

			vevent=vevent.replace(vcalendar_element[0], '\r\n');

			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while ((vcalendar_element_related=vevent.match(re))!=null)
				{
					// append the parameter to its parent
					vCalendar.tplM['contentline_CLASS'][0]+=vcalendar_element_related[0].substr(2);
					// remove the processed parameter
					vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
				}
			}
		}

		vcalendar_element=vevent.match(vCalendar.pre['contentline_STATUS']);
		if(vcalendar_element!=null)
		{
			parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
			title=vcalendarUnescapeValue(parsed[4]);

			vCalendar.tplM['contentline_STATUS'][0]=vCalendar.tplC['contentline_STATUS'];
			vCalendar.tplM['contentline_STATUS'][0]=vCalendar.tplM['contentline_STATUS'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
			vCalendar.tplM['contentline_STATUS'][0]=vCalendar.tplM['contentline_STATUS'][0].replace(/##:::##params_wsc##:::##/g, parsed[3]);

			vevent=vevent.replace(vcalendar_element[0], '\r\n');

			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while ((vcalendar_element_related=vevent.match(re))!=null)
				{
					// append the parameter to its parent
					vCalendar.tplM['contentline_STATUS'][0]+=vcalendar_element_related[0].substr(2);
					// remove the processed parameter
					vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
				}
			}
		}

		//RECURRENCE-ID
		var rec='';
		vcalendar_element=vevent.match(vCalendar.pre['contentline_RECURRENCE_ID']);
		if(vcalendar_element!=null)
		{
			parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
			var rec=parsed[4];
			vCalendar.tplM['contentline_REC_ID'][0]=vCalendar.tplC['contentline_REC_ID'];
			vCalendar.tplM['contentline_REC_ID'][0]=vCalendar.tplM['contentline_REC_ID'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
			var pars=vcalendarSplitParam(parsed[3]);
			var parString='';

			for(var i=0;i<pars.length;i++)
			{
				if((pars[i]!='VALUE=DATE') && (pars[i].indexOf('TZID=')==-1) && (pars[i]!=''))
					parString+=';'+pars[i];
			}

			vCalendar.tplM['contentline_REC_ID'][0]=vCalendar.tplM['contentline_REC_ID'][0].replace(/##:::##params_wsc##:::##/g, parString);
			vevent=vevent.replace(vcalendar_element[0], '\r\n');
			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while ((vcalendar_element_related=vevent.match(re))!=null)
				{
					// append the parameter to its parent
					vCalendar.tplM['contentline_REC_ID'][0]+=vcalendar_element_related[0].substr(2);
					// remove the processed parameter
					vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
				}
			}
		}
		if(rec=='')
			rec='orig';

		//EXDATE
		var i=-1;
		while(vevent.match(vCalendar.pre['contentline_EXDATE'])!= null)
		{
			i++;
			vcalendar_element=vevent.match(vCalendar.pre['contentline_EXDATE']);
			if(vcalendar_element!=null)
			{
				parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);

				vCalendar.tplM['contentline_EXDATE'][i]=vCalendar.tplC['contentline_EXDATE'];
				vCalendar.tplM['contentline_EXDATE'][i]=vCalendar.tplM['contentline_EXDATE'][i].replace(/##:::##group_wd##:::##/g, parsed[1]);
				var pars=vcalendarSplitParam(parsed[3]);
				var parString='', dateStr='';

				for(var j=0;j<pars.length;j++)
				{
					if(pars[j]!='VALUE=DATE' && pars[j]!='')
						parString+=';'+pars[j];
					if(pars[j]=='VALUE=DATE')
						dateStr=pars[j];
				}

				if(dateStr.indexOf('VALUE=DATE')!=-1)
					vCalendar.tplM['contentline_EXDATE'][i]=vCalendar.tplM['contentline_EXDATE'][i].replace(/##:::##AllDay##:::##/g, ';VALUE=DATE');
				else
					vCalendar.tplM['contentline_EXDATE'][i]=vCalendar.tplM['contentline_EXDATE'][i].replace(/##:::##AllDay##:::##/g, '');

				vCalendar.tplM['contentline_EXDATE'][i]=vCalendar.tplM['contentline_EXDATE'][i].replace(/##:::##TZID##:::##/g, '');
				vCalendar.tplM['contentline_EXDATE'][i]=vCalendar.tplM['contentline_EXDATE'][i].replace(/##:::##params_wsc##:::##/g, parString);
				vCalendar.tplM['contentline_EXDATE'][i]=vCalendar.tplM['contentline_EXDATE'][i].replace(/##:::##value##:::##/g,parsed[4]);
				vevent=vevent.replace(vcalendar_element[0], '\r\n');
				if(parsed[1]!='')
				{
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while ((vcalendar_element_related=vevent.match(re))!=null)
					{
						// append the parameter to its parent
						vCalendar.tplM['contentline_EXDATE'][i]+=vcalendar_element_related[0].substr(2);
						// remove the processed parameter
						vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
					}
				}
			}
		}
		//END

		vcalendar_element=vevent.match(vCalendar.pre['contentline_DTEND']);
		if(vcalendar_element!=null)
		{
			parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
			vCalendar.tplM['contentline_E_DTEND'][0]=vCalendar.tplC['contentline_E_DTEND'];
			vCalendar.tplM['contentline_E_DTEND'][0]=vCalendar.tplM['contentline_E_DTEND'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
			var pars=vcalendarSplitParam(parsed[3]);
			var parString='';

			for(var i=0;i<pars.length;i++)
			{
				if((pars[i]!='VALUE=DATE') && (pars[i].indexOf('TZID=')==-1) && (pars[i]!=''))
					parString+=';'+pars[i];
			}

			vCalendar.tplM['contentline_E_DTEND'][0]=vCalendar.tplM['contentline_E_DTEND'][0].replace(/##:::##params_wsc##:::##/g, parString);
			vevent=vevent.replace(vcalendar_element[0], '\r\n');
			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while ((vcalendar_element_related=vevent.match(re))!=null)
				{
					// append the parameter to its parent
					vCalendar.tplM['contentline_E_DTEND'][0]+=vcalendar_element_related[0].substr(2);
					// remove the processed parameter
					vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
				}
			}
		}

		//START
		vcalendar_element=vevent.match(vCalendar.pre['contentline_DTSTART']);
		if(vcalendar_element!=null)
		{
			parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
			vCalendar.tplM['contentline_E_DTSTART'][0]=vCalendar.tplC['contentline_E_DTSTART'];
			vCalendar.tplM['contentline_E_DTSTART'][0]=vCalendar.tplM['contentline_E_DTSTART'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
			var pars=vcalendarSplitParam(parsed[3]);
			var parString='';

			for(var i=0;i<pars.length;i++)
			{
				if((pars[i]!='VALUE=DATE') && (pars[i].indexOf('TZID=')==-1) && (pars[i]!=''))
					parString+=';'+pars[i];
			}
			vCalendar.tplM['contentline_E_DTSTART'][0]=vCalendar.tplM['contentline_E_DTSTART'][0].replace(/##:::##params_wsc##:::##/g, parString);
			vevent=vevent.replace(vcalendar_element[0], '\r\n');
			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while ((vcalendar_element_related=vevent.match(re))!=null)
				{
					// append the parameter to its parent
					vCalendar.tplM['contentline_E_DTSTART'][0]+=vcalendar_element_related[0].substr(2);
					// remove the processed parameter
					vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
				}
			}
		}

		//RRULE
		vcalendar_element=vevent.match(vCalendar.pre['contentline_RRULE2']);
		if(vcalendar_element!=null)
		{
			parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
			vCalendar.tplM['contentline_RRULE'][0]=vCalendar.tplC['contentline_RRULE'];
			vCalendar.tplM['contentline_RRULE'][0]=vCalendar.tplM['contentline_RRULE'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
			var pars=parsed[4].split(';');
			var parString='';

			for(var i=0;i<pars.length;i++)
			{
				if((pars[i].indexOf('FREQ=')==-1) && (pars[i].indexOf('COUNT=')==-1) && (pars[i].indexOf('UNTIL=')==-1) && (pars[i]!='') && (pars[i].indexOf('INTERVAL=')==-1) && (pars[i].indexOf('BYDAY=')==-1)
				&& (pars[i].indexOf('BYMONTHDAY=')==-1) && (pars[i].indexOf('BYMONTH=')==-1) && (pars[i].indexOf('WKST=')==-1))
					parString+=';'+pars[i];
			}
			vCalendar.tplM['contentline_RRULE'][0]=vCalendar.tplM['contentline_RRULE'][0].replace(/##:::##params_wsc##:::##/g, parsed[3]);
			vCalendar.tplM['contentline_RRULE'][0]=vCalendar.tplM['contentline_RRULE'][0].replace(/##:::##value##:::##/g, '##:::##value##:::##'+parString);
			vevent=vevent.replace(vcalendar_element[0], '\r\n');
			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while ((vcalendar_element_related=vevent.match(re))!=null)
				{
					// append the parameter to its parent
					vCalendar.tplM['contentline_RRULE'][0]+=vcalendar_element_related[0].substr(2);
					// remove the processed parameter
					vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
				}
			}
		}

		//UID
		vcalendar_element=inputEvent.vcalendar.match(RegExp('\r\n'+vCalendar.re['contentline_UID'], 'mi'));
		if(vcalendar_element!=null)
		{
			parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);

			vCalendar.tplM['contentline_UID'][0]=vCalendar.tplC['contentline_UID'];
			vCalendar.tplM['contentline_UID'][0]=vCalendar.tplM['contentline_UID'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
			vCalendar.tplM['contentline_UID'][0]=vCalendar.tplM['contentline_UID'][0].replace(/##:::##params_wsc##:::##/g, parsed[3]);
			vCalendar.tplM['contentline_UID'][0]=vCalendar.tplM['contentline_UID'][0].replace(/##:::##uid##:::##/g,parsed[4]);
			vevent=vevent.replace(vcalendar_element[0], '\r\n');
			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while ((vcalendar_element_related=vevent.match(re))!=null)
				{
					// append the parameter to its parent
					vCalendar.tplM['contentline_UID'][0]+=vcalendar_element_related[0].substr(2);
					// remove the processed parameter
					vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
				}
			}
		}
		//CREATED
		vcalendar_element=vevent.match(RegExp('\r\n'+vCalendar.re['contentline_CREATED'], 'mi'));
		if(vcalendar_element!=null)
		{
			parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);

			vCalendar.tplM['contentline_CREATED'][rec]=vCalendar.tplC['contentline_CREATED'];
			vCalendar.tplM['contentline_CREATED'][rec]=vCalendar.tplM['contentline_CREATED'][rec].replace(/##:::##group_wd##:::##/g, parsed[1]);
			vCalendar.tplM['contentline_CREATED'][rec]=vCalendar.tplM['contentline_CREATED'][rec].replace(/##:::##params_wsc##:::##/g, parsed[3]);
			vCalendar.tplM['contentline_CREATED'][rec]=vCalendar.tplM['contentline_CREATED'][rec].replace(/##:::##value##:::##/g,parsed[4]);
			vevent=vevent.replace(vcalendar_element[0], '\r\n');
			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while ((vcalendar_element_related=vevent.match(re))!=null)
				{
					// append the parameter to its parent
					vCalendar.tplM['contentline_CREATED'][rec]+=vcalendar_element_related[0].substr(2);
					// remove the processed parameter
					vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
				}
			}
		}

		//LAST-MODIFIED
		vcalendar_element=vevent.match(RegExp('\r\n'+vCalendar.re['contentline_LM'], 'mi'));
		if(vcalendar_element!=null)
		{
			parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);

			vCalendar.tplM['contentline_LM'][0]=vCalendar.tplC['contentline_LM'];
			vCalendar.tplM['contentline_LM'][0]=vCalendar.tplM['contentline_LM'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
			vCalendar.tplM['contentline_LM'][0]=vCalendar.tplM['contentline_LM'][0].replace(/##:::##params_wsc##:::##/g, parsed[3]);
			vevent=vevent.replace(vcalendar_element[0], '\r\n');

			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while ((vcalendar_element_related=vevent.match(re))!=null)
				{
					// append the parameter to its parent
					vCalendar.tplM['contentline_LM'][0]+=vcalendar_element_related[0].substr(2);
					// remove the processed parameter
					vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
				}
			}
		}

		//DTSTAMP
		vcalendar_element=vevent.match(RegExp('\r\n'+vCalendar.re['contentline_DTSTAMP'], 'mi'));
		if(vcalendar_element!=null)
		{
			parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
			vCalendar.tplM['contentline_DTSTAMP'][0]=vCalendar.tplC['contentline_DTSTAMP'];
			vCalendar.tplM['contentline_DTSTAMP'][0]=vCalendar.tplM['contentline_DTSTAMP'][0].replace(/##:::##group_wd##:::##/g, parsed[1]);
			vCalendar.tplM['contentline_DTSTAMP'][0]=vCalendar.tplM['contentline_DTSTAMP'][0].replace(/##:::##params_wsc##:::##/g, parsed[3]);
			vevent=vevent.replace(vcalendar_element[0], '\r\n');

			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while ((vcalendar_element_related=vevent.match(re))!=null)
				{
					// append the parameter to its parent
					vCalendar.tplM['contentline_DTSTAMP'][0]+=vcalendar_element_related[0].substr(2);
					// remove the processed parameter
					vevent=vevent.replace(vcalendar_element_related[0], '\r\n');
				}
			}
		}
		if(vevent.indexOf('\r\n')==0)
		vevent=vevent.substring(2, vevent.length-2);

		if(vevent.lastIndexOf('\r\n')!=(vevent.length-2))
			vevent+='\r\n';

		vCalendar.tplM['unprocessedVEVENT'][rec]=vevent;
	}

	if(vcalendar.indexOf('\r\n')==0)
		vcalendar=vcalendar.substring(2, vcalendar.length-2);

	if(vcalendar.lastIndexOf('\r\n')!=(vcalendar.length-2))
		vcalendar+='\r\n';

	//if(vTimeZone!='')
	//	vcalendar+=vTimeZone;
	vCalendar.tplM['unprocessedVTIMEZONE']=vTimeZone;
	vCalendar.tplM['unprocessed']=vcalendar;
}

function parseAlarmWeek(value)
{
	var durValue='';
	var durChar='W';
	var toSecondsValue=60*60*24*7;

	value=value.substring(value.indexOf('P')+1);
	durValue=value.substring(0, value.indexOf(durChar));
	return durValue*toSecondsValue*1000+durChar;
}

function parseAlarmDay(value)
{
	var durValue='';
	var durChar='D';
	var toSecondsValue=60*60*24;
	var returnValue=0;

	value=value.substring(value.indexOf('P')+1);
	durValue=value.substring(0, value.indexOf(durChar));
	returnValue=durValue*toSecondsValue*1000;

	value=value.substring(value.indexOf(durChar+1));

	if(value.indexOf('T')!=-1)
	{
		durValue=parseAlarmTime(value);
		if(durValue)
		{
			durChar=durValue.substring(durValue.length-1);
			durValue=durValue.substring(0, durValue.length-1);
			returnValue+=durValue;
		}
	}
	return returnValue+durChar;
}

function parseAlarmTime(value)
{
	var durValue='';
	var durChar='';
	var toSecondsValue=0;
	var returnValue=0;

	value=value.substring(value.indexOf('T')+1);
	while(value!='')
	{
		if(value.indexOf('H')!=-1)
		{
			durChar='H';
			toSecondsValue=60*60;
		}
		else if(value.indexOf('M')!=-1)
		{
			durChar='M';
			toSecondsValue=60;
		}
		else if(value.indexOf('S')!=-1)
		{
			durChar='S';
			toSecondsValue=1;
		}
		durValue=value.substring(0, value.indexOf(durChar))
		value=value.substring(value.indexOf(durChar)+1);
		returnValue+=durValue*toSecondsValue;
	}
	if(durChar!='')
		return returnValue*1000+durChar;
	else
		return false;
}

function getDateFromDay(objComponent, t, disableRecursion,uid)
{
	var daylightStartsMonth=objComponent.startMonth-1,
	daylightStartsDay=objComponent.startDay,
	daylightStartCount=objComponent.startCount,
	daylightStartsHours=objComponent.dtStart.parseComnpactISO8601(uid).getHours(),
	daylightStartsMinutes=objComponent.dtStart.parseComnpactISO8601().getMinutes();
	//daylightStartsDay++;
	if(daylightStartsDay==7)
		daylightStartsDay=0;
	var checkDate=new Date(t.getFullYear(), daylightStartsMonth,1,23,59,0);
	if(disableRecursion)
		checkDate.setFullYear(checkDate.getFullYear()-1);

	var firstOfMonthDayOfWeek=checkDate.getDay();
	if(firstOfMonthDayOfWeek!=daylightStartsDay)
	{
		var daysUntilFirst=(1+daylightStartsDay-firstOfMonthDayOfWeek)%7;
		if(daysUntilFirst<=0)
			checkDate.setDate(daysUntilFirst+7);
		else
			checkDate.setDate(daysUntilFirst);
	}

	if(daylightStartCount>0)
	{
		var daysUntilDaylight=(parseInt(daylightStartCount)-1)*7;
		var dayLightStartDate=new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate()+daysUntilDaylight, daylightStartsHours, daylightStartsMinutes);
	}
	else
	{
		var tmpLastDay=21+checkDate.getDate();
		var checkTmpDay=new Date(t.getFullYear(),daylightStartsMonth,tmpLastDay+7,23,59,0);

		if(checkTmpDay.getMonth()!=daylightStartsMonth)
			var lastDay=tmpLastDay;
		else
			var lastDay=tmpLastDay+7;

		var daysUntilDaylight=(daylightStartCount+1)*7;
		var dayLightStartDate=new Date(checkDate.getFullYear(), checkDate.getMonth(), lastDay+daysUntilDaylight, daylightStartsHours, daylightStartsMinutes);
	}

	if(dayLightStartDate>t && !disableRecursion)
		dayLightStartDate=getDateFromDay(objComponent, t, true).startDate;

	return {offsetFrom:objComponent.tzOffsetFROM, offsetTo: objComponent.tzOffsetTO, startDate: dayLightStartDate};
}

	function vcalendarToData(inputCollection, inputEvent, isNew)
{
		var vcalendarOrig=inputEvent.vcalendar;
		var eventArray=new Array();

		//CHECK CALSCALE
		var elem=vcalendarOrig.match(vCalendar.pre['contentline_CALSCALE']);
		if(elem!=null)
		{
			calscale=elem[0].match(vCalendar.pre['contentline_parse'])[4];
			if(calscale!='GREGORIAN')
			{
				console.log("Error:'"+inputEvent.uid+"': Unsupported calscale in:"+vcalendarOrig);
				return false;
			}
		}
		//CHECK VERSION
		var elemV=vcalendarOrig.match(vCalendar.pre['contentline_VERSION']);
		if(elemV!=null)
		{
			var ver=elemV[0].match(vCalendar.pre['contentline_parse'])[4];
			if(ver!='2.0')
			{
				console.log("Error:'"+inputEvent.uid+"': Unsupported version ("+ver+") in:"+vcalendarOrig);
				return false;
			}
		}

		//FIX TIMEZONE
		var beginTimeZone=vcalendarOrig.indexOf('BEGIN:VTIMEZONE');
		var startEndTimeZone=vcalendarOrig.lastIndexOf('END:VTIMEZONE');
		var endTimeZone=0;

		var rid=inputEvent.uid.substring(0, inputEvent.uid.lastIndexOf('/')+1);
		var evid=inputEvent.uid.substring(inputEvent.uid.lastIndexOf('/')+1, inputEvent.uid.length);

		var isChange=false,
		needReload=false;

		if(!isNew)
		{
			var events=findEventInArray(inputEvent.uid, true);
			if(events!='')
			{
				if(events.etag!=inputEvent.etag)
				{
					for(var i=0; i<events.alertTimeOut.length; i++)
						clearTimeout(events.alertTimeOut[i]);
					deleteEventFromArray(inputEvent.uid);

					if($('#show').val()!='')
					{
						if($('#show').val()==inputEvent.uid)
						{
							if($('#repeatEvent').val()=="true" || $('#recurrenceID').val()!='')
							{
								var name=globalCalEvent.title;
								showEventForm(null, null, {title: name, id:inputEvent.uid}, globalJsEvent, 'show','', true);
								$('#editAll').css('visibility','hidden');
								$('#editFuture').css('visibility','hidden');
								$('#editOnlyOne').css('visibility','hidden');
								$('#repeatConfirmBoxContent').html('<b>'+name+"</b> "+localization[globalInterfaceLanguage].repeatChangeTxt);
								$('#repeatConfirmBoxQuestion').html(localization[globalInterfaceLanguage].repeatChangeTxtClose);
							}
							else
								needReload=true;
						}
					}
					isChange=true;
				}
			}
		}

		if((beginTimeZone!=-1) && (startEndTimeZone!=-1))
		{
			for(i=(startEndTimeZone+2);i<vcalendarOrig.length;i++)
			{
				if(vcalendarOrig.charAt(i)=='\n')
				{
					endTimeZone=i+1;
					break;
				}
			}
			vTimeZone=vcalendarOrig.substring(beginTimeZone, endTimeZone);
			vcalendar=vcalendarOrig.substring(0, beginTimeZone)+vcalendarOrig.substring(endTimeZone, vcalendarOrig.length);
		}

		/*
		vcalendar_element=vcalendar.match(vCalendar.pre['tzone']);
		if(vcalendar_element!=null)
			vcalendar=vcalendar.replace(vcalendar_element[0],'');
		*/
		var recurrence_id_array=new Array();
		while(vcalendarOrig.match(vCalendar.pre['vevent'])!=null)
		{
			if(vcalendarOrig.substring(vcalendarOrig.indexOf('BEGIN:VEVENT')-2, vcalendarOrig.indexOf('BEGIN:VEVENT'))=='\r\n')
			{
				var partEvent=vcalendarOrig.substring(vcalendarOrig.indexOf('BEGIN:VEVENT')-2,vcalendarOrig.indexOf('END:VEVENT')+'END:VEVENT'.length);
				vcalendarOrig=vcalendarOrig.replace(partEvent, '');
			}
			else
			{
				var partEvent=vcalendarOrig.substring(vcalendarOrig.indexOf('BEGIN:VEVENT'),vcalendarOrig.indexOf('END:VEVENT')+'END:VEVENT'.length);
				vcalendarOrig=vcalendarOrig.replace(partEvent, '');
				partEvent+='\r\n';
			}
			var rec_array=partEvent.match(vCalendar.pre['contentline_RECURRENCE_ID']);
			var uidString=partEvent.match(vCalendar.pre['contentline_UID']);

			if(uidString!=null && rec_array!=null)
			{
				recurrence_id_array[recurrence_id_array.length]=rec_array[0].match(vCalendar.pre['contentline_parse'])[4]+';'+uidString[0].match(vCalendar.pre['contentline_parse'])[4];
			}
			eventArray[eventArray.length]=partEvent;
		}
		if(eventArray.length==0)
			console.log("Error: '"+inputEvent.uid+"': unable to parse vEvent");

		for(var evIt=0; evIt<eventArray.length; evIt++)
		{
			var oo='',
			note='',
			start='',
			end='',
			title='',
			location='',
			all=false,
			frequency='',
			interval='',
			byMonthDay='',
			byDay='',
			until='',
			isUntilDate=false,
			isRepeat=false,
			alertTime=new Array(),
			alertNote=new Array(),
			alertTimeOut=new Array(),
			valOffsetFrom='',
			valOffsetTo='',
			intOffset=0,
			tzName='local',
			realStart='',
			realEnd='',
			rec_id='',
			wkst='',
			classType='',
			avail='',
			hrefUrl='',
			returnForValue = true,
			stringUID='',
			priority="0",
			status='',
			pars=new Array();
			var dtStartTimezone='';
			var dates = new Array();
			var vcalendar=eventArray[evIt];
			var stringUID=vcalendar.match(vCalendar.pre['contentline_UID']);
			if(stringUID!=null)
				stringUID=stringUID[0].match(vCalendar.pre['contentline_parse'])[4];

			var exDates=new Array();
			var exDate=null;
			var exDate_array=new Array();
			var vcalendar2=vcalendar+'';

			while(vcalendar2.match(vCalendar.pre['contentline_EXDATE'])!= null)
			{
				exDate=vcalendar2.match(vCalendar.pre['contentline_EXDATE']);
				exDate_array[exDate_array.length]=exDate[0];
				vcalendar2=vcalendar2.replace(exDate,'\r\n');
			}

			vcalendar_element=vcalendar.match(vCalendar.pre['contentline_RRULE2']);
			if(vcalendar_element!=null)
			{
				parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
				// || ((parsed[4].indexOf('FREQ=MONTHLY')!=-1||parsed[4].indexOf('FREQ=YEARLY')!=-1)&&parsed[4].indexOf('BYDAY')!=-1)&&parsed[4].search('[0-9]')==-1)
//				if(parsed[4].indexOf('BYSETPOS')!=-1 || parsed[4].indexOf('BYWEEKNO')!=-1)
//				{
//					console.log("Error:'"+inputEvent.uid+"': Unsupported recurrence rule in event:"+vcalendar);
//					return false;
//				}
				pars=parsed[4].split(';');
				var parString='';

				if(pars.length>0)
					isRepeat=true;
				for(var i=0;i<pars.length;i++)
				{
					if(pars[i].indexOf('FREQ=')!=-1)
						frequency=pars[i].split('=')[1];
					else if(pars[i].indexOf('INTERVAL=')!=-1)
						interval=pars[i].split('=')[1];
					else if(pars[i].indexOf('COUNT=')!=-1)
					{
						until=pars[i].split('=')[1];
						if(until==0)
						{
							returnForValue = false;
							break
						}
						else if(isNaN(until))
						{
								returnForValue = false;
								break
						}
					}
					else if(pars[i].indexOf('UNTIL=')!=-1)
					{
						isUntilDate=true;
						until=pars[i].split('=')[1];
						//if(until.indexOf('T')==-1)
//							until+='T000000Z';

					}
					else if(pars[i].indexOf('WKST=')!=-1)
					{
						wkst=pars[i].split('=')[1].replace(/\d*MO/,1).replace(/\d*TU/,2).replace(/\d*WE/,3).replace(/\d*TH/,4).replace(/\d*FR/,5).replace(/\d*SA/,6).replace(/\d*SU/,0);
						if(globalSettings.mozillasupport.value!=null && globalSettings.mozillasupport.value)
							wkst='';
					}
 					else if(pars[i].indexOf('BYMONTHDAY=')!=-1)
						byMonthDay=pars[i].split('=')[1];
					else if(pars[i].indexOf('BYDAY=')!=-1)
					{
						byDay=pars[i].split('=')[1];
						byDay=byDay.replace(/\d*MO/,1).replace(/\d*TU/,2).replace(/\d*WE/,3).replace(/\d*TH/,4).replace(/\d*FR/,5).replace(/\d*SA/,6).replace(/\d*SU/,0).split(',');
//						if(byDay.length>1 &&(frequency=='MONTHLY'||frequency=='YEARLY'))
//						{
//							console.log("Error:'"+inputEvent.uid+"': Unsupported recurrence rule in event:"+vcalendar);
//							return false;
//						}
					}
				}
				if(!returnForValue)
				{

					continue;
				}
				if(!interval)
					interval=1;
			}

			var dayLightStartDate, dayLightEndDate, tzObject;
			vcalendar_element=vcalendar.match(vCalendar.pre['contentline_DTSTART']);
			if(vcalendar_element!=null)
			{
				parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);

				start=parsed[4];
				var help1=start;

				if(help1.indexOf("T")==-1)
				{
					help1=help1.substring(0, 4)+'-'+help1.substring(4, 6)+'-'+help1.substring(6, 8);
					all=true;
				}
				else
				{
					help1=help1.substring(0, 4)+'-'+help1.substring(4, 6)+'-'+help1.substring(6, 8)+'T'+help1.substring(9, 11)+':'+help1.substring(11, 13)+':'+help1.substring(13, 15);
					all=false;
				}

				var t=$.fullCalendar.parseDate(help1);
				if(t==null)
					return false;
				if(t.toString()=='Invalid Date')
					return false;

				if(!all)
				{
					parsed_value=vcalendarSplitParam(parsed[3]);
					for(h=1;h<parsed_value.length;h++)
						if(parsed_value[h]!='')
							dtStartTimezone=parsed_value[h];
					dtStartTimezone=dtStartTimezone.split('=')

					if(start.charAt(start.length-1)=='Z')
						tzName='UTC';
					if(dtStartTimezone.length>1 || tzName=='UTC')
					{
						if(tzName!='UTC')
							tzName=$.trim(dtStartTimezone[1]);
						var finTZ = checkTimezone(tzName);
						if(finTZ!=null)
							tzName = finTZ;
						if(globalSettings.timezonesupport.value && tzName in timezones)
						{
							valOffsetFrom=getOffsetByTZ(tzName, t);
							intOffset=(getLocalOffset(t)*-1*1000)-valOffsetFrom.getSecondsFromOffset()*1000;
						}
					}
					else if(processedTimezones.indexOf(tzName)==-1)
					{
						if(timeZonesEnabled.indexOf(tzName)==-1)
						timeZonesEnabled.push('local');
						processedTimezones.push('local');
					}
					if(tzName!='' && tzName != 'local')
						if(processedTimezones.indexOf(tzName)==-1)
						{
							if(timeZonesEnabled.indexOf(tzName)==-1)
							timeZonesEnabled.push(tzName);
							processedTimezones.push(tzName);
						}
				}
				else
					tzName = globalSessionTimeZone;
				realStart=$.fullCalendar.parseDate(help1);
				inputEvent.start=$.fullCalendar.parseDate(help1);
				start=$.fullCalendar.parseDate(help1);
				if(intOffset)
				{
					inputEvent.start.setTime(inputEvent.start.getTime()+intOffset);
					start.setTime(start.getTime()+intOffset);
				}
				if(exDate_array!=null)
					for(var j=0;j<exDate_array.length;j++)
					{
						var exString=(exDate_array[j]+'\r\n').match(vCalendar.pre['contentline_parse'])[4];
						if(exString.indexOf('T')!=-1 && exString.indexOf('Z')!=-1)
							var utcTime=exString.parseComnpactISO8601().setSeconds(getLocalOffset(exString.parseComnpactISO8601())*-1);
						else if(exString.indexOf('T')!=-1 && exString.indexOf('Z')==-1)
							var utcTime=exString.parseComnpactISO8601();
						else
						{
							if(help1.indexOf('T')!=-1)
								exString += 'T' + $.fullCalendar.formatDate(start,'HHmmss');

							var utcTime=exString.parseComnpactISO8601();
						}
						exDates[exDates.length]=new Date(utcTime).toString();
					}
				var valarm=vcalendar.match(vCalendar.pre['valarm']);
				if(valarm!=null)
				{
					vcalendar=vcalendar.replace(valarm[0], '');
					var alarmString='';
					var alarmArray=new Array();
					for(var i=0;i<valarm[0].length;i++)
					{
						if(valarm[0].substring(i-'END:VALARM'.length, i)=='END:VALARM')
						{
							alarmArray[alarmArray.length]=alarmString+'\r\n';
							alarmString='';
						}
						alarmString+=valarm[0][i];
					}

					for(var j=0;j<alarmArray.length;j++)
					{
						checkA=alarmArray[j].match(vCalendar.re['valarm']);
						if(checkA!=null)
						{
							action=(alarmArray[j]).match(vCalendar.pre['contentline_ACTION']);
							if(action!=null)
								parsed=action[0].match(vCalendar.pre['contentline_parse']);
							else
								break;

							trigger=alarmArray[j].match(vCalendar.pre['contentline_TRIGGER']);
							if(trigger!=null)
							{
								parsed=(trigger[0]+'\r\n').match(vCalendar.pre['contentline_parse']);
								if(parsed!=null)
								{
									value=parsed[4];
									var checkD=value.match(vCalendar.pre['date-time-value']);
									var intOffsetA='';
									var tzNameA='';
									if(checkD!=null)
									{
										if(parsed[3])
											var dtStartTimezoneA=parsed[3].split('=');
										var alarmTimeA=$.fullCalendar.parseDate(value.substring(0, 4)+'-'+value.substring(4, 6)+'-'+value.substring(6, 8)+'T'+value.substring(9, 11)+':'+value.substring(11, 13)+':'+value.substring(13, 15));
										if(value.charAt(value.length-1)=='Z')
											tzNameA='UTC';
										if(dtStartTimezoneA.length>1 || tzNameA=='UTC')
										{
											if(tzNameA!='UTC' && dtStartTimezoneA[0]==';TZID')
												tzNameA=$.trim(dtStartTimezoneA[1]);
											var finTZ = checkTimezone(tzNameA);
											if(finTZ!=null)
												tzNameA = finTZ;
											if(globalSettings.timezonesupport.value && tzNameA in timezones)
											{
												var valOffsetFromA=getOffsetByTZ(tzNameA, alarmTimeA);
												intOffsetA=getOffsetByTZ(tzName, alarmTimeA).getSecondsFromOffset()*1000-valOffsetFromA.getSecondsFromOffset()*1000;
											}
										}
										else if(processedTimezones.indexOf(tzName)==-1)
										{
											if(timeZonesEnabled.indexOf(tzName)==-1)
											timeZonesEnabled.push('local');
											processedTimezones.push('local');
										}
										if(tzNameA!='' && tzNameA != 'local')
											if(processedTimezones.indexOf(tzNameA)==-1)
											{
												if(timeZonesEnabled.indexOf(tzNameA)==-1)
												timeZonesEnabled.push(tzNameA);
												processedTimezones.push(tzNameA);
											}
										if(intOffsetA!='')
											alarmTimeA.setTime(alarmTimeA.getTime()+intOffsetA);
										alertTime[j]=$.fullCalendar.formatDate(alarmTimeA,"yyyy-MM-dd'T'HH:mm:ss");
									}
									else
									{
										alertTime[j]=0;
										if(value.indexOf('W')!=-1)
											alertTime[j]=parseAlarmWeek(value);
										else if(value.indexOf('D')!=-1)
											alertTime[j]=parseAlarmDay(value);
										else if(value.indexOf('T')!=-1)
											alertTime[j]=parseAlarmTime(value);
										if(parsed[4].charAt(0)=="-")
											alertTime[j]="-"+alertTime[j];
										else
											alertTime[j]="+"+alertTime[j];
									}
								}
							}
							else
								break;

							noteA=alarmArray[j].match(vCalendar.pre['contentline_NOTE']);
							if(noteA!=null)
							{
								parsed=noteA[0].match(vCalendar.pre['contentline_parse']);
								alertNote[j]=parsed[4];
							}
							else
								alertNote[j]='Default note';
						}
					}
				}

				vcalendar_element=vcalendar.match(vCalendar.pre['contentline_LOCATION']);
				if(vcalendar_element!=null)
				{
					parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
					location=vcalendarUnescapeValue(parsed[4]);
				}

				vcalendar_element=vcalendar.match(vCalendar.pre['contentline_NOTE']);
				if(vcalendar_element!=null)
				{
					parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
					note=vcalendarUnescapeValue(parsed[4]);
				}

				vcalendar_element=vcalendar.match(vCalendar.pre['contentline_SUMMARY']);
				if(vcalendar_element!=null)
				{
					parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
					title=vcalendarUnescapeValue(parsed[4]);
				}

				vcalendar_element=vcalendar.match(vCalendar.pre['contentline_PRIORITY']);
				if(vcalendar_element!=null)
				{
					parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
					priority=vcalendarUnescapeValue(parsed[4]);
				}

				var index=0;
				for(var p=0;p<globalResourceCalDAVList.collections.length;p++)
					if(typeof globalResourceCalDAVList.collections[p].uid !='undefined' && globalResourceCalDAVList.collections[p].uid==inputCollection.uid)
					{
						index=p;
						break;
					}
				var firstPart=index.pad(String(globalResourceCalDAVList.collections.length).length);

				var compareString=(firstPart + title).toLowerCase();


				vcalendar_element=vcalendar.match(vCalendar.pre['contentline_CLASS']);
				if(vcalendar_element!=null)
				{
					parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
					classType=vcalendarUnescapeValue(parsed[4]);
				}

				vcalendar_element=vcalendar.match(vCalendar.pre['contentline_STATUS']);
				if(vcalendar_element!=null)
				{
					parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
					status=vcalendarUnescapeValue(parsed[4]);
				}

				vcalendar_element=vcalendar.match(vCalendar.pre['contentline_TRANSP']);
				if(vcalendar_element!=null)
				{
					parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
					avail=vcalendarUnescapeValue(parsed[4]);
				}

				vcalendar_element=vcalendar.match(vCalendar.pre['contentline_URL']);
				if(vcalendar_element!=null)
				{
					parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
					hrefUrl=vcalendarUnescapeValue(parsed[4]);
				}

				vcalendar_element=vcalendar.match(vCalendar.pre['contentline_RECURRENCE_ID']);
				if(vcalendar_element!=null)
				{
					parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
					var rec=parsed[4];
					/*if(rec.indexOf("T")==-1)
					{
						rec=rec.substring(0, 4)+'/'+rec.substring(4, 6)+'/'+rec.substring(6, 8);
						var d=$.fullCalendar.parseDate(rec);
						var da=new Date(d.getTime()-1*24*60*60*1000);
						var day=da.getDate();

						if(day<10)
							day='0'+day;

						var month=da.getMonth();
						month++;
						if(month<10)
							month='0'+month;

						rec=da.getFullYear()+'-'+month+'-'+day;
					}
					else
						rec=rec.substring(0, 4)+'-'+rec.substring(4, 6)+'-'+rec.substring(6, 8)+'T'+rec.substring(9, 11)+':'+rec.substring(11, 13)+':'+rec.substring(13, 15);
					rec_id=$.fullCalendar.parseDate(rec);*/
					//if(!rec_id || rec_id=='Invalid Date')
					//	rec_id='';
					rec_id=rec;
				}

				var isDuration = false;
				var dur = 0;
				vcalendar_element=vcalendar.match(vCalendar.pre['contentline_DTEND']);
				if(vcalendar_element!=null)
				{
					parsed=vcalendar_element[0].match(vCalendar.pre['contentline_parse']);
					end=parsed[4];
					var help=end;
					if(help.indexOf("T")==-1)
					{
						help=help.substring(0, 4)+'-'+help.substring(4, 6)+'-'+help.substring(6, 8);
						var d=$.fullCalendar.parseDate(help);
						var da=new Date(d.getTime());
						if(help1.indexOf("T")==-1)
							da.setDate(da.getDate()-1);
						help=$.fullCalendar.formatDate(da, "yyyy-MM-dd");
						all=true;
						if(help1.indexOf("T")!=-1)
						{
							all=false;
							help+='T00:00:00';
							if(tzName == 'UTC')
								help+='Z';
						}
					}
					else
					{
						help=help.substring(0, 4)+'-'+help.substring(4, 6)+'-'+help.substring(6, 8)+'T'+help.substring(9, 11)+':'+help.substring(11, 13)+':'+help.substring(13, 15);
						all=false;
					}
				}
				else
				{
					var checkDur=vcalendar.match(vCalendar.pre['dur-value']);
					if(checkDur!=null)
					{
						var checkP = (checkDur[0]+'\r\n').match(vCalendar.pre['contentline_parse']);
						if(checkP != null)
						{
							var value=checkP[4];

							var number = 0;
							if(value.indexOf('W')!=-1)
								number=parseAlarmWeek(value);
							else if(value.indexOf('D')!=-1)
								number=parseAlarmDay(value);
							else if(value.indexOf('T')!=-1)
								number=parseAlarmTime(value);
							if(parsed[4].charAt(0)=="-")
								number="-"+number;
							else
								number="+"+number;
							dur=parseInt(number.substring(1, number.length-1),10);
							isDuration = true;
						}
					}
				}
				if(isDuration)
				{
					var st='';
					if(!all)
						st = $.fullCalendar.parseDate(help1);
					else
					{
						st = $.fullCalendar.parseDate(help1+'T00:00:00');
						//date object mindfuck problem
						st.setMilliseconds(-1);
					}
					var durDate = new Date(st.getTime() + dur);
					help = $.fullCalendar.formatDate(durDate,"yyyy-MM-dd'T'HH:mm:ss");
				}

				if(typeof help=='undefined' || help=='' || help==null)
					help=help1;
				var t1=$.fullCalendar.parseDate(help);
				if(t1==null)
					return false;
				else if(t1.toString()=='Invalid Date')
					return false;

				if(!all)
				{
					if(end.charAt(end.length-1)=='Z')
						tzName='UTC';
					if(dtStartTimezone.length>1 || tzName=='UTC')
					{
						if(tzName!='UTC')
							tzName=$.trim(dtStartTimezone[1]);
						var finTZ = checkTimezone(tzName);
						if(finTZ!=null)
							tzName = finTZ;
						if(globalSettings.timezonesupport.value && tzName in timezones)
						{
							valOffsetFrom=getOffsetByTZ(tzName, t1);
							intOffset=(getLocalOffset(t1)*-1*1000)-valOffsetFrom.getSecondsFromOffset()*1000;
						}
					}
					else if(processedTimezones.indexOf(tzName)==-1)
					{
						if(timeZonesEnabled.indexOf(tzName)==-1)
						timeZonesEnabled.push('local');
						processedTimezones.push('local');
					}
					//realEnd=$.fullCalendar.parseDate(help);
					//help1+=valOffsetFrom;

					if(tzName!='' && tzName != 'local')
						if(processedTimezones.indexOf(tzName)==-1)
						{
							if(timeZonesEnabled.indexOf(tzName)==-1)
							timeZonesEnabled.push(tzName);
							processedTimezones.push(tzName);
						}
				}
				else
					tzName = globalSessionTimeZone;

				realEnd=$.fullCalendar.parseDate(help);
				inputEvent.end=$.fullCalendar.parseDate(help);
				end=$.fullCalendar.parseDate(help);
				if(intOffset)
				{
					inputEvent.end.setTime(inputEvent.end.getTime()+intOffset);
					end.setTime(end.getTime()+intOffset);
				}
			}
			else
				return false;

			if(globalVisibleCalDAVCollections.indexOf(rid)!=-1 || isChange || isNew)
			{
				if(isRepeat)
				{
					var futureRLimit = new Date(globalToLoadedLimit.getTime())
					futureRLimit.setDate(futureRLimit.getDate()+14);
					var ruleString=vcalendar.match(vCalendar.pre['contentline_RRULE2'])[0].match(vCalendar.pre['contentline_parse'])[4];
					inputEvent.isRepeat=true;
					if(realStart)
						var varDate=new Date(realStart.getTime());
					else
						var varDate=new Date(start.getTime());

					if(realEnd)
						var varEndDate=new Date(realEnd.getTime());
					else
						var varEndDate=new Date(end.getTime());

					var lastGenDate='';
					var repeatStart=new Date(varDate.getTime());
					var repeatEnd=new Date(varEndDate.getTime());
					var untilDate='',realUntilDate='',realUntil='';

					if(until!=='')
					{
						if(isUntilDate)
						{
							if(until.indexOf('T')!=-1)
							{
								var uString = until.substring(0, 4)+'-'+until.substring(4, 6)+'-'+until.substring(6, 8)+'T'+until.substring(9, 11)+':'+until.substring(11, 13)+':'+until.substring(13, 15);
								var ut=$.fullCalendar.parseDate(uString);
								if(ut==null)
									return false;
								if(ut.toString()=='Invalid Date')
									return false;
								if(!all)
								{
									if(globalSettings.timezonesupport.value && tzName in timezones)
										valOffsetFrom=getOffsetByTZ(tzName, ut);
									if(valOffsetFrom)
									{
										var intOffset=valOffsetFrom.getSecondsFromOffset()*1000;
										ut.setTime(ut.getTime()+intOffset);
									}
								}
								untilDate = new Date(ut.getTime());
							}
							else
							{
								untilDate=$.fullCalendar.parseDate(until.substring(0, 4)+'-'+until.substring(4, 6)+'-'+until.substring(6, 8));
								untilDate.setHours(realStart.getHours());
								untilDate.setMinutes(realStart.getMinutes());
								untilDate.setSeconds(realStart.getSeconds());
							}

							realUntil='';
						}
						else
						{
							untilDate='';
							realUntil=until;

						}
						realUntilDate=untilDate;
						inputEvent.untilDate=untilDate;
					}
					else
					{
						untilDate=new Date(futureRLimit.getTime());
						realUntilDate='';
						inputEvent.untilDate='never';
					}
					var repeatCount=0, realRepeatCount=0;

					if(!inputEvent.isDrawn)
					{
						if(alertTime.length>0)
						{
							var aTime='';
							var now=new Date();
							if(!inputCollection.ignoreAlarms)
								alertTimeOut=setAlertTimeouts(false,alertTime, start, end, {allDay:all, title:title}, true, inputEvent.uid);
						}
						realRepeatCount++;
						var checkRec=isInRecurrenceArray(varDate,stringUID,recurrence_id_array, tzName);

						if(exDates.length>0)
							if(exDates.indexOf(varDate.toString())!=-1)
								checkRec=true;
						if(!checkRec)
						{
							repeatCount++;
							var tmpObj=new items(inputEvent.etag, start, end, title, all, inputEvent.uid, rid, evid, note, inputEvent.displayValue, alertTime, alertNote, realUntilDate, frequency, interval, realUntil, repeatStart, repeatEnd, byMonthDay,repeatCount, realRepeatCount, vcalendar, location, alertTimeOut,tzName, realStart, realEnd, byDay, rec_id,wkst,classType, avail,hrefUrl, compareString,priority,status,ruleString);
							globalEventList.displayEventsArray[rid].splice(globalEventList.displayEventsArray[rid].length, 0, tmpObj);
						}
					}

					var lastGenDate=generateRepeatInstances({
						untilDate:realUntilDate,
						repeatStart:varDate,
						futureRLimit:futureRLimit,
						stringUID:stringUID,
						recurrence_id_array:recurrence_id_array,
						exDates:exDates,
						alertTime:alertTime,
						ignoreAlarms:inputCollection.ignoreAlarms,
						items:new items(inputEvent.etag, varDate, varEndDate, title, all, inputEvent.uid, rid, evid, note, inputEvent.displayValue, alertTime, alertNote, realUntilDate, frequency, interval, realUntil, repeatStart, repeatEnd, byMonthDay, repeatCount, realRepeatCount, vcalendar, location, alertTimeOut, tzName, realStart, realEnd, byDay, rec_id,wkst,classType, avail,hrefUrl,compareString,priority,status,ruleString)
					});
				}
				else
				{
					if(!inputCollection.ignoreAlarms)
						alertTimeOut=setAlertTimeouts(false,alertTime, start, end, {allDay:all, title:title},true,inputEvent.uid);

					var tmpObj=new items(inputEvent.etag, start, end, title, all, inputEvent.uid, rid, evid, note, inputEvent.displayValue, alertTime, alertNote, '', '', '', '', '', '', '', '', '', vcalendar, location, alertTimeOut, tzName, realStart, realEnd, byDay, rec_id,wkst,classType, avail,hrefUrl,compareString,priority,status,ruleString);
					if(isChange)
					{
						if(needReload)
							showEventForm(null, null, tmpObj, globalJsEvent, 'show', '');
					}
					globalEventList.displayEventsArray[rid].splice(globalEventList.displayEventsArray[rid].length, 0, tmpObj);
				}
			}
		}
		inputEvent.isDrawn=true;
}

function notRFCDataToRFCData(vcalendarString)
{
	// If vCalendar contains only '\n' instead of '\r\n' we correct this
	if(vcalendarString.match(RegExp('\r', 'm'))==null)
		vcalendarString=vcalendarString.replace(RegExp('\n', 'gm'), '\r\n');

	// remove multiple empty lines
	vcalendarString=vcalendarString.replace(RegExp('(\r\n)+','gm'),'\r\n');

	// remove line folding
	vcalendarString=vcalendarString.replace(RegExp('\r\n'+vCalendar.re['WSP'], 'gm'), '');

	// append '\r\n' to the end of the vCalendar if missing
	if(vcalendarString[vcalendarString.length-1]!='\n')
		vcalendarString+='\r\n';

	return vcalendarString;
}

function vCalendarCleanup(vcalendarString)
{
	vcalendarString=notRFCDataToRFCData(vcalendarString);
	return vcalendarString;
}
function dataToVcard(accountUID, inputUID, inputFilterUID, inputEtag)
{
	var vCardText='';
	var groupCounter=0;
	var tmpvCardEditorRef=$('#vCardEditor');
	if(typeof globalDisabledContactAttributes=='undefined' || !(globalDisabledContactAttributes instanceof Array))
		globalDisabledContactAttributes=[];

	// vCard BEGIN (required by RFC)
	if(vCard.tplM['begin']!=null && (process_elem=vCard.tplM['begin'][0])!=undefined)
		vCardText+=vCard.tplM['begin'][0];
	else
	{
		process_elem=vCard.tplC['begin'];
		process_elem=process_elem.replace('##:::##group_wd##:::##','');
		vCardText+=process_elem;
	}

// VERSION (required by RFC)
	if(vCard.tplM['contentline_VERSION']!=null && (process_elem=vCard.tplM['contentline_VERSION'][0])!=undefined)
	{
		// replace the object and related objects' group names (+ append the related objects after the processed)
		parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
		if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
			process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+(groupCounter++)+'.').substring(2);
	}
	else
	{
		process_elem=vCard.tplC['contentline_VERSION'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		process_elem=process_elem.replace('##:::##version##:::##', '3.0');
	}
	vCardText+=process_elem;

// UID (required by RFC)
	var newUID='';
	if(vCard.tplM['contentline_UID']!=null && (process_elem=vCard.tplM['contentline_UID'][0])!=undefined)
	{
		// replace the object and related objects' group names (+ append the related objects after the processed)
		parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
		if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
			process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+(groupCounter++)+'.').substring(2);
	}
	else
	{
		process_elem=vCard.tplC['contentline_UID'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		process_elem=process_elem.replace('##:::##params_wsc##:::##', '');

		newUID=globalAddressbookList.getNewUID();

		// it is VERY small probability, that for 2 newly created contacts the same UID is generated (but not impossible :( ...)
		process_elem=process_elem.replace('##:::##uid##:::##',newUID);
	}
	vCardText+=process_elem;

// N (required by RFC)
	if(vCard.tplM['contentline_N']!=null && (process_elem=vCard.tplM['contentline_N'][0])!=undefined)
	{
		// replace the object and related objects' group names (+ append the related objects after the processed)
		parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
		if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
			process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+(groupCounter++)+'.').substring(2);
	}
	else
	{
		process_elem=vCard.tplC['contentline_N'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
	}
	process_elem=process_elem.replace('##:::##family##:::##',vcardEscapeValue(tmpvCardEditorRef.find('[data-type="family"]').val()));
	process_elem=process_elem.replace('##:::##given##:::##',vcardEscapeValue(tmpvCardEditorRef.find('[data-type="given"]').val()));
	process_elem=process_elem.replace('##:::##middle##:::##',vcardEscapeValue(tmpvCardEditorRef.find('[data-type="middle"]').val()));
	process_elem=process_elem.replace('##:::##prefix##:::##',vcardEscapeValue(tmpvCardEditorRef.find('[data-type="prefix"]').val()));
	process_elem=process_elem.replace('##:::##suffix##:::##',vcardEscapeValue(tmpvCardEditorRef.find('[data-type="suffix"]').val()));
	vCardText+=process_elem;

// FN (extracted from newly created N [previous "process_elem"], required by RFC)
	// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
	parsed=('\r\n'+process_elem).match(vCard.pre['contentline_parse']);
	// parsed_value = [0]->Family, [1]->Given, [2]->Middle, [3]->Prefix, [4]->Suffix
	parsed_value=vcardSplitValue(parsed[4],';');

// XXX toto je blbost, v settingsoch predsa musi byt jednoznacne ci sa uklada format A alebo B
	/* backward compatibility for stupid users (remove it in future) */
	if(typeof globalSettings.contactstorefn.value=='string')
		var tmp=globalSettings.contactstorefn.value.replace(RegExp(',', 'g'),', ').split(',');
	else	/* new configuration options (arrays) */
		var tmp=globalSettings.contactstorefn.value.slice();	// copy the configuration array

	var first_found=false;
	for(var i=0;i<tmp.length;i++)
	{
		var tmp_found=false;
		if(tmp[i].match(RegExp('surname|lastname|last|family','ig'))!=null)
		{
			if(parsed_value[0]=='')
				tmp[i]='';
			else
			{
				tmp[i]=tmp[i].replace(RegExp((!first_found ? '.*' : '')+'(surname|lastname|last|family)','ig'),parsed_value[0]);
				first_found=true;
			}
		}
		if(tmp[i].match(RegExp('firstname|first|given','ig'))!=null)
		{
			if(parsed_value[1]=='')
				tmp[i]='';
			else
			{
				tmp[i]=tmp[i].replace(RegExp((!first_found ? '.*' : '')+'(firstname|first|given)','ig'),parsed_value[1]);
				first_found=true;
			}
		}
		if(tmp[i].match(RegExp('middlename|middle','ig'))!=null)
		{
			if(parsed_value[2]=='')
				tmp[i]='';
			else
			{
				tmp[i]=tmp[i].replace(RegExp((!first_found ? '.*' : '')+'(middlename|middle)','ig'),parsed_value[2]);
				first_found=true;
			}
		}
		if(tmp[i].match(RegExp('prefix','ig'))!=null)
		{
			if(parsed_value[3]=='')
				tmp[i]='';
			else
			{
				tmp[i]=tmp[i].replace(RegExp((!first_found ? '.*' : '')+'prefix','ig'),parsed_value[3]);
				first_found=true;
			}
		}
		if(tmp[i].match(RegExp('suffix','ig'))!=null)
		{
			if(parsed_value[4]=='')
				tmp[i]='';
			else
			{
				tmp[i]=tmp[i].replace(RegExp((!first_found ? '.*' : '')+'suffix','ig'),parsed_value[4]);
				first_found=true;
			}
		}
	}
	fn_value=tmp.join('');

	if(fn_value=='')	//empty FN -> we use the company name as FN
		fn_value=vcardEscapeValue(tmpvCardEditorRef.find('[data-type="org"]').val());

	if(vCard.tplM['contentline_FN']!=null && (process_elem=vCard.tplM['contentline_FN'][0])!=undefined)
	{
		// replace the object and related objects' group names (+ append the related objects after the processed)
		parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
		if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
			process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+(groupCounter++)+'.').substring(2);
	}
	else
	{
		process_elem=vCard.tplC['contentline_FN'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
	}
	process_elem=process_elem.replace('##:::##fn##:::##',fn_value);
	vCardText+=process_elem;

// CATEGORIES
	if(globalDisabledContactAttributes.indexOf('CATEGORIES')==-1 && (value=tmpvCardEditorRef.find('[data-type="\\%categories"]').find('input[data-type="value"]').val())!='')
	{
		if(vCard.tplM['contentline_CATEGORIES']!=null && (process_elem=vCard.tplM['contentline_CATEGORIES'][0])!=undefined)
		{
			// replace the object and related objects' group names (+ append the related objects after the processed)
			parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
			if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
				process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+(groupCounter++)+'.').substring(2);
		}
		else
		{
			process_elem=vCard.tplC['contentline_CATEGORIES'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
		}
		process_elem=process_elem.replace('##:::##value##:::##', value);	// we do not need to escape the value here!
		vCardText+=process_elem;
	}

// NOTE
	if(globalDisabledContactAttributes.indexOf('NOTE')==-1 && (value=tmpvCardEditorRef.find('[data-type="\\%note"]').find('textarea').val())!='')
	{
		if(vCard.tplM['contentline_NOTE']!=null && (process_elem=vCard.tplM['contentline_NOTE'][0])!=undefined)
		{
			// replace the object and related objects' group names (+ append the related objects after the processed)
			parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
			if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
				process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+(groupCounter++)+'.').substring(2);
		}
		else
		{
			process_elem=vCard.tplC['contentline_NOTE'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
		}
		process_elem=process_elem.replace('##:::##value##:::##',vcardEscapeValue(value));
		vCardText+=process_elem;
	}

// REV
	if(vCard.tplM['contentline_REV']!=null && (process_elem=vCard.tplM['contentline_REV'][0])!=undefined)
	{
		// replace the object and related objects' group names (+ append the related objects after the processed)
		parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
		if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
			process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+(groupCounter++)+'.').substring(2);
	}
	else
	{
		process_elem=vCard.tplC['contentline_REV'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
	}
	process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
	var d = new Date();
	var utc=d.getUTCFullYear()+(d.getUTCMonth()+1<10 ? '0':'')+(d.getUTCMonth()+1)+(d.getUTCDate()<10 ? '0':'')+d.getUTCDate()+'T'+(d.getUTCHours()<10 ? '0':'')+d.getUTCHours()+(d.getUTCMinutes()<10 ? '0':'')+d.getUTCMinutes()+(d.getUTCSeconds()<10 ? '0':'')+d.getUTCSeconds()+'Z';
	process_elem=process_elem.replace('##:::##value##:::##', utc);
	vCardText+=process_elem;

// NICKNAME
	if(globalDisabledContactAttributes.indexOf('NICKNAME')==-1 && (value=tmpvCardEditorRef.find('[data-type="nickname"]').val())!='')
	{
		if(vCard.tplM['contentline_NICKNAME']!=null && (process_elem=vCard.tplM['contentline_NICKNAME'][0])!=undefined)
		{
			// replace the object and related objects' group names (+ append the related objects after the processed)
			parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
			if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
				process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+(groupCounter++)+'.').substring(2);
		}
		else
		{
			process_elem=vCard.tplC['contentline_NICKNAME'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
		}
		process_elem=process_elem.replace('##:::##value##:::##', vcardEscapeValue(value));
		vCardText+=process_elem;
	}

// X-PHONETIC-FIRST-NAME
	if(globalDisabledContactAttributes.indexOf('X-PHONETIC-FIRST-NAME')==-1 && (value=tmpvCardEditorRef.find('[data-type="ph_firstname"]').val())!='')
	{
		if(vCard.tplM['contentline_X-PHONETIC-FIRST-NAME']!=null && (process_elem=vCard.tplM['contentline_X-PHONETIC-FIRST-NAME'][0])!=undefined)
		{
			// replace the object and related objects' group names (+ append the related objects after the processed)
			parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
			if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
				process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+(groupCounter++)+'.').substring(2);
		}
		else
		{
			process_elem=vCard.tplC['contentline_X-PHONETIC-FIRST-NAME'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
		}
		process_elem=process_elem.replace('##:::##value##:::##',vcardEscapeValue(value));
		vCardText+=process_elem;
	}

// X-PHONETIC-LAST-NAME
	if(globalDisabledContactAttributes.indexOf('X-PHONETIC-LAST-NAME')==-1 && (value=tmpvCardEditorRef.find('[data-type="ph_lastname"]').val())!='')
	{
		if(vCard.tplM['contentline_X-PHONETIC-LAST-NAME']!=null && (process_elem=vCard.tplM['contentline_X-PHONETIC-LAST-NAME'][0])!=undefined)
		{
			// replace the object and related objects' group names (+ append the related objects after the processed)
			parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
			if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
				process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+(groupCounter++)+'.').substring(2);
		}
		else
		{
			process_elem=vCard.tplC['contentline_X-PHONETIC-LAST-NAME'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
		}
		process_elem=process_elem.replace('##:::##value##:::##',vcardEscapeValue(value));
		vCardText+=process_elem;
	}

// BDAY
	if(globalDisabledContactAttributes.indexOf('BDAY')==-1 && (value=tmpvCardEditorRef.find('[data-type="date_bday"]').val())!='')
	{
		var valid=true;
		try {var date=$.datepicker.parseDate(globalSettings.datepickerformat.value, value)}
		catch (e) {valid=false}

		if(valid==true)
		{
			if(vCard.tplM['contentline_BDAY']!=null && (process_elem=vCard.tplM['contentline_BDAY'][0])!=undefined)
			{
				// replace the object and related objects' group names (+ append the related objects after the processed)
				parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
				if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
					process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+(groupCounter++)+'.').substring(2);
			}
			else
			{
				process_elem=vCard.tplC['contentline_BDAY'];
				process_elem=process_elem.replace('##:::##group_wd##:::##', '');
				process_elem=process_elem.replace('##:::##params_wsc##:::##', ';VALUE=date');
			}

			process_elem=process_elem.replace('##:::##value##:::##',vcardEscapeValue($.datepicker.formatDate('yy-mm-dd', date)));
			vCardText+=process_elem;
		}
	}

// X-ABDATE
	if(globalDisabledContactAttributes.indexOf('X-ABDATE')==-1)
	{
		tmpvCardEditorRef.find('[data-type="\\%date"]').each(
		function (index,element)
		{
			if((value=$(element).find('[data-type="date_value"]').val())!='')
			{
				var valid=true;
				try {var date=$.datepicker.parseDate(globalSettings.datepickerformat.value, value)}
				catch (e) {valid=false}

				if(valid==true)
				{
					incGroupCounter=false;
					if(vCard.tplM['contentline_X-ABDATE']!=null && (process_elem=vCard.tplM['contentline_X-ABDATE'][$(element).attr('data-id')])!=undefined)
					{
						// replace the object and related objects' group names (+ append the related objects after the processed)
						parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
						if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
						{
							process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+(groupCounter)+'.').substring(2);
							incGroupCounter=true;
						}
					}
					else
					{
						process_elem=vCard.tplC['contentline_X-ABDATE'];
						process_elem=process_elem.replace('##:::##group_wd##:::##', '');
					}
					var date_value=$.datepicker.formatDate('yy-mm-dd', date);

					var tmp_type=$(element).find('[data-type="date_type"] option').filter(':selected').attr('data-type');
					/* construct the "custom" type */
					if(tmp_type==':custom')
					{
						var tmp_cust_value=$(element).find('[data-type="custom_value"]').val();
						var tmp_cust_value_processed=tmp_cust_value.replace(RegExp('^\\s*|\\s*$','g'),'').replaceAll('  ',' ');
						// if a custom type is already defined as standard type, use the standard definition
						if((tmp_cust_already_exists=$(element).find('[data-type="date_type"] option').filter(function(){return $(this).html()==tmp_cust_value_processed;}).attr('data-type'))!=undefined)
							tmp_type=tmp_cust_already_exists;
						else	// use custom type
							tmp_type=':'+tmp_cust_value+':';
					}

					params_wsc='';
					tmp_normal_types=tmp_type.replace(RegExp(':.*:','g'),',').replaceAll(',,',',').replace(RegExp('^,|,$','g'),'');
					if(tmp_normal_types!='')
						params_wsc=';TYPE='+vcardEscapeValue(tmp_normal_types).toUpperCase().replace(RegExp('\\\\,','g'),';TYPE=');

					process_elem=process_elem.replace('##:::##params_wsc##:::##',params_wsc);
					process_elem=process_elem.replace('##:::##value##:::##',vcardEscapeValue(date_value));

					my_related='';
					tmp_related_type=tmp_type.match(RegExp(':(.*):'));	// only one element of related (X-ABLabel) is supported

					if(tmp_related_type!=null && tmp_related_type[1]!='')
						my_related='X-ABLabel:'+vcardEscapeValue((dataTypes['date_store_as'][tmp_related_type[1]]!=undefined ? dataTypes['date_store_as'][tmp_related_type[1]] : tmp_related_type[1]))+'\r\n';

					if(my_related!='')
					{
						incGroupCounter=true;
						parsed=('\r\n'+process_elem).match(vCard.pre['contentline_parse']);
						if(parsed[1]!='')	// if group is present, we use it, otherwise we create a new group
							process_elem+=parsed[1]+my_related;
						else
							process_elem='item'+groupCounter+'.'+process_elem+'item'+groupCounter+'.'+my_related;
					}

					if(incGroupCounter) groupCounter++;

					if(globalSettings.compatibility.value.anniversaryOutputFormat.indexOf('other')!=-1)
					{
						// X-ANNIVERSARY
						if(tmp_type==':_$!<anniversary>!$_:')
						{
							if(globalSettings.compatibility.value.anniversaryOutputFormat.indexOf('apple')!=-1)
								vCardText+=process_elem;
							process_elem='X-ANNIVERSARY;VALUE=date:'+vcardEscapeValue(date_value)+'\r\n';
						}

					}
					vCardText+=process_elem;
				}
			}
		});
	}

// TITLE
	if(globalDisabledContactAttributes.indexOf('TITLE')==-1 && (value=tmpvCardEditorRef.find('[data-type="title"]').val())!='')
	{
		if(vCard.tplM['contentline_TITLE']!=null && (process_elem=vCard.tplM['contentline_TITLE'][0])!=undefined)
		{
			// replace the object and related objects' group names (+ append the related objects after the processed)
			parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
			if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
				process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+(groupCounter++)+'.').substring(2);
		}
		else
		{
			process_elem=vCard.tplC['contentline_TITLE'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
		}
		process_elem=process_elem.replace('##:::##value##:::##',vcardEscapeValue(value));
		vCardText+=process_elem;
	}

// ORG
	if(globalDisabledContactAttributes.indexOf('ORG')==-1)
	{
		value=tmpvCardEditorRef.find('[data-type="org"]:visible:not([readonly])').val();
		value2=tmpvCardEditorRef.find('[data-type="department"]:visible:not([readonly])').val();
		if((value!=undefined && value!='') || (value2!=undefined && value2!=''))
		{
			if(vCard.tplM['contentline_ORG']!=null && (process_elem=vCard.tplM['contentline_ORG'][0])!=undefined)
			{
				// replace the object and related objects' group names (+ append the related objects after the processed)
				parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
				if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
					process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+(groupCounter++)+'.').substring(2);
			}
			else
			{
				process_elem=vCard.tplC['contentline_ORG'];
				process_elem=process_elem.replace('##:::##group_wd##:::##', '');
				process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
				process_elem=process_elem.replace('##:::##units_wsc##:::##', '');
			}
			process_elem=process_elem.replace('##:::##org##:::##',vcardEscapeValue(value)+(value2!=undefined && value2!='' ? ';'+vcardEscapeValue(value2) : ''));
			vCardText+=process_elem;
		}
	}

// X-ABShowAs
	if(globalDisabledContactAttributes.indexOf('X-ABShowAs')==-1 && tmpvCardEditorRef.find('[data-type="isorg"]').prop('checked'))
	{
		if(vCard.tplM['contentline_X-ABShowAs']!=null && (process_elem=vCard.tplM['contentline_X-ABShowAs'][0])!=undefined)
		{
			// replace the object and related objects' group names (+ append the related objects after the processed)
			parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
			if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
				process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+(groupCounter++)+'.').substring(2);
		}
		else
		{
			process_elem=vCard.tplC['contentline_X-ABShowAs'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
			process_elem=process_elem.replace('##:::##value##:::##', 'COMPANY');
		}
		vCardText+=process_elem;
	}

// PHOTO
	if(globalDisabledContactAttributes.indexOf('PHOTO')==-1 && !tmpvCardEditorRef.find('#photo').hasClass('photo_blank'))
	{
		var value=$('#photoURLHidden').val() || tmpvCardEditorRef.find('#photo').get(0).toDataURL('image/'+globalContactPhotoType).replace(RegExp('^data:(?:image/.*?;)?(?:base64,)?', 'i'), '');
		if(vCard.tplM['contentline_PHOTO']!=null && (process_elem=vCard.tplM['contentline_PHOTO'][0])!=undefined)
		{
			// replace the object and related objects' group names (+ append the related objects after the processed)
			parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
			if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
				process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+(groupCounter++)+'.').substring(2);

			process_elem=process_elem.replace('##:::##value##:::##',value);
		}
		else
		{
			process_elem=vCard.tplC['contentline_PHOTO'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##value##:::##', value);
		}

		// Data URL (non-remote) will always be a binary encoded png image
		if($('#photoURLHidden').val()==='') {
			process_elem=process_elem.replace('##:::##params_wsc##:::##', ';ENCODING=b;TYPE='+globalContactPhotoType);
		}
		// For remote URL, we can't reliably determine its type, so we just append the VALUE=URI param
		else {
			process_elem=process_elem.replace('##:::##params_wsc##:::##', ';VALUE=URI');
		}

		vCardText+=process_elem;
	}

// ADR
	if(globalDisabledContactAttributes.indexOf('ADR')==-1)
	{
		tmpvCardEditorRef.find('[data-type="\\%address"]').each(
			function (index,element)
			{
				// if data is present for the selected country's address fields
				var found=0;
				$(element).find('[data-addr-field]').each(
					function(index,element)
					{
						if($(element).attr('data-addr-field')!='' && $(element).attr('data-addr-field')!='country' && $(element).val()!='')
						{
							found=1;
							return false;
						}
					}
				);
				if(found)
				{
					var incGroupCounter=false;
					if(vCard.tplM['contentline_ADR']!=null && (process_elem=vCard.tplM['contentline_ADR'][$(element).attr('data-id')])!=undefined)
					{
						// replace the object and related objects' group names (+ append the related objects after the processed)
						parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
						if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
						{
							process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+groupCounter+'.').substring(2);
							incGroupCounter=true;
						}
					}
					else
					{
						process_elem=vCard.tplC['contentline_ADR'];
						process_elem=process_elem.replace('##:::##group_wd##:::##', '');
					}

					tmp_type=$(element).find('[data-type="address_type"] option').filter(':selected').attr('data-type');

					/* construct the "custom" type */
					if(tmp_type==':custom')
					{
						var tmp_cust_value=$(element).find('[data-type="custom_value"]').val();
						var tmp_cust_value_processed=tmp_cust_value.replace(RegExp('^\\s*|\\s*$','g'),'').replaceAll('  ',' ');
						// if a custom type is already defined as standard type, use the standard definition
						if((tmp_cust_already_exists=$(element).find('[data-type="address_type"] option').filter(function(){return $(this).html()==tmp_cust_value_processed;}).attr('data-type'))!=undefined)
							tmp_type=tmp_cust_already_exists;
						else	// use custom type
							tmp_type=':'+tmp_cust_value+':';
					}

					params_wsc='';
					tmp_normal_types=tmp_type.replace(RegExp(':.*:','g'),',').replaceAll(',,',',').replace(RegExp('^,|,$','g'),'');
					if(tmp_normal_types!='')
						params_wsc=';TYPE='+vcardEscapeValue(tmp_normal_types).toUpperCase().replace(RegExp('\\\\,','g'),';TYPE=');

					var streetVal = $(element).find('[data-addr-field="street"]').map(function() {
						var val = $(this).val();

						if(val) {
							return val;
						}
					}).get().join('\n');

					process_elem=process_elem.replace('##:::##params_wsc##:::##',params_wsc);
					process_elem=process_elem.replace('##:::##pobox##:::##',vcardEscapeValue($(element).find('[data-addr-field="pobox"]').val()));
					process_elem=process_elem.replace('##:::##extaddr##:::##',vcardEscapeValue($(element).find('[data-addr-field="extaddr"]').val()));
					process_elem=process_elem.replace('##:::##street##:::##',vcardEscapeValue(streetVal));
					process_elem=process_elem.replace('##:::##locality##:::##',vcardEscapeValue($(element).find('[data-addr-field="locality"]').val()));
					process_elem=process_elem.replace('##:::##region##:::##',vcardEscapeValue($(element).find('[data-addr-field="region"]').val()));
					process_elem=process_elem.replace('##:::##code##:::##',vcardEscapeValue($(element).find('[data-addr-field="code"]').val()));
					process_elem=process_elem.replace('##:::##country##:::##',vcardEscapeValue($(element).find('[data-type="country_type"] option').filter(':selected').attr('data-full-name')));

					my_related='X-ABADR:'+vcardEscapeValue($(element).find('[data-type="country_type"] option').filter(':selected').attr('data-type'))+'\r\n';
					parsed=('\r\n'+process_elem).match(vCard.pre['contentline_parse']);
					if(parsed[1]!='')	// if group is present, we use it, otherwise we create a new group
						process_elem+=parsed[1]+my_related;
					else
						process_elem='item'+groupCounter+'.'+process_elem+'item'+groupCounter+'.'+my_related;
					incGroupCounter=true;	// we always increate the group number, because the X-ABADR is always stored

					my_related='';
					tmp_related_type=tmp_type.match(RegExp(':(.*):'));	// only one element of related (X-ABLabel) is supported

					if(tmp_related_type!=null && tmp_related_type[1]!='')
						my_related='X-ABLabel:'+vcardEscapeValue((dataTypes['address_type_store_as'][tmp_related_type[1]]!=undefined ? dataTypes['address_type_store_as'][tmp_related_type[1]] : tmp_related_type[1]))+'\r\n';

					if(my_related!='')
					{
						incGroupCounter=true;
						parsed=('\r\n'+process_elem).match(vCard.pre['contentline_parse']);
						if(parsed[1]!='')	// if group is present, we use it, otherwise we create a new group
							process_elem+=parsed[1]+my_related;
						else
							process_elem='item'+groupCounter+'.'+process_elem+'item'+groupCounter+'.'+my_related;
					}

					if(incGroupCounter) groupCounter++;
					vCardText+=process_elem;
				}
			}
		);
	}

// TEL
	if(globalDisabledContactAttributes.indexOf('TEL')==-1)
	{
		tmpvCardEditorRef.find('[data-type="\\%phone"]').each(
			function (index,element)
			{
				if((value=$(element).find('[data-type="value"]').val())!='')
				{
					var incGroupCounter=false;
					if(vCard.tplM['contentline_TEL']!=null && (process_elem=vCard.tplM['contentline_TEL'][$(element).attr('data-id')])!=undefined)
					{
						// replace the object and related objects' group names (+ append the related objects after the processed)
						parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
						if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
						{
							process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+groupCounter+'.').substring(2);
							incGroupCounter=true;
						}
					}
					else
					{
						process_elem=vCard.tplC['contentline_TEL'];
						process_elem=process_elem.replace('##:::##group_wd##:::##', '');
					}
					tmp_type=$(element).find('[data-type="phone_type"] option').filter(':selected').attr('data-type');

					/* construct the "custom" type */
					if(tmp_type==':custom')
					{
						var tmp_cust_value=$(element).find('[data-type="custom_value"]').val();
						var tmp_cust_value_processed=tmp_cust_value.replace(RegExp('^\\s*|\\s*$','g'),'').replaceAll('  ',' ');
						// if a custom type is already defined as standard type, use the standard definition
						if((tmp_cust_already_exists=$(element).find('[data-type="phone_type"] option').filter(function(){return $(this).html()==tmp_cust_value_processed;}).attr('data-type'))!=undefined)
							tmp_type=tmp_cust_already_exists;
						else	// use custom type
							tmp_type=':'+tmp_cust_value+':';
					}

					params_wsc='';
					tmp_normal_types=tmp_type.replace(RegExp(':.*:','g'),',').replaceAll(',,',',').replace(RegExp('^,|,$','g'),'');

					if(tmp_normal_types!='')
						params_wsc=';TYPE='+vcardEscapeValue(tmp_normal_types).toUpperCase().replace(RegExp('\\\\,','g'),';TYPE=');

					process_elem=process_elem.replace('##:::##params_wsc##:::##',params_wsc);
					process_elem=process_elem.replace('##:::##value##:::##',vcardEscapeValue(value));

					my_related='';
					tmp_related_type=tmp_type.match(RegExp(':(.*):'));	// only one element of related (X-ABLabel) is supported

					if(tmp_related_type!=null && tmp_related_type[1]!='')
						my_related='X-ABLabel:'+vcardEscapeValue((dataTypes['phone_type_store_as'][tmp_related_type[1]]!=undefined ? dataTypes['phone_type_store_as'][tmp_related_type[1]] : tmp_related_type[1]))+'\r\n';

					if(my_related!='')
					{
						incGroupCounter=true;
						parsed=('\r\n'+process_elem).match(vCard.pre['contentline_parse']);
						if(parsed[1]!='')	// if group is present, we use it, otherwise we create a new group
							process_elem+=parsed[1]+my_related;
						else
							process_elem='item'+groupCounter+'.'+process_elem+'item'+groupCounter+'.'+my_related;
					}

					if(incGroupCounter) groupCounter++;
					vCardText+=process_elem;
				}
			}
		);
	}

// EMAIL
	if(globalDisabledContactAttributes.indexOf('EMAIL')==-1)
	{
		tmpvCardEditorRef.find('[data-type="\\%email"]').each(
			function (index,element)
			{
				if((value=$(element).find('[data-type="value"]').val())!='')
				{
					incGroupCounter=false;
					if(vCard.tplM['contentline_EMAIL']!=null && (process_elem=vCard.tplM['contentline_EMAIL'][$(element).attr('data-id')])!=undefined)
					{
						// replace the object and related objects' group names (+ append the related objects after the processed)
						parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
						if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
						{
							process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+groupCounter+'.').substring(2);
							incGroupCounter=true;
						}
					}
					else
					{
						process_elem=vCard.tplC['contentline_EMAIL'];
						process_elem=process_elem.replace('##:::##group_wd##:::##', '');
					}

					tmp_type=$(element).find('[data-type="email_type"] option').filter(':selected').attr('data-type');

					/* construct the "custom" type */
					if(tmp_type==':custom')
					{
						var tmp_cust_value=$(element).find('[data-type="custom_value"]').val();
						var tmp_cust_value_processed=tmp_cust_value.replace(RegExp('^\\s*|\\s*$','g'),'').replaceAll('  ',' ');
						// if a custom type is already defined as standard type, use the standard definition
						if((tmp_cust_already_exists=$(element).find('[data-type="email_type"] option').filter(function(){return $(this).html()==tmp_cust_value_processed;}).attr('data-type'))!=undefined)
							tmp_type=tmp_cust_already_exists;
						else	// use custom type
							tmp_type=':'+tmp_cust_value+':';
					}

					params_wsc='';
					tmp_normal_types=tmp_type.replace(RegExp(':.*:','g'),',').replaceAll(',,',',').replace(RegExp('^,|,$','g'),'');
					if(tmp_normal_types!='')
						params_wsc=';TYPE='+vcardEscapeValue(tmp_normal_types).toUpperCase().replace(RegExp('\\\\,','g'),';TYPE=');

					process_elem=process_elem.replace('##:::##params_wsc##:::##',params_wsc);
					process_elem=process_elem.replace('##:::##value##:::##',vcardEscapeValue(value));

					my_related='';
					tmp_related_type=tmp_type.match(RegExp(':(.*):'));	// only one element of related (X-ABLabel) is supported

					if(tmp_related_type!=null && tmp_related_type[1]!='')
						my_related='X-ABLabel:'+vcardEscapeValue((dataTypes['email_type_store_as'][tmp_related_type[1]]!=undefined ? dataTypes['email_type_store_as'][tmp_related_type[1]] : tmp_related_type[1]))+'\r\n';

					if(my_related!='')
					{
						incGroupCounter=true;
						parsed=('\r\n'+process_elem).match(vCard.pre['contentline_parse']);
						if(parsed[1]!='')	// if group is present, we use it, otherwise we create a new group
							process_elem+=parsed[1]+my_related;
						else
							process_elem='item'+groupCounter+'.'+process_elem+'item'+groupCounter+'.'+my_related;
					}

					if(incGroupCounter) groupCounter++;
					vCardText+=process_elem;
				}
			}
		);
	}

// URL
	if(globalDisabledContactAttributes.indexOf('URL')==-1)
	{
		tmpvCardEditorRef.find('[data-type="\\%url"]').each(
			function (index,element)
			{
				if((value=$(element).find('[data-type="value"]').val())!='')
				{
					incGroupCounter=false;
					if(vCard.tplM['contentline_URL']!=null && (process_elem=vCard.tplM['contentline_URL'][$(element).attr('data-id')])!=undefined)
					{
						// replace the object and related objects' group names (+ append the related objects after the processed)
						parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
						if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
						{
							process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+groupCounter+'.').substring(2);
							incGroupCounter=true;
						}
					}
					else
					{
						process_elem=vCard.tplC['contentline_URL'];
						process_elem=process_elem.replace('##:::##group_wd##:::##', '');
					}

					tmp_type=$(element).find('[data-type="url_type"] option').filter(':selected').attr('data-type');

					/* construct the "custom" type */
					if(tmp_type==':custom')
					{
						var tmp_cust_value=$(element).find('[data-type="custom_value"]').val();
						var tmp_cust_value_processed=tmp_cust_value.replace(RegExp('^\\s*|\\s*$','g'),'').replaceAll('  ',' ');
						// if a custom type is already defined as standard type, use the standard definition
						if((tmp_cust_already_exists=$(element).find('[data-type="url_type"] option').filter(function(){return $(this).html()==tmp_cust_value_processed;}).attr('data-type'))!=undefined)
							tmp_type=tmp_cust_already_exists;
						else	// use custom type
							tmp_type=':'+tmp_cust_value+':';
					}

					params_wsc='';
					tmp_normal_types=tmp_type.replace(RegExp(':.*:','g'),',').replaceAll(',,',',').replace(RegExp('^,|,$','g'),'');
					if(tmp_normal_types!='')
						params_wsc=';TYPE='+vcardEscapeValue(tmp_normal_types).toUpperCase().replace(RegExp('\\\\,','g'),';TYPE=');

					process_elem=process_elem.replace('##:::##params_wsc##:::##',params_wsc);
					process_elem=process_elem.replace('##:::##value##:::##',vcardEscapeValue(value));

					my_related='';
					tmp_related_type=tmp_type.match(RegExp(':(.*):'));	// only one element of related (X-ABLabel) is supported

					if(tmp_related_type!=null && tmp_related_type[1]!='')
						my_related='X-ABLabel:'+vcardEscapeValue((dataTypes['url_type_store_as'][tmp_related_type[1]]!=undefined ? dataTypes['url_type_store_as'][tmp_related_type[1]] : tmp_related_type[1]))+'\r\n';

					if(my_related!='')
					{
						incGroupCounter=true;
						parsed=('\r\n'+process_elem).match(vCard.pre['contentline_parse']);
						if(parsed[1]!='')	// if group is present, we use it, otherwise we create a new group
							process_elem+=parsed[1]+my_related;
						else
							process_elem='item'+groupCounter+'.'+process_elem+'item'+groupCounter+'.'+my_related;
					}

					if(incGroupCounter) groupCounter++;
					vCardText+=process_elem;
				}
			}
		);
	}

// X-ABRELATEDNAMES
	if(globalDisabledContactAttributes.indexOf('X-ABRELATEDNAMES')==-1)
	{
		tmpvCardEditorRef.find('[data-type="\\%person"]').each(
			function (index,element)
			{
				if((value=$(element).find('[data-type="value"]').val())!='')
				{
					incGroupCounter=false;
					if(vCard.tplM['contentline_X-ABRELATEDNAMES']!=null && (process_elem=vCard.tplM['contentline_X-ABRELATEDNAMES'][$(element).attr('data-id')])!=undefined)
					{
						// replace the object and related objects' group names (+ append the related objects after the processed)
						parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
						if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
						{
							process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+groupCounter+'.').substring(2);
							incGroupCounter=true;
						}
					}
					else
					{
						process_elem=vCard.tplC['contentline_X-ABRELATEDNAMES'];
						process_elem=process_elem.replace('##:::##group_wd##:::##', '');
					}

					tmp_type=$(element).find('[data-type="person_type"] option').filter(':selected').attr('data-type');

					/* construct the "custom" type */
					if(tmp_type==':custom')
					{
						var tmp_cust_value=$(element).find('[data-type="custom_value"]').val();
						var tmp_cust_value_processed=tmp_cust_value.replace(RegExp('^\\s*|\\s*$','g'),'').replaceAll('  ',' ');
						// if a custom type is already defined as standard type, use the standard definition
						if((tmp_cust_already_exists=$(element).find('[data-type="person_type"] option').filter(function(){return $(this).html()==tmp_cust_value_processed;}).attr('data-type'))!=undefined)
							tmp_type=tmp_cust_already_exists;
						else	// use custom type
							tmp_type=':'+tmp_cust_value+':';
					}

					params_wsc='';
					tmp_normal_types=tmp_type.replace(RegExp(':.*:','g'),',').replaceAll(',,',',').replace(RegExp('^,|,$','g'),'');
					if(tmp_normal_types!='')
						params_wsc=';TYPE='+vcardEscapeValue(tmp_normal_types).toUpperCase().replace(RegExp('\\\\,','g'),';TYPE=');

					process_elem=process_elem.replace('##:::##params_wsc##:::##',params_wsc);
					process_elem=process_elem.replace('##:::##value##:::##',vcardEscapeValue(value));

					my_related='';
					tmp_related_type=tmp_type.match(RegExp(':(.*):'));	// only one element of related (X-ABLabel) is supported

					if(tmp_related_type!=null && tmp_related_type[1]!='')
						my_related='X-ABLabel:'+vcardEscapeValue((dataTypes['person_type_store_as'][tmp_related_type[1]]!=undefined ? dataTypes['person_type_store_as'][tmp_related_type[1]] : tmp_related_type[1]))+'\r\n';

					if(my_related!='')
					{
						incGroupCounter=true;
						parsed=('\r\n'+process_elem).match(vCard.pre['contentline_parse']);
						if(parsed[1]!='')	// if group is present, we use it, otherwise we create a new group
							process_elem+=parsed[1]+my_related;
						else
							process_elem='item'+groupCounter+'.'+process_elem+'item'+groupCounter+'.'+my_related;
					}

					if(incGroupCounter) groupCounter++;

					if(tmp_related_type!=null && tmp_related_type[1]!='')
					{
						// In addition of the X-ABRELATEDNAMES attributes add also the old style X-* attributes
						switch(tmp_related_type[1])
						{
							case '_$!<assistant>!$_':
								process_elem+='X-ASSISTANT:'+vcardEscapeValue(value)+'\r\n';
								// process_elem+='X-EVOLUTION-ASSISTANT:'+vcardEscapeValue(value)+'\r\n';
								break;
							case '_$!<manager>!$_':
								process_elem+='X-MANAGER:'+vcardEscapeValue(value)+'\r\n';
								// process_elem+='X-EVOLUTION-MANAGER:'+vcardEscapeValue(value)+'\r\n';
								break;
							case '_$!<spouse>!$_':
								process_elem+='X-SPOUSE:'+vcardEscapeValue(value)+'\r\n';
								// process_elem+='X-EVOLUTION-SPOUSE:'+vcardEscapeValue(value)+'\r\n';
								break;
							default:
								break;
						}
					}

					vCardText+=process_elem;
				}
			}
		);
	}

// IMPP
	if(globalDisabledContactAttributes.indexOf('IMPP')==-1)
	{
		tmpvCardEditorRef.find('[data-type="\\%im"]').each(
			function (index,element)
			{
				if((value=$(element).find('[data-type="value"]').val())!='')
				{
					incGroupCounter=false;
					if(vCard.tplM['contentline_IMPP']!=null && (process_elem=vCard.tplM['contentline_IMPP'][$(element).attr('data-id')])!=undefined)
					{
						// replace the object and related objects' group names (+ append the related objects after the processed)
						parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
						if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
						{
							process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+groupCounter+'.').substring(2);
							incGroupCounter=true;
						}
					}
					else
					{
						process_elem=vCard.tplC['contentline_IMPP'];
						process_elem=process_elem.replace('##:::##group_wd##:::##', '');
					}

					tmp_type=$(element).find('[data-type="im_type"] option').filter(':selected').attr('data-type');

					/* construct the "custom" type */
					if(tmp_type==':custom')
					{
						var tmp_cust_value=$(element).find('[data-type="custom_value"]:first').val();
						var tmp_cust_value_processed=tmp_cust_value.replace(RegExp('^\\s*|\\s*$','g'),'').replaceAll('  ',' ');
						// if a custom type is already defined as standard type, use the standard definition
						if((tmp_cust_already_exists=$(element).find('[data-type="im_type"] option').filter(function(){return $(this).html()==tmp_cust_value_processed;}).attr('data-type'))!=undefined)
							tmp_type=tmp_cust_already_exists;
						else	// use custom type
							tmp_type=':'+tmp_cust_value+':';
					}

					params_wsc=params_wsc_old_repr='';
					tmp_normal_types=tmp_type.replace(RegExp(':.*:','g'),',').replaceAll(',,',',').replace(RegExp('^,|,$','g'),'');
					if(tmp_normal_types!='')
						params_wsc=params_wsc_old_repr=';TYPE='+vcardEscapeValue(tmp_normal_types).toUpperCase().replace(RegExp('\\\\,','g'),';TYPE=');

					tmp_service_type=$(element).find('[data-type="im_service_type"] option').filter(':selected').attr('data-type');

					/* construct the "custom" type */
					if(tmp_service_type==':custom')
					{
						var tmp_cust_value=$(element).find('[data-type="custom_value"]:last').val();
						var tmp_cust_value_processed=tmp_cust_value.replace(RegExp('^\\s*|\\s*$','g'),'').replaceAll('  ',' ');
						// if a custom type is already defined as standard type, use the standard definition
						if((tmp_cust_already_exists=$(element).find('[data-type="im_service_type"] option').filter(function(){return $(this).html()==tmp_cust_value_processed;}).attr('data-type'))!=undefined)
							tmp_service_type=tmp_cust_already_exists;
						else	// use custom type
							tmp_service_type=':'+tmp_cust_value+':';
					}

					if(dataTypes['im_service_type_store_as'][tmp_service_type]!=undefined)
						tmp_service_type=dataTypes['im_service_type_store_as'][tmp_service_type];
					params_wsc=';X-SERVICE-TYPE='+vcardEscapeValue(tmp_service_type)+params_wsc;

					process_elem=process_elem.replace('##:::##params_wsc##:::##',params_wsc);
					switch(tmp_service_type.toLowerCase())	// RFC4770
					{
						case 'aim':
							im_value='aim:'+vcardEscapeValue(value);
							break;
						case 'facebook':
							im_value='xmpp:'+vcardEscapeValue(value);
							break;
						case 'googletalk':
							im_value='xmpp:'+vcardEscapeValue(value);
							break;
						case 'icq':
							im_value='aim:'+vcardEscapeValue(value);
							break;
						case 'irc':
							im_value='irc:'+vcardEscapeValue(value);
							break;
						case 'jabber':
							im_value='xmpp:'+vcardEscapeValue(value);
							break;
						case 'msn':
							im_value='msnim:'+vcardEscapeValue(value);
							break;
						case 'skype':
							im_value='skype:'+vcardEscapeValue(value);
							break;
						case 'yahoo':
							im_value='ymsgr:'+vcardEscapeValue(value);
							break;
						default:	// 'gadugadu', 'qq', ...
							im_value='x-apple:'+vcardEscapeValue(value);
							break;
					}
					process_elem=process_elem.replace('##:::##value##:::##',im_value);

					my_related='';
					tmp_related_type=tmp_type.match(RegExp(':(.*):'));	// only one element of related (X-ABLabel) is supported

					if(tmp_related_type!=null && tmp_related_type[1]!='')
						my_related='X-ABLabel:'+vcardEscapeValue((dataTypes['im_type_store_as'][tmp_related_type[1]]!=undefined ? dataTypes['im_type_store_as'][tmp_related_type[1]] : tmp_related_type[1]))+'\r\n';

					if(my_related!='')
					{
						incGroupCounter=true;
						parsed=('\r\n'+process_elem).match(vCard.pre['contentline_parse']);
						if(parsed[1]!='')	// if group is present, we use it, otherwise we create a new group
							process_elem+=parsed[1]+my_related;
						else
							process_elem='item'+groupCounter+'.'+process_elem+'item'+groupCounter+'.'+my_related;
					}
					if(incGroupCounter) groupCounter++;

					// In addition of the IMPP attributes add also the old style X-* attributes
					process_elem_old_repr='';
					switch(tmp_service_type.toLowerCase())
					{
						case 'aim':
							new_group_wd='';
							if(incGroupCounter)
							{
								new_group_wd='item'+groupCounter+'.';
								process_elem_old_repr=('\r\n'+process_elem).replace(RegExp('\r\nitem'+(groupCounter-1)+'\\.','mg'),'\r\n'+new_group_wd);
								groupCounter++;
							}
							else
								process_elem_old_repr='\r\n'+process_elem;
							process_elem+=process_elem_old_repr.replace('\r\n'+new_group_wd+'IMPP;X-SERVICE-TYPE='+ vcardEscapeValue(tmp_service_type),new_group_wd+'X-AIM').replace(im_value+'\r\n',vcardEscapeValue(value)+'\r\n');
							break;
						case 'jabber':
							new_group_wd='';
							if(incGroupCounter)
							{
								new_group_wd='item'+groupCounter+'.';
								process_elem_old_repr=('\r\n'+process_elem).replace(RegExp('\r\nitem'+(groupCounter-1)+'\\.','mg'),'\r\n'+new_group_wd);
								groupCounter++;
							}
							else
								process_elem_old_repr='\r\n'+process_elem;
							process_elem+=process_elem_old_repr.replace('\r\n'+new_group_wd+'IMPP;X-SERVICE-TYPE='+ vcardEscapeValue(tmp_service_type),new_group_wd+'X-JABBER').replace(im_value+'\r\n',vcardEscapeValue(value)+'\r\n');
							break;
						case 'msn':
							new_group_wd='';
							if(incGroupCounter)
							{
								new_group_wd='item'+groupCounter+'.';
								process_elem_old_repr=('\r\n'+process_elem).replace(RegExp('\r\nitem'+(groupCounter-1)+'\\.','mg'),'\r\n'+new_group_wd);
								groupCounter++;
							}
							else
								process_elem_old_repr='\r\n'+process_elem;
							process_elem+=process_elem_old_repr.replace('\r\n'+new_group_wd+'IMPP;X-SERVICE-TYPE='+ vcardEscapeValue(tmp_service_type),new_group_wd+'X-MSN').replace(im_value+'\r\n',vcardEscapeValue(value)+'\r\n');
							break;
						case 'yahoo':
							new_group_wd='';
							process_elem_tmp=process_elem;
							if(incGroupCounter)
							{
								new_group_wd='item'+groupCounter+'.';
								process_elem_old_repr=('\r\n'+process_elem_tmp).replace(RegExp('\r\nitem'+(groupCounter-1)+'\\.','mg'),'\r\n'+new_group_wd);
								groupCounter++;
							}
							else
								process_elem_old_repr='\r\n'+process_elem;
							process_elem+=process_elem_old_repr.replace('\r\n'+new_group_wd+'IMPP;X-SERVICE-TYPE='+ vcardEscapeValue(tmp_service_type),new_group_wd+'X-YAHOO').replace(im_value+'\r\n',vcardEscapeValue(value)+'\r\n');

							new_group_wd='';
							if(incGroupCounter)
							{
								new_group_wd='item'+groupCounter+'.';
								process_elem_old_repr=('\r\n'+process_elem_tmp).replace(RegExp('\r\nitem'+(groupCounter-2)+'\\.','mg'),'\r\n'+new_group_wd);
								groupCounter++;
							}
							else
								process_elem_old_repr='\r\n'+process_elem;
							process_elem+=process_elem_old_repr.replace('\r\n'+new_group_wd+'IMPP;X-SERVICE-TYPE='+ vcardEscapeValue(tmp_service_type),new_group_wd+'X-YAHOO-ID').replace(im_value+'\r\n',vcardEscapeValue(value)+'\r\n');
							break;
						case 'icq':
							new_group_wd='';
							if(incGroupCounter)
							{
								new_group_wd='item'+groupCounter+'.';
								process_elem_old_repr=('\r\n'+process_elem).replace(RegExp('\r\nitem'+(groupCounter-1)+'\\.','mg'),'\r\n'+new_group_wd);
								groupCounter++;
							}
							else
								process_elem_old_repr='\r\n'+process_elem;
							process_elem+=process_elem_old_repr.replace('\r\n'+new_group_wd+'IMPP;X-SERVICE-TYPE='+ vcardEscapeValue(tmp_service_type),new_group_wd+'X-ICQ').replace(im_value+'\r\n',vcardEscapeValue(value)+'\r\n');
							break;
						default:
							break;
					}
					vCardText+=process_elem;
				}
			}
		);
	}

// X-SOCIALPROFILE
	if(globalDisabledContactAttributes.indexOf('X-SOCIALPROFILE')==-1)
	{
		tmpvCardEditorRef.find('[data-type="\\%profile"]').each(
			function (index,element)
			{
				if((value=$(element).find('[data-type="value"]').val())!='')
				{
					incGroupCounter=false;
					if(vCard.tplM['contentline_X-SOCIALPROFILE']!=null && (process_elem=vCard.tplM['contentline_X-SOCIALPROFILE'][$(element).attr('data-id')])!=undefined)
					{
						// replace the object and related objects' group names (+ append the related objects after the processed)
						parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCard.re['group']+'\\.)?)','m'));
						if(parsed[1]!='')	// if group is present, replace the object and related objects' group names
						{
							process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.','\\.'),'mg'),'\r\nitem'+groupCounter+'.').substring(2);
							incGroupCounter=true;
						}
					}
					else
					{
						process_elem=vCard.tplC['contentline_X-SOCIALPROFILE'];
						process_elem=process_elem.replace('##:::##group_wd##:::##', '');
					}

					tmp_type=$(element).find('[data-type="profile_type"] option').filter(':selected').attr('data-type');

					/* construct the "custom" type */
					if(tmp_type==':custom')
					{
						var tmp_cust_value=$(element).find('[data-type="custom_value"]').val();
						var tmp_cust_value_processed=tmp_cust_value.replace(RegExp('^\\s*|\\s*$','g'),'').replaceAll('  ',' ');
						// if a custom type is already defined as standard type, use the standard definition
						if((tmp_cust_already_exists=$(element).find('[data-type="profile_type"] option').filter(function(){return $(this).html()==tmp_cust_value_processed;}).attr('data-type'))!=undefined)
							tmp_type=tmp_cust_already_exists;
						else	// use custom type
							tmp_type=':'+tmp_cust_value+':';
					}

					params_wsc='';
					tmp_normal_types=tmp_type.replace(RegExp(':.*:','g'),',').replaceAll(',,',',').replace(RegExp('^,|,$','g'),'');
					if(tmp_normal_types!='')
						params_wsc=';TYPE='+vcardEscapeValue(tmp_normal_types).toUpperCase().replace(RegExp('\\\\,','g'),';TYPE=')+';x-user='+vcardEscapeValue(tmp_type=='twitter' ? value.replace(/^@+/, '') : value);

					process_elem=process_elem.replace('##:::##params_wsc##:::##',params_wsc);
					process_elem=process_elem.replace('##:::##value##:::##', vcardEscapeValue((globalSettings.urihandlerprofile.value[tmp_type]!=undefined ? globalSettings.urihandlerprofile.value[tmp_type] : 'x-apple:%u').replace('%u', (tmp_type=='twitter' ? value.replace(/^@+/, '') : value))));

					if(incGroupCounter) groupCounter++;
					vCardText+=process_elem;
				}
			}
		);
	}

	// extension hook
	if(typeof(globalContactsExtDataToVcard)=='function')
		vCardText=globalContactsExtDataToVcard(tmpvCardEditorRef, vCardText);

	// PRODID
	vCardText+='PRODID:-//Inf-IT//'+globalAppName+' '+globalVersion+'//EN\r\n';

	if(typeof vCard.tplM['unprocessed_unrelated']!='undefined')
		vCardText+=vCard.tplM['unprocessed_unrelated'].replace(RegExp('^\r\n'),'');

	// vCard END (required by RFC)
	if(vCard.tplM['end']!=null && (process_elem=vCard.tplM['end'][0])!=undefined)
		vCardText+=vCard.tplM['end'][0];
	else
	{
		process_elem=vCard.tplC['end'];
		process_elem=process_elem.replace('##:::##group_wd##:::##', '');
		vCardText+=process_elem;
	}

	// replace unsupported XML characters
	vCardText=vCardText.replace(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]/g, ' ');

	// line folding (RFC2426 - section 2.6) - maximum of 75 octects (and cannot break
	//  multi-octet UTF8-characters) allowed on one line, excluding a line break (CRLF)
	vCardText=vObjectLineFolding(vCardText);

	if(typeof(globalContactsExtPutVcardToCollectionOverload)=='function')
		globalContactsExtPutVcardToCollectionOverload(accountUID, inputEtag, newUID, vCardText);
	else
	{
		var selAddr = tmpvCardEditorRef.find('[data-attr-name="_DEST_"]').find('option:selected').attr('data-type')
		//addressbook selectbox was changed
		var orgAddr = $('#vCardEditor').attr('data-url').replace(RegExp('[^/]*$'),'');
		if($('#ExtendedDest').length>0)
		{
			var putGroups=new Array();
			var removeGroups=new Array();
			var myGroups = new Array()
			if(inputEtag!='')
			{
				myGroups=globalAddressbookList.getMyContactGroups($('#vCardEditor').attr('data-url'));
				for(var gi=0; gi<myGroups.length; gi++)
					if($('#ExtendedDest').find('.extended_dest_group').find('input:checked[data-id="'+myGroups[gi]+'"]').length==0)
						removeGroups.push(myGroups[gi]);
			}
			$('#ExtendedDest').find('.extended_dest_group').find('input:checked').each(function(){
				var guid = $(this).attr('data-id');
				if(myGroups.indexOf(guid)==-1)
					putGroups.push(guid);
			});
		}
		if(orgAddr!= selAddr && inputEtag!='')
		{
			var tmp2=globalAddressbookList.getContactByUID($('#vCardEditor').attr('data-url'));
			var vUID = $('#vCardEditor').attr('data-url').match(RegExp('[^/]*$'));
			// here we generate the destination for MOVE (we don't use the old vCard file name to minimalize the possible conflict situations)
			tmp2.vcard=vCardText;
			tmp2.newAccountUID=globalResourceCardDAVList.getCollectionByUID(selAddr).accountUID;
			tmp2.newUid=selAddr;
			tmp2.finalContactUID=tmp2.uid;
			tmp2.orgUID=selAddr+vUID;
			tmp2.addToContactGroupUID=new Array();
			tmp2.removeToContactGroupUID=new Array();
			// we need to store the ui object references for error handling in the GUI
			if($('#ExtendedDest').length>0)
			{
				tmp2.uiObjects={resource:globalRefAddContact.attr('data-filter-url')};
				if(putGroups.length>0)
					tmp2.addToContactGroupUID=putGroups.slice();
				if(removeGroups.length>0)
					tmp2.removeToContactGroupUID=removeGroups.slice();
			}
			tmp2.formSave=true;
			lockAndPerformToCollection(tmp2, globalRefAddContact.attr('data-filter-url'), 'IRM_DELETE');
		}
		else
		{
			if(inputEtag=='')
				inputUID=selAddr;
			if($('#ExtendedDest').length>0 && (putGroups.length>0 || removeGroups.length>0))
			{
				if(inputEtag!='')
					var tmp2=globalAddressbookList.getContactByUID($('#vCardEditor').attr('data-url'));
				else
					var tmp2={accountUID: accountUID, uid: inputUID, etag: inputEtag};
				var vUID = $('#vCardEditor').attr('data-url').match(RegExp('[^/]*$'));
				// here we generate the destination for MOVE (we don't use the old vCard file name to minimalize the possible conflict situations)
				tmp2.vcard=vCardText;
				tmp2.uiObjects={resource:globalRefAddContact.attr('data-filter-url')};
				tmp2.addToContactGroupUID=new Array();
				tmp2.removeToContactGroupUID=new Array();
				if(putGroups.length>0)
					tmp2.addToContactGroupUID=putGroups.slice();
				if(removeGroups.length>0)
					tmp2.removeToContactGroupUID=removeGroups.slice();
				tmp2.formSave=true;
				lockAndPerformToCollection(tmp2, globalRefAddContact.attr('data-filter-url'), 'PUT');
			}
			else
				putVcardToCollectionMain({accountUID: accountUID, uid: inputUID, etag: inputEtag, vcard: vCardText}, inputFilterUID);
		}
	}
}

function vcardToData(inputContact, inputIsReadonly, inputIsCompany, inputEditorMode)
{
	if(typeof globalDebug!='undefined' && globalDebug instanceof Array && globalDebug.indexOf('vcard')!=-1)
		console.time('vcardToData timer');

	if(inputContact.vcard==undefined)
	{
		console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
		return false;
	}

	var tmpvCardEditorRef=CardDAVeditor_cleanup(false, inputIsCompany);	// editor initialization

	$('#ABContactColor').css('background-color', inputContact.color);

	if(typeof globalDisabledContactAttributes=='undefined' || !(globalDisabledContactAttributes instanceof Array))
		globalDisabledContactAttributes=[];

	if(inputContact.vcard.match(vCard.pre['vcard']))
	{
		// ------------------------------------------------------------------------------------- //
		// BEGIN and END
		vcard_full=inputContact.vcard.split('\r\n');		// vCard data to array

		// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
		if((parsed=('\r\n'+vcard_full[0]+'\r\n').match(vCard.pre['contentline_parse']))==null)
		{
			console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
			return false;
		}
		// values not directly supported by the editor (old values are kept intact)
		vCard.tplM['begin'][0]=vCard.tplC['begin'].replace('##:::##group_wd##:::##', vcard_begin_group=parsed[1]);
		// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
		if((parsed=('\r\n'+vcard_full[vcard_full.length-2]+'\r\n').match(vCard.pre['contentline_parse']))==null)
		{
			console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
			return false;
		}
		// values not directly supported by the editor (old values are kept intact)
		vCard.tplM['end'][0]=vCard.tplC['end'].replace('##:::##group_wd##:::##', vcard_end_group=parsed[1]);

		if(vcard_begin_group!=vcard_end_group)
		{
			console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
			return false;	// the vCard BEGIN and END "group" are different
		}

		// remove the vCard BEGIN and END
		vcard='\r\n'+vcard_full.slice(1, vcard_full.length-2).join('\r\n')+'\r\n';

//console.time('VERSION timer');
		// ------------------------------------------------------------------------------------- //
		// VERSION -> what to do if present more than once?
		vcard_element=vcard.match(vCard.pre['contentline_VERSION']);
		if(vcard_element!=null && vcard_element.length==1)	// if the VERSION attribute is not present exactly once, vCard is considered invalid
		{
			// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
			parsed=vcard_element[0].match(vCard.pre['contentline_parse']);
			if(parsed[3]=='' && parsed[4]=='3.0')	// RFC requirement
			{
				// values not directly supported by the editor (old values are kept intact)
				vCard.tplM['contentline_VERSION'][0]=vCard.tplC['contentline_VERSION'];
				vCard.tplM['contentline_VERSION'][0]=vCard.tplM['contentline_VERSION'][0].replace('##:::##group_wd##:::##', parsed[1]);
				vCard.tplM['contentline_VERSION'][0]=vCard.tplM['contentline_VERSION'][0].replace('##:::##version##:::##', parsed[4]);

				// remove the processed parameter
				vcard=vcard.replace(vcard_element[0], '\r\n');

				// find the corresponding group data (if exists)
				if(parsed[1]!='')
				{
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// append the parameter to its parent
						vCard.tplM['contentline_VERSION'][0]+=vcard_element_related[0].substr(2);
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0],'\r\n');
					}
				}
			}
			else
			{
				console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
				return false;	// invalid input for "VERSION" (we support only vCard 3.0)
			}
		}
		else
		{
			console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
			return false;	// vcard "VERSION" not present or present more than once
		}
//console.timeEnd('VERSION timer');

//console.time('UID timer');
		// ------------------------------------------------------------------------------------- //
		// UID -> TODO: what to do if present more than once?
		vcard_element=vcard.match(vCard.pre['contentline_UID']);
		if(vcard_element!=null && vcard_element.length==1)	// if the UID attribute is not present exactly once, vCard is considered invalid
		{
			// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
			parsed=vcard_element[0].match(vCard.pre['contentline_parse']);

			// values not directly supported by the editor (old values are kept intact)
			vCard.tplM['contentline_UID'][0]=vCard.tplC['contentline_UID'];
			vCard.tplM['contentline_UID'][0]=vCard.tplM['contentline_UID'][0].replace('##:::##group_wd##:::##', parsed[1]);
			vCard.tplM['contentline_UID'][0]=vCard.tplM['contentline_UID'][0].replace('##:::##params_wsc##:::##', parsed[3]);
			vCard.tplM['contentline_UID'][0]=vCard.tplM['contentline_UID'][0].replace('##:::##uid##:::##', parsed[4]);

			tmpvCardEditorRef.find('#vCardEditor').attr('data-vcard-uid', parsed[4]);	// special hack; usually used by extension hooks

			// remove the processed parameter
			vcard=vcard.replace(vcard_element[0], '\r\n');

			// find the corresponding group data (if exists)
			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while((vcard_element_related=vcard.match(re))!=null)
				{
					// append the parameter to its parent
					vCard.tplM['contentline_UID'][0]+=vcard_element_related[0].substr(2);
					// remove the processed parameter
					vcard=vcard.replace(vcard_element_related[0],'\r\n');
				}
			}
		}
// Old not RFC vCards not contain UID - we ignore this error (UID is generated if vCard is changed)
//		else
//		{
//			console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
//			return false;	// vcard UID not present or present more than once
//		}
//console.timeEnd('UID timer');

//console.time('FN timer');
		// ------------------------------------------------------------------------------------- //
		// FN -> TODO: what to do if present more than once?
		vcard_element=vcard.match(vCard.pre['contentline_FN']);
		if(vcard_element!=null && vcard_element.length==1)	// if the FN attribute is not present exactly once, vCard is considered invalid
		{
			// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
			parsed=vcard_element[0].match(vCard.pre['contentline_parse']);

			// values not directly supported by the editor (old values are kept intact)
			vCard.tplM['contentline_FN'][0]=vCard.tplC['contentline_FN'];
			vCard.tplM['contentline_FN'][0]=vCard.tplM['contentline_FN'][0].replace('##:::##group_wd##:::##', parsed[1]);
			vCard.tplM['contentline_FN'][0]=vCard.tplM['contentline_FN'][0].replace('##:::##params_wsc##:::##', parsed[3]);

			// remove the processed parameter
			vcard=vcard.replace(vcard_element[0],'\r\n');

			// find the corresponding group data (if exists)
			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while((vcard_element_related=vcard.match(re))!=null)
				{
					// append the parameter to its parent
					vCard.tplM['contentline_FN'][0]+=vcard_element_related[0].substr(2);
					// remove the processed parameter
					vcard=vcard.replace(vcard_element_related[0],'\r\n');
				}
			}
		}
		else
		{
			console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
			return false;	// vcard FN not present or present more than once
		}
//console.timeEnd('FN timer');

//console.time('N timer');
		// ------------------------------------------------------------------------------------- //
		// N -> TODO: what to do if present more than once?
		vcard_element=vcard.match(vCard.pre['contentline_N']);
		if(vcard_element!=null && vcard_element.length==1)	// if the N attribute is not present exactly once, vCard is considered invalid
		{
			// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
			parsed=vcard_element[0].match(vCard.pre['contentline_parse']);
			// parsed_value = [0]->Family, [1]->Given, [2]->Middle, [3]->Prefix, [4]->Suffix
			parsed_value=vcardSplitValue(parsed[4],';');

			if(parsed_value[0]!=undefined && parsed_value[0]!='')
				tmpvCardEditorRef.find('[data-type="family"]').val(vcardUnescapeValue(parsed_value[0]));
			if(parsed_value[1]!=undefined && parsed_value[1]!='')
				tmpvCardEditorRef.find('[data-type="given"]').val(vcardUnescapeValue(parsed_value[1]));
			if(parsed_value[2]!=undefined && parsed_value[2]!='')
				tmpvCardEditorRef.find('[data-type="middle"]').val(vcardUnescapeValue(parsed_value[2]));
			if(parsed_value[3]!=undefined && parsed_value[3]!='')
				tmpvCardEditorRef.find('[data-type="prefix"]').val(vcardUnescapeValue(parsed_value[3]));
			if(parsed_value[4]!=undefined && parsed_value[4]!='')
				tmpvCardEditorRef.find('[data-type="suffix"]').val(vcardUnescapeValue(parsed_value[4]));

			// values not directly supported by the editor (old values are kept intact)
			vCard.tplM['contentline_N'][0]=vCard.tplC['contentline_N'];
			vCard.tplM['contentline_N'][0]=vCard.tplM['contentline_N'][0].replace('##:::##group_wd##:::##', parsed[1]);
			vCard.tplM['contentline_N'][0]=vCard.tplM['contentline_N'][0].replace('##:::##params_wsc##:::##', parsed[3]);

			// remove the processed parameter
			vcard=vcard.replace(vcard_element[0],'\r\n');

			// find the corresponding group data (if exists)
			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
				while((vcard_element_related=vcard.match(re))!=null)
				{
					// append the parameter to its parent
					vCard.tplM['contentline_N'][0]+=vcard_element_related[0].substr(2);
					// remove the processed parameter
					vcard=vcard.replace(vcard_element_related[0],'\r\n');
				}
			}
		}
		else
		{
			console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
			return false;	// vcard N not present or present more than once
		}
//console.timeEnd('N timer');

//console.time('CATEGORIES timer');
		// ------------------------------------------------------------------------------------- //
		// CATEGORIES -> present max. once because of the CardDavMATE vCard transformations
		if(globalDisabledContactAttributes.indexOf('CATEGORIES')==-1)
		{
			vcard_element=vcard.match(vCard.pre['contentline_CATEGORIES']);
			if(vcard_element!=null && vcard_element.length==1)
			{
				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				parsed=vcard_element[0].match(vCard.pre['contentline_parse']);

				tmpvCardEditorRef.find('#tags').importTags(parsed[4]);	// we do not need to unescape the value here!

				// values not directly supported by the editor (old values are kept intact)
				vCard.tplM['contentline_CATEGORIES'][0]=vCard.tplC['contentline_CATEGORIES'];
				vCard.tplM['contentline_CATEGORIES'][0]=vCard.tplM['contentline_CATEGORIES'][0].replace('##:::##group_wd##:::##', parsed[1]);
				vCard.tplM['contentline_CATEGORIES'][0]=vCard.tplM['contentline_CATEGORIES'][0].replace('##:::##params_wsc##:::##', parsed[3]);

				// remove the processed parameter
				vcard=vcard.replace(vcard_element[0],'\r\n');

				// find the corresponding group data (if exists)
				if(parsed[1]!='')
				{
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// append the parameter to its parent
						vCard.tplM['contentline_CATEGORIES'][0]+=vcard_element_related[0].substr(2);
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0],'\r\n');
					}
				}
			}
		}
//console.timeEnd('CATEGORIES timer');

//console.time('NOTE timer');
		// ------------------------------------------------------------------------------------- //
		// NOTE -> TODO: what to do if present more than once?
		if(globalDisabledContactAttributes.indexOf('NOTE')==-1)
		{
			vcard_element=vcard.match(vCard.pre['contentline_NOTE']);
			if(vcard_element!=null)
			{
				if(vcard_element.length==1)	// if the NOTE attribute is present exactly once
				{
					// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
					parsed=vcard_element[0].match(vCard.pre['contentline_parse']);

					tmpvCardEditorRef.find('[data-type="\\%note"]').find('textarea').val(vcardUnescapeValue(parsed[4])).trigger('autosize.resize');

					// values not directly supported by the editor (old values are kept intact)
					vCard.tplM['contentline_NOTE'][0]=vCard.tplC['contentline_NOTE'];
					vCard.tplM['contentline_NOTE'][0]=vCard.tplM['contentline_NOTE'][0].replace('##:::##group_wd##:::##', parsed[1]);
					vCard.tplM['contentline_NOTE'][0]=vCard.tplM['contentline_NOTE'][0].replace('##:::##params_wsc##:::##', parsed[3]);

					// remove the processed parameter
					vcard=vcard.replace(vcard_element[0],'\r\n');

					// find the corresponding group data (if exists)
					if(parsed[1]!='')
					{
						var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
						while((vcard_element_related=vcard.match(re))!=null)
						{
							// append the parameter to its parent
							vCard.tplM['contentline_NOTE'][0]+=vcard_element_related[0].substr(2);
							// remove the processed parameter
							vcard=vcard.replace(vcard_element_related[0],'\r\n');
						}
					}
				}
				else
				{
					console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
					return false;	// vcard NOTE present more than once
				}
			}
			else	// force set the textarea value to empty string (workaround for a specific bug of webkit based browsers /memory overflow?/)
				tmpvCardEditorRef.find('[data-type="\\%note"]').find('textarea').val('').trigger('autosize.resize');
		}
//console.timeEnd('NOTE timer');

//console.time('REV timer');
		// ------------------------------------------------------------------------------------- //
		// REV -> what to do if present more than once?
		vcard_element=vcard.match(vCard.pre['contentline_REV']);
		if(vcard_element!=null)	// if the REV attribute is exists
		{
			if(vcard_element.length==1)	// and is present exactly once
			{
				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				parsed=vcard_element[0].match(vCard.pre['contentline_parse']);

				// values not directly supported by the editor (old values are kept intact)
				vCard.tplM['contentline_REV'][0]=vCard.tplC['contentline_REV'];
				vCard.tplM['contentline_REV'][0]=vCard.tplM['contentline_REV'][0].replace('##:::##group_wd##:::##', parsed[1]);

				// remove the processed parameter
				vcard=vcard.replace(vcard_element[0],'\r\n');

				// find the corresponding group data (if exists)
				if(parsed[1]!='')
				{
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// append the parameter to its parent
						vCard.tplM['contentline_REV'][0]+=vcard_element_related[0].substr(2);
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0],'\r\n');
					}
				}
			}
			else
			{
				console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
				return false;	// vcard REV present more than once
			}
		}
//console.timeEnd('REV timer');

//console.time('NICKNAME timer');
		// ------------------------------------------------------------------------------------- //
		// NICKNAME -> TODO: what to do if present more than once?
		if(globalDisabledContactAttributes.indexOf('NICKNAME')==-1)
		{
			vcard_element=vcard.match(vCard.pre['contentline_NICKNAME']);
			if(vcard_element!=null)
			{
				if(vcard_element.length!=1)	// if the NICKNAME attribute is present more than once, vCard is considered invalid
				{
					console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
					return false;
				}

				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				parsed=vcard_element[0].match(vCard.pre['contentline_parse']);

				tmpvCardEditorRef.find('[data-type="nickname"]').val(vcardUnescapeValue(parsed[4]));

				// values not directly supported by the editor (old values are kept intact)
				vCard.tplM['contentline_NICKNAME'][0]=vCard.tplC['contentline_NICKNAME'];
				vCard.tplM['contentline_NICKNAME'][0]=vCard.tplM['contentline_NICKNAME'][0].replace('##:::##group_wd##:::##', parsed[1]);
				vCard.tplM['contentline_NICKNAME'][0]=vCard.tplM['contentline_NICKNAME'][0].replace('##:::##params_wsc##:::##', parsed[3]);

				// remove the processed parameter
				vcard=vcard.replace(vcard_element[0],'\r\n');

				// find the corresponding group data (if exists)
				if(parsed[1]!='')
				{
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// append the parameter to its parent
						vCard.tplM['contentline_NICKNAME'][0]+=vcard_element_related[0].substr(2);
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0],'\r\n');
					}
				}
			}
		}
//console.timeEnd('NICKNAME timer');

//console.time('X-PHONETIC-FIST-NAME timer');
		// ------------------------------------------------------------------------------------- //
		// X-PHONETIC-FIRST-NAME -> TODO: what to do if present more than once?
		if(globalDisabledContactAttributes.indexOf('X-PHONETIC-FIRST-NAME')==-1)
		{
			vcard_element=vcard.match(vCard.pre['contentline_X-PHONETIC-FIRST-NAME']);
			if(vcard_element!=null)
			{
				if(vcard_element.length!=1)	// if the X-PHONETIC-FIRST-NAME attribute is present more than once, vCard is considered invalid
				{
					console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
					return false;
				}

				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				parsed=vcard_element[0].match(vCard.pre['contentline_parse']);

				tmpvCardEditorRef.find('[data-type="ph_firstname"]').val(vcardUnescapeValue(parsed[4]));

				// values not directly supported by the editor (old values are kept intact)
				vCard.tplM['contentline_X-PHONETIC-FIRST-NAME'][0]=vCard.tplC['contentline_X-PHONETIC-FIRST-NAME'];
				vCard.tplM['contentline_X-PHONETIC-FIRST-NAME'][0]=vCard.tplM['contentline_X-PHONETIC-FIRST-NAME'][0].replace('##:::##group_wd##:::##', parsed[1]);
				vCard.tplM['contentline_X-PHONETIC-FIRST-NAME'][0]=vCard.tplM['contentline_X-PHONETIC-FIRST-NAME'][0].replace('##:::##params_wsc##:::##', parsed[3]);

				// remove the processed parameter
				vcard=vcard.replace(vcard_element[0],'\r\n');

				// find the corresponding group data (if exists)
				if(parsed[1]!='')
				{
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// append the parameter to its parent
						vCard.tplM['contentline_X-PHONETIC-FIRST-NAME'][0]+=vcard_element_related[0].substr(2);
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0],'\r\n');
					}
				}
			}
		}
//console.timeEnd('X-PHONETIC-FIST-NAME timer');

//console.time('X-PHONETIC-LAST-NAME timer');
		// ------------------------------------------------------------------------------------- //
		// X-PHONETIC-LAST-NAME -> TODO: what to do if present more than once?
		if(globalDisabledContactAttributes.indexOf('X-PHONETIC-LAST-NAME')==-1)
		{
			vcard_element=vcard.match(vCard.pre['contentline_X-PHONETIC-LAST-NAME']);
			if(vcard_element!=null)
			{
				if(vcard_element.length!=1)	// if the X-PHONETIC-LAST-NAME attribute is present more than once, vCard is considered invalid
				{
					console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
					return false;
				}

				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				parsed=vcard_element[0].match(vCard.pre['contentline_parse']);

				tmpvCardEditorRef.find('[data-type="ph_lastname"]').val(vcardUnescapeValue(parsed[4]));

				// values not directly supported by the editor (old values are kept intact)
				vCard.tplM['contentline_X-PHONETIC-LAST-NAME'][0]=vCard.tplC['contentline_X-PHONETIC-LAST-NAME'];
				vCard.tplM['contentline_X-PHONETIC-LAST-NAME'][0]=vCard.tplM['contentline_X-PHONETIC-LAST-NAME'][0].replace('##:::##group_wd##:::##', parsed[1]);
				vCard.tplM['contentline_X-PHONETIC-LAST-NAME'][0]=vCard.tplM['contentline_X-PHONETIC-LAST-NAME'][0].replace('##:::##params_wsc##:::##', parsed[3]);

				// remove the processed parameter
				vcard=vcard.replace(vcard_element[0],'\r\n');

				// find the corresponding group data (if exists)
				if(parsed[1]!='')
				{
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// append the parameter to its parent
						vCard.tplM['contentline_X-PHONETIC-LAST-NAME'][0]+=vcard_element_related[0].substr(2);
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0],'\r\n');
					}
				}
			}
		}
//console.timeEnd('X-PHONETIC-LAST-NAME timer');

//console.time('BDAY timer');
		// ------------------------------------------------------------------------------------- //
		// BDAY
		if(globalDisabledContactAttributes.indexOf('BDAY')==-1)
		{
			vcard_element=vcard.match(vCard.pre['contentline_BDAY']);
			if(vcard_element!=null)
			{
				if(vcard_element.length!=1)	// if the BDAY attribute is present more than once, vCard is considered invalid
				{
					console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
					return false;
				}

				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				parsed=vcard_element[0].match(vCard.pre['contentline_parse']);

				var valid=true;
				try {var date=$.datepicker.parseDate('yy-mm-dd', parsed[4])}
				catch (e) {valid=false}

				if(valid==true)
				{
					tmpvCardEditorRef.find('[data-type="date_bday"]').val(vcardUnescapeValue($.datepicker.formatDate(globalSettings.datepickerformat.value, date))).change();

					// values not directly supported by the editor (old values are kept intact)
					vCard.tplM['contentline_BDAY'][0]=vCard.tplC['contentline_BDAY'];
					vCard.tplM['contentline_BDAY'][0]=vCard.tplM['contentline_BDAY'][0].replace('##:::##group_wd##:::##', parsed[1]);
					vCard.tplM['contentline_BDAY'][0]=vCard.tplM['contentline_BDAY'][0].replace('##:::##params_wsc##:::##', parsed[3]);

					// remove the processed parameter
					vcard=vcard.replace(vcard_element[0],'\r\n');

					// find the corresponding group data (if exists)
					if(parsed[1]!='')
					{
						var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
						while((vcard_element_related=vcard.match(re))!=null)
						{
							// append the parameter to its parent
							vCard.tplM['contentline_BDAY'][0]+=vcard_element_related[0].substr(2);
							// remove the processed parameter
							vcard=vcard.replace(vcard_element_related[0],'\r\n');
						}
					}
				}
				else
				{
					console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
					return false;	// if the date value is invalid, vCard is considered invalid
				}
			}
		}
//console.timeEnd('BDAY timer');

//console.time('X-ABDATE timer');
		// ------------------------------------------------------------------------------------- //
		// X-ABDATE
		if(globalDisabledContactAttributes.indexOf('X-ABDATE')==-1)
		{
			var element_i=0;
			while((vcard_element=vcard.match(vCard.pre['contentline_X-ABDATE']))!=null)
			{
				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				var parsed=vcard_element[0].match(vCard.pre['contentline_parse']);

				var valid=true;
				try {var date=$.datepicker.parseDate('yy-mm-dd', parsed[4])}
				catch (e) {valid=false}

				if(valid==true)
				{
					// parsed_value = [1..]->X-ABDATE-params
					var parsed_value=vcardSplitParam(parsed[3]);

					// click to "add" button if not enought data rows present
					var tmp_sel=tmpvCardEditorRef.find('[data-type="\\%date"]').last();
					if(tmp_sel.find('[data-type="date_value"]').val()!='')
						tmp_sel.find('[data-type="\\%add"]').find('input[type="image"]').click();

					// get the "TYPE=" values array
					var pref=0;	//by default there is no preferred date
					var type_values=Array();
					var j=0;
					for(var i=1; i<parsed_value.length; i++)
						if(parsed_value[i].toLowerCase().indexOf('type=')==0)
						{
							var type_values_tmp=parsed_value[i].substring('type='.length);	//case insensitive remove of /^type=/
							// if one value is a comma separated value of parameters
							var type_values_tmp_2=type_values_tmp.split(',');
							var type_value_tmp_2_lower='';
							for(var m=0; m<type_values_tmp_2.length; m++)
								if((type_value_tmp_2_lower=vcardUnescapeValue(type_values_tmp_2[m]).toLowerCase())!='pref')
									type_values[j++]=type_value_tmp_2_lower;
								else
									pref=1;
						}
					if(parsed[1]!='')	// APPLE SPECIFIC types: find the corresponding group.X-ABLabel: used by APPLE as "TYPE"
					{
						var vcard_element_related=null;
						var re=RegExp('\r\n'+parsed[1].replace('.','\\.X-ABLabel:(.*)')+'\r\n', 'im');
						while((vcard_element_related=vcard.match(re))!=null)
						{
							// get the X-ABLabel value
							if(type_values.indexOf(vcard_element_related[1].toLowerCase())==-1)
								type_values[j++]=vcardUnescapeValue(':'+vcard_element_related[1].toLowerCase()+':');
							// remove the processed parameter
							vcard=vcard.replace(vcard_element_related[0], '\r\n');
						}
					}

					// get the type value and label
					var type_values_us=type_values.unique().sort();
					var type_values_txt=type_values_us.join(',');	// TYPE=INTERNET;TYPE=INTERNET;TYPE=HOME; -> array('HOME','INTERNET') -> 'home,internet'
					var type_values_txt_label=type_values_us.join(' ').replace(vCard.pre['vcardToData_colon_begin_or_end'], '');	// TYPE=INTERNET;TYPE=INTERNET;TYPE=HOME; -> array('HOME','INTERNET') -> 'home internet'
					if(type_values_txt=='')	// if no person type defined, we use the 'other' type as default
						type_values_txt=type_values_txt_label='other';

					// get the default available types
					var type_list=new Array();
					tmpvCardEditorRef.find('[data-type="\\%date"]:eq('+element_i+')').find('[data-type="date_type"]').children().each(function(index, element){type_list[type_list.length]=$(element).attr('data-type');});

					// if an existing type regex matches the new type, use the old type
					// and replace the old type definition with new type definition to comforn the server vCard type format
					for(var i=0; i<type_list.length; i++)
						if(dataTypes['date_type'][type_list[i]]!=undefined && type_values_txt.match(dataTypes['date_type'][type_list[i]])!=null)
						{
							tmpvCardEditorRef.find('[data-type="\\%date"]').find('[data-type="date_type"]').find('[data-type="'+type_list[i]+'"]').attr('data-type', type_values_txt);
							break;
						}

					// date type: select or append to existing types and select
					var select_element=tmpvCardEditorRef.find('[data-type="\\%date"]:eq('+element_i+') [data-type="date_type"]').find('[data-type="'+jqueryEscapeSelector(type_values_txt)+'"]');
					if(select_element.length==1)
						select_element.prop('selected', true);
					else if(select_element.length==0)
					{
						// create the missing option
						var new_opt=tmpvCardEditorRef.find('[data-type="date_type"] :first-child').first().clone().attr('data-type',type_values_txt).text(type_values_txt_label);
						// append the option to all element of this type
						tmpvCardEditorRef.find('[data-type="date_type"] :last-child').prev().after(new_opt);
						// select the option on the current type
						tmpvCardEditorRef.find('[data-type="\\%date"]:eq('+element_i+') [data-type="date_type"]').find('[data-type="'+jqueryEscapeSelector(type_values_txt)+'"]').prop('selected', true);
					}

					tmpvCardEditorRef.find('[data-type="\\%date"]:eq('+element_i+') [data-type="date_value"]').val(vcardUnescapeValue($.datepicker.formatDate(globalSettings.datepickerformat.value, date))).change();

					// values not directly supported by the editor (old values are kept intact)
					vCard.tplM['contentline_X-ABDATE'][element_i]=vCard.tplC['contentline_X-ABDATE'];
					vCard.tplM['contentline_X-ABDATE'][element_i]=vCard.tplM['contentline_X-ABDATE'][element_i].replace('##:::##group_wd##:::##', parsed[1]);
					// if the phone person was preferred, we keep it so (we not support preferred person selection directly by editor)
					if(pref==1)
						vCard.tplM['contentline_X-ABDATE'][element_i]=vCard.tplM['contentline_X-ABDATE'][element_i].replace('##:::##params_wsc##:::##', '##:::##params_wsc##:::##;TYPE=PREF');

					// remove the processed parameter
					vcard=vcard.replace(vcard_element[0], '\r\n');

					// find the corresponding group data (if exists)
					if(parsed[1]!='')
					{
						var vcard_element_related=null;
						var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
						while((vcard_element_related=vcard.match(re))!=null)
						{
							// append the parameter to its parent
							vCard.tplM['contentline_X-ABDATE'][element_i]+=vcard_element_related[0].substr(2);
							// remove the processed parameter
							vcard=vcard.replace(vcard_element_related[0], '\r\n');
						}
					}
					element_i++;
				}
			}
		}
//console.timeEnd('X-ABDATE timer');

//console.time('TITLE timer');
		// ------------------------------------------------------------------------------------- //
		// TITLE -> TODO: what to do if present more than once?
		if(globalDisabledContactAttributes.indexOf('TITLE')==-1)
		{
			vcard_element=vcard.match(vCard.pre['contentline_TITLE']);
			if(vcard_element!=null)
			{
				if(vcard_element.length!=1)	// if the TITLE attribute is present more than once, vCard is considered invalid
				{
					console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
					return false;
				}

				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				parsed=vcard_element[0].match(vCard.pre['contentline_parse']);

				tmpvCardEditorRef.find('[data-type="title"]').val(vcardUnescapeValue(parsed[4]));

				// values not directly supported by the editor (old values are kept intact)
				vCard.tplM['contentline_TITLE'][0]=vCard.tplC['contentline_TITLE'];
				vCard.tplM['contentline_TITLE'][0]=vCard.tplM['contentline_TITLE'][0].replace('##:::##group_wd##:::##', parsed[1]);
				vCard.tplM['contentline_TITLE'][0]=vCard.tplM['contentline_TITLE'][0].replace('##:::##params_wsc##:::##', parsed[3]);

				// remove the processed parameter
				vcard=vcard.replace(vcard_element[0],'\r\n');

				// find the corresponding group data (if exists)
				if(parsed[1]!='')
				{
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// append the parameter to its parent
						vCard.tplM['contentline_TITLE'][0]+=vcard_element_related[0].substr(2);
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0],'\r\n');
					}
				}
			}
		}
//console.timeEnd('TITLE timer');

//console.time('ORG timer');
		// ------------------------------------------------------------------------------------- //
		// ORG -> TODO: what to do if present more than once?
		if(globalDisabledContactAttributes.indexOf('ORG')==-1)
		{
			vcard_element=vcard.match(vCard.pre['contentline_ORG']);
			if(vcard_element!=null)
			{
				if(vcard_element.length!=1)	// if the ORG attribute is present more than once, vCard is considered invalid
				{
					console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
					return false;
				}

				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				parsed=vcard_element[0].match(vCard.pre['contentline_parse']);
				// parsed_value = [0]->Org, [1..]->Org Units
				parsed_value=vcardSplitValue(parsed[4], ';');

				if(parsed_value[0]!=undefined && parsed_value[0]!='')
					tmpvCardEditorRef.find('[data-type="org"]').val(vcardUnescapeValue(parsed_value[0]));
				if(parsed_value[1]!=undefined && parsed_value[1]!='')
					tmpvCardEditorRef.find('[data-type="department"]').val(vcardUnescapeValue(parsed_value[1]));

				// values not directly supported by the editor (old values are kept intact)
				vCard.tplM['contentline_ORG'][0]=vCard.tplC['contentline_ORG'];
				vCard.tplM['contentline_ORG'][0]=vCard.tplM['contentline_ORG'][0].replace('##:::##group_wd##:::##', parsed[1]);
				vCard.tplM['contentline_ORG'][0]=vCard.tplM['contentline_ORG'][0].replace('##:::##params_wsc##:::##', parsed[3]);
				vCard.tplM['contentline_ORG'][0]=vCard.tplM['contentline_ORG'][0].replace('##:::##units_wsc##:::##', (parsed_value[2]==undefined ? '' : ';'+parsed_value.slice(2).join(';')));

				// remove the processed parameter
				vcard=vcard.replace(vcard_element[0],'\r\n');

				// find the corresponding group data (if exists)
				if(parsed[1]!='')
				{
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// append the parameter to its parent
						vCard.tplM['contentline_ORG'][0]+=vcard_element_related[0].substr(2);
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0],'\r\n');
					}
				}
			}
		}
//console.timeEnd('ORG timer');

//console.time('X-ABShowAs timer');
		// ------------------------------------------------------------------------------------- //
		// X-ABShowAs -> TODO: what to do if present more than once?
		var photo_show_org=false;
		if(globalDisabledContactAttributes.indexOf('X-ABShowAs')==-1)
		{
			vcard_element=vcard.match(vCard.pre['X-ABShowAs']);
			if(vcard_element!=null)
			{
				if(vcard_element.length>1)	// if the X-ABShowAs attribute is present more than once, vCard is considered invalid
				{
					console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
					return false;
				}

				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				parsed=vcard_element[0].match(vCard.pre['contentline_parse']);

				if(vcardUnescapeValue(parsed[4]).match(RegExp('^company$','i')))
				{
					tmpvCardEditorRef.find('[data-type="isorg"]').prop('checked', true);
					photo_show_org=true;
				}

				// values not directly supported by the editor (old values are kept intact)
				vCard.tplM['contentline_X-ABShowAs'][0]=vCard.tplC['contentline_X-ABShowAs'];
				vCard.tplM['contentline_X-ABShowAs'][0]=vCard.tplM['contentline_X-ABShowAs'][0].replace('##:::##group_wd##:::##', parsed[1]);
				vCard.tplM['contentline_X-ABShowAs'][0]=vCard.tplM['contentline_X-ABShowAs'][0].replace('##:::##params_wsc##:::##', parsed[3]);
				vCard.tplM['contentline_X-ABShowAs'][0]=vCard.tplM['contentline_X-ABShowAs'][0].replace('##:::##value##:::##', parsed[4]);

				// remove the processed parameter
				vcard=vcard.replace(vcard_element[0],'\r\n');

				// find the corresponding group data (if exists)
				if(parsed[1]!='')
				{
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// append the parameter to its parent
						vCard.tplM['contentline_X-ABShowAs'][0]+=vcard_element_related[0].substr(2);
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0],'\r\n');
					}
				}
			}
		}
//console.timeEnd('X-ABShowAs timer');

//console.time('PHOTO timer');
		// ------------------------------------------------------------------------------------- //
		// PHOTO -> TODO: what to do if present more than once?
		if(photo_show_org)
			tmpvCardEditorRef.find('#photo').toggleClass('photo_user photo_company');

		if(globalDisabledContactAttributes.indexOf('PHOTO')==-1)
		{
			vcard_element=vcard.match(vCard.pre['contentline_PHOTO']);
			if(vcard_element!=null)	// if the PHOTO attribute is present more than once, we use the first value
			{
				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				parsed=vcard_element[0].match(vCard.pre['contentline_parse']);

				var img_type = '';
				var custom_params = '';
				var typeRe = RegExp('TYPE=(.*)', 'i');
				var othersRe = RegExp('(?:ENCODING|VALUE)=.*', 'i');

				parsed_value = vcardSplitParam(parsed[3]);

				for(i=1; i<parsed_value.length; i++) {
					if((type_value=parsed_value[i].match(typeRe))!=undefined) {
						img_type=type_value[1].toLowerCase();
					}
					else if(!othersRe.test(parsed_value[i])) {
						custom_params += ';'+parsed_value[i];
					}
				}

				// support also for unknown type of images (stupid clients)
				var photo = parsed[4];
				var isRemote = RegExp('^https?://', 'i').test(photo);

				var newImg = new Image();
				newImg.src = isRemote ? photo : 'data:image'+(img_type!='' ? '/'+img_type : '')+';base64,'+photo.replace(RegExp('^data:(?:image/.*?;)?(?:base64,)?','i'),'');
				newImg.onload = function(){
					loadImage(this);
				};

				if(isRemote) {
					tmpvCardEditorRef.find('#photoURL, #photoURLHidden').val(photo);
				}

				// values not directly supported by the editor (old values are kept intact)
				vCard.tplM['contentline_PHOTO'][0]=vCard.tplC['contentline_PHOTO'];
				vCard.tplM['contentline_PHOTO'][0]=vCard.tplM['contentline_PHOTO'][0].replace('##:::##group_wd##:::##', parsed[1]);
				vCard.tplM['contentline_PHOTO'][0]=vCard.tplM['contentline_PHOTO'][0].replace('##:::##params_wsc##:::##', '##:::##params_wsc##:::##'+custom_params);

				// remove the processed parameter
				vcard=vcard.replace(vcard_element[0],'\r\n');

				// find the corresponding group data (if exists)
				if(parsed[1]!='')
				{
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// append the parameter to its parent
						vCard.tplM['contentline_PHOTO'][0]+=vcard_element_related[0].substr(2);
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0],'\r\n');
					}
				}

	//			// photo URL is used by iCloud but it requires iCloud session cookie :-(
	//			if(parsed[4].match(RegExp('^https?://','i'))!=null)
	//				tmpvCardEditorRef.find('[data-type="photo"]').attr('src',parsed[4]);
			}
			else	// use default icons (see X-ABShowAs above)
				tmpvCardEditorRef.find('#photo').addClass('photo_blank');
		}
//console.timeEnd('PHOTO timer');

//console.time('ADR timer');
		// ------------------------------------------------------------------------------------- //
		// ADR
		if(globalDisabledContactAttributes.indexOf('ADR')==-1)
		{
			var element_i=0;
			while((vcard_element=vcard.match(vCard.pre['contentline_ADR']))!=null)
			{
				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				var parsed=vcard_element[0].match(vCard.pre['contentline_parse']);
				// parsed_param = [1..]->ADR-params
				var parsed_param=vcardSplitParam(parsed[3]);
				// parsed_value = [1..]->ADR elements
				var parsed_value=vcardSplitValue(parsed[4],';');

				// click to "add" button if not enought data rows present
				var found=0;
				tmpvCardEditorRef.find('[data-type="\\%address"]').last().find('[data-type="value"]').each(
					function(index,element)
					{
						if($(element).val()!='')
						{
							found=1;
							return false;
						}
					}
				);
				if(found)
					tmpvCardEditorRef.find('[data-type="\\%address"]').last().find('[data-type="\\%add"]').find('input[type="image"]').click();

				// get the "TYPE=" values array
				var pref=0;	//by default there is no preferred address
				var type_values=Array();
				var j=0;
				for(var i=1; i<parsed_param.length; i++)
					if(parsed_param[i].toLowerCase().indexOf('type=')==0)
					{
						var type_values_tmp=parsed_param[i].substring('type='.length);	//case insensitive remove of /^type=/
						// if one value is a comma separated value of parameters
						var type_values_tmp_2=type_values_tmp.split(',');
						var type_value_tmp_2_lower='';
						for(var m=0; m<type_values_tmp_2.length; m++)
							if((type_value_tmp_2_lower=vcardUnescapeValue(type_values_tmp_2[m]).toLowerCase())!='pref')
								type_values[j++]=type_value_tmp_2_lower;
							else
								pref=1;
					}
				if(parsed[1]!='')	// APPLE SPECIFIC types: find the corresponding group.X-ABLabel: used by APPLE as "TYPE"
				{
					var vcard_element_related=null;
					var re=RegExp('\r\n'+parsed[1].replace('.','\\.X-ABLabel:(.*)')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// get the X-ABLabel value
						if(type_values.indexOf(vcard_element_related[1].toLowerCase())==-1)
							type_values[j++]=vcardUnescapeValue(':'+vcard_element_related[1].toLowerCase()+':');
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0], '\r\n');
					}
				}
				// find the corresponding group.X-ABADR: used by APPLE as short address country
				var addr_country='';
				if(parsed[1]!='')
				{
					var re=RegExp('\r\n'+parsed[1].replace('.','\\.X-ABADR:(.*)')+'\r\n', 'm');
					if((vcard_element_related=vcard.match(re))!=null)
					{
						// get the X-ABADR value
						addr_country=vcardUnescapeValue(vcard_element_related[1]).toLowerCase();
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0],'\r\n');
					}
				}

				// get the type value and label
				var type_values_us=type_values.unique().sort();
				var type_values_txt=type_values_us.join(',');	// TYPE=HOME;TYPE=HOME;TYPE=FAX; -> array('FAX','HOME') -> 'fax,home'
				var type_values_txt_label=type_values_us.join(' ').replace(vCard.pre['vcardToData_colon_begin_or_end'], '');	// TYPE=HOME;TYPE=HOME;TYPE=FAX; -> array('FAX','HOME') -> 'fax home'
				if(type_values_txt=='')	// if no address type defined, we use the 'work' type as default
					type_values_txt=type_values_txt_label='work';

				// get the default available types
				var type_list=new Array();
				tmpvCardEditorRef.find('[data-type="\\%address"]:eq('+element_i+')').find('[data-type="address_type"]').children().each(function(index, element){type_list[type_list.length]=$(element).attr('data-type');});

				// if an existing type regex matches the new type, use the old type
				// and replace the old type definition with new type definition to comforn the server vCard type format
				for(var i=0;i<type_list.length;i++)
					if(dataTypes['address_type'][type_list[i]]!=undefined && type_values_txt.match(dataTypes['address_type'][type_list[i]])!=null)
					{
						tmpvCardEditorRef.find('[data-type="\\%address"]').find('[data-type="address_type"]').find('[data-type="'+type_list[i]+'"]').attr('data-type', type_values_txt);
						break;
					}

				// address type: select or append to existing types and select
				var select_element=tmpvCardEditorRef.find('[data-type="\\%address"]:eq('+element_i+') [data-type="address_type"]').find('[data-type="'+jqueryEscapeSelector(type_values_txt)+'"]');
				if(select_element.length==1)
					select_element.prop('selected', true);
				else if(select_element.length==0)
				{
					// create the missing option
					var new_opt=tmpvCardEditorRef.find('[data-type="address_type"] :first-child').first().clone().attr('data-type',type_values_txt).text(type_values_txt_label);
					// append the option to all element of this type
					tmpvCardEditorRef.find('[data-type="address_type"] :last-child').prev().after(new_opt);
					// select the option on the current type
					tmpvCardEditorRef.find('[data-type="\\%address"]:eq('+element_i+') [data-type="address_type"]').find('[data-type="'+jqueryEscapeSelector(type_values_txt)+'"]').prop('selected', true);
				}

				var tmp=tmpvCardEditorRef.find('[data-type="\\%address"]:eq('+element_i+')');
				var found;
				if((found=tmp.find('[data-type="country_type"]').children('[data-type="'+jqueryEscapeSelector(addr_country)+'"]')).length>0 || (found=tmp.find('[data-type="country_type"]').children('[data-full-name="'+jqueryEscapeSelector(parsed_value[6])+'"]')).length>0)
					found.prop('selected', true);
				else if(globalSettings.addresscountryequivalence.value.length>0 && parsed_value[6]!=undefined)	// unknown ADR format (country not detected)
				{
// TODO: move regex object directly into config.js
					for(var i=0; i<globalSettings.addresscountryequivalence.value.length; i++)
						if(parsed_value[6].match(RegExp(globalSettings.addresscountryequivalence.value[i].regex, 'i'))!=null)
						{
							tmp.find('[data-type="country_type"]').children('[data-type="'+jqueryEscapeSelector(globalSettings.addresscountryequivalence.value[i].country)+'"]').prop('selected', true);
							break;
						}
				}
				// Note:
				//  if no country detected, the default is used (see globalDefaultAddressCountry in config.js)

				tmp.find('[data-autoselect]').change();
				var streetVals = vcardUnescapeValue(parsed_value[2]).split('\n');

				for(var i=0; i<streetVals.length; i++) {
					var tmp = tmpvCardEditorRef.find('[data-type="\\%address"]:eq('+element_i+') [data-addr-field="street"]').last();
					tmp.val(streetVals[i]);
					if(i<streetVals.length-1) {
						tmp.trigger('keyup.street');
					}
				};

				tmpvCardEditorRef.find('[data-type="\\%address"]:eq('+element_i+') [data-addr-field="pobox"]').val(vcardUnescapeValue(parsed_value[0]));
				tmpvCardEditorRef.find('[data-type="\\%address"]:eq('+element_i+') [data-addr-field="extaddr"]').val(vcardUnescapeValue(parsed_value[1]));
				tmpvCardEditorRef.find('[data-type="\\%address"]:eq('+element_i+') [data-addr-field="locality"]').val(vcardUnescapeValue(parsed_value[3]));
				tmpvCardEditorRef.find('[data-type="\\%address"]:eq('+element_i+') [data-addr-field="region"]').val(vcardUnescapeValue(parsed_value[4]));
				tmpvCardEditorRef.find('[data-type="\\%address"]:eq('+element_i+') [data-addr-field="code"]').val(vcardUnescapeValue(parsed_value[5]));


				// values not directly supported by the editor (old values are kept intact)
				vCard.tplM['contentline_ADR'][element_i]=vCard.tplC['contentline_ADR'];
				vCard.tplM['contentline_ADR'][element_i]=vCard.tplM['contentline_ADR'][element_i].replace('##:::##group_wd##:::##', parsed[1]);
				// if the address was preferred, we keep it so (we not support preferred address selection directly by editor)
				if(pref==1)
					vCard.tplM['contentline_ADR'][element_i]=vCard.tplM['contentline_ADR'][element_i].replace('##:::##params_wsc##:::##', '##:::##params_wsc##:::##;TYPE=PREF');

				// remove the processed parameter
				vcard=vcard.replace(vcard_element[0],'\r\n');

				// find the corresponding group data (if exists)
				if(parsed[1]!='')
				{
					var vcard_element_related=null;
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// append the parameter to its parent
						vCard.tplM['contentline_ADR'][element_i]+=vcard_element_related[0].substr(2);
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0], '\r\n');
					}
				}
				element_i++;
			}
		}
//console.timeEnd('ADR timer');

//console.time('TEL timer');
		// ------------------------------------------------------------------------------------- //
		// TEL
		if(globalDisabledContactAttributes.indexOf('TEL')==-1)
		{
			var element_i=0;
			while((vcard_element=vcard.match(vCard.pre['contentline_TEL']))!=null)
			{
				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				var parsed=vcard_element[0].match(vCard.pre['contentline_parse']);
				// parsed_value = [1..]->TEL-params
				var parsed_value=vcardSplitParam(parsed[3]);

				// click to "add" button if not enought data rows present
				var tmp_sel=tmpvCardEditorRef.find('[data-type="\\%phone"]').last();
				if(tmp_sel.find('[data-type="value"]').val()!='')
					tmp_sel.find('[data-type="\\%add"]').find('input[type="image"]').click();

				// get the "TYPE=" values array
				var pref=0;	//by default there is no preferred phone number
				var type_values=Array();
				var j=0;
				for(var i=1; i<parsed_value.length; i++)
					if(parsed_value[i].toLowerCase().indexOf('type=')==0)
					{
						var type_values_tmp=parsed_value[i].substring('type='.length);	//case insensitive remove of /^type=/
						// if one value is a comma separated value of parameters
						var type_values_tmp_2=type_values_tmp.split(',');
						var type_value_tmp_2_lower='';
						for(var m=0; m<type_values_tmp_2.length; m++)
							if((type_value_tmp_2_lower=vcardUnescapeValue(type_values_tmp_2[m]).toLowerCase())!='pref')
								type_values[j++]=type_value_tmp_2_lower;
							else
								pref=1;
					}
				if(parsed[1]!='')	// APPLE SPECIFIC types: find the corresponding group.X-ABLabel: used by APPLE as "TYPE"
				{
					var vcard_element_related=null;
					var re=RegExp('\r\n'+parsed[1].replace('.','\\.X-ABLabel:(.*)')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// get the X-ABLabel value
						if(type_values.indexOf(vcard_element_related[1].toLowerCase())==-1)
							type_values[j++]=vcardUnescapeValue(':'+vcard_element_related[1].toLowerCase()+':');
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0], '\r\n');
					}
				}

				// get the type value and label
				var type_values_us=type_values.unique().sort();
				var type_values_txt=type_values_us.join(',');	// TYPE=HOME;TYPE=HOME;TYPE=FAX; -> array('FAX','HOME') -> 'fax,home'
				var type_values_txt_label=type_values_us.join(' ').replace(vCard.pre['vcardToData_colon_begin_or_end'], '');	// TYPE=HOME;TYPE=HOME;TYPE=FAX; -> array('FAX','HOME') -> 'fax home'
				if(type_values_txt=='')	// if no phone type defined, we use the 'cell' type as default
					type_values_txt=type_values_txt_label='cell';

				// get the default available types (optimize in future)
				var type_list=new Array();
				tmpvCardEditorRef.find('[data-type="\\%phone"]:eq('+element_i+')').find('[data-type="phone_type"]').children().each(function(index, element){type_list[type_list.length]=$(element).attr('data-type');});

				// if an existing type regex matches the new type, use the old type
				// and replace the old type definition with new type definition to comforn the current vCard type format
				for(var i=0; i<type_list.length; i++)
					if(dataTypes['phone_type'][type_list[i]]!=undefined && type_values_txt.match(dataTypes['phone_type'][type_list[i]])!=null)
					{
						tmpvCardEditorRef.find('[data-type="\\%phone"]').find('[data-type="phone_type"]').find('[data-type="'+type_list[i]+'"]').attr('data-type', type_values_txt);
						break;
					}

				// phone type: select or append to existing types and select
				var select_element=tmpvCardEditorRef.find('[data-type="\\%phone"]:eq('+element_i+') [data-type="phone_type"]').find('[data-type="'+jqueryEscapeSelector(type_values_txt)+'"]');
				if(select_element.length==1)
					select_element.prop('selected', true);
				else if(select_element.length==0)
				{
					// create the missing option
					var new_opt=tmpvCardEditorRef.find('[data-type="phone_type"] :first-child').first().clone().attr('data-type', type_values_txt).text(type_values_txt_label);
					// append the option to all element of this type
					tmpvCardEditorRef.find('[data-type="phone_type"] :last-child').prev().after(new_opt);
					// select the option on the current type
					tmpvCardEditorRef.find('[data-type="\\%phone"]:eq('+element_i+') [data-type="phone_type"]').find('[data-type="'+jqueryEscapeSelector(type_values_txt)+'"]').prop('selected', true);
				}

				tmpvCardEditorRef.find('[data-type="\\%phone"]:eq('+element_i+') [data-type="value"]').val(vcardUnescapeValue(parsed[4]));

				// values not directly supported by the editor (old values are kept intact)
				vCard.tplM['contentline_TEL'][element_i]=vCard.tplC['contentline_TEL'];
				vCard.tplM['contentline_TEL'][element_i]=vCard.tplM['contentline_TEL'][element_i].replace('##:::##group_wd##:::##', parsed[1]);
				// if the phone number was preferred, we keep it so (we not support preferred number selection directly by editor)
				if(pref==1)
					vCard.tplM['contentline_TEL'][element_i]=vCard.tplM['contentline_TEL'][element_i].replace('##:::##params_wsc##:::##', '##:::##params_wsc##:::##;TYPE=PREF');

				// remove the processed parameter
				vcard=vcard.replace(vcard_element[0], '\r\n');

				// find the corresponding group data (if exists)
				if(parsed[1]!='')
				{
					var vcard_element_related=null;
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// append the parameter to its parent
						vCard.tplM['contentline_TEL'][element_i]+=vcard_element_related[0].substr(2);
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0], '\r\n');
					}
				}
				element_i++;
			}
		}
//console.timeEnd('TEL timer');

//console.time('EMAIL timer');
		// ------------------------------------------------------------------------------------- //
		// EMAIL
		if(globalDisabledContactAttributes.indexOf('EMAIL')==-1)
		{
			var element_i=0;
			while((vcard_element=vcard.match(vCard.pre['contentline_EMAIL']))!=null)
			{
				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				var parsed=vcard_element[0].match(vCard.pre['contentline_parse']);
				// parsed_value = [1..]->EMAIL-params
				var parsed_value=vcardSplitParam(parsed[3]);

				// click to "add" button if not enought data rows present
				var tmp_sel=tmpvCardEditorRef.find('[data-type="\\%email"]').last();
				if(tmp_sel.find('[data-type="value"]').val()!='')
					tmp_sel.find('[data-type="\\%add"]').find('input[type="image"]').click();

				// get the "TYPE=" values array
				var pref=0;	//by default there is no preferred email address
				var type_values=Array();
				var j=0;
				for(var i=1; i<parsed_value.length; i++)
					if(parsed_value[i].toLowerCase().indexOf('type=')==0)
					{
						var type_values_tmp=parsed_value[i].substring('type='.length);	//case insensitive remove of /^type=/
						// if one value is a comma separated value of parameters
						var type_values_tmp_2=type_values_tmp.split(',');
						var type_value_tmp_2_lower='';
						for(var m=0; m<type_values_tmp_2.length; m++)
							if((type_value_tmp_2_lower=vcardUnescapeValue(type_values_tmp_2[m]).toLowerCase())!='pref')
								type_values[j++]=type_value_tmp_2_lower;
							else
								pref=1;
					}
				if(parsed[1]!='')	// APPLE SPECIFIC types: find the corresponding group.X-ABLabel: used by APPLE as "TYPE"
				{
					var vcard_element_related=null;
					var re=RegExp('\r\n'+parsed[1].replace('.','\\.X-ABLabel:(.*)')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// get the X-ABLabel value
						if(type_values.indexOf(vcard_element_related[1].toLowerCase())==-1)
							type_values[j++]=vcardUnescapeValue(':'+vcard_element_related[1].toLowerCase()+':');
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0], '\r\n');
					}
				}

				// get the type value and label
				var type_values_us=type_values.unique().sort();
				var type_values_txt=type_values_us.join(',');	// TYPE=INTERNET;TYPE=INTERNET;TYPE=HOME; -> array('HOME','INTERNET') -> 'home,internet'
				var type_values_txt_label=type_values_us.join(' ').replace(vCard.pre['vcardToData_colon_begin_or_end'], '');	// TYPE=INTERNET;TYPE=INTERNET;TYPE=HOME; -> array('HOME','INTERNET') -> 'home internet'
				if(type_values_txt=='')	// if no email type defined, we use the 'home' type as default
					type_values_txt=type_values_txt_label='home,internet';

				// get the default available types
				var type_list=new Array();
				tmpvCardEditorRef.find('[data-type="\\%email"]:eq('+element_i+')').find('[data-type="email_type"]').children().each(function(index, element){type_list[type_list.length]=$(element).attr('data-type');});

				// if an existing type regex matches the new type, use the old type
				// and replace the old type definition with new type definition to comforn the server vCard type format
				for(var i=0; i<type_list.length; i++)
					if(dataTypes['email_type'][type_list[i]]!=undefined && type_values_txt.match(dataTypes['email_type'][type_list[i]])!=null)
					{
						tmpvCardEditorRef.find('[data-type="\\%email"]').find('[data-type="email_type"]').find('[data-type="'+type_list[i]+'"]').attr('data-type', type_values_txt);
						break;
					}

				// email type: select or append to existing types and select
				var select_element=tmpvCardEditorRef.find('[data-type="\\%email"]:eq('+element_i+') [data-type="email_type"]').find('[data-type="'+jqueryEscapeSelector(type_values_txt)+'"]');
				if(select_element.length==1)
					select_element.prop('selected',true);
				else if(select_element.length==0)
				{
					// create the missing option
					new_opt=tmpvCardEditorRef.find('[data-type="email_type"] :first-child').first().clone().attr('data-type',type_values_txt).text(type_values_txt_label);
					// append the option to all element of this type
					tmpvCardEditorRef.find('[data-type="email_type"] :last-child').prev().after(new_opt);
					// select the option on the current type
					tmpvCardEditorRef.find('[data-type="\\%email"]:eq('+element_i+') [data-type="email_type"]').find('[data-type="'+jqueryEscapeSelector(type_values_txt)+'"]').prop('selected',true);
				}
				tmpvCardEditorRef.find('[data-type="\\%email"]:eq('+element_i+') [data-type="value"]').val(vcardUnescapeValue(parsed[4]));

				// values not directly supported by the editor (old values are kept intact)
				vCard.tplM['contentline_EMAIL'][element_i]=vCard.tplC['contentline_EMAIL'];
				vCard.tplM['contentline_EMAIL'][element_i]=vCard.tplM['contentline_EMAIL'][element_i].replace('##:::##group_wd##:::##', parsed[1]);
				// if the phone number was preferred, we keep it so (we not support preferred number selection directly by editor)
				if(pref==1)
					vCard.tplM['contentline_EMAIL'][element_i]=vCard.tplM['contentline_EMAIL'][element_i].replace('##:::##params_wsc##:::##', '##:::##params_wsc##:::##;TYPE=PREF');

				// remove the processed parameter
				vcard=vcard.replace(vcard_element[0], '\r\n');

				// find the corresponding group data (if exists)
				if(parsed[1]!='')
				{
					var vcard_element_related=null;
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// append the parameter to its parent
						vCard.tplM['contentline_EMAIL'][element_i]+=vcard_element_related[0].substr(2);
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0], '\r\n');
					}
				}
				element_i++;
			}
		}
//console.timeEnd('EMAIL timer');

//console.time('X-SOCIALPROFILE timer');
		// ------------------------------------------------------------------------------------- //
		// X-SOCIALPROFILE
		if(globalDisabledContactAttributes.indexOf('X-SOCIALPROFILE')==-1)
		{
			var element_i=0;
			while((vcard_element=vcard.match(vCard.pre['contentline_X-SOCIALPROFILE']))!=null)
			{
				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				var parsed=vcard_element[0].match(vCard.pre['contentline_parse']);
				// parsed_value = [1..]->X-SOCIALPROFILE-params
				var parsed_value=vcardSplitParam(parsed[3]);

				// click to "add" button if not enought data rows present
				var tmp_sel=tmpvCardEditorRef.find('[data-type="\\%profile"]').last();
				if(tmp_sel.find('[data-type="value"]').val()!='')
					tmp_sel.find('[data-type="\\%add"]').find('input[type="image"]').click();

				// get the "TYPE=" values array
				var pref=0;	//by default there is no preferred X-SOCIALPROFILE
				var type_values=Array();
				var j=0;
				var social_user='';
				for(i=1;i<parsed_value.length;i++)
					if(parsed_value[i].toLowerCase().indexOf('x-user=')==0)
						social_user=parsed_value[i].substring('x-user='.length);	//case insensitive remove of /^x-user=/
					else if(parsed_value[i].toLowerCase().indexOf('type=')==0)
					{
						var type_values_tmp=parsed_value[i].substring('type='.length);	//case insensitive remove of /^type=/
						// if one value is a comma separated value of parameters
						var type_values_tmp_2=type_values_tmp.split(',');
						var type_value_tmp_2_lower='';
						for(var m=0; m<type_values_tmp_2.length; m++)
							if((type_value_tmp_2_lower=vcardUnescapeValue(type_values_tmp_2[m]).toLowerCase())!='pref')
								type_values[j++]=type_value_tmp_2_lower;
							else
								pref=1;
					}
				// if there is no x-user parameter extract the username from the URL (last part of the URL before '/')
				if(social_user=='')
					social_user=parsed[4].split('/').slice(-2)[0];

				// get the type value and label
				var type_values_us=type_values.unique().sort();
				var type_values_txt=type_values_us.join(',');	// TYPE=B;TYPE=A;TYPE=C; -> array('B','A','C') -> 'a,b,c'
				var type_values_txt_label=type_values_us.join(' ').replace(vCard.pre['vcardToData_colon_begin_or_end'], '');	// TYPE=B;TYPE=A;TYPE=C; -> array('B','A','C') -> 'a b c'
				if(type_values_txt=='')	// if no X-SOCIALPROFILE type defined, we use the 'twitter' type as default
					type_values_txt=type_values_txt_label='twitter';

				// get the default available types
				var type_list=new Array();
				tmpvCardEditorRef.find('[data-type="\\%profile"]:eq('+element_i+')').find('[data-type="profile_type"]').children().each(function(index, element){type_list[type_list.length]=$(element).attr('data-type');});

				// if an existing type regex matches the new type, use the old type
				// and replace the old type definition with new type definition to comforn the server vCard type format
				for(var i=0; i<type_list.length; i++)
					if(dataTypes['profile_type'][type_list[i]]!=undefined && type_values_txt.match(dataTypes['profile_type'][type_list[i]])!=null)
					{
						tmpvCardEditorRef.find('[data-type="\\%profile"]').find('[data-type="profile_type"]').find('[data-type="'+type_list[i]+'"]').attr('data-type', type_values_txt);
						break;
					}

				// X-SOCIALPROFILE type: select or append to existing types and select
				var select_element=tmpvCardEditorRef.find('[data-type="\\%profile"]:eq('+element_i+') [data-type="profile_type"]').find('[data-type="'+jqueryEscapeSelector(type_values_txt)+'"]');
				if(select_element.length==1)
					select_element.prop('selected',true);
				else if(select_element.length==0)
				{
					// create the missing option
					new_opt=tmpvCardEditorRef.find('[data-type="profile_type"] :first-child').first().clone().attr('data-type',type_values_txt).text(type_values_txt_label);
					// append the option to all element of this type
					tmpvCardEditorRef.find('[data-type="profile_type"] :last-child').prev().after(new_opt);
					// select the option on the current type
					tmpvCardEditorRef.find('[data-type="\\%profile"]:eq('+element_i+') [data-type="profile_type"]').find('[data-type="'+jqueryEscapeSelector(type_values_txt)+'"]').prop('selected', true);
				}
				tmpvCardEditorRef.find('[data-type="\\%profile"]:eq('+element_i+') [data-type="value"]').val(vcardUnescapeValue(type_values_txt=='twitter' ? '@'+social_user : social_user));

				// values not directly supported by the editor (old values are kept intact)
				vCard.tplM['contentline_X-SOCIALPROFILE'][element_i]=vCard.tplC['contentline_X-SOCIALPROFILE'];
				vCard.tplM['contentline_X-SOCIALPROFILE'][element_i]=vCard.tplM['contentline_X-SOCIALPROFILE'][element_i].replace('##:::##group_wd##:::##', parsed[1]);
				// if the X-SOCIALPROFILE was preferred, we keep it so (we not support preferred X-SOCIALPROFILE selection directly by editor)
				if(pref==1)
					vCard.tplM['contentline_X-SOCIALPROFILE'][element_i]=vCard.tplM['contentline_X-SOCIALPROFILE'][element_i].replace('##:::##params_wsc##:::##', '##:::##params_wsc##:::##;TYPE=PREF');

				// remove the processed parameter
				vcard=vcard.replace(vcard_element[0], '\r\n');

				// find the corresponding group data (if exists)
				if(parsed[1]!='')
				{
					var vcard_element_related=null;
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// append the parameter to its parent
						vCard.tplM['contentline_X-SOCIALPROFILE'][element_i]+=vcard_element_related[0].substr(2);
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0], '\r\n');
					}
				}
				element_i++;
			}
		}
//console.timeEnd('X-SOCIALPROFILE timer');

//console.time('URL timer');
		// ------------------------------------------------------------------------------------- //
		// URL
		if(globalDisabledContactAttributes.indexOf('URL')==-1)
		{
			var element_i=0;
			while((vcard_element=vcard.match(vCard.pre['contentline_URL']))!=null)
			{
				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				var parsed=vcard_element[0].match(vCard.pre['contentline_parse']);
				// parsed_value = [1..]->URL-params
				var parsed_value=vcardSplitParam(parsed[3]);

				// click to "add" button if not enought data rows present
				var tmp_sel=tmpvCardEditorRef.find('[data-type="\\%url"]').last();
				if(tmp_sel.find('[data-type="value"]').val()!='')
					tmp_sel.find('[data-type="\\%add"]').find('input[type="image"]').click();

				// get the "TYPE=" values array
				var pref=0;	//by default there is no preferred url address
				var type_values=Array();
				var j=0;
				for(var i=1; i<parsed_value.length; i++)
					if(parsed_value[i].toLowerCase().indexOf('type=')==0)
					{
						var type_values_tmp=parsed_value[i].substring('type='.length);	//case insensitive remove of /^type=/
						// if one value is a comma separated value of parameters
						var type_values_tmp_2=type_values_tmp.split(',');
						var type_value_tmp_2_lower='';
						for(var m=0; m<type_values_tmp_2.length; m++)
							if((type_value_tmp_2_lower=vcardUnescapeValue(type_values_tmp_2[m]).toLowerCase())!='pref')
								type_values[j++]=type_value_tmp_2_lower;
							else
								pref=1;
					}
				if(parsed[1]!='')	// APPLE SPECIFIC types: find the corresponding group.X-ABLabel: used by APPLE as "TYPE"
				{
					var vcard_element_related=null;
					var re=RegExp('\r\n'+parsed[1].replace('.','\\.X-ABLabel:(.*)')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// get the X-ABLabel value
						if(type_values.indexOf(vcard_element_related[1].toLowerCase())==-1)
							type_values[j++]=vcardUnescapeValue(':'+vcard_element_related[1].toLowerCase()+':');
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0], '\r\n');
					}
				}

				// get the type value and label
				var type_values_us=type_values.unique().sort();
				var type_values_txt=type_values_us.join(',');	// TYPE=WORK;TYPE=WORK;TYPE=HOME; -> array('HOME','WORK') -> 'home,work'
				var type_values_txt_label=type_values_us.join(' ').replace(vCard.pre['vcardToData_colon_begin_or_end'], '');	// TYPE=WORK;TYPE=WORK;TYPE=HOME; -> array('HOME','WORK') -> 'home work'
				if(type_values_txt=='')	// if no url type defined, we use the 'homepage' type as default
					type_values_txt=type_values_txt_label='homepage';

				// get the default available types (optimize in future)
				var type_list=new Array();
				tmpvCardEditorRef.find('[data-type="\\%url"]:eq('+element_i+')').find('[data-type="url_type"]').children().each(function(index, element){type_list[type_list.length]=$(element).attr('data-type');});

				// if an existing type regex matches the new type, use the old type
				// and replace the old type definition with new type definition to comforn the server vCard type format
				for(var i=0; i<type_list.length; i++)
					if(dataTypes['url_type'][type_list[i]]!=undefined && type_values_txt.match(dataTypes['url_type'][type_list[i]])!=null)
					{
						tmpvCardEditorRef.find('[data-type="\\%url"]').find('[data-type="url_type"]').find('[data-type="'+type_list[i]+'"]').attr('data-type', type_values_txt);
						break;
					}

				// url type: select or append to existing types and select
				var select_element=tmpvCardEditorRef.find('[data-type="\\%url"]:eq('+element_i+') [data-type="url_type"]').find('[data-type="'+jqueryEscapeSelector(type_values_txt)+'"]');
				if(select_element.length==1)
					select_element.prop('selected', true);
				else if(select_element.length==0)
				{
					// create the missing option
					var new_opt=tmpvCardEditorRef.find('[data-type="url_type"] :first-child').first().clone().attr('data-type',type_values_txt).text(type_values_txt_label);
					// append the option to all element of this type
					tmpvCardEditorRef.find('[data-type="url_type"] :last-child').prev().after(new_opt);
					// select the option on the current type
					tmpvCardEditorRef.find('[data-type="\\%url"]:eq('+element_i+') [data-type="url_type"]').find('[data-type="'+jqueryEscapeSelector(type_values_txt)+'"]').prop('selected', true);
				}

				tmpvCardEditorRef.find('[data-type="\\%url"]:eq('+element_i+') [data-type="value"]').val(vcardUnescapeValue(parsed[4]));

				// values not directly supported by the editor (old values are kept intact)
				vCard.tplM['contentline_URL'][element_i]=vCard.tplC['contentline_URL'];
				vCard.tplM['contentline_URL'][element_i]=vCard.tplM['contentline_URL'][element_i].replace('##:::##group_wd##:::##', parsed[1]);
				// if the URL was preferred, we keep it so (we not support preferred number selection directly by editor)
				if(pref==1)
					vCard.tplM['contentline_URL'][element_i]=vCard.tplM['contentline_URL'][element_i].replace('##:::##params_wsc##:::##', '##:::##params_wsc##:::##;TYPE=PREF');

				// remove the processed parameter
				vcard=vcard.replace(vcard_element[0], '\r\n');

				// find the corresponding group data (if exists)
				if(parsed[1]!='')
				{
					var vcard_element_related=null;
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// append the parameter to its parent
						vCard.tplM['contentline_URL'][element_i]+=vcard_element_related[0].substr(2);
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0], '\r\n');
					}
				}
				element_i++;
			}
		}
//console.timeEnd('URL timer');
//
//console.time('X-ABRELATEDNAMES timer');
		// ------------------------------------------------------------------------------------- //
		// X-ABRELATEDNAMES
		if(globalDisabledContactAttributes.indexOf('X-ABRELATEDNAMES')==-1)
		{
			var element_i=0;
			while((vcard_element=vcard.match(vCard.pre['contentline_X-ABRELATEDNAMES']))!=null)
			{
				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				var parsed=vcard_element[0].match(vCard.pre['contentline_parse']);
				// parsed_value = [1..]->X-ABRELATEDNAMES-params
				var parsed_value=vcardSplitParam(parsed[3]);

				// click to "add" button if not enought data rows present
				var tmp_sel=tmpvCardEditorRef.find('[data-type="\\%person"]').last();
				if(tmp_sel.find('[data-type="value"]').val()!='')
					tmp_sel.find('[data-type="\\%add"]').find('input[type="image"]').click();

				// get the "TYPE=" values array
				var pref=0;	//by default there is no preferred person
				var type_values=Array();
				var j=0;
				for(var i=1; i<parsed_value.length; i++)
					if(parsed_value[i].toLowerCase().indexOf('type=')==0)
					{
						var type_values_tmp=parsed_value[i].substring('type='.length);	//case insensitive remove of /^type=/
						// if one value is a comma separated value of parameters
						var type_values_tmp_2=type_values_tmp.split(',');
						var type_value_tmp_2_lower='';
						for(var m=0; m<type_values_tmp_2.length; m++)
							if((type_value_tmp_2_lower=vcardUnescapeValue(type_values_tmp_2[m]).toLowerCase())!='pref')
								type_values[j++]=type_value_tmp_2_lower;
							else
								pref=1;
					}
				if(parsed[1]!='')	// APPLE SPECIFIC types: find the corresponding group.X-ABLabel: used by APPLE as "TYPE"
				{
					var vcard_element_related=null;
					var re=RegExp('\r\n'+parsed[1].replace('.','\\.X-ABLabel:(.*)')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// get the X-ABLabel value
						if(type_values.indexOf(vcard_element_related[1].toLowerCase())==-1)
							type_values[j++]=vcardUnescapeValue(':'+vcard_element_related[1].toLowerCase()+':');
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0], '\r\n');
					}
				}

				// get the type value and label
				var type_values_us=type_values.unique().sort();
				var type_values_txt=type_values_us.join(',');	// TYPE=INTERNET;TYPE=INTERNET;TYPE=HOME; -> array('HOME','INTERNET') -> 'home,internet'
				var type_values_txt_label=type_values_us.join(' ').replace(vCard.pre['vcardToData_colon_begin_or_end'], '');	// TYPE=INTERNET;TYPE=INTERNET;TYPE=HOME; -> array('HOME','INTERNET') -> 'home internet'
				if(type_values_txt=='')	// if no person type defined, we use the 'other' type as default
					type_values_txt=type_values_txt_label='other';

				// get the default available types
				var type_list=new Array();
				tmpvCardEditorRef.find('[data-type="\\%person"]:eq('+element_i+')').find('[data-type="person_type"]').children().each(function(index, element){type_list[type_list.length]=$(element).attr('data-type');});

				// if an existing type regex matches the new type, use the old type
				// and replace the old type definition with new type definition to comforn the server vCard type format
				for(var i=0; i<type_list.length; i++)
					if(dataTypes['person_type'][type_list[i]]!=undefined && type_values_txt.match(dataTypes['person_type'][type_list[i]])!=null)
					{
						tmpvCardEditorRef.find('[data-type="\\%person"]').find('[data-type="person_type"]').find('[data-type="'+type_list[i]+'"]').attr('data-type', type_values_txt);
						break;
					}

				// person type: select or append to existing types and select
				var select_element=tmpvCardEditorRef.find('[data-type="\\%person"]:eq('+element_i+') [data-type="person_type"]').find('[data-type="'+jqueryEscapeSelector(type_values_txt)+'"]');
				if(select_element.length==1)
					select_element.prop('selected', true);
				else if(select_element.length==0)
				{
					// create the missing option
					var new_opt=tmpvCardEditorRef.find('[data-type="person_type"] :first-child').first().clone().attr('data-type',type_values_txt).text(type_values_txt_label);
					// append the option to all element of this type
					tmpvCardEditorRef.find('[data-type="person_type"] :last-child').prev().after(new_opt);
					// select the option on the current type
					tmpvCardEditorRef.find('[data-type="\\%person"]:eq('+element_i+') [data-type="person_type"]').find('[data-type="'+jqueryEscapeSelector(type_values_txt)+'"]').prop('selected', true);
				}

				tmpvCardEditorRef.find('[data-type="\\%person"]:eq('+element_i+') [data-type="value"]').val(vcardUnescapeValue(parsed[4]));

				// values not directly supported by the editor (old values are kept intact)
				vCard.tplM['contentline_X-ABRELATEDNAMES'][element_i]=vCard.tplC['contentline_X-ABRELATEDNAMES'];
				vCard.tplM['contentline_X-ABRELATEDNAMES'][element_i]=vCard.tplM['contentline_X-ABRELATEDNAMES'][element_i].replace('##:::##group_wd##:::##', parsed[1]);
				// if the phone person was preferred, we keep it so (we not support preferred person selection directly by editor)
				if(pref==1)
					vCard.tplM['contentline_X-ABRELATEDNAMES'][element_i]=vCard.tplM['contentline_X-ABRELATEDNAMES'][element_i].replace('##:::##params_wsc##:::##', '##:::##params_wsc##:::##;TYPE=PREF');

				// remove the processed parameter
				vcard=vcard.replace(vcard_element[0], '\r\n');

				// find the corresponding group data (if exists)
				if(parsed[1]!='')
				{
					var vcard_element_related=null;
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// append the parameter to its parent
						vCard.tplM['contentline_X-ABRELATEDNAMES'][element_i]+=vcard_element_related[0].substr(2);
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0], '\r\n');
					}
				}
				element_i++;
			}
		}
//console.timeEnd('X-ABRELATEDNAMES timer');

//console.time('IMPP timer');
		// ------------------------------------------------------------------------------------- //
		// IMPP
		if(globalDisabledContactAttributes.indexOf('IMPP')==-1)
		{
			var element_i=0;
			while((vcard_element=vcard.match(vCard.pre['contentline_IMPP']))!=null)
			{
				// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
				var parsed=vcard_element[0].match(vCard.pre['contentline_parse']);
				// parsed_value = [1..]->IMPP-params
				var parsed_value=vcardSplitParam(parsed[3]);

				// click to "add" button if not enought data rows present
				var tmp_sel=tmpvCardEditorRef.find('[data-type="\\%im"]').last();
				if(tmp_sel.find('[data-type="value"]').val()!='')
					tmp_sel.find('[data-type="\\%add"]').find('input[type="image"]').click();

				// get the "TYPE=" & "X-SERVICE-TYPE" values array
				var pref=0;	//by default there is no preferred IM
				var type_values=Array();
				var j=0;
				var service_type_value='';
				for(var i=1; i<parsed_value.length; i++)
					if(parsed_value[i].toLowerCase().indexOf('type=')==0)
					{
						var type_values_tmp=parsed_value[i].substring('type='.length);	//case insensitive remove of /^type=/
						// if one value is a comma separated value of parameters
						var type_values_tmp_2=type_values_tmp.split(',');
						var type_value_tmp_2_lower='';
						for(var m=0; m<type_values_tmp_2.length; m++)
							if((type_value_tmp_2_lower=vcardUnescapeValue(type_values_tmp_2[m]).toLowerCase())!='pref')
								type_values[j++]=type_value_tmp_2_lower;
							else
								pref=1;
					}
					else if(parsed_value[i].toLowerCase().indexOf('x-service-type=')==0)
						service_type_value=vcardUnescapeValue(parsed_value[i].substring('x-service-type='.length)).toLowerCase();	//case insensitive remove of /^x-service-type=/
				if(parsed[1]!='')	// APPLE SPECIFIC types: find the corresponding group.X-ABLabel: used by APPLE as "TYPE"
				{
					var vcard_element_related=null;
					var re=RegExp('\r\n'+parsed[1].replace('.','\\.X-ABLabel:(.*)')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// get the X-ABLabel value
						if(type_values.indexOf(vcard_element_related[1].toLowerCase())==-1)
							type_values[j++]=vcardUnescapeValue(':'+vcard_element_related[1].toLowerCase()+':');
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0], '\r\n');
					}
				}

				// get the type value and label
				var type_values_us=type_values.unique().sort();
				type_values_txt=type_values_us.join(',');	// TYPE=INTERNET;TYPE=INTERNET;TYPE=HOME; -> array('HOME','INTERNET') -> 'home,internet'
				type_values_txt_label=type_values_us.join(' ').replace(vCard.pre['vcardToData_colon_begin_or_end'], '');	// TYPE=INTERNET;TYPE=INTERNET;TYPE=HOME; -> array('HOME','INTERNET') -> 'home internet'
				if(type_values_txt=='')	// if no IMPP type defined, we use the 'other' type as default
					type_values_txt=type_values_txt_label='other';

				// get the default available types
				var type_list=new Array();
				tmpvCardEditorRef.find('[data-type="\\%im"]:eq('+element_i+')').find('[data-type="im_type"]').children().each(function(index, element){type_list[type_list.length]=$(element).attr('data-type');});

				// if an existing type regex matches the new type, use the old type
				// and replace the old type definition with new type definition to comforn the server vCard type format
				for(var i=0; i<type_list.length; i++)
					if(dataTypes['im_type'][type_list[i]]!=undefined && type_values_txt.match(dataTypes['im_type'][type_list[i]])!=null)
					{
						tmpvCardEditorRef.find('[data-type="\\%im"]').find('[data-type="im_type"]').find('[data-type="'+type_list[i]+'"]').attr('data-type', type_values_txt);
						break;
					}

				// IM type: select or append to existing types and select
				var select_element=tmpvCardEditorRef.find('[data-type="\\%im"]:eq('+element_i+') [data-type="im_type"]').find('[data-type="'+jqueryEscapeSelector(type_values_txt)+'"]');
				if(select_element.length==1)
					select_element.prop('selected',true);
				else if(select_element.length==0)
				{
					// create the missing option
					var new_opt=tmpvCardEditorRef.find('[data-type="im_type"] :first-child').first().clone().attr('data-type',type_values_txt).text(type_values_txt_label);
					// append the option to all element of this type
					tmpvCardEditorRef.find('[data-type="im_type"] :last-child').prev().after(new_opt);
					// select the option on the current type
					tmpvCardEditorRef.find('[data-type="\\%im"]:eq('+element_i+') [data-type="im_type"]').find('[data-type="'+jqueryEscapeSelector(type_values_txt)+'"]').prop('selected', true);
				}
				// IM service type: select or append to existing types and select
				select_element=tmpvCardEditorRef.find('[data-type="\\%im"]:eq('+element_i+') [data-type="im_service_type"]').find('[data-type="'+jqueryEscapeSelector(service_type_value)+'"]');
				if(select_element.length==1)
					select_element.prop('selected',true);
				else if(select_element.length==0)
				{
					// create the missing option
					new_opt=tmpvCardEditorRef.find('[data-type="im_service_type"] :first-child').first().clone().attr('data-type',service_type_value).text(service_type_value);
					// append the option to all element of this type
					tmpvCardEditorRef.find('[data-type="im_service_type"] :last-child').prev().after(new_opt);
					// select the option on the current type
					tmpvCardEditorRef.find('[data-type="\\%im"]:eq('+element_i+') [data-type="im_service_type"]').find('[data-type="'+jqueryEscapeSelector(service_type_value)+'"]').prop('selected', true);
				}

				tmpvCardEditorRef.find('[data-type="\\%im"]:eq('+element_i+') [data-type="value"]').val(vcardUnescapeValue(parsed[4].replace(vCard.pre['vcardToData_before_val'], '')));

				// values not directly supported by the editor (old values are kept intact)
				vCard.tplM['contentline_IMPP'][element_i]=vCard.tplC['contentline_IMPP'];
				vCard.tplM['contentline_IMPP'][element_i]=vCard.tplM['contentline_IMPP'][element_i].replace('##:::##group_wd##:::##', parsed[1]);
				// if the IMPP accound was preferred, we keep it so (we not support preferred person selection directly by editor)
				if(pref==1)
					vCard.tplM['contentline_IMPP'][element_i]=vCard.tplM['contentline_IMPP'][element_i].replace('##:::##params_wsc##:::##', '##:::##params_wsc##:::##;TYPE=PREF');

				// remove the processed parameter
				vcard=vcard.replace(vcard_element[0], '\r\n');

				// find the corresponding group data (if exists)
				if(parsed[1]!='')
				{
					var vcard_element_related=null;
					var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'im');
					while((vcard_element_related=vcard.match(re))!=null)
					{
						// append the parameter to its parent
						vCard.tplM['contentline_IMPP'][element_i]+=vcard_element_related[0].substr(2);
						// remove the processed parameter
						vcard=vcard.replace(vcard_element_related[0], '\r\n');
					}
				}
				element_i++;
			}
		}
//console.timeEnd('IMPP timer');

		// extension hook
		if(typeof(globalContactsExtVcardToData)=='function')
			vcard=globalContactsExtVcardToData(tmpvCardEditorRef, inputContact, vcard);

		// ------------------------------------------------------------------------------------- //
		// Store the vCard URL to XML
		tmpvCardEditorRef.find('#vCardEditor').attr('data-account-uid', inputContact.accountUID);
		tmpvCardEditorRef.find('#vCardEditor').attr('data-url', inputContact.uid);
		tmpvCardEditorRef.find('#vCardEditor').attr('data-etag', inputContact.etag);

		// UID is stored also in the Cancel button (for Add -> Cancel support /loading the previous active contact/)
		if(inputContact.uid!=undefined)	// occurs if loadContactByVcard is used (it also appends the UID of previous contact into 'data-id')
			tmpvCardEditorRef.find('#vCardEditor').find('[data-type="cancel"]').attr('data-id', inputContact.uid);

		processEditorElements(tmpvCardEditorRef, inputEditorMode, inputIsReadonly, inputContact.isCompany);

		var tmp_optionslist=[];
		// create the list of available collections to the interface
		for(var i=0; i<globalResourceCardDAVList.collections.length; i++)
			if(globalResourceCardDAVList.collections[i].headerOnly!==true && globalResourceCardDAVList.collections[i].makeLoaded===true)
				tmp_optionslist[tmp_optionslist.length]=$('<option data-type=""></option>').attr({'data-type': globalResourceCardDAVList.collections[i].uid, 'data-color': globalResourceCardDAVList.collections[i].color}).text(globalResourceCardDAVList.collections[i].displayvalue);
		// add the list of available collections to the interface
		tmpvCardEditorRef.find('[data-attr-name="_DEST_"]').append(tmp_optionslist);
		// bind the change event (color change in the editor)
		tmpvCardEditorRef.find('[data-attr-name="_DEST_"]').change(function(){
			var selColl=globalResourceCardDAVList.getCollectionByUID($(this).find('option:selected').attr('data-type'));
			globalRefAddContact.attr('data-url', selColl.uid.replace(RegExp('[^/]+$'),''));
			globalRefAddContact.attr('data-filter-url',selColl.uid);	// Set the current addressbook filter uid
			globalRefAddContact.attr('data-account-uid',selColl.accountUID);
			$('#ABContactColor').css('background-color', $(this).find('option:selected').attr('data-color'));
		});

		var collUID='';
		if(typeof inputContact.uid!='undefined')
			 collUID= inputContact.uid.replace(RegExp('[^/]*$'),'');
		else
			collUID = globalRefAddContact.attr('data-url');
		var select_elem=tmpvCardEditorRef.find('[data-attr-name="_DEST_"]').find('[data-type="'+jqueryEscapeSelector(collUID)+'"]');
		if(select_elem.length==1)
			select_elem.prop('selected', true);

		if(typeof globalContactsExtVcardToData!='undefined' && !inputIsCompany)
			tmpvCardEditorRef.find('[data-type="DEST"]').addClass('element_no_display');

		// Unprocessed unrelated vCard elements
		vCard.tplM['unprocessed_unrelated']=vcard;

		if(typeof globalDebug!='undefined' && globalDebug instanceof Array && globalDebug.indexOf('vcard')!=-1)
		{
			console.timeEnd('vcardToData timer');

			if(vcard!='\r\n')
				console.log('Warning: [vCard unprocessed unrelated]: '+vcard);
		}

		//clean error message
		$('#ABMessage').height('0');

		$('#ABContact').children().remove();
		$('#ABContact').append(tmpvCardEditorRef);

		var foundGroup=0;
		for(var adr in globalAddressbookList.vcard_groups)
		{
			if(globalAddressbookList.vcard_groups[adr].length>0)
			{
				foundGroup=1;
				break;
			}
		}

		if(foundGroup)
		{
			if(typeof inputContact.uid!='undefined')
				extendDestSelect();
			else
			{
				var selGroup = $('#ResourceCardDAVList').find('.contact_group').find(':input.resourceCardDAV_selected').attr('data-id');
				extendDestSelect(selGroup);
				if(typeof selGroup!= 'undefined')
					select_elem.text(localization[globalInterfaceLanguage].txtVcardGroupsTextSingle.replace('%coll%',globalResourceCardDAVList.getCollectionByUID(collUID).displayvalue));
			}
		}
		if(typeof inputContact.uid !='undefined')
			checkForVcardGroups(inputContact.uid);
		if(typeof(globalContactsSelectProcess)=='function')
			globalContactsSelectProcess(tmpvCardEditorRef, inputContact);

		return true;
	}
	else
	{
		console.log("Error: '"+inputContact.uid+"': unable to parse vCard");
		return false;
	}
}

function basicRFCFixesAndCleanup(vcardString)
{
	// If vCard contains only '\n' instead of '\r\n' we fix it
	if(vcardString.match(vCard.pre['basicRFCFixesAndCleanup_r-m'])==null)
		vcardString=vcardString.replace(vCard.pre['basicRFCFixesAndCleanup_n-gm'], '\r\n');

	// remove multiple empty lines
	vcardString=vcardString.replace(vCard.pre['basicRFCFixesAndCleanup_rnp-gm'], '\r\n');

	// append '\r\n' to the end of the vCard if missing
	if(vcardString[vcardString.length-1]!='\n')
		vcardString+='\r\n';

	// remove line folding
	vcardString=vcardString.replace(vCard.pre['basicRFCFixesAndCleanup_rnwsp-gm'], '');

	// RFC-obsolete PHOTO fix
	vcardString=vcardString.replace(vCard.pre['basicRFCFixesAndCleanup_photo-gim'], '\r\nPHOTO:');

	// ------------------------------------------------------------------------------------- //
	// begin CATEGORIES merge to one CATEGORIES attribute (sorry for related attributes)
	// note: we cannot do this in additionalRFCFixes or normalizeVcard
	var categoriesArr=[];
	var vcard_element=null;
	var vcard_element_related=null;
	while((vcard_element=vcardString.match(vCard.pre['contentline_CATEGORIES']))!=null)
	{
		// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
		var parsed=vcard_element[0].match(vCard.pre['contentline_parse']);

		categoriesArr[categoriesArr.length]=parsed[4];

		// remove the processed parameter
		vcardString=vcardString.replace(vcard_element[0],'\r\n');

		// find the corresponding group data (if exists)
		if(parsed[1]!='')
		{
			var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'm');
			while((vcard_element_related=vcardString.match(re))!=null)
				// remove the processed parameter
				vcardString=vcardString.replace(vcard_element_related[0],'\r\n');
		}
	}
	var categoriesTxt=categoriesArr.join(',');

	var tmp=vcardString.split('\r\n');
	tmp.splice(tmp.length-2,0,'CATEGORIES:'+categoriesTxt);
	// end CATEGORIES cleanup
	// ------------------------------------------------------------------------------------- //

	// ------------------------------------------------------------------------------------- //
	// begin SoGo fixes (company vCards without N and FN attributes)
	//  we must perform vCard fixes here because the N and FN attributes are used in the collection list

	// if N attribute is missing we add it
	if(vcardString.match(vCard.pre['contentline_N'])==null)
		tmp.splice(1,0,'N:;;;;');

	// if FN attribute is missing we add it
	if(vcardString.match(vCard.pre['contentline_FN'])==null)
	{
		var fn_value='';
		var tmp2=null;
		// if there is an ORG attribute defined, we use the company name as fn_value (instead of empty string)
		if((tmp2=vcardString.match(vCard.pre['contentline_ORG']))!=null)
		{
			// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
			var parsed=tmp2[0].match(vCard.pre['contentline_parse']);
			// parsed_value = [0]->Org, [1..]->Org Units
			var parsed_value=vcardSplitValue(parsed[4],';');
			fn_value=parsed_value[0];
		}
		tmp.splice(1,0,'FN:'+fn_value);
	}
	vcardString=tmp.join('\r\n');
	// end SoGo fixes
	// ------------------------------------------------------------------------------------- //

	return {vcard: vcardString, categories: categoriesTxt};
}

function additionalRFCFixes(vcardString)
{
	// ------------------------------------------------------------------------------------- //
	var tmp=vcardString.split('\r\n');

	// update non-RFC attributes (special transformations)
	for(var i=1;i<tmp.length-2;i++)
	{
		// parsed = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
		var parsed=('\r\n'+tmp[i]+'\r\n').match(vCard.pre['contentline_parse']);

		if(parsed!=null)
		{
			switch(parsed[2])
			{
				case 'TEL':
					// remove the non-RFC params (Evolution bug)
					var parsed_value=vcardSplitParam(parsed[3]);
					for(var j=parsed_value.length-1;j>0;j--)
						if(parsed_value[j].match(vCard.pre['additionalRFCFixes_tel-param'])==null)
							parsed_value.splice(j,1);

					parsed[3]=parsed_value.join(';');
					tmp[i]=parsed[1]+parsed[2]+parsed[3]+':'+parsed[4];
					break;
				case 'EMAIL':
					// transform the params separated by ',' to 'TYPE=' params and remove the non-RFC params (Evolution bug)
					var parsed_value=vcardSplitParam(parsed[3]);
					for(var j=parsed_value.length-1;j>0;j--)
						if(parsed_value[j].match(vCard.pre['additionalRFCFixes_email-param'])==null)
						{
							if((transformed=parsed_value[j].replace(vCard.pre['additionalRFCFixes_comma-g'], ';TYPE=')).match(vCard.pre['additionalRFCFixes_email-params'])!=null)
								parsed_value[j]=transformed;
							else
								parsed_value.splice(j,1);
						}

					parsed[3]=parsed_value.join(';');
					// add missing and required "internet" type (Sogo bug)
					if(parsed[3].match(vCard.pre['additionalRFCFixes_type-internet'])==null)
						parsed[3]+=';TYPE=INTERNET';

					tmp[i]=parsed[1]+parsed[2]+parsed[3]+':'+parsed[4];
					break;
// the upcoming vCard 4.0 allows params for URL and many clients use it also in vCard 3.0
//				case 'URL':	// no params allowed for URL (Evolution bug)
//					tmp[i]=parsed[1]+parsed[2]+':'+parsed[4];
//					break;
				default:
					break;
			}
		}
	}
	vcardString=tmp.join('\r\n');
	// ------------------------------------------------------------------------------------- //

	return vcardString;
}

// transform the vCard to the editor expected format
function normalizeVcard(vcardString)
{
	var parsed=null;
	// remove the PRODID element (unusable for the editor)
	while((parsed=vcardString.match(vCard.pre['contentline_PRODID']))!=null)
		vcardString=vcardString.replace(parsed[0],'\r\n');

	var tmp=vcardString.split('\r\n');
	var vcard_begin=tmp[0].replace(vCard.pre['normalizeVcard_group_w_dot'], 'item.')+'\r\n';
	var vcard_end=tmp[tmp.length-2].replace(vCard.pre['normalizeVcard_group_w_dot'], 'item.')+'\r\n';
	// remove the vCard BEGIN and END and all duplicate entries (usually created by other buggy clients)
	vcardString='\r\n'+tmp.slice(1, tmp.length-2).join('\r\n')+'\r\n';

	var vcard_out_grouped=new Array();
	while((parsed=vcardString.match(vCard.pre['contentline_parse']))!=null)
	{
		var additional_related='';
		var vcard_element_related='';
		var attr_name='';
		var params_swc='';
		var attr_value='';

		// parsed = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
		var params_array=vcardSplitParam(parsed[3]);
		// we transform the old X-* IM attributes to new IMPP (internally used by editor)
		switch(parsed[2])
		{
			case 'X-ABDATE':
				attr_name=parsed[2];
				params_swc=params_array.sort().join(';').toUpperCase();	// we need upper case here to remove duplicate values later
				tmp=parsed[4].match(vCard.pre['normalizeVcard_date']);
				attr_value=tmp[1]+'-'+tmp[2]+'-'+tmp[3];	// sorry, we support only date (no date-time support)
				break;
			case 'X-EVOLUTION-ANNIVERSARY':
			case 'X-ANNIVERSARY':
				attr_name='X-ABDATE';
				params_swc='';
				tmp=parsed[4].match(vCard.pre['normalizeVcard_date']);
				attr_value=tmp[1]+'-'+tmp[2]+'-'+tmp[3];	// sorry, we support only date (no date-time support)
				additional_related='X-ABLabel:_$!<Anniversary>!$_\r\n';

				// check for X-ABDATE attribute with the same value
				var found=false;
				var tmpVcardString=vcardString;
				var tmp_vcard_element=null;
				while((tmp_vcard_element=tmpVcardString.match(vCard.pre['contentline_X-ABDATE']))!=null)
				{
					// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
					var tmp_parsed=tmp_vcard_element[0].match(vCard.pre['contentline_parse']);

					if(tmp_parsed[4]==parsed[4] || tmp_parsed[4]==attr_value)
					{
						found=true;
						break;
					}
					tmpVcardString=tmpVcardString.replace(tmp_vcard_element[0], '\r\n');
				}

				if(found==true)
				{
					// remove the processed element
					vcardString=vcardString.replace(parsed[0], '\r\n');
					// find the corresponding group data (if exists)
					if(parsed[1]!='')
					{
						var re=RegExp('\r\n'+parsed[1].replace('.', '\\..*')+'\r\n', 'm');
						while((vcard_element_related=vcardString.match(re))!=null)
							vcardString=vcardString.replace(vcard_element_related[0], '\r\n');	// remove the processed parameter
					}
					continue;
				}
				break;
			case 'BDAY':
				attr_name=parsed[2];
				params_swc=';VALUE=date';
				tmp=parsed[4].match(vCard.pre['normalizeVcard_date']);
				attr_value=tmp[1]+'-'+tmp[2]+'-'+tmp[3];	// sorry, we support only date (no date-time support)
				break;
			case 'X-AIM':
			case 'X-JABBER':
			case 'X-MSN':
			case 'X-YAHOO':
			case 'X-YAHOO-ID':
			case 'X-ICQ':
			case 'X-SKYPE':
				attr_name='IMPP';
				if(params_array.length==0)
					params_array[0]='';	// after the join it generates ';' after the attribute name
				params_array[params_array.length]='X-SERVICE-TYPE='+parsed[2].replace(vCard.pre['normalizeVcard_xb_or_ide'], '');	// extract the IM type
				params_swc=params_array.sort().join(';');
				attr_value=parsed[4];

				// check for IMPP attribute with the same value
				var found=false;
				var tmpVcardString=vcardString;
				var tmp_vcard_element=null;
				while((tmp_vcard_element=tmpVcardString.match(vCard.pre['contentline_IMPP']))!=null)
				{
					// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
					var tmp_parsed=tmp_vcard_element[0].match(vCard.pre['contentline_parse']);

					if(tmp_parsed[4].replace(vCard.pre['normalizeVcard_before_val'], '')==parsed[4])
					{
						found=true;
						break;
					}
					tmpVcardString=tmpVcardString.replace(tmp_vcard_element[0], '\r\n');
				}

				if(found==true)
				{
					// remove the processed element
					vcardString=vcardString.replace(parsed[0], '\r\n');
					// find the corresponding group data (if exists)
					if(parsed[1]!='')
					{
						var re=RegExp('\r\n'+parsed[1].replace('.', '\\..*')+'\r\n', 'm');
						while((vcard_element_related=vcardString.match(re))!=null)
							vcardString=vcardString.replace(vcard_element_related[0], '\r\n');	// remove the processed parameter
					}
					continue;
				}
				break;
			case 'IMPP':
				attr_name=parsed[2];
				params_swc=params_array.sort().join(';').toUpperCase();	// we need upper case here to remove duplicate values later

				// remove the '*:' from the '*:value'
				//  but we add them back during the vcard generation from the interface
				attr_value=vcardSplitValue(parsed[4], ':').splice(1, 1).join('')
				break;
			case 'X-ASSISTANT':
			case 'X-EVOLUTION-ASSISTANT':
				attr_name='X-ABRELATEDNAMES';
				params_swc='';
				attr_value=parsed[4];
				additional_related='X-ABLabel:_$!<Assistant>!$_\r\n';

				// check for X-ABRELATEDNAMES attribute with the same value
				var found=false;
				var tmpVcardString=vcardString;
				var tmp_vcard_element=null;
				while((tmp_vcard_element=tmpVcardString.match(vCard.pre['contentline_X-ABRELATEDNAMES']))!=null)
				{
					// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
					var tmp_parsed=tmp_vcard_element[0].match(vCard.pre['contentline_parse']);

					if(tmp_parsed[4]==parsed[4])
					{
						found=true;
						break;
					}
					tmpVcardString=tmpVcardString.replace(tmp_vcard_element[0], '\r\n');
				}

				if(found==true)
				{
					// remove the processed element
					vcardString=vcardString.replace(parsed[0], '\r\n');
					// find the corresponding group data (if exists)
					if(parsed[1]!='')
					{
						var re=RegExp('\r\n'+parsed[1].replace('.', '\\..*')+'\r\n', 'm');
						while((vcard_element_related=vcardString.match(re))!=null)
							vcardString=vcardString.replace(vcard_element_related[0], '\r\n');	// remove the processed parameter
					}
					continue;
				}
				break;
			case 'X-MANAGER':
			case 'X-EVOLUTION-MANAGER':
				attr_name='X-ABRELATEDNAMES';
				params_swc='';
				attr_value=parsed[4];
				additional_related='X-ABLabel:_$!<Manager>!$_\r\n';

				// check for X-ABRELATEDNAMES attribute with the same value
				var found=false;
				var tmpVcardString=vcardString;
				var tmp_vcard_element=null;
				while((tmp_vcard_element=tmpVcardString.match(vCard.pre['contentline_X-ABRELATEDNAMES']))!=null)
				{
					// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
					var tmp_parsed=tmp_vcard_element[0].match(vCard.pre['contentline_parse']);

					if(tmp_parsed[4]==parsed[4])
					{
						found=true;
						break;
					}
					tmpVcardString=tmpVcardString.replace(tmp_vcard_element[0], '\r\n');
				}

				if(found==true)
				{
					// remove the processed element
					vcardString=vcardString.replace(parsed[0], '\r\n');
					// find the corresponding group data (if exists)
					if(parsed[1]!='')
					{
						var re=RegExp('\r\n'+parsed[1].replace('.', '\\..*')+'\r\n', 'm');
						while((vcard_element_related=vcardString.match(re))!=null)
							vcardString=vcardString.replace(vcard_element_related[0], '\r\n');	// remove the processed parameter
					}
					continue;
				}
				break;
			case 'X-SPOUSE':
			case 'X-EVOLUTION-SPOUSE':
				attr_name='X-ABRELATEDNAMES';
				params_swc='';
				attr_value=parsed[4];
				additional_related='X-ABLabel:_$!<Spouse>!$_\r\n';

				// check for X-ABRELATEDNAMES attribute with the same value
				var found=false;
				var tmpVcardString=vcardString;
				var tmp_vcard_element=null;
				while((tmp_vcard_element=tmpVcardString.match(vCard.pre['contentline_X-ABRELATEDNAMES']))!=null)
				{
					// parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
					var tmp_parsed=tmp_vcard_element[0].match(vCard.pre['contentline_parse']);

					if(tmp_parsed[4]==parsed[4])
					{
						found=true;
						break;
					}
					tmpVcardString=tmpVcardString.replace(tmp_vcard_element[0], '\r\n');
				}

				if(found==true)
				{
					// remove the processed element
					vcardString=vcardString.replace(parsed[0], '\r\n');
					// find the corresponding group data (if exists)
					if(parsed[1]!='')
					{
						var re=RegExp('\r\n'+parsed[1].replace('.', '\\..*')+'\r\n', 'm');
						while((vcard_element_related=vcardString.match(re))!=null)
							vcardString=vcardString.replace(vcard_element_related[0], '\r\n');	// remove the processed parameter
					}
					continue;
				}
				break;
			default:
				attr_name=parsed[2];
				params_swc=params_array.sort().join(';');
				attr_value=parsed[4];
				break;
		}
		// remove the processed element
		vcardString=vcardString.replace(parsed[0],'\r\n');

		if(attr_name!='FN' && attr_name!='N' && attr_value=='')	// attributes with empty values are not supported and are removed here
		{
			// find the corresponding group data (if exists)
			if(parsed[1]!='')
			{
				var re=RegExp('\r\n'+parsed[1].replace('.','\\..*')+'\r\n', 'm');
				while((vcard_element_related=vcardString.match(re))!=null)
					// remove the processed parameter
					vcardString=vcardString.replace(vcard_element_related[0], '\r\n');
			}
			continue;
		}

		// add the new element to output array (without group)
		grouped_elem=new Array();
		grouped_elem[grouped_elem.length]=attr_name+params_swc+':'+attr_value+'\r\n';
		if(additional_related!='')	// used if we manually add related items as a part of transformation
			grouped_elem[grouped_elem.length]=additional_related;
		// find the corresponding group data (if exists)
		if(parsed[1]!='')
		{
			var re=RegExp('\r\n'+parsed[1].replace('.','\\.(.*)')+'\r\n', 'm');
			while((vcard_element_related=vcardString.match(re))!=null)
			{
				// add the related element to array
				grouped_elem[grouped_elem.length]=vcard_element_related[1]+'\r\n';
				// remove the processed parameter
				vcardString=vcardString.replace(vcard_element_related[0], '\r\n');
			}
		}
		// add the new grouped element to output
		vcard_out_grouped[vcard_out_grouped.length]=grouped_elem.sort().join('');
	}
//
// after the transformation and grouping we remove all identical elements and preserve sorting
	//  (for example X-AIM and IMPP;X-SERVICE-TYPE=AIM, ...)
	for(var i=vcard_out_grouped.length-1;i>=0;i--)
		if(vcard_out_grouped.slice(0,i).indexOf(vcard_out_grouped[i])!=-1)
			vcard_out_grouped.splice(i,1);

	// add new group names ...
	elemCounter=0;
	for(i=0;i<vcard_out_grouped.length;i++)
		if(vcard_out_grouped[i].match(vCard.pre['normalizeVcard_rn-gm']).length>1)
			vcard_out_grouped[i]=(('\r\n'+vcard_out_grouped[i].substring(0, vcard_out_grouped[i].length-2)).replace(vCard.pre['normalizeVcard_rn-gm'], '\r\nitem'+(elemCounter++)+'.')+'\r\n').substring(2);

	vcard_out_grouped.unshift(vcard_begin);
	vcard_out_grouped.push(vcard_end);

	return vcard_out_grouped.join('');
}
