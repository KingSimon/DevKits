DevKits = DevKits || {};

/**
 * tab相关处理
 * @author zhaoxianlie 
 */
DevKits.fcptabs = (function(){
	
	/**
	 * 存储临时变量
	 */
	var _tempvar = {};
	
	/**
	 * 创建主面板
	 */
	var _createMainTab = function(){
		//首先检测面板箱是否存在
		var $tabBox = jQuery("#devkits-box");
		var $mainTab = jQuery("#devkits-main-tab");
		
		//有了则删掉
		if($tabBox[0]){
			$tabBox.remove();
		}
		
		$tabBox = jQuery('<div id="devkits-box" class="devkits-hide"></div>').appendTo("body");
		jQuery('<iframe id="devkits-main-ifr" src="about:blank" frameborder="0"></iframe>').appendTo($tabBox);
		$mainTab = jQuery('<div id="devkits-main-tab"></div>').appendTo($tabBox).html('\
		<ul id="devkits-main-ul">\
			<li id="devkits-closethick"><span class="ui-icon ui-icon-closethick" title="关闭面板">Close</span></li>\
			<li id="devkits-plusthick" class="devkits-hide"><span class="ui-icon ui-icon-plusthick" title="最大化面板">Maximun</span></li>\
			<li id="devkits-minusthick"><span class="ui-icon ui-icon-minusthick" title="最小化面板">Minimun</span></li>\
		</ul>\
		');
		
		//最大化显示
		$tabBox.css({
			height : jQuery(window).height()
		});
        $mainTab.tabs({active:0});
		// 初始化mainTab，并增加tab方法
		// $mainTab.tabs({
		// 	tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
		// 	add: function( event, ui ) {
		//
		// 		//设置子面板大小
		// 		jQuery('#devkits-tab-' + _tempvar.type).css({
		// 			height : jQuery(window).height() - 80
		// 		});
		//
		// 		var _t_id = 'devkits-acc-' + _tempvar.type;
		//
		// 		jQuery( ui.panel ).append( "<div id='" + _t_id + "'>" + _tempvar.tabContent + "</div>" );
		//
		// 		//设置子面板大小
		// 		jQuery('#' + _t_id).css({
		// 			height : jQuery(window).height() - 80
		// 		});
		//
		// 		//是否需要将内容部分以Accordion形式展现
		// 		if(_tempvar.isAccordion) {
		// 			jQuery("#" + _t_id).accordion({
		// 				collapsible: true,
		// 				active:false
		// 			});
		//
		// 			//.rst-content
		// 			var _rst_content = jQuery("#" + _t_id + " .rst-content");
		// 			var _height = jQuery(window).height() - 120 - _rst_content.length * 30;
		// 			_rst_content.css({
		// 				height : _height
		// 			});
		// 		}
		// 	}
		// });

		//对新产生的tab，增加移除事件
		jQuery( "#devkits-main-ul" ).on( "click","span.ui-icon-close", function() {
			var $allTabs = jQuery( "#devkits-main-ul li");
			var $li = jQuery( this ).parent();
			var index = $allTabs.index( $li ) - 3;
			var update = false;
            if($li.hasClass('ui-state-active')){
                update = true;
            }
            jQuery($li.find('a').attr('href')).remove();
			$li.remove();
            $mainTab.tabs('refresh');
            if(update){
                if(index < 1) index = 1;
                $mainTab.tabs({active:index-1});
            }
			// $mainTab.tabs( "remove", index );
			
			//如果所有tab都关闭了，则关闭整个tabBox
			if($allTabs.length == 4) {
				_tempvar.tabBox.remove();
                chrome.extension.sendRequest({
                    msg: "colse-code-standard"
                });
			}
		});
		
		//三个按钮的事件
		jQuery("#devkits-closethick").click(function(e){
			_tempvar.tabBox.hide("slide");
            chrome.extension.sendRequest({
                msg: "colse-code-standard"
            });
		});
		jQuery("#devkits-plusthick").click(function(e){
			_tempvar.tabBox.css({
				height : jQuery(window).height()
			});
			jQuery(this).hide().next().show();
		});
		jQuery("#devkits-minusthick").click(function(e){
			_tempvar.tabBox.css({
				height : 38
			});
			jQuery(this).hide().prev().show();
		});
		
		//window大小改变时候
		jQuery(window).resize(function(e){
			_tempvar.tabBox.css({
				height : jQuery(window).height()
			});
		});
	
		//保存mainTab
		_tempvar.tabBox = $tabBox;
		_tempvar.mainTab = $mainTab;
		
		return $tabBox;
	};


	var _tabAddEvent = function (panel) {
        //设置子面板大小
        jQuery('#devkits-tab-' + _tempvar.type).css({
            height : jQuery(window).height() - 80
        });

        var _t_id = 'devkits-acc-' + _tempvar.type;

        jQuery( panel ).append( "<div id='" + _t_id + "'>" + _tempvar.tabContent + "</div>" );

        //设置子面板大小
        jQuery('#' + _t_id).css({
            height : jQuery(window).height() - 80
        });

        //是否需要将内容部分以Accordion形式展现
        if(_tempvar.isAccordion) {
            jQuery("#" + _t_id).accordion({
                collapsible: true,
                active: false
            });

            //.rst-content
            var _rst_content = jQuery("#" + _t_id + " .rst-content");
            var _height = jQuery(window).height() - 120 - _rst_content.length * 30;
            _rst_content.css({
                height: _height
            });
        }
    };


	/**
	 * 根据不同的标题，在页面上增加面板
	 * @param {Object} type 面板的类型：HTML，CSS，Javascript
	 * @param {Object} tabTitle 面板标题
	 * @param {Object} tabContent 面板内容
	 * @param {Object} isAccordion 是否生成Accordion
	 */
	var _addTab = function(type,tabTitle,tabContent,isAccordion) {
		//保存这个值，创建tab时用到
		_tempvar.type = type;
		_tempvar.tabContent = tabContent;
		_tempvar.isAccordion = isAccordion;
		
		//创建新的面板
		// return _tempvar.mainTab.tabs(
		// 	"add",
		// 	"#devkits-tab-" + _tempvar.type,
		// 	tabTitle);
		var nElem = jQuery('<div id="devkits-tab-'+_tempvar.type+'" class="ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs ui-widget ui-corner-all"></div>');
		var nLiElem = jQuery('<li class="ui-state-default ui-corner-top"><a href="#devkits-tab-'+_tempvar.type+'">'+tabTitle+'</a> <span class="ui-icon ui-icon-close">Remove Tab</span></li>');
        _tempvar.mainTab.find('>ul').append(nLiElem);
        _tempvar.mainTab.append(nElem);
        _tabAddEvent(nElem);
        _tempvar.mainTab.tabs('refresh');
     	var index =  _tempvar.mainTab.find('>ul').index(nLiElem);
        return _tempvar.mainTab.tabs({active:index});
	};
	
	/**
	 * 根据不同的标题，在页面上增加HTML面板
	 * @param {Object} type 面板的类型：HTML，CSS，Javascript
	 * @param {Object} tabContent HTML面板内容
	 */
	var _addIssueSuggestionTab = function(type,tabContent) {
		//创建面板
		return _addTab(type + '-issue-sug',DevKits.i18n.getMessage('msg0061',[type]),tabContent,false);
	};
	
	/**
	 * 根据不同的标题，在页面上增加HTML面板
	 * @param {Object} tabContent HTML面板内容
	 */
	var _addHtmlTab = function(tabContent) {
		//创建面板
		return _addTab('html',DevKits.i18n.getMessage('msg0001'),tabContent,true);
	};
	
	/**
	 * 在页面上创建Javascript面板
	 * @param {Object} tabContent HTML面板内容
	 */
	var _addJavascriptTab = function(tabContent) {
		//创建新的面板
		return _addTab('js',DevKits.i18n.getMessage('msg0003'),tabContent,true);
	};

    var _cssTabAddEvent = function (panel) {
        var _t_id = 'devkits-css-acc-' + _tempvar.cssTabCount;
        jQuery( panel ).append( "<div id='" + _t_id + "'>" + _tempvar.cssTabContent + "</div>" );
        jQuery("#" + _t_id).accordion({
            collapsible: true,
            active:false
        });

        //.rst-content
        var _rst_content = jQuery("#" + _t_id + " .rst-content");
        var _height = jQuery(window).height() - 180 - _rst_content.length * 30;
        _rst_content.css({
            height : _height
        });
    };

	/**
	 * 根据不同的标题，在页面上增加CSS面板
	 * @param {Object} tabTitle 面板标题
	 * @param {Object} tabContent 面板内容
	 */
	var _addCssTab = function(tabTitle,tabContent) {
		//保存这个值，创建tab时用到
		_tempvar.cssTabContent = tabContent;
		_tempvar.cssTabCount = _tempvar.cssTabCount || 0;
		_tempvar.cssTabCount++
		
		_tempvar.cssTab = jQuery('#devkits-tab-css');
		
		if(!_tempvar.cssTab[0]) {
			//创建面板
			_addTab('css',DevKits.i18n.getMessage('msg0002'),'',false);
			_tempvar.cssTab = jQuery('#devkits-tab-css').html('<ul id="devkits-css-ul"></ul>');

			_tempvar.cssTab.tabs({active:0});
			// // 初始化mainTab，并增加tab方法
			// _tempvar.cssTab.tabs({
			// 	tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
			// 	add: function( event, ui ) {
			// 		var _t_id = 'devkits-css-acc-' + _tempvar.cssTabCount;
			// 		jQuery( ui.panel ).append( "<div id='" + _t_id + "'>" + _tempvar.cssTabContent + "</div>" );
			// 		jQuery("#" + _t_id).accordion({
			// 			collapsible: true,
			// 			active:false
			// 		});
			//
			// 		//.rst-content
			// 		var _rst_content = jQuery("#" + _t_id + " .rst-content");
			// 		var _height = jQuery(window).height() - 180 - _rst_content.length * 30;
			// 		_rst_content.css({
			// 			height : _height
			// 		});
			// 	}
			// });
				
			//对新产生的tab，增加移除事件
			jQuery( "#devkits-css-ul" ).on( "click", "span.ui-icon-close", function() {
				var $allTabs = jQuery( "#devkits-css-ul li");
                var $li = jQuery( this ).parent();
				var index = $allTabs.index( $li);
				var update = false;
                if($li.hasClass('ui-state-active')){
                    update = true;
                }
                jQuery($li.find('a').attr('href')).remove();
                $li.remove();
                _tempvar.cssTab.tabs('refresh');
                if(update){
                	if(index < 1) index = 1;
                    _tempvar.cssTab.tabs({active:index-1});
				}

				// _tempvar.cssTab.tabs( "remove", index );
			});
		}
		
		//创建新的面板
		// return _tempvar.cssTab.tabs(
		// 	"add",
		// 	"#devkits-tab-css-" + _tempvar.cssTabCount,
		// 	tabTitle);
        var nElem = jQuery('<div id="devkits-tab-css-'+_tempvar.cssTabCount+'" class="ui-tabs-panel ui-widget-content ui-corner-bottom"></div>');
		var nLiElem = jQuery('<li class="ui-state-default ui-corner-top"><a href="#devkits-tab-css-'+_tempvar.cssTabCount+'">'+tabTitle+'</a> <span class="ui-icon ui-icon-close">Remove Tab</span></li>');
		_tempvar.cssTab.find('>ul').append(nLiElem);
        _tempvar.cssTab.append(nElem);
        _cssTabAddEvent(nElem);
        _tempvar.cssTab.tabs('refresh');
        var index =  _tempvar.cssTab.find('>ul').index(nLiElem);
        return _tempvar.cssTab.tabs({active:index});
	};
	
	/**
	 * 创建进度条
	 */
	var _createProgressBar = function(){
		
		var _startTime = new Date();

		//先创建主面板
		DevKits.fcptabs.createMainTab();
		
		if(_tempvar.progressbar) {
			_tempvar.mask.remove();
		}
		//创建遮罩面板
		_tempvar.mask = jQuery('<div id="devkits-pb-mask">' +
									'<div id="f-h-p-m"></div>' +
									'<div id="devkits-progress-bar-img">正在进行页面检测，请稍后...</div>' +
									'<div id="devkits-progress-bar"></div>' +
								'</div>').appendTo('body');
		//遮罩层大小
		jQuery('#f-h-p-m').css({
			height : jQuery(window).height(),
			width : jQuery(window).width()
		});
		
		//进度条背景
		var pbarGif = chrome.extension.getURL('assets/img/tools/pbar-ani.gif');
		jQuery('#devkits-progress-bar-img').css({
			'background' : 'url(' + pbarGif + ') repeat-x'
		});
		
		//产生滚动条，初始化进度为0
		_tempvar.progressbar = jQuery('#devkits-progress-bar')
				.progressbar({
					value : 0,
					complete : function(event,ui){
						var _pbImg = jQuery('#devkits-progress-bar-img').html('页面检测完成，共计耗时：' + (new Date() - _startTime) / 1000 + ' s');
						//完成以后展示检测结果
						_tempvar.tabBox.show('slide',{},500);
						jQuery('#f-h-p-m').fadeOut(500);
						_pbImg.fadeOut(3000);
					}
				});
		jQuery('#devkits-progress-bar-img').css({
					top : jQuery(window).height() / 2 - 40,
					left : ( jQuery(window).width() - 800) / 2
				});
	};
	
	/**
	 * 更新进度条
	 * @param {Object} _value
	 */
	var _updateProgressBar = function(_value){
		_tempvar.progressbar.progressbar('value',_value);
	};
	
	
	return {
		createMainTab : _createMainTab,
		addHtmlTab : _addHtmlTab,
		addJavascriptTab : _addJavascriptTab,
		addCssTab : _addCssTab,
		addIssueSuggestionTab : _addIssueSuggestionTab,
		createProgressBar : _createProgressBar,
		updateProgressBar : _updateProgressBar
	};
	
})();

