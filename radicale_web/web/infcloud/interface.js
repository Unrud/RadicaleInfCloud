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

function checkTimezone(timezone)
{
	if(timezone in timezones)
		return timezone;
	else if(timezone in timezones_alt)
		return checkTimezone(timezones_alt[timezone]);
	return null;
}
function CalDAVeditor_cleanup(repeatHash)
{
	if(typeof repeatHash!='undefined')
		CalDAVcleanupRegexEnvironment(repeatHash);
	else
		CalDAVcleanupRegexEnvironment();

	if(typeof repeatHash==='undefined' || repeatHash==='form')
	{
		/*************************** BAD HACKS SECTION ***************************/
		/* IE or FF */
		if($.browser.msie || $.browser.mozilla)
		{
			// ADD empty SVG to interface (we will replace it later)
			$('<svg data-type="select_icon"></svg>').css('display', 'none').insertAfter($('#event_details_template, #todo_details_template').find('select'));
		}
		/*************************** END OF BAD HACKS SECTION ***************************/

		/*************************** BAD HACKS SECTION ***************************/
		if($.browser.msie || $.browser.mozilla)
		{
			var newSVG=$(SVG_select).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-19px', 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug
			$('#event_details_template, #todo_details_template').find('svg[data-type="select_icon"]').replaceWith($('<div>').append($(newSVG).clone()).html());
		}
		/*************************** END OF BAD HACKS SECTION ***************************/
	}
}

function animate_messageCalendar(messageSelector, messageTextSelector, duration, operation)
{
	if(operation==undefined)
		operation='+=';
	var height=$(messageTextSelector).height()+14;
	var animation=500;

	$(messageSelector).animate({
			'max-height': height+'px',
			height: (operation==undefined ? '+=' : operation)+height+'px'
		},
		animation,
		function(){
			if(operation=='+=')
				setTimeout(function(){animate_messageCalendar(messageSelector, messageTextSelector, 0, '-=');}, duration);
		}
	);
	return duration+2*animation;
}

function show_editor_messageCalendar(inputPosition, inputSetClass, inputMessage, inputDuration, callback)
{
	var formShown='';

	if($('#todo_details_template').css('display')!='none')
		formShown='Todo';
	else
		formShown='Event';

	if(inputPosition==undefined || inputPosition=='in')
	{
		messageSelector='#'+formShown+'InMessage';
		messageTextSelector='#'+formShown+'InMessageText';
	}
	else
	{
		messageSelector='#'+formShown+'Message';
		messageTextSelector='#'+formShown+'MessageText';
	}

	$(messageTextSelector).attr('class', inputSetClass);
	$(messageTextSelector).text(inputMessage);

	var a=animate_messageCalendar(messageSelector, messageTextSelector, inputDuration);

	if(callback!=undefined)
		callback(a);
}

function show_editor_loader_messageCalendar(inputForm, inputSetClass, inputMessage, callback)
{
	var formShown='';

	if(inputForm=='vtodo')
		formShown='#todoLoader';
	else
		formShown='#CAEvent';

	messageSelector=formShown+' .saveLoader';
	messageTextSelector=formShown+' .saveLoaderInfo';

	$(messageTextSelector).addClass(inputSetClass);
	$(messageTextSelector).text(inputMessage);
	setTimeout(function(){
		if(inputForm=='vtodo')
			$(formShown).hide();
		else
			$(messageSelector).hide();
		$(messageTextSelector).text('');
		$(messageTextSelector).removeClass(inputSetClass);
		if(callback!=undefined)
			callback(globalHideInfoMessageAfter);
	}, globalHideInfoMessageAfter);

}

function items(etag, from, end, title, isall, uid, rid, ev_id, note, displayValue, alertTime, alertNote, untilDate, type, interval, after, repeatStart, repeatEnd, byMonthDay, repeatCount, realRepeatCount, vcalendar, location, alertTimeOut, timeZone, realStart ,realEnd, byDay, rec_id, wkst, classType, avail, hrefUrl,compareString,priority,status,ruleString)
{
	this.etag=etag;
	this.id=uid;
	this.start=from;
	this.end=end;
	this.title=title;
	this.allDay=isall;
	this.res_id=rid;
	this.ev_id=ev_id;
	this.note=note;
	this.displayValue=displayValue;
	this.alertTime=alertTime;
	this.alertNote=alertNote;
	this.untilDate=untilDate;
	this.repeatStart=repeatStart;
	this.repeatEnd=repeatEnd;
	this.type=type;
	this.interval=interval;
	this.after=after;
	this.byMonthDay=byMonthDay;
	this.repeatCount=repeatCount;
	this.realRepeatCount=realRepeatCount;
	this.vcalendar=vcalendar;
	this.location=location;
	this.alertTimeOut=alertTimeOut;
	this.timeZone=timeZone;
	this.realStart=realStart;
	this.realEnd=realEnd;
	this.byDay=byDay;
	this.rec_id=rec_id;
	this.wkst=wkst;
	this.classType=classType;
	this.avail=avail;
	this.hrefUrl=hrefUrl;
	this.compareString=compareString;
	this.priority=priority;
	this.status=status;
	this.searchvalue=title.toLowerCase().replace(vCalendar.pre['compressNewLineRex']).multiReplace(globalSearchTransformAlphabet);
	this.ruleString=ruleString;
}

function todoItems(from, to, untilDate, type, interval, after, wkst, repeatStart, repeatEnd, repeatCount, realRepeatCount, byDay, location, note, title, uid, vcalendar, etag, alertTime, alertNote, status, filterStatus,  rec_id, repeatHash,  percent, displayValue, res_id, compareString, timeZone, realStart, realEnd, alertTimeOut,classType, url, completedOn, sequence,priority,renderPriority, finalString,ruleString)
{
	this.start=from;
	this.end=to;
	this.untilDate=untilDate;
	this.type=type;
	this.interval=interval;
	this.after=after;
	this.wkst=wkst;
	this.repeatStart=repeatStart;
	this.repeatEnd=repeatEnd;
	this.repeatCount=repeatCount;
	this.realRepeatCount=realRepeatCount;
	this.byDay=byDay;
	this.location=location;
	this.note=note;
	this.title=title;
	this.id=uid;
	this.vcalendar=vcalendar;
	this.etag=etag;
	this.alertTime=alertTime;
	this.alertNote=alertNote;
	this.status=status;
	this.filterStatus=filterStatus;
	this.percent=percent;
	this.displayValue=displayValue;
	this.res_id=res_id;
	this.compareString=compareString;
	this.alertTimeOut=alertTimeOut;
	this.timeZone=timeZone;
	this.realStart=realStart;
	this.realEnd=realEnd;
	this.classType=classType;
	this.url=url;
	this.rec_id= rec_id;
	this.repeatHash= repeatHash;
	this.completedOn=completedOn;
	this.sequence=sequence;
	this.priority=priority;
	this.renderPriority=renderPriority;
	this.finalString=finalString;
	this.searchvalue=title.toLowerCase().replace(vCalendar.pre['compressNewLineRex']).multiReplace(globalSearchTransformAlphabet);
	this.ruleString=ruleString;
}

function setLoadingLimit(forceLoad, allSyncMode)
{
	if(forceLoad)
	{
		if(globalSettings.eventstartpastlimit.value!=null && (allSyncMode || globalLimitLoading=='past'))
		{
			var pastDate = new Date(globalLoadedLimit.getTime());
			pastDate.setDate(pastDate.getDate()-7);
			globalBeginPast = new Date(pastDate.getTime());
		}
		if(globalSettings.eventstartfuturelimit.value!=null && (allSyncMode || globalLimitLoading=='future'))
		{
			var futureDate = new Date(globalToLoadedLimit.getTime());
			futureDate.setDate(futureDate.getDate()+14);
			globalBeginFuture = new Date(futureDate.getTime());
		}
	}
}

function initSearchEngine() {
	globalCalDAVQs=$('input[data-type="PH_CalDAVsearch"]').quicksearch(globalEventList.displayEventsArray,{
		delay: 500,
		hide: function() {
			this.hidden=true;
			$('#SystemCalDavZAP').find('.event_item[data-id="'+this.id+'"]').each(function(){
				$(this).addClass('searchCalDAV_hide');
				if(this.tagName.toLowerCase()=='tr' && !$(this).siblings().addBack().not('.searchCalDAV_hide').length)
					$(this).parent().prev().find('tr').addClass('searchCalDAV_hide');
			});
		},
		show: function() {
			this.hidden=false;
			$('#SystemCalDavZAP').find('.event_item[data-id="'+this.id+'"]').each(function(){
				$(this).removeClass('searchCalDAV_hide');
				if(this.tagName.toLowerCase()=='tr')
					$(this).parent().prev().find('tr').removeClass('searchCalDAV_hide');
			});
		},
		prepareQuery: function(val) {
			return val.multiReplace(globalSearchTransformAlphabet).toLowerCase().split(' ');
		}
	});

	globalCalDAVTODOQs=$('input[data-type="PH_CalDAVTODOsearch"]').quicksearch(globalEventList.displayTodosArray,{
		delay: 500,
		onAfter: function () {
			if(!$('#TodoDisabler').is(':visible'))
				$('#todoList').fullCalendar('selectEvent');
		},
		hide: function() {
			this.hidden=true;
			$('#SystemCalDavTODO').find('.event_item[data-id="'+this.id+'"]').addClass('searchCalDAV_hide');
		},
		show: function() {
			this.hidden=false;
			$('#SystemCalDavTODO').find('.event_item[data-id="'+this.id+'"]').removeClass('searchCalDAV_hide');
		},
		prepareQuery: function(val) {
			return val.multiReplace(globalSearchTransformAlphabet).toLowerCase().split(' ');
		}
	});
}

//SORRY FOR THAT-----------------------------------------------------------------------------------------------------
function checkEventLoader(inputCounter, needRefresh)
{
	inputCounter.counter++;
	if(inputCounter.counter==inputCounter.collectionLength)
	{
		if(inputCounter.listType=='vevent')
			$('#ResourceCalDAVList [data-id="'+inputCounter.uid+'"]').removeClass('r_operate');
		else
			$('#ResourceCalDAVTODOList [data-id="'+inputCounter.uid+'"]').removeClass('r_operate');

		if((globalLimitTodoLoading=='' && globalLimitLoading=='') || ((inputCounter.listType=='vtodo' && globalSettings.todopastlimit.value==null) || (inputCounter.listType=='vevent' && globalSettings.eventstartpastlimit.value==null && globalSettings.eventstartfuturelimit.value==null)))
		{
			if(inputCounter.listType=='vevent')
				globalAccountSettings[inputCounter.resourceIndex].calendarNo--;
			else if(inputCounter.listType=='vtodo')
				globalAccountSettings[inputCounter.resourceIndex].todoNo--;

			if(((globalAccountSettings[inputCounter.resourceIndex].calendarNo==0) && (globalAccountSettings[inputCounter.resourceIndex].todoNo==0) && globalCalDAVInitLoad) || (!globalCalDAVInitLoad))
			{
				if(!globalCalDAVInitLoad&&inputCounter.typeList.indexOf('vevent')!=-1&&inputCounter.typeList.indexOf('vtodo')!=-1)
					updateMainLoader(needRefresh,null,inputCounter.uid);
				else
					updateMainLoader(needRefresh,inputCounter.listType,inputCounter.uid);
			}
		}
		else if((globalOnlyCalendarNumber>0 && globalOnlyCalendarNumberCount==globalOnlyCalendarNumber) || (globalTodoCalendarNumber>0 && globalOnlyTodoCalendarNumberCount==globalTodoCalendarNumber))
			updateMainLoader(needRefresh,inputCounter.listType,inputCounter.uid);
	}
}

function getResourceByCollection(calendarUID)
{
	var coll = globalResourceCalDAVList.getCollectionByUID(calendarUID);
	var tmp=coll.accountUID.match(vCalendar.pre['accountUidParts']);
	var resourceSettings=null;

	var resourceCalDAV_href=tmp[1]+tmp[3]+tmp[4];
	var resourceCalDAV_user=tmp[2];

	for(var i=0;i<globalAccountSettings.length;i++)
		if(globalAccountSettings[i].href==resourceCalDAV_href && globalAccountSettings[i].userAuth.userName==resourceCalDAV_user)
			resourceSettings=globalAccountSettings[i];

	return resourceSettings;
}

function updateMainLoaderText(type)
{
	if(globalCalDAVInitLoad)
	{
		globalCalendarNumberCount++;
		$('#MainLoaderInner').html(localization[globalInterfaceLanguage].loadingCalendars.replace('%act%', globalCalendarNumberCount).replace('%total%', globalCalendarNumber));
	}
	else if((globalLimitTodoLoading!='' || globalLimitLoading!='') && ((type=='vtodo' && globalSettings.todopastlimit.value!=null) || (type=='vevent' && (globalSettings.eventstartpastlimit.value!=null || globalSettings.eventstartfuturelimit.value!=null))))
	{
		if(type=='vevent' && (globalLimitLoading=='past' || globalLimitLoading=='future'))
		{
			globalOnlyCalendarNumberCount++;
			$('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].loadingCalendars.replace('%act%', globalOnlyCalendarNumberCount).replace('%total%', globalOnlyCalendarNumber));
		}
		else if(type=='vtodo' && (globalLimitTodoLoading=='pastTodo' || globalLimitTodoLoading=='futureTodo'))
		{
			globalOnlyTodoCalendarNumberCount++;
			$('#CalendarLoaderTODO').children('.loaderInfo').text(localization[globalInterfaceLanguage].loadingCalendars.replace('%act%', globalOnlyTodoCalendarNumberCount).replace('%total%', globalTodoCalendarNumber));
		}
	}
	else if(globalSettingsSaving!='' && globalFirstHideLoader)
	{
		globalLoadedCollectionsCount++;
		if(globalSettingsSaving=='event')
			$('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].loadingCalendars.replace('%act%', globalLoadedCollectionsCount).replace('%total%', globalLoadedCollectionsNumber));
		else if(globalSettingsSaving=='todo')
			$('#CalendarLoaderTODO').children('.loaderInfo').text(localization[globalInterfaceLanguage].loadingCalendars.replace('%act%', globalLoadedCollectionsCount).replace('%total%', globalLoadedCollectionsNumber));
	}
}

function updateMainLoaderTextFinal()
{
	$('#MainLoaderInner').html(localization[globalInterfaceLanguage].renderingE);
}

function updateMainLoaderTextTimezone()
{
	$('#MainLoaderInner').html(localization[globalInterfaceLanguage].timezoneChange);
}

function updateMainLoader(needRefresh,type,collUID)
{
	if((type==null && $('.r_operate').length==0) || (type=='vtodo' && $('#ResourceCalDAVTODOList .r_operate').length==0) || (type=='vevent' && $('#ResourceCalDAVList .r_operate').length==0))
	{
		var rex = vCalendar.pre['accountUidParts'];
		if(globalCalDAVInitLoad && $('.r_operate').length==0)
		{
			updateMainLoaderTextFinal();
			var counter = 0;
			for(calendarUID in globalEventList.displayEventsArray)
				counter++;
			for(calendarUID in globalEventList.displayTodosArray)
				counter++;

			var beforeScroll = $('#main').width()-$('#calendar').width();
			var beforeScrollTodo = $('#mainTODO').width()-$('#todoList').width();
			for(calendarUID in globalEventList.displayEventsArray)
				setTimeout(function(calendarUID){
					if(globalSettings.displayhiddenevents.value || globalVisibleCalDAVCollections.indexOf(calendarUID)!=-1)
					{
						var bg = false;
						var tmpUID = calendarUID.match(rex);
						var hrefUID='';
						if(tmpUID!=null)
							hrefUID = tmpUID[4];

						var resource = getResourceByCollection(calendarUID);
						var collection = globalResourceCalDAVList.getEventCollectionByUID(calendarUID);
						if(resource!=null && typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
						{
							var rbCalendars = '';
							if(resource.backgroundCalendars instanceof Array)
								rbCalendars=resource.backgroundCalendars;
							else
								rbCalendars = [resource.backgroundCalendars];
							for(var j=0; j<rbCalendars.length;j++)
							{
								if (typeof rbCalendars[j]=='string')
								{
									var index = hrefUID.indexOf(rbCalendars[j]);
									if(index!=-1)
										if(hrefUID.length == (index+rbCalendars[j].length))
											bg=true;
								}
								else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null)
									bg = true;
							}
						}
						if(collection.makeLoaded)
							collection.fcSource = $('#calendar').fullCalendar('addEventSource', {events:globalEventList.displayEventsArray[calendarUID],backgroundColor:hexToRgba(collection.ecolor,0.9),borderColor:collection.ecolor,textColor:checkFontColor(collection.ecolor),background:bg});
					}
					counter--;
					if(counter == 0)
					{
						var afterScroll = $('#main').width()-$('#calendar').width();
						rerenderCalendar(beforeScroll!=afterScroll);
						globalCalDAVQs.cache();
						var afterScrollTodo = $('#mainTODO').width()-$('#todoList').width();
						rerenderTodo(beforeScrollTodo!=afterScrollTodo);
						globalCalDAVTODOQs.cache();
						$('#calendar').fullCalendar('findToday');
						globalCalDAVInitLoad=false;
						$('#todoList').fullCalendar('allowSelectEvent',true);
						$('#todoList').fullCalendar('selectEvent', $('.fc-view-todo .fc-list-day').find('.fc-event:visible:first'));
						globalCalWidth=$('#main').width();
						$('#SystemCalDavZAP .fc-header-center ').removeClass('r_operate_all');
						showTimezones(globalSessionTimeZone, 'Picker');
						showTimezones(globalSessionTimeZone, 'PickerTODO');
						loadNextApplication(true);
					}
				},10,calendarUID);

			for(calendarUID in globalEventList.displayTodosArray)
				setTimeout(function(calendarUID){
					if(globalSettings.displayhiddenevents.value || globalVisibleCalDAVTODOCollections.indexOf(calendarUID)!=-1)
					{
						var collection = globalResourceCalDAVList.getTodoCollectionByUID(calendarUID);
						if(collection.makeLoaded)
							collection.fcSource = $('#todoList').fullCalendar('addEventSource', {events:globalEventList.displayTodosArray[calendarUID],backgroundColor:hexToRgba(collection.ecolor,0.9),borderColor:collection.ecolor});
					}
					counter--;
					if(counter == 0)
					{
						var afterScroll = $('#main').width()-$('#calendar').width();
						rerenderCalendar(beforeScroll!=afterScroll);
						globalCalDAVQs.cache();
						var afterScrollTodo = $('#mainTODO').width()-$('#todoList').width();
						rerenderTodo(beforeScrollTodo!=afterScrollTodo);
						globalCalDAVTODOQs.cache();
						$('#calendar').fullCalendar('findToday');
						globalCalDAVInitLoad=false;
						$('#todoList').fullCalendar('allowSelectEvent',true);
						$('#todoList').fullCalendar('selectEvent', $('.fc-view-todo .fc-list-day').find('.fc-event:visible:first'));
						globalCalWidth=$('#main').width();
						$('#SystemCalDavZAP .fc-header-center ').removeClass('r_operate_all');
						showTimezones(globalSessionTimeZone, 'Picker');
						showTimezones(globalSessionTimeZone, 'PickerTODO');
						loadNextApplication(true);
					}
				},10,calendarUID);
		}
		else if(!globalCalDAVInitLoad)
		{
			if(type==null || type=='vevent')
			{
				var collection = globalResourceCalDAVList.getEventCollectionByUID(collUID);
				if((globalSettings.displayhiddenevents.value || globalVisibleCalDAVCollections.indexOf(collUID)!=-1) && globalLimitLoading=='' && needRefresh && typeof collUID!= 'undefined' && collection!=null && collection.fcSource==null)
				{
					var bg = false;
					var tmpUID = collUID.match(rex);
					var hrefUID='';
					if(tmpUID!=null)
						hrefUID = tmpUID[4];

					var resource = getResourceByCollection(collUID);
					if(resource!=null && typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
					{
						var rbCalendars = '';
						if(resource.backgroundCalendars instanceof Array)
							rbCalendars=resource.backgroundCalendars;
						else
							rbCalendars = [resource.backgroundCalendars];
						for(var j=0; j<rbCalendars.length;j++)
						{
							if (typeof rbCalendars[j]=='string')
							{
								var index = hrefUID.indexOf(rbCalendars[j]);
								if(index!=-1)
									if(hrefUID.length == (index+rbCalendars[j].length))
										bg=true;
							}
							else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null)
								bg = true;
						}
					}
					collection.fcSource = $('#calendar').fullCalendar('addEventSource', {events:globalEventList.displayEventsArray[collUID],backgroundColor:hexToRgba(collection.ecolor,0.9),borderColor:collection.ecolor,textColor:checkFontColor(collection.ecolor),background:bg});
				}
				if(needRefresh)
					refetchCalendarEvents();
				setTimeout(function(){
					if(globalLimitLoading!='' && (globalSettings.eventstartpastlimit.value!=null || globalSettings.eventstartfuturelimit.value!=null))
					{
						$('#CalendarLoader').css('display', 'none');
						globalLimitLoading = '';
						globalOnlyCalendarNumberCount = 0;
					}
					$('#SystemCalDavZAP .fc-header-center ').removeClass('r_operate_all');
				},10);
			}
			if(type==null || type=='vtodo')
			{
				var collection = globalResourceCalDAVList.getTodoCollectionByUID(collUID);
				if((globalSettings.displayhiddenevents.value || globalVisibleCalDAVTODOCollections.indexOf(collUID)!=-1) && globalLimitTodoLoading=='' && needRefresh && typeof collUID!= 'undefined' && collection!=null && collection.fcSource==null)
				{
					collection.fcSource = $('#todoList').fullCalendar('addEventSource', {events:globalEventList.displayTodosArray[collUID],backgroundColor:hexToRgba(collection.ecolor,0.9),borderColor:collection.ecolor});
				}
				if(needRefresh)
					refetchTodoEvents();
				setTimeout(function(){
					if(globalLimitTodoLoading!='' && globalSettings.todopastlimit.value!=null)
					{
						$('#CalendarLoaderTODO').css('display', 'none');
						globalLimitTodoLoading = '';
						globalOnlyTodoCalendarNumberCount = 0;
					}
				},10);
			}
			showTimezones(globalSessionTimeZone, 'Picker');
			showTimezones(globalSessionTimeZone, 'PickerTODO');
			if(globalSettingsSaving!='' && globalLoadedCollectionsCount == globalLoadedCollectionsNumber)
				setTimeout(function(){hideUnloadCollectionCallback(globalSettingsSaving);},300);
		}
	}
}

function checkFontColor(hexColor)
{
	if((hexColor!='') && (hexColor!=undefined))
	{
		var color=hexColor;
		var cutHex=((color.charAt(0)=="#") ? color.substring(1, 7) : color);

		var resultColor;
		/*
		var R=parseInt(cutHex.substring(0, 2), 16);
		var G=parseInt(cutHex.substring(2, 4), 16);
		var B=parseInt(cutHex.substring(4, 6), 16);

		var a=1-(0.299*R+0.587*G+0.114*B)/255;
		*/
		var a=checkColorBrightness(cutHex);
		if(a<140)
			resultColor='#ffffff'; // dark colors - white font
		else
			resultColor='#404040'; // bright colors - black font

		return resultColor;
	}

	return '#000';
}

function checkFor(data_id)
{
	if(typeof vCalendar.tplM['contentline_TRIGGER']!='undefined' && vCalendar.tplM['contentline_TRIGGER']!='' &&
		vCalendar.tplM['contentline_TRIGGER']!=null && vCalendar.tplM['contentline_TRIGGER'].length>0)
			vCalendar.tplM['contentline_TRIGGER'].splice(data_id-1, 1);

	if(typeof vCalendar.tplM['contentline_VANOTE']!='undefined' && vCalendar.tplM['contentline_VANOTE']!='' &&
		vCalendar.tplM['contentline_VANOTE']!=null && vCalendar.tplM['contentline_VANOTE'].length>0)
			vCalendar.tplM['contentline_VANOTE'].splice(data_id-1, 1);

	if(typeof vCalendar.tplM['contentline_ACTION']!='undefined' && vCalendar.tplM['contentline_ACTION']!='' &&
		vCalendar.tplM['contentline_ACTION']!=null && vCalendar.tplM['contentline_ACTION'].length>0)
			vCalendar.tplM['contentline_ACTION'].splice(data_id-1, 1);

	if(typeof vCalendar.tplM['unprocessedVALARM']!='undefined' && vCalendar.tplM['unprocessedVALARM']!='' &&
		vCalendar.tplM['unprocessedVALARM']!=null && vCalendar.tplM['unprocessedVALARM'].length>0)
			vCalendar.tplM['unprocessedVALARM'].splice(data_id-1, 1);
}

function checkForTodo(data_id)
{
	var rh='form';
	if(typeof vCalendar.tplM['VTcontentline_TRIGGER'][rh]!='undefined' && vCalendar.tplM['VTcontentline_TRIGGER'][rh]!='' &&
		vCalendar.tplM['VTcontentline_TRIGGER'][rh]!=null && vCalendar.tplM['VTcontentline_TRIGGER'][rh].length>0)
			vCalendar.tplM['VTcontentline_TRIGGER'][rh].splice(data_id-1, 1);

	if(typeof vCalendar.tplM['VTcontentline_VANOTE'][rh]!='undefined' && vCalendar.tplM['VTcontentline_VANOTE'][rh]!='' &&
		vCalendar.tplM['VTcontentline_VANOTE'][rh]!=null && vCalendar.tplM['VTcontentline_VANOTE'][rh].length>0)
			vCalendar.tplM['VTcontentline_VANOTE'][rh].splice(data_id-1, 1);

	if(typeof vCalendar.tplM['VTcontentline_ACTION'][rh]!='undefined' && vCalendar.tplM['VTcontentline_ACTION'][rh]!='' &&
		vCalendar.tplM['VTcontentline_ACTION'][rh]!=null && vCalendar.tplM['VTcontentline_ACTION'][rh].length>0)
			vCalendar.tplM['VTcontentline_ACTION'][rh].splice(data_id-1, 1);

	if(typeof vCalendar.tplM['VTunprocessedVALARM'[rh]]!='undefined' && vCalendar.tplM['VTunprocessedVALARM'][rh]!='' &&
		vCalendar.tplM['VTunprocessedVALARM'][rh] != null && vCalendar.tplM['VTunprocessedVALARM'][rh].length>0)
			vCalendar.tplM['VTunprocessedVALARM'][rh].splice(data_id-1, 1);
}

function div(op1, op2)
{
	var a=(op1/op2);

	var b=(op1%op2)/op2;
	return a-b;
}

function binarySearch(array, first, last, value)
{
	var mid=0;
	value=value.getTime();
	while(first<=last)
	{
		mid=div((first+last), 2);
		var date3=$.fullCalendar.parseDate(array[mid].sortStart);
		date3=date3.getTime();

		if(date3<value)
			first=mid+1;
		else if(date3>value)
			last=mid-1;
		else
			break;
	}
	return mid;
}

function parseISO8601(str)
{
	// we assume str is a UTC date ending in 'Z'
	var err=0;
	if(str.indexOf('T')!=-1)
	{
		var parts=str.split('T');

		if(parts.length>1)
			var dateParts=parts[0].split('-');
		else
			return null;

		if(dateParts.length>1)
			var timeParts=parts[1].split('Z');
		else
			return null;

		var timeSubParts=timeParts[0].split(':');
		if(timeSubParts.length>1)
			var timeSecParts=timeSubParts[2].split('.');
		else
			return null;

		var timeHours=Number(timeSubParts[0]);
		_date=new Date;
		_date.setFullYear(Number(dateParts[0]));
		_date.setMonth(Number(dateParts[1])-1);
		_date.setDate(Number(dateParts[2]));
		_date.setHours(Number(timeHours));
		_date.setMinutes(Number(timeSubParts[1]));
		_date.setSeconds(Number(timeSecParts[0]));
		if(timeSecParts[1])
			_date.setUTCMilliseconds(Number(timeSecParts[1]));

		// by using setUTC methods the date has already been converted to local time(?)
		return _date;
	}
	else
	{
		var dateParts=str.split('-');

		if(dateParts.length!=3)
			return null;

		_date=new Date;
		_date.setFullYear(Number(dateParts[0]));
		_date.setMonth(Number(dateParts[1])-1);
		_date.setDate(Number(dateParts[2]));

		return _date;
	}
}

function getValidRepeatDay(inputDate, RepeatDay)
{
	var newDate='';
	if(typeof RepeatDay=='string')
		newDate=$.fullCalendar.parseDate(RepeatDay);
	else
		newDate = new Date(RepeatDay.getTime());

	var monthNumber=inputDate.getMonth()+2;
	var dayOfMonth=newDate.getDate();

	if(monthNumber>12)
		monthNumber=1;

	var lastDayInMonth=new Date(inputDate.getFullYear(), monthNumber, 0);
		lastDayInMonth=lastDayInMonth.getDate();

	if(lastDayInMonth<dayOfMonth)
		return lastDayInMonth;
	else
		return dayOfMonth;
}

function generateRepeatInstances(inputObj)
{
	var dayDifference=inputObj.items.end.getTime()-inputObj.items.start.getTime();
	var alertTimeOut=new Array();
	var lastGenDate= inputObj.repeatStart;
	var rule=null;
	if(typeof inputObj.rule == 'undefined')
	{
		var options = RRule.parseString(inputObj.items.ruleString);
		options.dtstart = new Date(inputObj.items.start.getTime());
		if(inputObj.untilDate!=='')
			options.until = inputObj.untilDate;
		rule = new RRule(options);
	}
	else
		rule=inputObj.rule;

	rule.between(inputObj.repeatStart, inputObj.futureRLimit, true, function(date,i){
		var varDate=new Date(date.getTime());

		var varEndDate=new Date(date.getTime()+dayDifference);
		var checkRec=false, valOffsetFrom='', intOffset='';

		inputObj.items.realRepeatCount++;

		if(inputObj.recurrence_id_array.length>0)
			checkRec=isInRecurrenceArray(varDate,inputObj.stringUID,inputObj.recurrence_id_array, inputObj.tzName);
		if(!inputObj.items.allDay)
		{
			var dateStart,dateEnd;
			if(globalSettings.timezonesupport.value && inputObj.items.timeZone in timezones)
				valOffsetFrom=getOffsetByTZ(inputObj.items.timeZone, varDate);
			var realStart=new Date(varDate.getTime());
			dateStart=new Date(realStart.getTime());
			if(valOffsetFrom)
			{
				intOffset=(getLocalOffset(dateStart)*-1*1000)-valOffsetFrom.getSecondsFromOffset()*1000;
				dateStart.setTime(dateStart.getTime()+intOffset);
			}
			if(inputObj.exDates.length>0)
				if(inputObj.exDates.indexOf(dateStart.toString())!=-1)
					checkRec=true;

			var realEnd=new Date(varEndDate.getTime());
			dateEnd=new Date(realEnd.getTime());
			if(intOffset)
				dateEnd.setTime(dateEnd.getTime()+intOffset);
		}
		else
		{
			realStart=new Date(varDate.getTime());
			if(inputObj.exDates.length>0)
				if(inputObj.exDates.indexOf(realStart.toString())!=-1)
					checkRec=true;
			dateStart=$.fullCalendar.formatDate(realStart,"yyyy-MM-dd'T'HH:mm:ss");
			realEnd=new Date(varEndDate.getTime());
			dateEnd =$.fullCalendar.formatDate(realEnd,"yyyy-MM-dd'T'HH:mm:ss");
		}

		var checkDateTime = new Date(inputObj.repeatStart.getTime());
		if(typeof dateStart=='string')
			checkDateTime=$.fullCalendar.formatDate(inputObj.repeatStart,"yyyy-MM-dd'T'HH:mm:ss");
		if((inputObj.items.after!=='' && inputObj.items.realRepeatCount>(parseInt(inputObj.items.after,10))) || (typeof dateStart=='object' && (checkDateTime-dateStart)==0) || (typeof dateStart=='string' && checkDateTime==dateStart))
		{
			checkRec=true;
			inputObj.items.realRepeatCount--;
		}

		if(!checkRec)
		{
			if(!inputObj.ignoreAlarms)
				alertTimeOut=setAlertTimeouts(false,inputObj.alertTime, dateStart, dateEnd, {allDay:inputObj.items.allDay, title:inputObj.items.title},false, inputObj.items.id);
			inputObj.items.repeatCount++;
			var tmpObj=$.extend({},inputObj.items,{
				start:dateStart,
				end:dateEnd,
				realStart:realStart,
				realEnd:realEnd,
				repeatCount:inputObj.items.repeatCount,
				realRepeatCount:inputObj.items.realRepeatCount,
				alertTimeOut:alertTimeOut
				});
			globalEventList.displayEventsArray[inputObj.items.res_id].splice(globalEventList.displayEventsArray[inputObj.items.res_id].length, 0, tmpObj);
			lastGenDate = new Date(varDate.getTime());
		}
		return true;
	});


	if(typeof globalEventList.repeatable[inputObj.items.id] == 'undefined')
		globalEventList.repeatable[inputObj.items.id]={
			lastGenDate:lastGenDate,
			recurrence_id_array:inputObj.recurrence_id_array,
			stringUID:inputObj.stringUID,
			exDates:inputObj.exDates,
			alertTime:inputObj.alertTime,
			ignoreAlarms:inputObj.ignoreAlarms,
			rule:rule,
			items:inputObj.items
		};
	else
		globalEventList.repeatable[inputObj.items.id].lastGenDate=lastGenDate;
}

function generateTodoRepeatInstances(inputObj)
{
	var rule=null;
	var alertTimeOut=new Array();
	var firstDateSaved=false;
	if(inputObj.repeatStart)
		var resStart=new Date($.fullCalendar.parseDate(inputObj.items.realStart).getTime());
	else if(inputObj.repeatEnd)
		var resStart=new Date($.fullCalendar.parseDate(inputObj.items.realEnd).getTime());

	if(typeof inputObj.lastGenDate!='undefined')
		var resStart=new Date(inputObj.lastGenDate.getTime());

	var lastGenDate=new Date(resStart.getTime());
	if(typeof inputObj.rule == 'undefined')
	{
		var options = RRule.parseString(inputObj.items.ruleString);
		options.dtstart = new Date(resStart.getTime());
		if(inputObj.untilDate!=='')
			options.until = inputObj.untilDate;
			rule = new RRule(options);
	}
	else
		rule=inputObj.rule;

	var dates = new Array();
	dates = rule.between(resStart, new Date(inputObj.futureRLimit.getTime()), true);

	if(dates.length>0 && (dates[0]-resStart)!=0 || dates.length==0)
		dates.splice(0,0,resStart);

	var futureLimitDate = new Date(inputObj.futureRLimit.getTime());
	futureLimitDate.setHours(resStart.getHours());
	futureLimitDate.setMinutes(resStart.getMinutes());
	futureLimitDate.setSeconds(resStart.getSeconds());


	var startCheck = new Date(dates[dates.length-1].getTime());


	var iterationEnd = dates.length;
	if(globalSettings.appleremindersmode.value || (inputObj.repeatEnd=='' && inputObj.repeatStart!=''))
		for(var i=0; i<globalMaxNextInstanesTodoCheckingNumber;i++)
		{
			var endCheck = new Date(startCheck.getTime()+ 30 * 24 * 3600 * 1000 + (24*3600*1000));
			var tmpArray = new Array();
				tmpArray = rule.between(startCheck, endCheck , true);
			if(tmpArray.length>0)
			{
				var isBreak=false;
				for(var j=0;j<tmpArray.length;j++)
					if(dates[dates.length-1]-tmpArray[j]!=0)
					{
						dates.push(tmpArray[j]);
						iterationEnd=dates.length-1;
						isBreak=true;
						break;
					}
				if(isBreak)
					break;
			}
			startCheck=new Date(endCheck.getTime());
		}


	var realRepeatCount=inputObj.realRepeatCount;
	var repeatCount=inputObj.repeatCount;
	for(var i=0;i<iterationEnd;i++)
	{
		var varDate='', varEndDate='', valOffsetFrom='',intOffset=0;
		var checkCont=false, dateStart='', dateEnd='';

		realRepeatCount++;
		if(inputObj.repeatEnd!='' && inputObj.repeatStart!='')
		{

			varDate=new Date(dates[i].getTime());
			varEndDate=new Date(varDate.getTime()+inputObj.dayDifference);
		}
		else if(inputObj.repeatEnd=='' && inputObj.repeatStart!='')
		{
			varDate=new Date(dates[i].getTime());
			if(i<=(dates.length-2))
			{
				varEndDate=new Date(dates[i+1].getTime());
				varEndDate.setMinutes(varEndDate.getMinutes()-1);
			}
		}
		else if(inputObj.repeatEnd!='' && inputObj.repeatStart=='')
		{
			varEndDate=new Date(dates[i].getTime());
			if(i>0)
			{
				varDate=new Date(dates[i-1].getTime());
				varDate.setMinutes(varDate.getMinutes()+1);
			}
			else if(typeof inputObj.previousRepeatStart!='undefined'&&inputObj.previousRepeatStart!=='')
				varDate=new Date(inputObj.previousRepeatStart);
		}

		if(varDate!=='')
		{
			if(globalSettings.timezonesupport.value && inputObj.items.timeZone in timezones)
				valOffsetFrom=getOffsetByTZ(inputObj.items.timeZone, varDate);
			var realStart=new Date(varDate.getTime());
			dateStart=new Date(varDate.getTime());
			if(valOffsetFrom && (typeof inputObj.previousRepeatStart=='undefined' || inputObj.previousRepeatStart==''))
			{
				intOffset=(getLocalOffset(dateStart)*-1*1000)-valOffsetFrom.getSecondsFromOffset()*1000;
				dateStart.setTime(dateStart.getTime()+intOffset);
			}

		}

		if(varEndDate!=='')
		{

			var realEnd=new Date(varEndDate.getTime());
			var dateEnd=new Date(varEndDate.getTime());
			if(intOffset)
				dateEnd.setTime(dateEnd.getTime()+intOffset);
		}

		if(inputObj.repeatStart!='')
		{
			checkCont=isInRecurrenceArray(realStart,inputObj.stringUID,inputObj.recurrence_id_array, inputObj.items.timeZone);
			if(inputObj.exDates.length>0)
				if(inputObj.exDates.indexOf(dateStart.toString())!=-1)
					checkCont=true;
		}
		else
		{
			checkCont=isInRecurrenceArray(realEnd,inputObj.stringUID,inputObj.recurrence_id_array, inputObj.items.timeZone);
			if(inputObj.exDates.length>0)
				if(inputObj.exDates.indexOf(dateEnd.toString())!=-1)
					checkCont=true;
		}

		if(inputObj.items.after!=='' && !globalSettings.appleremindersmode.value && realRepeatCount>(parseInt(inputObj.items.after,10)))
		{
			checkCont=true;
			realRepeatCount--;
		}

		if(globalSettings.appleremindersmode.value && firstDateSaved && inputObj.todoArray.length==1)
		{
			globalAppleSupport.nextDates[inputObj.items.id] =  new Date(dateEnd.getTime());
			break;
		}
		if(!checkCont)
		{
			if(!inputObj.ignoreAlarms)
				alertTimeOut=setAlertTimeouts(true, inputObj.alertTime, (inputObj.repeatStart=='' ? dateEnd : dateStart), (inputObj.repeatEnd=='' ? dateStart : dateEnd), {title:inputObj.items.title, status:inputObj.items.status},!firstDateSaved,inputObj.items.id);
			firstDateSaved = true;
			repeatCount++;
			var tmpObj=$.extend({},inputObj.items,{
			start:dateStart,
			end:(inputObj.repeatEnd=='' && i==(dates.length-1) ? '' : dateEnd),
			realStart:realStart,
			realEnd:realEnd,
			repeatCount:repeatCount,
			realRepeatCount:realRepeatCount,
			alertTimeOut:alertTimeOut
			});

			inputObj.preTodoArray.splice(inputObj.preTodoArray.length, 0, tmpObj);
			if(inputObj.repeatStart!='')
				lastGenDate = new Date(dateStart.getTime());
			else
				lastGenDate = new Date(dateEnd.getTime());
		}
	}

	if(typeof globalEventList.repeatableTodo[inputObj.items.id] == 'undefined')
		globalEventList.repeatableTodo[inputObj.items.id]={
			todoArray:inputObj.todoArray,
			lastGenDate:lastGenDate,
			dayDifference:inputObj.dayDifference,
			recurrence_id_array:inputObj.recurrence_id_array,
			stringUID:inputObj.stringUID,
			exDates:inputObj.exDates,
			realRepeatCount:realRepeatCount,
			repeatCount:repeatCount,
			alertTime:inputObj.alertTime,
			ignoreAlarms:inputObj.ignoreAlarms,
			rule:rule,
			items:inputObj.items
		};
	else
	{
		globalEventList.repeatableTodo[inputObj.items.id].lastGenDate=lastGenDate;
		globalEventList.repeatableTodo[inputObj.items.id].realRepeatCount=realRepeatCount;
		globalEventList.repeatableTodo[inputObj.items.id].repeatCount=repeatCount;
	}
}

function loadRepeatEvents(inputRepeatEvent,prevLimit,toLimit)
{
	var repeatFromLine=new Date(prevLimit.getFullYear(), prevLimit.getMonth(), prevLimit.getDate(), 0, 0, 0);
	generateRepeatInstances({
		untilDate:inputRepeatEvent.items.untilDate,
		repeatStart:inputRepeatEvent.lastGenDate,
		futureRLimit:toLimit,
		stringUID:inputRepeatEvent.stringUID,
		recurrence_id_array:inputRepeatEvent.recurrence_id_array,
		exDates:inputRepeatEvent.exDates,
		alertTime:inputRepeatEvent.alertTime,
		ignoreAlarms:inputRepeatEvent.ignoreAlarms,
		rule:inputRepeatEvent.rule,
		items:inputRepeatEvent.items
	});
}

function loadRepeatTodo(inputRepeatTodo,prevLimit)
{
	var preTodoArray=new Array();
	var previousRepeatStart = '';
	var repeatInstances = globalEventList.displayTodosArray[inputRepeatTodo.items.res_id].filter(function(elm){return elm.id==inputRepeatTodo.items.id && elm.type!=''});
	if(repeatInstances.length>0)
	{
		var index = globalEventList.displayTodosArray[inputRepeatTodo.items.res_id].indexOf(repeatInstances[repeatInstances.length-1]);
		previousRepeatStart = repeatInstances[repeatInstances.length-1].start;
		globalEventList.displayTodosArray[inputRepeatTodo.items.res_id].splice(index,1);
	}
	generateTodoRepeatInstances({
		loadRepeatTodo:true,
		rule:inputRepeatTodo.rule,
		realRepeatCount:--inputRepeatTodo.realRepeatCount,
		repeatCount:--inputRepeatTodo.repeatCount,
		dayDifference:inputRepeatTodo.dayDifference,
		untilDate:inputRepeatTodo.items.untilDate,
		repeatStart:inputRepeatTodo.items.repeatStart,
		repeatEnd:inputRepeatTodo.items.repeatEnd,
		futureRLimit:globalToLoadedLimitTodo,
		stringUID:inputRepeatTodo.stringUID,
		recurrence_id_array:inputRepeatTodo.recurrence_id_array,
		exDates:inputRepeatTodo.exDates,
		alertTime:inputRepeatTodo.alertTime,
		ignoreAlarms:inputRepeatTodo.ignoreAlarms,
		isChange:false,
		lastGenDate:inputRepeatTodo.lastGenDate,
		todoArray:inputRepeatTodo.todoArray,
		preTodoArray:preTodoArray,
		previousRepeatStart:previousRepeatStart,
		items:inputRepeatTodo.items
	});

	$.merge(globalEventList.displayTodosArray[inputRepeatTodo.items.res_id],preTodoArray);
}

function getPrevMonths(viewStart)
{

	if(globalLimitLoading!='future' && globalLimitLoading!='past' && globalSettings.eventstartpastlimit.value!=null && viewStart < globalLoadedLimit)
	{
		globalLoadedLimit.setMonth(globalLoadedLimit.getMonth()-globalSettings.eventstartpastlimit.value-1);
		globalOnlyCalendarNumberCount = 0
		$('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
		globalLimitLoading='past';
		setCalendarNumber(false);
		CalDAVnetLoadCollection(globalResourceCalDAVList.collections[0], true, false, 0, globalResourceCalDAVList.collections);
	}
}

function getNextMonths(viewEnd)
{
	if(globalLimitLoading!='future' && globalLimitLoading!='past' && viewEnd > globalToLoadedLimit)
	{
		var limitSet = (globalSettings.eventstartfuturelimit.value!=null);
		var futureLimit = limitSet ? globalSettings.eventstartfuturelimit.value : 2;
		var prevLimit = new Date(globalBeginFuture.getTime());
		globalToLoadedLimit.setMonth(globalToLoadedLimit.getMonth()+futureLimit+1);
		var futureDate = new Date(globalToLoadedLimit.getTime());
		futureDate.setDate(futureDate.getDate()+14);

		if(limitSet)
		{
			globalOnlyCalendarNumberCount = 0;
			$('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
			globalLimitLoading='future';
		}

		for (var repeat in globalEventList.repeatable)
			loadRepeatEvents(globalEventList.repeatable[repeat],prevLimit,futureDate);

		if(limitSet)
		{
			setCalendarNumber(false);
			CalDAVnetLoadCollection(globalResourceCalDAVList.collections[0], true, false, 0, globalResourceCalDAVList.collections);
		}
		else
			globalBeginFuture = new Date(futureDate.getTime());

		refetchCalendarEvents();
	}
}

function getPrevMonthsTodo(fromCalendar)
{
	if(globalLimitTodoLoading=='futureTODO' && globalLimitTodoLoading=='pastTODO')
		return false;
	var actualTodoMonth = new Date($('#todoList').fullCalendar('getView').start.getTime());
	actualTodoMonth.setDate(1);

	if(globalSettings.todopastlimit.value!=null && actualTodoMonth < globalLoadedLimitTodo)
	{
		if(typeof fromCalendar!='undefined' && fromCalendar!=null && fromCalendar)
			globalLoadedLimitTodo = new Date(actualTodoMonth.getTime());
		else
			globalLoadedLimitTodo.setMonth(globalLoadedLimitTodo.getMonth()-globalSettings.todopastlimit.value-1);
		globalOnlyTodoCalendarNumberCount = 0;
		$('#CalendarLoaderTODO').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
		globalLimitTodoLoading='pastTodo';
		setCalendarNumber(false);
		CalDAVnetLoadCollection(globalResourceCalDAVList.TodoCollections[0], true, false, 0, globalResourceCalDAVList.TodoCollections);
	}
}

function getNextMonthsTodo(fromCalendar)
{
	if(globalLimitTodoLoading=='futureTODO' && globalLimitTodoLoading=='pastTODO')
		return false;
	//var limitSet = (!globalSettings.appleremindersmode.value && globalSettings.eventstartfuturelimit.value!=null)
	var limitSet=false;
	var futureLimit = limitSet ? globalSettings.eventstartfuturelimit.value : 2;
	var actualTodoMonth = new Date($('#todoList').fullCalendar('getView').end.getTime());
	actualTodoMonth.setMonth(actualTodoMonth.getMonth()+1);
	actualTodoMonth.setDate(1);

	if(actualTodoMonth > globalToLoadedLimitTodo)
	{
		var prevLimit = new Date(globalToLoadedLimitTodo.getTime());
		if(typeof fromCalendar!='undefined' && fromCalendar!=null && fromCalendar)
		{
			globalToLoadedLimitTodo = new Date(actualTodoMonth.getTime())
			globalToLoadedLimitTodo.setMonth(globalToLoadedLimitTodo.getMonth()+1);
		}
		else
			globalToLoadedLimitTodo.setMonth(globalToLoadedLimitTodo.getMonth()+futureLimit+1);

		if(limitSet)
		{
			globalOnlyTodoCalendarNumberCount = 0;
			$('#CalendarLoaderTODO').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
			globalLimitTodoLoading='futureTodo';
		}

		for(var repeat in globalEventList.repeatableTodo)
			loadRepeatTodo(globalEventList.repeatableTodo[repeat],prevLimit);

		if(limitSet)
		{
			setCalendarNumber(false);
			CalDAVnetLoadCollection(globalResourceCalDAVList.TodoCollections[0], true, false, 0, globalResourceCalDAVList.TodoCollections);
		}

		refetchTodoEvents();
	}
}

function showAlertEvents(inputUID, realDelay, alarmObject)
{
	if(maxAlarmValue<realDelay)
	{
		var delay=realDelay-maxAlarmValue;
		if(maxAlarmValue<delay)
			setTimeout(function(){showAlertEvents(inputUID, delay,alarmObject);}, maxAlarmValue);
		else
			setTimeout(function(){showAlertEvents(inputUID, delay,alarmObject);}, delay);
		return false;
	}
	var rid=inputUID.substring(0, inputUID.lastIndexOf('/')+1);

	if(globalSettings.showhiddenalarms.value)
		hiddenCheck = true;
	else
		hiddenCheck = false;

	if((alarmObject!=undefined && hiddenCheck) || (alarmObject!=undefined && !hiddenCheck && globalVisibleCalDAVCollections.indexOf(rid)!=-1))
	{
		$('#alertBox').css('visibility', 'visible');
		$('#AlertDisabler').fadeIn(globalEditorFadeAnimation)

		var date=$.fullCalendar.parseDate(alarmObject.start);
		var dateString='';
		var formattedDate = $.datepicker.formatDate(globalSettings.datepickerformat.value,date);
		if(formattedDate!='')
			dateString+=' : '+formattedDate;

		var timeString='';
		if(!alarmObject.allDay)
		{
			var timeS = $.fullCalendar.formatDate(date, globalSettings.ampmformat.value?'h:mm TT{ - h:mm TT}':'H:mm{ - H:mm}')
			if(timeS!='')
				timeString=' - '+timeS;
		}

		$('#alertBoxContent').append("<div class='alert_item'><img src='images/calendarB.svg' alt='Calendar'/><label>"+alarmObject.title+dateString+timeString+"</label></div>");
	}
}

function showAlertTODO(inputUID, realDelay, alarmObject)
{
	if(globalSettings.ignorecompletedorcancelledalarms.value && (alarmObject.status=='COMPLETED' || alarmObject.status== 'CANCELLED'))
		return false;
	if(maxAlarmValue<realDelay)
	{
		var delay=realDelay-maxAlarmValue;

		if(maxAlarmValue<delay)
			setTimeout(function(){showAlertTODO(inputUID, delay, alarmObject);}, maxAlarmValue);
		else
			setTimeout(function(){showAlertTODO(inputUID, delay, alarmObject);}, delay);

		return false;
	}

	resDate='';
	var rid=inputUID.substring(0, inputUID.lastIndexOf('/')+1);

	if(globalSettings.showhiddenalarms.value)
		hiddenCheck = true;
	else
		hiddenCheck = false;

	if(hiddenCheck || (!hiddenCheck && globalVisibleCalDAVTODOCollections.indexOf(rid)!=-1))
	{
		$('#alertBox').css('visibility', 'visible');
		$('#AlertDisabler').fadeIn(globalEditorFadeAnimation);

		var dateString='';
		var date=$.fullCalendar.parseDate(alarmObject.start);
		var formattedDate=$.datepicker.formatDate(globalSettings.datepickerformat.value,date);
		if(formattedDate!='')
			dateString=' : '+formattedDate;

		var timeString=''
		var timeS = $.fullCalendar.formatDate(date,globalSettings.ampmformat.value?'h:mm TT{ - h:mm TT}':'H:mm{ - H:mm}');
		if(timeS!='')
			timeString=' - '+timeS;
		$('#alertBoxContent').append("<div class='alert_item'><img src='images/todoB.svg' alt='Todo'/><label>"+alarmObject.title+dateString+timeString+"</label></div>");
	}
}

function clearAlertEvents()
{
	$('#alertBoxContent').html('');
	$('#alertBox').css('visibility', 'hidden');
	$('#AlertDisabler').fadeOut(globalEditorFadeAnimation);
}

function addAndEdit(isFormHidden, deleteMode)
{
	var inputUID='';
	if($('#uid').val()!='')
		var coll = globalResourceCalDAVList.getEventCollectionByUID($('#uid').val().substring(0, $('#uid').val().lastIndexOf('/')+1));
	else
		var coll = globalResourceCalDAVList.getEventCollectionByUID($('#event_calendar').val());
	var res = getAccount(coll.accountUID);
	var tmp=res.href.match(vCalendar.pre['hrefRex']);
	var origUID=tmp[1]+res.userAuth.userName+'@'+tmp[2];

	if($('#etag').val()!='')
		inputUID=$('#uid').val();
	else if($('#event_calendar').val()!='choose')
		inputUID = $('#event_calendar').val()+'';
	else
		return false;
	dataToVcalendar('EDIT',origUID, inputUID, $('#etag').val(), '', isFormHidden, deleteMode);
}

function interResourceEdit(op, delUID,isFormHidden)
{
	var inputUID='';
	if($('#uid').val()!='')
		var coll = globalResourceCalDAVList.getEventCollectionByUID($('#uid').val().substring(0, $('#uid').val().lastIndexOf('/')+1));
	else
		var coll = globalResourceCalDAVList.getEventCollectionByUID($('#event_calendar').val());
	var res = getAccount(coll.accountUID);
	var tmp=res.href.match(vCalendar.pre['hrefRex']);
	var origUID=tmp[1]+res.userAuth.userName+'@'+tmp[2];

	if(op != 'MOVE_IN')
		$('#etag').val('');
	var srcUID=$('#uid').val().substring($('#uid').val().lastIndexOf('/')+1, $('#uid').val().length);

	inputUID=$('#event_calendar').val()+srcUID;
	dataToVcalendar(op, origUID, inputUID, '', delUID,isFormHidden);
}

function save(isFormHidden, deleteMode)
{
	$('#event_details_template').scrollTop(0);
	if(!deleteMode)
	{
		if($('#event_details_template').find('img[data-type=invalidSmall]').filter(function(){return this.style.display != 'none'}).length>0)
		{
			show_editor_loader_messageCalendar('vevent', 'message_error', localization[globalInterfaceLanguage].txtErorInput);
			return false;
		}
		var a=$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_from').val());
		var a2=$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_to').val());

		var datetime_from=$.fullCalendar.formatDate(a, 'yyyy-MM-dd');
		var datetime_to=$.fullCalendar.formatDate(a2, 'yyyy-MM-dd');
		var time_from='00:00';
		var time_to='00:00';
		if(!$('#allday').prop('checked'))
		{
			if($('#time_from').val()!='' && $('#time_to').val()!='')
			{
				time_from=new Date(Date.parse("01/02/1990, "+$('#time_from').val()));
				time_from=$.fullCalendar.formatDate(time_from, 'HH:mm');
				time_to=new Date(Date.parse("01/02/1990, "+$('#time_to').val()));
				time_to=$.fullCalendar.formatDate(time_to, 'HH:mm');
			}
		}
		if($.fullCalendar.parseDate(datetime_from+'T'+time_from+'Z')>$.fullCalendar.parseDate(datetime_to+'T'+time_to+'Z'))
		{
			show_editor_loader_messageCalendar('vevent', 'message_error', localization[globalInterfaceLanguage].txtErrorDates);
			return false;
		}
	}

	var calUID=$('#uid').val().substring(0, $('#uid').val().lastIndexOf('/'));

	var newUID=$('#event_calendar').val().substring(0, $('#event_calendar').val().length-1);
	if($('#event_calendar').val()!='choose')
	{
		if($('#name').val()=='')
			$('#name').val(localization[globalInterfaceLanguage].pholderNewEvent);

		if(newUID==calUID || ($('#etag').val()=='' && $('#event_calendar').val()!='choose'))
			addAndEdit(isFormHidden, deleteMode);
//		else if(calUID.substring(0, calUID.lastIndexOf('/'))==newUID.substring(0, newUID.lastIndexOf('/')))
//		{
//			var delUID=$('#uid').val();
//			interResourceEdit('MOVE_IN',delUID, isFormHidden);
//		}
		else if(/*calUID.substring(0, calUID.lastIndexOf('/'))!=newUID.substring(0, newUID.lastIndexOf('/')) &&*/ $('#etag').val()!='')
		{
			var delUID=$('#uid').val();
			interResourceEdit('MOVE_OTHER',delUID, isFormHidden);
		}
	}
	else
		show_editor_loader_messageCalendar('vevent', 'message_error', localization[globalInterfaceLanguage].txtNotChoose);
}

function deleteEvent()
{
	var delUID=$('#uid').val();

	if(delUID!='')
		deleteVcalendarFromCollection(delUID,'vevent');
}

function loadAdditionalCollections(collectionType)
{
	if(globalSettingsSaving!='')
		return false;
	globalSettingsSaving=collectionType;
	var inSettings = $.extend({},globalSettings);
	var rex = new RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@(.*)');
	var sel = '';
	var key = '';
	if(collectionType=='event')
	{
		key='loadedcalendarcollections';
		inSettings.loadedcalendarcollections = {value:new Array(), locked: globalSettings[key].locked};
		$('#ResourceCalDAVList').find('.unloadCheck').each(function(cin,cel)
		{
			if($(cel).prop('checked'))
			{
				var uidParts=$(cel).attr('data-id').match(rex);
				inSettings.loadedcalendarcollections.value.splice(inSettings.loadedcalendarcollections.value.length , 0, uidParts[1]+uidParts[3]);
			}

		});
	}
	else if(collectionType=='todo')
	{
		sel='TODO';
		key='loadedtodocollections';
		inSettings.loadedtodocollections = {value : new Array(), locked: globalSettings[key].locked};
		$('#ResourceCalDAVTODOList').find('.unloadCheck').each(function(cin,cel)
		{
			if($(cel).prop('checked'))
			{
				var uidParts=$(cel).attr('data-id').match(rex);
				inSettings.loadedtodocollections.value.splice(inSettings.loadedtodocollections.value.length , 0, uidParts[1]+uidParts[3]);
			}
		});
	}

	if($(inSettings[key].value).not(globalSettings[key].value).length > 0 || $(globalSettings[key].value).not(inSettings[key].value).length > 0)
	{
		$('#CalendarLoader'+sel).removeClass('loader_hidden');
		$('#ResourceCalDAV'+sel+'List').find('input[type="checkbox"]').prop('disabled',true);
		var setC=0;
		for(var i=0;i<globalAccountSettings.length;i++)
			if(globalAccountSettings[i].href.indexOf(globalLoginUsername)!=-1 && globalAccountSettings[i].settingsAccount)
			{
				setC++;
				netSaveSettings(globalAccountSettings[i], inSettings, false, true);
				break;
			}
		if(setC==0)
			cancelUnloadedCollections(collectionType);
	}
	else
		hideUnloadedCollections(collectionType,true);
}

function showUnloadedCollections(collectionType)
{
	if((collectionType=='event'&&globalEventCollectionsLoading) || (collectionType=='todo'&&globalTodoCollectionsLoading))
		return false;
	var sel=null;
	var locString='';
	if(collectionType=='event')
	{
		globalEventCollectionsLoading=true;
		sel='';
		locString='txtEnabledCalendars';
	}
	else if(collectionType=='todo')
	{
		globalTodoCollectionsLoading=true;
		sel='TODO';
		locString='txtEnabledTodoLists';
	}
	if(isAvaible('CardDavMATE'))
		$('#showUnloadedAddressbooks').css('display','none');
	if(sel=='TODO')
		$('#showUnloadedCalendars').css('display','none');
	else
		$('#showUnloadedCalendarsTODO').css('display','none');
	$('#ResourceCalDAV'+sel+'List').find('input[type="checkbox"]').prop('disabled',true);
	$('#CalendarLoader'+sel).children('.loaderInfo').text(localization[globalInterfaceLanguage].loadingCollectionList).parent().fadeIn(300);
	var resList = $('#ResourceCalDAV'+sel+'List');
	var resHeader = '.resourceCalDAV'+sel+'_header';
	var resItem = '.resourceCalDAV'+sel+'_item';
	$('#ResourceCalDAV'+sel+'List').find('input[type="checkbox"]').prop('disabled',false);
	$('#CalendarLoader'+sel).children('.loaderInfo').text('').parent().addClass('loader_hidden');
	resList.find('.resourceCalDAV_item_selected').removeClass('resourceCalDAV_item_selected');
	resList.find('input').css('display','none');
	// header display
	resList.children('.resourceCalDAV'+sel+'_header').each(function(){
		if($(this).css('display')=='none')
			$(this).addClass('unloaded').css('display','');
		var headerClickElm = $('<input type="checkbox" class="unloadCheckHeader" style="position:absolute;top:3px;right:0px;margin-right:6px;"/>');
		headerClickElm.change(function(){
			loadResourceChBoxClick(this, '#ResourceCalDAV'+sel+'List', resHeader, resItem, resItem);
		});
		$(this).addClass('load_mode').append(headerClickElm);
	});
	// caldav_item display
	resList.find('.resourceCalDAV'+sel+'_item').each(function(){
		if(typeof $(this).attr('data-id') != 'undefined')
		{
			var newInputElm = $('<input type="checkbox" class="unloadCheck" data-id="'+$(this).attr('data-id')+'" style="position:absolute;top:8px;right:0px;margin-right:6px;"/>');
			newInputElm.change(function(){
				loadCollectionChBoxClick(this, '#ResourceCalDAV'+sel+'List', resHeader, resItem, resItem);
			});
			$(this).addClass('load_mode').append(newInputElm);
			if($(this).css('display')=='none')
				$(this).addClass('unloaded');
			else
				newInputElm.prop('checked',true);
			newInputElm.trigger('change');
		}
	});
	$('#showUnloadedCalendars'+sel).css('display','none');
	$('#resourceCalDAV'+sel+'_h').find('.resourceCalDAV'+sel+'_text').text(localization[globalInterfaceLanguage][locString]);
	var origH = resList.find('.resourceCalDAV'+sel+'_header.unloaded').eq(0).css('height');
	var origC = resList.find('.resourceCalDAV'+sel+'_item.unloaded').eq(0).css('height');
	resList.find('.resourceCalDAV'+sel+'_header.unloaded').css({height:0,display:''}).animate({height:origH},300);
	resList.find('.resourceCalDAV'+sel+'_item.unloaded').css({height:0,display:''}).animate({height:origC},300);
	resList.animate({'top':49},300);
}

function cancelUnloadedCollections(collectionType)
{
	var sel=null;
	var loadedCollections=null;
	if(collectionType=='event')
	{
		sel='';
		loadedCollections=globalSettings.loadedcalendarcollections.value;
	}
	else if(collectionType=='todo')
	{
		sel='TODO';
		loadedCollections=globalSettings.loadedtodocollections.value;
	}

	$('#ResourceCalDAV'+sel+'List').children('.resourceCalDAV'+sel+'_item').each(function(){
		var isLoaded=false;
		if(typeof globalCrossServerSettingsURL!='undefined'&&globalCrossServerSettingsURL!=null&globalCrossServerSettingsURL)
		{
			var uidParts=$(this).attr('data-id').match(RegExp('/([^/]+/[^/]+/)$'));
			var tmpParts = uidParts[1].match('^(.*/)([^/]+)/$');
			var checkHref=decodeURIComponent(tmpParts[1])+tmpParts[2]+'/';
			var found=false;
			for(var l=0;l<loadedCollections.length;l++)
			{
				var tmpParts2 = loadedCollections[l].match('^(.*/)([^/]+)/([^/]+)/$');
				var checkHref2=decodeURIComponent(tmpParts2[2])+'/'+tmpParts2[3]+'/';
				if(checkHref==checkHref2)
				{
					found=true;
					break;
				}
			}
			isLoaded=found;
		}
		else
		{
			var uidParts=$(this).attr('data-id').match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@(.*)'));
			var checkHref=uidParts[1]+uidParts[3];
			isLoaded=(loadedCollections.indexOf(checkHref)!=-1);
		}

		var unloadCh=$(this).find('.unloadCheck');
		var checked=unloadCh.prop('checked');

		if((isLoaded && !checked) || (!isLoaded && checked))
			unloadCh.prop('checked',!checked).trigger('change');
	});
	hideUnloadedCollections(collectionType,true);
}

function hideUnloadedCollections(collectionType, withCallback)
{
	var sel=null;
	var locString='';
	if(collectionType=='event') {
		sel='';
		locString='txtCalendars';
	}
	else if(collectionType=='todo') {
		sel='TODO';
		locString='txtTodoLists';
	}

	var resList=$('#ResourceCalDAV'+sel+'List');
	resList.find(':input.unloadCheck').remove();
	resList.find(':input.unloadCheckHeader').remove();
	resList.find('.load_mode').removeClass('load_mode');
	resList.find(':input').css('display','');

	$('#resourceCalDAV'+sel+'_h').find('.resourceCalDAV'+sel+'_text').text(localization[globalInterfaceLanguage][locString]);
	resList.find('.resourceCalDAV'+sel+'_header.unloaded').animate({height:0},300).promise().done(function(){
		resList.find('.resourceCalDAV'+sel+'_header.unloaded').css({display:'none',height:''});
	});
	resList.find('.resourceCalDAV'+sel+'_item.unloaded').animate({height:0},300).promise().done(function(){
		resList.find('.resourceCalDAV'+sel+'_item.unloaded').css({display:'none',height:''});
		resList.find('.resourceCalDAV'+sel+'_header').not('.unloaded').each(function(){
			var triggerInput=$(this).nextUntil('.resourceCalDAV'+sel+'_header').filter(':visible').first().find('input[type="checkbox"]');
			collectionChBoxClick(triggerInput.get(0), '#ResourceCalDAV'+sel+'List', '.resourceCalDAV'+sel+'_header', '.resourceCalDAV'+sel+'_item', null, false);
		});
		resList.find('.unloaded').removeClass('unloaded');
		if(collectionType=='event')
			globalEventCollectionsLoading=false;
		else if(collectionType=='todo')
			globalTodoCollectionsLoading=false;
		if(withCallback)
			hideUnloadCollectionCallback(collectionType);
	});
	resList.animate({'top':24},300);
	if(withCallback)
		$('#CalendarLoader'+sel).fadeOut(300,function(){
			$(this).removeClass('loader_hidden');
		});
	if(isAvaible('CardDavMATE'))
		$('#showUnloadedAddressbooks').css('display','block');
	if(sel=='TODO')
		$('#showUnloadedCalendars').css('display','block');
	else
		$('#showUnloadedCalendarsTODO').css('display','block');
}

function hideUnloadCollectionCallback(collectionType)
{
	var sel=null;
	if(collectionType=='event')
		sel='';
	else if(collectionType=='todo')
		sel='TODO';

	$('#showUnloadedCalendars'+sel).css('display','');
	globalFirstHideLoader=true;
	globalSettingsSaving='';
	selectActiveCalendar();
	if(collectionType=='event')
	{

		if($('#ResourceCalDAVList .resourceCalDAV_item:visible').not('.resourceCalDAV_item_ro').length==0)
		{
			$('#eventFormShower').css('display','none');
			$('#calendar').fullCalendar('setOptions',{'selectable':false});
		}
		else
		{
			$('#eventFormShower').css('display','block');
			$('#calendar').fullCalendar('setOptions',{'selectable':true});
		}
	}
	else if(collectionType=='todo')
	{
		if($('#ResourceCalDAVTODOList .resourceCalDAVTODO_item:visible').not('.resourceCalDAV_item_ro').length==0)
			$('#eventFormShowerTODO').css('display','none');
		else
			$('#eventFormShowerTODO').css('display','block');
	}
	$('#CalendarLoader'+sel).css('display','none');
	$('#ResourceCalDAV'+sel+'List').find('input[type="checkbox"]').prop('disabled',false);
}

function disableAll()
{
	var counter=0;
	$('#ResourceCalDAVList').children(':visible').each(function(i, e){
		if($(e).hasClass('resourceCalDAV_item') && $(e).find('input').prop('checked'))
			counter++;
	});
	if(!counter)
		return false;

	if(!globalSettings.displayhiddenevents.value)
	{
		globalResourceRefreshNumber++;
		$('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
		var beforeScroll = $('#main').width()-$('#calendar').width();
		$('#calendar').fullCalendar('removeEvents');
		$('#calendar').fullCalendar('removeEventSources');
		var afterScroll = $('#main').width()-$('#calendar').width();
		rerenderCalendar(beforeScroll!=afterScroll);
	}

	for(var j=0;j<globalResourceCalDAVList.collections.length;j++)
	{
		if(globalResourceCalDAVList.collections[j].href!=undefined)
		{
			var uid=globalResourceCalDAVList.collections[j].uid;
			var check=$('#ResourceCalDAVList').find('[name^="'+uid+'"]');
			if(check.prop('checked'))
			{
				var pos=globalVisibleCalDAVCollections.indexOf(uid);
				if(pos!=-1)
					globalVisibleCalDAVCollections.splice(pos, 1);
				check.prop('checked', false);
				if(globalSettings.displayhiddenevents.value)
					hideCalendarEvents(uid);
			}
			collectionChBoxClick(check.get(0), '#'+check.parent().parent().attr('id'), '.resourceCalDAV_header', '.resourceCalDAV_item', null, false)
		}
		/*else
		{
			var check=$('#ResourceCalDAVList').children().eq(globalResourceCalDAVList.collections[j].index+1).find('input');
			if(check.prop('checked'))
				check.prop('checked', false);
		}*/
	}

	if(!globalSettings.displayhiddenevents.value)
	{
		globalResourceRefreshNumber--;
		if(!globalResourceRefreshNumber)
			$('#CalendarLoader').css('display','none');
	}
}

function enableAll()
{
	var counter=0;
	$('#ResourceCalDAVList').children(':visible').each(function(i, e){
		if($(e).hasClass('resourceCalDAV_item') && !$(e).find('input').prop('checked'))
			counter++;
	});
	if(!counter)
		return false;

	if(!globalSettings.displayhiddenevents.value)
	{
		globalResourceRefreshNumber++;
		$('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
	}

	var beforeScroll = $('#main').width()-$('#calendar').width();
	var rex = vCalendar.pre['accountUidParts'];
	for(var j=0;j<globalResourceCalDAVList.collections.length;j++)
	{
		if(globalResourceCalDAVList.collections[j].href!=undefined)
		{
			var uid=globalResourceCalDAVList.collections[j].uid;
			var check=$('#ResourceCalDAVList').find('[name^="'+uid+'"]');
			if(!check.prop('checked'))
			{
				check.prop('checked', true);
				var pos=globalVisibleCalDAVCollections.indexOf(uid);
				if(pos==-1)
				{
					globalVisibleCalDAVCollections[globalVisibleCalDAVCollections.length]=uid;
					if(globalSettings.displayhiddenevents.value)
						showCalendarEvents(uid);
					else
					{
						var bg = false;
						var tmpUID = uid.match(rex);
						var hrefUID='';
						if(tmpUID!=null)
							hrefUID = tmpUID[4];
						var resource = getResourceByCollection(uid);
						if(resource!=null && typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
						{
							var rbCalendars = '';
							if(resource.backgroundCalendars instanceof Array)
								rbCalendars=resource.backgroundCalendars;
							else
								rbCalendars = [resource.backgroundCalendars];
							for(var k=0; k<rbCalendars.length;k++)
							{
								if (typeof rbCalendars[k]=='string')
								{
									var index = hrefUID.indexOf(rbCalendars[k]);
									if(index!=-1)
										if(hrefUID.length == (index+rbCalendars[k].length))
											bg=true;
								}
								else if (typeof rbCalendars[k]=='object' && hrefUID.match(rbCalendars[k])!=null)
									bg = true;
							}
						}
						var collection = globalResourceCalDAVList.collections[j];
						collection.fcSource = $('#calendar').fullCalendar('addEventSource', {events:globalEventList.displayEventsArray[uid],backgroundColor:hexToRgba(collection.ecolor,0.9),borderColor:collection.ecolor,textColor:checkFontColor(collection.ecolor),background:bg});
					}
				}
			}
			collectionChBoxClick(check.get(0), '#'+check.parent().parent().attr('id'), '.resourceCalDAV_header', '.resourceCalDAV_item', null, false)
		}
		/*else
		{
			var check=$('#ResourceCalDAVList').children().eq(globalResourceCalDAVList.collections[j].index+1).find('input');
			if(!check.prop('checked'))
				check.prop('checked', true);
		}*/
	}

	if(!globalSettings.displayhiddenevents.value)
	{
		var afterScroll = $('#main').width()-$('#calendar').width();
		rerenderCalendar(beforeScroll!=afterScroll);
		globalResourceRefreshNumber--;
		if(!globalResourceRefreshNumber)
			$('#CalendarLoader').css('display','none');
	}
}

function disableAllTodo()
{
	disableAll();

	// var counter=0;
	// $('#ResourceCalDAVTODOList').children(':visible').each(function(i, e){
	// 	if($(e).hasClass('resourceCalDAVTODO_item') && $(e).find('input').prop('checked'))
	// 		counter++;
	// });
	// if(!counter)
	// 	return false;

	// if(!globalSettings.displayhiddenevents.value)
	// {
	// 	globalResourceRefreshNumberTodo++;
	// 	$('#CalendarLoaderTODO').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
	// 	var beforeScroll = $('#mainTODO').width()-$('#todoList').width();
	// 	$('#todoList').fullCalendar( 'removeEvents');
	// 	$('#todoList').fullCalendar( 'removeEventSources');
	// 	var afterScroll = $('#mainTODO').width()-$('#todoList').width();
	// 	rerenderTodo(beforeScroll!=afterScroll);
	// }

	// for(var j=0;j<globalResourceCalDAVList.TodoCollections.length;j++)
	// {
	// 	if(globalResourceCalDAVList.TodoCollections[j].href!=undefined)
	// 	{
	// 		var uid=globalResourceCalDAVList.TodoCollections[j].uid;
	// 		var check=$('#ResourceCalDAVTODOList').find('[name^="'+uid+'"]');
	// 		if(check.prop('checked'))
	// 		{
	// 			var pos=globalVisibleCalDAVTODOCollections.indexOf(uid);
	// 			if(pos!=-1)
	// 				globalVisibleCalDAVTODOCollections.splice(pos, 1);
	// 			check.prop('checked', false);
	// 			if(globalSettings.displayhiddenevents.value)
	// 				hideCalendarTodos(uid);
	// 		}
	// 		collectionChBoxClick(check.get(0), '#'+check.parent().parent().attr('id'), '.resourceCalDAVTODO_header', '.resourceCalDAVTODO_item', null, false);
	// 	}
	// 	/*else
	// 	{
	// 		var check=$('#ResourceCalDAVTODOList').children().eq(globalResourceCalDAVList.TodoCollections[j].index+1).find('input');
	// 		if(check.prop('checked'))
	// 			check.prop('checked', false);
	// 	}*/
	// }

	// if(!globalSettings.displayhiddenevents.value)
	// {
	// 	globalResourceRefreshNumberTodo--;
	// 	if(!globalResourceRefreshNumberTodo)
	// 		$('#CalendarLoaderTODO').css('display','none');
	// }
}

function enableAllTodo()
{
	enableAll();

	// var counter=0;
	// $('#ResourceCalDAVTODOList').children(':visible').each(function(i, e){
	// 	if($(e).hasClass('resourceCalDAVTODO_item') && !$(e).find('input').prop('checked'))
	// 		counter++;
	// });
	// if(!counter)
	// 	return false;

	// if(!globalSettings.displayhiddenevents.value)
	// {
	// 	globalResourceRefreshNumberTodo++;
	// 	$('#CalendarLoaderTODO').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
	// }

	// var beforeScroll = $('#mainTODO').width()-$('#todoList').width();
	// var rex = vCalendar.pre['accountUidParts'];
	// for(var j=0;j<globalResourceCalDAVList.TodoCollections.length;j++)
	// {
	// 	if(globalResourceCalDAVList.TodoCollections[j].href!=undefined)
	// 	{
	// 		var uid=globalResourceCalDAVList.TodoCollections[j].uid;
	// 		var check=$('#ResourceCalDAVTODOList').find('[name^="'+uid+'"]');
	// 		if(!check.prop('checked'))
	// 		{
	// 			check.prop('checked', true);
	// 			var pos=globalVisibleCalDAVTODOCollections.indexOf(uid);
	// 			if(pos==-1)
	// 			{
	// 				globalVisibleCalDAVTODOCollections[globalVisibleCalDAVTODOCollections.length]=uid;
	// 				if(globalSettings.displayhiddenevents.value)
	// 					showCalendarTodos(uid);
	// 				else
	// 				{
	// 					var bg = false;
	// 					var tmpUID = uid.match(rex);
	// 					var hrefUID='';
	// 					if(tmpUID!=null)
	// 						hrefUID = tmpUID[4];
	// 					var resource = getResourceByCollection(uid);
	// 					if(resource!=null && typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
	// 					{
	// 						var rbCalendars = '';
	// 						if(resource.backgroundCalendars instanceof Array)
	// 							rbCalendars=resource.backgroundCalendars;
	// 						else
	// 							rbCalendars = [resource.backgroundCalendars];
	// 						for(var k=0; k<rbCalendars.length;k++)
	// 						{
	// 							if (typeof rbCalendars[k]=='string')
	// 							{
	// 								var index = hrefUID.indexOf(rbCalendars[k]);
	// 								if(index!=-1)
	// 									if(hrefUID.length == (index+rbCalendars[k].length))
	// 										bg=true;
	// 							}
	// 							else if (typeof rbCalendars[k]=='object' && hrefUID.match(rbCalendars[k])!=null)
	// 								bg = true;
	// 						}
	// 					}
	// 					var collection = globalResourceCalDAVList.TodoCollections[j];
	// 					collection.fcSource = $('#todoList').fullCalendar('addEventSource', {events:globalEventList.displayTodosArray[collection.uid],backgroundColor:hexToRgba(collection.ecolor,0.9),borderColor:collection.ecolor});
	// 				}
	// 			}
	// 		}
	// 		collectionChBoxClick(check.get(0), '#'+check.parent().parent().attr('id'), '.resourceCalDAVTODO_header', '.resourceCalDAVTODO_item', null, false);
	// 	}
	// 	/*else
	// 	{
	// 		var check=$('#ResourceCalDAVTODOList').children().eq(globalResourceCalDAVList.TodoCollections[j].index+1).find('input');
	// 		if(!check.prop('checked'))
	// 			check.prop('checked', true);
	// 	}*/
	// }

	// if(!globalSettings.displayhiddenevents.value)
	// {
	// 	var afterScroll = $('#mainTODO').width()-$('#todoList').width();
	// 	rerenderTodo(beforeScroll!=afterScroll);
	// 	globalResourceRefreshNumberTodo--;
	// 	if(!globalResourceRefreshNumberTodo)
	// 		$('#CalendarLoaderTODO').css('display','none');
	// }
}

function disableResource(header)
{
	if(!globalSettings.displayhiddenevents.value)
	{
		globalResourceRefreshNumber++;
		$('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
	}

	var beforeScroll = $('#main').width()-$('#calendar').width();
	$(header).nextUntil('.resourceCalDAV_header').each(function(i, e){
		var uid=$(e).attr('data-id');
		var pos=globalVisibleCalDAVCollections.indexOf(uid);
		if(pos!=-1)
		{
			globalVisibleCalDAVCollections.splice(pos, 1);
			if(globalSettings.displayhiddenevents.value)
				hideCalendarEvents(uid);
			else
				$('#calendar').fullCalendar('removeEventSource', globalResourceCalDAVList.getCollectionByUID(uid).fcSource);
		}
	});

	if(!globalSettings.displayhiddenevents.value)
	{
		var afterScroll = $('#main').width()-$('#calendar').width();
		rerenderCalendar(beforeScroll!=afterScroll);
		globalResourceRefreshNumber--;
		if(!globalResourceRefreshNumber)
			$('#CalendarLoader').css('display','none');
	}
}

function enableResource(header)
{
	if(!globalSettings.displayhiddenevents.value)
	{
		globalResourceRefreshNumber++;
		$('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
	}

	var beforeScroll = $('#main').width()-$('#calendar').width();
	$(header).nextUntil('.resourceCalDAV_header').each(function(i, e){
		var uid=$(e).attr('data-id');
		var pos=globalVisibleCalDAVCollections.indexOf(uid);
		if(pos==-1)
		{
			globalVisibleCalDAVCollections[globalVisibleCalDAVCollections.length]=uid;
			if(globalSettings.displayhiddenevents.value)
				showCalendarEvents(uid);
			else
			{
				var bg = false;
				var tmpUID = uid.match(vCalendar.pre['accountUidParts']);
				var hrefUID='';
				if(tmpUID!=null)
					hrefUID = tmpUID[4];
				var resource = getResourceByCollection(uid);
				if(resource!=null && typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
				{
					var rbCalendars = '';
					if(resource.backgroundCalendars instanceof Array)
						rbCalendars=resource.backgroundCalendars;
					else
						rbCalendars = [resource.backgroundCalendars];
					for(var j=0; j<rbCalendars.length;j++)
					{
						if (typeof rbCalendars[j]=='string')
						{
							var index = hrefUID.indexOf(rbCalendars[j]);
							if(index!=-1)
								if(hrefUID.length == (index+rbCalendars[j].length))
									bg=true;
						}
						else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null)
							bg = true;
					}
				}
				var collection = globalResourceCalDAVList.getCollectionByUID(uid)
				collection.fcSource = $('#calendar').fullCalendar('addEventSource', {events:globalEventList.displayEventsArray[uid],backgroundColor:hexToRgba(collection.ecolor,0.9),borderColor:collection.ecolor,textColor:checkFontColor(collection.ecolor),background:bg});
			}
		}
	});

	if(!globalSettings.displayhiddenevents.value)
	{
		var afterScroll = $('#main').width()-$('#calendar').width();
		rerenderCalendar(beforeScroll!=afterScroll);
		globalResourceRefreshNumber--;
		if(!globalResourceRefreshNumber)
			$('#CalendarLoader').css('display','none');
	}
}

function disableResourceTodo(header)
{
	if(!globalSettings.displayhiddenevents.value)
	{
		globalResourceRefreshNumberTodo++;
		$('#CalendarLoaderTODO').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
	}

	var beforeScroll = $('#mainTODO').width()-$('#todoList').width();
	$(header).nextUntil('.resourceCalDAVTODO_header').each(function(i, e){
		var uid=$(e).attr('data-id');
		var pos=globalVisibleCalDAVTODOCollections.indexOf(uid);
		if(pos!=-1)
		{
			globalVisibleCalDAVTODOCollections.splice(pos, 1);
			if(globalSettings.displayhiddenevents.value)
				hideCalendarTodos(uid);
			else
				$('#todoList').fullCalendar('removeEventSource', globalResourceCalDAVList.getTodoCollectionByUID(uid).fcSource);
		}
	});

	if(!globalSettings.displayhiddenevents.value)
	{
		var afterScroll = $('#mainTODO').width()-$('#todoList').width();
		rerenderTodo(beforeScroll!=afterScroll);
		globalResourceRefreshNumberTodo--;
		if(!globalResourceRefreshNumberTodo)
			$('#CalendarLoaderTODO').css('display','none');
	}
	else
		$('#todoList').fullCalendar('selectEvent');
}

function enableResourceTodo(header)
{
	if(!globalSettings.displayhiddenevents.value)
	{
		globalResourceRefreshNumberTodo++;
		$('#CalendarLoaderTODO').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
	}

	var beforeScroll = $('#mainTODO').width()-$('#todoList').width();
	$(header).nextUntil('.resourceCalDAVTODO_header').each(function(i, e){
		var uid=$(e).attr('data-id');
		var pos=globalVisibleCalDAVTODOCollections.indexOf(uid);
		if(pos==-1)
		{
			globalVisibleCalDAVTODOCollections[globalVisibleCalDAVTODOCollections.length]=uid;
			if(globalSettings.displayhiddenevents.value)
				showCalendarTodos(uid);
			else
			{
				var bg = false;
				var tmpUID = uid.match(vCalendar.pre['accountUidParts']);
				var hrefUID='';
				if(tmpUID!=null)
					hrefUID = tmpUID[4];
				var resource = getResourceByCollection(uid);
				if(resource!=null && typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
				{
					var rbCalendars = '';
					if(resource.backgroundCalendars instanceof Array)
						rbCalendars=resource.backgroundCalendars;
					else
						rbCalendars = [resource.backgroundCalendars];
					for(var j=0; j<rbCalendars.length;j++)
					{
						if (typeof rbCalendars[j]=='string')
						{
							var index = hrefUID.indexOf(rbCalendars[j]);
							if(index!=-1)
								if(hrefUID.length == (index+rbCalendars[j].length))
									bg=true;
						}
						else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null)
							bg = true;
					}
				}
				var collection = globalResourceCalDAVList.getTodoCollectionByUID(uid);
				collection.fcSource = $('#todoList').fullCalendar('addEventSource', {events:globalEventList.displayTodosArray[uid],backgroundColor:hexToRgba(collection.ecolor,0.9),borderColor:collection.ecolor});
			}
		}
	});

	if(!globalSettings.displayhiddenevents.value)
	{
		var afterScroll = $('#mainTODO').width()-$('#todoList').width();
		rerenderTodo(beforeScroll!=afterScroll);
		globalResourceRefreshNumberTodo--;
		if(!globalResourceRefreshNumberTodo)
			$('#CalendarLoaderTODO').css('display','none');
	}
	else
		$('#todoList').fullCalendar('selectEvent');
}

function disableCalendar(uid)
{
	var pos=globalVisibleCalDAVCollections.indexOf(uid);
	if(pos!=-1)
	{
		globalVisibleCalDAVCollections.splice(pos, 1);
		if(globalSettings.displayhiddenevents.value)
			hideCalendarEvents(uid);
		else
		{
			var beforeScroll = $('#main').width()-$('#calendar').width();
			globalResourceRefreshNumber++;
			$('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
			$('#calendar').fullCalendar( 'removeEventSource', globalResourceCalDAVList.getCollectionByUID(uid).fcSource);
			globalResourceRefreshNumber--;

			if(!globalResourceRefreshNumber)
			{
				var afterScroll = $('#main').width()-$('#calendar').width();
				rerenderCalendar(beforeScroll!=afterScroll);
				$('#CalendarLoader').css('display','none');
			}
		}
	}
}

function enableCalendar(uid)
{
	var pos=globalVisibleCalDAVCollections.indexOf(uid);
	if(pos==-1)
	{
		globalVisibleCalDAVCollections[globalVisibleCalDAVCollections.length]=uid;
		if(globalSettings.displayhiddenevents.value)
			showCalendarEvents(uid);
		else
		{
			var beforeScroll = $('#main').width()-$('#calendar').width();
			globalResourceRefreshNumber++;
			$('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
			var bg = false;
			var tmpUID = uid.match(vCalendar.pre['accountUidParts']);
			var hrefUID='';
			if(tmpUID!=null)
				hrefUID = tmpUID[4];
			var resource = getResourceByCollection(uid);
			if(resource!=null && typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
			{
				var rbCalendars = '';
				if(resource.backgroundCalendars instanceof Array)
					rbCalendars=resource.backgroundCalendars;
				else
					rbCalendars = [resource.backgroundCalendars];
				for(var j=0; j<rbCalendars.length;j++)
				{
					if (typeof rbCalendars[j]=='string')
					{
						var index = hrefUID.indexOf(rbCalendars[j]);
						if(index!=-1)
							if(hrefUID.length == (index+rbCalendars[j].length))
								bg=true;
					}
					else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null)
						bg = true;
				}
			}
			var collection = globalResourceCalDAVList.getCollectionByUID(uid);
			collection.fcSource = $('#calendar').fullCalendar('addEventSource', {events:globalEventList.displayEventsArray[uid],backgroundColor:hexToRgba(collection.ecolor,0.9),borderColor:collection.ecolor,textColor:checkFontColor(collection.ecolor),background:bg});
			globalResourceRefreshNumber--;

			if(!globalResourceRefreshNumber)
			{
				var afterScroll = $('#main').width()-$('#calendar').width();
				rerenderCalendar(beforeScroll!=afterScroll);
				$('#CalendarLoader').css('display','none');
			}
		}
	}
}

function disableCalendarTodo(uid)
{
	var pos=globalVisibleCalDAVTODOCollections.indexOf(uid);
	if(pos!=-1)
	{
		globalVisibleCalDAVTODOCollections.splice(pos, 1);
		if(globalSettings.displayhiddenevents.value) {
			hideCalendarTodos(uid);
			$('#todoList').fullCalendar('selectEvent');
		}
		else
		{
			var beforeScroll = $('#mainTODO').width()-$('#todoList').width();
			globalResourceRefreshNumberTodo++;
			$('#CalendarLoaderTODO').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
			$('#todoList').fullCalendar( 'removeEventSource', globalResourceCalDAVList.getTodoCollectionByUID(uid).fcSource);
			globalResourceRefreshNumberTodo--;

			if(!globalResourceRefreshNumberTodo)
			{
				var afterScroll = $('#mainTODO').width()-$('#todoList').width();
				rerenderTodo(beforeScroll!=afterScroll);
				$('#CalendarLoaderTODO').css('display','none');
			}
		}
	}
}

function enableCalendarTodo(uid)
{
	var pos=globalVisibleCalDAVTODOCollections.indexOf(uid);
	if(pos==-1)
	{
		globalVisibleCalDAVTODOCollections[globalVisibleCalDAVTODOCollections.length]=uid;
		if(globalSettings.displayhiddenevents.value) {
			showCalendarTodos(uid);
			$('#todoList').fullCalendar('selectEvent');
		}
		else
		{
			var beforeScroll = $('#mainTODO').width()-$('#todoList').width();
			globalResourceRefreshNumberTodo++;
			$('#CalendarLoaderTODO').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
			var bg = false;
			var tmpUID = uid.match(vCalendar.pre['accountUidParts']);
			var hrefUID='';
			if(tmpUID!=null)
				hrefUID = tmpUID[4];
			var resource = getResourceByCollection(uid);
			if(resource!=null && typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
			{
				var rbCalendars = '';
				if(resource.backgroundCalendars instanceof Array)
					rbCalendars=resource.backgroundCalendars;
				else
					rbCalendars = [resource.backgroundCalendars];
				for(var j=0; j<rbCalendars.length;j++)
				{
					if (typeof rbCalendars[j]=='string')
					{
						var index = hrefUID.indexOf(rbCalendars[j]);
						if(index!=-1)
							if(hrefUID.length == (index+rbCalendars[j].length))
								bg=true;
					}
					else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null)
						bg = true;
				}
			}
			var collection = globalResourceCalDAVList.getTodoCollectionByUID(uid);
			collection.fcSource = $('#todoList').fullCalendar('addEventSource', {events:globalEventList.displayTodosArray[uid],backgroundColor:hexToRgba(collection.ecolor,0.9),borderColor:collection.ecolor});
			globalResourceRefreshNumberTodo--;

			if(!globalResourceRefreshNumberTodo)
			{
				var afterScroll = $('#mainTODO').width()-$('#todoList').width();
				rerenderTodo(beforeScroll!=afterScroll);
				$('#CalendarLoaderTODO').css('display','none');
			}
		}
	}
}

function enableOne(uid)
{
	for(var i=0;i<globalResourceCalDAVList.collections.length;i++)
	{
		if(globalResourceCalDAVList.collections[i].href!=undefined)
		{
			var currentUid=globalResourceCalDAVList.collections[i].uid;
			var check=$('#ResourceCalDAVList').find('[name^="'+currentUid+'"]');
			if(currentUid===uid && !check.prop('checked'))
			{
				var pos=globalVisibleCalDAVCollections.indexOf(currentUid);
				if(pos===-1)
					globalVisibleCalDAVCollections[globalVisibleCalDAVCollections.length]=uid;
				check.prop('checked', true);
			}
			else if(currentUid!==uid && check.prop('checked'))
			{
				var pos=globalVisibleCalDAVCollections.indexOf(currentUid);
				if(pos!==-1)
					globalVisibleCalDAVCollections.splice(pos, 1);
				check.prop('checked', false);
				if(globalSettings.displayhiddenevents.value)
					hideCalendarEvents(currentUid);
			}
			collectionChBoxClick(check.get(0), '#'+check.parent().parent().attr('id'), '.resourceCalDAV_header', '.resourceCalDAV_item', null, false)
		}
	}

	if(globalSettings.displayhiddenevents.value)
	{
		showCalendarEvents(uid);
	}
	else
	{
		globalResourceRefreshNumber++;
		$('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
		var beforeScroll = $('#main').width()-$('#calendar').width();
		$('#calendar').fullCalendar('removeEvents');
		$('#calendar').fullCalendar('removeEventSources');

		var bg = false;
		var tmpUID = uid.match(vCalendar.pre['accountUidParts']);
		var hrefUID='';
		if(tmpUID!=null)
			hrefUID = tmpUID[4];
		var resource = getResourceByCollection(uid);
		if(resource!=null && typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
		{
			var rbCalendars = '';
			if(resource.backgroundCalendars instanceof Array)
				rbCalendars=resource.backgroundCalendars;
			else
				rbCalendars = [resource.backgroundCalendars];
			for(var j=0; j<rbCalendars.length;j++)
			{
				if (typeof rbCalendars[j]=='string')
				{
					var index = hrefUID.indexOf(rbCalendars[j]);
					if(index!=-1)
						if(hrefUID.length == (index+rbCalendars[j].length))
							bg=true;
				}
				else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null)
					bg = true;
			}
		}
		var collection = globalResourceCalDAVList.getCollectionByUID(uid);
		collection.fcSource = $('#calendar').fullCalendar('addEventSource', {events:globalEventList.displayEventsArray[uid],backgroundColor:hexToRgba(collection.ecolor,0.9),borderColor:collection.ecolor,textColor:checkFontColor(collection.ecolor),background:bg});

		globalResourceRefreshNumber--;
		if(!globalResourceRefreshNumber)
		{
			var afterScroll = $('#main').width()-$('#calendar').width();
			rerenderCalendar(beforeScroll!=afterScroll);
			$('#CalendarLoader').css('display','none');
		}
	}
}

function enableOneTodo(uid)
{
	for(var i=0;i<globalResourceCalDAVList.TodoCollections.length;i++)
	{
		if(globalResourceCalDAVList.TodoCollections[i].href!=undefined)
		{
			var currentUid=globalResourceCalDAVList.TodoCollections[i].uid;
			var check=$('#ResourceCalDAVTODOList').find('[name^="'+currentUid+'"]');
			if(currentUid===uid && !check.prop('checked'))
			{
				var pos=globalVisibleCalDAVTODOCollections.indexOf(currentUid);
				if(pos===-1)
					globalVisibleCalDAVTODOCollections[globalVisibleCalDAVTODOCollections.length]=uid;
				check.prop('checked', true);
			}
			else if(currentUid!==uid && check.prop('checked'))
			{
				var pos=globalVisibleCalDAVTODOCollections.indexOf(currentUid);
				if(pos!==-1)
					globalVisibleCalDAVTODOCollections.splice(pos, 1);
				check.prop('checked', false);
				if(globalSettings.displayhiddenevents.value)
					hideCalendarTodos(currentUid);
			}
			collectionChBoxClick(check.get(0), '#'+check.parent().parent().attr('id'), '.resourceCalDAVTODO_header', '.resourceCalDAVTODO_item', null, false);
		}
	}

	if(globalSettings.displayhiddenevents.value)
	{
		showCalendarTodos(uid);
		$('#todoList').fullCalendar('selectEvent');
	}
	else
	{
		globalResourceRefreshNumberTodo++;
		$('#CalendarLoaderTODO').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
		var beforeScroll = $('#mainTODO').width()-$('#todoList').width();
		$('#todoList').fullCalendar( 'removeEvents');
		$('#todoList').fullCalendar( 'removeEventSources');

		var bg = false;
		var tmpUID = uid.match(vCalendar.pre['accountUidParts']);
		var hrefUID='';
		if(tmpUID!=null)
			hrefUID = tmpUID[4];
		var resource = getResourceByCollection(uid);
		if(resource!=null && typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
		{
			var rbCalendars = '';
			if(resource.backgroundCalendars instanceof Array)
				rbCalendars=resource.backgroundCalendars;
			else
				rbCalendars = [resource.backgroundCalendars];
			for(var j=0; j<rbCalendars.length;j++)
			{
				if (typeof rbCalendars[j]=='string')
				{
					var index = hrefUID.indexOf(rbCalendars[j]);
					if(index!=-1)
						if(hrefUID.length == (index+rbCalendars[j].length))
							bg=true;
				}
				else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null)
					bg = true;
			}
		}
		var collection = globalResourceCalDAVList.getTodoCollectionByUID(uid);
		collection.fcSource = $('#todoList').fullCalendar('addEventSource', {events:globalEventList.displayTodosArray[uid],backgroundColor:hexToRgba(collection.ecolor,0.9),borderColor:collection.ecolor});

		globalResourceRefreshNumberTodo--;
		if(!globalResourceRefreshNumberTodo)
		{
			var afterScroll = $('#mainTODO').width()-$('#todoList').width();
			rerenderTodo(beforeScroll!=afterScroll);
			$('#CalendarLoaderTODO').css('display','none');
		}
	}
}

function getoffsetString(offset)
{
	if(offset<0)
	{
		offset*=-1;
		offset='-'+(offset<10 ? '0' : '')+offset.toString().split('.')[0]+(offset.toString().split('.').length>1 ? '30' : '00')
	}
	else
		offset='+'+(offset<10 ? '0' : '')+offset.toString().split('.')[0]+(offset.toString().split('.').length>1 ? '30' : '00')

	return offset;
}

Date.prototype.stdTimezoneOffset=function()
{
	var jan=new Date(this.getFullYear(), 0, 1);
	var jul=new Date(this.getFullYear(), 6, 1);
	return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.dst=function()
{
	return this.getTimezoneOffset()<this.stdTimezoneOffset();
}

function setGlobalDateFunction()
{
	var date=new Date();
	var offset=date.getTimezoneOffset()*(-1)*60*1000;
}

function initFullCalendar()
{
	$('#calendar').fullCalendar({
		eventMode: true,
		contentHeight: $('#main').height() - 14, // -14px for 7px padding on top and bottom
		windowResize: function(view){
			if(globalSettings.displayhiddenevents.value)
				hideEventCalendars();
			globalCalWidth = $('#main').width();
			if(typeof globalCalDAVInitLoad!='undefined' && !globalCalDAVInitLoad && !globalResourceRefreshNumber)
				$('#CalendarLoader').css('display','none');
		},
		bindingMode: globalSettings.openformmode.value,
		startOfBusiness: globalSettings.calendarstartofbusiness.value,
		endOfBusiness: globalSettings.calendarendofbusiness.value,
		multiWeekSize: globalMultiWeekSize,
		showWeekNumbers: true,
		showDatepicker: true,
		//ignoreTimezone: !globalSettings.timezonesupport.value,
		titleFormat: {
			month: globalSettings.titleformatmonth.value,
			multiWeek: globalSettings.titleformatweek.value,
			week: globalSettings.titleformatweek.value,
			day: globalSettings.titleformatday.value,
			table: globalSettings.titleformattable.value,
		},
		columnFormat: {
			month: 'ddd',
			multiWeek: 'ddd',
			week: globalSettings.columnformatagenda.value,
			day: globalSettings.columnformatagenda.value,
			table: globalSettings.columnformatagenda.value,
		},
		timeFormat: {
			agenda: globalSettings.timeformatagenda.value,
			list: globalSettings.ampmformat.value ? 'hh:mm TT{ - hh:mm TT}' : 'HH:mm{ - HH:mm}',
			listFull: dateFormatJqToFc(globalSettings.datepickerformat.value) + (globalSettings.ampmformat.value ? ' hh:mm TT{ - ' : ' HH:mm{ - ') + dateFormatJqToFc(globalSettings.datepickerformat.value) + (globalSettings.ampmformat.value ? ' hh:mm TT}' : ' HH:mm}'),
			listFullAllDay: dateFormatJqToFc(globalSettings.datepickerformat.value) + '{ - ' + dateFormatJqToFc(globalSettings.datepickerformat.value) + '}',
			'': globalSettings.timeformatbasic.value
		},
		axisFormat: globalSettings.ampmformat.value ? 'h:mm TT' : 'H:mm',
		buttonText: {
			month: localization[globalInterfaceLanguage].fullCalendarMonth,
			multiWeek: localization[globalInterfaceLanguage].fullCalendarMultiWeek,
			week: localization[globalInterfaceLanguage].fullCalendarAgendaWeek,
			day: localization[globalInterfaceLanguage].fullCalendarAgendaDay,
			table: localization[globalInterfaceLanguage].fullCalendarTable,
			today: localization[globalInterfaceLanguage].fullCalendarTodayButton,
			prevMonth: localization[globalInterfaceLanguage].loadPrevMonth,
			nextMonth: localization[globalInterfaceLanguage].loadNextMonth,
		},
		allDayText: localization[globalInterfaceLanguage].fullCalendarAllDay,
		monthNames: localization[globalInterfaceLanguage].monthNames,
		monthNamesShort: localization[globalInterfaceLanguage].monthNamesShort,
		dayNames: localization[globalInterfaceLanguage].dayNames,
		dayNamesShort: localization[globalInterfaceLanguage].dayNamesShort,
		dayEventSizeStrict: true,
		dayClick: function(date, allDay, jsEvent, view){
			if($('#ResourceCalDAVList .resourceCalDAV_item:visible').not('.resourceCalDAV_item_ro').length==0)
				return false;
			$('#show').val('');
			$('#CAEvent').hide();
			$('#timezonePicker').prop('disabled', true);
			$('#EventDisabler').fadeIn(globalEditorFadeAnimation, function(){
				showEventForm(date, allDay, null, jsEvent, 'new','');
				$('#name').focus();
			});
		},
		beforeViewDisplay: function(view){
			// Hide scrollbar to force view rendering on full width
			if(globalAllowFcRerender)
				$('#main').css('overflow','hidden');
		},
		viewDisplay: function(view){
			// Allow scrollbar if previosly hidden
			if(globalAllowFcRerender)
				$('#main').css('overflow','');
			// If scrollbar present, force view rendering on reduced width
			if(globalAllowFcRerender && $('#main').width() - $('#calendar').width())
			{
				globalAllowFcRerender=false;
				$('#calendar').fullCalendar('render');
				return false;
			}

			globalCalWidth=$('#main').width();
			if(globalSettings.displayhiddenevents.value)
				hideEventCalendars();
			globalAllowFcRerender=true;
		},
		firstDay: globalSettings.datepickerfirstdayofweek.value,
		weekendDays: globalSettings.weekenddays.value,
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,multiWeek,agendaWeek,agendaDay'
		},
		listSections: 'day',
		headerContainer: $('#main_h_placeholder'),
		defaultView: globalSettings.activeview.value,
		editable: true,
		currentTimeIndicator: true,
		unselectAuto: false,
		eventClick: function(calEvent, jsEvent, view){
			globalCalEvent=calEvent;
			globalJsEvent=jsEvent;
			if(calEvent.type=='')
				showEventForm(null, calEvent.allDay, calEvent, jsEvent, 'show', '');
			else
				showEventForm(null, calEvent.allDay, calEvent, jsEvent, 'show', 'editOnly');
		},
		eventDragStart: function(calEvent, jsEvent, ui, view){
			globalPrevDragEventAllDay=calEvent.allDay;
		},
		eventDrop: function(calEvent, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
			if(calEvent.rid!='')
			{
				var coll = globalResourceCalDAVList.getCollectionByUID(calEvent.res_id);
				if(coll!=null && coll.permissions.read_only)
				{
					revertFunc();
					return false;
				}

			}
			if(calEvent.realStart && calEvent.realEnd)
			{
				var checkDate=new Date(calEvent.realStart.getFullYear(), calEvent.realStart.getMonth(), calEvent.realStart.getDate()+dayDelta, calEvent.realStart.getHours(), calEvent.realStart.getMinutes()+minuteDelta,0);
				var checkDateEnd=new Date(calEvent.realEnd.getFullYear(), calEvent.realEnd.getMonth(), calEvent.realEnd.getDate()+dayDelta, calEvent.realEnd.getHours(), calEvent.realEnd.getMinutes()+minuteDelta,0);
				if(calEvent.type!='')
				{
					calEvent.start=checkDate;
					calEvent.end=checkDateEnd;
				}
				else
				{
					calEvent.realStart=checkDate;
					calEvent.realEnd=checkDateEnd;
				}
			}
			else
			{
				calEvent.realStart=calEvent.start;
				calEvent.realEnd=calEvent.end;
			}

			globalRevertFunction=revertFunc;
			if(calEvent.type!='')
				showEventForm(null, calEvent.allDay, calEvent, jsEvent, 'drop', 'editOnly');
			else
				showEventForm(null, calEvent.allDay, calEvent, jsEvent, 'drop', '');

			save(true);
			globalPrevDragEvent = null;
		},
		eventResize: function(calEvent, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view){
			globalPrevDragEventAllDay=calEvent.allDay;
			if(calEvent.rid!='')
			{
				var coll = globalResourceCalDAVList.getCollectionByUID(calEvent.res_id);
				if(coll!=null && coll.permissions.read_only)
				{
					revertFunc();
					return false;
				}
			}

			if(calEvent.realStart && calEvent.realEnd)
			{
				var checkDateEnd = new Date(calEvent.realEnd.getFullYear(),calEvent.realEnd.getMonth(), calEvent.realEnd.getDate()+dayDelta, calEvent.realEnd.getHours(),calEvent.realEnd.getMinutes()+minuteDelta,0);
				if(calEvent.type!='')
					calEvent.end=checkDateEnd;
				else
					calEvent.realEnd=checkDateEnd;
			}
			else
				calEvent.realEnd=calEvent.end;
			globalRevertFunction=revertFunc;

			if(calEvent.type!='')
				showEventForm(null, calEvent.allDay, calEvent, jsEvent, 'drop', 'editOnly');
			else
				showEventForm(null, calEvent.allDay, calEvent, jsEvent, 'drop', '');

			save(true);
		},
		eventResizeHelperCreated: function(calEvent, jsEvent, element, helper, view){
			if(element.hasClass('searchCalDAV_hide'))
				helper.addClass('searchCalDAV_hide');
			if(element.hasClass('checkCalDAV_hide'))
				helper.addClass('checkCalDAV_hide');
		},
		selectable: true,
		selectHelper: false,
		select: function(startDate, endDate, allDay, jsEvent, view){
			$('#show').val('');
			$('#CAEvent').hide();
			$('#timezonePicker').prop('disabled', true);
			$('#EventDisabler').fadeIn(globalEditorFadeAnimation, function(){
				var calEvent=new Object();
				calEvent.start=startDate;
				calEvent.end=endDate;
				showEventForm(null, allDay, calEvent, jsEvent, 'new', '');
				$('#name').focus();
			});
		},
		eventAfterRender: function(event, element, view){
			element.attr('data-res-id',event.res_id);
			element.attr('data-id',event.id);
			element.addClass('event_item');

			if(event.status == 'CANCELLED')
				$(element).find('.fc-event-title').css('text-decoration', 'line-through');

			if(typeof event.hidden!='undefined' && event.hidden) {
				element.addClass('searchCalDAV_hide');
				if(view.name=='table' && !$(element).siblings().addBack().not('.searchCalDAV_hide').length)
					$(element).parent().prev().find('tr').addClass('searchCalDAV_hide');
			}

			element.mouseenter(function(e){
				clearTimeout(globalEventTimeoutID);
				globalEventTimeoutID = setTimeout(function(){
					showEventPopup(e, event);
				}, 500);
			});
			element.mousemove(function(e){
				if($('#CalDavZAPPopup').is(':visible'))
					moveEventPopup(e);
			});
			element.mouseout(function(e){
				if(!$.contains(element.get(0),e.relatedTarget)) {
					clearTimeout(globalEventTimeoutID);
					hideEventPopup();
				}
			});
		},
		viewChanged: function(view) {
			$('#CAEvent').hide();
		},
		todayClick: function() {
			$('#CAEvent').hide();
		},
		prevClick: function() {
			$('#CAEvent').hide();
			getPrevMonths($('#calendar').fullCalendar('getView').start);
		},
		nextClick: function() {
			$('#CAEvent').hide();
			getNextMonths($('#calendar').fullCalendar('getView').end);
		}
	});
}

function todoCheckClick(status, percent, calTodo)
{
	var id=calTodo.repeatHash;
	if(typeof globalTodolistStatusArray[id]!='undefined' && typeof globalTodolistStatusArray[id].timeout!='undefined')
		clearTimeout(globalTodolistStatusArray[id].timeout);
	else if(typeof globalTodolistStatusArray[id]=='undefined')
		globalTodolistStatusArray[id]={};

	globalTodolistStatusArray[id].timeout = setTimeout(function(){
		if(typeof globalTodolistStatusArray[id]!='undefined')
		{
			$('#todoList').fullCalendar('allowSelectEvent',false);
			fullVcalendarToTodoData(calTodo,false);
			if(percent=='50' && typeof globalTodolistStatusArray[id].percent!='undefined')
				percent=globalTodolistStatusArray[id].percent;

			var vCalendarText='',
			groupCounter=0;
			// vCalendar BEGIN (required by RFC)
			if(vCalendar.tplM['VTbegin'][id]!=null && (process_elem=vCalendar.tplM['VTbegin'][id][0])!=undefined)
				vCalendarText+=vCalendar.tplM['VTbegin'][id][0];
			else
			{
				process_elem=vCalendar.tplC['VTbegin'];
				process_elem=process_elem.replace('##:::##group_wd##:::##', '');
				vCalendarText+=process_elem;
			}

			// VERSION (required by RFC)
			if(vCalendar.tplM['VTcontentline_VERSION'][id]!=null && (process_elem=vCalendar.tplM['VTcontentline_VERSION'][id][0])!=undefined)
			{
				// replace the object and related objects' group names (+ append the related objects after the processed)
				parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
				if(parsed[1]!='') // if group is present, replace the object and related objects' group names
					process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
			}
			else
			{
				process_elem=vCalendar.tplC['VTcontentline_VERSION'];
				process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			}
			process_elem=process_elem.replace('##:::##version##:::##', '2.0');
			vCalendarText+=process_elem;

			// CALSCALE
			if(vCalendar.tplM['VTcontentline_CALSCALE'][id]!=null && (process_elem=vCalendar.tplM['VTcontentline_CALSCALE'][id][0])!=undefined)
			{
				// replace the object and related objects' group names (+ append the related objects after the processed)
				parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
				if(parsed[1]!='') // if group is present, replace the object and related objects' group names
					process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
			}
			else
			{
				process_elem=vCalendar.tplC['VTcontentline_CALSCALE'];
				process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			}
			process_elem=process_elem.replace('##:::##calscale##:::##', 'GREGORIAN');
			vCalendarText+=process_elem;
			var stringUIDcurrent=calTodo.vcalendar.match(vCalendar.pre['contentline_UID']);
			if(stringUIDcurrent!=null)
				stringUIDcurrent=stringUIDcurrent[0].match(vCalendar.pre['contentline_parse'])[4];
			var rec_id='';
			if(calTodo.type!='' && calTodo.rec_id=='' && (!globalSettings.appleremindersmode.value || typeof globalAppleSupport.nextDates[calTodo.id]!='undefined'))
			{
				if(calTodo.repeatStart!='' && calTodo.start)
				{
					if(typeof calTodo.realStart=='object')
						rec_id=$.fullCalendar.formatDate(calTodo.realStart, "yyyyMMdd'T'HHmmss");
					else if(typeof calTodo.realStart =='string')
						rec_id=$.fullCalendar.formatDate($.fullCalendar.parseDate(calTodo.realStart), "yyyyMMdd'T'HHmmss");
				}
				else if(calTodo.repeatEnd!='' && calTodo.end)
				{
					if(typeof calTodo.realEnd =='object')
						rec_id=$.fullCalendar.formatDate(calTodo.realEnd, "yyyyMMdd'T'HHmmss");
					else if(typeof calTodo.realEnd =='string')
						rec_id=$.fullCalendar.formatDate($.fullCalendar.parseDate(calTodo.realEnd), "yyyyMMdd'T'HHmmss");
				}
			}
			else
				rec_id=calTodo.rec_id;
			var resultTodoObj = getRepeatTodoObject({
				rid:calTodo.res_id,
				uidTodo:calTodo.id,
				vcalendarHash: hex_sha256(calTodo.vcalendar),
				vcalendarUID: stringUIDcurrent,
				recurrenceId: rec_id,
				timezoneTODO: calTodo.timeZone,
				futureStart: '',
				deleteMode: false,
				vCalendarText:vCalendarText
			});
			vCalendarText = resultTodoObj.vCalendarText;
			var tzArray=resultTodoObj.tzArray;
			var tzString=resultTodoObj.tzString;
			var isTimeZone=resultTodoObj.isTimeZone;
			var origTimezone =resultTodoObj.origTimezone;
			var appleTodoMode=resultTodoObj.appleTodoMode;
			var realTodo = calTodo;
			var newFirst = resultTodoObj.newFirst;
			var sel_option = resultTodoObj.sel_option;
			var isUTC=false, timeZoneAttr='';
			var origFirst=vCalendarText;

			if(appleTodoMode)
				vCalendarText='';

			if(realTodo.start!=null || realTodo.end!=null)
			{
				if(globalSettings.timezonesupport.value)
					sel_option=realTodo.timeZone;
				if(sel_option=='UTC')
				{
					isUTC=true;
					timeZoneAttr='';
				}
				else if(sel_option=='local')
					timeZoneAttr='';
				else if(sel_option=='custom')
					timeZoneAttr=';'+vcalendarEscapeValue('TZID='+realTodo.timeZone);
				else
					timeZoneAttr=';'+vcalendarEscapeValue('TZID='+sel_option);

				if(vCalendarText.lastIndexOf('\r\n')!=(vCalendarText.length-2))
					vCalendarText+='\r\n';
				if(globalSettings.rewritetimezonecomponent.value || !vCalendar.tplM['unprocessedVTIMEZONE'][id])
				{
					if(tzArray.indexOf(sel_option)==-1)
						vCalendarText+=buildTimezoneComponent(sel_option);
				}
				else
					vCalendarText+=vCalendar.tplM['VTunprocessedVTIMEZONE'][id];
			}
			origFirst+=vCalendarText;

			var todoVc = calTodo.vcalendar;
			if(todoVc.indexOf('\r\n')==0 && vCalendarText.lastIndexOf('\r\n')==(vCalendarText.length-2))
				todoVc=todoVc.substring(2);
			if(todoVc.lastIndexOf('\r\n')!=(todoVc.length-2))
				todoVc+='\r\n';
			var additionalVCalendar = '';

			var d=new Date(), utc;
			utc=d.getUTCFullYear()+(d.getUTCMonth()+1<10 ? '0': '')+(d.getUTCMonth()+1)+(d.getUTCDate()<10 ? '0': '')+d.getUTCDate()+'T'+(d.getUTCHours()<10 ? '0': '')+d.getUTCHours()+(d.getUTCMinutes()<10 ? '0': '')+d.getUTCMinutes()+(d.getUTCSeconds()<10 ? '0': '')+d.getUTCSeconds()+'Z';
			if(rec_id=='')
				var checkVal='orig';
			else
				var checkVal=rec_id;
			var created='';
			for(var vev in vCalendar.tplM['VTcontentline_CREATED'][id])
			{
				if(vev==checkVal)
					created=vCalendar.tplM['VTcontentline_CREATED'][id][vev];
			}
			var v_element=null;
			if(created=='')
			{
				process_elem=vCalendar.tplC['VTcontentline_CREATED'];
				process_elem=process_elem.replace('##:::##group_wd##:::##', '');
				process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
				process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(utc));
				v_element=todoVc.match(vCalendar.pre['contentline_CREATED']);
				if(v_element!=null)
					todoVc=todoVc.replace(v_element[0], '\r\n'+process_elem);
				else
					additionalVCalendar+=process_elem;
			}

			process_elem=vCalendar.tplC['VTcontentline_LM'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
			process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(utc));
			v_element=todoVc.match(vCalendar.pre['contentline_LM']);
			if(v_element!=null)
				todoVc=todoVc.replace(v_element[0], '\r\n'+process_elem);
			else
				additionalVCalendar+=process_elem;

			process_elem=vCalendar.tplC['VTcontentline_DTSTAMP'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
			process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(utc));
			v_element=todoVc.match(vCalendar.pre['contentline_DTSTAMP']);
			if(v_element!=null)
				todoVc=todoVc.replace(v_element[0], '\r\n'+process_elem);
			else
				additionalVCalendar+=process_elem;

			// UID (required by RFC)
			if(appleTodoMode)
			{
				process_elem=vCalendar.tplC['VTcontentline_UID'];
				process_elem=process_elem.replace('##:::##group_wd##:::##', '');
				process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
				var newUID=globalEventList.getNewUID();
				process_elem=process_elem.replace('##:::##uid##:::##', newUID);
				v_element=todoVc.match(vCalendar.pre['contentline_UID']);
				if(v_element!=null)
					todoVc=todoVc.replace(v_element[0], '\r\n'+process_elem);
			}


			process_elem=vCalendar.tplC['VTcontentline_STATUS'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
			process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(status));
			v_element=todoVc.match(vCalendar.pre['contentline_STATUS']);
			if(v_element!=null)
				todoVc=todoVc.replace(v_element[0], '\r\n'+process_elem);
			else
				additionalVCalendar+=process_elem;

			process_elem=vCalendar.tplC['VTcontentline_PERCENT-COMPLETE'];
			process_elem=process_elem.replace('##:::##group_wd##:::##', '');
			process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
			process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(percent));
			v_element=todoVc.match(vCalendar.pre['contentline_PERCENT-COMPLETE']);
			if(v_element!=null)
				todoVc=todoVc.replace(v_element[0], '\r\n'+process_elem);
			else
				additionalVCalendar+=process_elem;

			//RECURRENCE-ID
			if(rec_id!='')
			{
				if(!appleTodoMode)
				{
					process_elem=vCalendar.tplC['VTcontentline_REC_ID'];
					process_elem=process_elem.replace('##:::##group_wd##:::##', '');
					process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
					if(rec_id.indexOf('T')==-1)
					{
						process_elem=process_elem.replace('##:::##AllDay##:::##', ';'+vcalendarEscapeValue('VALUE=DATE'));
						process_elem=process_elem.replace('##:::##TZID##:::##', vcalendarEscapeValue(''));
						process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(rec_id));
					}
					else
					{
						process_elem=process_elem.replace('##:::##AllDay##:::##', vcalendarEscapeValue(''));
						process_elem=process_elem.replace('##:::##TZID##:::##',timeZoneAttr);
						if(isUTC && rec_id.charAt(rec_id.length-1)!='Z')
							rec_id+='Z';
						process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(rec_id));
					}
					v_element=todoVc.match(vCalendar.pre['contentline_RECURRENCE_ID']);
					if(v_element!=null)
						todoVc=todoVc.replace(v_element[0], '\r\n'+process_elem);
					else
						additionalVCalendar+=process_elem;
				}
				var vcalendar_rule_element=todoVc.match(vCalendar.pre['contentline_RRULE2']);
				if(vcalendar_rule_element!=null)
					todoVc=todoVc.replace(vcalendar_rule_element[0], '\r\n');
				while(todoVc.match(vCalendar.pre['contentline_EXDATE'])!= null)
				{
					var vcalendar_ex_element=todoVc.match(vCalendar.pre['contentline_EXDATE']);
					if(vcalendar_ex_element!=null)
					{
						todoVc=todoVc.replace(vcalendar_ex_element[0], '\r\n');
					}
				}
			}

			if(realTodo.realStart!='' || realTodo.realEnd!='')
			{
				if(realTodo.realStart!='' && !appleTodoMode)
				{
					process_elem=vCalendar.tplC['VTcontentline_E_DTSTART'];
					process_elem=process_elem.replace('##:::##group_wd##:::##', '');
					process_elem=process_elem.replace('##:::##params_wsc##:::##', '');

					if(typeof realTodo.realStart=='object')
						var datetime_from=$.fullCalendar.formatDate(realTodo.realStart, "yyyyMMdd'T'HHmmss");
					else if(typeof realTodo.realStart =='string')
						var datetime_from=$.fullCalendar.formatDate($.fullCalendar.parseDate(realTodo.realStart), "yyyyMMdd'T'HHmmss");

					process_elem=process_elem.replace('##:::##AllDay##:::##', vcalendarEscapeValue(''));
					process_elem=process_elem.replace('##:::##TZID##:::##', timeZoneAttr);
					process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(datetime_from+(isUTC ? 'Z' : '')));

					if(appleTodoMode)
					{
						var process_elem2 = '';
						process_elem2=vCalendar.tplC['VTcontentline_DUE'];
						process_elem2=process_elem2.replace('##:::##group_wd##:::##', '');
						process_elem2=process_elem2.replace('##:::##params_wsc##:::##', '');
						process_elem2=process_elem2.replace('##:::##AllDay##:::##', vcalendarEscapeValue(''));
						process_elem2=process_elem2.replace('##:::##TZID##:::##',timeZoneAttr);
						process_elem2=process_elem2.replace('##:::##value##:::##', vcalendarEscapeValue(datetime_from+(isUTC ? 'Z' : '')));
						v_element=todoVc.match(vCalendar.pre['contentline_DUE']);

						if(v_element!=null)
							todoVc=todoVc.replace(v_element[0], '\r\n'+process_elem2);
						else
							additionalVCalendar+=process_elem2;
					}
					v_element=todoVc.match(vCalendar.pre['contentline_DTSTART']);
					if(v_element!=null)
						todoVc=todoVc.replace(v_element[0], '\r\n'+process_elem);
					else
						additionalVCalendar+=process_elem;
				}

				if(realTodo.realEnd!='')
				{
					process_elem=vCalendar.tplC['VTcontentline_DUE'];
					process_elem=process_elem.replace('##:::##group_wd##:::##', '');
					process_elem=process_elem.replace('##:::##params_wsc##:::##', '');

					if(typeof realTodo.realEnd=='object')
						var datetime_to=$.fullCalendar.formatDate(realTodo.realEnd, "yyyyMMdd'T'HHmmss");
					else if(typeof realTodo.realEnd =='string')
						var datetime_to=$.fullCalendar.formatDate($.fullCalendar.parseDate(realTodo.realEnd), "yyyyMMdd'T'HHmmss");

					process_elem=process_elem.replace('##:::##AllDay##:::##', vcalendarEscapeValue(''));
					process_elem=process_elem.replace('##:::##TZID##:::##',timeZoneAttr);
					process_elem=process_elem.replace('##:::##value##:::##', vcalendarEscapeValue(datetime_to+(isUTC ? 'Z' : '')));

					if(globalSettings.appleremindersmode.value)
					{
						var process_elem2 = '';
						process_elem2=vCalendar.tplC['VTcontentline_E_DTSTART'];
						process_elem2=process_elem2.replace('##:::##group_wd##:::##', '');
						process_elem2=process_elem2.replace('##:::##params_wsc##:::##', '');

						process_elem2=process_elem2.replace('##:::##AllDay##:::##', vcalendarEscapeValue(''));
						process_elem2=process_elem2.replace('##:::##TZID##:::##',timeZoneAttr);
						process_elem2=process_elem2.replace('##:::##value##:::##', vcalendarEscapeValue(datetime_to+(isUTC ? 'Z' : '')));
						v_element=todoVc.match(vCalendar.pre['contentline_DTSTART']);
						if(v_element!=null)
							todoVc=todoVc.replace(v_element[0], '\r\n'+process_elem2);
						else
							additionalVCalendar+=process_elem2;
					}
					v_element=todoVc.match(vCalendar.pre['contentline_DUE']);
					if(v_element!=null)
						todoVc=todoVc.replace(v_element[0], '\r\n'+process_elem);
					else
						additionalVCalendar+=process_elem;
				}
			}

			if(status=='COMPLETED'&&percent=='100')
			{
				var datetime_completed=new Date();

				sel_option='local';
				if(globalSettings.timezonesupport.value && realTodo.timeZone!='' && realTodo.timeZone!='local')
					sel_option=realTodo.timeZone;

				if(sel_option!='local')
				{
					var valOffsetFrom=getOffsetByTZ(sel_option, datetime_completed);
					var intOffset = valOffsetFrom.getSecondsFromOffset()*-1;
					datetime_completed = new Date(datetime_completed.setSeconds(intOffset));
				}
				var newValue=$.fullCalendar.formatDate(datetime_completed, "yyyyMMdd'T'HHmmss")+'Z';

				process_elem=vCalendar.tplC['VTcontentline_COMPLETED'];
				process_elem=process_elem.replace('##:::##group_wd##:::##', '');
				process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
				process_elem=process_elem.replace('##:::##value##:::##', newValue);
				v_element=todoVc.match(vCalendar.pre['contentline_COMPLETED']);
				if(v_element!=null)
					todoVc=todoVc.replace(v_element[0], '\r\n'+process_elem);
				else
					additionalVCalendar+=process_elem;
			}
			else
			{
				v_element=todoVc.match(vCalendar.pre['contentline_COMPLETED']);
				if(v_element!=null)
					todoVc=todoVc.replace(v_element[0], '\r\n');
			}

			if(typeof vCalendar.tplM['VTalarm_STRING'][id]!='undefined'&&vCalendar.tplM['VTalarm_STRING'][id]!='')
				additionalVCalendar+=vCalendar.tplM['VTalarm_STRING'][id];
			if(additionalVCalendar!='')
			{
				process_elem=vCalendar.tplC['VTendVTODO'];
				process_elem=process_elem.replace('##:::##group_wd##:::##', '');
				v_element=todoVc.match(vCalendar.re['endVTODO']);
				if(v_element!=null)
					todoVc=todoVc.replace(v_element[0], additionalVCalendar+process_elem);
			}
			vCalendarText+=todoVc;
			if(appleTodoMode)
			{
				if(vCalendarText.indexOf('\r\n')==0 && newFirst.lastIndexOf('\r\n')==(newFirst.length-2))
					newFirst+=vCalendarText.substring(2,vCalendarText.length);
				else if((vCalendarText.indexOf('\r\n')==0 && newFirst.lastIndexOf('\r\n')!=(newFirst.length-2)) || (vCalendarText.indexOf('\r\n')!=0 && newFirst.lastIndexOf('\r\n')==(newFirst.length-2)) )
					newFirst+=vCalendarText;
				else
					newFirst+='\r\n'+vCalendarText;
			}
			if(appleTodoMode)
				vCalendarText = '';
			// PRODID
			if(vCalendar.tplM['VTcontentline_PRODID'][id]!=null && (process_elem=vCalendar.tplM['VTcontentline_PRODID'][id][0])!=undefined)
			{
				// replace the object and related objects' group names (+ append the related objects after the processed)
				parsed=('\r\n'+process_elem).match(RegExp('\r\n((?:'+vCalendar.re['group']+'\\.)?)', 'm'));
				if(parsed[1]!='') // if group is present, replace the object and related objects' group names
					process_elem=('\r\n'+process_elem).replace(RegExp('\r\n'+parsed[1].replace('.', '\\.'), 'mg'), '\r\nitem'+(groupCounter++)+'.').substring(2);
			}
			else
			{
				process_elem=vCalendar.tplC['VTcontentline_PRODID'];
				process_elem=process_elem.replace('##:::##group_wd##:::##', '');
				process_elem=process_elem.replace('##:::##params_wsc##:::##', '');
			}
			process_elem=process_elem.replace('##:::##value##:::##', '-//Inf-IT//'+globalAppName+' '+globalVersion+'//EN');
			vCalendarText+=process_elem;

			if(typeof vCalendar.tplM['VTunprocessed'][id]!='undefined' && vCalendar.tplM['VTunprocessed'][id]!='' && vCalendar.tplM['VTunprocessed'][id]!=null)
			{
				if(!appleTodoMode)
					vCalendarText+=vCalendar.tplM['VTunprocessed'][id].replace(RegExp('^\r\n'), '');
				else
					origFirst+=vCalendar.tplM['VTunprocessed'][id].replace(RegExp('^\r\n'), '');;
			}

			vCalendar.tplM['VTunprocessed'][id]=new Array();

			// vCalendar END (required by RFC)
			if(vCalendar.tplM['VTend'][id]!=null && (process_elem=vCalendar.tplM['VTend'][id][0])!=undefined)
				vCalendarText+=vCalendar.tplM['VTend'][id][0];
			else
			{
				process_elem=vCalendar.tplC['VTend'];
				process_elem=process_elem.replace('##:::##group_wd##:::##', '');
				vCalendarText+=process_elem;
			}

			var textArray = new Array();
			if(appleTodoMode)
			{
				newFirst += vCalendarText;
				if(origFirst.lastIndexOf('\r\n')!=(origFirst.length-2))
					origFirst += '\r\n';
				origFirst += vCalendarText;
				var fixed = checkAndFixMultipleUID(newFirst,false);
				if(fixed.length==1)
					textArray[textArray.length]=origFirst;
				else
					textArray=fixed;
				vCalendarText = newFirst;
			}
			var fixedArr = checkAndFixMultipleUID(vCalendarText,false);
			fixedArr = $.merge(textArray,fixedArr);
			var inputS = fixedArr[0];
			fixedArr.splice(0,1);

			var inputUID='';
			var coll = globalResourceCalDAVList.getTodoCollectionByUID(calTodo.id.substring(0, calTodo.id.lastIndexOf('/')+1));
			var res = getAccount(coll.accountUID);
			var tmp=res.href.match(vCalendar.pre['hrefRex']);
			var accountUID=tmp[1]+res.userAuth.userName+'@'+tmp[2];
			CalDAVeditor_cleanup(id);

			return putVcalendarToCollection(accountUID, calTodo.id, calTodo.etag, inputS, '','vtodo',true,false,fixedArr);
		}
	},globalTodoCheckTimeoutDelay);
}

function initTodoList()
{
	$('#todoList').fullCalendar({
		eventMode: false,
		showUnstartedEvents: globalSettings.appleremindersmode.value,
		simpleFilters: globalSettings.appleremindersmode.value,
		contentHeight: $('#mainTODO').height() - 14, //-14px for 7px padding on top and bottom
		windowResize: function(view){
			if(globalSettings.displayhiddenevents.value)
				hideTodoCalendars();
		},
		showDatepicker: true,
		titleFormat: {
			todo: globalSettings.titleformattable.value
		},
		columnFormat: {
			todo: globalSettings.columnformatagenda.value
		},
		timeFormat: {
			list: dateFormatJqToFc(globalSettings.datepickerformat.value) + (globalSettings.ampmformat.value ? ' hh:mm TT' : ' HH:mm')
		},
		axisFormat: globalSettings.ampmformat.value ? 'h:mm TT' : 'H:mm',
		buttonText: {
			today: localization[globalInterfaceLanguage].fullCalendarTodayButton,
			filtersHeader: localization[globalInterfaceLanguage].txtStatusFiltersHeaderTODO,
			filtersFooter: localization[globalInterfaceLanguage].txtStatusFiltersFooterTODO,
			filterAction: localization[globalInterfaceLanguage].txtStatusNeedsActionTODO,
			filterProgress: localization[globalInterfaceLanguage].txtStatusInProcessTODO,
			filterCompleted: localization[globalInterfaceLanguage].txtStatusCompletedTODO,
			filterCanceled: localization[globalInterfaceLanguage].txtStatusCancelledTODO,
		},
		allDayText: localization[globalInterfaceLanguage].fullCalendarAllDay,
		monthNames: localization[globalInterfaceLanguage].monthNames,
		monthNamesShort: localization[globalInterfaceLanguage].monthNamesShort,
		dayNames: localization[globalInterfaceLanguage].dayNames,
		dayNamesShort: localization[globalInterfaceLanguage].dayNamesShort,
		defaultFilters: globalSettings.todolistfilterselected.value,
		viewDisplay: function(view){
			if(globalSettings.displayhiddenevents.value)
				hideTodoCalendars();
			$('.fc-view-todo').removeClass('fc-view-trans');
		},
		firstDay: globalSettings.datepickerfirstdayofweek.value,
		weekendDays: globalSettings.weekenddays.value,
		header: {
			left: 'prev,next today',
			center: '',
			right: ''
		},
		listSections: 'day',
		headerContainer: $('#mainTODO_h_placeholder'),
		defaultView: 'todo',
		editable: true,
		todoColThresholds: [
			{'col':'priority', 'width':552},
			{'col':'location', 'width':702}
		],
		todoOptionalCols: [
			{'col':'time', 'width':142},
			{'col':'priority', 'width':18},
			{'col':'location', 'width':150}
		],
		selectEmpty: function(){
			if($('#todoInEdit').val()!=='true') {
				$('#CATodo').attr('style','display:none');
				$('#todoColor').css('background-color','');
			}
		},
		eventClick: function(calTodo, jsEvent, view){
			if($('#todoInEdit').val()=='true')
				return false;

			globalCalTodo=calTodo;
			if(calTodo.type=='')
				showTodoForm(calTodo, 'show', '');
			else
			{
				if(globalSettings.appleremindersmode.value && (calTodo.status=='COMPLETED' || calTodo.status== 'CANCELLED'))
					showTodoForm(calTodo, 'show', '');
				else if(!globalSettings.appleremindersmode.value || typeof globalAppleSupport.nextDates[calTodo.id] != 'undefined')
					showTodoForm(calTodo, 'show', 'editOnly');
				else
					showTodoForm(calTodo, 'show', '');
			}
		},
		eventCheckDefault: function(event, checkbox, view) {
			var percent = parseInt(event.percent, 10);
			if(globalSettings.appleremindersmode.value)
				checkbox.prop('checked', percent>99);
			else {
				checkbox.prop({'checked':percent>0, 'indeterminate':percent>0 && percent<100});
				checkbox.attr('data-ind', percent>0 && percent<100 ? 'true' : 'false');
			}

			checkbox.prop('disabled', globalResourceCalDAVList.getTodoCollectionByUID(event.res_id).permissions.read_only);
		},
		eventCheckClicked: function(checkbox, calTodo, jsEvent, view) {
			// [] -> [-]	--->	false, false -> true, false  -> true, true
			// [-] -> [x]	--->	true, true   -> false, false -> true, false
			// [x] -> [-x-] --->	true, false  -> false, false -> true, false
			// [-x-] -> []	--->	true, false  -> false, false -> false, false

			jsEvent.stopPropagation();

			var eventElement = checkbox.parent().parent();
			var checked = checkbox.prop('checked');
			var ind = checkbox.attr('data-ind')==='true';
			var cancelled = eventElement.hasClass('fc-event-cancelled');

			if(!globalSettings.appleremindersmode.value) {
				checkbox.prop({'checked':ind || !checked && !cancelled ? !checked : checked, 'indeterminate':checked});
				checkbox.attr('data-ind', checked ? 'true' : 'false');
				eventElement.toggleClass('fc-event-cancelled', !ind && !checked && !cancelled);
			}

			var percent = '';
			var status = '';

			if(!checkbox.prop('checked')) {
				percent = '0';
				status = 'NEEDS-ACTION';
			}
			else if(checkbox.prop('indeterminate')) {
				percent = '50';
				status = 'IN-PROCESS';
			}
			else if(eventElement.hasClass('fc-event-cancelled')) {
				percent = '100';
				status = 'CANCELLED';
			}
			else {
				percent = '100';
				status = 'COMPLETED';
			}

			todoCheckClick(status, percent, calTodo);
		},
		eventAfterRender: function(event, element, view){
			element.attr("data-res-id",event.res_id);
			element.attr("data-repeat-hash",event.repeatHash);
			if(event.start)
				element.attr("data-start", $.fullCalendar.formatDate(event.start, "yyyyMMdd'T'HHmmss'Z'"));
			else
				element.attr("data-start", '');
			element.attr("data-id",event.id);
			element.addClass("event_item");
			var title = event.title.replace(vCalendar.pre['compressNewLineRex']," ");
			if(event.status == 'CANCELLED')
				$(element).addClass('fc-event-cancelled');
			switch(event.filterStatus)
			{
				case 'filterAction':
					title+=' ('+localization[globalInterfaceLanguage].txtStatusNeedsActionTODO+')';
					break;
				case 'filterProgress':
					title+=' ('+localization[globalInterfaceLanguage].txtStatusInProcessTODO+')';
					break;
				case 'filterCompleted':
					if(event.completedOn)
						title+=' ('+localization[globalInterfaceLanguage].txtCompletedOn+' '+$.fullCalendar.formatDate(event.completedOn, dateFormatJqToFc(globalSettings.datepickerformat.value)+' '+(globalSettings.ampmformat.value ? 'h:mm TT' : 'H:mm'))+')';
					else
						title+=' ('+localization[globalInterfaceLanguage].txtStatusCompletedTODO+')';
					break;
				case 'filterCanceled':
					title+=' ('+localization[globalInterfaceLanguage].txtStatusCancelledTODO+')';
					break;
				default:
					break;
			}
			element.attr("title",title);
			if(typeof event.hidden!='undefined' && event.hidden)
				element.addClass('searchCalDAV_hide');
		},
		prevClick: function() {
			getPrevMonthsTodo();
		},
		nextClick: function() {
			getNextMonthsTodo();
		},
		datepickerClick: function(date) {
			if(date>globalToLoadedLimitTodo)
				getNextMonthsTodo(true);
			else if(date<globalLoadedLimitTodo)
				getPrevMonthsTodo(true);
		}
	});
	$('#todoList').fullCalendar('allowSelectEvent',false);
}

function setFirstDayEvent(setDay)
{
	var firstDay=typeof setDay!='undefined'?setDay:globalSettings.datepickerfirstdayofweek.value;
	var eventWeekDayCells = $('#week_custom .customTable td');
	var eventWeekDayContainer = eventWeekDayCells.parent();
	var eventMonthDayOptions = $('#repeat_month_custom_select2 option');
	var eventYearDayOptions = $('#repeat_year_custom_select2 option');

	for(i=firstDay; i<7; i++)
	{
		eventWeekDayContainer.append(eventWeekDayCells.filter('[data-type="'+i+'"]').detach());
		eventMonthDayOptions.filter('[data-type="'+i+'"]').detach().insertBefore(eventMonthDayOptions.filter('[data-type="month_custom_month"]'));
		eventYearDayOptions.filter('[data-type="'+i+'"]').detach().insertBefore(eventYearDayOptions.filter('[data-type="year_custom_month"]'));
	}

	for(i=0; i<firstDay; i++)
	{
		eventWeekDayContainer.append(eventWeekDayCells.filter('[data-type="'+i+'"]').detach());
		eventMonthDayOptions.filter('[data-type="'+i+'"]').detach().insertBefore(eventMonthDayOptions.filter('[data-type="month_custom_month"]'));
		eventYearDayOptions.filter('[data-type="'+i+'"]').detach().insertBefore(eventYearDayOptions.filter('[data-type="year_custom_month"]'));
	}

	eventWeekDayCells.removeClass('firstCol lastCol');
	eventWeekDayCells.filter('[data-type="'+firstDay+'"]').addClass('firstCol');
	eventWeekDayCells.filter('[data-type="'+(firstDay+6)%7+'"]').addClass('lastCol');
}

function setFirstDayTodo(setDay)
{
	var firstDay=typeof setDay!='undefined'?setDay:globalSettings.datepickerfirstdayofweek.value;
	var todoWeekDayCells = $('#week_custom_TODO .customTable td');
	var todoWeekDayContainer = todoWeekDayCells.parent();
	var todoMonthDayOptions = $('#repeat_month_custom_select2_TODO option');
	var todoYearDayOptions = $('#repeat_year_custom_select2_TODO option');

	for(i=firstDay; i<7; i++)
	{
		todoWeekDayContainer.append(todoWeekDayCells.filter('[data-type="'+i+'"]').detach());
		todoMonthDayOptions.filter('[data-type="'+i+'"]').detach().insertBefore(todoMonthDayOptions.filter('[data-type="month_custom_month"]'));
		todoYearDayOptions.filter('[data-type="'+i+'"]').detach().insertBefore(todoYearDayOptions.filter('[data-type="year_custom_month"]'));
	}

	for(i=0; i<firstDay; i++)
	{
		todoWeekDayContainer.append(todoWeekDayCells.filter('[data-type="'+i+'"]').detach());
		todoMonthDayOptions.filter('[data-type="'+i+'"]').detach().insertBefore(todoMonthDayOptions.filter('[data-type="month_custom_month"]'));
		todoYearDayOptions.filter('[data-type="'+i+'"]').detach().insertBefore(todoYearDayOptions.filter('[data-type="year_custom_month"]'));
	}

	todoWeekDayCells.removeClass('firstCol lastCol');
	todoWeekDayCells.filter('[data-type="'+firstDay+'"]').addClass('firstCol');
	todoWeekDayCells.filter('[data-type="'+(firstDay+6)%7+'"]').addClass('lastCol');
}

function checkEventFormScrollBar()
{
	if($('#eventDetailsContainer').is(':hidden'))
		return false;

	var baseWidth = 413;
	var scrollWidth = ($('#event_details_template').width() - $('#eventDetailsContainer').width());
	$('#event_details_template').width(baseWidth+scrollWidth);
	$('#eventColor').height($('#eventDetailsContainer').height()+12);
}

function checkTodoFormScrollBar()
{
	var baseWidth=413;
	var scrollWidth=$('#todo_details_template').width() - $('#todoDetailsContainer').width();
	var previousWidth = parseInt($('#mainTODO').css('right'), 10);
	var newWidth = baseWidth+scrollWidth;

	if(previousWidth===newWidth)
		return true;

	$('#main_h_TODO, #searchFormTODO, #mainTODO').css('right', newWidth);
	$('#TodoDisabler').css('right', newWidth+1);
	$('#todoForm_h, #todoLoader').width(newWidth);
	$('#todoColor').css('right', newWidth-3);
	$('#todoForm').width(newWidth-3);
	$(window).resize();
}

function initTimepicker(ampm)
{
	timelist=new Array();
	if(!ampm)
	{
		globalTimePre=new RegExp('^ *((([0-1]?[0-9]|2[0-3]):[0-5]?[0-9])|(([0-1][0-9]|2[0-3])[0-5][0-9])) *$','i');
		// 24 hour format time strings for the autocomplete functionality
		for(var i=0;i<24;i++)
			for(var j=0;j<minelems.length;j++)
				timelist.push(i.pad(2)+':'+minelems[j].pad(2));
	}
	else
	{
		globalTimePre=new RegExp('^ *((((0?[1-9]|1[0-2]):[0-5]?[0-9])|((0[1-9]|1[0-2])[0-5][0-9])) *AM|(((0?[1-9]|1[0-2]):[0-5]?[0-9])|((0[1-9]|1[0-2])[0-5][0-9])) *PM) *$','i');
		// 12 hour format time strings for the autocomplete functionality
		for(var i=0;i<24;i++)
			for(var j=0;j<minelems.length;j++)
				timelist.push((i==0 ? 12 : (i<13 ? i : i-12)).pad(2)+':'+minelems[j].pad(2)+(i<12 ? ' AM' : ' PM'));
	}
}

function showEventPrevNav()
{
	$('#CAEvent .formNav.prev').click(function(){
		eventPrevNavClick();
	});

	$('#CAEvent .header').addClass('leftspace');
	$('#CAEvent .formNav.prev').css('display', 'block');
}

function showEventNextNav()
{
	$('#CAEvent .formNav.next').click(function(){
		eventNextNavClick();
	});
	$('#CAEvent .header').addClass('rightspace');
	$('#CAEvent .formNav.next').css('display', 'block');
}

function showTodoPrevNav(uncompletedOnly)
{
	var type='top';
	if(uncompletedOnly)
		type='bottom';

	$('#CATodo .formNav.prev.'+type).click(function(){
		todoPrevNavClick(uncompletedOnly);
	});

	$('#CATodo .header').addClass('leftspace');
	$('#CATodo .formNav.prev.'+type).css('display', 'block');
}

function showTodoNextNav(uncompletedOnly)
{
	var type='top';
	if(uncompletedOnly)
		type='bottom';

	$('#CATodo .formNav.next.'+type).click(function(){
		todoNextNavClick(uncompletedOnly);
	});

	$('#CATodo .header').addClass('rightspace');
	$('#CATodo .formNav.next.'+type).css('display', 'block');
}

function eventPrevNavClick()
{
	var eventsSorted=jQuery.grep(globalEventList.displayEventsArray[globalCalEvent.res_id],function(e){if(e.id==globalCalEvent.id)return true}).sort(repeatStartCompare);

	if(eventsSorted.indexOf(globalCalEvent)!=-1)
	{
		if(eventsSorted.indexOf(globalCalEvent)>0)
		{
			globalCalEvent=eventsSorted[eventsSorted.indexOf(globalCalEvent)-1];
			showEventForm(null, globalCalEvent.allDay, globalCalEvent, globalJsEvent, 'show', 'editOnly');
		}
	}
}

function eventNextNavClick()
{
	var eventsSorted=jQuery.grep(globalEventList.displayEventsArray[globalCalEvent.res_id],function(e){if(e.id==globalCalEvent.id)return true}).sort(repeatStartCompare);

	if(eventsSorted.indexOf(globalCalEvent)!=-1)
	{
		if(eventsSorted.indexOf(globalCalEvent)<(eventsSorted.length-1))
		{
			globalCalEvent=eventsSorted[eventsSorted.indexOf(globalCalEvent)+1];
			showEventForm(null, globalCalEvent.allDay, globalCalEvent, globalJsEvent, 'show', 'editOnly');
		}
	}
}

function todoPrevNavClick(uncompletedOnly)
{
	var eventsSorted=jQuery.grep(globalEventList.displayTodosArray[globalCalTodo.res_id],function(e){if(e.id==globalCalTodo.id)return true}).sort(repeatStartCompare);

	if(eventsSorted.indexOf(globalCalTodo)!=-1)
	{
		if(eventsSorted.indexOf(globalCalTodo)>0)
		{
			if(uncompletedOnly)
			{
				for(var ij=eventsSorted.indexOf(globalCalTodo)-1; ij>=0; ij--)
					if(eventsSorted[ij].status!='COMPLETED')
					{
						globalCalTodo=eventsSorted[ij];
						break;
					}
			}
			else
				globalCalTodo=eventsSorted[eventsSorted.indexOf(globalCalTodo)-1];
			showTodoForm(globalCalTodo, 'show', 'editOnly');
		}
	}
}

function todoNextNavClick(uncompletedOnly)
{
	var eventsSorted=jQuery.grep(globalEventList.displayTodosArray[globalCalTodo.res_id],function(e){if(e.id==globalCalTodo.id)return true}).sort(repeatStartCompare);
	if(eventsSorted.indexOf(globalCalTodo)!=-1)
	{
		if(eventsSorted.indexOf(globalCalTodo)<(eventsSorted.length-1))
		{
			if(uncompletedOnly)
			{
				for(var ij=eventsSorted.indexOf(globalCalTodo)+1; ij<eventsSorted.length; ij++)
					if(eventsSorted[ij].status!='COMPLETED')
					{
						globalCalTodo=eventsSorted[ij];
						break;
					}
			}
			else
				globalCalTodo=eventsSorted[eventsSorted.indexOf(globalCalTodo)+1];
			showTodoForm(globalCalTodo, 'show', 'editOnly');
		}
	}
}

function todoStatusChanged(status)
{
	if(status=='COMPLETED')
	{
		var today = new Date();
		$('.completedOnTr').show();
		if($('#completedOnDate').val()=='')
			$('#completedOnDate').val($.datepicker.formatDate(globalSettings.datepickerformat.value, today));
		if($('#completedOnTime').val()=='')
			$('#completedOnTime').val($.fullCalendar.formatDate(today, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));
		$('#completedOnDate, #completedOnTime').change();
	}
	else {
		$('#completedOnDate, #completedOnTime').parent().find('img').css('display','none');
		$('.completedOnTr').hide();
	}
	checkTodoFormScrollBar();
}

function initKbTodoNavigation()
{
	$(document.documentElement).keyup(function(event)
	{
		if(typeof globalActiveApp=='undefined' || globalActiveApp!='CalDavTODO' || typeof globalObjectLoading=='undefined' || globalObjectLoading==true)
			return true;
		if($('#SystemCalDavTODO').css('visibility')!='hidden' && isCalDAVLoaded && $('#TodoDisabler').css('display')=='none' && !$('#searchInputTODO').is(':focus'))
		{
			// 37 = left, 38 = up, 39 = right, 40 = down
			var selected_todo=null, next_todo=null;
			if((selected_todo=$('#SystemCalDavTODO').find('.fc-event-selected').parent()).length==1)
			{
				if(event.keyCode == 38 && (next_todo=selected_todo.prevAll('.fc-list-section').find('.fc-event').filter(':visible').last()).length || event.keyCode == 40 && (next_todo=selected_todo.nextAll('.fc-list-section').find('.fc-event').filter(':visible').first()).length)
					$('#todoList').fullCalendar('selectEvent', next_todo);
			}
		}
	});

	$(document.documentElement).keydown(function(event)
	{
		if(typeof globalActiveApp=='undefined' || globalActiveApp!='CalDavTODO' || typeof globalObjectLoading=='undefined' || globalObjectLoading==true)
			return true;

		if($('#SystemCalDavTODO').css('visibility')!='hidden' && isCalDAVLoaded && $('#TodoDisabler').css('display')=='none' && !$('#searchInputTODO').is(':focus'))
		{
			// 37 = left, 38 = up, 39 = right, 40 = down
			var selected_todo=null, next_todo=null;
			if((selected_todo=$('#SystemCalDavTODO').find('.fc-event-selected').parent()).length==1)
			{
				var list=$('#todoList').find('.fc-list-content');
				if(event.keyCode == 38 && (next_todo=selected_todo.prevAll('.fc-list-section').find('.fc-event').filter(':visible').last()).length || event.keyCode == 40 && (next_todo=selected_todo.nextAll('.fc-list-section').find('.fc-event').filter(':visible').first()).length)
				{
					switch(event.keyCode)
					{
						case 38:
							event.preventDefault();
							if(list.scrollTop()>list.scrollTop()+next_todo.offset().top-list.offset().top-list.height()*globalKBNavigationPaddingRate)
								list.scrollTop(list.scrollTop()+next_todo.offset().top-list.offset().top-list.height()*globalKBNavigationPaddingRate);
							else if(list.scrollTop()<list.scrollTop()+next_todo.offset().top+next_todo.height()-list.offset().top-list.height()*(1-globalKBNavigationPaddingRate))	// todo invisible (scrollbar moved)
								list.scrollTop(list.scrollTop()+next_todo.offset().top+next_todo.height()-list.offset().top-list.height()*(1-globalKBNavigationPaddingRate));
							else
								return false;
							break;
						case 40:
							event.preventDefault();
							if(list.scrollTop()<list.scrollTop()+next_todo.offset().top+next_todo.height()-list.offset().top-list.height()*(1-globalKBNavigationPaddingRate))	// todo invisible (scrollbar moved)
								list.scrollTop(list.scrollTop()+next_todo.offset().top+next_todo.height()-list.offset().top-list.height()*(1-globalKBNavigationPaddingRate));
							else if(list.scrollTop()>list.scrollTop()+next_todo.offset().top-list.offset().top-list.height()*globalKBNavigationPaddingRate)
								list.scrollTop(list.scrollTop()+next_todo.offset().top-list.offset().top-list.height()*globalKBNavigationPaddingRate);
							else
								return false;
							break;
						default:
							break;
					}
				}
				else	// no previous todo and up pressed || no next todo and down pressed
				{
					switch(event.keyCode)
					{
						case 38:
							list.scrollTop(0);
							break;
						case 40:
							list.scrollTop(list.prop('scrollHeight'));
							break;
						default:
							break;
					}
				}
			}
		}
	});
}

function translateEventAlerts()
{
	$('[data-type="alert"]').text(localization[globalInterfaceLanguage].txtAlert);
	$('.alert').find('[data-type="alert_none"]').text(localization[globalInterfaceLanguage].txtAlertNone);
	$('.alert').find('[data-type="alert_message"]').text(localization[globalInterfaceLanguage].txtAlertMessage);
	$('[data-type="PH_before_after_alert"]').attr('placeholder',localization[globalInterfaceLanguage].pholderAfterBeforeVal);
	$('[data-type="PH_alarm_date"]').attr('placeholder',localization[globalInterfaceLanguage].pholderAlarmDate);
	$('[data-type="PH_alarm_time"]').attr('placeholder',localization[globalInterfaceLanguage].pholderAlarmTime);
	$('.alert_details').find('[data-type="on_date"]').text(localization[globalInterfaceLanguage].txtAlertOnDate);
	$('.alert_details').find('[data-type="weeks_before"]').text(localization[globalInterfaceLanguage].txtAlertWeeksBefore);
	$('.alert_details').find('[data-type="days_before"]').text(localization[globalInterfaceLanguage].txtAlertDaysBefore);
	$('.alert_details').find('[data-type="hours_before"]').text(localization[globalInterfaceLanguage].txtAlertHoursBefore);
	$('.alert_details').find('[data-type="minutes_before"]').text(localization[globalInterfaceLanguage].txtAlertMinutesBefore);
	$('.alert_details').find('[data-type="seconds_before"]').text(localization[globalInterfaceLanguage].txtAlertSecondsBefore);
	$('.alert_details').find('[data-type="weeks_after"]').text(localization[globalInterfaceLanguage].txtAlertWeeksAfter);
	$('.alert_details').find('[data-type="days_after"]').text(localization[globalInterfaceLanguage].txtAlertDaysAfter);
	$('.alert_details').find('[data-type="hours_after"]').text(localization[globalInterfaceLanguage].txtAlertHoursAfter);
	$('.alert_details').find('[data-type="minutes_after"]').text(localization[globalInterfaceLanguage].txtAlertMinutesAfter);
	$('.alert_details').find('[data-type="seconds_after"]').text(localization[globalInterfaceLanguage].txtAlertSecondsAfter);
}

function translateTodoAlerts()
{
	$('[data-type="alert_TODO"]').text(localization[globalInterfaceLanguage].txtAlertTODO);
	$('.alertTODO').find('[data-type="alert_none_TODO"]').text(localization[globalInterfaceLanguage].txtAlertNone);
	$('.alertTODO').find('[data-type="alert_message_TODO"]').text(localization[globalInterfaceLanguage].txtAlertMessage);
	$('[data-type="PH_before_after_alert_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderAfterBeforeValTODO);
	$('[data-type="PH_alarm_date_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderAlarmDateTODO);
	$('[data-type="PH_alarm_time_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderAlarmTimeTODO);
	$('.alert_detailsTODO').find('[data-type="on_dateTODO"]').text(localization[globalInterfaceLanguage].txtAlertOnDateTODO);
	$('.alert_detailsTODO').find('[data-type="weeks_beforeTODO"]').text(localization[globalInterfaceLanguage].txtAlertWeeksBeforeTODO);
	$('.alert_detailsTODO').find('[data-type="days_beforeTODO"]').text(localization[globalInterfaceLanguage].txtAlertDaysBeforeTODO);
	$('.alert_detailsTODO').find('[data-type="hours_beforeTODO"]').text(localization[globalInterfaceLanguage].txtAlertHoursBeforeTODO);
	$('.alert_detailsTODO').find('[data-type="minutes_beforeTODO"]').text(localization[globalInterfaceLanguage].txtAlertMinutesBeforeTODO);
	$('.alert_detailsTODO').find('[data-type="seconds_beforeTODO"]').text(localization[globalInterfaceLanguage].txtAlertSecondsBeforeTODO);
	$('.alert_detailsTODO').find('[data-type="weeks_afterTODO"]').text(localization[globalInterfaceLanguage].txtAlertWeeksAfterTODO);
	$('.alert_detailsTODO').find('[data-type="days_afterTODO"]').text(localization[globalInterfaceLanguage].txtAlertDaysAfterTODO);
	$('.alert_detailsTODO').find('[data-type="hours_afterTODO"]').text(localization[globalInterfaceLanguage].txtAlertHoursAfterTODO);
	$('.alert_detailsTODO').find('[data-type="minutes_afterTODO"]').text(localization[globalInterfaceLanguage].txtAlertMinutesAfterTODO);
	$('.alert_detailsTODO').find('[data-type="seconds_afterTODO"]').text(localization[globalInterfaceLanguage].txtAlertSecondsAfterTODO);
}

function translate()
{
// DATEPICKER
	$.datepicker.regional[globalInterfaceLanguage] = {
		monthNames: localization[globalInterfaceLanguage].monthNames,
		monthNamesShort: localization[globalInterfaceLanguage].monthNamesShort,
		dayNames: localization[globalInterfaceLanguage].dayNames,
		dayNamesShort: localization[globalInterfaceLanguage].dayNamesShort,
		dayNamesMin: localization[globalInterfaceLanguage].dayNamesMin};
	$.datepicker.setDefaults($.datepicker.regional[globalInterfaceLanguage]);
// INTERFACE
	//$('[data-type="system_logo"]').attr('alt',localization[globalInterfaceLanguage].altLogo);
	$('[data-type="system_username"]').attr('placeholder',localization[globalInterfaceLanguage].pholderUsername);
	$('[data-type="system_password"]').attr('placeholder',localization[globalInterfaceLanguage].pholderPassword);
	$('[data-type="system_login"]').attr({'title':localization[globalInterfaceLanguage].buttonLogin,'alt':localization[globalInterfaceLanguage].buttonLogin});
	$('.resourceCalDAV_text[data-type="resourcesCalDAV_txt"]').text(localization[globalInterfaceLanguage].txtCalendars);
	$('[data-type="choose_calendar_TODO"]').text(localization[globalInterfaceLanguage].txtSelectCalendarTODO);
	$('[data-type="todo_txt"]').text(localization[globalInterfaceLanguage].txtTodo);
	$('#eventFormShower').attr('alt',localization[globalInterfaceLanguage].altAddEvent);
	$('#showUnloadedCalendars').attr({title:capitalize(localization[globalInterfaceLanguage].txtEnabledCalendars),alt:capitalize(localization[globalInterfaceLanguage].txtEnabledCalendars)});
	$('#showUnloadedCalendarsTODO').attr({title:capitalize(localization[globalInterfaceLanguage].txtEnabledTodoLists),alt:capitalize(localization[globalInterfaceLanguage].txtEnabledTodoLists)});
	$('#loadUnloadedCalendars, #loadUnloadedCalendarsTODO').val(localization[globalInterfaceLanguage].buttonSave);
	$('#loadUnloadedCalendarsCancel, #loadUnloadedCalendarsTODOCancel').val(localization[globalInterfaceLanguage].buttonCancel);
// TODOS
	$('.resourceCalDAVTODO_text[data-type="resourcesCalDAV_txt"]').text(localization[globalInterfaceLanguage].txtTodoLists);
	$('[data-type="name_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderNameTODO);
	$('[data-type="type_TODO"]').text(localization[globalInterfaceLanguage].txtTypeTODO);
	$('[data-type="todo_type_none"]').text(localization[globalInterfaceLanguage].txtTypeTODONone);
	$('[data-type="todo_type_start"]').text(localization[globalInterfaceLanguage].txtTypeTODOStart);
	$('[data-type="todo_type_due"]').text(localization[globalInterfaceLanguage].txtTypeTODODue);
	$('[data-type="todo_type_both"]').text(localization[globalInterfaceLanguage].txtTypeTODOBoth);
	$('[data-type="date_from_TODO"]').text(localization[globalInterfaceLanguage].txtDateFromTODO);
	$('[data-type="date_to_TODO"]').text(localization[globalInterfaceLanguage].txtDateToTODO);
	$('[data-type="PH_completedOn"]').text(localization[globalInterfaceLanguage].txtCompletedOn);
	$('[data-type="PH_date_from_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderDateFromTODO);
	$('[data-type="PH_time_from_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderTimeFromTODO);
	$('[data-type="PH_date_to_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderDateToTODO);
	$('[data-type="PH_time_to_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderTimeToTODO);
	$('[data-type="PH_completedOnDate"]').attr('placeholder',localization[globalInterfaceLanguage].pholderCompletedOnDate);
	$('[data-type="PH_completedOnTime"]').attr('placeholder',localization[globalInterfaceLanguage].pholderCompletedOnTime);
	$('[data-type="status_TODO"]').text(localization[globalInterfaceLanguage].txtStatus);
	$('[data-type="STATUS_NEEDS-ACTION_TODO"]').text(localization[globalInterfaceLanguage].txtStatusNeedsActionTODO);
	$('[data-type="STATUS_COMPLETED_TODO"]').text(localization[globalInterfaceLanguage].txtStatusCompletedTODO);
	$('[data-type="STATUS_IN-PROCESS_TODO"]').text(localization[globalInterfaceLanguage].txtStatusInProcessTODO);
	$('[data-type="STATUS_CANCELLED_TODO"]').text(localization[globalInterfaceLanguage].txtStatusCancelledTODO);
	$('[data-type="percent_complete_TODO"]').text(localization[globalInterfaceLanguage].txtPercentCompletedTODO);
	$('[data-type="priority_TODO"]').text(localization[globalInterfaceLanguage].txtPriority);
	$('[data-type="priority_TODO_none"]').text(localization[globalInterfaceLanguage].txtPriorityNone);
	$('[data-type="priority_TODO_low"]').text(localization[globalInterfaceLanguage].txtPriorityLow);
	$('[data-type="priority_TODO_medium"]').text(localization[globalInterfaceLanguage].txtPriorityMedium);
	$('[data-type="priority_TODO_high"]').text(localization[globalInterfaceLanguage].txtPriorityHigh);
	$('[data-type="calendar_TODO"]').text(localization[globalInterfaceLanguage].txtTodoList);
	$('[data-type="note_TODO"]').text(localization[globalInterfaceLanguage].txtNoteTODO);
	$('[data-type="PH_note_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderNoteTODO);
	$('[data-type="txt_availTODO"]').text(localization[globalInterfaceLanguage].eventAvailability);
	$('[data-type="BUSY_AVAIL_TODO"]').text(localization[globalInterfaceLanguage].eventAvailabilityBusy);
	$('[data-type="FREE_AVAIL_TODO"]').text(localization[globalInterfaceLanguage].eventAvailabilityFree);
	$('[data-type="txt_typeTODO"]').text(localization[globalInterfaceLanguage].eventType);
	$('[data-type="PUBLIC_TYPE_TODO"]').text(localization[globalInterfaceLanguage].eventTypePublic);
	$('[data-type="PRIVATE_TYPE_TODO"]').text(localization[globalInterfaceLanguage].eventTypePrivate);
	$('[data-type="CONFIDENTIAL_TYPE_TODO"]').text(localization[globalInterfaceLanguage].eventTypeConfidential);
	$('[data-type="txt_url_TODO"]').text(localization[globalInterfaceLanguage].eventURL);
	$('[data-type="url_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].eventURL);
	$('[data-type="todo_prev_nav"]').attr('title',localization[globalInterfaceLanguage].todoPrevNav);
	$('[data-type="todo_next_nav"]').attr('title',localization[globalInterfaceLanguage].todoNextNav);
	$('[data-type="todo_prev_uncompleted_nav"]').attr('title',localization[globalInterfaceLanguage].todoUncompletedPrevNav);
	$('[data-type="todo_next_uncompleted_nav"]').attr('title',localization[globalInterfaceLanguage].todoUncompletedNextNav);
	$("#saveTODO").val(localization[globalInterfaceLanguage].buttonSaveTODO);
	$("#editTODO").val(localization[globalInterfaceLanguage].buttonEditTODO);
	$("#duplicateTODO").val(localization[globalInterfaceLanguage].buttonDuplicate);
	$("#resetTODO").val(localization[globalInterfaceLanguage].buttonResetTODO);
	$("#closeTODO").val(localization[globalInterfaceLanguage].buttonCloseTODO);
	$("#deleteTODO").val(localization[globalInterfaceLanguage].buttonDeleteTODO);
// EVENTS
	$('[data-type="name"]').attr('placeholder',localization[globalInterfaceLanguage].pholderName);
	$('[data-type="location"]').text(localization[globalInterfaceLanguage].txtLocation);
	$('[data-type="PH_location"]').attr('placeholder',localization[globalInterfaceLanguage].pholderLocation);
	$('[data-type="all_day"]').text(localization[globalInterfaceLanguage].txtAllDay);
	$('[data-type="from"]').text(localization[globalInterfaceLanguage].from);
	$('[data-type="to"]').text(localization[globalInterfaceLanguage].to);
	$('[data-type="PH_date_from"]').attr('placeholder',localization[globalInterfaceLanguage].pholderDateFrom);
	$('[data-type="PH_time_from"]').attr('placeholder',localization[globalInterfaceLanguage].pholderTimeFrom);
	$('[data-type="PH_date_to"]').attr('placeholder',localization[globalInterfaceLanguage].pholderDateTo);
	$('[data-type="PH_time_to"]').attr('placeholder',localization[globalInterfaceLanguage].pholderTimeTo);
	$('[data-type="repeat"]').text(localization[globalInterfaceLanguage].txtRepeat);
	$('[data-type="PH_until_date"]').attr('placeholder',localization[globalInterfaceLanguage].pholderUntilDate);
	$('[data-type="PH_repeat_count"]').attr('placeholder',localization[globalInterfaceLanguage].pholderRepeatCount);
	$('[data-type="repeat_end"]').text(localization[globalInterfaceLanguage].txtRepeatEnd);
	$('[data-type="show_as"]').text(localization[globalInterfaceLanguage].txtShowAs);
	$('[data-type="priority"]').text(localization[globalInterfaceLanguage].txtPriority);
	$('[data-type="priority_none"]').text(localization[globalInterfaceLanguage].txtPriorityNone);
	$('[data-type="priority_low"]').text(localization[globalInterfaceLanguage].txtPriorityLow);
	$('[data-type="priority_medium"]').text(localization[globalInterfaceLanguage].txtPriorityMedium);
	$('[data-type="priority_high"]').text(localization[globalInterfaceLanguage].txtPriorityHigh);
	$('[data-type="event_calendar"]').text(localization[globalInterfaceLanguage].txtEventCalendar);
	$('[data-type="choose_calendar"]').text(localization[globalInterfaceLanguage].txtSelectCalendar);
	$('[data-type="note"]').text(localization[globalInterfaceLanguage].txtNote);
	$('[data-type="PH_note"]').attr('placeholder',localization[globalInterfaceLanguage].pholderNote);
	$('[data-type="status"]').text(localization[globalInterfaceLanguage].txtStatus);
	$('[data-type="STATUS_NONE"]').text(localization[globalInterfaceLanguage].txtStatusNone);
	$('[data-type="STATUS_TENTATIVE"]').text(localization[globalInterfaceLanguage].txtStatusTentative);
	$('[data-type="STATUS_CONFIRMED"]').text(localization[globalInterfaceLanguage].txtStatusConfirmed);
	$('[data-type="STATUS_CANCELLED"]').text(localization[globalInterfaceLanguage].txtStatusCancelled);
	$('[data-type="txt_avail"]').text(localization[globalInterfaceLanguage].eventAvailability);
	$('[data-type="BUSY_AVAIL"]').text(localization[globalInterfaceLanguage].eventAvailabilityBusy);
	$('[data-type="FREE_AVAIL"]').text(localization[globalInterfaceLanguage].eventAvailabilityFree);
	$('[data-type="txt_type"]').text(localization[globalInterfaceLanguage].eventType);
	$('[data-type="PUBLIC_TYPE"]').text(localization[globalInterfaceLanguage].eventTypePublic);
	$('[data-type="PRIVATE_TYPE"]').text(localization[globalInterfaceLanguage].eventTypePrivate);
	$('[data-type="CONFIDENTIAL_TYPE"]').text(localization[globalInterfaceLanguage].eventTypeConfidential);
	$('[data-type="txt_url_EVENT"]').text(localization[globalInterfaceLanguage].eventURL);
	$('[data-type="url_EVENT"]').attr('placeholder',localization[globalInterfaceLanguage].eventURL);
	$('[data-type="repeat_no-repeat"]').text(localization[globalInterfaceLanguage].txtNoRepeat);
	$('[data-type="repeat_DAILY"]').text(localization[globalInterfaceLanguage].txtRepeatDay);
	$('[data-type="repeat_WEEKLY"]').text(localization[globalInterfaceLanguage].txtRepeatWeek);
	$('[data-type="repeat_WEEKEND"]').text(localization[globalInterfaceLanguage].txtRepeatWeekend);
	$('[data-type="repeat_MONTHLY"]').text(localization[globalInterfaceLanguage].txtRepeatMonth);
	$('[data-type="repeat_TWO_WEEKLY"]').text(localization[globalInterfaceLanguage].txtRepeatTwoWeek);
	$('[data-type="repeat_YEARLY"]').text(localization[globalInterfaceLanguage].txtRepeatYear);
	$('[data-type="repeat_CUSTOM_WEEKLY"]').text(localization[globalInterfaceLanguage].txtRepeatCustomWeek);
	$('[data-type="repeat_CUSTOM_MONTHLY"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonth);
	$('[data-type="repeat_CUSTOM_YEARLY"]').text(localization[globalInterfaceLanguage].txtRepeatCustomYear);
	$('[data-type="repeat_BUSINESS"]').text(localization[globalInterfaceLanguage].txtRepeatWork);
	$('[data-type="week_custom_txt"]').text(localization[globalInterfaceLanguage].txtRepeatCustomWeekLabel);
	$('[data-type="month_custom2_txt"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthLabel);
	$('[data-type="month_custom_every"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthEvery);
	$('[data-type="month_custom_first"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFirst);
	$('[data-type="month_custom_second"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthSecond);
	$('[data-type="month_custom_third"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthThird);
	$('[data-type="month_custom_fourth"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFourth);
	$('[data-type="month_custom_fifth"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFifth);
	$('[data-type="month_custom_last"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthLast);
	$('[data-type="month_custom_custom"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthCustom);
	$('[data-type="month_custom_month"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthMonth);

	$('[data-type="year_custom1"]').text(localization[globalInterfaceLanguage].txtRepeatCustomYearLabel1);
	$('[data-type="year_custom3"]').text(localization[globalInterfaceLanguage].txtRepeatCustomYearLabel2);
	$('[data-type="year_custom_every"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthEvery);
	$('[data-type="year_custom_first"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFirst);
	$('[data-type="year_custom_second"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthSecond);
	$('[data-type="year_custom_third"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthThird);
	$('[data-type="year_custom_fourth"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFourth);
	$('[data-type="year_custom_fifth"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFifth);
	$('[data-type="year_custom_last"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthLast);
	$('[data-type="year_custom_custom"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthCustom);
	$('[data-type="year_custom_month"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthMonth);

	for(i=0; i<12; i++)
	{
		$('#year_custom3 .customTable td[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].monthNamesShort[i]);
		$('#year_custom3_TODO .customTable td[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].monthNamesShort[i]);
	}

	for(i=0; i<7; i++)
	{
		$('#repeat_month_custom_select2 option[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNames[i]);
		$('#repeat_month_custom_select2_TODO option[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNames[i]);
		$('#repeat_year_custom_select2 option[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNames[i]);
		$('#repeat_year_custom_select2_TODO option[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNames[i]);
	}

	for(i=0; i<7; i++)
	{
		$('#week_custom .customTable td[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNamesMin[i]);
		$('#week_custom_TODO .customTable td[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNamesMin[i]);
	}

	$('[data-type="repeat_details_on_date"]').text(localization[globalInterfaceLanguage].txtRepeatOnDate);
	$('[data-type="repeat_details_after"]').text(localization[globalInterfaceLanguage].txtRepeatAfter);
	$('[data-type="repeat_details_never"]').text(localization[globalInterfaceLanguage].txtRepeatNever);
	$('[data-type="event_prev_nav"]').attr('title',localization[globalInterfaceLanguage].eventPrevNav);
	$('[data-type="event_next_nav"]').attr('title',localization[globalInterfaceLanguage].eventNextNav);
	$("#saveButton").val(localization[globalInterfaceLanguage].buttonSave);
	$("#editButton").val(localization[globalInterfaceLanguage].buttonEdit);
	$("#duplicateButton").val(localization[globalInterfaceLanguage].buttonDuplicate);
	$("#resetButton").val(localization[globalInterfaceLanguage].buttonReset);
	$("#closeButton").val(localization[globalInterfaceLanguage].buttonClose);
	$("#deleteButton").val(localization[globalInterfaceLanguage].buttonDelete);
	$('#alertsH').text(localization[globalInterfaceLanguage].txtAlertsH);
	$("#alertButton").val(localization[globalInterfaceLanguage].buttonAlert);
	$('[data-type="PH_CalDAVsearch"]').attr('placeholder',localization[globalInterfaceLanguage].CalDAVsearch);

	$('[data-type="addAll"]').attr('title',localization[globalInterfaceLanguage].allEnable);
	$('[data-type="addAll"]').attr('alt',localization[globalInterfaceLanguage].allEnable);
	$('[data-type="removeAll"]').attr('title',localization[globalInterfaceLanguage].allDisable);
	$('[data-type="removeAll"]').attr('alt',localization[globalInterfaceLanguage].allDisable);
	$('[data-type="txt_timezone"]').text(localization[globalInterfaceLanguage].timezone);
	$('[data-type="txt_timezonePicker"]').text(localization[globalInterfaceLanguage].txtTimezonePicker);
	$('[data-type="txt_timezoneTODO"]').text(localization[globalInterfaceLanguage].timezone);
	$('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader);
	$('#CalendarLoaderTODO').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader);
	$('[data-type="repeat_event"]').text(localization[globalInterfaceLanguage].repeatBoxButton);
	$('[data-type="editOptions"]').attr('value',localization[globalInterfaceLanguage].repeatBoxButton);
	$('[data-type="editOptionsTODO"]').attr('value',localization[globalInterfaceLanguage].repeatBoxButton);
	$('#editAll').val(localization[globalInterfaceLanguage].allEvsButton);
	$('#editFuture').val(localization[globalInterfaceLanguage].allFutureButton);
	$('#editOnlyOne').val(localization[globalInterfaceLanguage].eventOnlyButton);
	$('#editAllTODO').val(localization[globalInterfaceLanguage].allEvsButtonTODO);
	$('#editFutureTODO').val(localization[globalInterfaceLanguage].allFutureButtonTODO);
	$('#editOnlyOneTODO').val(localization[globalInterfaceLanguage].eventOnlyButtonTODO);
	$('[data-type="closeRepeat"]').val(localization[globalInterfaceLanguage].buttonClose);
	$('[data-type="repeat_type"]').text(localization[globalInterfaceLanguage].repeatInterval);

	$('#CalDavZAPPopup').find('[data-type="location_txt"]').text(localization[globalInterfaceLanguage].txtLocation);
	$('#CalDavZAPPopup').find('[data-type="from_txt"]').text(localization[globalInterfaceLanguage].from);
	$('#CalDavZAPPopup').find('[data-type="to_txt"]').text(localization[globalInterfaceLanguage].to);
	$('#CalDavZAPPopup').find('[data-type="status_txt"]').text(localization[globalInterfaceLanguage].txtStatus);
	$('#CalDavZAPPopup').find('[data-type="avail_txt"]').text(localization[globalInterfaceLanguage].eventAvailability);
	$('#CalDavZAPPopup').find('[data-type="type_txt"]').text(localization[globalInterfaceLanguage].eventType);
	$('#CalDavZAPPopup').find('[data-type="priority_txt"]').text(localization[globalInterfaceLanguage].txtPriority);
	$('#CalDavZAPPopup').find('[data-type="calendar_txt"]').text(localization[globalInterfaceLanguage].txtEventCalendar);
	$('#CalDavZAPPopup').find('[data-type="url_txt"]').text(localization[globalInterfaceLanguage].eventURL);
	$('#CalDavZAPPopup').find('[data-type="note_txt"]').text(localization[globalInterfaceLanguage].txtNote);

	translateEventAlerts();
	translateTodoAlerts();
}

function selectActiveCalendar()
{
	var todoString = "";
	if(!globalEventCollectionsLoading && globalSettingsSaving!='event')
	{
		$('#ResourceCalDAVList').find('.resourceCalDAV_item_selected').removeClass('resourceCalDAV_item_selected');
		for(var i=0; i<globalResourceCalDAVList.collections.length;i++)
			if(globalResourceCalDAVList.collections[i].uid!=undefined)
			{
				var inputResource = globalResourceCalDAVList.collections[i];
				var par=inputResource.uid.split('/');
				// set todo calendar as selected
				if(globalSettings.calendarselected.value!='')
				{
					if((par[par.length-3]+'/'+par[par.length-2]+'/')==globalSettings.calendarselected.value)
					{
						if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
							$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
					}
					else if(inputResource.uid==globalSettings.calendarselected.value)
					{
						if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
							$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
					}
					else if (typeof globalSettings.calendarselected.value=='object' && inputResource.uid.match(globalSettings.calendarselected.value)!=null)
					{
						if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
							$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
					}
				}
			}

		if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
			for(var i=0; i<globalResourceCalDAVList.collections.length;i++)
				if(globalResourceCalDAVList.collections[i].uid!=undefined)
				{
					var inputResource = globalResourceCalDAVList.collections[i];
					var par=inputResource.uid.split('/');
					if(typeof globalCalendarSelected!='undefined' && globalCalendarSelected!=null && globalCalendarSelected!='')
					{
						globalSettings.calendarselected.value=globalCalendarSelected;
						if((par[par.length-3]+'/'+par[par.length-2]+'/')==globalSettings.calendarselected.value)
						{
							if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
								$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
						}
						else if(inputResource.uid==globalSettings.calendarselected.value)
						{
							if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
								$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
						}
						else if (typeof globalSettings.calendarselected.value=='object' && inputResource.uid.match(globalSettings.calendarselected.value)!=null)
						{
							if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
								$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
						}
					}
				}

		if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0  && $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item[data-id]:visible').length > 0)
		{
			var ui_d = $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item[data-id]:visible').eq(0).attr('data-id');
			var part_u = ui_d.split('/');
			globalSettings.calendarselected.value=part_u[part_u.length-3]+'/'+part_u[part_u.length-2]+'/';
			$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item[data-id]:visible').eq(0).addClass('resourceCalDAV_item_selected');
		}
	}

	todoString = "TODO";
	if(!globalTodoCollectionsLoading && globalSettingsSaving!='todo')
	{
		$('#ResourceCalDAVTODOList').find('.resourceCalDAV_item_selected').removeClass('resourceCalDAV_item_selected');
		for(var i=0; i<globalResourceCalDAVList.TodoCollections.length;i++)
			if(globalResourceCalDAVList.TodoCollections[i].uid!=undefined)
			{
				var inputResource = globalResourceCalDAVList.TodoCollections[i];
				var par=inputResource.uid.split('/');
				// set todo calendar as selected
				if(globalSettings.todocalendarselected.value!='')
				{

					if((par[par.length-3]+'/'+par[par.length-2]+'/')==globalSettings.todocalendarselected.value)
					{
						if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
							$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
					}
					else if(inputResource.uid==globalSettings.todocalendarselected.value)
					{
						if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
							$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
					}
					else if (typeof globalSettings.todocalendarselected.value=='object' && inputResource.uid.match(globalSettings.todocalendarselected.value)!=null)
					{
						if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
							$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
					}
				}
			}

		if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
			for(var i=0; i<globalResourceCalDAVList.TodoCollections.length;i++)
				if(globalResourceCalDAVList.TodoCollections[i].uid!=undefined)
				{
					var inputResource = globalResourceCalDAVList.TodoCollections[i];
					var par=inputResource.uid.split('/');
					if(typeof globalTodoCalendarSelected!='undefined' && globalTodoCalendarSelected!=null && globalTodoCalendarSelected!='')
					{
						globalSettings.todocalendarselected.value=globalTodoCalendarSelected;
						if((par[par.length-3]+'/'+par[par.length-2]+'/')==globalSettings.todocalendarselected.value)
						{
							if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
								$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
						}
						else if(inputResource.uid==globalSettings.todocalendarselected.value)
						{
							if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
								$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
						}
						else if (typeof globalSettings.todocalendarselected.value=='object' && inputResource.uid.match(globalSettings.todocalendarselected.value)!=null)
						{
							if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
								$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
						}
					}
				}

		if($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0 && $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item[data-id]:visible').length > 0)
		{
			var ui_d = $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item[data-id]:visible').eq(0).attr('data-id');
			var part_u = ui_d.split('/');
			globalSettings.todocalendarselected.value=part_u[part_u.length-3]+'/'+part_u[part_u.length-2]+'/';
			$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item[data-id]:visible').eq(0).addClass('resourceCalDAV_item_selected');
		}
	}
}

function hideCalendarEvents(uid)
{
	$('#SystemCalDavZAP').find('.event_item[data-res-id="'+uid+'"]').each(function(){
		$(this).addClass('checkCalDAV_hide');
		if(this.tagName.toLowerCase()=='tr')
		{
			if($(this).siblings().addBack().not('.checkCalDAV_hide').length>0)
				$(this).parent().prev().find('tr').removeClass('checkCalDAV_hide');
			else
				$(this).parent().prev().find('tr').addClass('checkCalDAV_hide');
		}
	});
}

function hideCalendarTodos(uid)
{
	$('#SystemCalDavTODO').find('.event_item[data-res-id="'+uid+'"]').addClass('checkCalDAV_hide');
}

function showCalendarEvents(uid)
{
	$('#SystemCalDavZAP').find('.event_item[data-res-id="'+uid+'"]').each(function(){
		$(this).removeClass('checkCalDAV_hide');
		if(this.tagName.toLowerCase() == 'tr')
			$(this).parent().prev().find('tr').removeClass('checkCalDAV_hide');
	});
}

function showCalendarTodos(uid)
{
	$('#SystemCalDavTODO').find('.event_item[data-res-id="'+uid+'"]').removeClass('checkCalDAV_hide');
}

function hideEventCalendars()
{
	for(var k=1;k<globalResourceCalDAVList.collections.length;k++)
	{
		var uid=globalResourceCalDAVList.collections[k].uid;
		if(uid!=undefined && globalVisibleCalDAVCollections.indexOf(uid)==-1)
			hideCalendarEvents(uid);
	}
}

function hideTodoCalendars()
{
	for(var k=1;k<globalResourceCalDAVList.TodoCollections.length;k++)
	{
		var uid=globalResourceCalDAVList.TodoCollections[k].uid;
		if(uid!=undefined && globalVisibleCalDAVTODOCollections.indexOf(uid)==-1)
			hideCalendarTodos(uid);
	}
}

function rerenderCalendar(scrollChanged)
{
	if(scrollChanged)
		$('#calendar').fullCalendar('render');
	if(globalSettings.displayhiddenevents.value)
		hideEventCalendars();
}

function rerenderTodo(scrollChanged)
{
	if(scrollChanged)
		$('#todoList').fullCalendar('render');
	if(globalSettings.displayhiddenevents.value)
		hideTodoCalendars();
}

function refetchCalendarEvents()
{
	var beforeScroll = $('#main').width()-$('#calendar').width();
	$('#calendar').fullCalendar('refetchEvents');
	var afterScroll = $('#main').width()-$('#calendar').width();
	rerenderCalendar(beforeScroll!=afterScroll);
	globalCalDAVQs.cache();
}

function refetchTodoEvents()
{
	var beforeScroll = $('#mainTODO').width()-$('#todoList').width();
	$('#todoList').fullCalendar('refetchEvents');
	var afterScroll = $('#mainTODO').width()-$('#todoList').width();
	rerenderTodo(beforeScroll!=afterScroll);
	globalCalDAVTODOQs.cache();
}

function initCalDavDatepicker(element)
{
	var datepickers = element.find('.date');
	datepickers.focus(function(){
		if(!$(this).hasClass('hasDatepicker'))
		{
			$(this).datepicker({
				disabled: $(this).prop('readonly') || $(this).prop('disabled'),
				showMonthAfterYear: false,
				prevText: '',
				nextText: '',
				monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
				dateFormat: globalSettings.datepickerformat.value, defaultDate: null, minDate: '-120y', maxDate: '+120y', yearRange: 'c-120:c+120', showAnim: '',
				firstDay: globalSettings.datepickerfirstdayofweek.value,
				weekendDays: globalSettings.weekenddays.value,
				beforeShow: function(input, inst)	// set the datepicker value if the date is out of range (min/max)
				{
					inst.dpDiv.addClass('ui-datepicker-simple');

					var valid=true;
					try {var currentDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, $(this).val())}
					catch (e){valid=false}
					if(valid==true && currentDate!=null)
					{
						var minDateText=$(this).datepicker('option', 'dateFormat', globalSettings.datepickerformat.value).datepicker('option', 'minDate');
						var maxDateText=$(this).datepicker('option', 'dateFormat', globalSettings.datepickerformat.value).datepicker('option', 'maxDate');

						var minDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, minDateText);
						var maxDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, maxDateText);

						if(currentDate<minDate)
							$(this).val(minDateText);
						else if(currentDate>maxDate)
							$(this).val(maxDateText);
					}

					// Timepicker hack (prevent IE to re-open the datepicker on date click+focus)
					var index=$(this).attr("data-type");
					var d=new Date();
					if(globalTmpTimePickerHackTime[index]!=undefined && d.getTime()-globalTmpTimePickerHackTime[index]<200)
						return false;
				},
				onClose: function(dateText, inst)	// set the datepicker value if the date is out of range (min/max) and reset the value to proper format (for example 'yy-mm-dd' allows '2000-1-1' -> we need to reset the value to '2000-01-01')
				{
					var valid=true;
					try {var currentDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, dateText)}
					catch (e){valid=false}

					if(valid==true && currentDate!=null)
					{
						var minDateText=$(this).datepicker('option', 'dateFormat', globalSettings.datepickerformat.value).datepicker('option', 'minDate');
						var maxDateText=$(this).datepicker('option', 'dateFormat', globalSettings.datepickerformat.value).datepicker('option', 'maxDate');

						var minDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, minDateText);
						var maxDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, maxDateText);

						if(currentDate<minDate)
							$(this).val(minDateText);
						else if(currentDate>maxDate)
							$(this).val(maxDateText);
						else
							$(this).val($.datepicker.formatDate(globalSettings.datepickerformat.value, currentDate));
					}

					// Timepicker hack (prevent IE to re-open the datepicker on date click+focus)
					var index=$(this).attr("data-type");
					var d=new Date();
					globalTmpTimePickerHackTime[index]=d.getTime();
					$(this).focus();
				}
			});

			$(this).mousedown(function(){
				if($(this).datepicker('widget').css('display')=='none')
					$(this).datepicker('show');
				else
					$(this).datepicker('hide');
			});

			$(this).on('keydown', function(event){
				// show datepicker on keydown (up/down/left/right) but only if it not causes cursor position move
				if(this.selectionStart!=undefined && this.selectionStart!=-1)
					if(((event.which==38 || event.which==37) && this.selectionStart==0) || ((event.which==40 || event.which==39) && this.selectionStart==$(this).val().length))
					{
						if($(this).datepicker('widget').css('display')=='none')
							$(this).datepicker('show');
						else
							$(this).datepicker('hide');
					}
			});

			$(this).blur(function(event){
				// handle onblur event because datepicker can be already closed
				// note: because onblur is called more than once we can handle it only if there is a value change!
				var valid=true;
				try {var currentDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, $(this).val())}
				catch (e) {valid=false}
				if($(this).val()=='')
					valid=false;

				if(valid==true && $(this).val()!=$.datepicker.formatDate(globalSettings.datepickerformat.value, currentDate))
				{
					var minDateText=$(this).datepicker('option', 'dateFormat', globalSettings.datepickerformat.value).datepicker('option', 'minDate');
					var maxDateText=$(this).datepicker('option', 'dateFormat', globalSettings.datepickerformat.value).datepicker('option', 'maxDate');

					var minDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, minDateText);
					var maxDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, maxDateText);

					if(currentDate<minDate)
						$(this).val(minDateText);
					else if(currentDate>maxDate)
						$(this).val(maxDateText);
					else
						$(this).val($.datepicker.formatDate(globalSettings.datepickerformat.value, currentDate));
				}

				if($(this).attr('id')=='date_from')
				{
					var tmptime = $('#time_from').val();
					var validD=true, prevDate = '';
					if(globalPrevDate!='')
						prevDate = new Date(globalPrevDate.getTime());
					try {$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_from').val())}
					catch (e){validD=false}

					if($('#date_from').val()!='' && tmptime.match(globalTimePre)!=null && validD)
					{
						var dateFrom=$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_from').val());
						var datetime_to=$.fullCalendar.formatDate(dateFrom, 'yyyy-MM-dd');
						var aDate=new Date(Date.parse("01/02/1990, "+$('#time_from').val()));
						var time_from=$.fullCalendar.formatDate(aDate, 'HH:mm:ss');

						var checkD=$.fullCalendar.parseDate(datetime_to+'T'+time_from);
						globalPrevDate = new Date(checkD.getTime());
					}
					else
						globalPrevDate='';
					if($(this).attr('id')=='date_from' && prevDate!='' && globalPrevDate!='')
					{
						globalPrevDate.setSeconds(0);
						globalPrevDate.setMilliseconds(0);
						prevDate.setSeconds(0);
						prevDate.setMilliseconds(0);
						var diffDate  = globalPrevDate.getTime() - prevDate.getTime();

						try {$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_to').val())}
						catch (e){validD=false}
						if($('#date_to').val()!='' && $('#time_to').val().match(globalTimePre)!=null && validD)
						{
							var dateTo=$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_to').val());
							var datetime_to=$.fullCalendar.formatDate(dateTo, 'yyyy-MM-dd');
							var aDateT=new Date(Date.parse("01/02/1990, "+$('#time_to').val()));
							var time_to=$.fullCalendar.formatDate(aDateT, 'HH:mm:ss');
							var checkDT=$.fullCalendar.parseDate(datetime_to+'T'+time_to);
							var toDate = new Date(checkDT.getTime() + diffDate);
							var formattedDate_to=$.datepicker.formatDate(globalSettings.datepickerformat.value, toDate);
							$('#date_to').val(formattedDate_to);
							$('#time_to').val($.fullCalendar.formatDate(toDate, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));
						}
					}
				}
				else if($('#todo_type').val()=='both' && $(this).attr('id')=='date_fromTODO')
				{
					var tmptime = $('#time_fromTODO').val();
					var validD=true, prevDate = '';
					if(globalPrevDate!='')
						prevDate = new Date(globalPrevDate.getTime());
					try {$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_fromTODO').val())}
					catch (e){validD=false}
					if($('#date_fromTODO').val()!='' && tmptime.match(globalTimePre)!=null && validD)
					{
						var dateFrom=$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_fromTODO').val());
						var datetime_to=$.fullCalendar.formatDate(dateFrom, 'yyyy-MM-dd');
						var aDate=new Date(Date.parse("01/02/1990, "+$('#time_fromTODO').val()));
						var time_from=$.fullCalendar.formatDate(aDate, 'HH:mm:ss');

						var checkD=$.fullCalendar.parseDate(datetime_to+'T'+time_from);
						globalPrevDate = new Date(checkD.getTime());
					}
					else
						globalPrevDate='';

					if($(this).attr('id')=='date_fromTODO' && prevDate!='' && globalPrevDate!='')
					{
						globalPrevDate.setSeconds(0);
						globalPrevDate.setMilliseconds(0);
						prevDate.setSeconds(0);
						prevDate.setMilliseconds(0);
						var diffDate  = globalPrevDate.getTime() - prevDate.getTime();

						try {$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_toTODO').val())}
						catch (e){validD=false}
						if($('#date_toTODO').val()!='' && $('#time_toTODO').val().match(globalTimePre)!=null && validD)
						{
							var dateTo=$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_toTODO').val());
							var datetime_to=$.fullCalendar.formatDate(dateTo, 'yyyy-MM-dd');
							var aDateT=new Date(Date.parse("01/02/1990, "+$('#time_toTODO').val()));
							var time_to=$.fullCalendar.formatDate(aDateT, 'HH:mm:ss');
							var checkDT=$.fullCalendar.parseDate(datetime_to+'T'+time_to);
							var toDate = new Date(checkDT.getTime() + diffDate);
							var formattedDate_to=$.datepicker.formatDate(globalSettings.datepickerformat.value, toDate);
							$('#date_toTODO').val(formattedDate_to);
							$('#time_toTODO').val($.fullCalendar.formatDate(toDate, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));
						}
					}
				}
			});

			$(this).bind('keyup change', function(){
				if(!$(this).prop('readonly') && !$(this).prop('disabled'))
				{
					var valid=false;

					if($(this).val()!='')
					{
						valid=true;
						try {$.datepicker.parseDate(globalSettings.datepickerformat.value, $(this).val())}
						catch (e){valid=false}
					}

					if($(this).attr('id')=='completedOnDate')
					{
						if($(this).val()=='')
						{
							if($('#completedOnTime').val()=='')
							{
								valid=true;
								$('#completedOnTime').parent().find('img').css('display', 'none');
							}
							else
								valid=false;
						}
						else
						{
							if(valid)
							{
								if($('#completedOnTime').val()=='')
									$('#completedOnTime').parent().find('img').css('display', 'inline');
								else
									$('#completedOnTime').parent().find('img').css('display', 'none');
							}
						}
					}

					if(valid)
					{
						$(this).parent().find('img').css('display','none');
						if($(this).attr('id')=='date_from' && $('#repeat_end_date').is(':visible'))
							$('#repeat_end_date').keyup();
						if(($(this).attr('id')=='date_fromTODO' || $(this).attr('id')=='date_toTODO') && $('#repeat_end_date_TODO').is(':visible'))
							$('#repeat_end_date_TODO').keyup();
					}
					else
						$(this).parent().find('img').css('display','inline');

					if($(this).attr('id')=='repeat_end_date')
					{
						if(valid && $('#date_from').val()!='')
						{
							$(this).parent().find('img').css('display','inline');
							var today=$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_from').val());
							if(today!=null)
							{
								var repeatEnd = $.datepicker.parseDate(globalSettings.datepickerformat.value, $(this).val());
								if(repeatEnd!=null)
									if(repeatEnd>=today)
										$(this).parent().find('img').css('display','none');

							}
						}
					}
					else if(valid && $(this).attr('id')=='repeat_end_date_TODO')
					{
						if($('#date_fromTODO').is(':visible') && $('#date_fromTODO').val()!='')
						{
							$(this).parent().find('img').css('display','inline');
							var today=$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_fromTODO').val());
							if(today!=null)
							{
								var repeatEnd = $.datepicker.parseDate(globalSettings.datepickerformat.value, $(this).val());
								if(repeatEnd!=null)
									if(repeatEnd>=today)
										$(this).parent().find('img').css('display','none');

							}
						}
						else if($('#date_toTODO').is(':visible') && $('#date_toTODO').val()!='')
						{
							$(this).parent().find('img').css('display','inline');
							var today=$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_toTODO').val());
							if(today!=null)
							{
								var repeatEnd = $.datepicker.parseDate(globalSettings.datepickerformat.value, $(this).val());
								if(repeatEnd!=null)
									if(repeatEnd>=today)
										$(this).parent().find('img').css('display','none');

							}
						}
					}
				}
			});

			// show the datepicker after the initialization
			$(this).datepicker('show');
		}
	});
}

function initCalDavTimepicker(element)
{
	var timepickers = element.find('.time');

	timepickers.focus(function(){
		$(this).autocomplete({
			create: function( event, ui ){
				$(this).data("ui-autocomplete").menu.element.addClass('ui-autocomplete-caldav');
			},
			close: function( event, ui ){
				$(this).keyup();
			},
			source: function(request, response){
				var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), 'i');
				response($.grep(timelist, function(value){
					value = value.label || value.value || value;
					return matcher.test(value) || matcher.test(value.multiReplace(globalSearchTransformAlphabet));
				}));
			},
			minLength: 0
		});
	});

	timepickers.blur(function(){
		var tmptime=$.trim($(this).val());
		if(tmptime.match(globalTimePre)!=null)
		{
			if(tmptime.indexOf(':')==-1)
			{
				if(globalSettings.ampmformat.value)
				{
					if(tmptime.indexOf(' ')==-1)
						tmptime=tmptime.substring(0,2)+':'+tmptime.substring(2,4)+' '+tmptime.substring(4,6);
					else tmptime=tmptime.substring(0,2)+':'+tmptime.substring(2,4)+' '+tmptime.substring(5,7);
				}
				else tmptime=tmptime.substring(0,2)+':'+tmptime.substring(2,4);
			}
			else
			{
				if(globalSettings.ampmformat.value)
				{
					var partA=tmptime.split(':')[0];
					partA=parseInt(partA,10);
					var partB=tmptime.split(':')[1].substring(0,tmptime.split(':')[1].length-2);
					partB=parseInt(partB,10);
					tmptime=(partA < 10 ? '0' : '')+partA+':'+(partB < 10 ? '0' : '')+partB+' '+tmptime.split(':')[1].substring(tmptime.split(':')[1].length-2, tmptime.split(':')[1].length);
				}
				else
				{
					var partA=tmptime.split(':')[0];
					partA=parseInt(partA,10);
					var partB=tmptime.split(':')[1];
					partB=parseInt(partB,10);
					tmptime=(partA<10 ? '0' : '')+partA+':'+(partB<10 ? '0' : '')+partB;
				}
			}
			if(tmptime.length==7)
				tmptime=tmptime.substring(0,5)+' '+tmptime.substring(5,7);
			else if(tmptime.length==6 && tmptime.indexOf(':')!=-1)
				tmptime=tmptime.substring(0,2)+':'+tmptime.substring(2,4)+' '+tmptime.substring(4,6);

			$(this).val(tmptime.toUpperCase());
		}

		if($(this).attr('id')=='time_from')
		{
			var validD=true, prevDate = '';
			if(globalPrevDate!='')
				prevDate = new Date(globalPrevDate.getTime());

			try {$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_from').val())}
			catch (e){validD=false}
			if(tmptime.match(globalTimePre)!=null && validD)
			{
				var dateFrom=$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_from').val());
				var datetime_to=$.fullCalendar.formatDate(dateFrom, 'yyyy-MM-dd');
				var aDate=new Date(Date.parse("01/02/1990, "+$('#time_from').val()));
				var time_from=$.fullCalendar.formatDate(aDate, 'HH:mm:ss');

				var checkD=$.fullCalendar.parseDate(datetime_to+'T'+time_from);
				globalPrevDate = new Date(checkD.getTime());
			}
			else
				globalPrevDate='';
			if($(this).attr('id')=='time_from' && prevDate!='' && globalPrevDate!='')
			{
				globalPrevDate.setSeconds(0);
				globalPrevDate.setMilliseconds(0);
				prevDate.setSeconds(0);
				prevDate.setMilliseconds(0);
				var diffDate  = globalPrevDate.getTime() - prevDate.getTime();

				try {$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_to').val())}
				catch (e){validD=false}
				if($('#date_to').val()!='' && $('#time_to').val().match(globalTimePre)!=null && validD)
				{
					var dateTo=$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_to').val());
					var datetime_to=$.fullCalendar.formatDate(dateTo, 'yyyy-MM-dd');
					var aDateT=new Date(Date.parse("01/02/1990, "+$('#time_to').val()));
					var time_to=$.fullCalendar.formatDate(aDateT, 'HH:mm:ss');
					var checkDT=$.fullCalendar.parseDate(datetime_to+'T'+time_to);
					var toDate = new Date(checkDT.getTime() + diffDate);
					var formattedDate_to=$.datepicker.formatDate(globalSettings.datepickerformat.value, toDate);
					$('#date_to').val(formattedDate_to);
					$('#time_to').val($.fullCalendar.formatDate(toDate, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));
				}
			}
		}
		else if($('#todo_type').val()=='both' && $(this).attr('id')=='time_fromTODO')
		{
			var validD=true, prevDate = '';
			if(globalPrevDate!='')
				prevDate = new Date(globalPrevDate.getTime());
			try {$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_fromTODO').val())}
			catch (e){validD=false}
			if(tmptime.match(globalTimePre)!=null && validD)
			{
				var dateFrom=$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_fromTODO').val());
				var datetime_to=$.fullCalendar.formatDate(dateFrom, 'yyyy-MM-dd');
				var aDate=new Date(Date.parse("01/02/1990, "+$('#time_fromTODO').val()));
				var time_from=$.fullCalendar.formatDate(aDate, 'HH:mm:ss');

				var checkD=$.fullCalendar.parseDate(datetime_to+'T'+time_from);
				globalPrevDate = new Date(checkD.getTime());
			}
			else
				globalPrevDate='';

			if($(this).attr('id')=='time_fromTODO' && prevDate!='' && globalPrevDate!='')
			{
				globalPrevDate.setSeconds(0);
				globalPrevDate.setMilliseconds(0);
				prevDate.setSeconds(0);
				prevDate.setMilliseconds(0);
				var diffDate  = globalPrevDate.getTime() - prevDate.getTime();
				try {$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_toTODO').val())}
				catch (e){validD=false}
				if($('#date_toTODO').val()!='' && $('#time_toTODO').val().match(globalTimePre)!=null && validD)
				{
					var dateTo=$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_toTODO').val());
					var datetime_to=$.fullCalendar.formatDate(dateTo, 'yyyy-MM-dd');
					var aDateT=new Date(Date.parse("01/02/1990, "+$('#time_toTODO').val()));
					var time_to=$.fullCalendar.formatDate(aDateT, 'HH:mm:ss');
					var checkDT=$.fullCalendar.parseDate(datetime_to+'T'+time_to);
					var toDate = new Date(checkDT.getTime() + diffDate);
					var formattedDate_to=$.datepicker.formatDate(globalSettings.datepickerformat.value, toDate);
					$('#date_toTODO').val(formattedDate_to);
					$('#time_toTODO').val($.fullCalendar.formatDate(toDate, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));
				}
			}
		}
	});

	timepickers.bind('keyup change', function(){
		var tmptime=$.trim($(this).val());
		/*if(tmptime.match(globalTimePre)!=null)
		{
			var formattedTime=tmptime.toLowerCase().replace(RegExp(' ','g'),'');	// lower case string without spaces
			if(formattedTime.indexOf(':')==-1)
				var result_time=(parseInt(formattedTime.substr(0,2),10)+(formattedTime.substr(-2)=='pm' ? 12 : 0)).pad(2)+formattedTime.substr(2,2);
			else
				var result_time=(parseInt(formattedTime.split(':')[0],10)+(formattedTime.substr(-2)=='pm' ? 12 : 0)).pad(2)+parseInt(formattedTime.split(':')[1],10).pad(2);
			$(this).parent().find('img').css('display', 'none');
		}
		else $(this).parent().find('img').css('display', 'inline');*/
		if($(this).attr('id')!='completedOnTime')
		{
			if(tmptime.match(globalTimePre)==null)
				$(this).parent().find('img').css('display', 'inline');
			else
				$(this).parent().find('img').css('display', 'none');
		}
		else
		{
			if($(this).val()=='')
			{
				if($('#completedOnDate').val()=='')
				{
					$(this).parent().find('img').css('display', 'none');
					$('#completedOnDate').parent().find('img').css('display', 'none');
				}
				else
					$(this).parent().find('img').css('display', 'inline');
			}
			else
			{
				if(tmptime.match(globalTimePre)==null)
					$(this).parent().find('img').css('display', 'inline');
				else
				{
					$(this).parent().find('img').css('display', 'none');
					if($('#completedOnDate').val()=='')
						$('#completedOnDate').parent().find('img').css('display', 'inline');
					else
						$('#completedOnDate').parent().find('img').css('display', 'none');
				}
			}
		}
	});

	timepickers.dblclick(function(){
		if($(this).val()!='')
			return false;

		var now=new Date();
		var todoString='';
		if($(this).attr('id')!=undefined)
			if($(this).attr('id').indexOf('TODO')!=-1)
				todoString='TODO';
		if($(this).attr('id')=='time_to' || (($(this).attr('id')=='time_toTODO')&&($('.dateTrFromTODO').css('display')!='none')))
		{
			var testString=$(this).val();
			if(($('#time_from'+todoString).parent().find('img').css('display')=='none') && ($('#date_from'+todoString).parent().find('img').css('display')=='none')
				&& ($('#date_to'+todoString).parent().find('img').css('display')=='none'))
			{
				var inputDate=$.datepicker.parseDate(globalSettings.datepickerformat.value,$('#date_from'+todoString).val());
				var formatString=inputDate.getFullYear()+'/'+(inputDate.getMonth()<10 ? '0' : '')+(inputDate.getMonth()+1)+'/'+(inputDate.getDate()<10 ? '0' : '')+inputDate.getDate();

				var timeDate=new Date(Date.parse(formatString+", "+$('#time_from'+todoString).val()));
				now=new Date(timeDate.getTime());

				var inputDate2=$.datepicker.parseDate(globalSettings.datepickerformat.value,$('#date_to'+todoString).val())
				var formatString2=inputDate2.getFullYear()+'/'+(inputDate2.getMonth()<10 ? '0' : '')+(inputDate2.getMonth()+1)+'/'+(inputDate2.getDate()<10 ? '0' : '')+inputDate2.getDate();

				var timeDateFrom=new Date(Date.parse(formatString2+", "+$('#time_from'+todoString).val()));
				if(formatString==formatString2)
				{
					now.setHours(now.getHours()+1);
					var newTestValue = new Date(Date.parse(formatString2+", "+$.fullCalendar.formatDate(now, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm'))));
					if(newTestValue < timeDateFrom)
					{
						newTestValue.setHours(23);
						newTestValue.setMinutes(59);
						now = new Date(newTestValue.getTime());
					}
				}
			}
		}
		if($(this).attr('id')=='time_from' || $(this).attr('id')=='time_fromTODO')
		{
			if(globalPrevDate!='')
			{
				globalPrevDate.setHours(now.getHours());
				globalPrevDate.setMinutes(now.getMinutes());
			}
		}
		$(this).val($.fullCalendar.formatDate(now, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));
		$(this).keyup();
	});
}

function duplicateEvent(todoSel)
{
	if(todoSel=='TODO')
	{
		startEditModeTodo();
		$('#showTODO').val('');
		$('#uidTODO').val('');
		$('#vcalendarHashTODO').val('');
		$('#vcalendarUIDTODO').val('');
		$('#etagTODO').val('');
		$('#todoInEdit').val('true');
		$('#deleteTODO').hide();
		$('#resetTODO').hide();
		$('#editTODO').hide();
		$('#duplicateTODO').hide();
		$('#editOptionsButtonTODO').hide();
	}
	else
	{
		startEditModeEvent();
		$('#uid').val('');
		$('#show').val('');
		$('#etag').val('');
		$('#vcalendarHash').val('');
		$('#vcalendarUID').val('');
		$('#editButton').hide();
		$('#duplicateButton').hide();
		$('#editOptionsButton').hide();
		$('#resetButton').hide();
		$('#deleteButton').hide();
	}
}

function showNewEvent(todoSel)
{
	if($('#ResourceCalDAV'+todoSel+'List .resourceCalDAV'+todoSel+'_item:visible').not('.resourceCalDAV_item_ro').length==0)
		return false;

	$('#timezonePicker'+todoSel).prop('disabled', true);
	if(todoSel=='TODO')
	{
		$('#TodoDisabler').fadeIn(globalEditorFadeAnimation);
		showTodoForm(null, 'new');
		$('#nameTODO').focus();
	}
	else
	{
		$('#show').val('');
		$('#CAEvent').hide();

		$('#EventDisabler').fadeIn(globalEditorFadeAnimation, function(){
			showEventForm(new Date(), true, null, null, 'new', '');
			$('#name').focus();
		});
	}
}

function showEventPopup(e, event)
{
	var from;
	var to;
	var status;
	var avail;
	var classType;
	var priority;
	var resource = globalResourceCalDAVList.getCollectionByUID(event.res_id);

	if(event.allDay)
	{
		from = $.fullCalendar.formatDate(event.realStart, dateFormatJqToFc(globalSettings.datepickerformat.value));
		to = $.fullCalendar.formatDate(event.realEnd, dateFormatJqToFc(globalSettings.datepickerformat.value));
	}
	else
	{
		from = $.fullCalendar.formatDate(event.realStart, dateFormatJqToFc(globalSettings.datepickerformat.value) + '\'&emsp;\'' + (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm'));
		to = $.fullCalendar.formatDate(event.realEnd, dateFormatJqToFc(globalSettings.datepickerformat.value) + '\'&emsp;\'' + (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm'));
	}

	switch(event.status){
		case 'NONE':
			status = localization[globalInterfaceLanguage].txtStatusNone;
			break;
		case 'TENTATIVE':
			status = localization[globalInterfaceLanguage].txtStatusTentative;
			break;
		case 'CONFIRMED':
			status = localization[globalInterfaceLanguage].txtStatusConfirmed;
			break;
		case 'CANCELLED':
			status = localization[globalInterfaceLanguage].txtStatusCancelled;
			break;
		default:
			status = localization[globalInterfaceLanguage].txtStatusNone;
			break;
	}

	switch(event.avail){
		case 'OPAQUE':
			avail = localization[globalInterfaceLanguage].eventAvailabilityBusy;
			break;
		case 'TRANSPARENT':
			avail = localization[globalInterfaceLanguage].eventAvailabilityFree;
			break;
		default:
			avail = localization[globalInterfaceLanguage].eventAvailabilityFree;
			break;
	}

	switch(event.classType){
		case 'PUBLIC':
			classType = localization[globalInterfaceLanguage].eventTypePublic;
			break;
		case 'CONFIDENTIAL':
			classType = localization[globalInterfaceLanguage].eventTypeConfidential;
			break;
		case 'PRIVATE':
			classType = localization[globalInterfaceLanguage].eventTypePrivate;
			break;
		default:
			classType = localization[globalInterfaceLanguage].eventTypePublic;
			break;
	}

	var prior = parseInt(event.priority,10);
	if(prior==5)
		priority = localization[globalInterfaceLanguage].txtPriorityMedium;
	else if(prior>5 && prior<10)
		priority = localization[globalInterfaceLanguage].txtPriorityLow;
	else if(prior<5 && prior>0)
		priority = localization[globalInterfaceLanguage].txtPriorityHigh;
	else
		priority = localization[globalInterfaceLanguage].txtPriorityNone;

	// prevent displaying of extremely long texts in the event preview box
	var maxPreviewTextLength=512;

	if(event.title=='')
		$('#CalDavZAPPopup').find('[data-type="name"]').parent().css('display','none');
	else
		$('#CalDavZAPPopup').find('[data-type="name"]').text((event.title.length>maxPreviewTextLength ? event.title.substr(0, maxPreviewTextLength-4)+' ...' : event.title)).parent().css('display','');
	if(event.location=='')
		$('#CalDavZAPPopup').find('[data-type="location"]').parent().css('display','none');
	else
		$('#CalDavZAPPopup').find('[data-type="location"]').text(event.location).parent().css('display','');
	if(event.hrefUrl=='')
		$('#CalDavZAPPopup').find('[data-type="url"]').parent().css('display','none');
	else
		$('#CalDavZAPPopup').find('[data-type="url"]').text(event.hrefUrl).parent().css('display','');
	if(event.note=='')
		$('#CalDavZAPPopup').find('[data-type="note"]').parent().css('display','none');
	else
		$('#CalDavZAPPopup').find('[data-type="note"]').text((event.note.length>maxPreviewTextLength ? event.note.substr(0, maxPreviewTextLength-4)+' ...' : event.note)).parent().css('display','');



	$('#CalDavZAPPopup').find('[data-type="from"]').html(from);
	$('#CalDavZAPPopup').find('[data-type="to"]').html(to);
	$('#CalDavZAPPopup').find('[data-type="status"]').text(status);
	$('#CalDavZAPPopup').find('[data-type="avail"]').text(avail);
	$('#CalDavZAPPopup').find('[data-type="type"]').text(classType);
	$('#CalDavZAPPopup').find('[data-type="priority"]').text(priority);
	$('#CalDavZAPPopup').find('[data-type="calendar"]').text(resource.displayvalue);

	$('#CalDavZAPPopup').css({'opacity':0,'display':'block','top':0,'left':0});
	$('#CalDavZAPPopupColor').css('height',0);
	$('#CalDavZAPPopup').css('top', Math.max(e.pageY-$('#CalDavZAPPopup').outerHeight()-10, 30));
	$('#CalDavZAPPopup').css('left', Math.max(Math.min(e.pageX, $(window).width()-$('#CalDavZAPPopup').outerWidth()-50)+20, 30));
	$('#CalDavZAPPopupColor').css({'background-color':resource.ecolor, 'height':$('#CalDavZAPPopup').height()});
	$('#CalDavZAPPopup').animate({'opacity':1}, 100);
}

function moveEventPopup(e)
{
	$('#CalDavZAPPopup').css('top', Math.max(e.pageY-$('#CalDavZAPPopup').outerHeight()-10, 30));
	$('#CalDavZAPPopup').css('left', Math.max(Math.min(e.pageX, $(window).width()-$('#CalDavZAPPopup').outerWidth()-50)+20, 30));
}

function hideEventPopup()
{
	$('#CalDavZAPPopup').css('display', 'none');
}

function loadAdditionalCardDAVCollections()
{
	if(globalSettingsSaving!='')
		return false;
	globalSettingsSaving='addressbook';

	var inSettings = $.extend({},globalSettings);
	var rex = new RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@(.*)');
	var key='loadedaddressbookcollections';

	inSettings.loadedaddressbookcollections = {value : new Array(), locked: globalSettings[key].locked};
	$('#ResourceCardDAVList').find('.unloadCheck').each(function(cin,cel)
	{
		if($(cel).prop('checked'))
		{
			var uidParts=$(cel).attr('data-id').match(rex);
			inSettings.loadedaddressbookcollections.value.splice(inSettings.loadedaddressbookcollections.value.length , 0, uidParts[1]+uidParts[3]);
		}
	});

	if($(inSettings[key]).not(globalSettings[key].value).length > 0 || $(globalSettings[key].value).not(inSettings[key]).length > 0)
	{
		$('#AddressbookOverlay').removeClass('loader_hidden');
		$('#ResourceCardDAVList').find('input[type="checkbox"]').prop('disabled',true);
		var setC=0;
		for(var i=0;i<globalAccountSettings.length;i++)
			if(globalAccountSettings[i].href.indexOf(globalLoginUsername)!=-1 && globalAccountSettings[i].settingsAccount)
			{
				setC++;
				netSaveSettings(globalAccountSettings[i], inSettings, false, true);
				break;
			}
		if(setC==0)
			cancelUnloadedCardDAVCollections();
	}
	else
		hideUnloadedCardDAVCollections(true);
}

function showUnloadedCardDAVCollections()
{
	if(globalAddressbookCollectionsLoading)
		return false;
	globalAddressbookCollectionsLoading=true;
	if(isAvaible('CalDavZAP'))
	{
		$('#showUnloadedCalendars').css('display','none');
		$('#showUnloadedCalendarsTODO').css('display','none');
	}
	$('#ResourceCardDAVList').find('input[type="checkbox"]').prop('disabled',true);
	$('#AddressbookOverlay').children('.loaderInfo').text(localization[globalInterfaceLanguage].loadingCollectionList).parent().fadeIn(300);
	var resList=$('#ResourceCardDAVList');
	var resHeader='.resourceCardDAV_header';
	var resItem='.resourceCardDAV';

	$('#ResourceCardDAVList').find('input[type="checkbox"]').prop('disabled',false);
	$('#AddressbookOverlay').children('.loaderInfo').text('').parent().addClass('loader_hidden');
	resList.find('.resourceCardDAV_selected').removeClass('resourceCardDAV_selected');
	resList.find('input').css('display','none');
	// header display
	resList.children('.resourceCardDAV_header').each(function(){
		if($(this).css('display')=='none')
			$(this).addClass('unloaded').css('display','');
		var headerClickElm = $('<input type="checkbox" class="unloadCheckHeader" style="position:absolute;top:3px;right:0px;margin-right:6px;"/>');
		headerClickElm.change(function(){
			loadResourceChBoxClick(this, '#ResourceCardDAVList', resHeader, resItem, '.resourceCardDAV_item');
		});
		$(this).addClass('load_mode').append(headerClickElm);
	});
	// carddav_item display
	resList.find('.resourceCardDAV').each(function(){
		if(typeof $(this).attr('data-id') != 'undefined')
		{
			var newInputElm = $('<input type="checkbox" class="unloadCheck" data-id="'+$(this).attr('data-id')+'" style="position:absolute;top:8px;right:0px;margin-right:6px;"/>');
			newInputElm.change(function(){
				loadCollectionChBoxClick(this, '#ResourceCardDAVList', resHeader, resItem, '.resourceCardDAV_item');
			});
			$(this).siblings('.contact_group').addBack().addClass('load_mode');
			$(this).append(newInputElm);
			if($(this).parent().css('display')=='none')
				$(this).addClass('unloaded');
			else
				newInputElm.prop('checked',true);
			newInputElm.trigger('change');
		}
	});
	$('#showUnloadedAddressbooks').css('display','none');
	$('.resourcesCardDAV_h').text(localization[globalInterfaceLanguage].txtEnabledAddressbooks);
	var origH = resList.find('.resourceCardDAV_header.unloaded').eq(0).css('height');
	var origC = resList.find('.resourceCardDAV.unloaded').parent().eq(0).css('height');
	resList.find('.resourceCardDAV_header.unloaded').css({'height':0,'display':''}).animate({height:origH},300);
	resList.find('.resourceCardDAV.unloaded').parent().css({'height':0,'display':''}).animate({height:origC},300);
	resList.animate({'top':49},300);
}

function cancelUnloadedCardDAVCollections()
{
	$('#ResourceCardDAVList').children('.resourceCardDAV_item').children('.resourceCardDAV ').each(function(){
		var uidParts=$(this).attr('data-id').match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@(.*)'));
		var checkHref=uidParts[1]+uidParts[3];
		var isLoaded=false;
		if(typeof globalCrossServerSettingsURL!='undefined'&&globalCrossServerSettingsURL!=null&globalCrossServerSettingsURL)
		{
			var uidParts=$(this).attr('data-id').match(RegExp('/([^/]+/[^/]+/)$'));
			var tmpParts = uidParts[1].match('^(.*/)([^/]+)/$');
			var checkHref=decodeURIComponent(tmpParts[1])+tmpParts[2]+'/';
			var found=false;
			for(var l=0;l<globalSettings.loadedaddressbookcollections.value.length;l++)
			{
				var tmpParts2 = globalSettings.loadedaddressbookcollections.value[l].match('^(.*/)([^/]+)/([^/]+)/$');
				var checkHref2=decodeURIComponent(tmpParts2[2])+'/'+tmpParts2[3]+'/';
				if(checkHref==checkHref2)
				{
					found=true;
					break;
				}
			}
			isLoaded=found;
		}
		else
			isLoaded=(globalSettings.loadedaddressbookcollections.value.indexOf(checkHref)!=-1)
		var unloadCh=$(this).find('.unloadCheck');
		var checked=unloadCh.prop('checked');

		if((isLoaded && !checked) || (!isLoaded && checked))
			unloadCh.prop('checked',!checked).trigger('change');
	});
	hideUnloadedCardDAVCollections(true);
}

function hideUnloadedCardDAVCollections(withCallback)
{
	var resList=$('#ResourceCardDAVList');
	resList.find(':input.unloadCheck').remove();
	resList.find(':input.unloadCheckHeader').remove();
	resList.find('.load_mode').removeClass('load_mode');
	resList.find(':input').css('display','');
	resList.find('.resourceCardDAV').not('.unloaded').parent().css('height','');

	$('.resourcesCardDAV_h').text(localization[globalInterfaceLanguage].txtAddressbooks);
	resList.find('.resourceCardDAV_header.unloaded').animate({height:0},300).promise().done(function(){
		resList.find('.resourceCardDAV_header.unloaded').css({'display':'none','height':''});
	});
	resList.find('.resourceCardDAV.unloaded').parent().animate({height:0},300).promise().done(function(){
		resList.find('.resourceCardDAV.unloaded').parent().css({'display':'none','height':''});
		resList.find('.resourceCardDAV_header').not('.unloaded').each(function(){
			var triggerInput=$(this).nextUntil('.resourceCardDAV_header').filter(':visible').first().find('input[type="checkbox"]');
			collectionChBoxClick(triggerInput.get(0), '#ResourceCardDAVList', '.resourceCardDAV_header', '.resourceCardDAV', null, false);
		});
		resList.find('.unloaded').removeClass('unloaded');
		globalAddressbookCollectionsLoading=false;
		if(withCallback)
			hideUnloadedCardDAVCollectionsCallBack();
	});
	resList.animate({'top':24},300);
	if(withCallback)
		$('#AddressbookOverlay').fadeOut(300,function(){
			$(this).removeClass('loader_hidden');
		});
	if(isAvaible('CalDavZAP'))
	{
		$('#showUnloadedCalendars').css('display','block');
		$('#showUnloadedCalendarsTODO').css('display','block');
	}
}

function hideUnloadedCardDAVCollectionsCallBack()
{
	if(globalAddressbookList.contactLoaded!=null)
		globalAddressbookList.loadContactByUID(globalAddressbookList.contactLoaded.uid);
	$('#showUnloadedAddressbooks').css('display','');
	globalFirstHideLoader=true;
	globalSettingsSaving='';
	selectActiveAddressbook();
	$('#AddressbookOverlay').css('display','none');
	$('#ResourceCardDAVList').find('input[type="checkbox"]').prop('disabled',false);
}

function selectActiveAddressbook()
{
	if(globalAddressbookCollectionsLoading)
		return false;

	for(var i=0; i<globalResourceCardDAVList.collections.length;i++)
		if(globalResourceCardDAVList.collections[i].uid!=undefined)
		{
			var inputResource=globalResourceCardDAVList.collections[i].uid;
			var par=inputResource.split('/');
			if(globalSettings.addressbookselected.value!='')
			{
				if(typeof globalSettings.addressbookselected.value=='string' && inputResource==globalSettings.addressbookselected.value.substring(0,globalSettings.addressbookselected.value.lastIndexOf('/')+1))
				{
					if($('#ResourceCardDAVList').find('.resourceCardDAV_selected:visible').length == 0)
						$('#ResourceCardDAVList').find('.resourceCardDAV[data-id="'+globalSettings.addressbookselected.value+'"]:visible').addClass('resourceCardDAV_selected');
				}
				else if(typeof globalSettings.addressbookselected.value=='string' && globalSettings.addressbookselected.value.charAt(globalSettings.addressbookselected.value.length-1)=='/' && (par[par.length-3]+'/'+par[par.length-2]+'/')==globalSettings.addressbookselected.value)
				{
					if($('#ResourceCardDAVList').find('.resourceCardDAV_selected:visible').length == 0)
						$('#ResourceCardDAVList').find('.resourceCardDAV[data-id="'+inputResource+'"]:visible').addClass('resourceCardDAV_selected');
				}
				else if(typeof globalSettings.addressbookselected.value=='string' && globalSettings.addressbookselected.value.charAt(globalSettings.addressbookselected.value.length-1)!='/')
				{
					if((par[par.length-3]+'/'+par[par.length-2]+'/') == globalSettings.addressbookselected.value.substring(0,globalSettings.addressbookselected.value.lastIndexOf('/')+1) && $('#ResourceCardDAVList').find('.resourceCardDAV_selected:visible').length == 0)
					{
						if($('#ResourceCardDAVList').find('.resourceCardDAV[data-id="'+inputResource+globalSettings.addressbookselected.value.substring(globalSettings.addressbookselected.value.lastIndexOf('/')+1,globalSettings.addressbookselected.value.length)+'"]:visible').length>0)
						$('#ResourceCardDAVList').find('.resourceCardDAV[data-id="'+inputResource+globalSettings.addressbookselected.value.substring(globalSettings.addressbookselected.value.lastIndexOf('/')+1,globalSettings.addressbookselected.value.length)+'"]:visible').addClass('resourceCardDAV_selected');
					}
				}
				else if (typeof globalSettings.addressbookselected.value=='object' && inputResource.match(globalSettings.addressbookselected.value)!=null)
				{
					if($('#ResourceCardDAVList').find('.resourceCardDAV_selected:visible').length == 0)
						$('#ResourceCardDAVList').find('.resourceCardDAV[data-id="'+inputResource+'"]:visible').addClass('resourceCardDAV_selected');
				}
			}
		}

	if($('#ResourceCardDAVList').find('.resourceCardDAV_selected:visible').length==0)
		for(var i=0; i<globalResourceCardDAVList.collections.length;i++)
			if(globalResourceCardDAVList.collections[i].uid!=undefined)
			{
				var inputResource=globalResourceCardDAVList.collections[i].uid;
				var par=inputResource.split('/');
				if(typeof globalAddressbookSelected!='undefined' && globalAddressbookSelected!=null && globalAddressbookSelected!='')
				{
					globalSettings.addressbookselected.value = globalAddressbookSelected;
					if(typeof globalAddressbookSelected=='string' && inputResource==globalAddressbookSelected.substring(0,globalAddressbookSelected.lastIndexOf('/')+1))
					{
						if($('#ResourceCardDAVList').find('.resourceCardDAV_selected:visible').length == 0)
							$('#ResourceCardDAVList').find('[data-id="'+globalAddressbookSelected+'"]:visible').addClass('resourceCardDAV_selected');
					}
					else if(typeof globalAddressbookSelected=='string' && globalAddressbookSelected.charAt(globalAddressbookSelected.length-1)=='/' && (par[par.length-3]+'/'+par[par.length-2]+'/')==globalAddressbookSelected)
					{
						if($('#ResourceCardDAVList').find('.resourceCardDAV_selected:visible').length == 0)
							$('#ResourceCardDAVList').find('[data-id="'+inputResource+'"]:visible').addClass('resourceCardDAV_selected');
					}
					else if(typeof globalAddressbookSelected=='string' && globalAddressbookSelected.charAt(globalAddressbookSelected.length-1)!='/')
					{
						if((par[par.length-3]+'/'+par[par.length-2]+'/') == globalAddressbookSelected.substring(0,globalAddressbookSelected.lastIndexOf('/')+1) && $('#ResourceCardDAVList').find('.resourceCardDAV_selected:visible').length == 0)
						{
							if($('#ResourceCardDAVList').find('[data-id="'+inputResource+globalAddressbookSelected.substring(globalAddressbookSelected.lastIndexOf('/')+1,globalAddressbookSelected.length)+'"]:visible').length>0)
							$('#ResourceCardDAVList').find('[data-id="'+inputResource+globalAddressbookSelected.substring(globalAddressbookSelected.lastIndexOf('/')+1,globalAddressbookSelected.length)+'"]:visible').addClass('resourceCardDAV_selected');
						}
					}
					else if (typeof globalAddressbookSelected=='object' && inputResource.match(globalAddressbookSelected)!=null)
					{
						if($('#ResourceCardDAVList').find('.resourceCardDAV_selected:visible').length == 0)
							$('#ResourceCardDAVList').find('[data-id="'+inputResource+'"]:visible').addClass('resourceCardDAV_selected');
					}
					else if($('#ResourceCardDAVList').find('.resourceCardDAV_selected:visible').length == 0)
					{
						globalSettings.addressbookselected.value=par[par.length-3]+'/'+par[par.length-2]+'/';
						$('#ResourceCardDAVList').find('[data-id="'+inputResource+'"]:visible').addClass('resourceCardDAV_selected');
					}
				}
			}

	if($('#ResourceCardDAVList').find('.resourceCardDAV_selected:visible').length == 0 && $('#ResourceCardDAVList').find('.resourceCardDAV[data-id]:visible').length > 0)
	{
		var ui_d = $('#ResourceCardDAVList').find('.resourceCardDAV[data-id]:visible').eq(0).attr('data-id');
		var part_u = ui_d.split('/');
		globalSettings.addressbookselected.value=part_u[part_u.length-3]+'/'+part_u[part_u.length-2]+'/';
		$('#ResourceCardDAVList').find('.resourceCardDAV[data-id]:visible').eq(0).addClass('resourceCardDAV_selected');
	}
	var selColl=globalResourceCardDAVList.getCollectionByUID($('#ResourceCardDAVList').find('.resourceCardDAV[data-id].resourceCardDAV_selected').attr('data-id'));
	if(selColl!=null)
	{
		selColl.filterUID=selColl.uid;
		if(selColl.permissions.read_only==true)
			globalRefAddContact.addClass('element_no_display');
		else
			globalRefAddContact.removeClass('element_no_display');

		globalRefAddContact.attr('data-url', selColl.uid.replace(RegExp('[^/]+$'),''));
		globalRefAddContact.attr('data-filter-url',selColl.filterUID);	// Set the current addressbook filter uid
		globalRefAddContact.attr('data-account-uid',selColl.accountUID);
		globalRefAddContact.attr('data-color',selColl.color);

		// Make the selected collection active
		if(!globalCardDAVInitLoad)
		{
			if(typeof(globalContactsABChange)=='function')
				globalContactsABChange(selColl.uid);

			$('#ResourceCardDAVList').find('.resourceCardDAV_item').find('.resourceCardDAV_selected').removeClass('resourceCardDAV_selected');
			$('#ResourceCardDAVList').find('[data-id='+jqueryEscapeSelector(selColl.uid)+']').addClass('resourceCardDAV_selected');
			if(selColl.filterUID[selColl.filterUID.length-1]!='/')
				$('#ResourceCardDAVList').find('[data-id='+jqueryEscapeSelector(selColl.filterUID)+']').addClass('resourceCardDAV_selected');
		}
	}
}

function CardDAVUpdateMainLoader(inputCollection)
{
	if(!globalCardDAVInitLoad)
	{
		if(globalSettingsSaving=='addressbook')
		{
			globalLoadedCollectionsCount++;
			$('#AddressbookOverlay').children('.loaderInfo').text(localization[globalInterfaceLanguage].loadingAddressbooks.replace('%act%', globalLoadedCollectionsCount).replace('%total%', globalLoadedCollectionsNumber));
			if(globalSettingsSaving!='' && globalLoadedCollectionsCount==globalLoadedCollectionsNumber)
				setTimeout(function(){hideUnloadedCardDAVCollectionsCallBack();if(isAvaible('Settings'))hideSettingsOverlay();},300);
		}
		selectActiveAddressbook();
		for(var adr in globalAddressbookList.vcard_groups)
		{
			if(globalAddressbookList.vcard_groups[adr].length>0)
			{
				extendDestSelect();
				if(typeof $('#vCardEditor').attr('data-vcard-uid')=='undefined')
					$('#vCardEditor').find('[data-attr-name="_DEST_"]').find('optiotn[data-type$="'+$('#ResourceCardDAVList').find('.resourceCardDAV_selected').find(':input[data-id]').attr('data-id')+'"]').prop('selected',true)
			}
		}
		return false;
	}
	if(inputCollection.makeLoaded)
	{
		globalAddressbookNumberCount++;
		$('#MainLoaderInner').html(localization[globalInterfaceLanguage].loadingAddressbooks.replace('%act%', (globalAddressbookNumberCount)).replace('%total%', globalAddressbookNumber));
	}

	inputCollection.isLoaded=true;
	$('#ResourceCardDAVList [data-id="'+inputCollection.uid+'"]').removeClass('r_operate');

	var unloadedCount=0;
	for(var i=0; i<globalResourceCardDAVList.collections.length;i++)
		if(globalResourceCardDAVList.collections[i].uid!=undefined && !globalResourceCardDAVList.collections[i].isLoaded)
				unloadedCount++;

	if(unloadedCount==0 && !isCardDAVLoaded)
	{
		globalCardDAVInitLoad=false;
		globalAddressbookList.renderContacs();
		var rexo=new RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@(.*)');
		if(!globalDefaultAddressbookCollectionActiveAll)
		{
			for(var i=0;i<globalSettings.activeaddressbookcollections.value.length;i++)
			{
				if(typeof globalCrossServerSettingsURL!='undefined'&&globalCrossServerSettingsURL!=null&globalCrossServerSettingsURL)
				{
					var tmpParts2 = globalSettings.activeaddressbookcollections.value[i].match('^(.*/)([^/]+)/([^/]+)/$');
					var checkHref2=tmpParts2[2]+'/'+tmpParts2[3]+'/';
					if($('#ResourceCardDAVList input[data-id$="'+checkHref2+'"]:visible').length>0)
						$('#ResourceCardDAVList input[data-id$="'+checkHref2+'"]').trigger('click');
				}
				else
				{
					var uidPart=globalSettings.activeaddressbookcollections.value[i].match(RegExp('^(https?://)(.*)', 'i'))[1];
					var uidPart2=globalSettings.activeaddressbookcollections.value[i].match(RegExp('^(https?://)(.*)', 'i'))[2];
					var uidPart3=getAccount(inputCollection.accountUID).userAuth.userName;
					var uid = uidPart+uidPart3+'@'+uidPart2;
					if($('#ResourceCardDAVList .resourceCardDAV input[data-id="'+uid+'"]:visible').length>0)
						$('#ResourceCardDAVList .resourceCardDAV input[data-id="'+uid+'"]').trigger('click');
				}
			}
			if(globalSettings.activeaddressbookcollections.value.length>0 && $('#ResourceCardDAVList .resourceCardDAV input:checked').length==0)
				globalDefaultAddressbookCollectionActiveAll=true;
		}
		if(globalDefaultAddressbookCollectionActiveAll)
			for(var i=0;i<globalResourceCardDAVList.collections.length;i++)
				if(globalResourceCardDAVList.collections[i].uid!=undefined && $('#ResourceCardDAVList .resourceCardDAV input[data-id="'+globalResourceCardDAVList.collections[i].uid+'"]:visible').length>0)
						$('#ResourceCardDAVList input[data-id="'+globalResourceCardDAVList.collections[i].uid+'"]').trigger('click');
		selectActiveAddressbook();
		globalRefAddContact.prop('disabled', false);
		loadNextApplication(true);
	}
}

function applyAddrSettings(abContactRef, remValues)
{
	var addrVals = new Array();
	if(typeof remValues!= 'undefined')
	{
		abContactRef.find('[data-type="\\%address"]').find('[data-type="country_type"]').each(function(){
		addrVals[$(this).parents('[data-type="%address"]').attr('data-id')] = $(this).val();
		});
	}
	var country_option=abContactRef.find('[data-type="\\%address"]').find('[data-type="country_type"]').find('option').last().clone();

	abContactRef.find('[data-type="\\%address"]').find('[data-type="country_type"]').html('');

	// we need a copy of the object because of the next "delete" operation
	var addressTypesTmp=jQuery.extend({}, addressTypes);

	// delete custom ordered element before the sort (then we will add them back)
	if(globalSettings.addresscountryfavorites.value.length>0)
		for(var i=globalSettings.addresscountryfavorites.value.length-1;i>=0;i--)
			delete addressTypesTmp[globalSettings.addresscountryfavorites.value[i]];

	var addressTypesArr=sortCountries(addressTypesTmp);
	// re-add custom ordered elements from the original addressTypes (where all elements are still present)
	if(globalSettings.addresscountryfavorites.value.length>0)
		for(var i=globalSettings.addresscountryfavorites.value.length-1;i>=0;i--)
			addressTypesArr.unshift({'key': globalSettings.addresscountryfavorites.value[i], 'value': addressTypes[globalSettings.addresscountryfavorites.value[i]], 'translated_value': localization[globalInterfaceLanguage]['txtAddressCountry'+globalSettings.addresscountryfavorites.value[i].toUpperCase()]});

	for(var i=0;i<addressTypesArr.length;i++)
	{
		var tmp=country_option;
		tmp.attr('data-type',addressTypesArr[i].key);
		tmp.attr('data-full-name',addressTypesArr[i].value[0]);
		tmp.text(addressTypesArr[i].translated_value);	// translation
		abContactRef.find('[data-type="\\%address"]').find('[data-type="country_type"]').append(tmp.clone());
	}
	abContactRef.find('[data-type="\\%address"]').find('[data-type="country_type"]').attr('data-autoselect',globalSettings.defaultaddresscountry.value);
	for(var key in addrVals)
		abContactRef.find('[data-type="\\%address"][data-id="'+key+'"]').find('[data-type="country_type"]').val(addrVals[key]);
}

function localizeCardDAV()
{
	// frequently used
	var abContactRef=$('#ABContact');

	// restore original templates
	$('#ResourceCardDAVList').empty().append(globalOrigCardDAVListTemplate.clone());
	abContactRef.empty().append(globalOrigVcardTemplate.clone());


	localizeAddressTypes();

	// interface translation
	$('[data-type="system_logo"]').attr('alt',localization[globalInterfaceLanguage].altLogo);
	$('[data-type="system_username"]').attr('placeholder',localization[globalInterfaceLanguage].pholderUsername);
	$('[data-type="system_password"]').attr('placeholder',localization[globalInterfaceLanguage].pholderPassword);

	$('[data-type="resourcesCardDAV_txt"]').text(localization[globalInterfaceLanguage].txtAddressbooks);
	$('[data-type="contact_txt"]').text(localization[globalInterfaceLanguage].txtContact);
	$('[data-type="search"]').attr('placeholder',localization[globalInterfaceLanguage].txtSearch);
	$('#AddContact').attr('alt',localization[globalInterfaceLanguage].altAddContact);
	$('#AddContact').attr('title',localization[globalInterfaceLanguage].altAddContact);
	$('#Logout').attr('alt',localization[globalInterfaceLanguage].altLogout);
	$('#Logout').attr('title',localization[globalInterfaceLanguage].altLogout);
	$('#showUnloadedAddressbooks').attr({title:capitalize(localization[globalInterfaceLanguage].txtEnabledAddressbooks),alt:capitalize(localization[globalInterfaceLanguage].txtEnabledAddressbooks)});
	$('#loadUnloadedAddressbooks').val(localization[globalInterfaceLanguage].buttonSave);
	$('#loadUnloadedAddressbooksCancel').val(localization[globalInterfaceLanguage].buttonCancel);

	abContactRef.find('#photoBox').find('h1').text(localization[globalInterfaceLanguage].txtRemoteImage);
	abContactRef.find('#photoURL').attr('placeholder',localization[globalInterfaceLanguage].pholderUrlVal);

	abContactRef.find('[data-type="photo"]').text(localization[globalInterfaceLanguage].altPhoto);
	abContactRef.find('[data-type="given"]').attr('placeholder',localization[globalInterfaceLanguage].pholderGiven);
	abContactRef.find('[data-type="family"]').attr('placeholder',localization[globalInterfaceLanguage].pholderFamily);
	abContactRef.find('[data-type="middle"]').attr('placeholder',localization[globalInterfaceLanguage].pholderMiddle);
	abContactRef.find('[data-type="nickname"]').attr('placeholder',localization[globalInterfaceLanguage].pholderNickname);
	abContactRef.find('[data-type="ph_firstname"]').attr('placeholder',localization[globalInterfaceLanguage].pholderPhGiven);
	abContactRef.find('[data-type="ph_lastname"]').attr('placeholder',localization[globalInterfaceLanguage].pholderPhFamily);
	abContactRef.find('[data-type="prefix"]').attr('placeholder',localization[globalInterfaceLanguage].pholderPrefix);
	abContactRef.find('[data-type="suffix"]').attr('placeholder',localization[globalInterfaceLanguage].pholderSuffix);
	abContactRef.find('[data-type="date_bday"]').attr('placeholder',localization[globalInterfaceLanguage].pholderBday);
	abContactRef.find('[data-type="title"]').attr('placeholder',localization[globalInterfaceLanguage].pholderTitle);
	abContactRef.find('[data-type="org"]').attr('placeholder',localization[globalInterfaceLanguage].pholderOrg);
	abContactRef.find('[data-type="department"]').attr('placeholder',localization[globalInterfaceLanguage].pholderDepartment);
	abContactRef.find('span[data-type="company_contact"]').text(localization[globalInterfaceLanguage].txtCompanyContact);

	abContactRef.find('[data-type="\\%del"]').attr('alt',localization[globalInterfaceLanguage].altDel);
	abContactRef.find('[data-type="\\%add"]').attr('alt',localization[globalInterfaceLanguage].altAdd);
	abContactRef.find('[data-type="value_handler"]').attr('alt',localization[globalInterfaceLanguage].altValueHandler);

	abContactRef.find('[data-type=":custom"]').text(localization[globalInterfaceLanguage].txtCustom);
	abContactRef.find('[data-type="custom_value"]').attr('placeholder',localization[globalInterfaceLanguage].pholderCustomVal);

	abContactRef.find('[data-type="dates_txt"]').text(localization[globalInterfaceLanguage].txtDates);
	abContactRef.find('[data-type="\\%date"]').find('input[data-type="date_value"]').attr('placeholder',localization[globalInterfaceLanguage].pholderDate);
	abContactRef.find('[data-type="\\%date"]').find('[data-type=":_$!<anniversary>!$_:"]').text(localization[globalInterfaceLanguage].txtDatesAnniversary);
	abContactRef.find('[data-type="\\%date"]').find('[data-type=":_$!<other>!$_:"]').text(localization[globalInterfaceLanguage].txtDatesOther);

	abContactRef.find('[data-type="phone_txt"]').text(localization[globalInterfaceLanguage].txtPhone);
	abContactRef.find('[data-type="\\%phone"]').find('input[data-type="value"]').attr('placeholder',localization[globalInterfaceLanguage].pholderPhoneVal);
	abContactRef.find('[data-type="\\%phone"]').find('[data-type="work"]').text(localization[globalInterfaceLanguage].txtPhoneWork);
	abContactRef.find('[data-type="\\%phone"]').find('[data-type="home"]').text(localization[globalInterfaceLanguage].txtPhoneHome);
	abContactRef.find('[data-type="\\%phone"]').find('[data-type="cell"]').text(localization[globalInterfaceLanguage].txtPhoneCell);
	abContactRef.find('[data-type="\\%phone"]').find('[data-type="cell,work"]').text(localization[globalInterfaceLanguage].txtPhoneCellWork);
	abContactRef.find('[data-type="\\%phone"]').find('[data-type="cell,home"]').text(localization[globalInterfaceLanguage].txtPhoneCellHome);
	abContactRef.find('[data-type="\\%phone"]').find('[data-type="main"]').text(localization[globalInterfaceLanguage].txtPhoneMain);
	abContactRef.find('[data-type="\\%phone"]').find('[data-type="pager"]').text(localization[globalInterfaceLanguage].txtPhonePager);
	abContactRef.find('[data-type="\\%phone"]').find('[data-type="fax"]').text(localization[globalInterfaceLanguage].txtPhoneFax);
	abContactRef.find('[data-type="\\%phone"]').find('[data-type="fax,work"]').text(localization[globalInterfaceLanguage].txtPhoneFaxWork);
	abContactRef.find('[data-type="\\%phone"]').find('[data-type="fax,home"]').text(localization[globalInterfaceLanguage].txtPhoneFaxHome);
	abContactRef.find('[data-type="\\%phone"]').find('[data-type="iphone"]').text(localization[globalInterfaceLanguage].txtPhoneIphone);
	abContactRef.find('[data-type="\\%phone"]').find('[data-type="other"]').text(localization[globalInterfaceLanguage].txtPhoneOther);

	abContactRef.find('[data-type="email_txt"]').text(localization[globalInterfaceLanguage].txtEmail);
	abContactRef.find('[data-type="\\%email"]').find('input[data-type="value"]').attr('placeholder',localization[globalInterfaceLanguage].pholderEmailVal);
	abContactRef.find('[data-type="\\%email"]').find('[data-type="internet,work"]').text(localization[globalInterfaceLanguage].txtEmailWork);
	abContactRef.find('[data-type="\\%email"]').find('[data-type="home,internet"]').text(localization[globalInterfaceLanguage].txtEmailHome);
	abContactRef.find('[data-type="\\%email"]').find('[data-type=":mobileme:,internet"]').text(localization[globalInterfaceLanguage].txtEmailMobileme);
	abContactRef.find('[data-type="\\%email"]').find('[data-type=":_$!<other>!$_:,internet"]').text(localization[globalInterfaceLanguage].txtEmailOther);

	abContactRef.find('[data-type="url_txt"]').text(localization[globalInterfaceLanguage].txtUrl);
	abContactRef.find('[data-type="\\%url"]').find('input[data-type="value"]').attr('placeholder',localization[globalInterfaceLanguage].pholderUrlVal);
	abContactRef.find('[data-type="\\%url"]').find('[data-type="work"]').text(localization[globalInterfaceLanguage].txtUrlWork);
	abContactRef.find('[data-type="\\%url"]').find('[data-type="home"]').text(localization[globalInterfaceLanguage].txtUrlHome);
	abContactRef.find('[data-type="\\%url"]').find('[data-type=":_$!<homepage>!$_:"]').text(localization[globalInterfaceLanguage].txtUrlHomepage);
	abContactRef.find('[data-type="\\%url"]').find('[data-type=":_$!<other>!$_:"]').text(localization[globalInterfaceLanguage].txtUrlOther);

	abContactRef.find('[data-type="related_txt"]').text(localization[globalInterfaceLanguage].txtRelated);
	abContactRef.find('[data-type="\\%person"]').find('input[data-type="value"]').attr('placeholder',localization[globalInterfaceLanguage].pholderRelatedVal);
	abContactRef.find('[data-type="\\%person"]').find('[data-type=":_$!<manager>!$_:"]').text(localization[globalInterfaceLanguage].txtRelatedManager);
	abContactRef.find('[data-type="\\%person"]').find('[data-type=":_$!<assistant>!$_:"]').text(localization[globalInterfaceLanguage].txtRelatedAssistant);
	abContactRef.find('[data-type="\\%person"]').find('[data-type=":_$!<father>!$_:"]').text(localization[globalInterfaceLanguage].txtRelatedFather);
	abContactRef.find('[data-type="\\%person"]').find('[data-type=":_$!<mother>!$_:"]').text(localization[globalInterfaceLanguage].txtRelatedMother);
	abContactRef.find('[data-type="\\%person"]').find('[data-type=":_$!<parent>!$_:"]').text(localization[globalInterfaceLanguage].txtRelatedParent);
	abContactRef.find('[data-type="\\%person"]').find('[data-type=":_$!<brother>!$_:"]').text(localization[globalInterfaceLanguage].txtRelatedBrother);
	abContactRef.find('[data-type="\\%person"]').find('[data-type=":_$!<sister>!$_:"]').text(localization[globalInterfaceLanguage].txtRelatedSister);
	abContactRef.find('[data-type="\\%person"]').find('[data-type=":_$!<child>!$_:"]').text(localization[globalInterfaceLanguage].txtRelatedChild);
	abContactRef.find('[data-type="\\%person"]').find('[data-type=":_$!<friend>!$_:"]').text(localization[globalInterfaceLanguage].txtRelatedFriend);
	abContactRef.find('[data-type="\\%person"]').find('[data-type=":_$!<spouse>!$_:"]').text(localization[globalInterfaceLanguage].txtRelatedSpouse);
	abContactRef.find('[data-type="\\%person"]').find('[data-type=":_$!<partner>!$_:"]').text(localization[globalInterfaceLanguage].txtRelatedPartner);
	abContactRef.find('[data-type="\\%person"]').find('[data-type=":_$!<other>!$_:"]').text(localization[globalInterfaceLanguage].txtRelatedOther);

	abContactRef.find('[data-type="im_txt"]').text(localization[globalInterfaceLanguage].txtIm);
	abContactRef.find('[data-type="\\%im"]').find('input[data-type="value"]').attr('placeholder',localization[globalInterfaceLanguage].pholderImVal);
	abContactRef.find('[data-type="\\%im"]').find('[data-type="work"]').text(localization[globalInterfaceLanguage].txtImWork);
	abContactRef.find('[data-type="\\%im"]').find('[data-type="home"]').text(localization[globalInterfaceLanguage].txtImHome);
	abContactRef.find('[data-type="\\%im"]').find('[data-type=":mobileme:"]').text(localization[globalInterfaceLanguage].txtImMobileme);
	abContactRef.find('[data-type="\\%im"]').find('[data-type=":_$!<other>!$_:"]').text(localization[globalInterfaceLanguage].txtImOther);
	abContactRef.find('[data-type="\\%im"]').find('[data-type="aim"]').text(localization[globalInterfaceLanguage].txtImProtAim);
	abContactRef.find('[data-type="\\%im"]').find('[data-type="icq"]').text(localization[globalInterfaceLanguage].txtImProtIcq);
	abContactRef.find('[data-type="\\%im"]').find('[data-type="irc"]').text(localization[globalInterfaceLanguage].txtImProtIrc);
	abContactRef.find('[data-type="\\%im"]').find('[data-type="jabber"]').text(localization[globalInterfaceLanguage].txtImProtJabber);
	abContactRef.find('[data-type="\\%im"]').find('[data-type="msn"]').text(localization[globalInterfaceLanguage].txtImProtMsn);
	abContactRef.find('[data-type="\\%im"]').find('[data-type="yahoo"]').text(localization[globalInterfaceLanguage].txtImProtYahoo);
	abContactRef.find('[data-type="\\%im"]').find('[data-type="facebook"]').text(localization[globalInterfaceLanguage].txtImProtFacebook);
	abContactRef.find('[data-type="\\%im"]').find('[data-type="gadugadu"]').text(localization[globalInterfaceLanguage].txtImProtGadugadu);
	abContactRef.find('[data-type="\\%im"]').find('[data-type="googletalk"]').text(localization[globalInterfaceLanguage].txtImProtGoogletalk);
	abContactRef.find('[data-type="\\%im"]').find('[data-type="qq"]').text(localization[globalInterfaceLanguage].txtImProtQq);
	abContactRef.find('[data-type="\\%im"]').find('[data-type="skype"]').text(localization[globalInterfaceLanguage].txtImProtSkype);

	abContactRef.find('[data-type="profile_txt"]').text(localization[globalInterfaceLanguage].txtProfile);
	abContactRef.find('[data-type="\\%profile"]').find('input[data-type="value"]').attr('placeholder',localization[globalInterfaceLanguage].pholderProfileVal);
	abContactRef.find('[data-type="\\%profile"]').find('[data-type="twitter"]').text(localization[globalInterfaceLanguage].txtProfileTwitter);
	abContactRef.find('[data-type="\\%profile"]').find('[data-type="facebook"]').text(localization[globalInterfaceLanguage].txtProfileFacebook);
	abContactRef.find('[data-type="\\%profile"]').find('[data-type="flickr"]').text(localization[globalInterfaceLanguage].txtProfileFlickr);
	abContactRef.find('[data-type="\\%profile"]').find('[data-type="linkedin"]').text(localization[globalInterfaceLanguage].txtProfileLinkedin);
	abContactRef.find('[data-type="\\%profile"]').find('[data-type="myspace"]').text(localization[globalInterfaceLanguage].txtProfileMyspace);
	abContactRef.find('[data-type="\\%profile"]').find('[data-type="sinaweibo"]').text(localization[globalInterfaceLanguage].txtProfileSinaweibo);

	abContactRef.find('[data-type="address_txt"]').text(localization[globalInterfaceLanguage].txtAddress);
	abContactRef.find('[data-type="\\%address"]').find('[data-type="work"]').text(localization[globalInterfaceLanguage].txtAddressWork);
	abContactRef.find('[data-type="\\%address"]').find('[data-type="home"]').text(localization[globalInterfaceLanguage].txtAddressHome);
	abContactRef.find('[data-type="\\%address"]').find('[data-type=":_$!<other>!$_:"]').text(localization[globalInterfaceLanguage].txtAddressOther);

	abContactRef.find('[data-type="categories_txt"]').text(localization[globalInterfaceLanguage].txtCategories);

	abContactRef.find('[data-type="note_txt"]').text(localization[globalInterfaceLanguage].txtNote);
	abContactRef.find('[data-type="\\%note"]').find('textarea[data-type="value"]').attr('placeholder',localization[globalInterfaceLanguage].pholderNoteVal);

	abContactRef.find('[data-type="edit"]').val(localization[globalInterfaceLanguage].buttonEdit);
	abContactRef.find('[data-type="add_contact"]').val(localization[globalInterfaceLanguage].altAddContact);
	abContactRef.find('[data-type="save"]').val(localization[globalInterfaceLanguage].buttonSave);
	abContactRef.find('[data-type="cancel"]').val(localization[globalInterfaceLanguage].buttonCancel);
	abContactRef.find('[data-type="delete_from_group"]').val(localization[globalInterfaceLanguage].buttonDeleteFromGroup);
	abContactRef.find('[data-type="delete"]').val(localization[globalInterfaceLanguage].buttonDelete);

	// hook for extension specific localization
	if(typeof(globalContactsExtLocalize)=='function')
		globalContactsExtLocalize(abContactRef);

	globalTranslCardDAVListTemplate=$('#ResourceCardDAVListTemplate').clone();
	globalTranslCardDAVListHeader=globalTranslCardDAVListTemplate.find('.resourceCardDAV_header').clone();
	globalTranslCardDAVListItem=globalTranslCardDAVListTemplate.find('.resourceCardDAV_item').clone();

	globalTranslVcardTemplate=$('#vCardTemplate').contents().clone();

	// CUSTOM PLACEHOLDER (initialization for the whole page)
	$('input[placeholder],textarea[placeholder]').placeholder();
}

function processEditorElements(inputEditorRef, processingType, inputIsReadonly, inputIsCompany)
{
	var cssShowAsTxtClass='element_show_as_text';
	var cssGrayedTxt='element_grayed';
	var cssElementNoDisplay='element_no_display';
	var cssElementHide='element_hide';

	var tmp_ref=inputEditorRef;

	if(processingType=='hide')
	{
		tmp_ref.attr('data-editor-state', 'show');
		var disabled=true;
		var readonly=true;
	}
	else
	{
		tmp_ref.attr('data-editor-state', 'edit');
		var disabled=false;
		var readonly=false;
	}

	var inputLockedElements=[];
	if(typeof(globalContactsExtGetLockedElements)=='function')
		inputLockedElements=globalContactsExtGetLockedElements(inputIsCompany);

	var inputDisabledElements=[];
	if(typeof(globalContactsExtGetDisabledElements)=='function')
		inputDisabledElements=globalContactsExtGetDisabledElements(inputIsCompany);

	// show "drag" border on photo & delete button
	tmp_ref.find('#photo_drag').css('display', (disabled || readonly ? 'none' : 'inline'));
	// if the editor state is "edit" show the "delete" button
	if(!tmp_ref.find('#photo').hasClass('photo_blank'))
		tmp_ref.find('#reset_img').css('display', (disabled || readonly ? 'none': 'inline'));

	// checkboxes
	var tmp=tmp_ref.find('[type="checkbox"]');
	tmp.each(
		function(index,element)
		{
			var tmp=$(element);
			var tmp_data_type=tmp.attr('data-type');
			tmp.prop('disabled', disabled || inputLockedElements.indexOf('[data-type="'+tmp_data_type+'"]')!=-1);
			if(!tmp.prop('checked') && (processingType=='hide' || inputLockedElements.indexOf('[data-type="'+tmp_data_type+'"]')!=-1))
				tmp.parent().addClass(cssGrayedTxt);
			else
				tmp.parent().removeClass(cssGrayedTxt);
		}
	);

	tmp_ref.find('input[data-type^="date_"]').prop('disabled', disabled || readonly);

	// family name, given name, and organization name
	var typeList=['family', 'given', 'middle', 'nickname', 'prefix', 'suffix', 'ph_firstname', 'ph_lastname', 'date_bday', 'tags', 'title', 'department', 'org'];
	for(var i=0; i<typeList.length; i++)
	{
		var elementRef = tmp_ref.find('[data-type="'+typeList[i]+'"]');
		var elementDisabled = inputDisabledElements.indexOf('[data-type="'+typeList[i]+'"]')!=-1 && (processingType=='add' || elementRef.val()=='');
		var elementReadOnly = readonly || inputLockedElements.indexOf('[data-type="'+typeList[i]+'"]')!=-1 || elementDisabled;

		elementRef.prop({'readonly':elementReadOnly, 'disabled':elementDisabled}).toggleClass('non_editable', elementDisabled);
	}

	var tmp_tags_prefix=['#tags'];
	var typeList=new Array({sel: '[data-type="\\%address"]'}, {sel: '[data-type="\\%phone"]'}, {sel: '[data-type="\\%email"]'}, {sel: '[data-type="\\%url"]'}, {sel: '[data-type="\\%date"]'}, {sel: '[data-type="\\%person"]'}, {sel: '[data-type="\\%im"]'}, {sel: '[data-type="\\%profile"]'}, {sel: '[data-type="\\%categories"]'}, {sel: '[data-type="\\%note"]'});
	// hook for extending the list of editor elements
	if(typeof(globalContactsExtGetAdditionalElements)=='function')
	{
		tmp_tags_prefix=tmp_tags_prefix.concat(globalContactsExtGetAdditionalElements('tags'));
		typeList=typeList.concat(globalContactsExtGetAdditionalElements('common'));
	}

	tmp_ref.find('select').prop('disabled', disabled);
	/*************************** BAD HACKS SECTION ***************************/
	if($.browser.msie || $.browser.mozilla)
	{
		var newSVG=$((disabled ? SVG_select_dis : SVG_select)).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': (disabled ? '-22px' : '-19px'), 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug

		//XXXX check this - was $('#ABContact')
		tmp_ref.find('select').parent().find('svg[data-type="select_icon"]').replaceWith($('<div>').append($(newSVG).clone()).html());
	}
	/*************************** END OF BAD HACKS SECTION ***************************/

	for(var i=0; i<tmp_tags_prefix.length; i++)
	{
		var tmp=tmp_ref.find(tmp_tags_prefix[i]+'_tag');
		tmp.prop('readonly', readonly);
		if(readonly)
			tmp.closest('div.tagsinput').addClass('readonly');
		else
			tmp.closest('div.tagsinput').removeClass('readonly');
	}

	for(var i=0; i<typeList.length; i++)
	{
		var found_non_empty=0;
		var empty = false;
		tmp=tmp_ref.find(typeList[i].sel);

		tmp.each(
			function(index, element)
			{
				var tmp=$(element).find('[data-type="value"]');
				if(tmp.length==0)
					tmp=$(element).find('[data-type="date_value"]');
				var found=0;
				// check if there is any data present (if not, whe hide the element)
				if($(element).attr('data-type')=='%address')	// address is handled specially
					tmp.each(
						function(index,element)
						{
							if($(element).attr('data-addr-field')!='' && $(element).attr('data-addr-field')!='country' && $(element).val()!='')
							{
								found=1;
								return false;
							}
						}
					);
				else if(tmp.val()!='')	// other elements (not address)
					found=1;

				if(processingType=='hide')
				{
					if(found)
					{
						$(element).find('[data-type="\\%add"]').find('input[type="image"]').addClass(cssElementNoDisplay);
						$(element).find('[data-type="\\%del"]').find('input[type="image"]').addClass(cssElementNoDisplay);
						$(element).find('select').prop('disabled', disabled);
						$(element).find('textarea').prop('disabled', disabled);
						/*************************** BAD HACKS SECTION ***************************/
						if($.browser.msie || $.browser.mozilla)
						{
							var newSVG=$((disabled ? SVG_select_dis : SVG_select)).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': (disabled ? '-22px' : '-19px'), 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug

							//XXXX check this - was $('#ABContact')
							$(element).find('svg[data-type="select_icon"]').replaceWith($('<div>').append($(newSVG).clone()).html());
						}
						/*************************** END OF BAD HACKS SECTION ***************************/
						tmp.prop('readonly', readonly);
						found_non_empty=1;
					}
					else
						$(element).addClass(cssElementNoDisplay);
				}
				else	// 'show'
				{
					empty = empty || $(element).hasClass(cssElementNoDisplay);

					$(element).removeClass(cssElementNoDisplay);
					$(element).find('[data-type="\\%add"]').find('input[type="image"]').removeClass(cssElementNoDisplay);
					$(element).find('[data-type="\\%del"]').find('input[type="image"]').removeClass(cssElementNoDisplay);
					$(element).find('select').prop('disabled', disabled);
					$(element).find('textarea').prop('disabled', disabled);
					/*************************** BAD HACKS SECTION ***************************/
					if($.browser.msie || $.browser.mozilla)
					{
						var newSVG=$((disabled ? SVG_select_dis : SVG_select)).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': (disabled ? '-22px' : '-19px'), 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug
						//XXXX check this - was $('#ABContact')
						$(element).find('svg[data-type="select_icon"]').replaceWith($('<div>').append($(newSVG).clone()).html());
					}
					/*************************** END OF BAD HACKS SECTION ***************************/
					tmp.prop('readonly', readonly);
				}
			}
		);

		if(processingType==='show' && !empty) {
			if(typeList[i].sel==='[data-type="\\%address"]') {
				tmp.each(function() {
					var street = $(this).find('[data-addr-field="street"]');
					if(street.val()) {
						street.trigger('keyup.street');
					}
				});
			}

			if(typeof globalContactAutoExpand=='undefined' || globalContactAutoExpand!=false)
				tmp.last().find('[data-type="\\%add"]').find('.op').trigger('click');
		}

		// set the visibility of the buttons
		if(processingType=='hide')
		{
			if(inputIsReadonly!=true)
			{
				if(typeof globalGroupContactsByCompanies!='undefined' && globalGroupContactsByCompanies==true && inputIsCompany)
					tmp_ref.find('[data-type="add_contact"]').removeClass(cssElementNoDisplay);
				else
					tmp_ref.find('[data-type="add_contact"]').addClass(cssElementNoDisplay);

				tmp_ref.find('[data-type="edit"]').removeClass(cssElementNoDisplay);
			}
			else
			{
				tmp_ref.find('[data-type="add_contact"]').addClass(cssElementNoDisplay);
				tmp_ref.find('[data-type="edit"]').addClass(cssElementNoDisplay);
			}

			tmp_ref.find('[data-type="save"]').addClass(cssElementNoDisplay);
			tmp_ref.find('[data-type="cancel"]').addClass(cssElementNoDisplay);
			tmp_ref.find('[data-type="delete_from_group"]').addClass(cssElementNoDisplay);
			tmp_ref.find('[data-type="delete"]').addClass(cssElementNoDisplay);
		}
		else if(processingType=='add')
		{
			tmp_ref.find('[data-type="add_contact"]').addClass(cssElementNoDisplay);
			tmp_ref.find('[data-type="edit"]').addClass(cssElementNoDisplay);
			tmp_ref.find('[data-type="save"]').removeClass(cssElementNoDisplay);
			tmp_ref.find('[data-type="cancel"]').removeClass(cssElementNoDisplay);
			tmp_ref.find('[data-type="delete_from_group"]').addClass(cssElementNoDisplay);
			tmp_ref.find('[data-type="delete"]').addClass(cssElementNoDisplay);
		}
		else
		{
			tmp_ref.find('[data-type="add_contact"]').addClass(cssElementNoDisplay);
			tmp_ref.find('[data-type="edit"]').addClass(cssElementNoDisplay);
			tmp_ref.find('[data-type="save"]').removeClass(cssElementNoDisplay);
			tmp_ref.find('[data-type="cancel"]').removeClass(cssElementNoDisplay);
			// show "Delete from Group" only if there is an active contact group

	// XXX we need to use another identificator
	//		if(globalResourceCardDAVList.getLoadedAddressbook().filterUID[globalResourceCardDAVList.getLoadedAddressbook().filterUID.length-1]!='/')
	//			tmp.find('[data-type="delete_from_group"]').removeClass(cssElementNoDisplay);

			tmp_ref.find('[data-type="delete"]').removeClass(cssElementNoDisplay);
		}

		if(!found_non_empty)
		{
			if(processingType=='hide')
				tmp.prev().addClass(cssElementNoDisplay);
			else
				tmp.prev().removeClass(cssElementNoDisplay);
		}
	}

	// set editor "process" hook
	if(typeof(globalContactsExtEditorProcess)=='function')
		globalContactsExtEditorProcess(tmp_ref, 'post', processingType, inputIsCompany);
}

function loadImage(image)
{
	var canvas = $('#photo');
	var canvasElement = canvas.get(0);
	var imageWidth = image.width;
	var imageHeight = image.height;
	var canvasWidth = canvas.width()*globalContactPhotoScaleFactor;
	var canvasHeight = canvas.height()*globalContactPhotoScaleFactor;
	var clipStartX = 0;
	var clipStartY = 0;
	var clipWidth = imageWidth;
	var clipHeight = imageHeight;

	canvasElement.width = canvasWidth;
	canvasElement.height = canvasHeight;

	if(imageWidth-canvasWidth < imageHeight-canvasHeight) {
		var clipLength = Math.ceil((imageHeight-imageWidth/canvasWidth*canvasHeight)/2);
		clipStartY = clipLength;
		clipHeight = imageHeight-clipLength*2;
	}
	else {
		var clipLength = Math.ceil((imageWidth-imageHeight/canvasHeight*canvasWidth)/2);
		clipStartX = clipLength;
		clipWidth = imageWidth-clipLength*2;
	}

	canvasElement.getContext('2d').drawImage(image, clipStartX, clipStartY, clipWidth, clipHeight, 0, 0, canvasWidth, canvasHeight);
	canvas.removeClass('photo_blank');
}

function CardDAVeditor_cleanup(inputLoadEmpty, inputIsCompany)
{
	CardDAVcleanupRegexEnvironment();

	// Cleanup the editor and store reference to the editor object
	globalRefVcardEditor=globalTranslVcardTemplate.clone();
	// cleanup old data form address fields
	globalAddressElementOldData={};

	if(typeof(globalContactsExtEditorProcess)=='function')
		globalContactsExtEditorProcess(globalRefVcardEditor, 'pre', null, inputIsCompany);

	/*************************** BAD HACKS SECTION ***************************/
	/* IE or FF */
	if($.browser.msie || $.browser.mozilla)
	{
		// ADD empty SVG to interface (we will replace it later)
		$('<svg data-type="select_icon"></svg>').css('display', 'none').insertAfter(globalRefVcardEditor.find('select[data-type$="_type"]'));

		if($.browser.msie && parseInt($.browser.version, 10)==10) /* IE 10 (because there are no more conditional comments) */
			globalRefVcardEditor.find('[data-type="\\%note"]').find('textarea[data-type="value"]').text('').attr('placeholder',$('[data-type="\\%note"]').find('textarea[data-type="value"]').attr('placeholder'));
	}
	/*************************** END OF BAD HACKS SECTION ***************************/

	// bind events (see also add_elements())
	// hide the "-" button (we maybe change this in future)
	globalRefVcardEditor.find('[data-type="\\%del"]').css('visibility', 'hidden');

	var tmp_arr=['[data-type="\\%phone"]', '[data-type="\\%email"]', '[data-type="\\%url"]', '[data-type="\\%date"]', '[data-type="\\%person"]', '[data-type="\\%im"]', '[data-type="\\%profile"]', '[data-type="\\%address"]'];
	for(var i=0; i<tmp_arr.length; i++)
	{
		globalABEditorCounter[tmp_arr[i]]=1;	// restart id counters for editor objects
		globalRefVcardEditor.find(tmp_arr[i]+' [data-type="\\%add"] input').data('customSelector', tmp_arr[i]).click(function(){add_element($(this).parent(), $(this).data('customSelector'), $(this).data('customSelector'), '[data-type="\\%add"]','[data-type="\\%del"]', globalABEditorCounter[$(this).data('customSelector')]++);checkContactFormScrollBar();});
		globalRefVcardEditor.find(tmp_arr[i]+' [data-type="\\%del"] input').data('customSelector', tmp_arr[i]).click(function(){del_element($(this).parent(), $(this).data('customSelector'), '[data-type="\\%add"]','[data-type="\\%del"]');checkContactFormScrollBar();});
		if(typeof globalContactAutoExpand=='undefined' || globalContactAutoExpand!=false)
		{
			globalRefVcardEditor.find(tmp_arr[i]+' input[type="text"]').bind('keyup', function() {
				var el = $(this);
				var row = el.closest('tr[data-type^="%"]');
				var isLast = row.attr('data-type')!==row.next().attr('data-type');

				if(isLast && el.val()) {
					row.find('[data-type="\\%add"] input').trigger('click');
				}
			});
		}
		//globalRefVcardEditor.find(tmp_arr[i]).children().filter('[data-type="\\%add"]').click();
	}
	// one special thing for address
	globalRefVcardEditor.find('[data-type="\\%address"] [data-type="country_type"]').change(function(){set_address_country(this);checkContactFormScrollBar();});

	var tmp=globalRefVcardEditor.find('[data-type="\\%address"]');
	var tmp_select=tmp.find('[data-type="country_type"]').attr('data-autoselect');
	if(tmp_select!='')
	{
		tmp.find('[data-type="country_type"]').children('[data-type="'+jqueryEscapeSelector(tmp_select)+'"]').prop('selected', true);
		tmp.find('[data-autoselect]').change();
	}

	globalRefVcardEditor.find('[data-type="custom_value"]').bind('keyup change', function(){
		$(this).parent().find('[data-type="invalid"]').css('display', (vCard.pre['custom_type'].test($(this).val()) ? 'none' : 'inline'));
	});

	// init image uploader
	globalRefVcardEditor.find('.photo_div').bind('dragover dragenter', function(event){
		event.stopPropagation();
		event.preventDefault();

		// allow image manipulation only if the editor is in "edit" state
		if($('#vCardEditor').attr('data-editor-state')!="edit")
			return false;

		event.originalEvent.dataTransfer.dropEffect='copy'; // explicitly show this is a copy
	});

	globalRefVcardEditor.find('.photo_div').bind('drop', function(event) {
		process_image(event);
	});

	globalRefVcardEditor.find('#upload_file').bind('change', function(event) {
		process_image(event);
	});

	globalRefVcardEditor.find('#photoBoxButton').bind('click', function(event) {
		var photo = $('#photoURL').val();
		var newImg = new Image();
		newImg.src = photo;
		newImg.onload = function() {
			// show the image "delete" button
			$('#reset_img').css('display', 'inline');
			// remove the template related to previous image (start with clean one)
			vCard.tplM['contentline_PHOTO'][0]=null;

			$('#photoURLHidden').val($('#photoURL').val());

			loadImage(this);
			hidePhotoBox();
		};
		newImg.onerror = function() {
			$('#photoURL').addClass('invalid');
			$('#photoBoxContent').find('[data-type="invalid"]').css('display', 'inline');
		};
	});

	// initialize tagsinput
	globalRefVcardEditor.find('#tags').tagsInput({
		'height': null,
		'width': '530px',
		'color': '#2d2d2d',
		'placeholderColor': '#e0e0e0',
		'useNativePlaceholder': true,
		'defaultText': localization[globalInterfaceLanguage].addCategory,
		'delimiter': ',',
		'allowDelimiterInValue': true,	// if true delimiter is escaped with '\' ('\' is escaped as '\\')
		'trimInput': false,
		'autocomplete_url': globalAddressbookList.getABCategories(true),
		'autocomplete': {
			'autoFocus': true,
			'minLength': 0
		},
		'onChange' : function(tag, tagImported)
		{
			// copy the array
			var xList=globalAddressbookList.getABCategories(true);
			var currentTags=$(this).val().splitCustom(',');
			for(var i=xList.length-1; i>=0; i--)
			{
				for(var j=0; j<currentTags.length; j++)
					if(xList[i] == currentTags[j])
						xList.splice(i, 1);
			}
			$('#tags_tag').autocomplete('option', 'source', xList);

			checkContactFormScrollBar();
		}
	});

	// initialize datepicker
	globalRefVcardEditor.find('input[data-type^="date_"]').focus(function(){initDatePicker($(this));});

	/*************************** BAD HACKS SECTION ***************************/
	if($.browser.msie && parseInt($.browser.version, 10)==10)	/* IE 10 (because there are no more conditional comments) */
		globalRefVcardEditor.find('#tags_tag').css({'padding-top': '1px', 'padding-left': '1px'});
	/*************************** END OF BAD HACKS SECTION ***************************/

	globalRefVcardEditor.find('[data-type="org"]').autocomplete({'source': function(request, response){var matcher=RegExp($.ui.autocomplete.escapeRegex(request.term), 'i'); response($.grep(globalAddressbookList.getABCompanies(true), function(value){value=value.label || value.value || value; return matcher.test(value) || matcher.test(value.multiReplace(globalSearchTransformAlphabet));}));}, 'minLength': 0, 'change': function(){$('[data-type="department"]').autocomplete({'source': function(request, response){var matcher=RegExp($.ui.autocomplete.escapeRegex(request.term), 'i'); response($.grep(globalAddressbookList.getABCompanyDepartments($('#vCardEditor').find('[data-type="org"]').val()), function(value){value=value.label || value.value || value; return matcher.test(value) || matcher.test(value.multiReplace(globalSearchTransformAlphabet));}));}, 'minLength': 0})}});

/*
	globalABListTop=globalRefABList.offset().top;
	globalABListLeft=globalRefABList.offset().left;

	// rewrite it and use:
	// var start=document.elementFromPoint(globalABListLeft, globalABListTop);
	globalLastScrollPos=0;	// move to the main.js

	globalRefABList.scroll(function(e){
		globalRefABListTable.children('.ablist_header:visible').each(function(index, element){
			var headerWidth=$(element).outerWidth();
			var headerHeight=$(element).outerHeight();
			var floating_elem=$('#SystemCardDavMATE > .ablist_header');

			if(globalLastScrollPos<=globalRefABList.scrollTop())	// scrolling DOWN
			{
				var next_h=$(element).nextAll('.ablist_header:visible').first();	// next visible header
				if(next_h!=null && next_h.offset().top>globalABListTop)	// only if it is below to #ABList do action
				{
					var cloned=$(element).clone();
					// do not create the floating header with the same text twice
					if(floating_elem.filter(':contains("'+jqueryEscapeSelector(cloned.text())+'")').length==0)
					{
						// parameters for the fixed element
						cloned.css({'top': globalABListTop, 'left': globalABListLeft, 'width': headerWidth, 'position': 'fixed', 'z-index': 1});
						// remove the previous floating header
						floating_elem.remove();

						// set the opacity back to standard value (item is invisible scrolled above the ABlist top)
						globalRefABListTable.children('.ablist_header').each(function(index,element){
							if($(element).css('opacity')=='0'){$(element).css('opacity',0.85);}
						});

						// set the element opacity to 0 and "replace" it with floating element above it
						$(element).css('opacity',0);
						cloned.appendTo('#SystemCardDavMATE');
					}
					// move the previous floating header UP
					if(next_h.offset().top<globalABListTop+headerHeight)	// if next header offset is immediately below to top offset
						floating_elem.css('top',globalABListTop-(globalABListTop+headerHeight-next_h.offset().top));

					return false;
				}
			}
			else	// scrolling UP
			{
				if($(element).offset().top>=globalABListTop)
				{
					var prev_h=$(element).prevAll('.ablist_header').first();
					if(prev_h!=null)	// if there is a previous header in #ABList do action
					{
						var cloned=$(prev_h).clone();
						// do not create the floating header with the same text twice
						if(floating_elem.filter(':contains("'+jqueryEscapeSelector(cloned.text())+'")').length==0)
						{
							// parameters for the fixed element
//							cloned.css('top',globalABListTop-headerHeight);
							cloned.css({'top': Math.min(globalABListTop,$(element).offset().top-headerHeight), 'left': globalABListLeft, 'width': headerWidth, 'position': 'fixed', 'z-index': 1});

							// remove the previous floating header
							floating_elem.remove();

							// set the opacity back to standard value (item is invisible scrolled above the ABlist top)
							globalRefABListTable.children('.ablist_header').each(function(index,element){
								if($(element).css('opacity')=='0'){$(element).css('opacity',0.85);}
							});

							// set the previous element opacity to 0 and "replace" it with floating element above it
							$(prev_h).css('opacity',0);
							cloned.appendTo('#SystemCardDavMATE');
						}
					}
					// move the next floating header DOWN
					if(floating_elem.length!=0 && floating_elem.offset().top<globalABListTop)
						floating_elem.css('top',Math.min(globalABListTop,$(element).offset().top-headerHeight));

					return false;
				}
			}
		});

		globalLastScrollPos=globalRefABList.scrollTop();
	});
*/

	// CUSTOM PLACEHOLDER (initialization for the editor)
	globalRefVcardEditor.find('input[placeholder],textarea[placeholder]').placeholder();
	// enable autosize for textarea elements
	globalRefVcardEditor.find('textarea[data-type="value"]').autosize({defaultStyles: {height: '64', overflow: '', 'overflow-y': '', 'word-wrap': '', resize: 'none'}, callback: function(){checkContactFormScrollBar();}});

	if(inputLoadEmpty==true)
		$('#EditorBox').fadeTo(0, 1);	/* 0 = no animation */

	return globalRefVcardEditor;
}


function animate_message(messageSelector, messageTextSelector, duration, operation)
{
	if(operation==undefined)
		operation='+=';
	var height=$(messageTextSelector).height()+14;
	var animation=400;

	$(messageSelector).animate({'max-height': height+'px', height: (operation==undefined ? '+=' : operation)+height+'px'}, animation, function(){
		if(operation=='+=')
		{
			if(messageSelector=='#ABInMessageEditBox')
			{

				$(messageTextSelector).text(localization[globalInterfaceLanguage][globalDisableAnimationMessageHiding]);
				globalObjectLoading=false
				globalDisableAnimationMessageHiding='';
			}
			else
			setTimeout(function(){
					animate_message(messageSelector, messageTextSelector, 0, '-=');
				}, duration);

		}
	});

	return duration+2*animation;
}

function show_editor_message(inputPosition, inputSetClass, inputMessage, inputDuration)
{
	if(inputPosition==undefined || inputPosition=='in')
	{
		$('#ABContact').scrollTop(0);
		messageSelector='#ABInMessage';
		messageTextSelector='#ABInMessageText';
	}
	else
	{
		messageSelector='#ABMessage';
		messageTextSelector='#ABMessageText';
	}

	$(messageTextSelector).attr('class',inputSetClass);
	$(messageTextSelector).text(inputMessage);
	return animate_message(messageSelector, messageTextSelector, inputDuration);
}

function set_address_country(inputSelectedAddressObj)
{
	var selectedCountry=$(inputSelectedAddressObj).find('option').filter(':selected').attr('data-type');
	var addressElement=$(inputSelectedAddressObj).closest('[data-type="\\%address"]');

	// store the previous data + cleanup the data-addr-fields, placeholders and values
	globalAddressElementOldData = {};

	addressElement.find('[data-addr-fid]').each(
		function(index, element)
		{
			var tmp=$(element).find('input');
			var tmp_field_name=tmp.attr('data-addr-field');

			if(tmp_field_name!=undefined && tmp_field_name!='') {
				if(!globalAddressElementOldData.hasOwnProperty(tmp_field_name)) {
					globalAddressElementOldData[tmp_field_name] = [];
				}

				globalAddressElementOldData[tmp_field_name].push({'value': tmp.val(), 'data-match': tmp.attr('data-match')});
			}

			if(tmp_field_name==='street') {
				tmp.unbind('keyup.street');
			}

			tmp.attr({'data-addr-field': '', 'data-match': '', 'placeholder': ''}).unplaceholder();	// REMOVE CUSTOM PLACEHOLDER
			tmp.val('');

			// set address country "cleanup" hook
			if(typeof(globalContactsExtAddrElemAfterCleanup)=='function')
				globalContactsExtAddrElemAfterCleanup(element);
		}
	);

	addressElement.find('[data-group="street"]').closest('tr[data-type="container"]').not(':first').remove();
	addressElement.find('[data-group]').removeAttr('data-group');

	if(addressTypes[selectedCountry]!=undefined)
		for(var i=1;i<addressTypes[selectedCountry].length;i++)
		{
			if(addressTypes[selectedCountry][i]['type']=='input')
			{
				var tmp=addressElement.find('[data-addr-fid="'+jqueryEscapeSelector(addressTypes[selectedCountry][i]['fid'])+'"]').find('input');
				tmp.attr('data-addr-field',addressTypes[selectedCountry][i]['data-addr-field']);
				tmp.attr('placeholder',addressTypes[selectedCountry][i]['placeholder']);

				if(addressTypes[selectedCountry][i]['data-addr-field']==='street') {
					tmp.closest('tr[data-type="container"]').attr('data-group', 'street');

					tmp.bind('keyup.street', function() {
						var el = $(this);
						var row = el.closest('tr[data-type="container"]');
						var isLast = row.attr('data-group')!==row.next().attr('data-group');

						if(isLast && el.val()) {
							row.clone(true).insertAfter(row).find('input').val('');
						}
					});
				}

				// here we restore the data from globalAddressElementOldData variable
				if(globalAddressElementOldData.hasOwnProperty(addressTypes[selectedCountry][i]['data-addr-field'])) {
					for(var j=0; j<globalAddressElementOldData[addressTypes[selectedCountry][i]['data-addr-field']].length; j++) {
						tmp = addressElement.find('[data-addr-fid="'+jqueryEscapeSelector(addressTypes[selectedCountry][i]['fid'])+'"]').find('input').last();
						tmp.val(globalAddressElementOldData[addressTypes[selectedCountry][i]['data-addr-field']][j]['value']);
						tmp.trigger('keyup.street');
					};
				}
			}
			else if(addressTypes[selectedCountry][i]['type']=='country')
			{
				var tmp=addressElement.find('[data-type="\\%country_container"]');
				tmp.find('select').find('option[data-type]').prop('selected', false);
				tmp.find('select').find('option[data-type="'+jqueryEscapeSelector(selectedCountry)+'"]').prop('selected', true);

				// the country selector is in wrong container -> we need to move it
				if(addressTypes[selectedCountry][i]['fid']!=tmp.closest('[data-addr-fid]').attr('data-addr-fid'))
					$(addressElement).find('[data-addr-fid="'+jqueryEscapeSelector(addressTypes[selectedCountry][i]['fid'])+'"]').append(tmp);
			}

			// set address country "update" hook
			if(typeof(globalContactsExtAddrElemAfterUpdate)=='function')
				globalContactsExtAddrElemAfterUpdate(addressElement, addressTypes[selectedCountry][i]);
		}

	// hide the unused fields by changing the CSS
	addressElement.find('[data-type="container"]').each(
		function(index,element)
		{
			var found=0;
			$(element).find('[data-addr-field]').each(
				function(index,element)
				{
					if($(element).attr('data-addr-field')!='')
					{
						found=1;
						return false;
					}
				}
			);

			if(found)
				$(element).removeClass('element_no_display_af');
			else
				$(element).addClass('element_no_display_af');
		}
	);

	// CUSTOM PLACEHOLDER (reinitialization due to possible placeholder value change)
	addressElement.find('input[data-type="value"][placeholder],textarea[data-type="value"][placeholder]').placeholder();
}

function add_element(inputElementID, inputParentSelector, newElementSelector, inputAddClassSelector, inputDelClassSelector, newElementID) // note: newElementSelector is always used with .last()
{
	// we assume that the new element is inputElementID.parent() to minimize then number of selectors!
	var newElement=inputElementID.parent().clone().wrap('<div>');	// wrap('<div>') is used because we use .find() which not searches the "self"
	// disable the "add" button on the current element (do not move above)
	inputElementID.filter(inputAddClassSelector).css('visibility', 'hidden');

	// CUSTOM PLACEHOLDER
	// remove the "placeholder" data (custom placeholder label for IE)
	newElement.find('label').remove();
	newElement.find('[data-type="date_value"],[data-type="value"]').removeAttr('id', '').removeClass('placeholder-input');

	// unselect each selected element
	newElement.find('option').prop('selected', false);
	// remove the form values
	newElement.find('[data-type$="value"], [data-type$="date_value"]').val('');
	// hide custom types
	newElement.find('[data-type="custom_span"]').css('display', 'none');
	// get the current data-id value
	var prevID=newElement.attr("data-id");
	// add the new data-id value
	newElement.attr("data-id", newElementID);

	// add element "before insert" hook
	if(typeof(globalContactsExtAddElemBeforeInsert)=='function')
		globalContactsExtAddElemBeforeInsert(newElement);

	// add the new element (with enabled "add" button) + store the reference to the current element
	var tmpRef=inputElementID.parent().after(newElement);
	// enable the "del" button on this and the previous element
	tmpRef.next().addBack().find(inputDelClassSelector).css('visibility', '');

	// now we need a reference to the new element
	var tmpRef=tmpRef.next();
	// CUSTOM PLACEHOLDER
	// enable custom placeholder support (it is enabled only if needed)
	tmpRef.find('input[data-type="value"][placeholder], input[data-type="date_value"][placeholder],textarea[data-type="value"][placeholder]').placeholder();

	// enable autosize for textarea elements
	tmpRef.find('textarea[data-type="value"]').autosize({defaultStyles: {height: '64', overflow: '', 'overflow-y': '', 'word-wrap': '', resize: 'none'}, callback: function(){checkContactFormScrollBar();}});

	//bind datepicker
	if(tmpRef.find('input[data-type="date_value"]').hasClass('hasDatepicker'))
		tmpRef.find('input[data-type="date_value"]').removeClass('hasDatepicker');
	if(tmpRef.find('input[data-type="date_value"]').parent().find('img').css('display')!='none')
		tmpRef.find('input[data-type="date_value"]').parent().find('img').css('display','none')
	tmpRef.find('input[data-type="date_value"]').focus(function(){initDatePicker($(this));});

	// bind events
	var tmp_arr=['[data-type="\\%phone"]', '[data-type="\\%email"]', '[data-type="\\%url"]', '[data-type="\\%date"]', '[data-type="\\%person"]', '[data-type="\\%im"]', '[data-type="\\%profile"]', '[data-type="\\%address"]'];
	if(tmp_arr.indexOf(inputParentSelector)!=-1)
	{

		tmpRef.find('[data-type="\\%add"] input').data('customSelector', inputParentSelector).click(function(){add_element($(this).parent(), $(this).data('customSelector'), $(this).data('customSelector'), '[data-type="\\%add"]','[data-type="\\%del"]', globalABEditorCounter[$(this).data('customSelector')]++);checkContactFormScrollBar();});
		tmpRef.find('[data-type="\\%del"] input').data('customSelector', inputParentSelector).click(function(){del_element($(this).parent(), $(this).data('customSelector'), '[data-type="\\%add"]','[data-type="\\%del"]');checkContactFormScrollBar();});
		if(typeof globalContactAutoExpand=='undefined' || globalContactAutoExpand!=false)
		{
			tmpRef.find('input[type="text"]').bind('keyup', function() {
				var el = $(this);
				var row = el.closest('tr[data-type^="%"]');
				var isLast = row.attr('data-type')!==row.next().attr('data-type');

				if(isLast && el.val()) {
					row.find('[data-type="\\%add"] input').trigger('click');
				}
			});
		}
		// one special thing for address
		if(inputParentSelector=='[data-type="\\%address"]' && tmpRef.attr('data-type')=='%address')
			tmpRef.find('[data-type="country_type"]').change(function(){set_address_country(this);checkContactFormScrollBar();});
	}

	if(inputParentSelector=='[data-type="\\%address"]')
	{
		// execute the "autoselect"
		var tmp=inputElementID.closest(inputParentSelector).next();
		var tmp_select=tmp.find('[data-autoselect]').attr('data-autoselect');
		if(tmp_select!=null)
		{
			tmp.find('[data-type="country_type"]').children('[data-type="'+jqueryEscapeSelector(tmp_select)+'"]').prop('selected', true);
			tmp.find('[data-autoselect]').change();
		}
	}

	tmpRef.find('[data-type="custom_value"]').bind('keyup change', function(){
		$(this).parent().find('[data-type="invalid"]').css('display', (vCard.pre['custom_type'].test($(this).val()) ? 'none' : 'inline'));
	});

	if(typeof(globalContactsExtAddElemAfterInsert)=='function')
		globalContactsExtAddElemAfterInsert(tmpRef, inputDelClassSelector, prevID);

	return true;
}

function del_element(inputElementID, inputParentSelector, inputAddClassSelector, inputDelClassSelector)
{
	// all elements except the last can be removed
	if(inputElementID.closest(inputParentSelector).siblings(inputParentSelector).length>0)
	{
		inputElementID.closest(inputParentSelector).remove();
		// enable the "add" button on last element
		$(inputParentSelector).last().find(inputAddClassSelector).css('visibility', '');
		// hide the "del" button if only one element is present (we maybe change this in future)
		if($(inputParentSelector).length==1)
			$(inputParentSelector).last().find(inputDelClassSelector).css('visibility', 'hidden');
	}
	else	// currently not used because the "-" button is hidden on the last element (we maybe change this in future)
		inputElementID.closest(inputParentSelector).find('input[data-type="value"]').val('');
}

/* BEGIN image manipulation */
function process_image(event)
{
	event.stopPropagation();
	event.preventDefault();

	// allow image manipulation only if the editor is in "edit" state
	if($('#vCardEditor').attr('data-editor-state')!="edit")
		return false;

	if(typeof event.originalEvent.dataTransfer!='undefined')
		var files=event.originalEvent.dataTransfer.files; // fileList object from drag&drop
	else
		var files=event.originalEvent.target.files; // fileList object from input type file

	// files is a FileList of File objects. List some properties.
	for(var i=0;i<files.length;i++)	// we handle only the first picture here ... (see below)
	{
		// only process image files
		if(!files[i].type.match(/image/i))
			continue;

		// do not accept images bigger than 64KiB
		// if(files[i].size>65536)
		// 	continue;

		// show the image "delete" button
		$('#reset_img').css('display', 'inline');
		// remove the template related to previous image (start with clean one)
		vCard.tplM['contentline_PHOTO'][0]=null;

		var reader=new FileReader();
		// closure to capture the file information.
		reader.onload=(function(theFile){
			return function(e){
				//escape(files[i].name), files[i].type, files[i].size, files[i].lastModifiedDate
				var newImg=new Image();
				newImg.src=e.target.result;
				newImg.onload=function(){
					loadImage(this);
				};
			};
		})(files[i]);

		reader.readAsDataURL(files[i]);
		break; // we handle only the first picture here ...
	}

	$('#photoURL, #photoURLHidden').val('');
}
/* END image manipulation */


function hideNotVisibleMessage()
{
	globalAddressbookList.contactToReload=null;
	animate_message('#ABInMessageEditBox', '#ABInMessageTextEditBox', 0, '-=');
	$('#ABInMessageEditBox').css('display','');
}

function initSearchCardDav()
{
	if(globalQs==null)
	{
		$('#SearchBox').find('input[data-type="search"]').keyup(function(){
			globalAddressbookList.contactToReload=null
		});
		globalQs=$('#SearchBox').find('input[data-type="search"]').quicksearch(globalAddressbookList.contacts,
		{
			delay: 250,
			hide: function(){
				var tmp=$(this)[0];
				if(!tmp.headerOnly)
					tmp.search_hide=true;
			},
			show: function(){
				var tmp=$(this)[0];
				if(!tmp.headerOnly)
					tmp.search_hide=false;
			},
			prepareQuery: function (val){
				return val.multiReplace(globalSearchTransformAlphabet).toLowerCase().split(' ');
			},
			onBefore: function(){
				if($('#SearchBox').find('input[data-type="search"]').val()=='')
					$('#SearchBox').find('img[data-type="reset"]').css('display','none');
				else
					$('#SearchBox').find('img[data-type="reset"]').css('display','');
			},
			onAfter: function(){
				globalAddressbookList.applyABFilter(dataGetChecked('#ResourceCardDAVList'),false);
// XXX maybe this was the reason for data-filter-url?
//				globalAddressbookList.applyABFilter(globalRefAddContact.attr('data-filter-url'),false);

	// maybe useful for somebody
	//			if((selected_contact=globalRefABListTable.find('.ablist_item_selected')).length==1)
	//				globalRefABList.scrollTop(globalRefABList.scrollTop()+selected_contact.offset().top-globalRefABList.offset().top-globalRefABList.height()*globalKBNavigationPaddingRate);
			}
		});
	}
}

function initKbAddrNavigation()
{
	$(document.documentElement).keyup(function(event)
	{
		if(typeof globalActiveApp=='undefined' || globalActiveApp!='CardDavMATE')
			return true;

		if(globalActiveApp=='CardDavMATE' && globalObjectLoading==true)
		{
			event.preventDefault();
			return true;
		}

		//if($('#SystemCardDavMATE').css('display')!='none' && $('#ABListLoader').css('display')=='none' && $('#ABListOverlay').css('display')=='none' && !$('input[data-type="search"]').is(':focus'))
		/* XXX - System display:none changes */
		if($('#SystemCardDavMATE').css('visibility')!='hidden' && isCardDAVLoaded && $('#ABListOverlay').css('display')=='none' && !$('input[data-type="search"]').is(':focus'))
		{
			// 37 = left, 38 = up, 39 = right, 40 = down
			var selected_contact=null, next_contact=null;
			if((selected_contact=globalRefABListTable.find('.ablist_item_selected')).length==1)
			{
				if(event.keyCode == 38 && (next_contact=selected_contact.prevAll('.ablist_item').filter(':visible').first()).attr('data-id')!=undefined || event.keyCode == 40 && (next_contact=selected_contact.nextAll('.ablist_item').filter(':visible').first()).attr('data-id')!=undefined)
					globalAddressbookList.loadContactByUID(next_contact.attr('data-id'));
			}
		}
	});

	$(document.documentElement).keydown(function(event)
	{
		if(typeof globalActiveApp=='undefined' || globalActiveApp!='CardDavMATE')
			return true;

		if(globalActiveApp=='CardDavMATE' && globalObjectLoading==true)
		{
			event.preventDefault();
			return true;
		}

		//if($('#SystemCardDavMATE').css('display')!='none' && $('#ABListLoader').css('display')=='none' && $('#ABListOverlay').css('display')=='none' && !$('input[data-type="search"]').is(':focus'))
		/* XXX - System display:none changes */
		if($('#SystemCardDavMATE').css('visibility')!='hidden' && isCardDAVLoaded && $('#ABListOverlay').css('display')=='none' && !$('input[data-type="search"]').is(':focus'))
		{
			// 37 = left, 38 = up, 39 = right, 40 = down
			var selected_contact=null, next_contact=null;
			if((selected_contact=globalRefABListTable.find('.ablist_item_selected')).length==1)
			{
				var wrapperRef = $('.ablist_table_wrapper');

				if(event.keyCode == 38 && (next_contact=selected_contact.prevAll('.ablist_item').filter(':visible').first()).attr('data-id')!=undefined || event.keyCode == 40 &&  (next_contact=selected_contact.nextAll('.ablist_item').filter(':visible').first()).attr('data-id')!=undefined)
				{
					switch(event.keyCode)
					{
						case 38:
							event.preventDefault();
							if(wrapperRef.scrollTop()>wrapperRef.scrollTop()+next_contact.offset().top-wrapperRef.offset().top-wrapperRef.height()*globalKBNavigationPaddingRate)
								wrapperRef.scrollTop(wrapperRef.scrollTop()+next_contact.offset().top-wrapperRef.offset().top-wrapperRef.height()*globalKBNavigationPaddingRate);
							else if(wrapperRef.scrollTop()<wrapperRef.scrollTop()+next_contact.offset().top+next_contact.height()-wrapperRef.offset().top-wrapperRef.height()*(1-globalKBNavigationPaddingRate))	/* contact invisible (scrollbar moved) */
								wrapperRef.scrollTop(wrapperRef.scrollTop()+next_contact.offset().top+next_contact.height()-wrapperRef.offset().top-wrapperRef.height()*(1-globalKBNavigationPaddingRate));
							else
								return false;
							break;
						case 40:
							event.preventDefault();
							if(wrapperRef.scrollTop()<wrapperRef.scrollTop()+next_contact.offset().top+next_contact.height()-wrapperRef.offset().top-wrapperRef.height()*(1-globalKBNavigationPaddingRate))	/* contact invisible (scrollbar moved) */
								wrapperRef.scrollTop(wrapperRef.scrollTop()+next_contact.offset().top+next_contact.height()-wrapperRef.offset().top-wrapperRef.height()*(1-globalKBNavigationPaddingRate));
							else if(wrapperRef.scrollTop()>wrapperRef.scrollTop()+next_contact.offset().top-wrapperRef.offset().top-wrapperRef.height()*globalKBNavigationPaddingRate)
								wrapperRef.scrollTop(wrapperRef.scrollTop()+next_contact.offset().top-wrapperRef.offset().top-wrapperRef.height()*globalKBNavigationPaddingRate);
							else
								return false;
							break;
						default:
							break;
					}
				}
				else	// no previous contact and up pressed || no next contact and down pressed
				{
					switch(event.keyCode)
					{
						case 38:
							wrapperRef.scrollTop(0);
							break;
						case 40:
							wrapperRef.scrollTop(wrapperRef.prop('scrollHeight'));
							break;
						default:
							break;
					}
				}
			}
		}
	});
}

function initDatePicker(inputObject)
{
	if(!inputObject.hasClass('hasDatepicker'))
	{
		inputObject.datepicker({
			disabled: inputObject.prop('readonly') || inputObject.prop('disabled'),
			showMonthAfterYear: true,
			prevText: '',
			nextText: '',
			monthNamesShort: ['01','02','03','04','05','06','07','08','09','10','11','12'],
			dateFormat: globalSettings.datepickerformat.value,
			defaultDate: '-'+Math.round(30*365.25-1),
			minDate: '-120y',
			maxDate: '+0',
			yearRange: 'c-120:+0',
			firstDay: globalSettings.datepickerfirstdayofweek.value,
			weekendDays: globalSettings.weekenddays.value,
			changeMonth: true,
			changeYear: true,
			showAnim: '',
			afterUpdate: function(inst)
			{
				/*************************** BAD HACKS SECTION ***************************/
				// IE and FF datepicker selectbox problem fix
				if($.browser.msie || $.browser.mozilla)
				{
					var calendar=inst.dpDiv;
					setTimeout(function(){
						if($.browser.msie && parseInt($.browser.version, 10)==10)	/* IE 10 */
							calendar.find('select').css({'padding-top': '1px', 'padding-left': '0px', 'padding-right': '0px'});

						var newSVG=$(SVG_select).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-19px', 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug
						calendar.find('select').after($($('<div>').append($(newSVG).clone()).html()));
					},1);
				}
				else if(navigator.platform.toLowerCase().indexOf('win')==0 && $.browser.webkit && !!window.chrome)	/* Chrome on Windows */
				{
					var calendar=inst.dpDiv;
					setTimeout(function(){ calendar.find('select').css({'padding-left': '0px', 'padding-right': '13px'}); },1);
				}
				/*************************** END OF BAD HACKS SECTION ***************************/
			},
			beforeShow: function(input, inst)	// set the datepicker value if the date is out of range (min/max)
			{
				inst.dpDiv.removeClass('ui-datepicker-simple');

				var valid=true;
				try {var currentDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, inputObject.val())}
				catch (e) {valid=false}

				if(valid==true && currentDate!=null)
				{
					var minDateText=inputObject.datepicker('option', 'dateFormat', globalSettings.datepickerformat.value).datepicker('option', 'minDate');
					var maxDateText=inputObject.datepicker('option', 'dateFormat', globalSettings.datepickerformat.value).datepicker('option', 'maxDate');

					var minDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, minDateText);
					var maxDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, maxDateText);

					if(currentDate<minDate)
						inputObject.val(minDateText);
					else if(currentDate>maxDate)
						inputObject.val(maxDateText);
				}

				// Timepicker hack (prevent IE to re-open the datepicker on date click + focus)
				var index=inputObject.attr("data-type");
				var d = new Date();
				if(globalTmpTimePickerHackTime[index]!=undefined && d.getTime()-globalTmpTimePickerHackTime[index]<200)
					return false;
			},
			onClose: function(dateText, inst)	// set the datepicker value if the date is out of range (min/max) and reset the value to proper format (for example 'yy-mm-dd' allows '2000-1-1' -> we need to reset the value to '2000-01-01')
			{
				var valid=true;
				try {var currentDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, dateText)}
				catch (e) {valid=false}

				if(valid==true && currentDate!=null)
				{
					var minDateText=inputObject.datepicker('option', 'dateFormat', globalSettings.datepickerformat.value).datepicker('option', 'minDate');
					var maxDateText=inputObject.datepicker('option', 'dateFormat', globalSettings.datepickerformat.value).datepicker('option', 'maxDate');

					var minDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, minDateText);
					var maxDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, maxDateText);

					if(currentDate<minDate)
						inputObject.val(minDateText);
					else if(currentDate>maxDate)
						inputObject.val(maxDateText);
					else
						inputObject.val($.datepicker.formatDate(globalSettings.datepickerformat.value, currentDate));
				}

				// Timepicker hack (prevent IE to re-open the datepicker on date click + focus)
				var index=inputObject.attr("data-type");
				var d = new Date();
				globalTmpTimePickerHackTime[index]=d.getTime();

				inputObject.focus();

				if(inputObject.closest('tr').attr('data-attr-name')==='X-ABDATE') {
					inputObject.trigger('keyup');
				}
			}
		});

		inputObject.mousedown(function(){
			if(inputObject.datepicker('widget').css('display')=='none')
				inputObject.datepicker('show');
			else
				inputObject.datepicker('hide');
		});

		inputObject.on('keydown', function(event){
			// show datepicker on keydown (up/down/left/right) but only if it not causes cursor position move
			if(this.selectionStart!=undefined && this.selectionStart!=-1)
				if(((event.which==38 || event.which==37) && this.selectionStart==0) || ((event.which==40 || event.which==39) && this.selectionStart==$(this).val().length))
				{
					if(inputObject.datepicker('widget').css('display')=='none')
						inputObject.datepicker('show');
					else
						inputObject.datepicker('hide');
				}
		});

		inputObject.blur(function(event){
			// handle onblur event because datepicker can be already closed
			// note: because onblur is called more than once we can handle it only if there is a value change!
			var valid=true;
			try {var currentDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, inputObject.val())}
			catch (e) {valid=false}

			if(valid==true && inputObject.val()!=$.datepicker.formatDate(globalSettings.datepickerformat.value, currentDate))
			{
				var minDateText=inputObject.datepicker('option', 'dateFormat', globalSettings.datepickerformat.value).datepicker('option', 'minDate');
				var maxDateText=inputObject.datepicker('option', 'dateFormat', globalSettings.datepickerformat.value).datepicker('option', 'maxDate');

				var minDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, minDateText);
				var maxDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, maxDateText);

				if(currentDate<minDate)
					inputObject.val(minDateText);
				else if(currentDate>maxDate)
					inputObject.val(maxDateText);
				else
					inputObject.val($.datepicker.formatDate(globalSettings.datepickerformat.value, currentDate));
			}
		});

		inputObject.on('keyup change', function(){
			if(!$(this).prop('readonly') && !$(this).prop('disabled'))
			{
				var valid=true;

				if($(this).val()!='')
				{
					try {$.datepicker.parseDate(globalSettings.datepickerformat.value, $(this).val())}
					catch (e) {valid=false}
				}

				if(valid)
					$(this).parent().find('img').css('display','none');
				else
					$(this).parent().find('img').css('display','inline');
			}
		});

		// show the datepicker after the initialization
		inputObject.datepicker('show');
	}
}

function checkForVcardGroups(contactUID)
{
	if($('#vCardEditor').attr('data-url')==contactUID)
	{
		var collUID= contactUID.replace(RegExp('[^/]*$'),'');
		var select_elem=$('#vCardEditor').find('[data-attr-name="_DEST_"]').find('[data-type="'+jqueryEscapeSelector(collUID)+'"]');
		if(select_elem.length==1)
		{
			var vGroupC = globalAddressbookList.getMyContactGroups(contactUID).length;
			if(vGroupC>1)
				select_elem.text(localization[globalInterfaceLanguage].txtVcardGroupsTextMulti.replace('%coll%',globalResourceCardDAVList.getCollectionByUID(collUID).displayvalue).replace('%n%',vGroupC));
			else if(vGroupC==1)
				select_elem.text(localization[globalInterfaceLanguage].txtVcardGroupsTextSingle.replace('%coll%',globalResourceCardDAVList.getCollectionByUID(collUID).displayvalue));
		}
	}
}

function checkContactFormScrollBar()
{
	var baseWidth = 582;
	var scrollWidth = $('#EditorBox').length ? $('#ABContact').outerWidth() - $('#EditorBox').outerWidth() : 0;
	var previousWidth = parseInt($('#ABList').css('right'), 10);
	var newWidth = baseWidth+scrollWidth;

	if(previousWidth===newWidth)
		return true;

	$('.collection_d, #SearchBox, #ABList').css('right', newWidth);
	$('#ABListOverlay').css('right', newWidth+1);
	$('.contact_d, #ABMessage, #ABContactOverlay').width(newWidth);
	$('#ABContactColor').css('right', newWidth-3);
	$('#ABContact').width(newWidth-3);

	var columnLengths = [];
	for(var i=0; i<getDataColumnCount(); i++) {
		columnLengths.push([]);
	}

	globalRefABListTable.children('.ablist_item:visible').each(function() {
		$(this).children().slice(globalFixedContactDataColumnsCount).each(function(ind) {
			columnLengths[ind].push($(this).text().length);
		});
	});

	setDataColumnsWidth(columnLengths);
}

function extendDestSelect(selGroup)
{
	if($('#vCardEditor').attr('data-editor-state')=='edit')
		return false;
	var dest = $('[data-attr-name="_DEST_"]');
	$('#ExtendedDest').remove();
	var extendedDest = $('<div id="ExtendedDest">');
	var destSelected = dest.children(':selected');
	var header = null;
	var headerShown = false;
	var currentGroups = typeof $('#vCardEditor').attr('data-vcard-uid')=='undefined' ? [] : globalAddressbookList.getMyContactGroups($('#vCardEditor').attr('data-url'));

	dest.parent().after(extendedDest);
	for(var i=0; i<globalResourceCardDAVList.collections.length; i++) {
		var resource = globalResourceCardDAVList.collections[i];
		if(typeof resource.headerOnly!='undefined' && resource.headerOnly) {
			header = resource;
			headerShown = false;
		}
		else if(typeof resource.makeLoaded!='undefined' && resource.makeLoaded) {
			if(!headerShown) {
				$('<div>').addClass('extended_dest_header').text(header.displayvalue).appendTo(extendedDest);
				headerShown = true;
			}

			var itemEl = $('<div>').addClass('extended_dest_item');
			var resourceEl = $('<div>').addClass('extended_dest_resource').text(resource.displayvalue);
			var groupContEl = $('<div>').addClass('extended_dest_group_container');

			$('<input>').attr({'type':'checkbox','data-id':resource.uid})
				.prop('checked',resource.uid==destSelected.attr('data-type'))
				.change(function(){
					if($(this).prop('checked')) {
						var newCollection = globalResourceCardDAVList.getCollectionByUID($(this).attr('data-id'));
						$(this).parent().parent().siblings().find('input[type="checkbox"]').prop('checked',false);
						dest.children('[data-type="'+newCollection.uid+'"]').prop('selected',true).text(newCollection.displayvalue);
						$('#ABContactColor').css('background-color',newCollection.color);
					}
					else
						$(this).prop('checked',true);
				})
				.prependTo(resourceEl);
			$('<div>').addClass('extended_dest_resource_color').css('background-color',resource.color).prependTo(resourceEl);

			for(var j=0; j<globalAddressbookList.vcard_groups[resource.uid].length; j++) {
				var group = globalAddressbookList.vcard_groups[resource.uid][j];
				var groupEl = $('<div>').addClass('extended_dest_group').text(group.displayvalue);

				$('<input>').attr({'type':'checkbox','data-id':group.uid})
					.prop('checked',currentGroups.indexOf(group.uid)!=-1 || typeof selGroup!= 'undefined' && selGroup==group.uid)
					.change(function(){
						var groupCount = $(this).parent().parent().find('input[type="checkbox"]:checked').length;
						var newCollectionUID = $(this).parent().parent().prev().children('input[type="checkbox"]').attr('data-id');
						var newCollection = globalResourceCardDAVList.getCollectionByUID(newCollectionUID);
						if(groupCount>1)
							dest.children('[data-type="'+newCollectionUID+'"]').text(localization[globalInterfaceLanguage].txtVcardGroupsTextMulti.replace('%coll%',newCollection.displayvalue).replace('%n%',groupCount));
						else if(groupCount==1)
							dest.children('[data-type="'+newCollectionUID+'"]').text(localization[globalInterfaceLanguage].txtVcardGroupsTextSingle.replace('%coll%',newCollection.displayvalue));
						else
							dest.children('[data-type="'+newCollectionUID+'"]').text(newCollection.displayvalue);

						if($(this).prop('checked')) {
							$(this).parent().parent().prev().children('input[type="checkbox"]').prop('checked',true);
							$(this).parent().parent().parent().siblings().find('input[type="checkbox"]').prop('checked',false);
							dest.children('[data-type="'+newCollectionUID+'"]').prop('selected',true);
							$('#ABContactColor').css('background-color',newCollection.color);
						}
					})
					.prependTo(groupEl);
				$('<div>').addClass('extended_dest_group_color').css('background-color',group.color).prependTo(groupEl);

					groupEl.appendTo(groupContEl);
			}

			resourceEl.appendTo(itemEl);
			groupContEl.appendTo(itemEl);
			itemEl.appendTo(extendedDest);
		}
	}

	dest.mousedown(function(e){
		e.stopPropagation();
		e.preventDefault();
		this.blur();

		if(extendedDest.height()>0) {
			dest.removeClass('inverse_select');
			/*************************** BAD HACKS SECTION ***************************/
			if($.browser.msie || $.browser.mozilla)
			{
				var newSVG=$(SVG_select).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-19px', 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug
				dest.parent().find('svg[data-type="select_icon"]').replaceWith($('<div>').append($(newSVG).clone()).html());
			}
			/*************************** END OF BAD HACKS SECTION ***************************/
			extendedDest.animate({'height':0},200);
			$('html').unbind('mousedown');
		}
		else {
			dest.addClass('inverse_select');
			/*************************** BAD HACKS SECTION ***************************/
			if($.browser.msie || $.browser.mozilla)
			{
				var newSVG=$(SVG_select_inv).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-19px', 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug
				dest.parent().find('svg[data-type="select_icon"]').replaceWith($('<div>').append($(newSVG).clone()).html());
			}
			/*************************** END OF BAD HACKS SECTION ***************************/
			extendedDest.animate({'height':164},200);
			$('html').mousedown(function(e){
				if(e.target.id=='ExtendedDest' || $.contains(document.getElementById('ExtendedDest'),e.target))
					return true;

				dest.removeClass('inverse_select');
				/*************************** BAD HACKS SECTION ***************************/
				if($.browser.msie || $.browser.mozilla)
				{
					var newSVG=$(SVG_select).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-19px', 'vertical-align': 'top', 'background-color': '#ffffff'});	// background-color = stupid IE9 bug
					dest.parent().find('svg[data-type="select_icon"]').replaceWith($('<div>').append($(newSVG).clone()).html());
				}
				/*************************** END OF BAD HACKS SECTION ***************************/
				extendedDest.animate({'height':0},200);
				$('html').unbind('mousedown');
			});
		}
	});
}

/*
$(document).on("mouseover", "#vCardEditor .ablist_item", function() {
	if(!$(this).is('.ui-draggable') && (typeof globalDisableDragAndDrop=='undefined' || globalDisableDragAndDrop!=true))
	{
		$(this).draggable({
			delay: 250,
			revert: 'invalid',
			scroll: false,
			opacity: 0.8,
			stack: '#SystemCardDavMATE',
			containment: '#SystemCardDavMATE',
			appendTo: 'body',
			start: function( event, ui ){
				// disallow on read-only collection
				if(globalResourceCardDAVList.getCollectionPrivByUID($(this).attr('data-id').replace(RegExp('[^/]*$'),''))==true)
					return false;
			},
			helper: function(){
				$('#ResourceCardDAVList').find('.resourceCardDAV.ui-droppable').droppable( 'option', 'accept', false);
				$('#ResourceCardDAVList').find('.group.ui-droppable').droppable( 'option', 'accept', false);

				$('#ResourceCardDAVList').find('.resourceCardDAV[data-id!='+jqueryEscapeSelector($(this).attr('data-id').replace(RegExp('[^/]+$'),''))+'].ui-droppable').droppable( 'option', 'accept', '.ablist_item');
				var myContactGroups=globalAddressbookList.getMyContactGroups($(this).attr('data-id'));
				$('#ResourceCardDAVList').find('.group[data-id^='+jqueryEscapeSelector($(this).attr('data-id').replace(RegExp('[^/]+$'),''))+'].ui-droppable').not('.resourceCardDAV_selected').each(function(index, element){
					if(myContactGroups.indexOf($(element).attr('data-id'))==-1)
						$(element).droppable( 'option', 'accept', '.ablist_item');
				});

				var tmp=$(this).clone();
				tmp.addClass('ablist_item_dragged');
				// we cannot use .css() here, because we need to add !important (problem with Gecko based browsers)
				var tmp_style='max-width: '+$(this).outerWidth()+'px;';
				if($(this).css('background-image')!='none')
					tmp_style+='background-image: url(images/company_s_w.svg) !important;';
				tmp.attr('style', tmp_style);

				return tmp;
			}
		});
	}
});
*/

function setDataColumnsWidth(cache) {
	if(!globalRefABListTableCols && !globalRefABListInnerTableCols) {
		return true;
	}

	// remove gutter
	$('.ablist_table_gutter').remove();

	// clear old column widths
	globalRefABListTableCols.width('');
	globalRefABListInnerTableCols.width('');

	// use cached column values to compute new column widths
	var characterWidth = 9; // gross approximation
	var lastColumn = null;
	var lastInnerColumn = null;
	var scrollWidth = $('.ablist_table_wrapper').innerWidth() - globalRefABListTable.outerWidth();
	var reservedWidth = 0;
	globalRefABListTable.children('.ablist_item').first().children().slice(0, globalFixedContactDataColumnsCount).each(function() {
		reservedWidth += $(this).width();
	});
	var availableWidth;
	var maxWidth;
	availableWidth = maxWidth = globalRefABList.innerWidth() - reservedWidth - scrollWidth;

	cache.every(function(lengths, index) {
		// var maxLength = Math.max.apply(null, lengths);
		lengths.sort(function(a, b) {
			return a - b;
		});

		var maxLength = lengths[Math.max(Math.min(Math.ceil(lengths.length * globalContactDataMinVisiblePercentage), lengths.length) - 1, 0)];
		var column = globalRefABListTableCols.eq(index + globalFixedContactDataColumnsCount);
		var innerColumn = globalRefABListInnerTableCols.eq(index + globalFixedContactDataColumnsCount);
		var columnWidth = Math.max(maxLength * characterWidth, getDataColumnMinWidthAtIndex(index));

		// exit early if there is not enough space for the column
		if(columnWidth > availableWidth) {
			// if exiting at the very first column, mark it as the last visible one anyway
			// this will ensure that it gets to occupy what width there is available later on
			if(!lastColumn) {
				lastColumn = column;
			}
			if(!lastInnerColumn) {
				lastInnerColumn = innerColumn;
			}

			return false;
		}

		// dont show column if no data are present
		if(columnWidth && lengths[lengths.length - 1]>0) {
			lastColumn = column;
			lastInnerColumn = innerColumn;
			availableWidth -= columnWidth;
			column.width(columnWidth);
			innerColumn.width(columnWidth);
		}

		return true;
	});

	// set the last visible column to occupy the rest of the available table width
	if(lastColumn && lastInnerColumn) {
		lastColumn.width(lastColumn.width() + availableWidth);
		lastInnerColumn.width(lastInnerColumn.width() + availableWidth);
	}

	// if scrollbar present, create gutter
	if(scrollWidth) {
		$('<col class="ablist_table_gutter">').width(scrollWidth).insertAfter(lastColumn);
		$('<th class="ablist_table_gutter">').insertAfter($('.ablist_table_header').children().eq(lastColumn.index()));
	}
}

function getDataColumnCount() {
	return globalSettings.collectiondisplay.value.length;
}

function isDataColumnDefined(column) {
	var re = RegExp('(?:^|[^\\\\]){'+column+'(?:\\[.*?\\])*'+'}', 'i');

	return globalSettings.collectiondisplay.value.some(function(col) {
		if(col.hasOwnProperty('value')) {
			var values = col.value;

			if($.isPlainObject(values)) {
				return values.company.some(function(value) {
					return re.test(value)
				}) || values.personal.some(function(value) {
					return re.test(value)
				});
			}

			return values.some(function(value) {
				return re.test(value)
			});
		}

		return false;
	});
}

function getContactDataColumns(isCompany) {
	return $.map(globalSettings.collectiondisplay.value, function(col) {
		var value = col.value;

		if($.isPlainObject(value)) {
			if(isCompany && value.hasOwnProperty('company')) {
				return [value.company];
			}
			if(!isCompany && value.hasOwnProperty('personal')) {
				return [value.personal];
			}
		}

		return [value];
	});
}

function getDataColumnLabelAtIndex(index) {
	if(globalSettings.collectiondisplay.value[index].hasOwnProperty('label')) {
		var label = globalSettings.collectiondisplay.value[index].label;

		if($.isPlainObject(label)) {
			return getDataColumnLabel(label[globalInterfaceLanguage] || '');
		}
		else {
			return getDataColumnLabel(label);
		}
	}
}

function getDataColumnLabel(formatString) {
	var result = '';
	var variableParts = null;
	var re = RegExp('(?:^|[^\\\\])({(.*?[^\\\\])})');

	while(variableParts = formatString.match(re)) {
		var value = localization[globalInterfaceLanguage][globalContactDataColumnLabelVars[variableParts[2]]] || '';
		formatString = formatString.replace(variableParts[1], value);
	}

	return formatString;
}

function getDataColumnMinWidthAtIndex(index) {
	return 100;
}

function setContactDataColumn(contact, column, value, filterData) {
	var column = column.toUpperCase();

	if(globalContactDataColumnDefs.hasOwnProperty(column) && value) {
		var property = globalContactDataColumnDefs[column].property;

		if(!contact.hasOwnProperty(property)) {
			contact[property] = [];
		}

		var data = {};

		for(var name in filterData) {
			var filterProperty = globalContactDataColumnDefs[column].filterProperities[name];
			data[filterProperty] = filterData[name];
		}

		if($.isArray(value)) {
			value = value.join(', ');
		}
		data.value = value;

		contact[property].push(data);
	}
}

function getContactDataColumn(contact, variables) {
	var result = '';
	var variableParts = null;
	var re = RegExp('(?:^|[^\\\\])({(.*?[^\\\\])})');

	variables.forEach(function(formatString) {
		var matched = false;

		while(variableParts = formatString.match(re)) {
			var value = getContactDataColumnVariable(contact, variableParts[2]);
			formatString = formatString.replace(variableParts[1], value);
			matched = matched || value!=='';
		}

		if(matched) {
			 result += formatString;
		}
	});

	return result;
}

function getContactDataColumnVariable(contact, variable) {
	var parts = variable.match(/^(.*?)(\[.*\])*$/);
	var attr = parts[1].toUpperCase();

	if(parts && attr && globalContactDataColumnDefs.hasOwnProperty(attr)) {
		var property = globalContactDataColumnDefs[attr].property;

		if(contact.hasOwnProperty(property)) {
			var re = RegExp('\\[(.*?[^\\\\])\\]');
			var numeral = 0;
			var filterStr = parts[2] ? parts[2].toUpperCase() : '';
			var filters = [];
			var matches = contact[property];

			while(filterStr) {
				var match = filterStr.match(re);

				if(match===null) {
					break;
				}

				filters.push(match[1].replaceAll('\\[', '[').replaceAll('\\]', ']'));
				filterStr = filterStr.replace(match[0], '');
			}

			filters.forEach(function(filterEl) {
				if(filterEl[0]===':') {
					numeral = parseInt(filterEl.slice(1), 10);
				}
				else {
					var filterParts = filterEl.splitCustom('=');
					var filterType = filterParts[0];
					var filterValue = filterParts[1];

					if(filterType && filterValue && globalContactDataColumnDefs[attr].hasOwnProperty('filterProperities') && globalContactDataColumnDefs[attr].filterProperities.hasOwnProperty(filterType)) {
						var filterProperty = globalContactDataColumnDefs[attr].filterProperities[filterType];

						matches = matches.filter(function(matchEl) {
							return matchEl[filterProperty].indexOf(filterValue)>-1;
						});
					}
				}
			});

			if(!isNaN(numeral) && numeral>-1 && numeral<matches.length) {
				return matches[numeral].value;
			}
		}
	}

	return '';
}

function getParamsFromContentlineParse(vcard, parsed, primaryParam, customParam, dataTypeRegister, preserveCase) {
	var params = [];

	if(primaryParam && parsed[3]) {
		var parsed_paramArr = vcardSplitValue(parsed[3], ';');

		parsed_paramArr.forEach(function(el) {
			if(el) {
				var elParts = el.split('=');

				if(elParts[0].toUpperCase()===primaryParam) {
					var val = elParts[1];

					if(!preserveCase) {
						val = val.toUpperCase();
					}

					params.push(humanizeVcardDataTypes(dataTypeRegister, val));
				}
			}
		});
	}
	if(customParam && parsed[1]) {
		var vcard_element_related = null;
		var re = RegExp('\r\n'+parsed[1].replace('.','\\.'+customParam+':(.*)')+'\r\n', 'im');
		while((vcard_element_related = vcard.match(re))!=null) {
			var val = vcard_element_related[1];

			if(!preserveCase) {
				val = val.toUpperCase();
			}

			params.push(humanizeVcardDataTypes(dataTypeRegister, vcardUnescapeValue(val)));
			vcard = vcard.replace(vcard_element_related[0], '\r\n');
		}
	}

	return params;
}

function humanizeVcardDataTypes(register, type) {
	if(register && dataTypes[register].hasOwnProperty(type.toLowerCase())) {
		matched = type.match(/^_\$!<(.*)>!\$_$/i);

		if(matched) {
			return matched[1];
		}
	}

	return type;
}

function showPhotoBox(e) {
	if($('#photoBox').is(':visible'))
		hidePhotoBox();
	else
	{
		e.stopPropagation();

		$('#photoArrow, #photoBox').css('display', 'block');
		$('#photoURL').focus();

		$('html').bind('click.photo', function(e) {
			if(!$.contains(document.getElementById('photoBox'), e.target)) {
				hidePhotoBox();
			}
		});
	}
}

function hidePhotoBox() {
	$('#photoURL').val($('#photoURLHidden').val());
	$('#photoBoxContent').find('[data-type="invalid"]').css('display', 'none');
	$('#photoURL').removeClass('invalid');

	$('#photoBox').css('display','none');
	$('#photoArrow').css('display','none');
	$('html').unbind('click.photo');
}
// reorder countries according to localization (returns array becaouse object are unsorted according to ECMA)
function sortCountries(obj)
{
	var arr=[];
	for(var prop in obj)
		if(obj.hasOwnProperty(prop))
			arr.push({'key': prop, 'value': obj[prop], 'translated_value': localization[globalInterfaceLanguage]['txtAddressCountry'+prop.toUpperCase()]});

	return arr.sort(function(a, b){return a.translated_value.customCompare(b.translated_value, globalSortAlphabet, 1, false)});
}
