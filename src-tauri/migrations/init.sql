CREATE TABLE task (
    id INTEGER PRIMARY KEY autoincrement
    , title varchar(100)
    , description text
    , deadline date
    , status integer default 0
);