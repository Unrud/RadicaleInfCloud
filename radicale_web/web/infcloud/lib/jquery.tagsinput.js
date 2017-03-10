/*

	jQuery Tags Input Plugin 1.3.3 (with minor modifications for CardDavMATE)
	
	Copyright (c) 2011 XOXCO, Inc
	
	Documentation for this plugin lives here:
	http://xoxco.com/clickable/jquery-tags-input
	
	Licensed under the MIT license:
	http://www.opensource.org/licenses/mit-license.php

	ben@xoxco.com

*/

(function($){
	var tags_settings=new Array();
	var tags_callbacks=new Array();

	String.prototype.escapeCustom=function(inputDelimiter)
	{
		var value=(this==undefined ? '' : this),
			output='';

		for(var i=0; i<value.length; i++)
		{
			if(value[i]==inputDelimiter || value[i]=='\\')
				output+='\\';

			output+=value[i];
		}
		return output;
	}

	// split and unescape values
	String.prototype.splitCustom=function(inputDelimiter)
	{
		var outputArray=new Array(),
		value=this,
		j=0;

		for(var i=0; i<value.length; i++)
		{
			if(value[i]==inputDelimiter)
			{
				if(outputArray[j]==undefined)
					outputArray[j]='';
				++j;
				continue;
			}
			else if(value[i]=='\\')
				++i;

			outputArray[j]=(outputArray[j]==undefined ? '' : outputArray[j])+value[i];
		}
		return outputArray;
	}

	$.fn.doAutosize=function(o)
	{
		var minWidth=$(this).data('minwidth'),
		maxWidth=$(this).data('maxwidth'),
		val='',
		input=$(this),
		testSubject=$('#'+$(this).data('tester_id'));

		if(val===(val=input.val()))
			return;

		// Enter new content into testSubject
		var escaped=val.replace(/\s/g,'&nbsp;');	// get proper width for values with leading spaces (or only spaces)
		testSubject.html(escaped);

		// Calculate new width + whether to change
		var testerWidth=testSubject.width(),
		newWidth=(testerWidth+o.comfortZone)>=minWidth ? testerWidth+o.comfortZone : minWidth,
		currentWidth=input.width(),
		isValidWidthChange=(newWidth<currentWidth && newWidth>=minWidth) || (newWidth>minWidth && newWidth<maxWidth);

		// Animate width
		if(isValidWidthChange)
			input.width(newWidth);
	};

	$.fn.resetAutosize=function(options)
	{
		// alert(JSON.stringify(options));
		var minWidth=$(this).data('minwidth') || options.minInputWidth || $(this).width(),
		maxWidth=$(this).data('maxwidth') || options.maxInputWidth || ($(this).closest('.tagsinput').width()-options.inputPadding),
		val='',
		input=$(this),
		testSubject=$('<tester/>').css({
			position: 'absolute',
			top: -9999,
			left: -9999,
			width: 'auto',
			fontSize: input.css('fontSize'),
			fontFamily: input.css('fontFamily'),
			fontWeight: input.css('fontWeight'),
			letterSpacing: input.css('letterSpacing'),
			whiteSpace: 'nowrap'
		}),
		testerId=$(this).attr('id')+'_autosize_tester';

		if(!$('#'+testerId).length>0)
		{
			testSubject.attr('id', testerId);
			testSubject.appendTo('body');
		}

		input.data('minwidth', minWidth);
		input.data('maxwidth', maxWidth);
		input.data('tester_id', testerId);
		input.css('width', minWidth);
	};

	$.fn.addTag=function(value, options)
	{
		options=jQuery.extend({focus: false, callback: true, imported: false}, options);

		this.each(function()
		{
			var id=$(this).attr('id');

			if(tags_settings[id].allowDelimiterInValue==true)
				var tagslist=$(this).val().splitCustom(tags_settings[id].delimiter);
			else
				var tagslist=$(this).val().split(delimiter[id]);

			if(tagslist[0]=='')
				tagslist=new Array();

			if(options.trimInput==true)
				value=jQuery.trim(value);

			var skipTag=false;
			var duplicate=$(tagslist).tagExist(value);
			if(tags_callbacks[id] && tags_callbacks[id]['validateTag'])
				skipTag=!tags_callbacks[id]['validateTag'].call(this, value, options.imported, duplicate);
			if(!skipTag && options.unique)
				skipTag=duplicate;

			if(skipTag)
				$(this).parent().find('#'+id+'_tag').addClass('not_valid');	//Marks fake input as not_valid to let styling it

			if(value!='' && skipTag!=true)
			{
				$('<span>').addClass('tag').append(
					$('<span>').text(value),
					$('<a>', {
						href: '#',
						title: 'Removing tag',
						text: 'x'
					}).click(function(){return $('#'+id).removeTag(value)})
				).insertBefore($(this).parent().find('#'+id+'_addTag'));

				tagslist.push(value);

				var tmpRef=$(this).parent().find('#'+id+'_tag');
				tmpRef.val('');
				if(options.focus)
					tmpRef.focus();
				else
					tmpRef.blur();

				$.fn.tagsInput.updateTagsField(this, tagslist);

				if(options.callback && tags_callbacks[id] && tags_callbacks[id]['onAddTag'])
				{
					var f=tags_callbacks[id]['onAddTag'];
					f.call(this, value);
				}
				if(tags_callbacks[id] && tags_callbacks[id]['onChange'])
				{
					var i=tagslist.length;
					var f=tags_callbacks[id]['onChange'];
					f.call(this, tagslist[i-1], options.imported);
				}
			}
		});
		return false;
	};

	$.fn.removeTag = function(value)
	{
		this.each(function()
		{
			var id=$(this).attr('id');

			if(tags_settings[id].allowDelimiterInValue==true)
				var old=$(this).val().splitCustom(tags_settings[id].delimiter);
			else
				var old=$(this).val().split(delimiter[id]);

			$(this).parent().find('#'+id+'_tagsinput .tag').remove();

			var str='';
			for(i=0; i<old.length; i++)
				if(old[i]!=value)
					str=(str=='' ? '' : str+tags_settings[id].delimiter)+(tags_settings[id].allowDelimiterInValue==true ? old[i].escapeCustom(tags_settings[id].delimiter) : old[i]);

			$.fn.tagsInput.importTags(this, str);
			if(tags_callbacks[id] && tags_callbacks[id]['onRemoveTag'])
			{
				var f=tags_callbacks[id]['onRemoveTag'];
				f.call(this, value);
			}
		});
		return false;
	};

	$.fn.tagExist=function(val)
	{
		return (jQuery.inArray(val, $(this))>=0); //true when tag exists, false when not
	};

	// clear all existing tags and import new ones from a string
	$.fn.importTags=function(str)
	{
		$(this).parent().find('#'+$(this).attr('id')+'_tagsinput .tag').remove();
		$.fn.tagsInput.importTags(this, str);
	}

	$.fn.tagsInput=function(options)
	{
		var settings=jQuery.extend({
			interactive: true,
			defaultText: 'add a tag',
			useNativePlaceholder:false,
			minChars: 0,
			width: '300px',
			height: '100px',
			autocomplete: {selectFirst: false},
			hide: true,
			delimiter: ',',
			allowDelimiterInValue: false,
			trimInput: true,
			unique: true,
			removeWithBackspace: true,
			color: '#000000',
			placeholderColor: '#666666',
			autosize: true,
			comfortZone: 20,
			inputPadding: 6*2
		}, options);

		this.each(function()
		{
			if(settings.hide)
				$(this).hide();

			var id=$(this).attr('id');
			var data=jQuery.extend({
				real_inputObj: $(this),
				pid: id,
				real_input: '#'+id,
				holder: '#'+id+'_tagsinput',
				input_wrapper: '#'+id+'_addTag',
				fake_input: '#'+id+'_tag'
			}, settings);

			tags_settings[id]={delimiter: data.delimiter, allowDelimiterInValue: data.allowDelimiterInValue};

			if(settings.onAddTag || settings.onRemoveTag || settings.onChange || settings.validateTag)
			{
				tags_callbacks[id] = new Array();
				tags_callbacks[id]['onAddTag'] = settings.onAddTag;
				tags_callbacks[id]['onRemoveTag'] = settings.onRemoveTag;
				tags_callbacks[id]['onChange'] = settings.onChange;
				tags_callbacks[id]['validateTag'] = settings.validateTag;
			}

			var markup='<div id="'+id+'_tagsinput" class="tagsinput"><div id="'+id+'_addTag">';
			if(settings.interactive)
				markup=markup+'<div class="input_container"><input id="'+id+'_tag" type="text" value=""'+(settings.useNativePlaceholder==true ? ' placeholder="'+settings.defaultText+'" data-default=""' : ' data-default="'+settings.defaultText+'"')+' /></div>';
			markup=markup+'</div><div class="tags_clear"></div></div>';

			var tmpMarkupObj=$(markup).insertAfter(this);

			if(settings.width!=null)
				tmpMarkupObj.css('width', settings.width);
			if(settings.height!=null)
				tmpMarkupObj.css('height', settings.height);

			if($(this).val()!='')
				$.fn.tagsInput.importTags($(this), $(this).val());

			if(settings.interactive)
			{
				tmpMarkupObj.val(tmpMarkupObj.attr('data-default'));
				tmpMarkupObj.css('color', settings.placeholderColor);
				tmpMarkupObj.resetAutosize(settings);

				tmpMarkupObj.bind('click', data, function(event)
				{
					$(this).find(event.data.fake_input).focus();
				});

				tmpMarkupObj.find(data.fake_input).bind('focus', data, function(event)
				{
					if($(this).val() == $(this).attr('data-default'))
						$(this).val('');

					$(this).css('color', settings.color);
				});

				if(settings.autocomplete_url!=undefined)
				{
					var autocomplete_options={source: settings.autocomplete_url};
					for(var attrname in settings.autocomplete)
						autocomplete_options[attrname]=settings.autocomplete[attrname];

					if(jQuery.Autocompleter!==undefined)
					{
						tmpMarkupObj.find(data.fake_input).autocomplete(settings.autocomplete_url, settings.autocomplete);
						tmpMarkupObj.find(data.fake_input).bind('result', data, function(event, data, formatted)
						{
							if(data)
								event.data.real_inputObj.addTag(data[0] + "", {focus: true, unique: settings.unique, trimInput: settings.trimInput});
						});
					}
					else if(jQuery.ui.autocomplete!==undefined)
					{
						tmpMarkupObj.find(data.fake_input).autocomplete(autocomplete_options);
						tmpMarkupObj.find(data.fake_input).bind('autocompleteselect', data, function(event,ui)
						{
							event.data.real_inputObj.addTag(ui.item.value, {focus: true, unique: settings.unique, trimInput: settings.trimInput});
							return false;
						});
					}

					// if a user tabs out of the field, create a new tag
					// this is only available if autocomplete is not used.
					tmpMarkupObj.find(data.fake_input).bind('blur', data, function(event)
					{
						var d=$(this).attr('data-default');

						if($(this).val()!='' && $(this).val()!=d)
						{
							if((event.data.minChars<=$(this).val().length) && (!event.data.maxChars || (event.data.maxChars>=$(this).val().length)))
								event.data.real_inputObj.addTag($(this).val(), {focus: true, unique: settings.unique, trimInput: settings.trimInput});
						}
						else
							$(this).val($(this).attr('data-default'));

						$(this).css('color', settings.placeholderColor);
						return false;
					});
				}

				// if user types a comma, create a new tag
				tmpMarkupObj.find(data.fake_input).bind('keypress', data, function(event)
				{
					if(settings.allowDelimiterInValue==false && event.which==event.data.delimiter.charCodeAt(0) || event.which==13)
					{
						event.preventDefault();
						if((event.data.minChars<=$(this).val().length) && (!event.data.maxChars || (event.data.maxChars>=$(this).val().length)))
							event.data.real_inputObj.addTag($(event.data.fake_input).val(), {focus: true, unique: settings.unique, trimInput: settings.trimInput});
						$(this).resetAutosize(settings);
						return false;
					}
					else if(event.data.autosize)
						$(this).doAutosize(settings);
				});

				//Delete last tag on backspace
				data.removeWithBackspace && tmpMarkupObj.find(data.fake_input).bind('keydown', data, function(event)
				{
					if($(this).closest('.tagsinput').hasClass('readonly')==false && event.keyCode==8 && $(this).val()=='')
					{
						event.preventDefault();
						var last_tag=$(this).closest('.tagsinput').find('.tag:last').text();
						var id=$(this).attr('id').replace(/_tag$/, '');
						last_tag=last_tag.replace(/x$/, '');
						event.data.real_inputObj.removeTag(last_tag);
						$(this).trigger('focus');
					}
				});

				tmpMarkupObj.find(data.fake_input).blur();

				//Removes the not_valid class when user changes the value of the fake input
				if(data.unique)
				{
					tmpMarkupObj.find(data.fake_input).keydown(function(event)
					{
						if(event.keyCode==8 || String.fromCharCode(event.which).match(/\w+|[áéíóúÁÉÍÓÚñÑ,/]+/))
							$(this).removeClass('not_valid');
					});
				}
			} // if settings.interactive

			// store settings
			$(this).data('tagsOptions', settings);

			return false;
		});
		return this;
	};
	
	$.fn.tagsInput.updateTagsField=function(obj, tagslist)
	{
		var id = $(obj).attr('id');

		if(tags_settings[id].allowDelimiterInValue==true)
			for(var i=0;i<tagslist.length;i++)
				tagslist[i]=tagslist[i].escapeCustom(tags_settings[id].delimiter);

		$(obj).val(tagslist.join(tags_settings[id].delimiter));
	};

	$.fn.tagsInput.importTags=function(obj, val)
	{
		var settings=jQuery.extend({
			trimInput: true,
			unique: true
		}, $(obj).data('tagsOptions'));

		$(obj).val('');
		var id=$(obj).attr('id');

		if(tags_settings[id].allowDelimiterInValue==true)
			var tags=val.splitCustom(tags_settings[id].delimiter);
		else
			var tags=val.split(delimiter[id]);

		for(var i=0; i<tags.length; i++)
			$(obj).addTag(tags[i], {focus: true, unique: settings.unique, trimInput: settings.trimInput, callback: false, imported: true});
		if(tags_callbacks[id] && tags_callbacks[id]['onChange'])
		{
			var f=tags_callbacks[id]['onChange'];
			f.call(obj, tags[i], true);
		}
	};
})(jQuery);
