const { engine } = require('express-handlebars');
const path = require('path');
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const morgan = require('morgan');
const SortMiddleware = require('./app/middlewares/SortMiddleware');
require('dotenv').config()

const route = require('./routes');
const db = require('./config/db');

app.use(morgan('combined'));
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.engine('.hbs', engine({ extname: '.hbs', 
    helpers: 
        {
            increaseIndex: (a) => a + 1,
            sortable: (field, sort) => {
                const curSortType = field === sort.column ? sort.type : 'default';
                const icons = {
                    default: 'bi bi-filter',
                    desc: 'bi bi-sort-down',
                    asc: 'bi bi-sort-down-alt'
                }
                const types = {
                    default: 'desc',
                    desc: 'asc',
                    asc: 'desc'
                }
                const icon = icons[curSortType];
                const type = types[curSortType];
                return `<a href="?_sort&column=${field}&type=${type}">
                            <i class='${icon}'></i>
                        </a>`
            } 
        }
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//Custom Middleware
app.use(SortMiddleware);
// Connect to DB
db.connect();
// Route 
route(app);

app.listen(process.env.PORT, () => {
    console.log(`App listening`);
});
