CREATE TABLE category (
    id INTEGER PRIMARY KEY autoincrement
    , name varchar(100)
);

CREATE TABLE task_category (
    task_id integer
    , category_id integer
    , foreign key (task_id) references task(id)
    , foreign key (category_id) references category(id)
);

