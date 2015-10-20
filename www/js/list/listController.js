define(["app", "js/contactModel", "js/list/listView"], function (app, Contact, ListView) {

    var menu = [];

    var bindings = [{
        element: '.list-group li.contact-item',
        event: 'click',
        handler: openContact
    }];

    var state = {
        isFavorite: false
    };

    function init() {
        if (!JSON.parse(localStorage.getItem('templates'))) {
            templateInitializeStorage();
        }
        var contacts = loadContacts();
        generateMenu();
        for (var i = 0; i < menu.length; i++) {
            var obj = {
                element: '#' + menu[i].id,
                event: 'click',
                handler: menuClick
            };
            bindings.push(obj);
        }
        ListView.render({
            bindings: bindings,
            model: contacts,
            menu: menu,
            header: getHeaderName(0)
        });
    }

    function generateMenu() {
        var rooms = getRooms();
        menu = [
            { id: 0, text: 'หน้าแรก', value: '0', icon: 'icon ion-home' }
        ];
        for (i = 0; i < rooms.length; i++) {
            menu.push({ id: (i + 1), text: rooms[i], value: rooms[i], icon: 'icon ion-clipboard' });
        }
        menu.push({ id: rooms.length + 1, text: 'จัดการข้อมูล', value: '' + (rooms.length + 1), icon: 'icon ion-loop' });
        menu.push({ id: rooms.length + 2, text: 'ตั้งค่าแบบฟอร์ม', value: '' + (rooms.length + 2), icon: 'icon ion-settings' });
        menu.push({ id: rooms.length + 3, text: 'ออกจากระบบ', value: '' + (rooms.length + 3), icon: 'icon ion-log-in' });
    }

    function getRooms() {
        var contacts = JSON.parse(localStorage.getItem("f7Contacts"));
        var groups = _.groupBy(contacts, function (value) {
            return value.class + ' ' + value.room;
        });
        var tmp = Object.keys(groups);        
        tmp.sort(function (a, b) {
            if (a > b && a.split(' ')[0] == b.split(' ')[0]) {
                return 1;
            }
            return -1;
        })
        return tmp;
    }

    function getHeaderName(id) {
        if (id == 0) {
            return 'รายชื่อนักเรียนทั้งหมด';
        }
        for (var i = 0; i < menu.length; i++) {
            if (menu[i].id == id) {
                return 'รายชื่อนักเรียน ' + menu[i].text;
            }
        }
    }

    function menuClick(e) {
        var target = e.target.parentNode.parentNode;
        var value = target.getAttribute('value');
        if (value) {
            if (value == '0') { // Home
                var contacts = loadContacts();
                ListView.reRender({ bindings: bindings, model: contacts, header: getHeaderName(target.getAttribute('id')) });
            }
            else if (value == menu.length - 1) { // logout
                // clear user data and back to login screen
                // ***
                ////////////////////
                app.f7.loginScreen();
            }
            else if (value == menu.length - 2) { // formEdit
                app.router.load('formTemplate');
            }
            else if (value == menu.length - 3) { // data management
                app.router.load('sync');
            }
            else { // room
                var split = value.split(' ');
                var filter = { "room": split[1], "class": split[0] };
                var contacts = loadContacts(filter);
                ListView.reRender({ bindings: bindings, model: contacts, header: getHeaderName(target.getAttribute('id')) });
            }
        }
    }

    function openContact(e) {
        var target = e.target;
        var i = 0;
        while (target.getAttribute('class') != 'contact-item' && i < 10) {
            target = target.parentNode;
            i++;
        }
        app.router.load('dailyForm', { id: target.getAttribute('data-id') });
    }

    function showAll() {
        state.isFavorite = false;
        var contacts = loadContacts();
        ListView.reRender({ model: contacts, header: "Contacts" });
    }

    function showFavorites() {
        state.isFavorite = true;
        var contacts = loadContacts({ isFavorite: true });
        ListView.reRender({ model: contacts, header: "Favorites" });
    }

    function loadContacts(filter) {
        var f7Contacts = localStorage.getItem("f7Contacts");
        var contacts = f7Contacts ? JSON.parse(f7Contacts) : tempInitializeStorage();
        if (filter) {
            contacts = _.filter(contacts, filter);
        }
        contacts.sort(contactSort);
        contacts = _.groupBy(contacts, function (contact) { return contact.firstName.charAt(0); });
        contacts = _.toArray(_.mapValues(contacts, function (value, key) { return { 'letter': key, 'list': value }; }));
        return contacts;
    }

    function tempInitializeStorage() {
        var contacts = [
			new Contact({ "firstName": "Alex", "class": "อนุบาล", "room": "1", "lastName": "Black", "company": "Global Think", "phone": "+380631234561", "email": "ainene@umail.com", "city": "London", isFavorite: true, lat: 13.754595, long: 100.602089 }),
			new Contact({ "firstName": "Kate", "class": "อนุบาล", "room": "1", "lastName": "Shy", "company": "Big Marketing", "phone": "+380631234562", "email": "mimimi@umail.com", "city": "Moscow" }),
			new Contact({ "firstName": "Michael", "class": "อนุบาล", "room": "1", "lastName": "Fold", "company": "1+1", "email": "slevoc@umail.com", "city": "Kiev", isFavorite: true }),
			new Contact({ "firstName": "Ann", "class": "อนุบาล", "room": "2", "lastName": "Ryder", "company": "95 Style", "email": "ryder@umail.com", "city": "Kiev" }),
			new Contact({ "firstName": "Andrew", "class": "อนุบาล", "room": "2", "lastName": "Smith", "company": "Cycle", "phone": "+380631234567", "email": "drakula@umail.com", "city": "Kiev", lat: 14.724015, long: 100.559236 }),
			new Contact({ "firstName": "Olga", "class": "อนุบาล", "room": "3", "lastName": "Blare", "company": "Finance Time", "phone": "+380631234566", "email": "olga@umail.com", "city": "Kiev" }),
			new Contact({ "firstName": "Svetlana", "class": "อนุบาล", "room": "3", "lastName": "Kot", "company": "Global Think", "phone": "+380631234567", "email": "kot@umail.com", "city": "Odessa" }),
			new Contact({ "firstName": "Kate", "class": "อนุบาล", "room": "3", "lastName": "Lebedeva", "company": "Samsung", "phone": "+380631234568", "email": "kate@umail.com", "city": "Kiev" }),
			new Contact({ "firstName": "Oleg", "class": "มัธยมต้น", "room": "2", "lastName": "Price", "company": "Unilever", "phone": "+380631234568", "email": "uni@umail.com", "city": "Praha", isFavorite: true }),
			new Contact({ "firstName": "Ivan", "class": "มัธยมต้น", "room": "2", "lastName": "Ivanov", "company": "KGB", "phone": "+380631234570", "email": "agent@umail.com", "city": "Moscow" }),
			new Contact({ "firstName": "Nadya", "class": "มัธยมต้น", "room": "2", "lastName": "Lovin", "company": "Global Think", "phone": "+380631234567", "email": "kot@umail.com", "city": "Odessa" }),
			new Contact({ "firstName": "Alex", "class": "มัธยมต้น", "room": "2", "lastName": "Proti", "company": "Samsung", "phone": "+380631234568", "email": "kate@umail.com", "city": "Kiev", lat: 15.719688, long: 100.600481 }),
			new Contact({ "firstName": "Oleg", "class": "มัธยมต้น", "room": "1", "lastName": "Ryzhkov", "company": "Unilever", "phone": "+380631234568", "email": "uni@umail.com", "city": "Praha", isFavorite: true }),
			new Contact({ "firstName": "Daniel", "class": "มัธยมต้น", "room": "1", "lastName": "Ricci", "company": "Finni", "phone": "+380631234570", "email": "agent@umail.com", "city": "Milan" })
        ];
        localStorage.setItem("f7Contacts", JSON.stringify(contacts));
        return JSON.parse(localStorage.getItem("f7Contacts"));
    }

    function templateInitializeStorage() {
        var templates = [
        {
            id: '001', name: 'แบบฟอร์มที่ 1', content: '',
            data: [
                {
                    sectionId: 1, sectionName: 'ด้านที่ 1',
                    data: [
                        {
                            qText: 'การดื่มนม', qId: '01', qNo: 1,
                            answer: [
                                { aText: 'ปฏิบัติได้ดีโดยไม่ต้องตักเตือน', aValue: '3', checked: true },
                                { aText: 'มีการตักเตือนในบางครั้ง', aValue: '2' },
                                { aText: 'ยังปฏิบัติด้วยตนเองไม่ได้', aValue: '1' }
                            ]
                        },
                        {
                            qText: 'การรับประทานอาหาร', qId: '02', qNo: 2,
                            answer: [
                                { aText: 'ปฏิบัติได้ดีโดยไม่ต้องตักเตือน', aValue: '3', checked: true },
                                { aText: 'มีการตักเตือนในบางครั้ง', aValue: '2' },
                                { aText: 'ยังปฏิบัติด้วยตนเองไม่ได้', aValue: '1' }
                            ]
                        }
                    ]
                },
                {
                    sectionId: 2, sectionName: 'ด้านที่ 2',
                    data: [
                        {
                            qText: 'การนอน', qId: '03', qNo: 1,
                            answer: [
                                { aText: 'ปฏิบัติได้ดีโดยไม่ต้องตักเตือน', aValue: '3', checked: true },
                                { aText: 'มีการตักเตือนในบางครั้ง', aValue: '2' },
                                { aText: 'ยังปฏิบัติด้วยตนเองไม่ได้', aValue: '1' }
                            ]
                        }
                    ]
                }
            ], selected: true
        },
        { id: '002', name: 'แบบฟอร์มที่ 2', content: '', data: [] }
        ];
        for (var i = 0; i < templates.length; i++) {            
            templates[i].content = generateContent(templates[i].data);
        }
        localStorage.setItem("templates", JSON.stringify(templates));
    }

    function generateContent(data) {
        var text = '';
        for (var i = 0; i < data.length; i++) {
            text += data[i].sectionName + ' ';
            
            for (var j = 0; j < data[i].data.length && j < 3; j++) {
                text += data[i].data[j].qText + '...';
            }
            if (i < data.length - 1) {
                text += '<br>';
            }
        }
        if (text.length == 0) {
            text = '...ไม่พบข้อมูลแบบฟอร์ม...';
        }
        return text;
    }

    function contactSort(a, b) {
        if (a.firstName > b.firstName) {
            return 1;
        }
        if (a.firstName === b.firstName && a.lastName >= b.lastName) {
            return 1;
        }
        return -1;
    }

    return {
        init: init
    };
});