(function($){
    $(function(){
        $('body').on('grav-editor-ready', function() {
            var Instance = Grav.default.Forms.Fields.EditorField.Instance;
            Instance.addButton({
                shortcodes: {
                    identifier: 'shortcodes',
                    title: 'Shortcodes',
                    label: '<i class="fa fa-fw fa-th"></i>',
                    modes: ['gfm', 'markdown'],
                    children: [
                        {
                            'shortcodes-email': {
                                identifier: 'shortcodes-email',
                                title: 'E-Mail',
                                label: '<i class="fa fa-fw fa-envelope"></i>',
                                modes: ['gfm', 'markdown'],
                                action: function(_ref) {
                                    var codemirror = _ref.codemirror, button = _ref.button;
                                    button.on('click.editor.shortcodes-email', function() {
                                        Instance.buttonStrategies.replaceSelections({ token: '$1', template: '[email link=1]$1[/email]', codemirror: codemirror});
                                        codemirror.focus();
                                    });
                                }
                            }
                        },
                        {
                            'shortcodes-icon': {
                                identifier: 'shortcodes-icon',
                                title: 'Icon',
                                label: '<i class="fa fa-fw fa-rocket"></i>',
                                modes: ['gfm', 'markdown'],
                                action: function(_ref) {
                                    var codemirror = _ref.codemirror, button = _ref.button;
                                    button.on('click.editor.shortcodes-icon', function() {
                                        Instance.buttonStrategies.replaceSelections({ token: '$1', template: '[icon=$1]', codemirror: codemirror});
                                        codemirror.focus();
                                    });
                                }
                            }
                        },
                        {
                            'shortcodes-video': {
                                identifier: 'shortcodes-video',
                                title: 'Video (YouTube/Vimeo URL)',
                                label: '<i class="fa fa-fw fa-video"></i>',
                                modes: ['gfm', 'markdown'],
                                action: function(_ref) {
                                    var codemirror = _ref.codemirror, button = _ref.button;
                                    button.on('click.editor.shortcodes-video', function() {
                                        Instance.buttonStrategies.replaceSelections({ token: '$1', template: '[video=$1 type=youtube]', codemirror: codemirror});
                                        codemirror.focus();
                                    });
                                }
                            }
                        },
                        {
                            'shortcodes-lang': {
                                identifier: 'shortcodes-lang',
                                title: 'Different Language',
                                label: '<i class="fa fa-fw fa-language"></i>',
                                modes: ['gfm', 'markdown'],
                                action: function(_ref) {
                                    var codemirror = _ref.codemirror, button = _ref.button;
                                    button.on('click.editor.shortcodes-lang', function() {
                                        Instance.buttonStrategies.replaceSelections({ token: '$1', template: '[lang=en inline=1]$1[/lang]', codemirror: codemirror});
                                        codemirror.focus();
                                    });
                                }
                            }
                        },
                    ]
                }
            });
        });
    });
})(jQuery);