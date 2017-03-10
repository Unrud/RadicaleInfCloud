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

function handleCalDAVError(isError, inputResource)
{
	var collections='';
	collections=globalResourceCalDAVList.collections;
	for(var i=0; i<collections.length;i++)
	{
		if(collections[i].uid!=undefined)
		{
			var tmp=collections[i].accountUID.match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+)(.*/)','i'));
			var resource_href=tmp[1]+tmp[3]+tmp[4];
			var resource_user=tmp[2];
			if(inputResource.href==resource_href && inputResource.userAuth.userName==resource_user)
			{
				if(globalSettingsSaving =='event' && isError)
				{
					var isLoaded=false;
					if(typeof globalCrossServerSettingsURL!='undefined'&&globalCrossServerSettingsURL!=null&globalCrossServerSettingsURL)
					{
						var uidParts=(collections[i].uid).match(RegExp('/([^/]+/[^/]+/)$'));
						var tmpParts = uidParts[1].match('^(.*/)([^/]+)/$');
						var checkHref=decodeURIComponent(tmpParts[1])+tmpParts[2]+'/';
						var found=false;
						for(var l=0;l<globalSettings.loadedcalendarcollections.value.length;l++)
						{
							var tmpParts2 = globalSettings.loadedcalendarcollections.value[l].match('^(.*/)([^/]+)/([^/]+)/$');
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
						var uidParts=(collections[i].uid).match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@(.*)'));
						var checkHref = uidParts[1]+uidParts[3];
						isLoaded=(globalSettings.loadedcalendarcollections.value.indexOf(checkHref)!=-1);
					}

					if(isLoaded && collections[i].oldSyncToken=='')
					{
						var newObj = $.extend(collections[i],{makeLoaded:true});
						globalResourceCalDAVList.insertResource(newObj, collections[i].resourceIndex, true);
						updateMainLoaderText(collections[i].listType);
						updateMainLoader();
					}
				}
				if(isError)
					$('#ResourceCalDAVList').find('[data-id="'+collections[i].uid+'"]').addClass('r_error');
				else
					$('#ResourceCalDAVList').find('[data-id="'+collections[i].uid+'"]').removeClass('r_error');
			}
		}
	}
	collections=globalResourceCalDAVList.TodoCollections;
	for(var i=0; i<collections.length;i++)
	{
		if(collections[i].uid!=undefined)
		{
			var tmp=collections[i].accountUID.match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+)(.*/)','i'));
			var resource_href=tmp[1]+tmp[3]+tmp[4];
			var resource_user=tmp[2];
			if(inputResource.href==resource_href && inputResource.userAuth.userName==resource_user)
			{
				if(globalSettingsSaving =='todo' && isError)
				{
					var isLoaded=false;
					if(typeof globalCrossServerSettingsURL!='undefined'&&globalCrossServerSettingsURL!=null&globalCrossServerSettingsURL)
					{
						var uidParts=(collections[i].uid).match(RegExp('/([^/]+/[^/]+/)$'));
						var tmpParts = uidParts[1].match('^(.*/)([^/]+)/$');
						var checkHref=decodeURIComponent(tmpParts[1])+tmpParts[2]+'/';
						var found=false;
						for(var l=0;l<globalSettings.loadedtodocollections.value.length;l++)
						{
							var tmpParts2 = globalSettings.loadedtodocollections.value[l].match('^(.*/)([^/]+)/([^/]+)/$');
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
						var uidParts=(collections[i].uid).match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@(.*)'));
						var checkHref = uidParts[1]+uidParts[3];
						isLoaded=(globalSettings.loadedtodocollections.value.indexOf(checkHref)!=-1);
					}
					if(isLoaded && collections[i].oldSyncToken=='')
					{
						var newObj = $.extend(collections[i],{makeLoaded:true});
						globalResourceCalDAVList.insertResource(newObj, collections[i].resourceIndex, false);
						updateMainLoaderText(collections[i].listType);
						updateMainLoader();
					}
				}
				if(isError)
					$('#ResourceCalDAVTODOList').find('[data-id="'+collections[i].uid+'"]').addClass('r_error');
				else
					$('#ResourceCalDAVTODOList').find('[data-id="'+collections[i].uid+'"]').removeClass('r_error');
			}
		}
	}
}

function unloadCalDAVCollection(unloadArray, isEvent)
{
	var collArray = {}, todoString='';
	if(isEvent)
		collArray=globalResourceCalDAVList.collections;
	else
	{
		collArray=globalResourceCalDAVList.TodoCollections;
		todoString='TODO';
	}
	for(var i=0; i<collArray.length; i++)
	{
		if(collArray[i].uid!=undefined)
		{
			var uidParts=(collArray[i].uid).match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@(.*)'));
			var checkHref = uidParts[1]+uidParts[3];
			if(unloadArray.indexOf(checkHref)!=-1)
			{
				$('#CalendarLoader'+todoString).children('.loaderInfo').text(localization[globalInterfaceLanguage].unloadingCalendars);
				if(window['globalVisibleCalDAV'+todoString+'Collections'].indexOf(collArray[i].uid)!=-1)
					window['globalVisibleCalDAV'+todoString+'Collections'].splice(window['globalVisibleCalDAV'+todoString+'Collections'].indexOf(collArray[i].uid),1);
				if(isEvent)
				{
					var beforeScroll = $('#main').width()-$('#calendar').width();
					$('#calendar').fullCalendar('removeEventSource', collArray[i].fcSource);
					var afterScroll = $('#main').width()-$('#calendar').width();
					rerenderCalendar(beforeScroll!=afterScroll);
					globalEventList.events[collArray[i].uid]={};
					globalEventList.displayEventsArray[collArray[i].uid]=new Array();
				}
				else
				{
					var beforeScroll = $('#mainTODO').width()-$('#todoList').width();
					$('#todoList').fullCalendar('removeEventSource', collArray[i].fcSource);
					var afterScroll = $('#mainTODO').width()-$('#todoList').width();
					rerenderTodo(beforeScroll!=afterScroll);
					globalEventList.todos[collArray[i].uid]={};
					globalEventList.displayTodosArray[collArray[i].uid]=new Array();
				}
				collArray[i].fcSource = null;
				collArray[i].someChanged=false;
				collArray[i].makeLoaded=false;
				collArray[i].syncToken='';
				collArray[i].oldSyncToken='';
			}
		}
	}
	if((globalSettingsSaving=='event' || globalSettingsSaving=='todo') && !globalFirstHideLoader)
		setTimeout(function(){hideUnloadCollectionCallback(globalSettingsSaving);},300);
}

function addLoadCalDAVCollection(loadingArray, isEvent)
{
	var collArray = {}, todoString='';
	if(isEvent)
		collArray=globalResourceCalDAVList.collections;
	else
	{
		collArray=globalResourceCalDAVList.TodoCollections;
		todoString='TODO';
	}
	for(var i=0; i<collArray.length; i++)
	{
		if(collArray[i].uid!=undefined)
		{
			var uidParts=(collArray[i].uid).match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@(.*)'));
			var checkHref = uidParts[1]+uidParts[3];
			if(loadingArray.indexOf(checkHref)!=-1&&!collArray[i].makeLoaded)
			{
				collArray[i].urlArray={};
				var resDOMItem=$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV'+todoString+'_item[data-id="'+jqueryEscapeSelector(collArray[i].uid)+'"]');
				collArray[i].someChanged=true;
				collArray[i].makeLoaded=true;

				var rex=vCalendar.pre['accountUidParts'];
				var tmp=collArray[i].accountUID.match(rex);
				var resourceCalDAV_href=tmp[1]+tmp[3]+tmp[4];
				var resourceCalDAV_user=tmp[2];
				for(var j=0;j<globalAccountSettings.length;j++)
					if(globalAccountSettings[j].href==resourceCalDAV_href && globalAccountSettings[j].userAuth.userName==resourceCalDAV_user && globalLoadedPrincipals.indexOf(resourceCalDAV_href)==-1)
					{
						globalLoadedPrincipals.push(globalAccountSettings[j].href);
						break;
					}

				var resDOMHeader=resDOMItem.prevUntil('.resourceCalDAV'+todoString+'_header').last().prev();
				if(!resDOMHeader.length)
					resDOMHeader=resDOMItem.prev();
				resDOMHeader.css('display','block');
				resDOMItem.css('display','');
				var input=resDOMItem.find('input[type=checkbox]').not('.unloadCheck');
				input.prop('checked',true);
				collectionChBoxClick(input.get(0), '#ResourceCalDAV'+todoString+'List', '.resourceCalDAV'+todoString+'_header', '.resourceCalDAV'+todoString+'_item', null, false);
				if(window['globalVisibleCalDAV'+todoString+'Collections'].indexOf(collArray[i].uid)==-1)
					window['globalVisibleCalDAV'+todoString+'Collections'].splice(window['globalVisibleCalDAV'+todoString+'Collections'].length, 0, collArray[i].uid);
				collArray[i].newlyAdded=true;
			}
		}
	}
	var calendarsArray=new Array();
	for(var i=0;i<collArray.length;i++)
		if(collArray[i].uid!=undefined)
			calendarsArray[calendarsArray.length]={displayValue:collArray[i].displayvalue,uid:collArray[i].uid, permissions_read_only:collArray[i].permissions.read_only, makeLoaded:collArray[i].makeLoaded};
	calendarsArray.sort(customResourceCompare);
	globalResourceCalDAVList.sortedCollections = calendarsArray;
}
// ResourceCalDAVList Class
function ResourceCalDAVList()
{
	this.collections=new Array();
	this.TodoCollections=new Array();
	this.calendarsLoaded=null;
	this.counterList=new Array();
	this.sortedTodoCollections=new Array();
	this.sortedCollections=new Array();

	this.reset=function()
	{
		this.TodoCollections.splice(0, this.TodoCollections.length);
		this.collections.splice(0, this.collections.length);
		this.counterList=new Array();
		this.sortedTodoCollections=new Array();
		this.sortedCollections=new Array();
	}

	// resource header value
	this.getHeaderValue=function(inputResource)
	{
		var re=new RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+).*/([^/]*)/','i');
		var tmp=inputResource.accountUID.match(re);
		var tmp_host=tmp[3];	// hostname [%H]
		var tmp_host_wo_port=tmp[3].replace(vCalendar.pre['numberPortRex'],'');	// hostname without port [%h]
		var tmp_domain=tmp_host_wo_port.replace(vCalendar.pre['domainRex'], '');	// domain name [%D]
		var tmp_domain_min=tmp_host_wo_port.match(vCalendar.pre['domainNameRex'])[2];	// domain name min. (only 1 or 2 level domain string) [%d]
		var tmp_principal=decodeURIComponent(tmp[4]);	// principal username [%P]
		var tmp_principal_wo_domain=decodeURIComponent(tmp[4]).replace(vCalendar.pre['principalUserNameRex'],'');	// principal username without @domain.com [%p]
		var tmp_user=inputResource.userAuth.userName;	// login name [%U]
		var tmp_user_wo_domain=inputResource.userAuth.userName.replace(vCalendar.pre['loginRex'],'');	// login name without @domain.com [%u]
		if(!inputResource.subscription && (typeof inputResource.hrefLabel!='string' || inputResource.hrefLabel=='' || (inputResource.hrefLabel=='%x' && inputResource.headervalue=='')))
			inputResource.hrefLabel='%d/%p [%u]';
		else if(inputResource.subscription && (typeof inputResource.hrefLabel!='string' || inputResource.hrefLabel==''))
			inputResource.hrefLabel=localization[globalInterfaceLanguage].txtSubscribed;

		var result=inputResource.hrefLabel;
		result=result.replace(vCalendar.pre['HRex'], tmp_host);
		result=result.replace(vCalendar.pre['hRex'], tmp_host_wo_port);
		result=result.replace(vCalendar.pre['DRex'], tmp_domain);
		result=result.replace(vCalendar.pre['dRex'], tmp_domain_min);
		result=result.replace(vCalendar.pre['PRex'], tmp_principal);
		result=result.replace(vCalendar.pre['pRex'], tmp_principal_wo_domain);
		result=result.replace(vCalendar.pre['URex'], tmp_user);
		result=result.replace(vCalendar.pre['uRex'], tmp_user_wo_domain);
		result=result.replace(vCalendar.pre['xRex'], inputResource.headervalue);
		inputResource.hrefLabel=result;
		return result;
	}

	this.getSortKey=function(inputResource, forHeader, inputResourceIndex)
	{
		var re=new RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+)(.*/)([^/]+/)([^/]+/)([^/]*)','i');
		var tmp=inputResource.uid.match(re);
		var out='';
		if(!inputResource.subscription)
			out='A';
		else
			out='B';

		// custom sorting (instead of alphabetical)
		if(globalSettings.resourcealphabetsorting.value!=true)
			out+=inputResourceIndex.pad(String(globalAccountSettings.length).length);
		out+=tmp[1]+tmp[3]+'/'+(inputResource.hrefLabel==undefined || inputResource.hrefLabel==null ? tmp[5] : inputResource.hrefLabel)+' '+inputResource.userAuth.userName;

		if(forHeader==false)
			out+=' '+inputResource.displayvalue;
		return out;
	}

	// Resource list is not sorted, instead "insert sort" is performed
	this.insertResource=function(inputResource, index, isEvent)
	{
		var oldHrefLabel = inputResource.hrefLabel;
		var headerValue = this.getHeaderValue(inputResource);
		inputResource.sortkey=this.getSortKey(inputResource, false, index);
		var collObject={};
		var todoString = '';
		var makeChecked=false;
		var nameChanged=false;
		if(isEvent)
			collObject = this.collections;
		else
		{
			collObject = this.TodoCollections;
			todoString = 'TODO';
		}
		// do not insert entry with duplicate UID
		for(var i=0;i<collObject.length;i++)
			if(collObject[i].uid==inputResource.uid)
			{
				collObject[i].urlArray={};
				var resDOMItem=$('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV'+todoString+'_item[data-id="'+jqueryEscapeSelector(inputResource.uid)+'"]');
				if(collObject[i].displayvalue==inputResource.displayvalue && collObject[i].permissions.read_only==inputResource.permissions.read_only && collObject[i].headervalue==inputResource.headervalue)
				{
					collObject[i]=$.extend(inputResource, {fcSource: collObject[i].fcSource, syncToken: collObject[i].syncToken, oldSyncToken: collObject[i].oldSyncToken, newlyAdded: collObject[i].newlyAdded,forceSyncPROPFIND: collObject[i].forceSyncPROPFIND});
					return 0;
				}
				else
				{
					nameChanged=true;
					$.extend(inputResource, {fcSource: collObject[i].fcSource, syncToken: collObject[i].syncToken, oldSyncToken: collObject[i].oldSyncToken, newlyAdded: collObject[i].newlyAdded,forceSyncPROPFIND: collObject[i].forceSyncPROPFIND});
					makeChecked=resDOMItem.find('input[type=checkbox]').not('.unloadCheck').prop('checked');
					// the collection name is changed and must be moved to correct place (we first remove it and then reinsert)
					this.removeResource(inputResource.uid, false,isEvent);
					break;
				}
			}

		if(!globalCalDAVInitLoad&&!nameChanged)
		{
			var uidParts=inputResource.uid.match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@(.*)'));
			var checkHref = uidParts[1]+uidParts[3];
			var loadedColl=null;
			var isLoaded=false;
			if(isEvent)
				loadedColl=globalSettings.loadedcalendarcollections.value;
			else
				loadedColl=globalSettings.loadedtodocollections.value;

			if(typeof globalCrossServerSettingsURL!='undefined'&&globalCrossServerSettingsURL!=null&globalCrossServerSettingsURL)
			{
				var uidParts=inputResource.uid.match(RegExp('/([^/]+/[^/]+/)$'));
				var tmpParts = uidParts[1].match('^(.*/)([^/]+)/$');
				var checkHref3=decodeURIComponent(tmpParts[1])+tmpParts[2]+'/';
				var found=false;
				for(var l=0;l<loadedColl.length;l++)
				{
					var tmpParts2 = loadedColl[l].match('^(.*/)([^/]+)/([^/]+)/$');
					var checkHref2=decodeURIComponent(tmpParts2[2])+'/'+tmpParts2[3]+'/';
					if(checkHref3==checkHref2)
					{
						found=true;
						break;
					}
				}
				isLoaded=found;
			}
			else
				isLoaded=(loadedColl.indexOf(checkHref)!=-1);
//			if(!isLoaded)
//				loadedColl.push(checkHref);
			if(!isLoaded)
			{
				inputResource.makeLoaded=false;
				inputResource.newlyAdded=false;
			}
			else
			{
				inputResource.makeLoaded=true;
				inputResource.newlyAdded=true;
			}

			inputResource.oldSyncToken = '';
			inputResource.someChanged=false;
			makeChecked=true;
		}

		// create header
		var headerObject={headerOnly: true,  sortkey: this.getSortKey(inputResource, true, index), displayvalue: (oldHrefLabel=='%x' ? headerValue.replace(RegExp('^[^#]+#'),'') : headerValue), index:0};
		// find the index where to insert the new resource
		// find the index where to insert the new resource O(n*log(n))
		var insertIndex=0;
		var low=0;
		var high=collObject.length-1;
		if(collObject.length>0)
			while(low<high)
			{
				insertIndex=low+Math.round((high-low)/2);
				var result=(cmp_str=collObject[insertIndex].sortkey).customCompare(inputResource.sortkey,globalSortAlphabet,1,false);
				if(result==-1)
				{
					if(insertIndex+1==collObject.length-1 && typeof collObject[insertIndex+1]!='undefined' && (cmp_str=collObject[insertIndex+1].sortkey).customCompare(inputResource.sortkey,globalSortAlphabet,1,false)==-1)
					{
						insertIndex+=2;
						break;
					}
					else
						low=++insertIndex;
				}
				else if(result==1)
				{
					if((cmp_str=collObject[insertIndex-1].sortkey).customCompare(inputResource.sortkey,globalSortAlphabet,1,false)==-1)
						break;
					else
						high=--insertIndex;
				}
			}
		// check for header existence
		var headerMiss=1;
		for(var i=0;i<collObject.length;i++)
			if(collObject[i].headerOnly==true && collObject[i].displayvalue==headerObject.displayvalue)
			{
				headerMiss=0;
				break;
			}
		// insert header if not exists
		if(headerMiss)
		{
			headerObject.index=insertIndex;
			collObject.splice(insertIndex, 0, headerObject);
		}
		// insert the resource
		if(collObject.length==1 && globalCalDAVInitLoad)
			$('#SystemCalDavZAP .fc-header-center ').addClass('r_operate_all');

		this.counterList[inputResource.uid+' '+inputResource.listType]={collectionLength: 0, counter: 0, uid: inputResource.uid, isLoading: false, isSaving: false};
		collObject.splice(insertIndex+headerMiss, 0, inputResource);

		if(!nameChanged)
		{
			if(isEvent)
			{
				globalEventList.displayEventsArray[inputResource.uid]=new Array();
				globalEventList.events[inputResource.uid]={};
			}
			else
			{
				globalEventList.displayTodosArray[inputResource.uid]=new Array();
				globalEventList.todos[inputResource.uid]={};
			}
		}

		var resList = '#ResourceCalDAV'+todoString+'List';
		var resHeader = '.resourceCalDAV'+todoString+'_header';
		var resItem = '.resourceCalDAV'+todoString+'_item';

		if(headerMiss)
		{
			var newElement=$('#ResourceCalDAV'+todoString+'ListTemplate').find('.resourceCalDAV'+todoString+'_header').clone().wrap('<div>');
			newElement.append(headerObject.displayvalue);

			if(todoString=='')
				newElement.find('input[type=checkbox]').attr('onclick','resourceChBoxClick(this, \'#\'+$(this).parent().parent().attr(\'id\'), \''+resHeader+'\', false);if(isCalDAVLoaded && $(this).parent().parent().attr(\'id\')== \'ResourceCalDAV'+todoString+'List\'){$(this).prop(\'checked\')?enableResource($(this).parent()):disableResource($(this).parent());}');
			else
				newElement.find('input[type=checkbox]').attr('onclick','resourceChBoxClick(this, \'#\'+$(this).parent().parent().attr(\'id\'), \''+resHeader+'\', false);if(isCalDAVLoaded && $(this).parent().parent().attr(\'id\')== \'ResourceCalDAV'+todoString+'List\'){$(this).prop(\'checked\')?enableResourceTodo($(this).parent()):disableResourceTodo($(this).parent());}');

			newElement.css('display', 'none');
			newElement=newElement.parent().html();
			$('#ResourceCalDAV'+todoString+'List').children().eq(insertIndex).after(newElement);
		}

		// insert the resource to interface
		var newElement = $('#ResourceCalDAV'+todoString+'ListTemplate').find('.resourceCalDAV'+todoString+'_item').clone().wrap('<div>');
		var par=inputResource.uid.split('/');
		if(inputResource.permissions.read_only)
			newElement.addClass('resourceCalDAV_item_ro');

		newElement.attr('data-id', inputResource.uid);
		if(globalCalDAVInitLoad)
			newElement.addClass('r_operate');

		newElement.html("<div class='resourceCalDAVColor' style='background:"+inputResource.ecolor+"'></div><input type='text' class='colorPicker'/><input type='checkbox' name="+inputResource.uid+" />"+$('<div/>').text(inputResource.displayvalue).html());
		newElement.attr('title', $('<div/>').text(inputResource.displayvalue).html());
		if(todoString=='')
			newElement.find('input[type=checkbox]').attr({'data-id':inputResource.uid, 'onclick':'var evt = arguments[0];evt.stopPropagation();collectionChBoxClick(this, \'#\'+$(this).parent().parent().attr(\'id\'), \''+resHeader+'\', \''+resItem+'\', null, false);if(isCalDAVLoaded && $(this).parent().parent().attr(\'id\')== \'ResourceCalDAV'+todoString+'List\'){$(this).prop(\'checked\')?enableCalendar(\''+inputResource.uid+'\'):disableCalendar(\''+inputResource.uid+'\');}'});
		else
			newElement.find('input[type=checkbox]').attr({'data-id':inputResource.uid, 'onclick':'var evt = arguments[0];evt.stopPropagation();collectionChBoxClick(this, \'#\'+$(this).parent().parent().attr(\'id\'), \''+resHeader+'\', \''+resItem+'\', null, false);if(isCalDAVLoaded && $(this).parent().parent().attr(\'id\')== \'ResourceCalDAV'+todoString+'List\'){$(this).prop(\'checked\')?enableCalendarTodo(\''+inputResource.uid+'\'):disableCalendarTodo(\''+inputResource.uid+'\');}'});

		newElement.click(function(e){
			if(($(this).hasClass('resourceCalDAV_item')&&globalEventCollectionsLoading) || ($(this).hasClass('resourceCalDAVTODO_item')&&globalTodoCollectionsLoading))
				return true;
			if(e.shiftKey) {
				if(isEvent)
					enableOne($(this).attr('data-id'));
				else
					enableOneTodo($(this).attr('data-id'));
			}
			$('#ResourceCalDAV'+todoString+'List .resourceCalDAV_item_selected').removeClass('resourceCalDAV_item_selected');
			$(this).addClass('resourceCalDAV_item_selected');
		});
		if(typeof globalCalendarColorPropertyXmlns== 'undefined' || globalCalendarColorPropertyXmlns== null || globalCalendarColorPropertyXmlns==='' || globalCalendarColorPropertyXmlns!==false)
			bindColorPickerClick(newElement.find('.resourceCalDAVColor'));
		$('#ResourceCalDAV'+todoString+'List').children().eq(insertIndex+headerMiss).after(newElement);
		if(inputResource.makeLoaded)
		{
			var resDOMHeader=newElement.prevUntil('.resourceCalDAV'+todoString+'_header').last().prev();
			if(!resDOMHeader.length)
				resDOMHeader=newElement.prev();
			resDOMHeader.css('display','block');

			var rex=vCalendar.pre['accountUidParts'];
			var tmp=inputResource.accountUID.match(rex);
			var resourceCalDAV_href=tmp[1]+tmp[3]+tmp[4];
			var resourceCalDAV_user=tmp[2];
			for(var i=0;i<globalAccountSettings.length;i++)
				if(globalAccountSettings[i].href==resourceCalDAV_href && globalAccountSettings[i].userAuth.userName==resourceCalDAV_user && globalLoadedPrincipals.indexOf(resourceCalDAV_href)==-1)
				{
					globalLoadedPrincipals.push(globalAccountSettings[i].href);
					break;
				}
		}
		else
			newElement.css('display','none');

		// restore the checked state
		if(makeChecked)
		{
			if(window['globalVisibleCalDAV'+todoString+'Collections'].indexOf(inputResource.uid)==-1)
				window['globalVisibleCalDAV'+todoString+'Collections'].splice(window['globalVisibleCalDAV'+todoString+'Collections'].length, 0, inputResource.uid);
			$('#ResourceCalDAV'+todoString+'List').children().eq(insertIndex+headerMiss+1).find('input[type=checkbox]').prop('checked', true);
		}

		if(!globalCalDAVInitLoad)
			collectionChBoxClick(newElement.find('input[type=checkbox]').get(0), '#ResourceCalDAV'+todoString+'List', '.resourceCalDAV'+todoString+'_header', '.resourceCalDAV'+todoString+'_item', null, false);
	};

	this.removeOldResources=function(inputUidBase, inputTimestamp)
	{
		var tmp=inputUidBase.match(vCalendar.pre['hrefRex']);
		var inputHref=tmp[2];
		for(var i=this.collections.length-1;i>=0;i--)
		{
			if(this.collections[i]!=undefined && !this.collections[i].subscription && this.collections[i].timestamp!=undefined && this.collections[i].uid.indexOf(inputUidBase)==0 && this.collections[i].timestamp<inputTimestamp)
			{
				var uidRemoved=this.collections[i].uid;
				//if(globalEventList.displayEventsArray[uidRemoved].length>0)
				//{
					var beforeScroll = $('#main').width()-$('#calendar').width();
					$('#calendar').fullCalendar('removeEventSource', this.collections[i].fcSource);
					var afterScroll = $('#main').width()-$('#calendar').width();
					rerenderCalendar(beforeScroll!=afterScroll);
				//}
				var item=$('#ResourceCalDAVList').find('.resourceCalDAV_item[data-id^="'+jqueryEscapeSelector(this.collections[i].uid)+'"]');
				var item_header=item.prevUntil('.resourceCalDAV_header').last().prev();
				if(!item_header.length)
					item_header=item.prev();

				item.remove();
				this.collections.splice(i, 1);

				// if next item is undefined or it is a header and the previous item is header delete it
				if((this.collections[i]==undefined || this.collections[i].headerOnly==true) && this.collections[i-1].headerOnly==true)
				{
					item_header.remove();
					this.collections.splice(--i, 1);
				}
				else
				{
					var firstVisibleCollection=null;
					for(var vi=i-1;vi>0;vi--)
					{
						if(this.collections[vi].headerOnly==true)
							break;
						if(this.collections[vi].makeLoaded)
						{
							firstVisibleCollection=this.collections[vi];
							break;
						}
					}
					if(firstVisibleCollection==null)
					{
						for(var vi=i;vi<this.collections.length;vi++)
						{
							if(this.collections[vi].headerOnly==true)
								break;
							if(this.collections[vi].makeLoaded)
							{
								firstVisibleCollection=this.collections[vi];
								break;
							}
						}
					}
					if(firstVisibleCollection==null)
						item_header.css('display','none');
					else
					{
						var triggerInput=$('#ResourceCalDAVList').find('.resourceCalDAV_item[data-id^="'+jqueryEscapeSelector(firstVisibleCollection.uid)+'"]').find('input[type=checkbox]');
						collectionChBoxClick(triggerInput.get(0), '#ResourceCalDAVList', '.resourceCalDAV_header', '.resourceCalDAV_item', null, false);
					}
				}
			}
		}

		for(var i=this.TodoCollections.length-1;i>=0;i--)
		{
			if(this.TodoCollections[i]!=undefined && !this.TodoCollections[i].subscription && this.TodoCollections[i].timestamp!=undefined && this.TodoCollections[i].uid.indexOf(inputUidBase)==0 && this.TodoCollections[i].timestamp<inputTimestamp)
			{
				var uidRemoved=this.TodoCollections[i].uid;
				//if(globalEventList.displayEventsArray[uidRemoved].length>0)
				//{
					var beforeScroll = $('#mainTODO').width()-$('#todoList').width();
					$('#todoList').fullCalendar('removeEventSource', this.TodoCollections[i].fcSource);
					var afterScroll = $('#mainTODO').width()-$('#todoList').width();
					rerenderTodo(beforeScroll!=afterScroll);
				//}
				var item=$('#ResourceCalDAVTODOList').find('.resourceCalDAVTODO_item[data-id^="'+jqueryEscapeSelector(this.TodoCollections[i].uid)+'"]');
				var item_header=item.prevUntil('.resourceCalDAVTODO_header').last().prev();
				if(!item_header.length)
					item_header=item.prev();

				item.remove();
				this.TodoCollections.splice(i, 1);

				// if next item is undefined or it is a header and the previous item is header delete it
				if((this.TodoCollections[i]==undefined || this.TodoCollections[i].headerOnly==true) && this.TodoCollections[i-1].headerOnly==true)
				{
					item_header.remove();
					this.TodoCollections.splice(--i, 1);
				}
				else
				{
					var firstVisibleCollection=null;
					for(var vi=i-1;vi>0;vi--)
					{
						if(this.TodoCollections[vi].headerOnly==true)
							break;
						if(this.TodoCollections[vi].makeLoaded)
						{
							firstVisibleCollection=this.TodoCollections[vi];
							break;
						}
					}
					if(firstVisibleCollection==null)
					{
						for(var vi=i;vi<this.TodoCollections.length;vi++)
						{
							if(this.TodoCollections[vi].headerOnly==true)
								break;
							if(this.TodoCollections[vi].makeLoaded)
							{
								firstVisibleCollection=this.TodoCollections[vi];
								break;
							}
						}
					}
					if(firstVisibleCollection==null)
						item_header.css('display','none');
					else
					{
						var triggerInput=$('#ResourceCalDAVTODOList').find('.resourceCalDAVTODO_item[data-id^="'+jqueryEscapeSelector(firstVisibleCollection.uid)+'"]').find('input[type=checkbox]');
						collectionChBoxClick(triggerInput.get(0), '#ResourceCalDAVTODOList', '.resourceCalDAVTODO_header', '.resourceCalDAVTODO_item', null, false);
					}
				}
			}
		}
	};

	this.removeResource=function(inputUid, loadNext,isEvent)
	{
		if(isEvent)
		{
			for(var i=this.collections.length-1;i>=0;i--)
				if(this.collections[i].uid==inputUid)
				{
					var uidRemoved=this.collections[i].uid;
					var item=$('#ResourceCalDAVList').find('[data-id^="'+jqueryEscapeSelector(this.collections[i].uid)+'"]');
					var item_prev=item.prev();
					item.remove();
					this.collections.splice(i, 1);

					// if next item is undefined or it is a header and the previous item is header delete it
					if((this.collections[i]==undefined || this.collections[i].headerOnly==true) && i>0 && this.collections[i-1].headerOnly==true)
					{
						item_prev.remove();
						this.collections.splice(i, 1);
					}
				}
		}
		else
			for(var i=this.TodoCollections.length-1;i>=0;i--)
				if(this.TodoCollections[i].uid==inputUid)
				{
					var uidRemoved=this.TodoCollections[i].uid;
					var item=$('#ResourceCalDAVTODOList').find('[data-id^="'+jqueryEscapeSelector(this.TodoCollections[i].uid)+'"]');
					var item_prev=item.prev();
					item.remove();
					this.TodoCollections.splice(i, 1);

					// if next item is undefined or it is a header and the previous item is header delete it
					if((this.TodoCollections[i]==undefined || this.TodoCollections[i].headerOnly==true) && i>0 && this.TodoCollections[i-1].headerOnly==true)
					{
						item_prev.remove();
						this.TodoCollections.splice(i, 1);
					}
				}
	};

	this.getCollectionByUID=function(inputUID)
	{
		for(var i=0;i<this.collections.length;i++)
		{
			if(this.collections[i].uid==inputUID)
				return this.collections[i];
		}
		for(var i=0;i<this.TodoCollections.length;i++)
		{
			if(this.TodoCollections[i].uid==inputUID)
				return this.TodoCollections[i];
		}
		return null;
	};

	this.getEventCollectionByUID=function(inputUID)
	{
		for(var i=0;i<this.collections.length;i++)
		{
			if(this.collections[i].uid==inputUID)
				return this.collections[i];
		}
		return null;
	};

	this.getTodoCollectionByUID=function(inputUID)
	{
		for(var i=0;i<this.TodoCollections.length;i++)
		{
			if(this.TodoCollections[i].uid==inputUID)
				return this.TodoCollections[i];
		}
		return null;
	};

	this.getTodoCollectionAndIndexByUID=function(inputUID)
	{
		for(var i=0;i<this.TodoCollections.length;i++)
		{
			if(this.TodoCollections[i].uid==inputUID)
				return {coll:this.TodoCollections[i],index:i};
		}
		return null;
	};

	this.getResources=function()
	{
		return this.collections;
	};

	this.getSyncResourceArray=function()
	{
		return this.syncResourceArray;
	};
}
function handleCardDAVError(isError, inputResource)
{
	var collections='';
	collections=globalResourceCardDAVList.collections;
	for(var i=0; i<collections.length;i++)
	{
		if(collections[i].uid!=undefined)
		{
			var tmp=collections[i].accountUID.match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+)(.*/)','i'));
			var resource_href=tmp[1]+tmp[3]+tmp[4];
			var resource_user=tmp[2];
			if(inputResource.href==resource_href && inputResource.userAuth.userName==resource_user)
			{
				if(globalSettingsSaving =='addressbook' && isError)
				{
					var uidParts=(collections[i].uid).match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@(.*)'));
					var checkHref = uidParts[1]+uidParts[3];
					var isLoaded=false;
					if(typeof globalCrossServerSettingsURL!='undefined'&&globalCrossServerSettingsURL!=null&globalCrossServerSettingsURL)
					{
						var uidParts=(collections[i].uid).match(RegExp('/([^/]+/[^/]+/)$'));
						var tmpParts = uidParts[1].match('^(.*/)([^/]+)/$');
						var checkHref3=decodeURIComponent(tmpParts[1])+tmpParts[2]+'/';
						var found=false;
						for(var l=0;l<globalSettings.loadedaddressbookcollections.value.length;l++)
						{
							var tmpParts2 = globalSettings.loadedaddressbookcollections.value[l].match('^(.*/)([^/]+)/([^/]+)/$');
							var checkHref2=decodeURIComponent(tmpParts2[2])+'/'+tmpParts2[3]+'/';
							if(checkHref3==checkHref2)
							{
								found=true;
								break;
							}
						}
						isLoaded=found;
					}
					else
						isLoaded=globalSettings.loadedaddressbookcollections.value.indexOf(checkHref)!=-1;

					if(isLoaded && collections[i].oldSyncToken=='')
					{
						var newObj = $.extend(collections[i],{makeLoaded:true});
						globalResourceCardDAVList.insertResource(newObj, collections[i].resourceIndex, true);
						CardDAVUpdateMainLoader(collections[i]);
					}
				}
				if(isError)
					$('#ResourceCardDAVList').find('[data-id="'+collections[i].uid+'"]').addClass('r_error');
				else
					$('#ResourceCardDAVList').find('[data-id="'+collections[i].uid+'"]').removeClass('r_error');
			}
		}
	}
}
function unloadCardDAVCollection(unloadArray)
{
	var collections = globalResourceCardDAVList.collections;
	var unloadedColls=new Array();
	var contactsToDelete=new Array();
	var collRegex = new RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+)(.*/)([^/]+/)([^/]*)','i');
	for(var i=0;i<collections.length;i++)
	{
		if(collections[i].uid!=undefined)
		{
			var uidParts=(collections[i].uid).match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@(.*)'));
			var checkHref = uidParts[1]+uidParts[3];
			if(unloadArray.indexOf(checkHref)!=-1)
			{
				$('#AddressbookOverlay').children('.loaderInfo').text(localization[globalInterfaceLanguage].unloadingAddressbooks);
				unloadedColls.push(collections[i].uid);
				globalAddressbookList.vcard_groups[collections[i].uid] = new Array();
				collections[i].someChanged=false;
				collections[i].makeLoaded=false;
				collections[i].syncToken='';
				collections[i].oldSyncToken='';
				$('#ResourceCardDAVList').find('input[data-id="'+collections[i].uid+'"]').prop('checked',false);
				$('#ResourceCardDAVList').find('input[data-id="'+collections[i].uid+'"]').parent().parent().find('.group').each(function(){
					$(this).find(':input').prop('checked',false);
				});
				globalAddressbookList.applyABFilter(collectionChBoxClick($('#ResourceCardDAVList').find('input[data-id="'+collections[i].uid+'"]').get(0), '#ResourceCardDAVList', '.resourceCardDAV_header', '.resourceCardDAV', '.contact_group', true), false);
			}
		}
	}
	var contactLoaded = globalAddressbookList.contactLoaded;
	if((contactLoaded!=null && typeof globalAddressbookList.contacts_hash[contactLoaded.uid]!= 'undefined' &&  !globalAddressbookList.contacts_hash[contactLoaded.uid].show) || contactLoaded==null)
		for(var contact in globalAddressbookList.contacts_hash)
			if(globalAddressbookList.contacts_hash[contact].show)
			{
				globalAddressbookList.contactLoaded=contact;
				break;
			}
	if(globalSettingsSaving=='addressbook' && !globalFirstHideLoader)
		setTimeout(function(){hideUnloadedCardDAVCollectionsCallBack();},300);
}

function addLoadCardDAVCollection(loadingArray)
{
	var collections = globalResourceCardDAVList.collections;
	for(var i=0;i<collections.length;i++)
	{
		if(collections[i].uid!=undefined)
		{
			var uidParts=(collections[i].uid).match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@(.*)'));
			var checkHref = uidParts[1]+uidParts[3];
			if(loadingArray.indexOf(checkHref)!=-1 && !collections[i].makeLoaded)
			{
					var resDOMItem=$('#ResourceCardDAVList').find('.resourceCardDAV[data-id="'+jqueryEscapeSelector(collections[i].uid)+'"]');
					// if the collection is re-inserted, certain data are still valid and we need to preserve these
					collections[i].someChanged=true;
					collections[i].makeLoaded=true;

					var rex=vCard.pre['accountUidParts'];
					var tmp=collections[i].accountUID.match(rex);
					var resourceCalDAV_href=tmp[1]+tmp[3]+tmp[4];
					var resourceCalDAV_user=tmp[2];
					for(var j=0;j<globalAccountSettings.length;j++)
						if(globalAccountSettings[j].href==resourceCalDAV_href && globalAccountSettings[j].userAuth.userName==resourceCalDAV_user && globalLoadedPrincipals.indexOf(resourceCalDAV_href)==-1)
						{
							globalLoadedPrincipals.push(globalAccountSettings[j].href);
							break;
						}
					var resDOMHeader=resDOMItem.parent().prevUntil('.resourceCardDAV_header').last().prev();
					if(!resDOMHeader.length)
						resDOMHeader=resDOMItem.parent().prev();
					resDOMHeader.css('display','block');
					resDOMItem.css('display','');
					var input=resDOMItem.find('input[type=checkbox]').not('.unloadCheck');
					input.prop('checked',true).prop('indeterminate',false);
					collectionChBoxClick(input.get(0), '#ResourceCardDAVList', '.resourceCardDAV_header', '.resourceCardDAV', '.contact_group', false);
					collections[i].newlyAdded=true;
			}
		}
	}
}
function CardDAVloadResources(resourceList, forceLoad)
{
	if(forceLoad!=true && globalWindowFocus==false)
		return false;

	if(!(resourceList instanceof Array))
		resourceList=[resourceList];

	// i.pad((resourceList.length+'').length) is used for custom sorting
	//for(var i=0;i<resourceList.length;i++)
	var i=0;
	CardDAVnetFindResource(resourceList[0], i.pad((resourceList.length+'').length), forceLoad, 0);
}

// ResourceCardDAVList Class
function ResourceCardDAVList()
{
	this.collections=new Array();

// DONE
	this.reset=function()
	{
		this.collections.splice(0,this.collections.length);
	}

// DONE
	// resource header value
	this.getHeaderValue=function(inputResource)
	{
		var re=new RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+).*/([^/]*)/','i');
		var tmp=inputResource.accountUID.match(re);
		var tmp_host=tmp[3];	// hostname [%H]
		var tmp_host_wo_port=tmp[3].replace(RegExp(':[0-9]+$'),'');	// hostname without port [%h]
		var tmp_domain=tmp_host_wo_port.replace(RegExp('^[^.]+\\.'), '');	// domain name [%D]
		var tmp_domain_min=tmp_host_wo_port.match(RegExp('^([^.]+\\.)*?((?:[^.]+\\.)?[^.]+)$'))[2];	// domain name min. (only 1 or 2 level domain string) [%d]
		var tmp_principal=decodeURIComponent(tmp[4]);	// principal username [%P]
		var tmp_principal_wo_domain=decodeURIComponent(tmp[4]).replace(RegExp('(@.*)?$'),'');	// principal username without @domain.com [%p]
		var tmp_user=inputResource.userAuth.userName;	// login name [%U]
		var tmp_user_wo_domain=inputResource.userAuth.userName.replace(RegExp('@.*$'),'');	// login name without @domain.com [%u]

		if(typeof inputResource.hrefLabel!='string' || inputResource.hrefLabel=='' || (inputResource.hrefLabel=='%x' && inputResource.headervalue==''))
			inputResource.hrefLabel='%d/%p [%u]';

		var result=inputResource.hrefLabel;
		result=result.replace(RegExp('%H', 'g'), tmp_host);
		result=result.replace(RegExp('%h', 'g'), tmp_host_wo_port);
		result=result.replace(RegExp('%D', 'g'), tmp_domain);
		result=result.replace(RegExp('%d', 'g'), tmp_domain_min);
		result=result.replace(RegExp('%P', 'g'), tmp_principal);
		result=result.replace(RegExp('%p', 'g'), tmp_principal_wo_domain);
		result=result.replace(RegExp('%U', 'g'), tmp_user);
		result=result.replace(RegExp('%u', 'g'), tmp_user_wo_domain);
		result=result.replace(RegExp('%x', 'g'), inputResource.headervalue);
		inputResource.hrefLabel=result;
		return result;
	}

// DONE
	this.getSortKey=function(inputResource, forHeader, inputResourceIndex)
	{
		var re=new RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+)(.*/)([^/]+/)([^/]+/)([^/]*)','i');
		var tmp=inputResource.uid.match(re);
		var out='';

		// custom sorting (instead of alphabetical)
		if(globalSettings.resourcealphabetsorting.value!=true)
			out+=inputResourceIndex.pad(String(globalAccountSettings.length).length);

		out+=tmp[1]+tmp[3]+'/'+(inputResource.hrefLabel==undefined || inputResource.hrefLabel==null ? tmp[5] : inputResource.hrefLabel)+' '+inputResource.userAuth.userName;

		if(forHeader==false)
			out+=' '+inputResource.displayvalue;

		return out;
	}

// DONE
	// Resource list is not sorted, instead "insert sort" is performed (todo: add collection hash)
	this.insertResource=function(inputCollection, inputCollectionIndex)
	{
		var makeActive=false;
		var makeChecked=false;
		var makeIndeterminate=false;
		var makeContactGroups=[];
		var nameChanged=false;

		// do not insert entry with duplicate UID
		for(var i=0;i<this.collections.length;i++)
			if(this.collections[i].uid!=undefined && this.collections[i].uid==inputCollection.uid)	// already loaded
			{
				// no visual interface change needed
				if(this.collections[i].color==inputCollection.color && this.collections[i].displayvalue==inputCollection.displayvalue && this.collections[i].permissions.read_only==inputCollection.permissions.read_only && this.collections[i].headervalue==inputCollection.headervalue)
				{
					// if the collection is re-inserted, certain data are still valid and we need to preserve these
					this.collections[i]=$.extend(inputCollection, {sortkey: this.collections[i].sortkey, newlyAdded: this.collections[i].newlyAdded, syncToken: this.collections[i].syncToken, oldSyncToken: this.collections[i].oldSyncToken,  forceSyncPROPFIND: this.collections[i].forceSyncPROPFIND, loaded: this.collections[i].loaded});
					return 0;
				}
				else	// visual change => we need to remove and reinsert it
				{
					nameChanged=true;
					makeActive=$('#ResourceCardDAVList').find('[data-id='+jqueryEscapeSelector(inputCollection.uid)+']').hasClass('resourceCardDAV_selected');
					makeChecked=$('#ResourceCardDAVList').find('[data-id='+jqueryEscapeSelector(inputCollection.uid)+']').find('input[type=checkbox]').not('.unloadCheck').prop('checked');
					makeIndeterminate=$('#ResourceCardDAVList').find('[data-id='+jqueryEscapeSelector(inputCollection.uid)+']').find('input[type=checkbox]').not('.unloadCheck').prop('indeterminate');

					// here get the list of vcard groups with the current state (we need to re-add them to the interface)
					$('#ResourceCardDAVList').find('.group[data-id^='+jqueryEscapeSelector(inputCollection.uid)+']').not('[data-id='+jqueryEscapeSelector(inputCollection.uid)+']').each(
						function(index, element)
						{
							makeContactGroups.push({uid: $(element).attr('data-id'), isActive: $(element).hasClass('resourceCardDAV_selected'), isChecked: $(element).find('input[type=checkbox]').prop('checked')});
						}
					);

					// the collection name is changed and must be moved to correct place (we first remove it and then reinsert)
					this.removeResource(inputCollection.uid, false);
					break;
				}
			}

		if(!globalCardDAVInitLoad&&!nameChanged)
		{
			var uidParts=inputCollection.uid.match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@(.*)'));
			var checkHref = uidParts[1]+uidParts[3];
			var isLoaded=false;
			if(typeof globalCrossServerSettingsURL!='undefined'&&globalCrossServerSettingsURL!=null&globalCrossServerSettingsURL)
			{
				var uidParts=inputCollection.uid.match(RegExp('/([^/]+/[^/]+/)$'));
				var tmpParts = uidParts[1].match('^(.*/)([^/]+)/$');
				var checkHref3=decodeURIComponent(tmpParts[1])+tmpParts[2]+'/';
				var found=false;
				for(var l=0;l<globalSettings.loadedaddressbookcollections.value.length;l++)
				{
					var tmpParts2 = globalSettings.loadedaddressbookcollections.value[l].match('^(.*/)([^/]+)/([^/]+)/$');
					var checkHref2=decodeURIComponent(tmpParts2[2])+'/'+tmpParts2[3]+'/';
					if(checkHref3==checkHref2)
					{
						found=true;
						break;
					}
				}
				isLoaded=found;
			}
			else
				isLoaded=(globalSettings.loadedaddressbookcollections.value.indexOf(checkHref)!=-1);
//			if(!isLoaded)
//				globalSettings.loadedaddressbookcollections.value.push(checkHref);
			if(!isLoaded)
			{
				inputCollection.makeLoaded=false;
				inputCollection.newlyAdded=false;
			}
			else
			{
				inputCollection.makeLoaded=true;
				inputCollection.newlyAdded=true;
			}

			inputCollection.oldSyncToken = '';
			inputCollection.someChanged=false;
			makeChecked=true;
		}

		var oldHrefLabel = inputCollection.hrefLabel;
		var headerValue = this.getHeaderValue(inputCollection);
		// get sort key for the collection
		inputCollection.sortkey=this.getSortKey(inputCollection, false, inputCollectionIndex);

		// find the index where to insert the new resource O(n*log(n))
		var insertIndex=0;
		var low=0;
		var high=this.collections.length-1;
		if(this.collections.length>0)
			while(low<high)
			{
				insertIndex=low+Math.round((high-low)/2);
				var result=(cmp_str=this.collections[insertIndex].sortkey).customCompare(inputCollection.sortkey,globalSortAlphabet,1,false);
				if(result==-1)
				{
					if(insertIndex+1==this.collections.length-1 && typeof this.collections[insertIndex+1]!='undefined' && (cmp_str=this.collections[insertIndex+1].sortkey).customCompare(inputCollection.sortkey,globalSortAlphabet,1,false)==-1)
					{
						insertIndex+=2;
						break;
					}
					else
						low=++insertIndex;
				}
				else if(result==1)
				{
					if((cmp_str=this.collections[insertIndex-1].sortkey).customCompare(inputCollection.sortkey,globalSortAlphabet,1,false)==-1)
						break;
					else
						high=--insertIndex;
				}
			}

		// create the header
		var headerObject={headerOnly: true, sortkey: this.getSortKey(inputCollection, true, inputCollectionIndex), displayvalue: (oldHrefLabel=='%x' ? headerValue.replace(RegExp('^[^#]+#'),'') : headerValue)};

		// check for header existence
		var headerMiss=1;
		for(var i=0;i<this.collections.length;i++)
			if(this.collections[i].headerOnly!=undefined && this.collections[i].headerOnly==true && this.collections[i].displayvalue==headerObject.displayvalue)
				{headerMiss=0; break;}

		// if header not exists
		if(headerMiss)
		{
			// insert header
			this.collections.splice(insertIndex, 0, headerObject);
			// insert header to the interface
			var newElement=globalTranslCardDAVListHeader.clone();
			newElement.append(headerObject.displayvalue);
			newElement.find('input[type=checkbox]').click(function(){globalAddressbookList.applyABFilter(resourceChBoxClick(this, '#ResourceCardDAVList', '.resourceCardDAV_header', true), false);});
			$('#ResourceCardDAVList').children().eq(insertIndex).after(newElement);
		}

		// insert the resource
		if(!nameChanged)
			globalAddressbookList.vcard_groups[inputCollection.uid] = new Array();
		this.collections.splice(insertIndex+headerMiss, 0, inputCollection);

		// insert the resource to the interface
		var newElement=globalTranslCardDAVListItem.clone();
		// the onclick event is disabled until the last drag&drop operation is completed
		newElement.find('.resourceCardDAV').click(function(e){
			if(globalAddressbookCollectionsLoading)
				return true;
			if(e.shiftKey) {
				var uid = $(this).attr('data-id');
				$('#ResourceCardDAVList').find('.resourceCardDAV:visible').children('input[type="checkbox"]').each(function(){
					var currentUid = $(this).attr('data-id');
					if(currentUid===uid)
						$(this).prop({'checked':true, 'indeterminate':false});
					else
						$(this).prop({'checked':false, 'indeterminate':false}).attr('data-ind', 'true');
					collectionChBoxClick(this, '#ResourceCardDAVList', '.resourceCardDAV_header', '.resourceCardDAV', '.contact_group', false);
				});
				globalAddressbookList.applyABFilter([uid], false);
			}
			globalResourceCardDAVList.resourceOrGroupClick(this.getAttribute('data-id'));
		});
		newElement.find('.resourceCardDAV').attr('data-id', inputCollection.uid);
		if(inputCollection.permissions.read_only)
			newElement.find('.resourceCardDAV').addClass('resourceCardDAV_ro');
		if(globalCardDAVInitLoad)
			newElement.find('.resourceCardDAV').addClass('r_operate');
		newElement.find('.resourceCardDAVColor').css('background-color',inputCollection.color);
		if(typeof globalAddrColorPropertyXmlns== 'undefined' || globalAddrColorPropertyXmlns== null || globalAddrColorPropertyXmlns==='' || globalAddrColorPropertyXmlns!==false)
			bindColorPickerClick(newElement.find('.resourceCardDAVColor'));
		newElement.find('.resourceCardDAV').find('input[type=checkbox]').attr({'data-id': inputCollection.uid, 'onclick':'if(globalAddressbookList.contactToReload!=null){if(globalAddressbookList.contactToReload.uid.indexOf("'+inputCollection.uid+'")==0){hideNotVisibleMessage()}}var evt=arguments[0];evt.stopPropagation(); if($(this).parents(\':eq(2)\').find(\'[class^="r_"]\').length>0) return false; else { globalAddressbookList.applyABFilter(collectionChBoxClick(this, \'#ResourceCardDAVList\', \'.resourceCardDAV_header\', \'.resourceCardDAV\', \'.contact_group\', true), false); }'});
		newElement.find('.resourceCardDAV').append(inputCollection.displayvalue);
		newElement.find('.resourceCardDAV').attr('title',inputCollection.displayvalue);
		$('#ResourceCardDAVList').children().eq(insertIndex+headerMiss).after(newElement);
		if(inputCollection.makeLoaded)
		{
			var resDOMHeader=newElement.prevUntil('.resourceCardDAV_header').last().prev();
			if(!resDOMHeader.length)
				resDOMHeader=newElement.prev();
			resDOMHeader.css('display','block');
			var rex=vCard.pre['accountUidParts'];
			var tmp=inputCollection.accountUID.match(rex);
			var resourceCalDAV_href=tmp[1]+tmp[3]+tmp[4];
			var resourceCalDAV_user=tmp[2];
			for(var i=0;i<globalAccountSettings.length;i++)
				if(globalAccountSettings[i].href==resourceCalDAV_href && globalAccountSettings[i].userAuth.userName==resourceCalDAV_user && globalLoadedPrincipals.indexOf(resourceCalDAV_href)==-1)
				{
					globalLoadedPrincipals.push(globalAccountSettings[i].href);
					break;
				}
		}
		else
			newElement.css('display','none');
		// make the area droppable if the collection is not read-only
		if(!inputCollection.permissions.read_only && (typeof globalDisableDragAndDrop=='undefined' || globalDisableDragAndDrop!=true))
			$('#ResourceCardDAVList').children().eq(insertIndex+headerMiss+1).find('.resourceCardDAV').droppable({
				accept: '.ablist_item',
				tolerance: 'pointer',
				hoverClass: 'resourceCardDAV_dropped_to',
				drop: function(event, ui){
					// animate the clone of the dropped (draggable) element
					var tmp=ui.helper.clone();
					tmp.appendTo('body').animate({opacity: 0, color: 'transparent', height: 0, width: 0, fontSize: 0, lineHeight: 0, paddingLeft: 0, paddingRight: 0}, 750, function(){tmp.remove()});

					// disallow to drag the original dropped element until the processing is finished
					ui.draggable.draggable('option', 'disabled', true);

					// animate the original dropped element
					ui.draggable.animate({opacity: 0.3}, 750);

					// disallow to drop any new element until the processing is finished
					$(this).droppable('option', 'disabled', true);

					// show the loader icon
					$(this).addClass('r_operate');

					// moving contact between different collections in the same resource
					if($(this).attr('data-id').replace(RegExp('[^/]+/$'),'')==ui.draggable.attr('data-id').replace(RegExp('[^/]+/[^/]+$'),''))
					{
						var tmp2=globalAddressbookList.getContactByUID(ui.draggable.attr('data-id'));
						// here we generate the destination for MOVE (we don't use the old vCard file name to minimalize the possible conflict situations)
						var tmp3=($(this).attr('data-id')+hex_sha256(tmp2.vcard+(new Date().getTime()))+'.vcf').match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+)(.*/)([^/]+/)([^/]*)','i'));
						tmp2.moveDestUID=$(this).attr('data-id');
						tmp2.moveDest=tmp3[1]+tmp3[3]+tmp3[4]+tmp3[5]+tmp3[6];
						// we need to store the ui object references for error handling in the GUI
						tmp2.uiObjects={contact: ui.draggable, resource: $(this).attr('data-id')};
						lockAndPerformToCollection(tmp2, globalRefAddContact.attr('data-filter-url'), 'MOVE');
					}
					// inter-resource contact "move" (put + delete)
					else
					{
						var tmp2=globalAddressbookList.getContactByUID(ui.draggable.attr('data-id'));
						// here we generate the destination for MOVE (we don't use the old vCard file name to minimalize the possible conflict situations)
						tmp2.newAccountUID=globalResourceCardDAVList.getCollectionByUID($(this).attr('data-id')).accountUID;
						tmp2.newUid=$(this).attr('data-id');

						// we need to store the ui object references for error handling in the GUI
						tmp2.uiObjects={contact: ui.draggable, resource: $(this).attr('data-id')};
						lockAndPerformToCollection(tmp2, globalRefAddContact.attr('data-filter-url'), 'IRM_DELETE');
					}
				}
			});

		// restore the active state (we do not need to call this.resourceOrGroupClick() here, because we re-activate the "old active item")
		if(makeActive)
		{
			$('#ResourceCardDAVList').find('.resourceCardDAV_item').find('.resourceCardDAV').removeClass('resourceCardDAV_selected');
			$('#ResourceCardDAVList').children().eq(insertIndex+headerMiss+1).find('.resourceCardDAV').addClass('resourceCardDAV_selected');
		}
		// restore the checked state
		if(makeChecked)
			$('#ResourceCardDAVList').children().eq(insertIndex+headerMiss+1).find('.resourceCardDAV').find('input[type=checkbox]').prop('checked', true);
		// restore the indeterminate state
		if(makeIndeterminate)
			$('#ResourceCardDAVList').children().eq(insertIndex+headerMiss+1).find('.resourceCardDAV').find('input[type=checkbox]').prop('indeterminate', true);

		if(!globalCardDAVInitLoad)
			collectionChBoxClick(newElement.find('input[type=checkbox]').get(0), '#ResourceCardDAVList', '.resourceCardDAV_header', '.resourceCardDAV', null, false);

		// restore contact groups
		if(makeContactGroups.length>0)
			for(var i=0;i<makeContactGroups.length;i++)
			{
				globalAddressbookList.insertContactGroup(globalAddressbookList.getContactGroupByUID(makeContactGroups[i].uid), false, true);
				$('#ResourceCardDAVList').find('.group[data-id='+jqueryEscapeSelector(makeContactGroups[i].uid)+']').find('input[type=checkbox]').prop('checked', makeContactGroups[i].isChecked);
				if(makeContactGroups[i].isActive)
					$('#ResourceCardDAVList').find('.group[data-id='+jqueryEscapeSelector(makeContactGroups[i].uid)+']').addClass('resourceCardDAV_selected');
			}
	}

// DONE
	this.removeResource=function(inputCollectionUID, activateNextIfNeeded)
	{
		var nextCandidateToActive=null;

		for(var i=this.collections.length-1;i>=0;i--)
			if(this.collections[i].uid==inputCollectionUID)
			{
				var uidRemoved=this.collections[i].uid;
				var item=$('#ResourceCardDAVList').find('.resourceCardDAV[data-id^="'+jqueryEscapeSelector(this.collections[i].uid)+'"]');
				var item_prev=item.parent().prev();

				var item_was_selected=item.hasClass('resourceCardDAV_selected');
				if(activateNextIfNeeded && item_was_selected)
				{
					// select the nearest candidate to load
					if((i+1)<=(this.collections.length-1))
					{
						if(this.collections[i+1].headerOnly!=true)
							nextCandidateToActive=this.collections[i+1];
						else if((i+2)<=(this.collections.length-1))
							nextCandidateToActive=this.collections[i+2];
					}
					if(nextCandidateToActive==null && (i-1)>0)
					{
						if(this.collections[i-1].headerOnly!=true)
							nextCandidateToActive=this.collections[i-1];
						else if((i-2)>0)
							nextCandidateToActive=this.collections[i-2];
					}
				}

				// remove the item
				item.parent().remove();
				this.collections.splice(i,1);

				// if the next item is undefined or is header, and the previous item is header, then delete the header
				if((this.collections[i]==undefined || this.collections[i].headerOnly==true) && this.collections[i-1].headerOnly==true)
				{
					item_prev.remove();
					this.collections.splice(--i,1);
				}

				// make another resource active
				if(activateNextIfNeeded && nextCandidateToActive!=null)
					this.resourceOrGroupClick(nextCandidateToActive.uid);

				break;
			}
	}

// DONE
	this.removeOldResources=function(inputUidBase, inputTimestamp)
	{
		for(var i=this.collections.length-1;i>=0;i--)
			if(this.collections[i].timestamp!=undefined && this.collections[i].uid.indexOf(inputUidBase)==0 && this.collections[i].timestamp<inputTimestamp)
			{
				var uidRemoved=this.collections[i].uid;
				var item=$('#ResourceCardDAVList').find('.resourceCardDAV[data-id^="'+jqueryEscapeSelector(this.collections[i].uid)+'"]');
				var item_header=item.parent().prevUntil('.resourceCardDAV_header').last().prev();
				if(!item_header.length)
					item_header=item.parent().prev();

				// remove the item
				item.parent().remove();
				this.collections.splice(i,1);

				//remove contacts from addressbook
				var contactsToRemove = new Array();
				for(var c=0;c<globalAddressbookList.contacts.length; c++)
				{
					if(typeof globalAddressbookList.contacts[c].uid!='undefined'&&globalAddressbookList.contacts[c].uid.replace(RegExp('/[^/]*$',''),'/')==uidRemoved)
						contactsToRemove.push(globalAddressbookList.contacts[c].uid);
				}
				globalAddressbookList.removeContact(contactsToRemove);

				// if (next item undefined or is header) and previous item is header delete the header
				if((this.collections[i]==undefined || this.collections[i].headerOnly==true) && i>0 && this.collections[i-1].headerOnly==true)
				{
					item_header.remove();
					this.collections.splice(--i,1);
				}
				else
				{
					var firstVisibleCollection=null;
					for(var vi=i-1;vi>0;vi--)
					{
						if(this.collections[vi].headerOnly==true)
							break;
						if(this.collections[vi].makeLoaded)
						{
							firstVisibleCollection=this.collections[vi];
							break;
						}
					}
					if(firstVisibleCollection==null)
					{
						for(var vi=i;vi<this.collections.length;vi++)
						{
							if(this.collections[vi].headerOnly==true)
								break;
							if(this.collections[vi].makeLoaded)
							{
								firstVisibleCollection=this.collections[vi];
								break;
							}
						}
					}
					if(firstVisibleCollection==null)
						item_header.css('display','none');
					else
					{
						var triggerInput=$('#ResourceCalDAVList').find('.resourceCardDAV[data-id^="'+jqueryEscapeSelector(firstVisibleCollection.uid)+'"]').find('input[type=checkbox]');
						collectionChBoxClick(triggerInput.get(0), '#ResourceCardDAVList', '.resourceCardDAV_header', '.resourceCardDAV', null, false);
					}
				}
			}
	};

	this.resourceOrGroupClick=function(inputUID)
	{
//		console.log('click na: '+inputUID);
		var tmp=inputUID.match(RegExp('(^.*/)(.*)'),'');

		for(var i=0;i<this.collections.length;i++)
			if(this.collections[i].uid!=undefined && this.collections[i].uid==tmp[1])
			{
// YYY check this
				this.collections[i].filterUID=inputUID;

				if(this.collections[i].permissions.read_only==true)
					globalRefAddContact.addClass('element_no_display');
				else
					globalRefAddContact.removeClass('element_no_display');

				globalRefAddContact.attr('data-url', this.collections[i].uid.replace(RegExp('[^/]+$'),''));
				globalRefAddContact.attr('data-filter-url',this.collections[i].filterUID);	// Set the current addressbook filter uid
				globalRefAddContact.attr('data-account-uid',this.collections[i].accountUID);
				globalRefAddContact.attr('data-color',this.collections[i].color);

				// Make the selected collection active
				if(!globalCardDAVInitLoad)
				{
					if(typeof(globalContactsABChange)=='function')
						globalContactsABChange(this.collections[i].uid);

					$('#ResourceCardDAVList').find('.resourceCardDAV_item').find('.resourceCardDAV_selected').removeClass('resourceCardDAV_selected');
					$('#ResourceCardDAVList').find('[data-id='+jqueryEscapeSelector(this.collections[i].uid)+']').addClass('resourceCardDAV_selected');

					if(this.collections[i].filterUID[this.collections[i].filterUID.length-1]!='/')
						$('#ResourceCardDAVList').find('[data-id='+jqueryEscapeSelector(this.collections[i].filterUID)+']').addClass('resourceCardDAV_selected');
				}
			}
	};

/*
	this.loadAddressbookByUID=function(inputUID)
	{
		// Show the progress loader ...
		if(this.collections[i].loaded==undefined || this.collections[i].loaded==false)
		{
			this.collections[i].loaded=true;	// otazka ci to dat sem alebo tam kre sa to realne nacita (ak to bude na druhom mieste, tak sa mozes stat ze user klikne vela krat a bude vela paralelnych loadov)
		}
	}
*/

	this.getCollectionByUID=function(inputUID)
	{
		for(var i=0;i<this.collections.length;i++)
			if(this.collections[i].uid==inputUID)
				return this.collections[i];

		return null;
	};

	this.setCollectionFlagByUID=function(inputUID, inputFlagName, inputFlagValue)
	{
		for(var i=0;i<this.collections.length;i++)
			if(this.collections[i].uid==inputUID)
			{
				this.collections[i][inputFlagName]=inputFlagValue;
				return this.collections[i];
			}

		return null;
	};

	this.getCollectionPrivByUID=function(inputUID)
	{
		for(var i=0;i<this.collections.length;i++)
			if(this.collections[i].uid!=undefined && this.collections[i].uid==inputUID)
				return this.collections[i].permissions.read_only;

		return null;
	};
}
