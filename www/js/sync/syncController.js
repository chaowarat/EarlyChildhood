define(["app", "js/sync/syncView"], function (app, View) {

    var bindings = [{
        element: '.navbar-inner .left .back.link',
        event: 'click',
        handler: backClick
    },
	{
	    element: '.pull-to-refresh-content',
	    event: 'refresh',
	    handler: syncData
	},
	{
	    element: '.item-content',
	    event: 'click',
	    handler: roomClick
	},
	{
	    element: '.panel-close',
	    event: 'click',
	    handler: closeRightPanel
	}];

    var model = { 'updateTime': '11/22/33 44.55', rooms: [{ id: '01', text: 'อนุบาล 1' }, { id: '02', text: 'อนุบาล 2' }] };

    function init(query) {
        View.render({ model: model, bindings: bindings });
    }

    function syncData() {        
        app.f7.confirm('', 'อัพเดทข้อมูลหรือไม่?',
            function () {
                setTimeout(function () {
                    model.updateTime = '66/77/88/99 00.00';
                    app.f7.pullToRefreshDone();
                    View.render({ model: model, bindings: bindings});
                }, 1000);
            },
            function () {
                app.f7.pullToRefreshDone();
            }
        );
    }

    function roomClick(e) {
        var id = e.target.getAttribute('data-value');
        if (!id) {
            return;
        }
        var room = model.rooms.filter(function isBigEnough(obj) {
            return obj.id == id;
        });
        View.renderRight(room[0].text, ['นาย ก', 'นาย ข', 'นาง ก', 'นาง ข']);
        app.f7.openPanel('right');
    }

    function closeRightPanel() {
        app.f7.closePanel();
    }

    function backClick() {
        closePage();
    }

    function closePage() {
        app.f7.closeModal();
    }

    return {
        init: init
    };
});