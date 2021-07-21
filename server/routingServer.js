import {
    fileURLToPath
} from 'url';
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
import path from 'path';

const startRouting = (app) => {
    app.get('/', function (req, res) {
        let target;
        if (req.cookies.loginedadmin === 'true') {
            target = '/admin';
        } else if (req.cookies.loginedworker === 'true') {
            target = '/pracownik';
        } else {
            target = '/login';
        }
        res.redirect(target);
    });

    app.get('/login', function (req, res) {
        res.sendFile(path.join(__dirname, "../public/html/login.html"));
    });

    app.get('/changepassword=pracownik', function (req, res) {
        if (req.cookies.loginedworker === 'true') {
            return res.sendFile(path.join(__dirname, "../public/html/changepassword.html"));
        } else {
            return res.redirect('/login');
        }
    });

    app.get('/changepassword=admin', function (req, res) {
        if (req.cookies.loginedadmin === 'true') {
            return res.sendFile(path.join(__dirname, "../public/html/changepassword.html"));
        } else {
            return res.redirect('/login');
        }
    });

    app.get('/admin', function (req, res) {
        let target;
        if (req.cookies.loginedadmin === 'true') {
            return res.sendFile(path.join(__dirname, "../public/html/index.html"));
        }
        if (req.cookies.loginedworker === 'true') {
            target = '/pracownik';
        } else {
            target = '/login';
        }
        res.redirect(target);
    });

    app.get('/admin/day/:day', function (req, res) {
        let target;
        if (req.cookies.loginedadmin === 'true') {
            return res.sendFile(path.join(__dirname, "../public/html/day.html"));
        }
        if (req.cookies.loginedworker === 'true') {
            target = '/pracownik/day';
        } else {
            target = '/login';
        }
        res.redirect(target);
    });

    app.get('/pracownik', function (req, res) {
        let target;
        if (req.cookies.loginedworker === 'true') {
            return res.sendFile(path.join(__dirname, "../public/html/index.html"));
        } else if (req.cookies.loginedadmin === 'true') {
            target = '/admin';
        } else {
            target = '/login';
        }
        res.redirect(target);
    });

    app.get('/pracownik/day/:day', function (req, res) {
        let target;
        if (req.cookies.loginedworker === 'true') {
            return res.sendFile(path.join(__dirname, "../public/html/pracownikday.html"));
        }
        if (req.cookies.loginedadmin === 'true') {
            target = '/admin/day';
        } else {
            target = '/login';
        }
        res.redirect(target);
    });

    app.get('/admin/manage', function (req, res) {
        if (req.cookies.loginedadmin === 'true') {
            return res.sendFile(path.join(__dirname, "../public/html/manage.html"));
        } else {
            return res.sendFile(path.join(__dirname, "../public/html/404.html"));
        }
    });
}

const startRoutingFor404Error = (app) => {
    app.get('*', function (req, res) {
        return res.sendFile(path.join(__dirname, "../public/html/404.html"));
    })
}

export {
    startRouting,
    startRoutingFor404Error
}