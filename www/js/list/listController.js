define(["app", "js/contactModel", "js/list/listView"], function (app, Contact, ListView) {

    var menus = [
        { id: 'menu01', text: 'หน้าแรก', value: '0' },
        { id: 'menu02', text: 'อนุบาล 1', value: '1' },
        { id: 'menu03', text: 'อนุบาล 2', value: '2' },
        { id: 'menu04', text: 'อนุบาล 3', value: '3' },
        { id: 'menu05', text: 'อนุบาล 4', value: '4' },
        { id: 'menu06', text: 'ตั้งค่าแบบฟอร์ม', value: '5' },
        { id: 'menu07', text: 'ออกจากระบบ', value: '6' }
    ];

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
        for (var i = 0; i < menus.length; i++) {
            var obj = {
                element: '#' + menus[i].id,
                event: 'click',
                handler: menuClick
            };
            bindings.push(obj);
        }
        ListView.render({
            bindings: bindings,
            model: contacts,
            menu: menus,
            header: getHeaderName('menu02')
        });
    }

    function getHeaderName(id) {
        for (var i = 0; i < menus.length; i++) {
            if (menus[i].id == id) {
                return 'รายชื่อนักเรียน ' + menus[i].text;
            }
        }
    }

    function menuClick(e) {
        var target = e.target.parentNode.parentNode;
        var value = target.getAttribute('value');
        if (value) {
            if (value == menus.length - 1) { // logout
                // clear user data and back to login screen
                // ***
                ////////////////////
                app.f7.loginScreen();
            }
            else if (value == menus.length - 2) { // formEdit
                app.router.load('formTemplate');
            }
            else { // room
                var contacts = loadContacts();
                ListView.reRender({ model: contacts, header: getHeaderName(target.getAttribute('id')) });
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
			new Contact({ "firstName": "Alex", "lastName": "Black", "company": "Global Think", "phone": "+380631234561", "email": "ainene@umail.com", "city": "London", isFavorite: true }),
			new Contact({ "firstName": "Kate", "lastName": "Shy", "company": "Big Marketing", "phone": "+380631234562", "email": "mimimi@umail.com", "city": "Moscow" }),
			new Contact({ "firstName": "Michael", "lastName": "Fold", "company": "1+1", "email": "slevoc@umail.com", "city": "Kiev", isFavorite: true }),
			new Contact({ "firstName": "Ann", "lastName": "Ryder", "company": "95 Style", "email": "ryder@umail.com", "city": "Kiev" }),
			new Contact({ "firstName": "Andrew", "lastName": "Smith", "company": "Cycle", "phone": "+380631234567", "email": "drakula@umail.com", "city": "Kiev" }),
			new Contact({ "firstName": "Olga", "lastName": "Blare", "company": "Finance Time", "phone": "+380631234566", "email": "olga@umail.com", "city": "Kiev" }),
			new Contact({ "firstName": "Svetlana", "lastName": "Kot", "company": "Global Think", "phone": "+380631234567", "email": "kot@umail.com", "city": "Odessa" }),
			new Contact({ "firstName": "Kate", "lastName": "Lebedeva", "company": "Samsung", "phone": "+380631234568", "email": "kate@umail.com", "city": "Kiev" }),
			new Contact({ "firstName": "Oleg", "lastName": "Price", "company": "Unilever", "phone": "+380631234568", "email": "uni@umail.com", "city": "Praha", isFavorite: true }),
			new Contact({ "firstName": "Ivan", "lastName": "Ivanov", "company": "KGB", "phone": "+380631234570", "email": "agent@umail.com", "city": "Moscow" }),
			new Contact({ "firstName": "Nadya", "lastName": "Lovin", "company": "Global Think", "phone": "+380631234567", "email": "kot@umail.com", "city": "Odessa" }),
			new Contact({ "firstName": "Alex", "lastName": "Proti", "company": "Samsung", "phone": "+380631234568", "email": "kate@umail.com", "city": "Kiev" }),
			new Contact({ "firstName": "Oleg", "lastName": "Ryzhkov", "company": "Unilever", "phone": "+380631234568", "email": "uni@umail.com", "city": "Praha", isFavorite: true }),
			new Contact({ "firstName": "Daniel", "lastName": "Ricci", "company": "Finni", "phone": "+380631234570", "email": "agent@umail.com", "city": "Milan" })
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
        { id: '002', name: 'แบบฟอร์มที่ 2', content: '', data: [] },
        { id: '003', name: 'แบบฟอร์มที่ 3', content: '', data: [] }
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